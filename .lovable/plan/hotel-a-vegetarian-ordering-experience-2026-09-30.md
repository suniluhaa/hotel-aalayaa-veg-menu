# Hotel A Vegetarian Ordering Experience

## Goal
Turn the current blank project into a polished, mobile-first vegetarian takeaway app for Hotel A. The main menu will live at `/hotel-a`, with `/` opening the same restaurant experience so QR visitors never land on a generic page.

## Customer experience
- Create a branded menu header with Hotel A, the vegetarian tagline, search, pickup timing, and a clear pure-vegetarian cue.
- Add horizontal category filters for All, Starters, Main Course, Snacks, Beverages, Desserts, and Ice Creams.
- Include every supplied menu item with descriptions, prices, vegetarian markers, availability, and large food photography.
- Add functional search, filters, item quantities, and a sticky cart summary.
- Build cart, checkout, payment-method selection, and order-confirmation views as a smooth in-page flow.
- Show generated order details, pickup token, 15–20 minute estimate, and the requested preparation timeline after payment.

## Staff experience
- Add a staff dashboard view with navigation for Dashboard, Orders, Menu, Categories, QR Code, Order History, Sales, and Settings.
- Include order/sales summaries and menu-management controls for adding, editing, deleting, repricing, categorizing, and changing availability.
- Restrict the management form and all seeded items to the six vegetarian categories.
- Provide a scannable Hotel A QR code that points directly to `/hotel-a`.

## Visual direction
- Use a distinctive fresh-green, tomato, warm-paper, and charcoal palette with editorial food typography.
- Use generous food photography, compact rounded cards, crisp borders, and subtle motion.
- Optimize first for phones while keeping a strong desktop menu and dashboard layout.
- Generate a cohesive set of vegetarian Indian food images for menu presentation.

## Technical details
- Keep the experience frontend-only for this pass: cart, checkout, confirmation, and staff edits work interactively in the current browser session; no real payment is charged and changes are not persisted.
- Build reusable typed menu/cart components and central menu data.
- Create route-specific metadata for `/` and `/hotel-a`.
- Verify the complete flow and layouts in the live preview at mobile and desktop sizes.
