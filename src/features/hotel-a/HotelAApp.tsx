import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft, BarChart3, Check, ChevronRight, Clock3, Coffee, CreditCard,
  History, IceCreamBowl, LayoutDashboard, Leaf, MapPin, Menu as MenuIcon,
  Minus, Plus, QrCode, Search, Settings, ShoppingBag, SlidersHorizontal,
  Sparkles, Store, Trash2, Utensils, WalletCards, X,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { clearCart, updateCart, useCart } from "./cartStore";
import { recommendDishes, type Recommendation } from "./recommend.functions";

function CravingAssistant({ items, cart, update }: { items: Item[]; cart: Record<number, number>; update: (id: number, d: number) => void }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [picks, setPicks] = useState<Recommendation[]>([]);
  const [error, setError] = useState("");
  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length < 2 || loading) return;
    setLoading(true); setError(""); setPicks([]);
    try {
      const menu = items.filter(i => i.available).map(({ id, name, category, description, price }) => ({ id, name, category, description, price }));
      const r = await recommendDishes({ data: { craving: text, menu } });
      if (r.error) setError(r.error); else setPicks(r.picks);
    } catch { setError("Couldn't get suggestions right now. Please try again."); }
    finally { setLoading(false); }
  }
  return <section className="mt-5 rounded-card border bg-primary-soft p-4 lg:mt-6 lg:p-5">
    <div className="flex items-center gap-2"><Sparkles className="size-4 text-primary" /><h2 className="font-display text-lg font-bold">What do you feel like eating?</h2></div>
    <p className="mt-1 text-xs text-muted-foreground">Tell us your mood — "something spicy and filling", "light snack with tea" — and we'll suggest dishes.</p>
    <form onSubmit={ask} className="mt-3 flex gap-2">
      <Input aria-label="Describe your craving" value={text} onChange={e => setText(e.target.value)} maxLength={300} placeholder="e.g. spicy, crispy, under ₹150" className="h-11 rounded-full bg-card text-sm" />
      <Button type="submit" className="h-11 rounded-full px-5" disabled={loading || text.trim().length < 2}>{loading ? "Thinking…" : "Suggest"}</Button>
    </form>
    {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    {picks.length > 0 && <ul className="mt-4 grid gap-2 sm:grid-cols-2">{picks.map(p => { const it = items.find(i => i.id === p.id); if (!it) return null; const q = cart[it.id] ?? 0; return <li key={p.id} className="flex items-center gap-3 rounded-xl bg-card p-2.5 shadow-soft">
      <img src={it.image} alt={it.name} className="size-14 shrink-0 rounded-lg object-cover" width={56} height={56} />
      <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><VegMark label={false} /><p className="truncate text-sm font-bold">{it.name}</p><span className="ml-auto text-sm font-bold text-primary">{money(it.price)}</span></div><p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{p.reason}</p></div>
      {q > 0 ? <div className="flex items-center gap-1"><Button size="icon" variant="outline" className="size-7" aria-label={`Remove ${it.name}`} onClick={() => update(it.id, -1)}><Minus /></Button><span className="w-4 text-center text-sm font-bold">{q}</span><Button size="icon" className="size-7" aria-label={`Add ${it.name}`} onClick={() => update(it.id, 1)}><Plus /></Button></div> : <Button size="sm" className="rounded-full" aria-label={`Add ${it.name}`} onClick={() => update(it.id, 1)}>ADD</Button>}
    </li>; })}</ul>}
  </section>;
}
import heroImage from "@/assets/hotel-a-hero.jpg";
import startersImage from "@/assets/hotel-a-starters.jpg";
import mainsImage from "@/assets/hotel-a-mains.jpg";
import treatsImage from "@/assets/hotel-a-treats.jpg";

type Category = "Starters" | "Main Course" | "Snacks" | "Beverages" | "Desserts" | "Ice Creams";
type Item = { id: number; name: string; price: number; category: Category; description: string; image: string; available: boolean; popular: boolean | undefined };
type Screen = "menu" | "cart" | "checkout" | "confirmed" | "staff";

const categories: (Category | "All")[] = ["All", "Starters", "Main Course", "Snacks", "Beverages", "Desserts", "Ice Creams"];
const rows: [string, number, Category, string, boolean?][] = [
  ["Gobi 65",130,"Starters","Crispy cauliflower tossed with curry leaves and house spices",true],
  ["Paneer 65",150,"Starters","Crisp cottage cheese with chilli, garlic and curry leaves",true],
  ["Gobi Manchurian",140,"Starters","Golden cauliflower in a tangy Indo-Chinese glaze"],
  ["Paneer Manchurian",160,"Starters","Paneer, peppers and spring onion in savoury sauce"],
  ["Vegetable Spring Roll",120,"Starters","Crisp rolls packed with seasoned garden vegetables"],
  ["Veg Biryani",140,"Main Course","Fragrant basmati rice, vegetables, mint and warm spices",true],
  ["Paneer Fried Rice",150,"Main Course","Wok-tossed rice with paneer, vegetables and aromatics"],
  ["Veg Fried Rice",130,"Main Course","Classic wok-tossed rice with fresh vegetables"],
  ["Veg Noodles",130,"Main Course","Hakka noodles tossed with crunchy vegetables"],
  ["Paneer Butter Masala",170,"Main Course","Paneer in a silky tomato, butter and cashew gravy",true],
  ["Mixed Vegetable Curry",140,"Main Course","Seasonal vegetables simmered in a homestyle curry"],
  ["Chapati",30,"Main Course","Soft whole-wheat flatbread, freshly griddled"],
  ["Parotta",40,"Main Course","Flaky, layered South Indian flatbread"],
  ["Veg Meals",150,"Main Course","Rice, sambar, rasam, vegetables, curd and accompaniments",true],
  ["Samosa",30,"Snacks","Crisp pastry filled with spiced potato and peas"],
  ["Vada",25,"Snacks","Crisp lentil doughnut with a soft, savoury centre"],
  ["Masala Vada",30,"Snacks","Crunchy chana dal fritter with herbs and spices"],
  ["Bajji",30,"Snacks","Vegetable fritters in a lightly spiced gram-flour batter"],
  ["Paneer Sandwich",100,"Snacks","Grilled sandwich with spiced paneer and vegetables"],
  ["French Fries",100,"Snacks","Golden, crisp potato fries with house seasoning"],
  ["Tea",20,"Beverages","Freshly brewed milk tea"], ["Coffee",30,"Beverages","Strong South Indian filter coffee",true],
  ["Masala Tea",30,"Beverages","Milk tea brewed with warming whole spices"],
  ["Fresh Lime Juice",50,"Beverages","Fresh lime, chilled water and a hint of sweetness",true],
  ["Fresh Lime Soda",50,"Beverages","Zesty fresh lime topped with sparkling soda"],
  ["Rose Milk",60,"Beverages","Chilled, fragrant rose-infused milk"],
  ["Badam Milk",70,"Beverages","Creamy almond milk with saffron and cardamom"],
  ["Soft Drink",40,"Beverages","Chilled carbonated soft drink"],
  ["Gulab Jamun",60,"Desserts","Soft milk dumplings steeped in cardamom syrup",true],
  ["Rasmalai",80,"Desserts","Cottage cheese patties in saffron milk"],
  ["Carrot Halwa",70,"Desserts","Slow-cooked carrot, milk, ghee and nuts"],
  ["Brownie",100,"Desserts","Rich chocolate brownie with a fudgy centre"],
  ["Vanilla",80,"Ice Creams","Classic creamy vanilla ice cream"],
  ["Chocolate",90,"Ice Creams","Deep, smooth chocolate ice cream"],
  ["Strawberry",90,"Ice Creams","Creamy strawberry ice cream"],
  ["Butterscotch",100,"Ice Creams","Caramel ice cream with crunchy praline"],
  ["Pista",100,"Ice Creams","Pistachio ice cream finished with chopped nuts",true],
];
const categoryImage = (cat: Category) => cat === "Starters" || cat === "Snacks" ? startersImage : cat === "Main Course" ? mainsImage : treatsImage;
export const initialItems: Item[] = rows.map(([name, price, category, description, popular], id) => ({ id, name, price, category, description, image: categoryImage(category), available: id !== 3, popular }));
export const money = (n: number) => `₹${n}`;

function VegMark({ label = true }: { label?: boolean }) {
  return <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-veg"><span className="grid size-4 place-items-center border-2 border-veg"><span className="size-2 rounded-full bg-veg" /></span>{label && "Pure veg"}</span>;
}

export function HotelAApp() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [items, setItems] = useState(initialItems);
  const cart = useCart();
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const [payment, setPayment] = useState("Online Pay");
  const [staffTab, setStaffTab] = useState("Dashboard");
  const [adding, setAdding] = useState(false);
  const filtered = items.filter(i => (category === "All" || i.category === category) && i.name.toLowerCase().includes(query.toLowerCase()));
  const cartLines = items.filter(i => cart[i.id]).map(i => ({...i, qty: cart[i.id] ?? 0}));
  const count = cartLines.reduce((s, i) => s + i.qty, 0);
  const subtotal = cartLines.reduce((s, i) => s + i.price * i.qty, 0);
  const update = updateCart;
  const goMenu = () => { setScreen("menu"); window.scrollTo({top:0, behavior:"smooth"}); };

  if (screen === "staff") return <StaffView items={items} setItems={setItems} tab={staffTab} setTab={setStaffTab} adding={adding} setAdding={setAdding} onCustomer={goMenu} />;
  if (screen === "cart") return <CartView lines={cartLines} subtotal={subtotal} update={update} onBack={goMenu} onCheckout={() => setScreen("checkout")} />;
  if (screen === "checkout") return <CheckoutView lines={cartLines} subtotal={subtotal} payment={payment} setPayment={setPayment} onBack={() => setScreen("cart")} onPay={() => setScreen("confirmed")} />;
  if (screen === "confirmed") return <Confirmation lines={cartLines} total={bill(subtotal).total} payment={payment} onDone={() => {clearCart(); goMenu();}} />;

  return <div className="min-h-screen bg-background pb-28">
    <header className="absolute inset-x-0 top-0 z-20 text-hero-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <div className="flex items-center gap-3"><span className="mb-4 w-fit"> <img src="/la-logo1.jpeg" alt="Hotel Λalayaa" className="w-20 h-20 rounded-full object-contain"/></span><div><p className="font-display text-3xl font-bold leading-none">Hotel<span className="text-green-600"> Λalayaa</span></p><VegMark /></div></div>
        <div className="flex items-center gap-2">
          <Button variant="heroGhost" size="sm" asChild aria-label={`View cart, ${count} ${count === 1 ? "item" : "items"}`}>
            <Link to="/hotel-a/cart" className="relative">
              <ShoppingBag />
              Cart
              {count > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{count > 9 ? "9+" : count}</span>}
            </Link>
          </Button>
          <Button variant="heroGhost" size="sm" onClick={() => setScreen("staff")}><Store /> Staff</Button>
        </div>
      </div>
    </header>
    <section className="relative min-h-screen overflow-hidden bg-forest text-hero-foreground lg:min-h-screen">
      <img src={heroImage} width={1536} height={1024} alt="Hotel Λalayaa vegetarian biryani, paneer curry and chapati" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-5 pb-6 pt-20 lg:min-h-screen lg:px-8 lg:pb-10">
        <span className="mb-3 w-fit rounded-full border border-hero-foreground/40 bg-forest/40 px-2.5 py-1 text-[11px] font-bold uppercase backdrop-blur">Freshly prepared • Pickup only</span>
        <h1 className="max-w-2xl font-display text-3xl font-bold leading-[1.02] sm:text-4xl lg:text-5xl">Fresh vegetarian food.</h1>
        <p className="mt-3 max-w-lg text-sm text-hero-foreground/85 lg:text-base">Order direct. Pick up. Made with familiar flavours and honest ingredients at Hotel Λalayaa.</p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold lg:text-sm"><span className="flex items-center gap-2"><Clock3 className="size-4 text-primary" /> 15–20 min</span><span className="flex items-center gap-2"><MapPin className="size-4 text-primary" /> Collect at counter</span></div>
      </div>
    </section>
    <main className="mx-auto max-w-7xl px-4 py-5 lg:px-8 lg:py-7">
      <div className="sticky top-0 z-10 -mx-4 bg-background/95 px-4 py-3 backdrop-blur lg:static lg:mx-0 lg:bg-transparent lg:px-0 lg:py-0">
        <div className="relative"><Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search food" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search for biryani, paneer, coffee…" className="h-12 rounded-full bg-card pl-11 text-sm shadow-soft" /></div>
        <div className="scrollbar-none mt-3 flex gap-2 overflow-x-auto pb-1">{categories.map(c => <Button key={c} size="sm" variant={category === c ? "default" : "outline"} className="rounded-full" onClick={() => setCategory(c)}>{c}</Button>)}</div>
      </div>
      {category === "All" && !query && <section className="mt-6"><SectionHead eyebrow="Most loved" title="Popular vegetarian picks" /><div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">{items.filter(i => i.popular).slice(0,4).map(i => <FoodCard key={i.id} item={i} qty={cart[i.id] ?? 0} update={update} compact />)}</div></section>}
      <section className="mt-8"><SectionHead eyebrow="Our menu" title={category === "All" ? "Something for every craving" : category} count={filtered.length} />
        {filtered.length ? <div className="space-y-7">{categories.filter(c => c !== "All").map(c => { const list = filtered.filter(i => i.category === c); if (!list.length) return null; return <div key={c}><div className="mb-3 flex items-center justify-between"><h3 className="font-display text-xl font-bold">{c}</h3><span className="text-xs text-muted-foreground">{list.length} dishes</span></div><div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">{list.map(i => <FoodCard key={i.id} item={i} qty={cart[i.id] ?? 0} update={update} compact />)}</div></div>; })}</div> : <div className="py-20 text-center"><Search className="mx-auto size-8 text-muted-foreground"/><p className="mt-3 font-semibold">No dishes found</p><p className="text-sm text-muted-foreground">Try another search or category.</p></div>}
      </section>
    </main>
    {count > 0 && <div className="fixed inset-x-0 bottom-0 z-40 p-3"><Button size="xl" className="mx-auto flex w-full max-w-xl justify-between rounded-xl shadow-floating" asChild><Link to="/hotel-a/cart"><span><b>{count} {count === 1 ? "item" : "items"}</b><span className="mx-2 opacity-50">•</span>{money(subtotal)}</span><span className="flex items-center gap-2">View cart <ChevronRight /></span></Link></Button></div>}
  </div>;
}

function SectionHead({eyebrow,title,count}:{eyebrow:string;title:string;count?:number}) { return <div className="mb-4 flex items-end justify-between"><div><p className="mb-1 text-xs font-bold uppercase text-primary">{eyebrow}</p><h2 className="font-display text-2xl font-bold">{title}</h2></div>{count !== undefined && <span className="text-sm text-muted-foreground">{count} items</span>}</div> }
function FoodCard({item,qty,update,compact=false}:{item:Item;qty:number;update:(id:number,d:number)=>void;compact?:boolean}) { return <article className={cn("group overflow-hidden rounded-card border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-card", compact && "min-w-0")}>
  <div className={cn("relative overflow-hidden",compact?"aspect-[1.15]":"aspect-[1.25]")}><img src={item.image} alt={item.name} width={1024} height={1024} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105"/><div className="absolute left-3 top-3 rounded-full bg-card/95 px-2.5 py-1 backdrop-blur"><VegMark label={false}/></div>{!item.available && <div className="absolute inset-0 grid place-items-center bg-foreground/55"><span className="rounded-full bg-card px-3 py-1.5 text-xs font-bold text-foreground">Unavailable</span></div>}</div>
  <div className={cn("p-4",compact&&"p-3")}><div className="flex items-start justify-between gap-3"><h3 className={cn("font-display font-bold",compact?"text-base":"text-xl")}>{item.name}</h3><span className="font-bold text-primary">{money(item.price)}</span></div>{!compact&&<p className="mt-2 min-h-10 text-sm leading-relaxed text-muted-foreground">{item.description}</p>}<div className="mt-4 flex items-center justify-between"><span className="text-xs font-semibold text-veg">{item.available?"Available now":"Back soon"}</span>{qty > 0 ? <div className="flex h-9 items-center rounded-md border border-primary bg-primary-soft"><Button aria-label={`Remove one ${item.name}`} size="iconSm" variant="ghost" onClick={() => update(item.id,-1)}><Minus/></Button><span className="w-7 text-center text-sm font-bold">{qty}</span><Button aria-label={`Add one ${item.name}`} size="iconSm" variant="ghost" onClick={() => update(item.id,1)}><Plus/></Button></div> : <Button size="sm" disabled={!item.available} onClick={() => update(item.id,1)}>ADD <Plus/></Button>}</div></div>
</article> }

function PageTop({title,onBack}:{title:string;onBack:()=>void}) { return <header className="border-b bg-card"><div className="mx-auto flex h-18 max-w-3xl items-center gap-3 px-4"><Button variant="ghost" size="icon" aria-label="Go back" onClick={onBack}><ArrowLeft/></Button><div><p className="font-display text-xl font-bold">{title}</p><p className="text-xs text-muted-foreground">Hotel Λalayaa • Pure vegetarian</p></div></div></header> }
export function bill(subtotal:number){ const rate = subtotal>300?20:subtotal>200?10:0; const discount = Math.round(subtotal*rate/100); const parcel = subtotal>0?10:0; const tax = Math.round((subtotal-discount)*0.05); return { rate, discount, parcel, tax, total: subtotal-discount+parcel+tax }; }
function DiscountRow({b,subtotal}:{b:ReturnType<typeof bill>;subtotal:number}){ return b.rate ? <p className="flex justify-between text-veg"><span>Discount ({b.rate}% off)</span><b>−{money(b.discount)}</b></p> : <p className="text-xs text-muted-foreground">{subtotal>200?"":`Add ${money(201-subtotal)} more for 10% off • above ₹300 get 20% off`}</p>; }
export function CartView({lines,subtotal,update,onBack,onCheckout}:{lines:(Item&{qty:number})[];subtotal:number;update:(id:number,d:number)=>void;onBack:()=>void;onCheckout:()=>void}) { const b = bill(subtotal); return <div className="min-h-screen bg-muted"><PageTop title="Your cart" onBack={onBack}/><main className="mx-auto max-w-3xl px-4 py-6"><div className="space-y-3">{lines.map(i=><div key={i.id} className="flex gap-4 rounded-card border bg-card p-3 shadow-soft"><img src={i.image} alt="" width={96} height={96} loading="lazy" className="size-24 rounded-md object-cover"/><div className="min-w-0 flex-1"><VegMark label={false}/><h2 className="font-display text-lg font-bold">{i.name}</h2><p className="font-bold text-primary">{money(i.price*i.qty)}</p><div className="mt-2 flex w-fit items-center rounded-md border"><Button variant="ghost" size="iconSm" onClick={()=>update(i.id,-1)}><Minus/></Button><span className="w-8 text-center font-bold">{i.qty}</span><Button variant="ghost" size="iconSm" onClick={()=>update(i.id,1)}><Plus/></Button></div></div><Button variant="ghost" size="icon" aria-label={`Remove ${i.name}`} onClick={()=>update(i.id,-i.qty)}><Trash2/></Button></div>)}</div>
<div className="mt-6 rounded-card border bg-card p-5"><h2 className="font-display text-xl font-bold">Bill details</h2><div className="mt-4 space-y-3 text-sm"><p className="flex justify-between"><span className="text-muted-foreground">Item total</span><b>{money(subtotal)}</b></p><DiscountRow b={b} subtotal={subtotal}/><p className="flex justify-between"><span className="text-muted-foreground">Parcel charge</span><b>{money(b.parcel)}</b></p><p className="flex justify-between"><span className="text-muted-foreground">GST (5%)</span><b>{money(b.tax)}</b></p><div className="border-t pt-3 text-lg"><p className="flex justify-between"><b>Total</b><b>{money(b.total)}</b></p></div></div></div><Button size="xl" className="mt-5 w-full" onClick={onCheckout} disabled={!lines.length}>Proceed to checkout <ChevronRight/></Button></main></div> }
export function CheckoutView({lines,subtotal,payment,setPayment,onBack,onPay}:{lines:(Item&{qty:number})[];subtotal:number;payment:string;setPayment:(p:string)=>void;onBack:()=>void;onPay:()=>void}) { const b = bill(subtotal); const options=[{name:"Online Pay",icon:WalletCards,sub:"UPI • Google Pay, PhonePe, Paytm"},{name:"Card",icon:CreditCard,sub:"Visa, Mastercard, RuPay"},{name:"Net Banking",icon:BarChart3,sub:"All major Indian banks"}]; return <div className="min-h-screen bg-muted"><PageTop title="Checkout" onBack={onBack}/><main className="mx-auto grid max-w-5xl gap-5 px-4 py-6 md:grid-cols-[1.15fr_.85fr]"><section className="rounded-card border bg-card p-5"><h2 className="font-display text-2xl font-bold">Choose payment</h2><div className="mt-5 space-y-3">{options.map(({name,icon:Icon,sub})=><Button key={name} variant="outline" className={cn("h-auto w-full justify-start p-4 text-left",payment===name&&"border-primary bg-primary-soft")} onClick={()=>setPayment(name)}><span className="grid size-10 place-items-center rounded-full bg-secondary"><Icon/></span><span className="flex-1"><b className="block">{name}</b><small className="text-muted-foreground">{sub}</small></span>{payment===name&&<Check className="text-primary"/>}</Button>)}</div></section><aside className="rounded-card border bg-card p-5"><h2 className="font-display text-2xl font-bold">Order summary</h2><div className="mt-4 space-y-3">{lines.map(i=><div key={i.id} className="flex justify-between gap-4 text-sm"><span>{i.name} <b>× {i.qty}</b></span><b>{money(i.price*i.qty)}</b></div>)}</div><div className="mt-5 space-y-2 border-t pt-4 text-sm"><p className="flex justify-between"><span className="text-muted-foreground">Item total</span><b>{money(subtotal)}</b></p><DiscountRow b={b} subtotal={subtotal}/><p className="flex justify-between"><span className="text-muted-foreground">Parcel charge</span><b>{money(b.parcel)}</b></p><p className="flex justify-between"><span className="text-muted-foreground">GST (5%)</span><b>{money(b.tax)}</b></p></div><div className="mt-3 border-t pt-4"><p className="flex justify-between text-lg"><b>Total</b><b>{money(b.total)}</b></p><p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><Clock3 className="size-3"/> Ready in 15–20 minutes</p></div><Button size="xl" className="mt-6 w-full" onClick={onPay}>Pay {money(b.total)} <ChevronRight/></Button><p className="mt-3 text-center text-xs text-muted-foreground">Secure demo checkout • No real charge</p></aside></main></div> }
export function Confirmation({onDone,lines,payment}:{onDone:()=>void;lines:(Item&{qty:number})[];total?:number;payment:string}) { const subtotal=lines.reduce((s,i)=>s+i.price*i.qty,0); const b=bill(subtotal); const total=b.total; const steps=["Order placed","Payment confirmed","Preparing","Ready for pickup","Completed"]; return <div className="min-h-screen bg-forest px-4 py-10 text-hero-foreground"><main className="mx-auto max-w-xl"><div className="text-center"><span className="mx-auto grid size-18 place-items-center rounded-full bg-primary text-primary-foreground shadow-floating"><Check className="size-9"/></span><p className="mt-5 text-xs font-bold uppercase text-primary">Order confirmed</p><h1 className="mt-2 font-display text-4xl font-bold">We’re preparing your food</h1><p className="mt-2 text-hero-foreground/70">Hotel Λalayaa • Fresh vegetarian takeaway</p></div><div className="mt-8 rounded-card bg-card p-6 text-card-foreground shadow-floating"><div className="grid grid-cols-2 gap-4 border-b pb-5 text-center"><div><p className="text-xs uppercase text-muted-foreground">Order ID</p><p className="mt-1 font-display text-2xl font-bold">#HA1234</p></div><div className="border-l"><p className="text-xs uppercase text-muted-foreground">Pickup token</p><p className="mt-1 font-display text-2xl font-bold text-primary">A24</p></div></div><div className="py-5 text-center"><Clock3 className="mx-auto size-5 text-primary"/><p className="mt-2 text-sm text-muted-foreground">Estimated pickup</p><p className="font-display text-xl font-bold">15–20 minutes</p></div><div className="border-t py-5"><p className="text-xs font-bold uppercase text-muted-foreground">Order summary</p><div className="mt-3 space-y-2">{lines.map(i=><div key={i.id} className="flex justify-between gap-4 text-sm"><span>{i.name} <b>× {i.qty}</b></span><b>{money(i.price*i.qty)}</b></div>)}</div><div className="mt-4 space-y-2 border-t pt-3 text-sm"><p className="flex justify-between"><span className="text-muted-foreground">Item total</span><b>{money(subtotal)}</b></p><DiscountRow b={b} subtotal={subtotal}/><p className="flex justify-between"><span className="text-muted-foreground">Parcel charge</span><b>{money(b.parcel)}</b></p><p className="flex justify-between"><span className="text-muted-foreground">GST (5%)</span><b>{money(b.tax)}</b></p></div><div className="mt-3 flex justify-between border-t pt-3 text-lg"><b>Total paid via {payment}</b><b className="text-primary">{money(total)}</b></div></div><div className="border-t pt-5">{steps.map((s,i)=><div key={s} className="flex gap-3 pb-4 last:pb-0"><span className={cn("mt-0.5 grid size-6 place-items-center rounded-full border-2",i<2?"border-veg bg-veg text-hero-foreground":i===2?"border-primary bg-primary text-primary-foreground":"border-border text-muted-foreground")}>{i<2?<Check className="size-3"/>:<span className="size-1.5 rounded-full bg-current"/>}</span><span className={cn("text-sm font-semibold",i>2&&"text-muted-foreground")}>{s}</span></div>)}</div><p className="mt-6 rounded-md bg-secondary p-4 text-center text-sm">Please show your Order ID or Pickup Token at the Hotel Λalayaa counter.</p></div><Button variant="secondary" size="xl" className="mt-5 w-full" onClick={onDone}>Back to menu</Button></main></div> }

const staffNav=["Dashboard","Orders","Menu","Categories","QR Code","Order History","Sales","Settings"];
function StaffView({items,setItems,tab,setTab,adding,setAdding,onCustomer}:{items:Item[];setItems:(v:Item[])=>void;tab:string;setTab:(v:string)=>void;adding:boolean;setAdding:(v:boolean)=>void;onCustomer:()=>void}) { const [draftName,setDraftName]=useState(""); const [draftPrice,setDraftPrice]=useState(""); const [draftCategory,setDraftCategory]=useState<Category>("Starters"); const iconFor=(n:string)=> n==="Dashboard"?LayoutDashboard:n==="Orders"?ShoppingBag:n==="Menu"?Utensils:n==="QR Code"?QrCode:n==="Order History"?History:n==="Sales"?BarChart3:n==="Settings"?Settings:SlidersHorizontal; const add=()=>{if(!draftName||!Number(draftPrice))return;setItems([...items,{id:Date.now(),name:draftName,price:Number(draftPrice),category:draftCategory,description:"Freshly prepared vegetarian favourite",image:categoryImage(draftCategory),available:true,popular:undefined}]);setDraftName("");setDraftPrice("");setAdding(false);setTab("Menu")}; return <div className="min-h-screen bg-admin-bg text-admin-foreground"><header className="border-b border-admin-border bg-admin-sidebar"><div className="flex h-18 items-center justify-between px-4 lg:px-6"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-primary"><Leaf/></span><div><p className="font-display text-lg font-bold">Hotel Λalayaa</p><p className="text-xs text-admin-muted">Staff console</p></div></div><Button variant="adminOutline" onClick={onCustomer}><Store/> Customer menu</Button></div></header><div className="flex"><aside className="hidden min-h-[calc(100vh-72px)] w-60 shrink-0 border-r border-admin-border bg-admin-sidebar p-3 lg:block">{staffNav.map(n=>{const Icon=iconFor(n);return <Button key={n} variant={tab===n?"adminActive":"adminGhost"} className="mb-1 w-full justify-start" onClick={()=>setTab(n)}><Icon/>{n}</Button>})}</aside><main className="min-w-0 flex-1 p-4 lg:p-8"><div className="scrollbar-none mb-6 flex gap-2 overflow-x-auto lg:hidden">{staffNav.map(n=><Button key={n} size="sm" variant={tab===n?"default":"adminOutline"} onClick={()=>setTab(n)}>{n}</Button>)}</div>{tab==="Dashboard"?<Dashboard/>:tab==="Menu"?<MenuManager items={items} setItems={setItems} onAdd={()=>setAdding(true)}/>:tab==="QR Code"?<QrPanel/>:<Placeholder tab={tab}/>}</main></div>{adding&&<div className="fixed inset-0 z-50 grid place-items-center bg-admin-bg/80 p-4"><div className="w-full max-w-md rounded-card border border-admin-border bg-admin-sidebar p-6"><div className="flex items-center justify-between"><h2 className="font-display text-2xl font-bold">Add vegetarian item</h2><Button variant="adminGhost" size="icon" onClick={()=>setAdding(false)}><X/></Button></div><p className="mt-1 text-sm text-admin-muted">Only pure vegetarian items are permitted.</p><div className="mt-5 space-y-4"><Input value={draftName} onChange={e=>setDraftName(e.target.value)} placeholder="Food name" className="border-admin-border bg-admin-bg"/><Input value={draftPrice} onChange={e=>setDraftPrice(e.target.value)} type="number" placeholder="Price in ₹" className="border-admin-border bg-admin-bg"/><select value={draftCategory} onChange={e=>setDraftCategory(e.target.value as Category)} className="h-10 w-full rounded-md border border-admin-border bg-admin-bg px-3 text-sm">{categories.slice(1).map(c=><option key={c}>{c}</option>)}</select><Button className="w-full" onClick={add}>Add to menu</Button></div></div></div>}</div> }
function Dashboard(){const cards=[{l:"Today's orders",v:"48",d:"+12% from yesterday"},{l:"Today's sales",v:"₹12,640",d:"+8.4% from yesterday"},{l:"Pending orders",v:"7",d:"3 currently preparing"},{l:"Completed orders",v:"41",d:"Average 17 min"}];return <><p className="text-sm text-admin-muted">Wednesday, 30 September</p><h1 className="mt-1 font-display text-4xl font-bold">Good morning, Hotel Λalayaa</h1><div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((c,i)=><div key={c.l} className="rounded-card border border-admin-border bg-admin-sidebar p-5"><span className={cn("mb-5 grid size-10 place-items-center rounded-md",i===2?"bg-primary text-primary-foreground":"bg-admin-soft text-primary")}><BarChart3/></span><p className="text-sm text-admin-muted">{c.l}</p><p className="mt-1 font-display text-3xl font-bold">{c.v}</p><p className="mt-2 text-xs text-admin-muted">{c.d}</p></div>)}</div><div className="mt-6 rounded-card border border-admin-border bg-admin-sidebar p-5"><div className="flex items-center justify-between"><h2 className="font-display text-2xl font-bold">Live orders</h2><span className="flex items-center gap-2 text-xs text-veg"><span className="size-2 animate-pulse rounded-full bg-veg"/> Live</span></div><div className="mt-5 space-y-3">{[["A24","#HA1234","3 items","Preparing"],["A23","#HA1233","2 items","Ready"],["A22","#HA1232","5 items","Preparing"]].map(r=><div key={r[0]} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md bg-admin-soft p-4"><span className="font-display text-xl font-bold text-primary">{r[0]}</span><span><b className="block text-sm">{r[1]}</b><small className="text-admin-muted">{r[2]}</small></span><span className="rounded-full border border-admin-border px-3 py-1 text-xs">{r[3]}</span></div>)}</div></div></>}
function MenuManager({items,setItems,onAdd}:{items:Item[];setItems:(v:Item[])=>void;onAdd:()=>void}){return <><div className="flex items-end justify-between"><div><p className="text-sm text-admin-muted">{items.length} pure vegetarian items</p><h1 className="font-display text-4xl font-bold">Menu</h1></div><Button onClick={onAdd}><Plus/> Add food</Button></div><div className="mt-6 overflow-hidden rounded-card border border-admin-border bg-admin-sidebar"><div className="hidden grid-cols-[1fr_130px_100px_90px] gap-4 border-b border-admin-border px-5 py-3 text-xs uppercase text-admin-muted md:grid"><span>Item</span><span>Category</span><span>Price</span><span>Available</span></div>{items.map(i=><div key={i.id} className="flex flex-wrap items-center gap-3 border-b border-admin-border p-4 last:border-0 md:grid md:grid-cols-[1fr_130px_100px_90px]"><div className="flex min-w-52 flex-1 items-center gap-3"><img src={i.image} alt="" width={48} height={48} loading="lazy" className="size-12 rounded-md object-cover"/><span><b className="block">{i.name}</b><VegMark/></span></div><span className="text-sm text-admin-muted">{i.category}</span><label className="flex items-center text-sm"><span>₹</span><input aria-label={`${i.name} price`} value={i.price} type="number" onChange={e=>setItems(items.map(x=>x.id===i.id?{...x,price:Number(e.target.value)}:x))} className="w-16 bg-transparent font-bold outline-none"/></label><div className="flex items-center justify-between gap-3"><Switch checked={i.available} onCheckedChange={v=>setItems(items.map(x=>x.id===i.id?{...x,available:v}:x))}/><Button variant="adminGhost" size="iconSm" aria-label={`Delete ${i.name}`} onClick={()=>setItems(items.filter(x=>x.id!==i.id))}><Trash2/></Button></div></div>)}</div></>}
function QrPanel(){const url="https://id-preview--b0b588cb-b8cc-4e35-a88d-6c425c16b229.lovable.app/hotel-a";return <div><p className="text-sm text-admin-muted">Direct menu access</p><h1 className="font-display text-4xl font-bold">Hotel Λalayaa QR code</h1><div className="mt-7 grid max-w-4xl gap-6 md:grid-cols-2"><div className="grid place-items-center rounded-card bg-card p-8 text-card-foreground"><div className="rounded-card bg-card p-4"><QRCodeSVG value={url} size={250} bgColor="transparent" fgColor="currentColor" level="H"/></div><p className="mt-4 font-display text-2xl font-bold">Scan. Order. Pick up.</p><VegMark/></div><div className="rounded-card border border-admin-border bg-admin-sidebar p-6"><h2 className="font-display text-2xl font-bold">Direct to your menu</h2><p className="mt-3 text-sm leading-relaxed text-admin-muted">This code opens Hotel Λalayaa’s vegetarian menu directly. Place it at your counter, tables, entrance, or takeaway packaging.</p><div className="mt-6 space-y-3 text-sm"><p className="flex items-center gap-3"><QrCode className="text-primary"/> Scan QR</p><p className="pl-2 text-admin-muted">↓</p><p className="flex items-center gap-3"><Store className="text-primary"/> Hotel Λalayaa website</p><p className="pl-2 text-admin-muted">↓</p><p className="flex items-center gap-3"><Leaf className="text-primary"/> Vegetarian menu</p></div><p className="mt-6 break-all rounded-md bg-admin-soft p-3 text-xs text-admin-muted">{url}</p></div></div></div>}
function Placeholder({tab}:{tab:string}){return <div><p className="text-sm text-admin-muted">Hotel Λalayaa operations</p><h1 className="font-display text-4xl font-bold">{tab}</h1><div className="mt-7 grid min-h-72 place-items-center rounded-card border border-dashed border-admin-border bg-admin-sidebar"><div className="text-center"><Sparkles className="mx-auto size-8 text-primary"/><p className="mt-3 font-semibold">{tab} workspace</p><p className="mt-1 text-sm text-admin-muted">Ready for Hotel Λalayaa’s daily operations.</p></div></div></div>}
