import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Leaf, ShoppingBag } from "lucide-react";
import { CheckoutView, Confirmation, bill, initialItems } from "@/features/hotel-a/HotelAApp";
import { clearCart, useCart } from "@/features/hotel-a/cartStore";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/hotel-a/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Hotel Λalayaa | Pure Vegetarian Takeaway" },
      { name: "description", content: "Choose your payment method and pay for your Hotel Λalayaa vegetarian order — Online Pay, Card or Net Banking." },
      { property: "og:title", content: "Checkout — Hotel Λalayaa" },
      { property: "og:description", content: "Pay for your vegetarian order and pick it up at Hotel Λalayaa in 15–20 minutes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const [paid, setPaid] = useState(false);
  const [payment, setPayment] = useState("Online Pay");
  const cart = useCart();
  const lines = initialItems
    .filter((i) => cart[i.id])
    .map((i) => ({ ...i, qty: cart[i.id] ?? 0 }));
  const subtotal = lines.reduce((s, i) => s + i.price * i.qty, 0);
  const goMenu = () => navigate({ to: "/hotel-a" });

  if (!lines.length) {
    return (
      <div className="min-h-screen bg-muted">
        <header className="border-b bg-card">
          <div className="mx-auto flex h-18 max-w-3xl items-center gap-3 px-4">
            <Button variant="ghost" size="icon" aria-label="Go back" onClick={goMenu}>
              <ArrowLeft />
            </Button>
            <div>
              <p className="font-display text-xl font-bold">Checkout</p>
              <p className="text-xs text-muted-foreground">Hotel Λalayaa • Pure vegetarian</p>
            </div>
          </div>
        </header>
        <div className="grid min-h-[calc(100vh-4.5rem)] place-items-center px-4">
          <div className="w-full max-w-md rounded-card border bg-card p-10 text-center shadow-soft">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary-soft text-primary">
              <ShoppingBag className="size-8" />
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold">Nothing to pay yet</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Your cart is empty. Add a few vegetarian favourites first, then come back to pay.
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase text-veg">
              <Leaf className="size-3.5" /> 100% vegetarian kitchen
            </p>
            <Button size="xl" className="mt-6 w-full" asChild>
              <Link to="/hotel-a">Browse the vegetarian menu</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (paid) {
    return (
      <Confirmation
        lines={lines}
        total={bill(subtotal).total}
        payment={payment}
        onDone={() => {
          clearCart();
          goMenu();
        }}
      />
    );
  }

  return (
    <CheckoutView
      lines={lines}
      subtotal={subtotal}
      payment={payment}
      setPayment={setPayment}
      onBack={() => navigate({ to: "/hotel-a/cart" })}
      onPay={() => setPaid(true)}
    />
  );
}
