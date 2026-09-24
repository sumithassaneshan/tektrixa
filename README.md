# TekTrixa — IT Product Store (Static Website)

A complete, ready-to-host **IT product selling website** for **TekTrixa**,
inspired by the layout/energy of leading Bangladeshi tech retailers (deal
badges, BDT pricing, mega-menu categories, physical store locator, gift &
loyalty-point promos) — built with plain HTML, CSS and JavaScript. No build
tools, frameworks, or backend required. Works perfectly on **GitHub Pages**
(free hosting).

## What's included

| File | Purpose |
|---|---|
| `index.html` | Home page — auto-rotating hero slider, quick category icons, store locator banner, featured deals, testimonials |
| `products.html` | Full product catalog — 21 sample products across 10 categories, with filters, search & sorting |
| `cart.html` | Shopping cart (saved in the browser) with WhatsApp/Email checkout |
| `about.html` | Company page — mission, team, and store branch locator |
| `contact.html` | Contact page with form + embedded map |
| `css/style.css` | All styling (purple/orange brand theme, responsive layout) |
| `js/script.js` | Product data, cart logic, hero slider, filtering — all site interactivity |

## How the "store" works (important — read this)

GitHub Pages only serves **static files** — there's no database or payment
backend. So this site works as follows:

- All products are defined in a JavaScript array (`PRODUCTS` in `js/script.js`), priced in **৳ (BDT)**.
- The cart is saved in the visitor's browser using `localStorage` (no server needed).
- Checkout does **not** process payment directly. Clicking "Checkout via
  WhatsApp" or "Checkout via Email" opens a pre-filled order message sent
  straight to your business number/email, so you can confirm the order and
  arrange payment manually (bKash, Nagad, bank transfer, cash on delivery,
  etc.) — the standard pattern for small/medium IT resellers in Bangladesh.

If you later want **real online payments**, you'd need a payment gateway
(SSLCommerz, bKash Merchant API, Stripe, etc.), which requires a small
backend — happy to help with that separately if needed.

## 1. Customize before publishing

Open `js/script.js` and edit the top section:

```js
const BUSINESS_WHATSAPP = "8801XXXXXXXXX"; // your WhatsApp number, country code, no +/spaces
const BUSINESS_EMAIL = "sales@tektrixa.com";
```

Edit the `PRODUCTS` array to add/remove/change your real products (name,
category, price, oldPrice for discounts, badge, gift, rating). Each product
needs a unique `id`.

Search-and-replace across all `.html` files:
- `+880 1XXX-XXXXXX` → your real phone number
- `sales@tektrixa.com` → your real email
- `House 12, Road 5, Dhanmondi, Dhaka, Bangladesh` → your real address
- Branch names in `about.html` and the home page store banner → your real store locations
- `TX` (in `logo-mark`) → your initials/logo letters, or replace with an `<img>` logo

### Using real product photos instead of emoji icons
Currently products use emoji (💻🖥️📡) as lightweight placeholder thumbnails
so the site works instantly with zero setup. To use real photos:
1. Create an `images/` folder and add your photos (e.g. `images/laptop-1.jpg`).
2. In `js/script.js`, add an `img` field to a product, e.g. `img: "images/laptop-1.jpg"`.
3. In the `productCardHTML()` function in `js/script.js`, replace:
   `<span>${p.icon}</span>` with `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">`

### Making the contact form actually send you emails
The contact form currently just shows a "Message sent" confirmation (no
backend to send it). To receive real submissions for free:
1. Sign up at [Formspree](https://formspree.io) (free tier available).
2. Create a form, copy your endpoint URL (e.g. `https://formspree.io/f/xxxxxxx`).
3. In `contact.html`, change `<form onsubmit="handleContactSubmit(event)">` to:
   `<form action="https://formspree.io/f/xxxxxxx" method="POST">`
4. Remove the `onsubmit` handler so it submits normally.

## 2. Host it for free on GitHub Pages

1. **Create/use your GitHub repository** (must be **public** for free Pages) — e.g. `tektrixa`.
2. **Upload all files**, keeping the folder structure intact: `css/style.css`,
   `js/script.js`, and the `.html` files at the repo root.
   - ⚠️ If uploading via the GitHub website, make sure you drag the **`css`
     and `js` folders themselves** (not just the loose files) — folder
     drag-and-drop is supported in Chrome/Edge. Verify afterward that `css`
     and `js` appear as folders in your repo's file list.
   - For a more reliable method, use Git from the command line (see below).
3. Go to your repo → **Settings → Pages**.
4. Under "Build and deployment": **Source: Deploy from a branch**, **Branch:
   main**, folder **/ (root)** → **Save**.
5. Check the **Actions** tab — a "pages build and deployment" workflow should
   run and turn green within ~1 minute.
6. Your live URL will look like: `https://yourusername.github.io/tektrixa/`

### Connecting your own domain (since you already own one)
1. In **Settings → Pages**, enter your domain in **Custom domain** (e.g.
   `tektrixa.com`) → **Save** — this auto-creates a `CNAME` file in your repo.
2. At your domain registrar's DNS settings, add:
   - **Apex domain** (`tektrixa.com`): four **A records** at host `@` pointing to:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **www subdomain**: a **CNAME record** pointing to `yourusername.github.io`
3. Wait for DNS to propagate (minutes to ~24 hrs), then check **"Enforce
   HTTPS"** in Settings → Pages once the green checkmark appears.

## 3. Test locally before publishing (optional)
```
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

## Quick command-line push example (most reliable method)
```bash
git clone https://github.com/YOUR-USERNAME/tektrixa.git
cd tektrixa
# copy all files from this project here (css/, js/, *.html, README.md)
git add .
git commit -m "Full TekTrixa site redesign with css and js"
git push
```

---
Built as a fully static, framework-free site — easy to customize, fast to
load, and free to host indefinitely on GitHub Pages.
