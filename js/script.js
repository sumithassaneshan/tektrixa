/* ==========================================================================
   TekTrixa — Domains, Hosting, Cloud Storage, Software, Accessories & IT Services
   Main JavaScript: product data, cart (localStorage), rendering, UI events
   ========================================================================== */

/* ---------------------------------------------------------------------
   1. PRODUCT / SERVICE CATALOG
   Prices are in Bangladeshi Taka (৳). Edit / add items here.
   Each item needs a unique numeric "id".
   Fields:
     unit       -> billing unit shown after price, e.g. "/year", "/month",
                   "one-time" (leave "" if not needed — e.g. accessories)
     oldPrice   -> shows a strikethrough + "Save" badge if set
     badge      -> "New" / "Popular" / "Sale" ribbon (optional)
     icon       -> emoji placeholder thumbnail (swap for real logos/photos —
                   see README)
   ONLY 6 CATEGORIES ARE USED SITE-WIDE (per current business scope):
     domain | hosting | cloudstorage | software | accessories | itservices
--------------------------------------------------------------------- */
const PRODUCTS = [
  /* ---------------- Domain ---------------- */
  { id: 1, name: ".com Domain Registration", category: "domain", price: 1200, unit: "/year", icon: "🌐", rating: 4.7, badge: "Popular", desc: "The most popular and trusted global domain extension." },
  { id: 2, name: ".net Domain Registration", category: "domain", price: 1400, unit: "/year", icon: "🌐", rating: 4.4, desc: "A great alternative extension for tech & network businesses." },
  { id: 3, name: ".org Domain Registration", category: "domain", price: 1400, unit: "/year", icon: "🌐", rating: 4.4, desc: "Ideal for non-profits, communities and organizations." },
  { id: 4, name: ".info Domain Registration", category: "domain", price: 999, unit: "/year", icon: "🌐", rating: 4.2, desc: "Affordable extension, well-suited for informational sites." },
  { id: 5, name: ".biz Domain Registration", category: "domain", price: 1300, unit: "/year", icon: "🌐", rating: 4.2, desc: "Extension purpose-built for business websites." },
  { id: 6, name: ".bd Domain Registration", category: "domain", price: 2500, unit: "/year", icon: "🌐", rating: 4.3, desc: "Bangladesh's national domain extension." },
  { id: 7, name: ".com.bd Domain Registration", category: "domain", price: 1800, unit: "/year", icon: "🌐", rating: 4.5, badge: "Popular", desc: "Popular local extension for Bangladeshi businesses." },
  { id: 8, name: "Domain Transfer", category: "domain", price: 999, unit: "one-time", icon: "🌐", rating: 4.3, desc: "Move your existing domain to our management platform." },
  { id: 9, name: "Domain Renewal", category: "domain", price: 1200, unit: "/year", icon: "🌐", rating: 4.4, desc: "Renew your existing domain registration with us." },
  { id: 10, name: "Domain Privacy Protection", category: "domain", price: 500, unit: "/year", icon: "🌐", rating: 4.3, desc: "Hide your personal WHOIS contact details from public view." },

  /* ---------------- Hosting ---------------- */
  { id: 11, name: "1 GB Web Hosting", category: "hosting", price: 999, unit: "/year", icon: "🏠", rating: 4.2, desc: "Perfect for small brochure sites and personal blogs." },
  { id: 12, name: "2 GB Web Hosting", category: "hosting", price: 1499, unit: "/year", icon: "🏠", rating: 4.3, badge: "Popular", desc: "Great fit for small business websites with moderate traffic." },
  { id: 13, name: "5 GB Web Hosting", category: "hosting", price: 2499, unit: "/year", icon: "🏠", rating: 4.5, desc: "Ideal for growing websites, portfolios and small stores." },
  { id: 14, name: "10 GB Web Hosting", category: "hosting", price: 3999, unit: "/year", icon: "🏠", rating: 4.6, badge: "New", desc: "High-capacity hosting for busy business websites." },

  /* ---------------- Cloud Storage ---------------- */
  { id: 15, name: "Google Drive 2 TB", category: "cloudstorage", price: 2500, unit: "/year", icon: "☁️", rating: 4.5, desc: "Extra Google Drive storage for personal or team files." },
  { id: 16, name: "Google Drive 5 TB", category: "cloudstorage", price: 5500, unit: "/year", icon: "☁️", rating: 4.6, badge: "Popular", desc: "Large-capacity Google Drive storage plan." },
  { id: 17, name: "OneDrive 1 TB", category: "cloudstorage", price: 1800, unit: "/year", icon: "☁️", rating: 4.5, desc: "Personal OneDrive storage upgrade with Office apps included." },
  { id: 18, name: "OneDrive 5 TB", category: "cloudstorage", price: 6500, unit: "/year", icon: "☁️", rating: 4.6, desc: "High-capacity OneDrive storage for teams and businesses." },

  /* ---------------- Software ---------------- */
  { id: 19, name: "Microsoft 365 Apps", category: "software", price: 4500, unit: "/year", icon: "💿", rating: 4.7, badge: "Popular", desc: "Word, Excel, PowerPoint & Outlook with 1TB OneDrive storage." },
  { id: 20, name: "Windows 11 Home", category: "software", price: 8500, unit: "one-time", icon: "💿", rating: 4.5, desc: "Genuine retail license for personal computers." },
  { id: 21, name: "Windows 11 Pro", category: "software", price: 13500, unit: "one-time", icon: "💿", rating: 4.7, badge: "Popular", desc: "Advanced features including BitLocker and Remote Desktop." },
  { id: 22, name: "Office LTSC", category: "software", price: 24000, unit: "one-time", icon: "💿", rating: 4.4, desc: "One-time purchase Office suite — no subscription required." },
  { id: 23, name: "Microsoft Visio", category: "software", price: 18000, unit: "/year", icon: "💿", rating: 4.3, desc: "Professional diagramming and flowchart software." },
  { id: 24, name: "Microsoft Project", category: "software", price: 22000, unit: "/year", icon: "💿", rating: 4.4, desc: "Project planning and management software for teams." },
  { id: 25, name: "Adobe Acrobat", category: "software", price: 9500, unit: "/year", icon: "💿", rating: 4.5, desc: "Create, edit and sign PDF documents professionally." },
  { id: 26, name: "PDF Software", category: "software", price: 2500, unit: "one-time", icon: "💿", rating: 4.2, desc: "Lightweight PDF editing and conversion tool." },

  /* ---------------- Accessories ---------------- */
  { id: 27, name: "Mouse", category: "accessories", price: 450, unit: "", icon: "🖱️", rating: 4.3, desc: "Reliable wired or wireless mouse for everyday use." },
  { id: 28, name: "Keyboard", category: "accessories", price: 1200, unit: "", icon: "⌨️", rating: 4.4, desc: "Comfortable keyboard for office and home use." },
  { id: 29, name: "Mouse Pad", category: "accessories", price: 250, unit: "", icon: "🖱️", rating: 4.2, desc: "Smooth-surface mouse pad for precise tracking." },
  { id: 30, name: "Keyboard + Mouse Combo", category: "accessories", price: 1500, unit: "", icon: "⌨️", rating: 4.4, badge: "Popular", desc: "Matching wireless keyboard and mouse set." },
  { id: 31, name: "Laptop Charger", category: "accessories", price: 1500, unit: "", icon: "🔌", rating: 4.3, desc: "Universal replacement laptop charger." },
  { id: 32, name: "USB-C Charger", category: "accessories", price: 1200, unit: "", icon: "🔌", rating: 4.4, desc: "Fast-charging USB-C power adapter." },
  { id: 33, name: "Power Adapter", category: "accessories", price: 900, unit: "", icon: "🔌", rating: 4.1, desc: "Standard power adapter for desktops and monitors." },
  { id: 34, name: "Bluetooth Speaker", category: "accessories", price: 2200, unit: "", icon: "🔊", rating: 4.4, desc: "Portable speaker with rich bass and long battery life." },
  { id: 35, name: "Headset", category: "accessories", price: 1800, unit: "", icon: "🎧", rating: 4.3, desc: "Comfortable headset ideal for calls and meetings." },
  { id: 36, name: "Webcam", category: "accessories", price: 2500, unit: "", icon: "📷", rating: 4.5, badge: "New", desc: "1080p webcam for video calls and online meetings." },
  { id: 37, name: "USB Hub", category: "accessories", price: 950, unit: "", icon: "🔌", rating: 4.2, desc: "Expand your laptop's USB connectivity instantly." },
  { id: 38, name: "HDMI Cable", category: "accessories", price: 450, unit: "", icon: "🔌", rating: 4.2, desc: "High-speed HDMI cable for monitors and displays." },
  { id: 39, name: "USB-C Cable", category: "accessories", price: 350, unit: "", icon: "🔌", rating: 4.3, desc: "Durable fast-charging and data transfer cable." },
  { id: 40, name: "Wi-Fi Adapter", category: "accessories", price: 1100, unit: "", icon: "📶", rating: 4.2, desc: "Add Wi-Fi connectivity to any desktop PC." },
  { id: 41, name: "Bluetooth Adapter", category: "accessories", price: 650, unit: "", icon: "📶", rating: 4.1, desc: "Add Bluetooth support to desktops without it." },
  { id: 42, name: "Laptop Stand", category: "accessories", price: 1400, unit: "", icon: "💻", rating: 4.4, desc: "Ergonomic stand to improve posture and airflow." },
  { id: 43, name: "Cooling Pad", category: "accessories", price: 1600, unit: "", icon: "💻", rating: 4.3, desc: "Dual-fan cooling pad to prevent overheating." },
  { id: 44, name: "Power Bank", category: "accessories", price: 1850, oldPrice: 2200, unit: "", icon: "🔋", rating: 4.4, badge: "Sale", desc: "High-capacity power bank for phones and laptops." },

  /* ---------------- Cloud & IT Services ---------------- */
  { id: 45, name: "Microsoft 365 Setup", category: "itservices", price: 5000, unit: "one-time", icon: "🛠️", rating: 4.7, desc: "Complete tenant setup, domain verification & user provisioning." },
  { id: 46, name: "Microsoft 365 Migration", category: "itservices", price: 15000, unit: "one-time", icon: "🛠️", rating: 4.6, desc: "Migrate mailboxes, files and data into Microsoft 365 safely." },
  { id: 47, name: "Google Workspace Migration", category: "itservices", price: 15000, unit: "one-time", icon: "🛠️", rating: 4.5, desc: "Migrate your existing setup into Google Workspace." },
  { id: 48, name: "Google → Microsoft 365 Migration", category: "itservices", price: 20000, unit: "one-time", icon: "🛠️", rating: 4.6, desc: "Full migration from Google Workspace to Microsoft 365." },
  { id: 49, name: "Email Migration", category: "itservices", price: 8000, unit: "one-time", icon: "🛠️", rating: 4.5, desc: "Move mailboxes between providers with zero data loss." },
  { id: 50, name: "Microsoft Intune Deployment", category: "itservices", price: 25000, unit: "one-time", icon: "🛠️", rating: 4.6, badge: "New", desc: "Deploy device management and security policies via Intune." },
  { id: 51, name: "Azure Deployment", category: "itservices", price: 30000, unit: "one-time", icon: "🛠️", rating: 4.7, desc: "Design and deploy your infrastructure on Microsoft Azure." },
  { id: 52, name: "Azure VM Setup", category: "itservices", price: 12000, unit: "one-time", icon: "🛠️", rating: 4.5, desc: "Provision and configure virtual machines on Azure." },
  { id: 53, name: "SharePoint Setup", category: "itservices", price: 18000, unit: "one-time", icon: "🛠️", rating: 4.5, desc: "Build document libraries, sites and collaboration spaces." },
  { id: 54, name: "OneDrive Setup", category: "itservices", price: 6000, unit: "one-time", icon: "🛠️", rating: 4.4, desc: "Configure sync, sharing and backup policies for OneDrive." },
  { id: 55, name: "Domain & DNS Setup", category: "itservices", price: 3000, unit: "one-time", icon: "🛠️", rating: 4.4, desc: "Configure DNS records for email, hosting and verification." },
  { id: 56, name: "Business Email Setup", category: "itservices", price: 5000, unit: "one-time", icon: "🛠️", rating: 4.5, badge: "Popular", desc: "Set up professional email on your own domain." },
  { id: 57, name: "Microsoft 365 Administration", category: "itservices", price: 10000, unit: "/month", icon: "🛠️", rating: 4.6, desc: "Ongoing tenant management, support and user administration." },
];

/* Only these 6 categories are used site-wide. Edit labels/icons here if
   you rename a category — update it in ONE place and it applies everywhere. */
const CATEGORY_LABELS = {
  domain: "Domain",
  hosting: "Hosting",
  cloudstorage: "Cloud Storage",
  software: "Software",
  accessories: "Accessories",
  itservices: "Cloud & IT Services",
};

const CATEGORY_ICONS = {
  domain: "🌐",
  hosting: "🏠",
  cloudstorage: "☁️",
  software: "💿",
  accessories: "🖱️",
  itservices: "🛠️",
};

/* Business contact info used for the "Checkout via WhatsApp" flow.
   IMPORTANT: replace with your real number / email before publishing. */
const BUSINESS_WHATSAPP = "8801XXXXXXXXX"; // country code + number, no + or spaces
const BUSINESS_EMAIL = "sales@tektrixa.com";
const CURRENCY = "৳";

function formatMoney(n) {
  return CURRENCY + Number(n).toLocaleString("en-IN");
}

/* ---------------------------------------------------------------------
   2. CART STATE (persisted in localStorage)
--------------------------------------------------------------------- */
const CART_KEY = "tektrixa_cart";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch (e) { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}
function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) existing.qty += qty; else cart.push({ id: productId, qty });
  saveCart(cart);
  const product = PRODUCTS.find((p) => p.id === productId);
  showToast(`${product ? product.name : "Item"} added to cart`);
}
function removeFromCart(productId) {
  let cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  renderCartPage();
}
function updateQty(productId, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(productId); return; }
  saveCart(cart);
  renderCartPage();
}
function cartTotalCount() { return getCart().reduce((sum, item) => sum + item.qty, 0); }
function cartSubtotal() {
  return getCart().reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}
function updateCartCount() {
  document.querySelectorAll(".cart-count").forEach((el) => { el.textContent = cartTotalCount(); });
}

/* ---------------------------------------------------------------------
   3. RENDERING: Product cards
--------------------------------------------------------------------- */
function productCardHTML(p) {
  const badgeHTML = p.badge
    ? `<span class="badge ${p.badge === "Sale" ? "sale" : p.badge === "Popular" ? "hot" : ""}">${p.badge}</span>`
    : "";
  const unitHTML = p.unit ? `<span class="unit">${p.unit}</span>` : "";
  const priceHTML = p.oldPrice
    ? `<span class="old">${formatMoney(p.oldPrice)}</span>${formatMoney(p.price)}${unitHTML}`
    : `${formatMoney(p.price)}${unitHTML}`;
  let saveHTML = "";
  if (p.oldPrice) {
    const save = p.oldPrice - p.price;
    const pct = Math.round((save / p.oldPrice) * 100);
    saveHTML = `<span class="product-save">Save: ${formatMoney(save)} (-${pct}%)</span>`;
  }

  return `
    <div class="product-card" data-category="${p.category}" data-name="${p.name.toLowerCase()}">
      <div class="product-thumb">${badgeHTML}<span>${p.icon}</span></div>
      <div class="product-body">
        <span class="product-cat">${CATEGORY_LABELS[p.category] || p.category}</span>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc || ""}</p>
        <div class="product-rating">${"★".repeat(Math.round(p.rating))}${"☆".repeat(5 - Math.round(p.rating))} <span style="color:#6f6a85">(${p.rating})</span></div>
        ${saveHTML}
        <div class="product-footer">
          <div class="product-price">${priceHTML}</div>
          <button class="add-cart-btn" onclick="addToCart(${p.id})" title="Add to cart">+</button>
        </div>
      </div>
    </div>`;
}

function renderProductGrid(containerId, list) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (list.length === 0) {
    el.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#6f6a85;padding:40px 0;">No products found matching your criteria.</p>`;
    return;
  }
  el.innerHTML = list.map(productCardHTML).join("");
}

function renderFeaturedProducts() {
  const el = document.getElementById("featured-products");
  if (!el) return;
  const featured = PRODUCTS.filter((p) => p.badge).slice(0, 8);
  renderProductGrid("featured-products", featured.length ? featured : PRODUCTS.slice(0, 8));
}

let currentFilter = "all";
let currentSort = "default";
let currentSearch = "";

function applyProductFilters() {
  let list = [...PRODUCTS];
  if (currentFilter !== "all") list = list.filter((p) => p.category === currentFilter);
  if (currentSearch.trim() !== "") {
    const q = currentSearch.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q) || (p.desc || "").toLowerCase().includes(q));
  }
  if (currentSort === "price-asc") list.sort((a, b) => a.price - b.price);
  if (currentSort === "price-desc") list.sort((a, b) => b.price - a.price);
  if (currentSort === "rating") list.sort((a, b) => b.rating - a.rating);
  renderProductGrid("all-products", list);
}

function initProductsPage() {
  const grid = document.getElementById("all-products");
  if (!grid) return;
  renderProductGrid("all-products", PRODUCTS);

  document.querySelectorAll(".filter-tabs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-tabs button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      applyProductFilters();
    });
  });

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) sortSelect.addEventListener("change", (e) => { currentSort = e.target.value; applyProductFilters(); });

  document.querySelectorAll(".site-search").forEach((input) => {
    input.addEventListener("input", (e) => { currentSearch = e.target.value; applyProductFilters(); });
  });
}

/* ---------------------------------------------------------------------
   4. RENDERING: Cart page
--------------------------------------------------------------------- */
function cartRowHTML(item) {
  const product = PRODUCTS.find((p) => p.id === item.id);
  if (!product) return "";
  const unitText = product.unit ? ` ${product.unit}` : "";
  return `
    <tr>
      <td><div class="cart-item-info"><div class="cart-item-thumb">${product.icon}</div>
        <div><strong>${product.name}</strong><span>${CATEGORY_LABELS[product.category]}</span></div>
      </div></td>
      <td>${formatMoney(product.price)}<span class="unit">${unitText}</span></td>
      <td><div class="qty-control">
        <button onclick="updateQty(${product.id}, -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="updateQty(${product.id}, 1)">+</button>
      </div></td>
      <td>${formatMoney(product.price * item.qty)}</td>
      <td><button class="remove-btn" onclick="removeFromCart(${product.id})">Remove</button></td>
    </tr>`;
}

function renderCartPage() {
  const tbody = document.getElementById("cart-items-body");
  const emptyState = document.getElementById("empty-cart-state");
  const cartContent = document.getElementById("cart-content");
  if (!tbody) return;

  const cart = getCart();
  if (cart.length === 0) {
    if (cartContent) cartContent.style.display = "none";
    if (emptyState) emptyState.style.display = "block";
    return;
  }
  if (cartContent) cartContent.style.display = "grid";
  if (emptyState) emptyState.style.display = "none";

  tbody.innerHTML = cart.map(cartRowHTML).join("");

  const subtotal = cartSubtotal();
  document.getElementById("cart-subtotal").textContent = formatMoney(subtotal);
  document.getElementById("cart-total").textContent = formatMoney(subtotal);

  const checkoutBtn = document.getElementById("checkout-whatsapp-btn");
  if (checkoutBtn) checkoutBtn.href = buildWhatsAppCheckoutLink(cart, subtotal);
  const emailBtn = document.getElementById("checkout-email-btn");
  if (emailBtn) emailBtn.href = buildEmailCheckoutLink(cart, subtotal);
}

function buildWhatsAppCheckoutLink(cart, total) {
  let msg = "Hello TekTrixa, I'd like to order/request a quote for:%0A%0A";
  cart.forEach((item) => {
    const p = PRODUCTS.find((prod) => prod.id === item.id);
    if (p) msg += `- ${p.name} x${item.qty} (${formatMoney(p.price * item.qty)}${p.unit ? " " + p.unit : ""})%0A`;
  });
  msg += `%0AEstimated Total: ${formatMoney(total)}%0A%0APlease confirm availability, billing terms and payment details.`;
  return `https://wa.me/${BUSINESS_WHATSAPP}?text=${msg}`;
}
function buildEmailCheckoutLink(cart, total) {
  let body = "Hello TekTrixa, I would like to order/request a quote for:%0D%0A%0D%0A";
  cart.forEach((item) => {
    const p = PRODUCTS.find((prod) => prod.id === item.id);
    if (p) body += `- ${p.name} x${item.qty} (${formatMoney(p.price * item.qty)}${p.unit ? " " + p.unit : ""})%0D%0A`;
  });
  body += `%0D%0AEstimated Total: ${formatMoney(total)}`;
  return `mailto:${BUSINESS_EMAIL}?subject=New Order / Quote Request&body=${body}`;
}

/* ---------------------------------------------------------------------
   5. UI: navigation, hero slider, toast, forms
--------------------------------------------------------------------- */
function toggleMobileNav() { document.getElementById("mobile-nav")?.classList.toggle("open"); }

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerHTML = `<span class="icon">✓</span> ${message}`;
  toast.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function handleNewsletterSubmit(e) {
  e.preventDefault();
  showToast("Thanks for subscribing! 🎉");
  e.target.reset();
}
function handleContactSubmit(e) {
  e.preventDefault();
  showToast("Message sent! We'll get back to you within 24 hours.");
  e.target.reset();
}

/* --- Hero Slider --- */
let heroIndex = 0;
let heroTimer = null;
function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dots button");
  if (!slides.length) return;

  function show(i) {
    slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
    dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
    heroIndex = i;
  }
  function next() { show((heroIndex + 1) % slides.length); }
  function prev() { show((heroIndex - 1 + slides.length) % slides.length); }

  dots.forEach((d, idx) => d.addEventListener("click", () => { show(idx); resetTimer(); }));
  document.querySelector(".hero-arrow.next")?.addEventListener("click", () => { next(); resetTimer(); });
  document.querySelector(".hero-arrow.prev")?.addEventListener("click", () => { prev(); resetTimer(); });

  function resetTimer() { clearInterval(heroTimer); heroTimer = setInterval(next, 5500); }
  resetTimer();
}

/* ---------------------------------------------------------------------
   6. INIT
--------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderFeaturedProducts();
  initProductsPage();
  renderCartPage();
  initHeroSlider();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
