/* ==========================================================================
   TekTrixa — Modern IT Product Store
   Main JavaScript: product data, cart (localStorage), rendering, UI events
   ========================================================================== */

/* ---------------------------------------------------------------------
   1. PRODUCT CATALOG
   Prices are in Bangladeshi Taka (৳). Edit / add products here.
   Each product needs a unique numeric "id".
   Optional fields: oldPrice (for discount badge), badge ("New"/"Hot"),
   gift (string shown as a gift-tag ribbon), earnPoints (loyalty points).
   "icon" is an emoji placeholder thumbnail — see README to swap for
   real product photos.
--------------------------------------------------------------------- */
const PRODUCTS = [
  { id: 1, name: "TekTrixa Core i5 Desktop PC", category: "desktop", price: 45999, oldPrice: 49999, icon: "🖥️", rating: 4.6, badge: "Sale" },
  { id: 2, name: "TekTrixa Ryzen 7 Gaming Desktop", category: "desktop", price: 89500, oldPrice: null, icon: "🖥️", rating: 4.8, badge: "New" },
  { id: 3, name: "TekTrixa AeroBook 14\" Ultrabook", category: "laptop", price: 62000, oldPrice: 68500, icon: "💻", rating: 4.5, badge: "Sale" },
  { id: 4, name: "TekTrixa ProBook 15.6\" Business Laptop", category: "laptop", price: 78900, oldPrice: null, icon: "💻", rating: 4.4, badge: null },
  { id: 5, name: "TekTrixa StormEdge RTX Gaming Laptop", category: "laptop", price: 145000, oldPrice: 159000, icon: "💻", rating: 4.9, badge: "Sale", gift: "Gaming Mouse" },
  { id: 6, name: "TekTrixa ViewMax 27\" 4K Monitor", category: "monitor", price: 32500, oldPrice: 36000, icon: "🖼️", rating: 4.6, badge: "Sale" },
  { id: 7, name: "TekTrixa CurveVision 24\" 165Hz Gaming Monitor", category: "monitor", price: 24900, oldPrice: null, icon: "🖼️", rating: 4.7, badge: "New" },
  { id: 8, name: "TekTrixa MeshLink AX3000 Wi-Fi Router", category: "networking", price: 8500, oldPrice: null, icon: "📡", rating: 4.4, badge: null },
  { id: 9, name: "TekTrixa 24-Port PoE Managed Switch", category: "networking", price: 15200, oldPrice: null, icon: "🔌", rating: 4.5, badge: null },
  { id: 10, name: "TekTrixa EyeGuard Dome CCTV Camera", category: "camera", price: 3450, oldPrice: null, icon: "📷", rating: 4.3, badge: null },
  { id: 11, name: "TekTrixa SecureNet 8CH NVR Kit", category: "camera", price: 22000, oldPrice: 25500, icon: "🎥", rating: 4.6, badge: "Sale" },
  { id: 12, name: "TekTrixa Windows 11 Pro License", category: "software", price: 14500, oldPrice: null, icon: "🪟", rating: 4.7, badge: null },
  { id: 13, name: "TekTrixa Office Suite 2025", category: "software", price: 6200, oldPrice: 7500, icon: "📊", rating: 4.5, badge: "Sale" },
  { id: 14, name: "TekTrixa RackServer T100", category: "server", price: 189000, oldPrice: null, icon: "🗄️", rating: 4.7, badge: null },
  { id: 15, name: "TekTrixa CloudBackup Pro (1 Yr)", category: "server", price: 9900, oldPrice: null, icon: "☁️", rating: 4.6, badge: "New", earnPoints: 90 },
  { id: 16, name: "TekTrixa StrikePad Mechanical Keyboard", category: "gaming", price: 4200, oldPrice: null, icon: "⌨️", rating: 4.5, badge: null, gift: "Mouse Pad" },
  { id: 17, name: "TekTrixa RapidClick Gaming Mouse", category: "gaming", price: 2100, oldPrice: 2600, icon: "🖱️", rating: 4.4, badge: "Sale" },
  { id: 18, name: "TekTrixa VisionPlus 43\" 4K Smart TV", category: "tv", price: 42500, oldPrice: 47000, icon: "📺", rating: 4.6, badge: "Sale" },
  { id: 19, name: "TekTrixa CoolBreeze Air Purifier", category: "tv", price: 11300, oldPrice: null, icon: "🌬️", rating: 4.3, badge: "New" },
  { id: 20, name: "TekTrixa PowerBank 20000mAh", category: "accessories", price: 1850, oldPrice: null, icon: "🔋", rating: 4.4, badge: null },
  { id: 21, name: "TekTrixa Wireless Earbuds Pro", category: "accessories", price: 3200, oldPrice: 3800, icon: "🎧", rating: 4.5, badge: "Sale", earnPoints: 40 },
];

const CATEGORY_LABELS = {
  desktop: "Desktop PC",
  laptop: "Laptop",
  monitor: "Monitor",
  networking: "Networking",
  camera: "Camera & Security",
  software: "Software",
  server: "Server & Storage",
  gaming: "Gaming",
  tv: "TV & Appliance",
  accessories: "Accessories & Gadget",
};

const CATEGORY_ICONS = {
  desktop: "🖥️", laptop: "💻", monitor: "🖼️", networking: "📡", camera: "📷",
  software: "🪟", server: "🗄️", gaming: "🎮", tv: "📺", accessories: "🎧",
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
    ? `<span class="badge ${p.badge === "Sale" ? "sale" : p.badge === "Hot" ? "hot" : ""}">${p.badge}</span>`
    : "";
  const giftHTML = p.gift ? `<div class="gift-tag">🎁 Gift: ${p.gift}</div>` : "";
  const priceHTML = p.oldPrice ? `<span class="old">${formatMoney(p.oldPrice)}</span>${formatMoney(p.price)}` : formatMoney(p.price);
  let saveHTML = "";
  if (p.oldPrice) {
    const save = p.oldPrice - p.price;
    const pct = Math.round((save / p.oldPrice) * 100);
    saveHTML = `<span class="product-save">Save: ${formatMoney(save)} (-${pct}%)</span>`;
  }
  const earnHTML = p.earnPoints ? `<span class="product-earn">⭐ Earn Point: ${p.earnPoints}</span>` : "";

  return `
    <div class="product-card" data-category="${p.category}" data-name="${p.name.toLowerCase()}">
      <div class="product-thumb">${badgeHTML}<span>${p.icon}</span>${giftHTML}</div>
      <div class="product-body">
        <span class="product-cat">${CATEGORY_LABELS[p.category] || p.category}</span>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-rating">${"★".repeat(Math.round(p.rating))}${"☆".repeat(5 - Math.round(p.rating))} <span style="color:#6f6a85">(${p.rating})</span></div>
        ${saveHTML}
        ${earnHTML}
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
    list = list.filter((p) => p.name.toLowerCase().includes(q));
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
  return `
    <tr>
      <td><div class="cart-item-info"><div class="cart-item-thumb">${product.icon}</div>
        <div><strong>${product.name}</strong><span>${CATEGORY_LABELS[product.category]}</span></div>
      </div></td>
      <td>${formatMoney(product.price)}</td>
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
  const shipping = subtotal > 0 ? 120 : 0;
  const total = subtotal + shipping;

  document.getElementById("cart-subtotal").textContent = formatMoney(subtotal);
  document.getElementById("cart-shipping").textContent = formatMoney(shipping);
  document.getElementById("cart-total").textContent = formatMoney(total);

  const checkoutBtn = document.getElementById("checkout-whatsapp-btn");
  if (checkoutBtn) checkoutBtn.href = buildWhatsAppCheckoutLink(cart, total);
  const emailBtn = document.getElementById("checkout-email-btn");
  if (emailBtn) emailBtn.href = buildEmailCheckoutLink(cart, total);
}

function buildWhatsAppCheckoutLink(cart, total) {
  let msg = "Hello TekTrixa, I'd like to order:%0A%0A";
  cart.forEach((item) => {
    const p = PRODUCTS.find((prod) => prod.id === item.id);
    if (p) msg += `- ${p.name} x${item.qty} (${formatMoney(p.price * item.qty)})%0A`;
  });
  msg += `%0ATotal (incl. delivery): ${formatMoney(total)}%0A%0APlease confirm availability and payment details.`;
  return `https://wa.me/${BUSINESS_WHATSAPP}?text=${msg}`;
}
function buildEmailCheckoutLink(cart, total) {
  let body = "Hello TekTrixa, I would like to order:%0D%0A%0D%0A";
  cart.forEach((item) => {
    const p = PRODUCTS.find((prod) => prod.id === item.id);
    if (p) body += `- ${p.name} x${item.qty} (${formatMoney(p.price * item.qty)})%0D%0A`;
  });
  body += `%0D%0ATotal (incl. delivery): ${formatMoney(total)}`;
  return `mailto:${BUSINESS_EMAIL}?subject=New Order Request&body=${body}`;
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
