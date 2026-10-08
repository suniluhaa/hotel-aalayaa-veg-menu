import { useSyncExternalStore } from "react";

let cart: Record<number, number> = {};
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function updateCart(id: number, delta: number) {
  cart = { ...cart, [id]: Math.max(0, (cart[id] ?? 0) + delta) };
  emit();
}
export function clearCart() {
  cart = {};
  emit();
}
export function useCart() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => cart,
    () => cart,
  );
}
