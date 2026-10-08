import { createFileRoute } from "@tanstack/react-router";
import { HotelAApp } from "@/features/hotel-a/HotelAApp";

export const Route = createFileRoute("/hotel-a/")({
  head: () => ({ meta: [
    { title: "Hotel Λalayaa Vegetarian Menu — Order for Pickup" },
    { name: "description", content: "Order pure vegetarian South Indian and Indian favourites direct from Hotel Λalayaa." },
    { property: "og:title", content: "Hotel Λalayaa Vegetarian Menu — Order for Pickup" },
    { property: "og:description", content: "Fresh vegetarian food. Order direct. Pick up in 15–20 minutes." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: HotelAApp,
});
