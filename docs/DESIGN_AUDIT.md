# Design audit — Hair Luxe

## Scope and method

The baseline was captured from a detached worktree at `HEAD` with only a temporary font-fallback patch so the old Google Fonts setup could compile offline. Screenshots were taken with `scripts/design-shots.ts` at desktop, iPhone 13 and Pixel 7 sizes. The same script was used after the redesign. Counts below were produced by scanning the source trees with pattern-based checks; they include comments, data and test fixtures, so the notes column explains which remaining hits are intentional.

No `AGENTS.md`, `CLAUDE.md` or `README.md` file was changed. No business logic, pricing, cart, checkout, orders, bookings, email output or admin auth behaviour was changed.

## Before / after counts

| Check | Before | After | Note |
| --- | ---: | ---: | --- |
| stock palette hex | 25 | 0 | None remain anywhere in the source or generated icons. |
| gold/silver token | 505 | 1 | The only remaining hit is the word “premium” in README.md, which the brief requires to remain untouched; no design token or component uses gold or silver. |
| google font | 3 | 0 | Local self-hosted Fraunces and DMSans only; no Google font request remains. |
| gradient class/style | 54 | 2 | The two remaining gradients are the single hero/image scrim and the loading skeleton. Both are functional, not decorative. |
| uppercase class | 62 | 0 | Uppercase eyebrows removed; section labels now use sentence case. |
| rounded-full | 115 | 0 | All pills are now 4–8px radius tokens. |
| rounded-2xl-or-3xl | 55 | 0 | All large radii replaced with --radius-md/--radius-lg tokens. |
| shadow class | 33 | 1 | The only hit is the word “shadow” in a CSS comment; no shadow utilities remain. |
| blur/backdrop-blur | 7 | 0 | All blur effects removed. |
| decorative animation | 4 | 0 | Only functional loading/reduced-motion feedback remains. |
| hl box logo | 0 | 0 | The HL monogram was removed from header, footer, icon and admin login; the wordmark is used instead. |
| fake sale badge | 1 | 0 | Compare-at/sale display removed from product cards and detail. |
| rating badge | 26 | 17 | All hits are stored data fields, type declarations or fixtures. No rating or star badge is rendered in the UI. |
| urgency copy | 0 | 0 | No urgency copy remains. |
| hyphen range | 16 | 2 | The only two hits are the legacy migration fixture in tests/migrate-settings.test.ts, intentionally preserved. All UI ranges use “to”. |
| decimal naira in ui | 7 | 7 | The seven hits are email-builder assertions for ₦...00, intentionally unchanged because the brief requires email output to remain byte-compatible. The UI uses formatPriceShort. |
| sample review count | 0 | 1 | The intended single label “Sample reviews” on the homepage. |
| hype word | 77 | 15 | Remaining hits are README (required untouched), product ID strings such as fr-wig-royal, a CSS transform class false positive, and test fixtures that are not rendered. |
| title case heading | 1 | 0 | No capitalize utility remains; labels are authored in sentence case. |
| font-display on non-heading | 0 | 0 | Fraunces is used for headings only; prices, IDs and numbers use tabular sans. |
| text over photo (absolute + text) | 1 | 1 | A false positive: the absolute icon inside the loading spinner on the product image, not text over a photo. |

## Identity decisions

- **Palette:** warm bone `#f7f3ec` background, `#fffdf9` surfaces, `#efe7dd` recessed surfaces, `#2b1f25` foreground, `#6d5f63` muted copy and one deep aubergine brand `#5b233e` (strong `#3d162a`, soft `#f0e2e7`). Status colours are semantic tokens, not decoration. All values live in `src/app/globals.css`; components use token classes only.
- **Fonts:** self-hosted OFL `Fraunces.ttf` for display headings and `DMSans.ttf` for UI and tabular figures, loaded with `next/font/local`. Licences are committed beside the fonts. There is no Google Fonts request.
- **Shape and motion:** radii are 4/6/8px tokens. Shadows, blur, decorative gradients and looping animations were removed. The hero scrim and loading skeleton are the only gradients, and `prefers-reduced-motion` is respected.

### Token contrast (WCAG AA)

| Pair | Ratio |
| --- | ---: |
| background / foreground | 14.32:1 |
| background / muted | 5.48:1 |
| surface / foreground | 15.59:1 |
| surface / muted | 5.96:1 |
| surface-light / foreground | 12.94:1 |
| brand / background | 10.82:1 |
| brand-soft / brand | 9.54:1 |
| success / success-soft | 6.04:1 |
| warning / warning-soft | 5.19:1 |
| danger / danger-soft | 6.23:1 |

All new token pairs meet AA for normal text. Focus rings use the brand token with a 2px outline and offset.

## Screenshots

Before: `design-shots/before/{desktop,iphone-13,pixel-7}/`. After: `design-shots/after/{desktop,iphone-13,pixel-7}/`. Each set contains `home.png`, `shop.png`, `product.png`, `services.png`, `service.png`, `about.png`, `contact.png`, `cart-with-items.png`, `cart-empty.png`, `checkout.png`, `track-order.png`, `track-order-no-orders.png`, `order-sample.png`, `admin-login.png`, `admin.png` and `product-not-found.png`. `design-shots/` is gitignored; no customer data or secrets are committed.

## Copy: before → after examples

| Before | After |
| --- | --- |
| The art of luxury beauty. Custom wig making... | Wig making, hair revamping, makeup, lashes, microblading and skin tag removal in Lagos and Ibadan. |
| The Art of Luxury Beauty | Hair and beauty appointments in Lagos |
| Experience It Yourself | See services and prices |
| Book Now | Book now |
| No Items to Checkout / Add some luxury products first. | Nothing to check out / Add a product to your cart first. |
| Thank You, {name}! / Your order has been placed successfully. | Thank you, {name} / Your order is with us. We will confirm it after checking your payment. |
| Track Your Order / Order ID / Looking Up... | Track your order / Order number / Looking up... |
| Order Details / Bank Transfer / Continue to Payment / Place Order & Confirm | Your details / Bank transfer / Continue to payment / Place order |
| Private Dashboard / Order Management / Total Orders / Send Email | Admin area / Orders and bookings / Total orders / Send email |
| Contact Us / Send Us a Message / Order Inquiry | Contact us / Send us a message / Order enquiry |
| ₦120,000 - ₦250,000 / 2-3 hours | ₦120,000 to ₦250,000 / 2 to 3 hours |
| Five reviews with city avatars and names | Three short quotes labelled “Sample reviews”, captioned by service only |

## Before issue register (file, line, screen)

Every occurrence found by the audit is listed below. “Count” is the number of pattern matches on that line.

### stock palette hex — 25 before / 0 after

| File:line | Screen | Count | Source line |
| --- | --- | ---: | --- |
| `scripts/build-icons.mjs:19` | Global (all screens) | 1 | `const BACKGROUND = "#0a0a0a"; // --color-background` |
| `scripts/build-icons.mjs:20` | Global (all screens) | 1 | `const GOLD = "#d4af37"; // --color-gold` |
| `scripts/build-icons.mjs:21` | Global (all screens) | 1 | `const CREAM = "#f5f1e8"; // --color-foreground` |
| `src/app/globals.css:4` | Global (all screens) | 1 | `--color-background: #0a0a0a;` |
| `src/app/globals.css:7` | Global (all screens) | 1 | `--color-foreground: #f5f1e8;` |
| `src/app/globals.css:8` | Global (all screens) | 1 | `--color-gold: #d4af37;` |
| `src/app/globals.css:11` | Global (all screens) | 1 | `--color-silver: #c0c0c0;` |
| `src/app/globals.css:18` | Global (all screens) | 1 | `--background: #0a0a0a;` |
| `src/app/globals.css:19` | Global (all screens) | 1 | `--foreground: #f5f1e8;` |
| `src/app/globals.css:34` | Global (all screens) | 1 | `background: #d4af37;` |
| `src/app/globals.css:35` | Global (all screens) | 1 | `color: #0a0a0a;` |
| `src/app/globals.css:43` | Global (all screens) | 1 | `background: #0a0a0a;` |
| `src/app/globals.css:52` | Global (all screens) | 1 | `background: #d4af37;` |
| `src/app/globals.css:56` | Global (all screens) | 1 | `background: linear-gradient(135deg, #f5e6cc 0%, #d4af37 50%, #a8862b 100%);` |
| `src/app/globals.css:76` | Global (all screens) | 2 | `linear-gradient(#0a0a0a, #0a0a0a) padding-box,` |
| `src/app/globals.css:77` | Global (all screens) | 1 | `linear-gradient(135deg, #d4af37, #a8862b, #f5e6cc) border-box;` |
| `src/app/icon.svg:2` | Global (all screens) | 2 | `<!-- Hair Luxe "HL" monogram — gold (#d4af37) on the site background (#0a0a0a).` |
| `src/app/icon.svg:4` | Global (all screens) | 1 | `<rect width="64" height="64" rx="14" fill="#0a0a0a"/>` |
| `src/app/icon.svg:5` | Global (all screens) | 1 | `<g fill="none" stroke="#d4af37" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">` |
| `src/app/layout.tsx:52` | Global (all screens) | 1 | `themeColor: "#0a0a0a",` |
| `src/app/manifest.ts:11` | Global (all screens) | 1 | `background_color: "#0a0a0a", // --color-background` |
| `src/app/manifest.ts:12` | Global (all screens) | 1 | `theme_color: "#0a0a0a", // --color-background` |
| `src/app/checkout/page.tsx:758` | /checkout | 1 | `className="mt-0.5 w-5 h-5 rounded border border-surface-light accent-[#d4af37] cursor-pointer"` |

### gold/silver token — 505 before / 1 after

| File:line | Screen | Count | Source line |
| --- | --- | ---: | --- |
| `README.md:7` | README (required untouched) | 1 | `Hair Luxe offers premium hair services and products including wigs, hair revamping, makeup, lash extensions, microblading, and skin tag removal. The site features a fully responsiv` |
| `scripts/build-icons.mjs:20` | Global (all screens) | 2 | `const GOLD = "#d4af37"; // --color-gold` |
| `scripts/build-icons.mjs:68` | Global (all screens) | 1 | `<linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">` |
| `scripts/build-icons.mjs:70` | Global (all screens) | 1 | `<stop offset="0.5" stop-color="${GOLD}"/>` |
| `scripts/build-icons.mjs:77` | Global (all screens) | 1 | `<rect x="352" y="330" width="180" height="5" rx="2.5" fill="url(#gold)"/>` |
| `src/app/globals.css:8` | Global (all screens) | 1 | `--color-gold: #d4af37;` |
| `src/app/globals.css:9` | Global (all screens) | 1 | `--color-gold-light: #f5e6cc;` |
| `src/app/globals.css:10` | Global (all screens) | 1 | `--color-gold-dark: #a8862b;` |
| `src/app/globals.css:11` | Global (all screens) | 1 | `--color-silver: #c0c0c0;` |
| `src/app/globals.css:55` | Global (all screens) | 1 | `.text-gradient-gold {` |
| `src/app/globals.css:73` | Global (all screens) | 1 | `.gold-border-gradient {` |
| `src/app/icon.svg:2` | Global (all screens) | 1 | `<!-- Hair Luxe "HL" monogram — gold (#d4af37) on the site background (#0a0a0a).` |
| `src/app/about/page.tsx:45` | /about | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/app/about/page.tsx:49` | /about | 1 | `The Art of <span className="text-gradient-gold">Luxury Beauty</span>` |
| `src/app/about/page.tsx:76` | /about | 1 | `<div className="rounded-2xl overflow-hidden border border-gold/20">` |
| `src/app/about/page.tsx:85` | /about | 1 | `<div className="absolute -bottom-6 -left-6 rounded-2xl bg-surface border border-gold/20 p-5 shadow-2xl shadow-black/40 max-w-[220px]">` |
| `src/app/about/page.tsx:86` | /about | 1 | `<p className="font-serif text-lg font-bold text-gradient-gold mb-1">` |
| `src/app/about/page.tsx:96` | /about | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/app/about/page.tsx:105` | /about | 1 | `className="rounded-2xl bg-surface border border-surface-light p-6 hover:border-gold/40 transition-colors"` |
| `src/app/about/page.tsx:107` | /about | 1 | `<h3 className="font-serif text-lg font-semibold text-gold mb-2">{v.title}</h3>` |
| `src/app/about/page.tsx:118` | /about | 1 | `<p className="font-serif text-4xl font-bold text-gradient-gold">{s.value}</p>` |
| `src/app/about/page.tsx:139` | /about | 1 | `<Button href="/contact" size="lg" variant="gold">` |
| `src/app/admin/login/page.tsx:56` | /admin/login | 3 | `<div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold tex` |
| `src/app/admin/login/page.tsx:59` | /admin/login | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-1">` |
| `src/app/admin/login/page.tsx:82` | /admin/login | 1 | `className="w-full h-12 rounded-xl bg-background border border-surface-light pl-4 pr-12 text-sm focus:border-gold focus:outline-none"` |
| `src/app/admin/login/page.tsx:86` | /admin/login | 2 | `className="absolute inset-y-0 right-0 w-12 flex items-center justify-center text-muted hover:text-gold focus-visible:text-gold transition-colors cursor-pointer"` |
| `src/app/admin/login/page.tsx:140` | /admin/login | 3 | `className="w-full h-12 rounded-xl bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 curso` |
| `src/app/admin/page.tsx:378` | /admin | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-1">` |
| `src/app/admin/page.tsx:431` | /admin | 1 | `color: "text-gold",` |
| `src/app/admin/page.tsx:443` | /admin | 1 | `color: "text-gold",` |
| `src/app/admin/page.tsx:498` | /admin | 3 | `? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background"` |
| `src/app/admin/page.tsx:499` | /admin | 2 | `: "bg-surface border border-surface-light text-muted hover:text-gold hover:border-gold/40"` |
| `src/app/admin/page.tsx:508` | /admin | 1 | `? "bg-background/85 text-gold"` |
| `src/app/admin/page.tsx:509` | /admin | 3 | `: "bg-gold/15 text-gold border border-gold/40"` |
| `src/app/admin/page.tsx:528` | /admin | 2 | `className="shrink-0 px-4 py-2.5 rounded-full text-xs font-semibold bg-surface border border-surface-light text-muted hover:text-gold hover:border-gold/40 transition-colors disabled` |
| `src/app/admin/page.tsx:540` | /admin | 2 | `className="shrink-0 px-4 py-2.5 rounded-full text-xs font-semibold bg-surface border border-surface-light text-muted hover:text-gold hover:border-gold/40 transition-colors disabled` |
| `src/app/admin/page.tsx:549` | /admin | 1 | `className="h-9 shrink-0 rounded-full bg-surface border border-surface-light px-4 text-xs focus:border-gold focus:outline-none"` |
| `src/app/admin/page.tsx:569` | /admin | 1 | `? "bg-gold text-background"` |
| `src/app/admin/page.tsx:570` | /admin | 1 | `: "bg-surface border border-surface-light text-muted hover:text-gold"` |
| `src/app/admin/page.tsx:598` | /admin | 1 | `className="mt-4 px-4 py-2 rounded-full text-xs font-semibold bg-surface-light text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/app/admin/page.tsx:619` | /admin | 3 | `<div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold text-sm shrink-` |
| `src/app/admin/page.tsx:642` | /admin | 1 | `<svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">` |
| `src/app/admin/page.tsx:649` | /admin | 1 | `<svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">` |
| `src/app/admin/page.tsx:656` | /admin | 1 | `<span className="font-bold text-gold">` |
| `src/app/admin/page.tsx:693` | /admin | 1 | `className="font-medium text-gold hover:underline"` |
| `src/app/admin/page.tsx:752` | /admin | 1 | `<p className="flex justify-between font-bold text-gold">` |
| `src/app/admin/page.tsx:814` | /admin | 1 | `? "bg-gold text-background"` |
| `src/app/admin/page.tsx:815` | /admin | 1 | `: "bg-surface-light text-muted hover:text-gold"` |
| `src/app/admin/page.tsx:835` | /admin | 3 | `className="px-3 py-1.5 rounded-full text-xs font-medium text-gold hover:bg-gold/10 border border-gold/30 transition-colors cursor-pointer"` |
| `src/app/admin/page.tsx:878` | /admin | 2 | `<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold/10 text-gold shrink-0">` |
| `src/app/admin/page.tsx:893` | /admin | 1 | `className="text-gold hover:underline"` |
| `src/app/admin/page.tsx:908` | /admin | 2 | `<span className="px-2.5 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold">` |
| `src/app/admin/page.tsx:923` | /admin | 2 | `className="text-gold hover:bg-gold/10 p-1.5 rounded-lg transition-colors cursor-pointer"` |
| `src/app/admin/page.tsx:954` | /admin | 1 | `<svg className="w-5 h-5 text-gold shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">` |
| `src/app/admin/page.tsx:992` | /admin | 1 | `<p className="text-sm font-bold text-gold">{formatPrice(order.total)}</p>` |
| `src/app/admin/page.tsx:1021` | /admin | 1 | `className="text-muted hover:text-gold p-1 cursor-pointer"` |
| `src/app/admin/page.tsx:1046` | /admin | 1 | `className="w-full h-9 rounded-lg bg-background border border-surface-light px-3 text-sm focus:border-gold focus:outline-none"` |
| `src/app/admin/page.tsx:1056` | /admin | 1 | `className="w-full rounded-lg bg-background border border-surface-light px-3 py-2 text-sm focus:border-gold focus:outline-none resize-y"` |
| `src/app/admin/page.tsx:1063` | /admin | 1 | `className="px-4 py-2 rounded-full text-sm font-semibold bg-surface-light text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/app/admin/page.tsx:1070` | /admin | 3 | `className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacity-` |
| `src/app/admin/page.tsx:1125` | /admin | 1 | `className="px-4 h-10 rounded-full text-sm font-semibold bg-surface-light text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/app/admin/page.tsx:1138` | /admin | 3 | `className="px-4 h-10 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity cursor-pointer"` |
| `src/app/admin/page.tsx:1181` | /admin | 1 | `className="px-4 h-10 rounded-full text-sm font-semibold bg-surface-light text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/components/admin/AdminSidebar.tsx:84` | /admin | 4 | `<span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif text-xl font-bold shadow-l` |
| `src/components/admin/AdminSidebar.tsx:116` | /admin | 4 | `? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background shadow-lg shadow-gold/20"` |
| `src/components/admin/AdminSidebar.tsx:117` | /admin | 2 | `: "bg-surface border border-surface-light text-muted hover:text-gold hover:border-gold/40"` |
| `src/components/admin/ProductsManager.tsx:63` | /admin | 1 | `"w-full h-9 rounded-lg bg-background border border-surface-light px-3 text-sm focus:border-gold focus:outline-none";` |
| `src/components/admin/ProductsManager.tsx:243` | /admin | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-1">` |
| `src/components/admin/ProductsManager.tsx:263` | /admin | 3 | `className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity cursor-pointer"` |
| `src/components/admin/ProductsManager.tsx:271` | /admin | 1 | `<div className="rounded-2xl bg-surface border border-gold/30 p-5 mb-6">` |
| `src/components/admin/ProductsManager.tsx:361` | /admin | 1 | `className="w-full rounded-lg bg-background border border-surface-light px-3 py-2 text-sm focus:border-gold focus:outline-none resize-y"` |
| `src/components/admin/ProductsManager.tsx:375` | /admin | 1 | `className="accent-gold w-4 h-4"` |
| `src/components/admin/ProductsManager.tsx:384` | /admin | 1 | `className="accent-gold w-4 h-4"` |
| `src/components/admin/ProductsManager.tsx:392` | /admin | 3 | `className="px-5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacity-` |
| `src/components/admin/ProductsManager.tsx:423` | /admin | 3 | `<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold text-sm shrink-` |
| `src/components/admin/ProductsManager.tsx:441` | /admin | 1 | `className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-light text-muted hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-point` |
| `src/components/admin/ProductsManager.tsx:448` | /admin | 3 | `className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacit` |
| `src/components/admin/ProductsManager.tsx:540` | /admin | 1 | `className="w-full rounded-lg bg-background border border-surface-light px-3 py-2 text-sm focus:border-gold focus:outline-none resize-y"` |
| `src/components/admin/ProductsManager.tsx:554` | /admin | 1 | `className="accent-gold w-4 h-4"` |
| `src/components/admin/ProductsManager.tsx:563` | /admin | 1 | `className="accent-gold w-4 h-4"` |
| `src/components/admin/ProductsManager.tsx:594` | /admin | 1 | `className="px-4 h-10 rounded-full text-sm font-semibold bg-surface-light text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/components/admin/ProductsManager.tsx:603` | /admin | 3 | `className="px-4 h-10 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity cursor-pointer"` |
| `src/components/admin/ServicesManager.tsx:59` | /admin | 1 | `"w-full h-9 rounded-lg bg-background border border-surface-light px-3 text-sm focus:border-gold focus:outline-none";` |
| `src/components/admin/ServicesManager.tsx:244` | /admin | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-1">` |
| `src/components/admin/ServicesManager.tsx:264` | /admin | 3 | `className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity cursor-pointer"` |
| `src/components/admin/ServicesManager.tsx:272` | /admin | 1 | `<div className="rounded-2xl bg-surface border border-gold/30 p-5 mb-6">` |
| `src/components/admin/ServicesManager.tsx:343` | /admin | 1 | `className="w-full rounded-lg bg-background border border-surface-light px-3 py-2 text-sm focus:border-gold focus:outline-none resize-y"` |
| `src/components/admin/ServicesManager.tsx:357` | /admin | 1 | `className="accent-gold w-4 h-4"` |
| `src/components/admin/ServicesManager.tsx:366` | /admin | 1 | `className="accent-gold w-4 h-4"` |
| `src/components/admin/ServicesManager.tsx:374` | /admin | 3 | `className="px-5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacity-` |
| `src/components/admin/ServicesManager.tsx:405` | /admin | 3 | `<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold text-sm shrink-` |
| `src/components/admin/ServicesManager.tsx:423` | /admin | 1 | `className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-light text-muted hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-point` |
| `src/components/admin/ServicesManager.tsx:430` | /admin | 3 | `className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacit` |
| `src/components/admin/ServicesManager.tsx:508` | /admin | 1 | `className="w-full rounded-lg bg-background border border-surface-light px-3 py-2 text-sm focus:border-gold focus:outline-none resize-y"` |
| `src/components/admin/ServicesManager.tsx:522` | /admin | 1 | `className="accent-gold w-4 h-4"` |
| `src/components/admin/ServicesManager.tsx:531` | /admin | 1 | `className="accent-gold w-4 h-4"` |
| `src/components/admin/ServicesManager.tsx:554` | /admin | 1 | `className="px-4 h-10 rounded-full text-sm font-semibold bg-surface-light text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/components/admin/ServicesManager.tsx:563` | /admin | 3 | `className="px-4 h-10 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity cursor-pointer"` |
| `src/components/admin/SettingsManager.tsx:35` | /admin | 1 | `"w-full h-9 rounded-lg bg-background border border-surface-light px-3 text-sm focus:border-gold focus:outline-none";` |
| `src/components/admin/SettingsManager.tsx:190` | /admin | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-1">` |
| `src/components/admin/SettingsManager.tsx:210` | /admin | 1 | `<h2 className="font-serif text-lg text-gold mb-4">Business Details</h2>` |
| `src/components/admin/SettingsManager.tsx:304` | /admin | 1 | `<h2 className="font-serif text-lg text-gold mb-4">Delivery &amp; Fees</h2>` |
| `src/components/admin/SettingsManager.tsx:335` | /admin | 1 | `className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-light text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/components/admin/SettingsManager.tsx:394` | /admin | 1 | `<h2 className="font-serif text-lg text-gold mb-4">Announcement Bar</h2>` |
| `src/components/admin/SettingsManager.tsx:400` | /admin | 1 | `className="accent-gold w-4 h-4"` |
| `src/components/admin/SettingsManager.tsx:424` | /admin | 3 | `className="px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacity-` |
| `src/components/admin/SettingsManager.tsx:439` | /admin | 1 | `<span className="text-gold font-semibold">` |
| `src/components/admin/SettingsManager.tsx:448` | /admin | 1 | `className="px-4 py-2 rounded-full text-sm font-semibold bg-surface-light text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/app/cart/page.tsx:30` | /cart and global navigation | 2 | `<div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-gold/10 text-gold mb-6">` |
| `src/app/cart/page.tsx:74` | /cart and global navigation | 1 | `<p className="text-xs text-gold uppercase tracking-wider mb-1">` |
| `src/app/cart/page.tsx:79` | /cart and global navigation | 1 | `className="font-serif font-semibold hover:text-gold transition-colors"` |
| `src/app/cart/page.tsx:102` | /cart and global navigation | 1 | `className="flex items-center justify-center w-9 h-9 text-lg text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/app/cart/page.tsx:110` | /cart and global navigation | 1 | `className="flex items-center justify-center w-9 h-9 text-lg text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/app/cart/page.tsx:116` | /cart and global navigation | 1 | `<p className="font-bold text-gold text-lg">` |
| `src/app/cart/page.tsx:126` | /cart and global navigation | 1 | `className="inline-flex items-center gap-2 text-sm text-gold hover:underline"` |
| `src/app/cart/page.tsx:148` | /cart and global navigation | 1 | `? "bg-gold text-background"` |
| `src/app/cart/page.tsx:149` | /cart and global navigation | 1 | `: "bg-surface-light text-muted hover:text-gold"` |
| `src/app/cart/page.tsx:158` | /cart and global navigation | 1 | `? "bg-gold text-background"` |
| `src/app/cart/page.tsx:159` | /cart and global navigation | 1 | `: "bg-surface-light text-muted hover:text-gold"` |
| `src/app/cart/page.tsx:176` | /cart and global navigation | 1 | `className="w-full h-10 rounded-lg bg-surface-light border border-surface-light px-3 text-sm focus:border-gold focus:outline-none"` |
| `src/app/cart/page.tsx:208` | /cart and global navigation | 3 | `: "bg-gold/10 border-gold/30 text-gold"` |
| `src/app/cart/page.tsx:218` | /cart and global navigation | 1 | `<span className="text-gold">{formatPrice(total)}</span>` |
| `src/components/layout/Footer.tsx:19` | /cart and global navigation | 1 | `<footer className="mt-16 border-t border-gold/20 bg-surface text-foreground">` |
| `src/components/layout/Footer.tsx:24` | /cart and global navigation | 3 | `<span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold">` |
| `src/components/layout/Footer.tsx:27` | /cart and global navigation | 1 | `<span className="font-serif text-xl tracking-wide text-gradient-gold font-semibold">` |
| `src/components/layout/Footer.tsx:38` | /cart and global navigation | 1 | `<h3 className="font-serif text-lg mb-4 text-gold">Services</h3>` |
| `src/components/layout/Footer.tsx:44` | /cart and global navigation | 1 | `className="text-sm text-muted hover:text-gold transition-colors"` |
| `src/components/layout/Footer.tsx:54` | /cart and global navigation | 1 | `<h3 className="font-serif text-lg mb-4 text-gold">Quick Links</h3>` |
| `src/components/layout/Footer.tsx:57` | /cart and global navigation | 1 | `<Link href="/" className="text-sm text-muted hover:text-gold transition-colors">` |
| `src/components/layout/Footer.tsx:64` | /cart and global navigation | 1 | `className="text-sm text-muted hover:text-gold transition-colors"` |
| `src/components/layout/Footer.tsx:70` | /cart and global navigation | 1 | `<Link href="/about" className="text-sm text-muted hover:text-gold transition-colors">` |
| `src/components/layout/Footer.tsx:77` | /cart and global navigation | 1 | `className="text-sm text-muted hover:text-gold transition-colors"` |
| `src/components/layout/Footer.tsx:83` | /cart and global navigation | 1 | `<Link href="/track-order" className="text-sm text-muted hover:text-gold transition-colors">` |
| `src/components/layout/Footer.tsx:88` | /cart and global navigation | 1 | `<Link href="/privacy" className="text-sm text-muted hover:text-gold transition-colors">` |
| `src/components/layout/Footer.tsx:93` | /cart and global navigation | 1 | `<Link href="/terms" className="text-sm text-muted hover:text-gold transition-colors">` |
| `src/components/layout/Footer.tsx:101` | /cart and global navigation | 1 | `<h3 className="font-serif text-lg mb-4 text-gold">Get In Touch</h3>` |
| `src/components/layout/Footer.tsx:104` | /cart and global navigation | 1 | `<span className="text-gold mt-0.5">` |
| `src/components/layout/Footer.tsx:116` | /cart and global navigation | 1 | `<span className="text-gold mt-0.5">` |
| `src/components/layout/Footer.tsx:124` | /cart and global navigation | 1 | `<span className="text-gold mt-0.5">` |
| `src/components/layout/Footer.tsx:139` | /cart and global navigation | 1 | `<div className="mt-10 pt-6 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4">` |
| `src/components/layout/Footer.tsx:148` | /cart and global navigation | 1 | `className="hover:text-gold transition-colors"` |
| `src/components/layout/Footer.tsx:157` | /cart and global navigation | 1 | `className="hover:text-gold transition-colors"` |
| `src/components/layout/Footer.tsx:166` | /cart and global navigation | 1 | `className="hover:text-gold transition-colors"` |
| `src/components/layout/Footer.tsx:172` | /cart and global navigation | 1 | `<span className="inline-block w-2 h-2 rounded-full bg-gold animate-pulse" aria-hidden="true" />` |
| `src/components/layout/Header.tsx:86` | /cart and global navigation | 1 | `? "bg-background/95 backdrop-blur-md border-b border-gold/20 shadow-lg shadow-black/40"` |
| `src/components/layout/Header.tsx:91` | /cart and global navigation | 3 | `<div className="bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-center text-xs font-semibold py-2 px-4">` |
| `src/components/layout/Header.tsx:98` | /cart and global navigation | 4 | `<span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif text-xl font-bold shadow-l` |
| `src/components/layout/Header.tsx:101` | /cart and global navigation | 1 | `<span className="font-serif text-2xl md:text-3xl tracking-wide text-gradient-gold font-semibold">` |
| `src/components/layout/Header.tsx:114` | /cart and global navigation | 1 | `className={`relative text-sm font-medium tracking-wide transition-colors hover:text-gold ${` |
| `src/components/layout/Header.tsx:116` | /cart and global navigation | 2 | `? "text-gold after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-px after:bg-gold"` |
| `src/components/layout/Header.tsx:129` | /cart and global navigation | 3 | `className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors"` |
| `src/components/layout/Header.tsx:139` | /cart and global navigation | 3 | `className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors"` |
| `src/components/layout/Header.tsx:156` | /cart and global navigation | 1 | `<span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-background text-[10px] font-bold">` |
| `src/components/layout/Header.tsx:164` | /cart and global navigation | 4 | `className="hidden sm:inline-flex items-center justify-center h-10 px-4 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold hov` |
| `src/components/layout/Header.tsx:172` | /cart and global navigation | 2 | `className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-gold/30 text-gold"` |
| `src/components/layout/Header.tsx:207` | /cart and global navigation | 2 | `className="w-full h-11 rounded-full bg-surface border border-gold/30 pl-11 pr-4 text-sm focus:border-gold focus:outline-none"` |
| `src/components/layout/Header.tsx:217` | /cart and global navigation | 1 | `className="md:hidden bg-background/98 backdrop-blur-md border-t border-gold/20 px-4 pb-6 pt-2"` |
| `src/components/layout/Header.tsx:231` | /cart and global navigation | 1 | `className="w-full h-11 rounded-full bg-surface-light border border-surface-light pl-10 pr-4 text-sm focus:border-gold focus:outline-none"` |
| `src/components/layout/Header.tsx:243` | /cart and global navigation | 2 | `? "bg-gold/10 text-gold"` |
| `src/components/layout/Header.tsx:244` | /cart and global navigation | 2 | `: "text-foreground/80 hover:bg-gold/5 hover:text-gold"` |
| `src/components/layout/Header.tsx:253` | /cart and global navigation | 2 | `className="px-4 py-3 rounded-lg text-sm font-medium tracking-wide text-foreground/80 hover:bg-gold/5 hover:text-gold transition-colors"` |
| `src/components/layout/Header.tsx:259` | /cart and global navigation | 3 | `className="mt-3 inline-flex items-center justify-center h-11 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold"` |
| `src/app/checkout/page.tsx:198` | /checkout | 2 | `<div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-gold/10 text-gold mb-6">` |
| `src/app/checkout/page.tsx:211` | /checkout | 3 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/checkout/page.tsx:238` | /checkout | 1 | `<div className="rounded-2xl bg-surface border border-gold/20 p-6 mb-6 text-left animate-fade-in-up">` |
| `src/app/checkout/page.tsx:239` | /checkout | 1 | `<div className="flex items-center justify-between mb-4 pb-4 border-b border-gold/10">` |
| `src/app/checkout/page.tsx:242` | /checkout | 1 | `<p className="font-serif text-xl font-bold text-gold">{placedOrder.id}</p>` |
| `src/app/checkout/page.tsx:260` | /checkout | 1 | `<div className="space-y-2 text-sm border-t border-gold/10 pt-4">` |
| `src/app/checkout/page.tsx:273` | /checkout | 1 | `<span className="text-gold">{formatPrice(placedOrder.total)}</span>` |
| `src/app/checkout/page.tsx:278` | /checkout | 2 | `<div className="rounded-2xl bg-gold/5 border border-gold/30 p-5 mb-8 text-left">` |
| `src/app/checkout/page.tsx:280` | /checkout | 1 | `<span className="flex items-center justify-center w-9 h-9 rounded-full bg-gold text-background shrink-0">` |
| `src/app/checkout/page.tsx:304` | /checkout | 1 | `<span className="font-medium text-gold">{formatPrice(placedOrder.total)}</span>` |
| `src/app/checkout/page.tsx:338` | /checkout | 3 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/checkout/page.tsx:344` | /checkout | 3 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-gold/40 text-gold font-semibold text-sm hover:bg-gold/10 transition-colors"` |
| `src/app/checkout/page.tsx:350` | /checkout | 3 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-gold/40 text-gold font-semibold text-sm hover:bg-gold/10 transition-colors"` |
| `src/app/checkout/page.tsx:365` | /checkout | 2 | `<div className="rounded-2xl bg-gold/5 border border-gold/20 p-6 mb-8 text-left">` |
| `src/app/checkout/page.tsx:368` | /checkout | 1 | `<svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">` |
| `src/app/checkout/page.tsx:386` | /checkout | 3 | `? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background"` |
| `src/app/checkout/page.tsx:394` | /checkout | 1 | `step >= s.step ? "text-gold" : "text-muted"` |
| `src/app/checkout/page.tsx:403` | /checkout | 1 | `step > s.step ? "bg-gold" : "bg-surface-light"` |
| `src/app/checkout/page.tsx:427` | /checkout | 1 | `errors.firstName ? "border-red-500" : "border-surface-light focus:border-gold"` |
| `src/app/checkout/page.tsx:444` | /checkout | 1 | `errors.lastName ? "border-red-500" : "border-surface-light focus:border-gold"` |
| `src/app/checkout/page.tsx:464` | /checkout | 1 | `errors.email ? "border-red-500" : "border-surface-light focus:border-gold"` |
| `src/app/checkout/page.tsx:481` | /checkout | 1 | `errors.phone ? "border-red-500" : "border-surface-light focus:border-gold"` |
| `src/app/checkout/page.tsx:503` | /checkout | 1 | `errors.city ? "border-red-500" : "border-surface-light focus:border-gold"` |
| `src/app/checkout/page.tsx:520` | /checkout | 1 | `: "border-surface-light focus:border-gold"` |
| `src/app/checkout/page.tsx:547` | /checkout | 1 | `errors.address ? "border-red-500" : "border-surface-light focus:border-gold"` |
| `src/app/checkout/page.tsx:564` | /checkout | 1 | `className="w-full rounded-lg bg-surface-light border border-surface-light px-4 py-3 text-sm focus:border-gold focus:outline-none min-h-[90px] resize-none"` |
| `src/app/checkout/page.tsx:570` | /checkout | 2 | `<div className="rounded-xl bg-gold/5 border border-gold/20 p-4 mb-6 text-sm flex items-start gap-3">` |
| `src/app/checkout/page.tsx:572` | /checkout | 1 | `className="w-5 h-5 text-gold shrink-0 mt-0.5"` |
| `src/app/checkout/page.tsx:589` | /checkout | 2 | `<div className="rounded-xl bg-gold/5 border border-gold/20 p-4 mb-6 text-sm flex items-start gap-3">` |
| `src/app/checkout/page.tsx:591` | /checkout | 1 | `className="w-5 h-5 text-gold shrink-0 mt-0.5"` |
| `src/app/checkout/page.tsx:611` | /checkout | 3 | `className="w-full h-12 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"` |
| `src/app/checkout/page.tsx:623` | /checkout | 2 | `<span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold">` |
| `src/app/checkout/page.tsx:659` | /checkout | 2 | `<span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold text-sm font-bold shrink-0">` |
| `src/app/checkout/page.tsx:670` | /checkout | 1 | `<div className="rounded-xl bg-overlay p-5 mb-6 border border-gold/20" style={{ backgroundColor: "rgba(212,175,55,0.05)" }}>` |
| `src/app/checkout/page.tsx:677` | /checkout | 1 | `<span className="font-medium text-gold">{business.bankDetails.bankName}</span>` |
| `src/app/checkout/page.tsx:689` | /checkout | 1 | `<span className="font-bold text-gold text-base">` |
| `src/app/checkout/page.tsx:715` | /checkout | 1 | `<label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-surface-light rounded-lg cursor-pointer hover:border-gold/40 transition-colors` |
| `src/app/checkout/page.tsx:762` | /checkout | 1 | `<strong className="text-gold">{formatPrice(total)}</strong> to{" "}` |
| `src/app/checkout/page.tsx:779` | /checkout | 3 | `className="h-12 px-6 rounded-full border border-gold/40 text-gold font-semibold text-sm hover:bg-gold/10 transition-colors cursor-pointer"` |
| `src/app/checkout/page.tsx:786` | /checkout | 3 | `className="flex-1 h-12 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacit` |
| `src/app/checkout/page.tsx:841` | /checkout | 1 | `<span className="text-gold">{formatPrice(total)}</span>` |
| `src/app/contact/page.tsx:60` | /contact | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/app/contact/page.tsx:121` | /contact | 1 | `className="flex items-start gap-4 rounded-2xl bg-surface border border-surface-light p-5 hover:border-gold/40 transition-colors"` |
| `src/app/contact/page.tsx:123` | /contact | 2 | `<span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold/10 text-gold shrink-0">` |
| `src/app/contact/page.tsx:147` | /contact | 1 | `<span className="text-gold" aria-hidden="true">` |
| `src/app/contact/page.tsx:175` | /contact | 1 | `className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none"` |
| `src/app/contact/page.tsx:187` | /contact | 1 | `className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none"` |
| `src/app/contact/page.tsx:202` | /contact | 1 | `className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none"` |
| `src/app/contact/page.tsx:215` | /contact | 1 | `className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none appearance-none"` |
| `src/app/contact/page.tsx:237` | /contact | 1 | `className="w-full rounded-lg bg-surface-light border border-surface-light px-4 py-3 text-sm focus:border-gold focus:outline-none min-h-[140px] resize-none"` |
| `src/app/contact/page.tsx:256` | /contact | 3 | `className="w-full h-12 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacit` |
| `src/app/not-found.tsx:13` | 404 | 1 | `<p className="font-serif text-8xl font-bold text-gradient-gold mb-4">404</p>` |
| `src/app/not-found.tsx:21` | 404 | 3 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/not-found.tsx:27` | 404 | 3 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/not-found.tsx:33` | 404 | 3 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/not-found.tsx:39` | 404 | 3 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/order/[orderNumber]/page.tsx:56` | /track-order, /order/[orderNumber] | 1 | `<div className="rounded-2xl bg-surface border border-gold/20 p-6 mb-6 text-left animate-fade-in-up">` |
| `src/app/order/[orderNumber]/page.tsx:57` | /track-order, /order/[orderNumber] | 1 | `<div className="flex items-center justify-between mb-4 pb-4 border-b border-gold/10">` |
| `src/app/order/[orderNumber]/page.tsx:60` | /track-order, /order/[orderNumber] | 1 | `<p className="font-serif text-xl font-bold text-gold">{order.id}</p>` |
| `src/app/order/[orderNumber]/page.tsx:81` | /track-order, /order/[orderNumber] | 1 | `className="text-sm font-medium truncate block hover:text-gold transition-colors"` |
| `src/app/order/[orderNumber]/page.tsx:94` | /track-order, /order/[orderNumber] | 1 | `<div className="space-y-2 text-sm border-t border-gold/10 pt-4">` |
| `src/app/order/[orderNumber]/page.tsx:107` | /track-order, /order/[orderNumber] | 1 | `<span className="text-gold">{formatPrice(order.total)}</span>` |
| `src/app/order/[orderNumber]/page.tsx:112` | /track-order, /order/[orderNumber] | 2 | `<div className="rounded-2xl bg-gold/5 border border-gold/30 p-5 mb-8 text-left">` |
| `src/app/order/[orderNumber]/page.tsx:114` | /track-order, /order/[orderNumber] | 1 | `<span className="flex items-center justify-center w-9 h-9 rounded-full bg-gold text-background shrink-0">` |
| `src/app/order/[orderNumber]/page.tsx:138` | /track-order, /order/[orderNumber] | 1 | `<span className="font-medium text-gold">{formatPrice(order.total)}</span>` |
| `src/app/order/[orderNumber]/page.tsx:163` | /track-order, /order/[orderNumber] | 3 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/order/[orderNumber]/page.tsx:169` | /track-order, /order/[orderNumber] | 3 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-gold/40 text-gold font-semibold text-sm hover:bg-gold/10 transition-colors"` |
| `src/app/track-order/page.tsx:79` | /track-order, /order/[orderNumber] | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/app/track-order/page.tsx:98` | /track-order, /order/[orderNumber] | 1 | `className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none"` |
| `src/app/track-order/page.tsx:110` | /track-order, /order/[orderNumber] | 1 | `className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none"` |
| `src/app/track-order/page.tsx:123` | /track-order, /order/[orderNumber] | 3 | `className="w-full h-11 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacit` |
| `src/app/track-order/page.tsx:130` | /track-order, /order/[orderNumber] | 1 | `<div className="rounded-2xl bg-surface border border-gold/20 p-6 mt-6 animate-fade-in-up">` |
| `src/app/track-order/page.tsx:131` | /track-order, /order/[orderNumber] | 1 | `<div className="flex items-center justify-between mb-4 pb-4 border-b border-gold/10">` |
| `src/app/track-order/page.tsx:134` | /track-order, /order/[orderNumber] | 1 | `<p className="font-serif text-xl font-bold text-gold">{found.id}</p>` |
| `src/app/track-order/page.tsx:156` | /track-order, /order/[orderNumber] | 1 | `<div className="space-y-2 text-sm border-t border-gold/10 pt-4">` |
| `src/app/track-order/page.tsx:165` | /track-order, /order/[orderNumber] | 1 | `<div className="flex justify-between font-bold border-t border-gold/10 pt-3">` |
| `src/app/track-order/page.tsx:167` | /track-order, /order/[orderNumber] | 1 | `<span className="text-gold">{formatPrice(found.total)}</span>` |
| `src/app/track-order/page.tsx:171` | /track-order, /order/[orderNumber] | 1 | `<div className="mt-5 pt-4 border-t border-gold/10 text-sm space-y-2 text-muted">` |
| `src/app/track-order/page.tsx:185` | /track-order, /order/[orderNumber] | 1 | `<span className="font-medium text-gold">Payment proof uploaded: </span>` |
| `src/app/track-order/page.tsx:216` | /track-order, /order/[orderNumber] | 1 | `<span className="text-gold">HL-2026-0123</span>). Please check your email` |
| `src/app/privacy/page.tsx:76` | /privacy | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-2">` |
| `src/app/privacy/page.tsx:87` | /privacy | 1 | `<h2 className="font-serif text-xl font-bold text-gold mb-3">{s.title}</h2>` |
| `src/app/privacy/page.tsx:97` | /privacy | 1 | `<div className="mt-12 rounded-2xl bg-surface border border-gold/20 p-5 text-sm">` |
| `src/app/privacy/page.tsx:101` | /privacy | 1 | `<Link href={`mailto:${BUSINESS.email}`} className="text-gold hover:underline">` |
| `src/app/services/page.tsx:17` | /services, /services/[slug], booking | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/app/services/page.tsx:31` | /services, /services/[slug], booking | 1 | `className="group flex flex-col rounded-2xl bg-surface border border-surface-light hover:border-gold/40 overflow-hidden transition-all duration-300 shadow-lg shadow-black/20 hover:-` |
| `src/app/services/page.tsx:43` | /services, /services/[slug], booking | 1 | `<span className="inline-flex items-center px-3 py-1 rounded-full bg-gold text-background text-xs font-bold">` |
| `src/app/services/page.tsx:54` | /services, /services/[slug], booking | 1 | `<h2 className="font-serif text-xl font-bold mb-2 group-hover:text-gold transition-colors">` |
| `src/app/services/page.tsx:65` | /services, /services/[slug], booking | 1 | `className="w-4 h-4 text-gold mt-0.5 shrink-0"` |
| `src/app/services/page.tsx:82` | /services, /services/[slug], booking | 3 | `className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-gold/40 px-2 text-[11px] font-semibold text-gold hover:bg-gold/10 transition-co` |
| `src/app/services/page.tsx:87` | /services, /services/[slug], booking | 3 | `className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-2 text-[11px] font-semibold text-ba` |
| `src/app/services/[slug]/page.tsx:58` | /services, /services/[slug], booking | 1 | `<Link href="/" className="hover:text-gold transition-colors">` |
| `src/app/services/[slug]/page.tsx:62` | /services, /services/[slug], booking | 1 | `<Link href="/services" className="hover:text-gold transition-colors">` |
| `src/app/services/[slug]/page.tsx:66` | /services, /services/[slug], booking | 1 | `<span className="text-gold">{service.name}</span>` |
| `src/app/services/[slug]/page.tsx:95` | /services, /services/[slug], booking | 1 | `className="group flex items-center gap-4 rounded-2xl bg-surface border border-surface-light p-4 hover:border-gold/40 transition-all duration-300 hover:-translate-y-0.5"` |
| `src/app/services/[slug]/page.tsx:107` | /services, /services/[slug], booking | 1 | `<p className="font-serif font-semibold truncate group-hover:text-gold transition-colors">` |
| `src/components/services/BookingModal.tsx:152` | /services, /services/[slug], booking | 2 | `<div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gold/15 text-gold mb-4">` |
| `src/components/services/BookingModal.tsx:163` | /services, /services/[slug], booking | 1 | `Reference: <span className="text-gold font-semibold">{success.id}</span>` |
| `src/components/services/BookingModal.tsx:196` | /services, /services/[slug], booking | 1 | `<span className="text-gold">{formatIntlPhone(success.phone)}</span> or{" "}` |
| `src/components/services/BookingModal.tsx:197` | /services, /services/[slug], booking | 1 | `<span className="text-gold break-all">{success.email}</span> to confirm your` |
| `src/components/services/BookingModal.tsx:201` | /services, /services/[slug], booking | 1 | `Questions? Call us on <span className="text-gold">{BUSINESS.phone}</span>.` |
| `src/components/services/BookingModal.tsx:205` | /services, /services/[slug], booking | 3 | `className="w-full h-11 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold cursor-pointer"` |
| `src/components/services/BookingModal.tsx:226` | /services, /services/[slug], booking | 1 | `<p className="text-sm text-gold">` |
| `src/components/services/BookingModal.tsx:240` | /services, /services/[slug], booking | 1 | `className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none"` |
| `src/components/services/BookingModal.tsx:258` | /services, /services/[slug], booking | 1 | `phoneError ? "border-red-500" : "border-surface-light focus:border-gold"` |
| `src/components/services/BookingModal.tsx:276` | /services, /services/[slug], booking | 1 | `className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none"` |
| `src/components/services/BookingModal.tsx:291` | /services, /services/[slug], booking | 1 | `className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none [color-scheme:dark]"` |
| `src/components/services/BookingModal.tsx:302` | /services, /services/[slug], booking | 1 | `className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none appearance-none"` |
| `src/components/services/BookingModal.tsx:322` | /services, /services/[slug], booking | 1 | `className="w-full rounded-lg bg-surface-light border border-surface-light px-4 py-3 text-sm focus:border-gold focus:outline-none min-h-[80px] resize-none"` |
| `src/components/services/BookingModal.tsx:334` | /services, /services/[slug], booking | 3 | `className="w-full h-12 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacit` |
| `src/components/services/ServiceDetailClient.tsx:21` | /services, /services/[slug], booking | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/components/services/ServiceDetailClient.tsx:28` | /services, /services/[slug], booking | 2 | `<span className="inline-flex items-center px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-semibold">` |
| `src/components/services/ServiceDetailClient.tsx:40` | /services, /services/[slug], booking | 2 | `<span className="flex items-center justify-center w-6 h-6 rounded-full bg-gold/10 text-gold shrink-0 mt-0.5">` |
| `src/components/services/ServiceDetailClient.tsx:56` | /services, /services/[slug], booking | 3 | `className="w-full sm:w-auto h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity-90 transition-opacity ` |
| `src/app/shop/page.tsx:30` | /shop, /shop/[slug], cart and order summaries | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/app/shop/[slug]/page.tsx:54` | /shop, /shop/[slug], cart and order summaries | 1 | `<Link href="/" className="hover:text-gold transition-colors">` |
| `src/app/shop/[slug]/page.tsx:58` | /shop, /shop/[slug], cart and order summaries | 1 | `<Link href="/shop" className="hover:text-gold transition-colors">` |
| `src/app/shop/[slug]/page.tsx:62` | /shop, /shop/[slug], cart and order summaries | 1 | `<span className="text-gold">{product.name}</span>` |
| `src/components/products/ProductCard.tsx:54` | /shop, /shop/[slug], cart and order summaries | 1 | `<div className="group relative flex flex-col rounded-xl bg-surface border border-surface-light hover:border-gold/40 transition-all duration-300 overflow-hidden shadow-lg shadow-bla` |
| `src/components/products/ProductCard.tsx:65` | /shop, /shop/[slug], cart and order summaries | 1 | `<span className="inline-block px-2.5 py-1 rounded-full bg-gold text-background text-[10px] font-bold uppercase tracking-wide shadow-lg">` |
| `src/components/products/ProductCard.tsx:72` | /shop, /shop/[slug], cart and order summaries | 2 | `<span className="px-4 py-1.5 rounded-full bg-surface border border-gold/40 text-gold text-xs font-bold uppercase tracking-widest">` |
| `src/components/products/ProductCard.tsx:78` | /shop, /shop/[slug], cart and order summaries | 1 | `<div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 backdrop-blur-sm text-gold text-xs font-semibold">` |
| `src/components/products/ProductCard.tsx:88` | /shop, /shop/[slug], cart and order summaries | 1 | `<Link href={`/shop/${product.slug ?? product.id}`} className="group-hover:text-gold transition-colors">` |
| `src/components/products/ProductCard.tsx:97` | /shop, /shop/[slug], cart and order summaries | 1 | `<span className="text-lg font-bold text-gold">{formatPrice(product.price)}</span>` |
| `src/components/products/ProductCard.tsx:117` | /shop, /shop/[slug], cart and order summaries | 3 | `className="flex-1 h-10 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacit` |
| `src/components/products/ProductCard.tsx:123` | /shop, /shop/[slug], cart and order summaries | 3 | `className="flex items-center justify-center w-10 h-10 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors"` |
| `src/components/products/ProductDetail.tsx:64` | /shop, /shop/[slug], cart and order summaries | 1 | `<span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gold text-background text-xs font-bold uppercase">` |
| `src/components/products/ProductDetail.tsx:76` | /shop, /shop/[slug], cart and order summaries | 1 | `activeImage === i ? "border-gold" : "border-surface-light"` |
| `src/components/products/ProductDetail.tsx:87` | /shop, /shop/[slug], cart and order summaries | 1 | `<p className="text-gold uppercase tracking-wider text-xs font-semibold mb-2">` |
| `src/components/products/ProductDetail.tsx:93` | /shop, /shop/[slug], cart and order summaries | 1 | `<div className="flex text-gold">` |
| `src/components/products/ProductDetail.tsx:113` | /shop, /shop/[slug], cart and order summaries | 1 | `<span className="font-serif text-4xl font-bold text-gold">` |
| `src/components/products/ProductDetail.tsx:157` | /shop, /shop/[slug], cart and order summaries | 2 | `selected ? "border-gold ring-2 ring-gold/40 scale-110" : "border-surface-light"` |
| `src/components/products/ProductDetail.tsx:204` | /shop, /shop/[slug], cart and order summaries | 2 | `? "bg-gold text-background border-gold"` |
| `src/components/products/ProductDetail.tsx:205` | /shop, /shop/[slug], cart and order summaries | 2 | `: "bg-surface text-muted border-surface-light hover:border-gold/40 hover:text-gold"` |
| `src/components/products/ProductDetail.tsx:221` | /shop, /shop/[slug], cart and order summaries | 1 | `className="flex items-center justify-center w-11 h-11 text-xl text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/components/products/ProductDetail.tsx:229` | /shop, /shop/[slug], cart and order summaries | 1 | `className="flex items-center justify-center w-11 h-11 text-xl text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/components/products/ProductDetail.tsx:241` | /shop, /shop/[slug], cart and order summaries | 1 | `? "bg-gold/60 text-background"` |
| `src/components/products/ProductDetail.tsx:242` | /shop, /shop/[slug], cart and order summaries | 3 | `: "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90"` |
| `src/components/products/ProductDetail.tsx:250` | /shop, /shop/[slug], cart and order summaries | 1 | `<span className="text-gold">` |
| `src/components/products/ProductDetail.tsx:270` | /shop, /shop/[slug], cart and order summaries | 1 | `<svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">` |
| `src/components/products/ShopGrid.tsx:83` | /shop, /shop/[slug], cart and order summaries | 1 | `<div className="text-center text-gold text-xs uppercase tracking-wider mb-6">` |
| `src/components/products/ShopGrid.tsx:85` | /shop, /shop/[slug], cart and order summaries | 1 | `<span className="font-semibold text-gold">&quot;{search.trim()}&quot;</span>` |
| `src/components/products/ShopGrid.tsx:97` | /shop, /shop/[slug], cart and order summaries | 4 | `? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background shadow-lg shadow-gold/20"` |
| `src/components/products/ShopGrid.tsx:98` | /shop, /shop/[slug], cart and order summaries | 2 | `: "bg-surface border border-surface-light text-muted hover:text-gold hover:border-gold/40"` |
| `src/components/products/ShopGrid.tsx:123` | /shop, /shop/[slug], cart and order summaries | 1 | `className="w-full h-11 rounded-full bg-surface border border-surface-light pl-9 pr-10 text-sm focus:border-gold focus:outline-none"` |
| `src/components/products/ShopGrid.tsx:130` | /shop, /shop/[slug], cart and order summaries | 2 | `className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full text-muted hover:text-gold hover:bg-gold/10 transition-colors cursor-poin` |
| `src/components/products/ShopGrid.tsx:141` | /shop, /shop/[slug], cart and order summaries | 1 | `className="h-11 rounded-full bg-surface border border-surface-light px-4 text-sm focus:border-gold focus:outline-none appearance-none"` |
| `src/lib/data/products.ts:232` | /shop, /shop/[slug], cart and order summaries | 1 | `id: "care-gold-oil",` |
| `src/app/terms/page.tsx:77` | /terms | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-2">` |
| `src/app/terms/page.tsx:88` | /terms | 1 | `<h2 className="font-serif text-xl font-bold text-gold mb-3">{s.title}</h2>` |
| `src/app/terms/page.tsx:98` | /terms | 1 | `<div className="mt-12 rounded-2xl bg-surface border border-gold/20 p-5 text-sm">` |
| `src/app/terms/page.tsx:101` | /terms | 1 | `<Link href="/privacy" className="text-gold hover:underline">` |
| `src/components/home/CtaBanner.tsx:22` | / | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/components/home/CtaBanner.tsx:30` | / | 1 | `<a href={`tel:${business.phoneFormatted}`} className="text-gold hover:underline">` |
| `src/components/home/FeaturedProducts.tsx:12` | / | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/components/home/FeaturedServices.tsx:12` | / | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/components/home/FeaturedServices.tsx:28` | / | 1 | `className="group relative flex flex-col rounded-2xl overflow-hidden bg-surface border border-surface-light hover:border-gold/40 transition-all duration-300 shadow-lg shadow-black/2` |
| `src/components/home/FeaturedServices.tsx:36` | / | 1 | `<p className="text-gold text-sm font-semibold">{service.priceRange}</p>` |
| `src/components/home/Hero.tsx:19` | / | 1 | `<span className="text-gradient-gold">Where Luxury</span>` |
| `src/components/home/Hero.tsx:43` | / | 1 | `<p className="font-serif text-2xl sm:text-3xl font-bold text-gradient-gold">` |
| `src/components/home/Hero.tsx:53` | / | 1 | `<svg className="w-6 h-6 text-gold/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">` |
| `src/components/home/Testimonials.tsx:45` | / | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/components/home/Testimonials.tsx:57` | / | 1 | `className="flex flex-col rounded-2xl bg-surface border border-surface-light p-7 shadow-lg shadow-black/20 hover:border-gold/40 transition-colors"` |
| `src/components/home/Testimonials.tsx:59` | / | 1 | `<div className="flex gap-1 text-gold mb-4">` |
| `src/components/home/Testimonials.tsx:69` | / | 1 | `<div className="mt-5 pt-4 border-t border-gold/10 flex items-center gap-3">` |
| `src/components/home/Testimonials.tsx:70` | / | 3 | `<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold">` |
| `src/components/home/Testimonials.tsx:76` | / | 1 | `{t.location} &middot; <span className="text-gold">{t.service}</span>` |
| `src/components/home/WhyChooseUs.tsx:49` | / | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/components/home/WhyChooseUs.tsx:54` | / | 1 | `<span className="text-gradient-gold">Hair Luxe</span>` |
| `src/components/home/WhyChooseUs.tsx:62` | / | 1 | `className={`rounded-2xl bg-surface border border-surface-light p-7 shadow-lg shadow-black/20 hover:border-gold/40 transition-all duration-300 hover:-translate-y-1 ${` |
| `src/components/home/WhyChooseUs.tsx:63` | / | 1 | `i === 0 ? "gold-border-gradient" : ""` |
| `src/components/home/WhyChooseUs.tsx:66` | / | 2 | `<div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gold/10 text-gold mb-5">` |
| `src/components/ui/Button.tsx:6` | Shared helper (multiple screens) | 1 | `type Variant = "primary" \| "outline" \| "ghost" \| "gold";` |
| `src/components/ui/Button.tsx:19` | Shared helper (multiple screens) | 4 | `"bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold hover:opacity-90 shadow-lg shadow-gold/20",` |
| `src/components/ui/Button.tsx:20` | Shared helper (multiple screens) | 1 | `gold:` |
| `src/components/ui/Button.tsx:21` | Shared helper (multiple screens) | 2 | `"bg-gold text-background font-semibold hover:bg-gold-dark transition-colors",` |
| `src/components/ui/Button.tsx:23` | Shared helper (multiple screens) | 3 | `"border border-gold/40 text-gold hover:bg-gold/10 transition-colors",` |
| `src/components/ui/Button.tsx:25` | Shared helper (multiple screens) | 2 | `"text-foreground/80 hover:text-gold hover:bg-gold/5 transition-colors",` |
| `src/components/ui/Modal.tsx:90` | Shared helper (multiple screens) | 2 | `className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-surface border border-gold/20 shadow-2xl shadow-black/60 gold-border-gradient"` |
| `src/components/ui/Modal.tsx:92` | Shared helper (multiple screens) | 1 | `<div className="flex items-center justify-between px-6 py-4 border-b border-gold/10">` |
| `src/components/ui/Modal.tsx:94` | Shared helper (multiple screens) | 1 | `<h3 id={titleId} className="font-serif text-xl text-gold">` |
| `src/components/ui/Modal.tsx:100` | Shared helper (multiple screens) | 2 | `className="flex items-center justify-center w-8 h-8 rounded-full text-muted hover:text-gold hover:bg-gold/10 transition-colors"` |
| `src/components/ui/Toast.tsx:36` | Shared helper (multiple screens) | 2 | `: "bg-surface border-gold/40 text-gold"` |

### google font — 3 before / 0 after

| File:line | Screen | Count | Source line |
| --- | --- | ---: | --- |
| `src/app/globals.css:13` | Global (all screens) | 1 | `--font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;` |
| `src/app/layout.tsx:11` | Global (all screens) | 1 | `"--font-geist-sans": "Arial, Helvetica, sans-serif",` |
| `src/app/layout.tsx:12` | Global (all screens) | 1 | `"--font-geist-mono": "Consolas, monospace",` |

### gradient class/style — 54 before / 2 after

| File:line | Screen | Count | Source line |
| --- | --- | ---: | --- |
| `src/app/about/page.tsx:134` | /about | 1 | `<div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />` |
| `src/app/admin/login/page.tsx:56` | /admin/login | 1 | `<div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold tex` |
| `src/app/admin/login/page.tsx:140` | /admin/login | 1 | `className="w-full h-12 rounded-xl bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 curso` |
| `src/app/admin/page.tsx:498` | /admin | 1 | `? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background"` |
| `src/app/admin/page.tsx:619` | /admin | 1 | `<div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold text-sm shrink-` |
| `src/app/admin/page.tsx:1070` | /admin | 1 | `className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacity-` |
| `src/app/admin/page.tsx:1138` | /admin | 1 | `className="px-4 h-10 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity cursor-pointer"` |
| `src/components/admin/AdminSidebar.tsx:84` | /admin | 1 | `<span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif text-xl font-bold shadow-l` |
| `src/components/admin/AdminSidebar.tsx:116` | /admin | 1 | `? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background shadow-lg shadow-gold/20"` |
| `src/components/admin/ProductsManager.tsx:263` | /admin | 1 | `className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity cursor-pointer"` |
| `src/components/admin/ProductsManager.tsx:392` | /admin | 1 | `className="px-5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacity-` |
| `src/components/admin/ProductsManager.tsx:423` | /admin | 1 | `<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold text-sm shrink-` |
| `src/components/admin/ProductsManager.tsx:448` | /admin | 1 | `className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacit` |
| `src/components/admin/ProductsManager.tsx:603` | /admin | 1 | `className="px-4 h-10 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity cursor-pointer"` |
| `src/components/admin/ServicesManager.tsx:264` | /admin | 1 | `className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity cursor-pointer"` |
| `src/components/admin/ServicesManager.tsx:374` | /admin | 1 | `className="px-5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacity-` |
| `src/components/admin/ServicesManager.tsx:405` | /admin | 1 | `<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold text-sm shrink-` |
| `src/components/admin/ServicesManager.tsx:430` | /admin | 1 | `className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacit` |
| `src/components/admin/ServicesManager.tsx:563` | /admin | 1 | `className="px-4 h-10 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity cursor-pointer"` |
| `src/components/admin/SettingsManager.tsx:424` | /admin | 1 | `className="px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacity-` |
| `src/app/checkout/page.tsx:211` | /checkout | 1 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/checkout/page.tsx:338` | /checkout | 1 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/checkout/page.tsx:386` | /checkout | 1 | `? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background"` |
| `src/app/checkout/page.tsx:611` | /checkout | 1 | `className="w-full h-12 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"` |
| `src/app/checkout/page.tsx:786` | /checkout | 1 | `className="flex-1 h-12 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacit` |
| `src/app/contact/page.tsx:256` | /contact | 1 | `className="w-full h-12 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacit` |
| `src/app/globals.css:56` | Global (all screens) | 1 | `background: linear-gradient(135deg, #f5e6cc 0%, #d4af37 50%, #a8862b 100%);` |
| `src/app/globals.css:76` | Global (all screens) | 1 | `linear-gradient(#0a0a0a, #0a0a0a) padding-box,` |
| `src/app/globals.css:77` | Global (all screens) | 1 | `linear-gradient(135deg, #d4af37, #a8862b, #f5e6cc) border-box;` |
| `src/app/not-found.tsx:21` | 404 | 1 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/not-found.tsx:27` | 404 | 1 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/not-found.tsx:33` | 404 | 1 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/not-found.tsx:39` | 404 | 1 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/order/[orderNumber]/page.tsx:163` | /track-order, /order/[orderNumber] | 1 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/track-order/page.tsx:123` | /track-order, /order/[orderNumber] | 1 | `className="w-full h-11 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacit` |
| `src/app/services/page.tsx:41` | /services, /services/[slug], booking | 1 | `<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />` |
| `src/app/services/page.tsx:87` | /services, /services/[slug], booking | 1 | `className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-2 text-[11px] font-semibold text-ba` |
| `src/components/services/BookingModal.tsx:205` | /services, /services/[slug], booking | 1 | `className="w-full h-11 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold cursor-pointer"` |
| `src/components/services/BookingModal.tsx:334` | /services, /services/[slug], booking | 1 | `className="w-full h-12 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacit` |
| `src/components/services/ServiceDetailClient.tsx:56` | /services, /services/[slug], booking | 1 | `className="w-full sm:w-auto h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity-90 transition-opacity ` |
| `src/components/home/CtaBanner.tsx:20` | / | 1 | `<div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />` |
| `src/components/home/FeaturedServices.tsx:34` | / | 1 | `<div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />` |
| `src/components/home/Hero.tsx:15` | / | 1 | `<div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-background" />` |
| `src/components/home/Testimonials.tsx:70` | / | 1 | `<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold">` |
| `src/components/layout/Footer.tsx:24` | /cart and global navigation | 1 | `<span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold">` |
| `src/components/layout/Header.tsx:87` | /cart and global navigation | 1 | `: "bg-gradient-to-b from-black/80 to-transparent"` |
| `src/components/layout/Header.tsx:91` | /cart and global navigation | 1 | `<div className="bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-center text-xs font-semibold py-2 px-4">` |
| `src/components/layout/Header.tsx:98` | /cart and global navigation | 1 | `<span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif text-xl font-bold shadow-l` |
| `src/components/layout/Header.tsx:164` | /cart and global navigation | 1 | `className="hidden sm:inline-flex items-center justify-center h-10 px-4 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold hov` |
| `src/components/layout/Header.tsx:259` | /cart and global navigation | 1 | `className="mt-3 inline-flex items-center justify-center h-11 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold"` |
| `src/components/products/ProductCard.tsx:117` | /shop, /shop/[slug], cart and order summaries | 1 | `className="flex-1 h-10 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacit` |
| `src/components/products/ProductDetail.tsx:242` | /shop, /shop/[slug], cart and order summaries | 1 | `: "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90"` |
| `src/components/products/ShopGrid.tsx:97` | /shop, /shop/[slug], cart and order summaries | 1 | `? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background shadow-lg shadow-gold/20"` |
| `src/components/ui/Button.tsx:19` | Shared helper (multiple screens) | 1 | `"bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold hover:opacity-90 shadow-lg shadow-gold/20",` |

### uppercase class — 62 before / 0 after

| File:line | Screen | Count | Source line |
| --- | --- | ---: | --- |
| `src/app/about/page.tsx:45` | /about | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/app/about/page.tsx:96` | /about | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/app/admin/login/page.tsx:59` | /admin/login | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-1">` |
| `src/app/admin/login/page.tsx:69` | /admin/login | 1 | `className="block text-xs text-muted uppercase tracking-wide mb-2"` |
| `src/app/admin/page.tsx:378` | /admin | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-1">` |
| `src/app/admin/page.tsx:468` | /admin | 1 | `<p className="text-xs text-muted mt-1 uppercase tracking-wide">{s.label}</p>` |
| `src/app/admin/page.tsx:675` | /admin | 1 | `<h4 className="text-xs text-muted uppercase tracking-wide mb-3">` |
| `src/app/admin/page.tsx:727` | /admin | 1 | `<h4 className="text-xs text-muted uppercase tracking-wide mb-3">` |
| `src/app/admin/page.tsx:763` | /admin | 1 | `<h4 className="text-xs text-muted uppercase tracking-wide mb-3">` |
| `src/components/admin/ProductsManager.tsx:243` | /admin | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-1">` |
| `src/components/admin/ServicesManager.tsx:244` | /admin | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-1">` |
| `src/components/admin/SettingsManager.tsx:190` | /admin | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-1">` |
| `src/app/cart/page.tsx:74` | /cart and global navigation | 1 | `<p className="text-xs text-gold uppercase tracking-wider mb-1">` |
| `src/app/cart/page.tsx:140` | /cart and global navigation | 1 | `<p className="text-xs text-muted uppercase tracking-wide mb-3">` |
| `src/app/cart/page.tsx:169` | /cart and global navigation | 1 | `<p className="text-xs text-muted uppercase tracking-wide mb-3">` |
| `src/app/checkout/page.tsx:241` | /checkout | 1 | `<p className="text-xs text-muted uppercase tracking-wide">Order Reference</p>` |
| `src/app/checkout/page.tsx:419` | /checkout | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/app/checkout/page.tsx:436` | /checkout | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/app/checkout/page.tsx:456` | /checkout | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/app/checkout/page.tsx:473` | /checkout | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/app/checkout/page.tsx:495` | /checkout | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/app/checkout/page.tsx:511` | /checkout | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/app/checkout/page.tsx:539` | /checkout | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/app/checkout/page.tsx:558` | /checkout | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/app/checkout/page.tsx:671` | /checkout | 1 | `<p className="text-xs text-muted uppercase tracking-wide mb-3">` |
| `src/app/checkout/page.tsx:702` | /checkout | 1 | `<p className="text-xs text-muted uppercase tracking-wide font-semibold">` |
| `src/app/contact/page.tsx:60` | /contact | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/app/contact/page.tsx:166` | /contact | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/app/contact/page.tsx:180` | /contact | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/app/contact/page.tsx:193` | /contact | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/app/contact/page.tsx:207` | /contact | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/app/contact/page.tsx:229` | /contact | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/app/order/[orderNumber]/page.tsx:59` | /track-order, /order/[orderNumber] | 1 | `<p className="text-xs text-muted uppercase tracking-wide">Order Reference</p>` |
| `src/app/track-order/page.tsx:79` | /track-order, /order/[orderNumber] | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/app/track-order/page.tsx:90` | /track-order, /order/[orderNumber] | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/app/track-order/page.tsx:102` | /track-order, /order/[orderNumber] | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/app/track-order/page.tsx:133` | /track-order, /order/[orderNumber] | 1 | `<p className="text-xs text-muted uppercase tracking-wide">Order</p>` |
| `src/app/privacy/page.tsx:76` | /privacy | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-2">` |
| `src/app/services/page.tsx:17` | /services, /services/[slug], booking | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/components/services/BookingModal.tsx:232` | /services, /services/[slug], booking | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/components/services/BookingModal.tsx:245` | /services, /services/[slug], booking | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/components/services/BookingModal.tsx:268` | /services, /services/[slug], booking | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/components/services/BookingModal.tsx:282` | /services, /services/[slug], booking | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/components/services/BookingModal.tsx:295` | /services, /services/[slug], booking | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/components/services/BookingModal.tsx:316` | /services, /services/[slug], booking | 1 | `<span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">` |
| `src/components/services/ServiceDetailClient.tsx:21` | /services, /services/[slug], booking | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/app/shop/page.tsx:30` | /shop, /shop/[slug], cart and order summaries | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/components/products/ProductCard.tsx:65` | /shop, /shop/[slug], cart and order summaries | 1 | `<span className="inline-block px-2.5 py-1 rounded-full bg-gold text-background text-[10px] font-bold uppercase tracking-wide shadow-lg">` |
| `src/components/products/ProductCard.tsx:72` | /shop, /shop/[slug], cart and order summaries | 1 | `<span className="px-4 py-1.5 rounded-full bg-surface border border-gold/40 text-gold text-xs font-bold uppercase tracking-widest">` |
| `src/components/products/ProductCard.tsx:93` | /shop, /shop/[slug], cart and order summaries | 1 | `<p className="text-xs text-muted uppercase tracking-wider mt-1">` |
| `src/components/products/ProductCard.tsx:106` | /shop, /shop/[slug], cart and order summaries | 1 | `className={`mt-2 text-[11px] font-semibold uppercase tracking-wide ${` |
| `src/components/products/ProductDetail.tsx:64` | /shop, /shop/[slug], cart and order summaries | 1 | `<span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gold text-background text-xs font-bold uppercase">` |
| `src/components/products/ProductDetail.tsx:87` | /shop, /shop/[slug], cart and order summaries | 1 | `<p className="text-gold uppercase tracking-wider text-xs font-semibold mb-2">` |
| `src/components/products/ProductDetail.tsx:142` | /shop, /shop/[slug], cart and order summaries | 1 | `<p className="text-xs text-muted uppercase tracking-wide mb-2">` |
| `src/components/products/ProductDetail.tsx:191` | /shop, /shop/[slug], cart and order summaries | 1 | `<p className="text-xs text-muted uppercase tracking-wide mb-2">` |
| `src/components/products/ShopGrid.tsx:83` | /shop, /shop/[slug], cart and order summaries | 1 | `<div className="text-center text-gold text-xs uppercase tracking-wider mb-6">` |
| `src/app/terms/page.tsx:77` | /terms | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-2">` |
| `src/components/home/CtaBanner.tsx:22` | / | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/components/home/FeaturedProducts.tsx:12` | / | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/components/home/FeaturedServices.tsx:12` | / | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/components/home/Testimonials.tsx:45` | / | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |
| `src/components/home/WhyChooseUs.tsx:49` | / | 1 | `<p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">` |

### rounded-full — 115 before / 0 after

| File:line | Screen | Count | Source line |
| --- | --- | ---: | --- |
| `src/app/admin/page.tsx:496` | /admin | 1 | `className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${` |
| `src/app/admin/page.tsx:506` | /admin | 1 | `className={`ml-1.5 inline-block px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${` |
| `src/app/admin/page.tsx:528` | /admin | 1 | `className="shrink-0 px-4 py-2.5 rounded-full text-xs font-semibold bg-surface border border-surface-light text-muted hover:text-gold hover:border-gold/40 transition-colors disabled` |
| `src/app/admin/page.tsx:540` | /admin | 1 | `className="shrink-0 px-4 py-2.5 rounded-full text-xs font-semibold bg-surface border border-surface-light text-muted hover:text-gold hover:border-gold/40 transition-colors disabled` |
| `src/app/admin/page.tsx:549` | /admin | 1 | `className="h-9 shrink-0 rounded-full bg-surface border border-surface-light px-4 text-xs focus:border-gold focus:outline-none"` |
| `src/app/admin/page.tsx:567` | /admin | 1 | `className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${` |
| `src/app/admin/page.tsx:598` | /admin | 1 | `className="mt-4 px-4 py-2 rounded-full text-xs font-semibold bg-surface-light text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/app/admin/page.tsx:619` | /admin | 1 | `<div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold text-sm shrink-` |
| `src/app/admin/page.tsx:627` | /admin | 1 | `className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_BADGE_CLASSES[order.status]}`}` |
| `src/app/admin/page.tsx:812` | /admin | 1 | `className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${` |
| `src/app/admin/page.tsx:835` | /admin | 1 | `className="px-3 py-1.5 rounded-full text-xs font-medium text-gold hover:bg-gold/10 border border-gold/30 transition-colors cursor-pointer"` |
| `src/app/admin/page.tsx:847` | /admin | 1 | `className="px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-red-500/90 hover:bg-red-500 transition-colors cursor-pointer"` |
| `src/app/admin/page.tsx:878` | /admin | 1 | `<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold/10 text-gold shrink-0">` |
| `src/app/admin/page.tsx:908` | /admin | 1 | `<span className="px-2.5 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold">` |
| `src/app/admin/page.tsx:979` | /admin | 1 | `className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${STATUS_BADGE_CLASSES[order.status]}`}` |
| `src/app/admin/page.tsx:1063` | /admin | 1 | `className="px-4 py-2 rounded-full text-sm font-semibold bg-surface-light text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/app/admin/page.tsx:1070` | /admin | 1 | `className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacity-` |
| `src/app/admin/page.tsx:1094` | /admin | 1 | `className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_BADGE_CLASSES[confirmAction.from]}`}` |
| `src/app/admin/page.tsx:1109` | /admin | 1 | `className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_BADGE_CLASSES[confirmAction.to]}`}` |
| `src/app/admin/page.tsx:1125` | /admin | 1 | `className="px-4 h-10 rounded-full text-sm font-semibold bg-surface-light text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/app/admin/page.tsx:1138` | /admin | 1 | `className="px-4 h-10 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity cursor-pointer"` |
| `src/app/admin/page.tsx:1150` | /admin | 1 | `className="px-4 h-10 rounded-full text-sm font-semibold text-white bg-red-500/90 hover:bg-red-500 transition-colors cursor-pointer"` |
| `src/app/admin/page.tsx:1181` | /admin | 1 | `className="px-4 h-10 rounded-full text-sm font-semibold bg-surface-light text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/app/admin/page.tsx:1191` | /admin | 1 | `className="px-4 h-10 rounded-full text-sm font-semibold text-white bg-red-500/90 hover:bg-red-500 transition-colors cursor-pointer"` |
| `src/components/admin/AdminSidebar.tsx:84` | /admin | 1 | `<span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif text-xl font-bold shadow-l` |
| `src/components/admin/AdminSidebar.tsx:93` | /admin | 1 | `className="flex items-center justify-center w-9 h-9 rounded-full text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors shrink-0 cursor-pointer"` |
| `src/components/admin/AdminSidebar.tsx:114` | /admin | 1 | `className={`flex shrink-0 items-center gap-2.5 px-4 py-2.5 rounded-full lg:rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${` |
| `src/components/admin/ProductsManager.tsx:253` | /admin | 1 | `<span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">` |
| `src/components/admin/ProductsManager.tsx:263` | /admin | 1 | `className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity cursor-pointer"` |
| `src/components/admin/ProductsManager.tsx:392` | /admin | 1 | `className="px-5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacity-` |
| `src/components/admin/ProductsManager.tsx:423` | /admin | 1 | `<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold text-sm shrink-` |
| `src/components/admin/ProductsManager.tsx:441` | /admin | 1 | `className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-light text-muted hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-point` |
| `src/components/admin/ProductsManager.tsx:448` | /admin | 1 | `className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacit` |
| `src/components/admin/ProductsManager.tsx:594` | /admin | 1 | `className="px-4 h-10 rounded-full text-sm font-semibold bg-surface-light text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/components/admin/ProductsManager.tsx:603` | /admin | 1 | `className="px-4 h-10 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity cursor-pointer"` |
| `src/components/admin/ServicesManager.tsx:254` | /admin | 1 | `<span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">` |
| `src/components/admin/ServicesManager.tsx:264` | /admin | 1 | `className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity cursor-pointer"` |
| `src/components/admin/ServicesManager.tsx:374` | /admin | 1 | `className="px-5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacity-` |
| `src/components/admin/ServicesManager.tsx:405` | /admin | 1 | `<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold text-sm shrink-` |
| `src/components/admin/ServicesManager.tsx:423` | /admin | 1 | `className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-light text-muted hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-point` |
| `src/components/admin/ServicesManager.tsx:430` | /admin | 1 | `className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacit` |
| `src/components/admin/ServicesManager.tsx:554` | /admin | 1 | `className="px-4 h-10 rounded-full text-sm font-semibold bg-surface-light text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/components/admin/ServicesManager.tsx:563` | /admin | 1 | `className="px-4 h-10 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity cursor-pointer"` |
| `src/components/admin/SettingsManager.tsx:335` | /admin | 1 | `className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-light text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/components/admin/SettingsManager.tsx:384` | /admin | 1 | `className="sm:col-span-4 lg:col-span-1 w-fit px-3 py-1.5 rounded-full text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors mt-auto curs` |
| `src/components/admin/SettingsManager.tsx:424` | /admin | 1 | `className="px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacity-` |
| `src/components/admin/SettingsManager.tsx:448` | /admin | 1 | `className="px-4 py-2 rounded-full text-sm font-semibold bg-surface-light text-muted hover:text-gold transition-colors cursor-pointer"` |
| `src/components/admin/SettingsManager.tsx:461` | /admin | 1 | `className="px-4 py-2 rounded-full text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors cursor-pointer"` |
| `src/app/cart/page.tsx:30` | /cart and global navigation | 1 | `<div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-gold/10 text-gold mb-6">` |
| `src/app/cart/page.tsx:99` | /cart and global navigation | 1 | `<div className="flex items-center rounded-full border border-surface-light bg-surface-light">` |
| `src/components/layout/Footer.tsx:24` | /cart and global navigation | 1 | `<span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold">` |
| `src/components/layout/Footer.tsx:172` | /cart and global navigation | 1 | `<span className="inline-block w-2 h-2 rounded-full bg-gold animate-pulse" aria-hidden="true" />` |
| `src/components/layout/Header.tsx:98` | /cart and global navigation | 1 | `<span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif text-xl font-bold shadow-l` |
| `src/components/layout/Header.tsx:129` | /cart and global navigation | 1 | `className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors"` |
| `src/components/layout/Header.tsx:139` | /cart and global navigation | 1 | `className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors"` |
| `src/components/layout/Header.tsx:156` | /cart and global navigation | 1 | `<span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-background text-[10px] font-bold">` |
| `src/components/layout/Header.tsx:164` | /cart and global navigation | 1 | `className="hidden sm:inline-flex items-center justify-center h-10 px-4 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold hov` |
| `src/components/layout/Header.tsx:172` | /cart and global navigation | 1 | `className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-gold/30 text-gold"` |
| `src/components/layout/Header.tsx:207` | /cart and global navigation | 1 | `className="w-full h-11 rounded-full bg-surface border border-gold/30 pl-11 pr-4 text-sm focus:border-gold focus:outline-none"` |
| `src/components/layout/Header.tsx:231` | /cart and global navigation | 1 | `className="w-full h-11 rounded-full bg-surface-light border border-surface-light pl-10 pr-4 text-sm focus:border-gold focus:outline-none"` |
| `src/components/layout/Header.tsx:259` | /cart and global navigation | 1 | `className="mt-3 inline-flex items-center justify-center h-11 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold"` |
| `src/app/checkout/page.tsx:198` | /checkout | 1 | `<div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-gold/10 text-gold mb-6">` |
| `src/app/checkout/page.tsx:211` | /checkout | 1 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/checkout/page.tsx:224` | /checkout | 1 | `<div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-emerald-500/15 text-emerald-400 mb-6 animate-fade-in-up">` |
| `src/app/checkout/page.tsx:280` | /checkout | 1 | `<span className="flex items-center justify-center w-9 h-9 rounded-full bg-gold text-background shrink-0">` |
| `src/app/checkout/page.tsx:338` | /checkout | 1 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/checkout/page.tsx:344` | /checkout | 1 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-gold/40 text-gold font-semibold text-sm hover:bg-gold/10 transition-colors"` |
| `src/app/checkout/page.tsx:350` | /checkout | 1 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-gold/40 text-gold font-semibold text-sm hover:bg-gold/10 transition-colors"` |
| `src/app/checkout/page.tsx:384` | /checkout | 1 | `className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${` |
| `src/app/checkout/page.tsx:611` | /checkout | 1 | `className="w-full h-12 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"` |
| `src/app/checkout/page.tsx:623` | /checkout | 1 | `<span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold">` |
| `src/app/checkout/page.tsx:659` | /checkout | 1 | `<span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold text-sm font-bold shrink-0">` |
| `src/app/checkout/page.tsx:779` | /checkout | 1 | `className="h-12 px-6 rounded-full border border-gold/40 text-gold font-semibold text-sm hover:bg-gold/10 transition-colors cursor-pointer"` |
| `src/app/checkout/page.tsx:786` | /checkout | 1 | `className="flex-1 h-12 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacit` |
| `src/app/contact/page.tsx:256` | /contact | 1 | `className="w-full h-12 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacit` |
| `src/app/not-found.tsx:21` | 404 | 1 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/not-found.tsx:27` | 404 | 1 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/not-found.tsx:33` | 404 | 1 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/not-found.tsx:39` | 404 | 1 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/order/[orderNumber]/page.tsx:42` | /track-order, /order/[orderNumber] | 1 | `<div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-emerald-500/15 text-emerald-400 mb-6 animate-fade-in-up">` |
| `src/app/order/[orderNumber]/page.tsx:114` | /track-order, /order/[orderNumber] | 1 | `<span className="flex items-center justify-center w-9 h-9 rounded-full bg-gold text-background shrink-0">` |
| `src/app/order/[orderNumber]/page.tsx:163` | /track-order, /order/[orderNumber] | 1 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity` |
| `src/app/order/[orderNumber]/page.tsx:169` | /track-order, /order/[orderNumber] | 1 | `className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-gold/40 text-gold font-semibold text-sm hover:bg-gold/10 transition-colors"` |
| `src/app/track-order/page.tsx:123` | /track-order, /order/[orderNumber] | 1 | `className="w-full h-11 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacit` |
| `src/app/track-order/page.tsx:137` | /track-order, /order/[orderNumber] | 1 | `className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${` |
| `src/app/services/page.tsx:43` | /services, /services/[slug], booking | 1 | `<span className="inline-flex items-center px-3 py-1 rounded-full bg-gold text-background text-xs font-bold">` |
| `src/app/services/page.tsx:46` | /services, /services/[slug], booking | 1 | `<span className="inline-flex items-center px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-foreground/90 text-xs">` |
| `src/app/services/page.tsx:82` | /services, /services/[slug], booking | 1 | `className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-gold/40 px-2 text-[11px] font-semibold text-gold hover:bg-gold/10 transition-co` |
| `src/app/services/page.tsx:87` | /services, /services/[slug], booking | 1 | `className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-2 text-[11px] font-semibold text-ba` |
| `src/components/services/BookingModal.tsx:152` | /services, /services/[slug], booking | 1 | `<div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gold/15 text-gold mb-4">` |
| `src/components/services/BookingModal.tsx:205` | /services, /services/[slug], booking | 1 | `className="w-full h-11 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold cursor-pointer"` |
| `src/components/services/BookingModal.tsx:334` | /services, /services/[slug], booking | 1 | `className="w-full h-12 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacit` |
| `src/components/services/ServiceDetailClient.tsx:28` | /services, /services/[slug], booking | 1 | `<span className="inline-flex items-center px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-semibold">` |
| `src/components/services/ServiceDetailClient.tsx:31` | /services, /services/[slug], booking | 1 | `<span className="inline-flex items-center px-4 py-2 rounded-full bg-surface border border-surface-light text-sm text-muted">` |
| `src/components/services/ServiceDetailClient.tsx:40` | /services, /services/[slug], booking | 1 | `<span className="flex items-center justify-center w-6 h-6 rounded-full bg-gold/10 text-gold shrink-0 mt-0.5">` |
| `src/components/services/ServiceDetailClient.tsx:56` | /services, /services/[slug], booking | 1 | `className="w-full sm:w-auto h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity-90 transition-opacity ` |
| `src/components/home/Testimonials.tsx:70` | / | 1 | `<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold">` |
| `src/components/products/ProductCard.tsx:65` | /shop, /shop/[slug], cart and order summaries | 1 | `<span className="inline-block px-2.5 py-1 rounded-full bg-gold text-background text-[10px] font-bold uppercase tracking-wide shadow-lg">` |
| `src/components/products/ProductCard.tsx:72` | /shop, /shop/[slug], cart and order summaries | 1 | `<span className="px-4 py-1.5 rounded-full bg-surface border border-gold/40 text-gold text-xs font-bold uppercase tracking-widest">` |
| `src/components/products/ProductCard.tsx:78` | /shop, /shop/[slug], cart and order summaries | 1 | `<div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 backdrop-blur-sm text-gold text-xs font-semibold">` |
| `src/components/products/ProductCard.tsx:117` | /shop, /shop/[slug], cart and order summaries | 1 | `className="flex-1 h-10 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacit` |
| `src/components/products/ProductCard.tsx:123` | /shop, /shop/[slug], cart and order summaries | 1 | `className="flex items-center justify-center w-10 h-10 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors"` |
| `src/components/products/ProductDetail.tsx:64` | /shop, /shop/[slug], cart and order summaries | 1 | `<span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gold text-background text-xs font-bold uppercase">` |
| `src/components/products/ProductDetail.tsx:132` | /shop, /shop/[slug], cart and order summaries | 1 | `className={`w-2 h-2 rounded-full ${` |
| `src/components/products/ProductDetail.tsx:156` | /shop, /shop/[slug], cart and order summaries | 1 | `className={`relative w-9 h-9 rounded-full border-2 transition-all cursor-pointer hover:scale-110 ${` |
| `src/components/products/ProductDetail.tsx:202` | /shop, /shop/[slug], cart and order summaries | 1 | `className={`px-3 h-9 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${` |
| `src/components/products/ProductDetail.tsx:218` | /shop, /shop/[slug], cart and order summaries | 1 | `<div className="flex items-center rounded-full border border-surface-light bg-surface">` |
| `src/components/products/ProductDetail.tsx:239` | /shop, /shop/[slug], cart and order summaries | 1 | `className={`flex-1 h-12 rounded-full font-semibold text-sm transition-all ${` |
| `src/components/products/ShopGrid.tsx:95` | /shop, /shop/[slug], cart and order summaries | 1 | `className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${` |
| `src/components/products/ShopGrid.tsx:123` | /shop, /shop/[slug], cart and order summaries | 1 | `className="w-full h-11 rounded-full bg-surface border border-surface-light pl-9 pr-10 text-sm focus:border-gold focus:outline-none"` |
| `src/components/products/ShopGrid.tsx:130` | /shop, /shop/[slug], cart and order summaries | 1 | `className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full text-muted hover:text-gold hover:bg-gold/10 transition-colors cursor-poin` |
| `src/components/products/ShopGrid.tsx:141` | /shop, /shop/[slug], cart and order summaries | 1 | `className="h-11 rounded-full bg-surface border border-surface-light px-4 text-sm focus:border-gold focus:outline-none appearance-none"` |
| `src/components/ui/Button.tsx:43` | Shared helper (multiple screens) | 1 | `const classes = `inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 cursor-pointer ${` |
| `src/components/ui/Modal.tsx:100` | Shared helper (multiple screens) | 1 | `className="flex items-center justify-center w-8 h-8 rounded-full text-muted hover:text-gold hover:bg-gold/10 transition-colors"` |
| `src/components/ui/Toast.tsx:33` | Shared helper (multiple screens) | 1 | `className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-semibold shadow-2xl shadow-black/50 backdrop-blur-sm ` |

### rounded-2xl-or-3xl — 55 before / 0 after

| File:line | Screen | Count | Source line |
| --- | --- | ---: | --- |
| `src/app/about/page.tsx:76` | /about | 1 | `<div className="rounded-2xl overflow-hidden border border-gold/20">` |
| `src/app/about/page.tsx:85` | /about | 1 | `<div className="absolute -bottom-6 -left-6 rounded-2xl bg-surface border border-gold/20 p-5 shadow-2xl shadow-black/40 max-w-[220px]">` |
| `src/app/about/page.tsx:105` | /about | 1 | `className="rounded-2xl bg-surface border border-surface-light p-6 hover:border-gold/40 transition-colors"` |
| `src/app/about/page.tsx:115` | /about | 1 | `<div className="rounded-3xl bg-surface border border-surface-light p-10 grid grid-cols-2 lg:grid-cols-4 gap-8">` |
| `src/app/about/page.tsx:126` | /about | 1 | `<div className="rounded-3xl overflow-hidden relative">` |
| `src/app/admin/login/page.tsx:54` | /admin/login | 1 | `<div className="rounded-2xl bg-surface border border-surface-light p-8">` |
| `src/app/admin/login/page.tsx:56` | /admin/login | 1 | `<div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold tex` |
| `src/app/admin/page.tsx:393` | /admin | 1 | `<div className="rounded-2xl bg-yellow-500/10 border border-yellow-500/30 p-4 mb-8 text-sm flex items-start gap-3">` |
| `src/app/admin/page.tsx:413` | /admin | 1 | `<div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 mb-8 text-sm text-red-400">` |
| `src/app/admin/page.tsx:463` | /admin | 1 | `className={`rounded-2xl bg-surface border border-surface-light p-5 cursor-help ${` |
| `src/app/admin/page.tsx:579` | /admin | 1 | `<div className="text-center py-16 rounded-2xl bg-surface border border-surface-light">` |
| `src/app/admin/page.tsx:610` | /admin | 1 | `className="rounded-2xl bg-surface border border-surface-light overflow-hidden"` |
| `src/app/admin/page.tsx:864` | /admin | 1 | `<div className="text-center py-16 rounded-2xl bg-surface border border-surface-light">` |
| `src/app/admin/page.tsx:875` | /admin | 1 | `className="rounded-2xl bg-surface border border-surface-light p-5 flex flex-col sm:flex-row sm:items-center gap-4"` |
| `src/app/admin/page.tsx:953` | /admin | 1 | `<div className="rounded-2xl bg-surface border border-surface-light p-5 mb-4 flex items-center gap-3">` |
| `src/app/admin/page.tsx:968` | /admin | 1 | `<div className="text-center py-16 rounded-2xl bg-surface border border-surface-light">` |
| `src/app/admin/page.tsx:976` | /admin | 1 | `className="rounded-2xl bg-surface border border-surface-light p-4 flex items-center gap-4"` |
| `src/app/admin/page.tsx:1011` | /admin | 1 | `<div className="w-full max-w-lg rounded-2xl bg-surface border border-surface-light p-6">` |
| `src/components/admin/ProductsManager.tsx:271` | /admin | 1 | `<div className="rounded-2xl bg-surface border border-gold/30 p-5 mb-6">` |
| `src/components/admin/ProductsManager.tsx:401` | /admin | 1 | `<div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 mb-5 text-sm text-red-400">` |
| `src/components/admin/ProductsManager.tsx:406` | /admin | 1 | `<div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 mb-5 text-sm text-emerald-400">` |
| `src/components/admin/ProductsManager.tsx:418` | /admin | 1 | `className={`rounded-2xl bg-surface border p-5 ${` |
| `src/components/admin/ServicesManager.tsx:272` | /admin | 1 | `<div className="rounded-2xl bg-surface border border-gold/30 p-5 mb-6">` |
| `src/components/admin/ServicesManager.tsx:383` | /admin | 1 | `<div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 mb-5 text-sm text-red-400">` |
| `src/components/admin/ServicesManager.tsx:388` | /admin | 1 | `<div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 mb-5 text-sm text-emerald-400">` |
| `src/components/admin/ServicesManager.tsx:400` | /admin | 1 | `className={`rounded-2xl bg-surface border p-5 ${` |
| `src/components/admin/SettingsManager.tsx:200` | /admin | 1 | `<div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 mb-5 text-sm text-red-400">` |
| `src/components/admin/SettingsManager.tsx:209` | /admin | 1 | `<section className="rounded-2xl bg-surface border border-surface-light p-5">` |
| `src/components/admin/SettingsManager.tsx:303` | /admin | 1 | `<section className="rounded-2xl bg-surface border border-surface-light p-5">` |
| `src/components/admin/SettingsManager.tsx:393` | /admin | 1 | `<section className="rounded-2xl bg-surface border border-surface-light p-5">` |
| `src/app/cart/page.tsx:136` | /cart and global navigation | 1 | `<div className="rounded-2xl bg-surface border border-surface-light p-6 sticky top-24">` |
| `src/app/checkout/page.tsx:238` | /checkout | 1 | `<div className="rounded-2xl bg-surface border border-gold/20 p-6 mb-6 text-left animate-fade-in-up">` |
| `src/app/checkout/page.tsx:278` | /checkout | 1 | `<div className="rounded-2xl bg-gold/5 border border-gold/30 p-5 mb-8 text-left">` |
| `src/app/checkout/page.tsx:365` | /checkout | 1 | `<div className="rounded-2xl bg-gold/5 border border-gold/20 p-6 mb-8 text-left">` |
| `src/app/checkout/page.tsx:414` | /checkout | 1 | `<div className="rounded-2xl bg-surface border border-surface-light p-6">` |
| `src/app/checkout/page.tsx:620` | /checkout | 1 | `<div className="rounded-2xl bg-surface border border-surface-light p-6">` |
| `src/app/checkout/page.tsx:797` | /checkout | 1 | `<div className="rounded-2xl bg-surface border border-surface-light p-6 sticky top-24">` |
| `src/app/contact/page.tsx:121` | /contact | 1 | `className="flex items-start gap-4 rounded-2xl bg-surface border border-surface-light p-5 hover:border-gold/40 transition-colors"` |
| `src/app/contact/page.tsx:133` | /contact | 1 | `<div className="rounded-2xl bg-surface border border-surface-light p-5">` |
| `src/app/contact/page.tsx:143` | /contact | 1 | `className="rounded-2xl bg-surface border border-surface-light p-6 sm:p-8"` |
| `src/app/order/[orderNumber]/page.tsx:56` | /track-order, /order/[orderNumber] | 1 | `<div className="rounded-2xl bg-surface border border-gold/20 p-6 mb-6 text-left animate-fade-in-up">` |
| `src/app/order/[orderNumber]/page.tsx:112` | /track-order, /order/[orderNumber] | 1 | `<div className="rounded-2xl bg-gold/5 border border-gold/30 p-5 mb-8 text-left">` |
| `src/app/track-order/page.tsx:88` | /track-order, /order/[orderNumber] | 1 | `<div className="rounded-2xl bg-surface border border-surface-light p-6 sm:p-8">` |
| `src/app/track-order/page.tsx:130` | /track-order, /order/[orderNumber] | 1 | `<div className="rounded-2xl bg-surface border border-gold/20 p-6 mt-6 animate-fade-in-up">` |
| `src/app/privacy/page.tsx:97` | /privacy | 1 | `<div className="mt-12 rounded-2xl bg-surface border border-gold/20 p-5 text-sm">` |
| `src/app/services/page.tsx:31` | /services, /services/[slug], booking | 1 | `className="group flex flex-col rounded-2xl bg-surface border border-surface-light hover:border-gold/40 overflow-hidden transition-all duration-300 shadow-lg shadow-black/20 hover:-` |
| `src/app/services/[slug]/page.tsx:70` | /services, /services/[slug], booking | 1 | `<div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface border border-surface-light">` |
| `src/app/services/[slug]/page.tsx:95` | /services, /services/[slug], booking | 1 | `className="group flex items-center gap-4 rounded-2xl bg-surface border border-surface-light p-4 hover:border-gold/40 transition-all duration-300 hover:-translate-y-0.5"` |
| `src/app/terms/page.tsx:98` | /terms | 1 | `<div className="mt-12 rounded-2xl bg-surface border border-gold/20 p-5 text-sm">` |
| `src/components/home/CtaBanner.tsx:12` | / | 1 | `<div className="relative rounded-3xl overflow-hidden">` |
| `src/components/home/FeaturedServices.tsx:28` | / | 1 | `className="group relative flex flex-col rounded-2xl overflow-hidden bg-surface border border-surface-light hover:border-gold/40 transition-all duration-300 shadow-lg shadow-black/2` |
| `src/components/home/Testimonials.tsx:57` | / | 1 | `className="flex flex-col rounded-2xl bg-surface border border-surface-light p-7 shadow-lg shadow-black/20 hover:border-gold/40 transition-colors"` |
| `src/components/home/WhyChooseUs.tsx:62` | / | 1 | `className={`rounded-2xl bg-surface border border-surface-light p-7 shadow-lg shadow-black/20 hover:border-gold/40 transition-all duration-300 hover:-translate-y-1 ${` |
| `src/components/products/ProductDetail.tsx:54` | /shop, /shop/[slug], cart and order summaries | 1 | `<div className="relative aspect-square rounded-2xl overflow-hidden bg-surface border border-surface-light">` |
| `src/components/ui/Modal.tsx:90` | Shared helper (multiple screens) | 1 | `className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-surface border border-gold/20 shadow-2xl shadow-black/60 gold-border-gradient"` |

### shadow class — 33 before / 1 after

| File:line | Screen | Count | Source line |
| --- | --- | ---: | --- |
| `src/app/about/page.tsx:85` | /about | 2 | `<div className="absolute -bottom-6 -left-6 rounded-2xl bg-surface border border-gold/20 p-5 shadow-2xl shadow-black/40 max-w-[220px]">` |
| `src/app/services/page.tsx:31` | /services, /services/[slug], booking | 2 | `className="group flex flex-col rounded-2xl bg-surface border border-surface-light hover:border-gold/40 overflow-hidden transition-all duration-300 shadow-lg shadow-black/20 hover:-` |
| `src/components/admin/AdminSidebar.tsx:84` | /admin | 2 | `<span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif text-xl font-bold shadow-l` |
| `src/components/admin/AdminSidebar.tsx:116` | /admin | 2 | `? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background shadow-lg shadow-gold/20"` |
| `src/components/home/FeaturedServices.tsx:28` | / | 2 | `className="group relative flex flex-col rounded-2xl overflow-hidden bg-surface border border-surface-light hover:border-gold/40 transition-all duration-300 shadow-lg shadow-black/2` |
| `src/components/home/Testimonials.tsx:57` | / | 2 | `className="flex flex-col rounded-2xl bg-surface border border-surface-light p-7 shadow-lg shadow-black/20 hover:border-gold/40 transition-colors"` |
| `src/components/home/WhyChooseUs.tsx:62` | / | 2 | `className={`rounded-2xl bg-surface border border-surface-light p-7 shadow-lg shadow-black/20 hover:border-gold/40 transition-all duration-300 hover:-translate-y-1 ${` |
| `src/components/layout/Header.tsx:86` | /cart and global navigation | 2 | `? "bg-background/95 backdrop-blur-md border-b border-gold/20 shadow-lg shadow-black/40"` |
| `src/components/layout/Header.tsx:98` | /cart and global navigation | 2 | `<span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif text-xl font-bold shadow-l` |
| `src/components/layout/Header.tsx:164` | /cart and global navigation | 2 | `className="hidden sm:inline-flex items-center justify-center h-10 px-4 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold hov` |
| `src/components/products/ProductCard.tsx:54` | /shop, /shop/[slug], cart and order summaries | 3 | `<div className="group relative flex flex-col rounded-xl bg-surface border border-surface-light hover:border-gold/40 transition-all duration-300 overflow-hidden shadow-lg shadow-bla` |
| `src/components/products/ProductCard.tsx:65` | /shop, /shop/[slug], cart and order summaries | 1 | `<span className="inline-block px-2.5 py-1 rounded-full bg-gold text-background text-[10px] font-bold uppercase tracking-wide shadow-lg">` |
| `src/components/products/ProductDetail.tsx:163` | /shop, /shop/[slug], cart and order summaries | 1 | `className="w-4 h-4 absolute inset-0 m-auto text-white drop-shadow"` |
| `src/components/products/ShopGrid.tsx:97` | /shop, /shop/[slug], cart and order summaries | 2 | `? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background shadow-lg shadow-gold/20"` |
| `src/components/ui/Button.tsx:19` | Shared helper (multiple screens) | 2 | `"bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold hover:opacity-90 shadow-lg shadow-gold/20",` |
| `src/components/ui/Modal.tsx:90` | Shared helper (multiple screens) | 2 | `className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-surface border border-gold/20 shadow-2xl shadow-black/60 gold-border-gradient"` |
| `src/components/ui/Toast.tsx:33` | Shared helper (multiple screens) | 2 | `className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-semibold shadow-2xl shadow-black/50 backdrop-blur-sm ` |

### blur/backdrop-blur — 7 before / 0 after

| File:line | Screen | Count | Source line |
| --- | --- | ---: | --- |
| `src/app/services/page.tsx:46` | /services, /services/[slug], booking | 1 | `<span className="inline-flex items-center px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-foreground/90 text-xs">` |
| `src/components/layout/Header.tsx:86` | /cart and global navigation | 1 | `? "bg-background/95 backdrop-blur-md border-b border-gold/20 shadow-lg shadow-black/40"` |
| `src/components/layout/Header.tsx:217` | /cart and global navigation | 1 | `className="md:hidden bg-background/98 backdrop-blur-md border-t border-gold/20 px-4 pb-6 pt-2"` |
| `src/components/products/ProductCard.tsx:71` | /shop, /shop/[slug], cart and order summaries | 1 | `<div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">` |
| `src/components/products/ProductCard.tsx:78` | /shop, /shop/[slug], cart and order summaries | 1 | `<div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 backdrop-blur-sm text-gold text-xs font-semibold">` |
| `src/components/ui/Modal.tsx:81` | Shared helper (multiple screens) | 1 | `className="absolute inset-0 bg-black/70 backdrop-blur-sm"` |
| `src/components/ui/Toast.tsx:33` | Shared helper (multiple screens) | 1 | `className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-semibold shadow-2xl shadow-black/50 backdrop-blur-sm ` |

### decorative animation — 4 before / 0 after

| File:line | Screen | Count | Source line |
| --- | --- | ---: | --- |
| `src/app/globals.css:80` | Global (all screens) | 1 | `@keyframes fadeInUp {` |
| `src/components/home/Hero.tsx:52` | / | 1 | `<div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">` |
| `src/components/layout/Footer.tsx:172` | /cart and global navigation | 1 | `<span className="inline-block w-2 h-2 rounded-full bg-gold animate-pulse" aria-hidden="true" />` |
| `src/components/products/ProductDetail.tsx:133` | /shop, /shop/[slug], cart and order summaries | 1 | `outOfStock ? "bg-red-400" : "bg-emerald-400 animate-pulse"` |

### hl box logo — 0 before / 0 after

_No baseline occurrences._

### fake sale badge — 1 before / 0 after

| File:line | Screen | Count | Source line |
| --- | --- | ---: | --- |
| `src/components/products/ProductCard.tsx:66` | /shop, /shop/[slug], cart and order summaries | 1 | `Sale` |

### rating badge — 26 before / 17 after

| File:line | Screen | Count | Source line |
| --- | --- | ---: | --- |
| `src/app/about/page.tsx:36` | /about | 1 | `{ value: "5★", label: "Average Rating" },` |
| `src/components/admin/ProductsManager.tsx:217` | /admin | 1 | `rating: 0,` |
| `src/components/products/ProductCard.tsx:77` | /shop, /shop/[slug], cart and order summaries | 1 | `{product.rating >= 4.8 && (` |
| `src/components/products/ProductCard.tsx:82` | /shop, /shop/[slug], cart and order summaries | 1 | `{product.rating}` |
| `src/components/products/ProductDetail.tsx:98` | /shop, /shop/[slug], cart and order summaries | 1 | `i < Math.round(product.rating) ? "" : "opacity-25"` |
| `src/components/products/ProductDetail.tsx:108` | /shop, /shop/[slug], cart and order summaries | 1 | `{product.rating} ({product.reviewCount} reviews)` |
| `src/components/products/ShopGrid.tsx:21` | /shop, /shop/[slug], cart and order summaries | 1 | `{ value: "rating", label: "Top Rated" },` |
| `src/components/products/ShopGrid.tsx:71` | /shop, /shop/[slug], cart and order summaries | 1 | `case "rating":` |
| `src/components/products/ShopGrid.tsx:72` | /shop, /shop/[slug], cart and order summaries | 2 | `result = [...result].sort((a, b) => b.rating - a.rating);` |
| `src/lib/data/products.ts:19` | /shop, /shop/[slug], cart and order summaries | 1 | `rating: 4.9,` |
| `src/lib/data/products.ts:46` | /shop, /shop/[slug], cart and order summaries | 1 | `rating: 4.8,` |
| `src/lib/data/products.ts:72` | /shop, /shop/[slug], cart and order summaries | 1 | `rating: 4.7,` |
| `src/lib/data/products.ts:98` | /shop, /shop/[slug], cart and order summaries | 1 | `rating: 4.9,` |
| `src/lib/data/products.ts:124` | /shop, /shop/[slug], cart and order summaries | 1 | `rating: 4.8,` |
| `src/lib/data/products.ts:147` | /shop, /shop/[slug], cart and order summaries | 1 | `rating: 4.6,` |
| `src/lib/data/products.ts:172` | /shop, /shop/[slug], cart and order summaries | 1 | `rating: 4.7,` |
| `src/lib/data/products.ts:197` | /shop, /shop/[slug], cart and order summaries | 1 | `rating: 4.5,` |
| `src/lib/data/products.ts:221` | /shop, /shop/[slug], cart and order summaries | 1 | `rating: 4.8,` |
| `src/lib/data/products.ts:244` | /shop, /shop/[slug], cart and order summaries | 1 | `rating: 4.7,` |
| `src/lib/data/products.ts:268` | /shop, /shop/[slug], cart and order summaries | 1 | `rating: 4.6,` |
| `src/lib/data/products.ts:291` | /shop, /shop/[slug], cart and order summaries | 1 | `rating: 4.9,` |
| `src/lib/catalog.ts:160` | Shared helper (multiple screens) | 2 | `rating: asNumber(o.rating, 0),` |
| `src/lib/types/index.ts:35` | Shared helper (multiple screens) | 1 | `rating: number;` |
| `tests/catalog-create.test.ts:35` | Test/audit tooling (not user-facing) | 1 | `rating: 0,` |

### urgency copy — 0 before / 0 after

_No baseline occurrences._

### hyphen range — 16 before / 2 after

| File:line | Screen | Count | Source line |
| --- | --- | ---: | --- |
| `src/components/admin/ServicesManager.tsx:123` | /admin | 1 | `setError(`"${row.name}": Start Price must fall within the Price Range (e.g. ₦120,000 - ₦250,000).`);` |
| `src/components/admin/ServicesManager.tsx:324` | /admin | 1 | `placeholder="₦120,000 - ₦250,000"` |
| `src/components/admin/ServicesManager.tsx:334` | /admin | 1 | `placeholder="1 - 2 hours"` |
| `src/lib/data/services.ts:10` | /services, /services/[slug], booking | 1 | `priceRange: "₦120,000 - ₦250,000",` |
| `src/lib/data/services.ts:12` | /services, /services/[slug], booking | 1 | `duration: "2 - 3 hours",` |
| `src/lib/data/services.ts:29` | /services, /services/[slug], booking | 1 | `priceRange: "₦150,000 - ₦300,000",` |
| `src/lib/data/services.ts:31` | /services, /services/[slug], booking | 1 | `duration: "3 - 4 hours",` |
| `src/lib/data/services.ts:48` | /services, /services/[slug], booking | 1 | `priceRange: "₦150,000 - ₦250,000",` |
| `src/lib/data/services.ts:50` | /services, /services/[slug], booking | 1 | `duration: "1 - 2 hours",` |
| `src/lib/data/services.ts:67` | /services, /services/[slug], booking | 1 | `priceRange: "₦120,000 - ₦250,000",` |
| `src/lib/data/services.ts:86` | /services, /services/[slug], booking | 1 | `priceRange: "₦350,000 - ₦650,000",` |
| `src/lib/data/services.ts:88` | /services, /services/[slug], booking | 1 | `duration: "2 - 3 hours",` |
| `src/lib/data/services.ts:105` | /services, /services/[slug], booking | 1 | `priceRange: "₦80,000 - ₦250,000",` |
| `src/lib/pricing.ts:11` | Global (all screens) | 1 | `* Parse a human price range such as "₦120,000 - ₦250,000" into numbers.` |
| `tests/migrate-settings.test.ts:95` | Test/audit tooling (not user-facing) | 1 | `deliveryZones: [{ name: zoneName, zones: [zoneName], fee: 10, days: "1-2 days" }],` |
| `tests/migrate-settings.test.ts:107` | Test/audit tooling (not user-facing) | 1 | `{ name: "Express", zones: ["North York", "Toronto"], fee: 10, days: "1-2 days" },` |

### decimal naira in ui — 7 before / 7 after

| File:line | Screen | Count | Source line |
| --- | --- | ---: | --- |
| `tests/email-builders.test.ts:209` | Test/audit tooling (not user-facing) | 1 | `expect(html).toContain("₦9,000.00"); // line total: 4500 x 2` |
| `tests/email-builders.test.ts:210` | Test/audit tooling (not user-facing) | 1 | `expect(html).toContain("₦1,750.00"); // line total: clip-ins` |
| `tests/email-builders.test.ts:211` | Test/audit tooling (not user-facing) | 1 | `expect(html).toContain("₦10,750.00"); // subtotal` |
| `tests/email-builders.test.ts:212` | Test/audit tooling (not user-facing) | 1 | `expect(html).toContain("₦3,000.00"); // delivery fee` |
| `tests/email-builders.test.ts:213` | Test/audit tooling (not user-facing) | 1 | `expect(html).toContain("₦13,750.00"); // total` |
| `tests/email-builders.test.ts:217` | Test/audit tooling (not user-facing) | 1 | `"₦13,750.00"` |
| `tests/email-builders.test.ts:221` | Test/audit tooling (not user-facing) | 1 | `).toContain("₦13,750.00");` |

### sample review count — 0 before / 1 after

_No baseline occurrences._

### hype word — 77 before / 15 after

| File:line | Screen | Count | Source line |
| --- | --- | ---: | --- |
| `README.md:1` | README (required untouched) | 1 | `# Hair Luxe - Premium Hair Business Ecommerce Website` |
| `README.md:3` | README (required untouched) | 1 | `**Hair Luxe** is a modern, luxury-themed ecommerce website for a hair business, rebuilt from Zooto Luxe with a Nigerian focus. Live at: https://hairluxe-zootodev.vercel.app` |
| `README.md:7` | README (required untouched) | 2 | `Hair Luxe offers premium hair services and products including wigs, hair revamping, makeup, lash extensions, microblading, and skin tag removal. The site features a fully responsiv` |
| `scripts/build-icons.mjs:78` | Global (all screens) | 1 | `<text x="352" y="384" font-family="Arial, Helvetica, sans-serif" font-size="28" letter-spacing="1" fill="${MUTED}">Premium wigs, hair revamping, makeup &amp; lash artistry.</text>` |
| `src/app/globals.css:83` | Global (all screens) | 1 | `transform: translateY(20px);` |
| `src/app/globals.css:87` | Global (all screens) | 1 | `transform: translateY(0);` |
| `src/app/layout.tsx:18` | Global (all screens) | 2 | `title: `${BUSINESS.name} \| Premium Hair Services & Luxury Wigs`,` |
| `src/app/layout.tsx:19` | Global (all screens) | 2 | `description: "Premium hair services and luxury wigs. Hair revamping, wig making, makeup, lash extensions, microblading and skin tag removal. Book online with easy payment.",` |
| `src/app/layout.tsx:21` | Global (all screens) | 1 | `"hair luxury",` |
| `src/app/layout.tsx:34` | Global (all screens) | 2 | `title: `${BUSINESS.name} \| Premium Hair Services & Luxury Wigs`,` |
| `src/app/layout.tsx:42` | Global (all screens) | 2 | `title: `${BUSINESS.name} \| Premium Hair Services & Luxury Wigs`,` |
| `src/lib/config.ts:3` | Global (all screens) | 1 | `tagline: "Where Luxury Meets Hair",` |
| `src/lib/config.ts:6` | Global (all screens) | 2 | `"Premium hair services and products. Wigs, hair revamping, makeup, lashes, microblading and more - crafted with elegance.",` |
| `src/app/about/page.tsx:9` | /about | 1 | `"The art of luxury beauty. Custom wig making, hair revamping, makeup, lash extensions, microblading and skin tag removal in Lagos, Nigeria.",` |
| `src/app/about/page.tsx:20` | /about | 1 | `text: "We use only authentic, premium products. No shortcuts, no compromises - just honest excellence.",` |
| `src/app/about/page.tsx:35` | /about | 1 | `{ value: "6", label: "Signature Services" },` |
| `src/app/about/page.tsx:49` | /about | 1 | `The Art of <span className="text-gradient-gold">Luxury Beauty</span>` |
| `src/app/about/page.tsx:54` | /about | 1 | `luxurious. What began as a passion for hair artistry has grown into` |
| `src/app/about/page.tsx:58` | /about | 1 | `From custom wig making and hair revamping to flawless makeup, lash` |
| `src/app/admin/page.tsx:660` | /admin | 1 | `className={`w-4 h-4 transition-transform ${expandedOrder === order.id ? "rotate-180" : ""}`}` |
| `src/app/cart/page.tsx:41` | /cart and global navigation | 1 | `Explore our premium wigs, hair bundles and beauty essentials.` |
| `src/components/layout/Footer.tsx:32` | /cart and global navigation | 2 | `{business.tagline}. Premium services and products crafted with elegance for` |
| `src/app/checkout/page.tsx:208` | /checkout | 1 | `<p className="text-muted mb-8">Your cart is empty. Add some luxury products first.</p>` |
| `src/app/services/page.tsx:22` | /services, /services/[slug], booking | 1 | `Premium beauty services delivered by certified professionals. Select a service to` |
| `src/app/services/page.tsx:39` | /services, /services/[slug], booking | 1 | `className="object-cover transition-transform duration-500 group-hover:scale-105"` |
| `src/lib/data/services.ts:9` | /services, /services/[slug], booking | 2 | `"Transform worn, dull or damaged hair into a fresh, luxurious look. Our stylists breathe new life into existing hair with deep conditioning, restyling and precision care.",` |
| `src/lib/data/services.ts:28` | /services, /services/[slug], booking | 2 | `"Custom-made luxury wigs tailored to your head size, style and preference. We use premium virgin hair and hand-tied techniques for an undetectable look.",` |
| `src/lib/data/services.ts:47` | /services, /services/[slug], booking | 1 | `"Professional makeup artistry for every occasion - weddings, photoshoots, parties and more. Flawless, camera-ready looks that enhance your natural beauty.",` |
| `src/lib/data/services.ts:55` | /services, /services/[slug], booking | 1 | `"Full glam or natural application",` |
| `src/lib/data/services.ts:66` | /services, /services/[slug], booking | 1 | `"Volumizing and classic lash extensions for beautiful, wide-awake eyes. Applied safely with premium materials and lasting results.",` |
| `src/lib/data/services.ts:75` | /services, /services/[slug], booking | 1 | `"Premium lash serum",` |
| `src/app/shop/page.tsx:12` | /shop, /shop/[slug], cart and order summaries | 2 | `"Luxury wigs, virgin hair bundles, lashes and hair care essentials. Shop the premium collection online.",` |
| `src/app/shop/page.tsx:31` | /shop, /shop/[slug], cart and order summaries | 1 | `Premium Collection` |
| `src/app/shop/page.tsx:35` | /shop, /shop/[slug], cart and order summaries | 1 | `Luxury wigs, virgin hair bundles, lashes and hair care essentials.` |
| `src/components/products/ProductCard.tsx:61` | /shop, /shop/[slug], cart and order summaries | 1 | `className="object-cover transition-transform duration-500 group-hover:scale-105"` |
| `src/lib/data/products.ts:5` | /shop, /shop/[slug], cart and order summaries | 1 | `id: "fr-wig-royal",` |
| `src/lib/data/products.ts:6` | /shop, /shop/[slug], cart and order summaries | 2 | `name: "Royal Glam Lace Front Wig",` |
| `src/lib/data/products.ts:9` | /shop, /shop/[slug], cart and order summaries | 1 | `"Premium 100% virgin human hair lace front wig with 5x5 closure. Pre-plucked hairline for a natural, undetectable finish.",` |
| `src/lib/data/products.ts:34` | /shop, /shop/[slug], cart and order summaries | 1 | `name: "Silken Diva Full Lace Wig",` |
| `src/lib/data/products.ts:64` | /shop, /shop/[slug], cart and order summaries | 1 | `"Luxurious goddess braids wig with natural-looking roots. Pre-styled and ready to wear - zero install time.",` |
| `src/lib/data/products.ts:139` | /shop, /shop/[slug], cart and order summaries | 1 | `"Trending ginger blonde bundles with premium color. Dimension and vibrancy for eye-catching looks.",` |
| `src/lib/data/products.ts:152` | /shop, /shop/[slug], cart and order summaries | 1 | `"Premium blond-highlighted virgin hair",` |
| `src/lib/data/products.ts:164` | /shop, /shop/[slug], cart and order summaries | 1 | `"Professional mink volume lash kit with 10 different lengths. Reusable and cruelty-free for stunning statement eyes.",` |
| `src/lib/data/products.ts:176` | /shop, /shop/[slug], cart and order summaries | 1 | `"Premium faux mink lashes",` |
| `src/lib/data/products.ts:184` | /shop, /shop/[slug], cart and order summaries | 1 | `id: "lash-strip-glam",` |
| `src/lib/data/products.ts:209` | /shop, /shop/[slug], cart and order summaries | 1 | `name: "Royal Edge Control Gel",` |
| `src/lib/data/products.ts:212` | /shop, /shop/[slug], cart and order summaries | 1 | `"Strong-hold edge control finished with a luxurious shine. Lays edges flat and smooth without flaking.",` |
| `src/lib/data/products.ts:228` | /shop, /shop/[slug], cart and order summaries | 1 | `"100ml premium jar",` |
| `src/lib/data/products.ts:252` | /shop, /shop/[slug], cart and order summaries | 1 | `"60ml premium bottle",` |
| `src/lib/data/products.ts:275` | /shop, /shop/[slug], cart and order summaries | 1 | `"350ml premium bottle",` |
| `src/components/home/CtaBanner.tsx:23` | / | 1 | `Ready For a Transformation?` |
| `src/components/home/FeaturedServices.tsx:16` | / | 1 | `Signature Services` |
| `src/components/home/FeaturedServices.tsx:19` | / | 1 | `From hair revamping to flawless makeup, our experts craft beauty tailored to you.` |
| `src/components/home/FeaturedServices.tsx:31` | / | 1 | `className="relative h-64 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"` |
| `src/components/home/Hero.tsx:19` | / | 1 | `<span className="text-gradient-gold">Where Luxury</span>` |
| `src/components/home/Hero.tsx:24` | / | 1 | `Premium wigs, hair revamping, makeup &amp; lash artistry. Expert craftsmanship,` |
| `src/components/home/Hero.tsx:25` | / | 1 | `personalized care, and elegance in every strand.` |
| `src/components/home/Testimonials.tsx:5` | / | 2 | `text: "My custom wig from Hair Luxe is absolutely stunning! The install was seamless and I get compliments everywhere I go. Truly luxury from start to finish.",` |
| `src/components/home/Testimonials.tsx:23` | / | 1 | `text: "The lace front wig I purchased exceeded my expectations. The quality is premium and the pricing is fair. My friends can't stop asking where I got it from.",` |
| `src/components/home/WhyChooseUs.tsx:3` | / | 1 | `title: "Premium Quality",` |
| `src/components/home/WhyChooseUs.tsx:23` | / | 1 | `title: "Luxury Experience",` |
| `tests/email-builders.test.ts:34` | Test/audit tooling (not user-facing) | 1 | `name: "Luxury Wig & <em>Bundle</em>",` |
| `tests/email-builders.test.ts:271` | Test/audit tooling (not user-facing) | 1 | `expect(html).toContain("Luxury Wig &amp; &lt;em&gt;Bundle&lt;/em&gt;");` |
| `tests/migrate-settings.test.ts:17` | Test/audit tooling (not user-facing) | 1 | `tagline: "Where Luxury Meets Hair",` |
| `tests/migrate-settings.test.ts:163` | Test/audit tooling (not user-facing) | 1 | `businessName: "Bespoke Studio",` |

### title case heading — 1 before / 0 after

| File:line | Screen | Count | Source line |
| --- | --- | ---: | --- |
| `src/app/admin/page.tsx:710` | /admin | 1 | `<span className="font-medium capitalize">` |

### font-display on non-heading — 0 before / 0 after

_No baseline occurrences._

### text over photo (absolute + text) — 1 before / 1 after

| File:line | Screen | Count | Source line |
| --- | --- | ---: | --- |
| `src/components/products/ProductDetail.tsx:163` | /shop, /shop/[slug], cart and order summaries | 1 | `className="w-4 h-4 absolute inset-0 m-auto text-white drop-shadow"` |

## Remaining after occurrences (intentional)

| Check | File:line | Why it remains |
| --- | --- | --- |
| gold/silver token | `README.md:7` | The only remaining hit is the word “premium” in README.md, which the brief requires to remain untouched; no design token or component uses gold or silver. |
| gradient class/style | `src/app/globals.css:55` | The two remaining gradients are the single hero/image scrim and the loading skeleton. Both are functional, not decorative. |
| gradient class/style | `src/app/globals.css:87` | The two remaining gradients are the single hero/image scrim and the loading skeleton. Both are functional, not decorative. |
| shadow class | `src/app/globals.css:4` | The only hit is the word “shadow” in a CSS comment; no shadow utilities remain. |
| rating badge | `src/components/admin/ProductsManager.tsx:217` | All hits are stored data fields, type declarations or fixtures. No rating or star badge is rendered in the UI. |
| rating badge | `src/lib/catalog.ts:160` | All hits are stored data fields, type declarations or fixtures. No rating or star badge is rendered in the UI. |
| rating badge | `src/lib/data/products.ts:19` | All hits are stored data fields, type declarations or fixtures. No rating or star badge is rendered in the UI. |
| rating badge | `src/lib/data/products.ts:46` | All hits are stored data fields, type declarations or fixtures. No rating or star badge is rendered in the UI. |
| rating badge | `src/lib/data/products.ts:72` | All hits are stored data fields, type declarations or fixtures. No rating or star badge is rendered in the UI. |
| rating badge | `src/lib/data/products.ts:98` | All hits are stored data fields, type declarations or fixtures. No rating or star badge is rendered in the UI. |
| rating badge | `src/lib/data/products.ts:124` | All hits are stored data fields, type declarations or fixtures. No rating or star badge is rendered in the UI. |
| rating badge | `src/lib/data/products.ts:147` | All hits are stored data fields, type declarations or fixtures. No rating or star badge is rendered in the UI. |
| rating badge | `src/lib/data/products.ts:172` | All hits are stored data fields, type declarations or fixtures. No rating or star badge is rendered in the UI. |
| rating badge | `src/lib/data/products.ts:197` | All hits are stored data fields, type declarations or fixtures. No rating or star badge is rendered in the UI. |
| rating badge | `src/lib/data/products.ts:221` | All hits are stored data fields, type declarations or fixtures. No rating or star badge is rendered in the UI. |
| rating badge | `src/lib/data/products.ts:244` | All hits are stored data fields, type declarations or fixtures. No rating or star badge is rendered in the UI. |
| rating badge | `src/lib/data/products.ts:268` | All hits are stored data fields, type declarations or fixtures. No rating or star badge is rendered in the UI. |
| rating badge | `src/lib/data/products.ts:291` | All hits are stored data fields, type declarations or fixtures. No rating or star badge is rendered in the UI. |
| rating badge | `src/lib/types/index.ts:35` | All hits are stored data fields, type declarations or fixtures. No rating or star badge is rendered in the UI. |
| rating badge | `tests/catalog-create.test.ts:35` | All hits are stored data fields, type declarations or fixtures. No rating or star badge is rendered in the UI. |
| hyphen range | `tests/migrate-settings.test.ts:95` | The only two hits are the legacy migration fixture in tests/migrate-settings.test.ts, intentionally preserved. All UI ranges use “to”. |
| hyphen range | `tests/migrate-settings.test.ts:107` | The only two hits are the legacy migration fixture in tests/migrate-settings.test.ts, intentionally preserved. All UI ranges use “to”. |
| decimal naira in ui | `tests/email-builders.test.ts:209` | The seven hits are email-builder assertions for ₦...00, intentionally unchanged because the brief requires email output to remain byte-compatible. The UI uses formatPriceShort. |
| decimal naira in ui | `tests/email-builders.test.ts:210` | The seven hits are email-builder assertions for ₦...00, intentionally unchanged because the brief requires email output to remain byte-compatible. The UI uses formatPriceShort. |
| decimal naira in ui | `tests/email-builders.test.ts:211` | The seven hits are email-builder assertions for ₦...00, intentionally unchanged because the brief requires email output to remain byte-compatible. The UI uses formatPriceShort. |
| decimal naira in ui | `tests/email-builders.test.ts:212` | The seven hits are email-builder assertions for ₦...00, intentionally unchanged because the brief requires email output to remain byte-compatible. The UI uses formatPriceShort. |
| decimal naira in ui | `tests/email-builders.test.ts:213` | The seven hits are email-builder assertions for ₦...00, intentionally unchanged because the brief requires email output to remain byte-compatible. The UI uses formatPriceShort. |
| decimal naira in ui | `tests/email-builders.test.ts:217` | The seven hits are email-builder assertions for ₦...00, intentionally unchanged because the brief requires email output to remain byte-compatible. The UI uses formatPriceShort. |
| decimal naira in ui | `tests/email-builders.test.ts:221` | The seven hits are email-builder assertions for ₦...00, intentionally unchanged because the brief requires email output to remain byte-compatible. The UI uses formatPriceShort. |
| sample review count | `src/components/home/Testimonials.tsx:19` | The intended single label “Sample reviews” on the homepage. |
| hype word | `README.md:1` | Remaining hits are README (required untouched), product ID strings such as fr-wig-royal, a CSS transform class false positive, and test fixtures that are not rendered. |
| hype word | `README.md:3` | Remaining hits are README (required untouched), product ID strings such as fr-wig-royal, a CSS transform class false positive, and test fixtures that are not rendered. |
| hype word | `README.md:7` | Remaining hits are README (required untouched), product ID strings such as fr-wig-royal, a CSS transform class false positive, and test fixtures that are not rendered. |
| hype word | `scripts/design-shots.ts:55` | Remaining hits are README (required untouched), product ID strings such as fr-wig-royal, a CSS transform class false positive, and test fixtures that are not rendered. |
| hype word | `scripts/design-shots.ts:78` | Remaining hits are README (required untouched), product ID strings such as fr-wig-royal, a CSS transform class false positive, and test fixtures that are not rendered. |
| hype word | `src/app/admin/page.tsx:660` | Remaining hits are README (required untouched), product ID strings such as fr-wig-royal, a CSS transform class false positive, and test fixtures that are not rendered. |
| hype word | `src/lib/data/products.ts:5` | Remaining hits are README (required untouched), product ID strings such as fr-wig-royal, a CSS transform class false positive, and test fixtures that are not rendered. |
| hype word | `src/lib/data/products.ts:184` | Remaining hits are README (required untouched), product ID strings such as fr-wig-royal, a CSS transform class false positive, and test fixtures that are not rendered. |
| hype word | `src/lib/format.ts:104` | Remaining hits are README (required untouched), product ID strings such as fr-wig-royal, a CSS transform class false positive, and test fixtures that are not rendered. |
| hype word | `src/lib/format.ts:111` | Remaining hits are README (required untouched), product ID strings such as fr-wig-royal, a CSS transform class false positive, and test fixtures that are not rendered. |
| hype word | `tests/email-builders.test.ts:34` | Remaining hits are README (required untouched), product ID strings such as fr-wig-royal, a CSS transform class false positive, and test fixtures that are not rendered. |
| hype word | `tests/email-builders.test.ts:271` | Remaining hits are README (required untouched), product ID strings such as fr-wig-royal, a CSS transform class false positive, and test fixtures that are not rendered. |
| hype word | `tests/migrate-settings.test.ts:17` | Remaining hits are README (required untouched), product ID strings such as fr-wig-royal, a CSS transform class false positive, and test fixtures that are not rendered. |
| hype word | `tests/migrate-settings.test.ts:163` | Remaining hits are README (required untouched), product ID strings such as fr-wig-royal, a CSS transform class false positive, and test fixtures that are not rendered. |
| text over photo (absolute + text) | `src/components/products/ProductDetail.tsx:108` | A false positive: the absolute icon inside the loading spinner on the product image, not text over a photo. |

## Verification

Lint, typecheck, full tests, build and the mobile overflow check are recorded in the final delivery report. The design-shot script reports 48 screenshots and zero horizontal overflows for both before and after sets.
