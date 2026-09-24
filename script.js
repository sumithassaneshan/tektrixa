/* ==========================================================================
   NexaTech Solutions - IT Product Store
   Main JavaScript: product data, cart (localStorage), rendering, UI events
   ========================================================================== */

/* ---------------------------------------------------------------------
   1. PRODUCT CATALOG
   Edit / add products here. Each product needs a unique numeric "id".
   "icon" is an emoji shown as a placeholder thumbnail — swap the
   .product-thumb / .cart-item-thumb markup for <img> tags if you have
   real product photos (see README for instructions).
--------------------------------------------------------------------- */
const PRODUCTS = [
  { id: 1, name: "NovaBook Pro 14\"", category: "laptops", price: 1299, oldPrice: 1499, icon: "💻", rating: 4.8, desc: "Intel i7, 16GB RAM, 512GB SSD, ideal for business & development.", badge: "New" },
  { id: 2, name: "NovaBook Air 13\"", category: "laptops", price: 899, oldPrice: null, icon: "💻", rating: 4.6, desc: "Ultra-light design, all-day battery, perfect for professionals on the go.", badge: null },
  { id: 3, name: "EliteBook Workstation 15\"", category: "laptops", price: 1899, oldPrice: 2099, icon: "💻", rating: 4.9, desc: "RTX graphics, 32GB RAM — built for CAD, rendering & AI workloads.", badge: "Sale" },
  { id: 4, name: "RackServer X200", category: "servers", price: 3499, oldPrice: null, icon: "🖥️", rating: 4.7, desc: "Dual Xeon CPUs, 64GB ECC RAM, hot-swap storage bays.", badge: null },
  { id: 5, name: "RackServer Mini S1", category: "servers", price: 1799, oldPrice: null, icon: "🖥️", rating: 4.5, desc: "Compact 1U server, ideal for SMB infrastructure & backup.", badge: null },
  { id: 6, name: "CloudSync Storage Array", category: "servers", price: 2599, oldPrice: 2899, icon: "🗄️", rating: 4.6, desc: "12-bay NAS with RAID 6, built for enterprise backups.", badge: "Sale" },
  { id: 7, name: "GigaLink Pro Router", category: "networking", price: 249, oldPrice: null, icon: "📡", rating: 4.4, desc: "Wi-Fi 6E, mesh-ready, enterprise-grade firewall built in.", badge: "New" },
  { id: 8, name: "24-Port Managed Switch", category: "networking", price: 389, oldPrice: null, icon: "🔌", rating: 4.5, desc: "Layer 3 managed switch with PoE+ support for office networks.", badge: null },
  { id: 9, name: "SecureGate Firewall Appliance", category: "networking", price: 699, oldPrice: 799, icon: "🛡️", rating: 4.7, desc: "Next-gen firewall with intrusion prevention & VPN support.", badge: "Sale" },
  { id: 10, name: "Windows Server 2025 License", category: "software", price: 999, oldPrice: null, icon: "🪟", rating: 4.6, desc: "Standard edition, 16-core license, includes CALs support.", badge: null },
  { id: 11, name: "Office 365 Business (1 Yr)", category: "software", price: 149, oldPrice: 179, icon: "📊", rating: 4.8, desc: "Full productivity suite with cloud storage & Teams included.", badge: "Sale" },
  { id: 12, name: "EndPoint Security Suite", category: "software", price: 59, oldPrice: null, icon: "🔒", rating: 4.5, desc: "Antivirus, ransomware protection & device management per seat.", badge: null },
  { id: 13, name: "CloudHost Pro Plan (1 Yr)", category: "cloud", price: 499, oldPrice: null, icon: "☁️", rating: 4.7, desc: "Scalable VM hosting, 24/7 monitoring & daily backups.", badge: "New" },
  { id: 14, name: "Managed Backup & DR Service", category: "cloud", price: 299, oldPrice: 349, icon: "💾", rating: 4.6, desc: "Automated cloud backups with 1-hour disaster recovery SLA.", badge: "Sale" },
  { id: 15, name: "UltraView 27\" 4K Monitor", category: "accessories", price: 379, oldPrice: null, icon: "🖥️", rating: 4.7, desc: "4K UHD IPS display with USB-C docking, ideal for creators.", badge: null },
  { id: 16, name: "Wireless Combo Keyboard & Mouse", category: "accessories", price: 49, oldPrice: 59, icon: "⌨️", rating: 4.3, desc: "Ergonomic wireless set with silent keys & long battery life.", badge: "Sale" },
];

const CATEGORY_LABELS = {
  laptops: "Laptops",
  servers: "Servers & Storage",
  networking: "Networking",
  software: "Software Licenses",
  cloud: "Cloud Services",
  accessories: "Accessories",
};

/* Business contact info used for the "Checkout via WhatsApp" flow.
   IMPORTANT: replace with your real number / email before publishing. */
const BUSINESS_WHATSAPP = "8801XXXXXXXXX"; // country code + number, no + or spaces
const BUSINESS_EMAIL = "sales@yourcompany.com";

/* ---------------------------------------------------------------------
   2. CART STATE (persisted in localStorage)
--------------------------------------------------------------------- */
const CART_KEY = "nexatech_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart(cart);
  const product = PRODUCTS.find((p) => p.id === productId);
  showToast(`${product ? product.name : "Item"} added to cart`);
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
  renderCartPage();
}

function updateQty(productId, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart(cart);
  renderCartPage();
}

function cartTotalCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function cartSubtotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function updateCartCount() {
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = cartTotalCount();
  });
}

/* ---------------------------------------------------------------------
   3. RENDERING: Product cards (home + products page)
--------------------------------------------------------------------- */
function productCardHTML(p) {
  const badgeHTML = p.badge
    ? `<span class="badge ${p.badge === "Sale" ? "sale" : ""}">${p.badge}</span>`
    : "";
  const priceHTML = p.oldPrice
    ? `<span class="old">$${p.oldPrice}</span>$${p.price}`
    : `$${p.price}`;
  return `
    <div class="product-card" data-category="${p.category}" data-name="${p.name.toLowerCase()}">
      <div class="product-thumb">${badgeHTML}<span>${p.icon}</span></div>
      <div class="product-body">
        <span class="product-cat">${CATEGORY_LABELS[p.category] || p.category}</span>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-rating">${"★".repeat(Math.round(p.rating))}${"☆".repeat(5 - Math.round(p.rating))} <span style="color:#667085">(${p.rating})</span></div>
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
    el.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#667085;padding:40px 0;">No products found matching your criteria.</p>`;
    return;
  }
  el.innerHTML = list.map(productCardHTML).join("");
}

/* Home page: show a handful of featured products */
function renderFeaturedProducts() {
  const el = document.getElementById("featured-products");
  if (!el) return;
  const featured = PRODUCTS.filter((p) => p.badge).slice(0, 8);
  renderProductGrid("featured-products", featured.length ? featured : PRODUCTS.slice(0, 8));
}

/* Products page: full catalog with filter + search + sort */
let currentFilter = "all";
let currentSort = "default";
let currentSearch = "";

function applyProductFilters() {
  let list = [...PRODUCTS];
  if (currentFilter !== "all") {
    list = list.filter((p) => p.category === currentFilter);
  }
  if (currentSearch.trim() !== "") {
    const q = currentSearch.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
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
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      applyProductFilters();
    });
  }

  const searchInputs = document.querySelectorAll(".site-search");
  searchInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      currentSearch = e.target.value;
      applyProductFilters();
    });
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
      <td>
        <div class="cart-item-info">
          <div class="cart-item-thumb">${product.icon}</div>
          <div>
            <strong>${product.name}</strong>
            <span>${CATEGORY_LABELS[product.category]}</span>
          </div>
        </div>
      </td>
      <td>$${product.price}</td>
      <td>
        <div class="qty-control">
          <button onclick="updateQty(${product.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="updateQty(${product.id}, 1)">+</button>
        </div>
      </td>
      <td>$${(product.price * item.qty).toFixed(2)}</td>
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
  const shipping = subtotal > 0 ? 25 : 0;
  const total = subtotal + shipping;

  document.getElementById("cart-subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("cart-shipping").textContent = `$${shipping.toFixed(2)}`;
  document.getElementById("cart-total").textContent = `$${total.toFixed(2)}`;

  const checkoutBtn = document.getElementById("checkout-whatsapp-btn");
  if (checkoutBtn) {
    checkoutBtn.href = buildWhatsAppCheckoutLink(cart, total);
  }
  const emailBtn = document.getElementById("checkout-email-btn");
  if (emailBtn) {
    emailBtn.href = buildEmailCheckoutLink(cart, total);
  }
}

/* Build a pre-filled WhatsApp message so customers can "checkout" by
   sending the order directly to your business number. This lets the
   site work as a full storefront without needing a paid backend. */
function buildWhatsAppCheckoutLink(cart, total) {
  let msg = "Hello NexaTech Solutions, I'd like to order:%0A%0A";
  cart.forEach((item) => {
    const p = PRODUCTS.find((prod) => prod.id === item.id);
    if (p) msg += `- ${p.name} x${item.qty} ($${(p.price * item.qty).toFixed(2)})%0A`;
  });
  msg += `%0ATotal (incl. shipping): $${total.toFixed(2)}%0A%0APlease confirm availability and payment details.`;
  return `https://wa.me/${BUSINESS_WHATSAPP}?text=${msg}`;
}

function buildEmailCheckoutLink(cart, total) {
  let body = "Hello NexaTech Solutions, I would like to order:%0D%0A%0D%0A";
  cart.forEach((item) => {
    const p = PRODUCTS.find((prod) => prod.id === item.id);
    if (p) body += `- ${p.name} x${item.qty} ($${(p.price * item.qty).toFixed(2)})%0D%0A`;
  });
  body += `%0D%0ATotal (incl. shipping): $${total.toFixed(2)}`;
  return `mailto:${BUSINESS_EMAIL}?subject=New Order Request&body=${body}`;
}

/* ---------------------------------------------------------------------
   5. UI: navigation, toast, contact form
--------------------------------------------------------------------- */
function toggleMobileNav() {
  document.getElementById("mobile-nav")?.classList.toggle("open");
}

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

/* Contact form: this demo just shows a success toast. To actually
   receive submissions on a static GitHub Pages site, connect this
   form's action to a service like Formspree, Getform, or EmailJS
   (see README for a 2-minute setup guide). */
function handleContactSubmit(e) {
  e.preventDefault();
  showToast("Message sent! We'll get back to you within 24 hours.");
  e.target.reset();
}

/* ---------------------------------------------------------------------
   6. INIT
--------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderFeaturedProducts();
  initProductsPage();
  renderCartPage();

  document.getElementById("year")?.replaceChildren(document.createTextNode(new Date().getFullYear()));
});
