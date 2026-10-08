import { createFileRoute } from "@tanstack/react-router";
import { HotelAApp } from "@/features/hotel-a/HotelAApp";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Hotel Λalayaa — Fresh Vegetarian Takeaway" },
    { name: "description", content: "Order fresh vegetarian Indian food direct from Hotel Λalayaa for quick pickup." },
    { property: "og:title", content: "Hotel Λalayaa — Fresh Vegetarian Takeaway" },
    { property: "og:description", content: "Browse Hotel Λalayaa's pure vegetarian menu, order direct, and pick up in 15–20 minutes." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: HotelAApp,
});
