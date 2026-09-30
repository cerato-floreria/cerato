# Design System & Visual Identity — Cerato Floral 🌸

## 1. Visual Intent & Brand Identity
Cerato Floral is a high-end luxury floral & gifting ecommerce platform operating in León, Guanajuato, Mexico. The visual design communicates elegance, botanical sophistication, and artisanal luxury through deep dark violet tones, warm cream backgrounds, muted gold accents, and refined serif typography.

---

## 2. Color Palette & Tokens

### Primary & Accent Colors
- **Primary / Charcoal (`--primary`):** `#2D1B2E` — Deep plum/black background and header color.
- **Accent Purple (`--accent`):** `#6B4E71` — Soft floral violet used for subtle highlights and borders.
- **Accent Gold (`--accent-gold`):** `#D4AF37` — Luxury champagne gold for hover states and key callouts.
- **Background Light (`--background`):** `#F7F6F7` — Soft off-white canvas for high readability.
- **Cream (`--cream`):** `#FDFBF7` — Warm card and section background.
- **Background Dark (`--background-dark`):** `#1B161C` — Rich dark footer background.

### Utility Gradients & Blurs
- `.hero-gradient`: `linear-gradient(to right, rgba(0,0,0,0.55), transparent)`
- `.product-card-overlay`: `linear-gradient(to top, rgba(45, 27, 46, 0.85) 0%, rgba(45, 27, 46, 0.3) 60%, rgba(45, 27, 46, 0) 100%)` with backdrop blur (`4px`).
- `.soft-purple-wash`: `radial-gradient(circle at center, rgba(107, 78, 113, 0.04) 0%, transparent 70%)`

---

## 3. Typography Hierarchy

- **Display Header Font (`--font-display`):** `Noto Serif`, serif — Elegant, editorial serif for titles and headlines.
- **Body & Interface Font (`--font-sans`):** `Noto Sans`, sans-serif — Clean, accessible sans-serif for UI, prices, navigation, and body text.
- **Iconography:** `Material Symbols Outlined` (Google Fonts).

---

## 4. UI Patterns & Component Guidelines

### Navigation & Header
- Sticky dark glassmorphism navbar (`#2D1B2E` background).
- Dynamic Mega Menu rendering top-level categories derived from Shopify `cat:` and `cat2:` tags, with subcategories grouped by `type:` and `type2:` tags.
- Responsive side drawer for mobile navigation and shopping cart.

### Buttons & Interactive Components
- **Primary Action:** Solid `#2D1B2E` or `#D4AF37` with uppercase tracking (`tracking-widest`).
- **Secondary Action:** Bordered pill with hover fill transition.
- **Floating Actions:** Direct WhatsApp connection button + "Scroll to top" button.

### Cards & Grid Layouts
- Rounded corners (`rounded-xl` / `rounded-2xl`).
- Hover zoom animations (`scale-105` with `duration-500`).
- Price badge & tags formatted cleanly in Mexican Pesos (`MXN`).
