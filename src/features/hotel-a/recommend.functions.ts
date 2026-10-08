import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  craving: z.string().trim().min(2).max(300),
  menu: z.array(z.object({ id: z.number(), name: z.string().max(80), category: z.string().max(40), description: z.string().max(200), price: z.number() })).max(80),
});

export type Recommendation = { id: number; reason: string };

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["picks"],
  properties: {
    picks: {
      type: "array",
      items: { type: "object", additionalProperties: false, required: ["id", "reason"], properties: { id: { type: "integer" }, reason: { type: "string" } } },
    },
  },
};

export const recommendDishes = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<{ picks: Recommendation[]; error?: string }> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { picks: [], error: "Recommendations are not configured yet." };
    const menuText = data.menu.map(m => `${m.id} | ${m.name} | ${m.category} | ₹${m.price} | ${m.description}`).join("\n");
    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        store: false,
        reasoning: { effort: "low", summary: "auto" },
        include: ["reasoning.encrypted_content"],
        instructions: "You are a friendly server at Hotel Λalayaa, a pure vegetarian restaurant. Recommend 2 to 4 dishes ONLY from the given menu (use their ids) that match the diner's craving. Never suggest anything non-vegetarian or off-menu. Each reason: one short, warm sentence (max 18 words).",
        input: `Menu (id | name | category | price | description):\n${menuText}\n\nDiner says: ${data.craving}`,
        text: { format: { type: "json_schema", name: "recommendations", strict: true, schema } },
      }),
    });
    if (!res.ok || !res.body) {
      const msg = res.status === 429 ? "Too many requests right now — please try again in a moment." : res.status === 402 ? "AI credits have run out for this workspace." : "Couldn't get recommendations right now.";
      return { picks: [], error: msg };
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "", text = "", refused = false;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const ev = JSON.parse(payload);
          if (ev.type === "response.output_text.delta") text += ev.delta;
          if (ev.type === "response.refusal.delta") refused = true;
        } catch { /* partial */ }
      }
    }
    if (refused || !text) return { picks: [], error: "No suggestions this time — try describing it differently." };
    try {
      const ids = new Set(data.menu.map(m => m.id));
      const picks = (JSON.parse(text).picks as Recommendation[]).filter(p => ids.has(p.id)).slice(0, 4);
      return { picks };
    } catch {
      return { picks: [], error: "Couldn't read the suggestions. Please try again." };
    }
  });
