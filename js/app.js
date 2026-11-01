/* =========================================================
   app.js — lógica compartilhada por todas as páginas
   (menu mobile, carrinho, favoritos, WhatsApp)
   ========================================================= */

const money = (v) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ---------- Menu mobile ---------- */
function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const drawer = document.querySelector(".mobile-drawer");
  if (!toggle || !drawer) return;

  const close = () => drawer.classList.remove("open");
  toggle.addEventListener("click", () => drawer.classList.add("open"));
  drawer.querySelector(".mobile-drawer-close")?.addEventListener("click", close);
  drawer.querySelector(".mobile-drawer-backdrop")?.addEventListener("click", close);
  drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
}

/* ---------- Carrinho (localStorage) ---------- */
const CART_KEY = "21importa12_cart";
const FAV_KEY = "21importa12_favorites";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart(cart);
}

function updateCartQty(productId, qty) {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter((i) => i.id !== productId);
  } else {
    const item = cart.find((i) => i.id === productId);
    if (item) item.qty = qty;
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart().filter((i) => i.id !== productId);
  saveCart(cart);
}

function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function updateCartBadge() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    const n = cartCount();
    el.textContent = n;
    el.style.display = n > 0 ? "flex" : "none";
  });
}

/* ---------- Favoritos (localStorage) ---------- */
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem(FAV_KEY, JSON.stringify(list));
  updateFavBadge();
}

function toggleFavorite(productId) {
  let favs = getFavorites();
  if (favs.includes(productId)) {
    favs = favs.filter((id) => id !== productId);
  } else {
    favs.push(productId);
  }
  saveFavorites(favs);
  return favs.includes(productId);
}

function updateFavBadge() {
  document.querySelectorAll("[data-fav-count]").forEach((el) => {
    const n = getFavorites().length;
    el.textContent = n;
    el.style.display = n > 0 ? "flex" : "none";
  });
}

/* ---------- WhatsApp checkout ---------- */
function buildWhatsAppMessage() {
  const cart = getCart();
  const lines = cart.map((item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    if (!product) return "";
    const subtotal = product.price * item.qty;
    return `${item.qty}x ${product.name} — ${money(subtotal)}`;
  });

  const total = cart.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    return product ? sum + product.price * item.qty : sum;
  }, 0);

  const message = [
    STORE_CONFIG.whatsappGreeting,
    "",
    ...lines,
    "",
    `Total: ${money(total)}`,
    "",
    STORE_CONFIG.whatsappClosing,
  ].join("\n");

  return message;
}

function checkoutViaWhatsApp() {
  productsReady.then(() => {
    const message = buildWhatsAppMessage();
    const url = `${WHATSAPP_BASE_URL}${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  });
}

/* ---------- Renderização de cards de produto ---------- */
function renderProductCard(product) {
  const isFav = getFavorites().includes(product.id);
  const img = product.images?.[0] || "images/produtos/placeholder.svg";
  const url = productUrl(product);
  const hasDiscount = !!product.oldPrice;

  const tag = product.promotion
    ? `<span class="product-tag">Oferta</span>`
    : !product.stock
    ? `<span class="product-tag tag-stock">Esgotado</span>`
    : "";

  const oldPrice = product.oldPrice
    ? `<span class="product-price-old">${money(product.oldPrice)}</span>`
    : "";

  return `
    <article class="product-card" data-id="${product.id}">
      <div class="product-media">
        <a href="${url}">
          <img src="${img}" alt="${product.name}" loading="lazy" />
        </a>
        ${tag}
        <button class="product-fav" data-fav-toggle="${product.id}" data-active="${isFav}" aria-label="Favoritar ${product.name}">
          <svg viewBox="0 0 24 24" fill="${isFav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.6-10-9.3C.5 8 2 4.5 5.6 4 8 3.6 10 5 12 7c2-2 4-3.4 6.4-3 3.6.5 5.1 4 3.6 7.7C19.5 16.4 12 21 12 21z"/></svg>
        </button>
      </div>
      <div class="product-body">
        <span class="product-brand">${product.brand}</span>
        <a href="${url}"><h3 class="product-name">${product.name}</h3></a>
        <div class="product-price-row">
          <span class="product-price${hasDiscount ? " is-discounted" : ""}">${money(product.price)}</span>
          ${oldPrice}
        </div>
        <button class="product-add" data-add-to-cart="${product.id}" ${!product.stock ? "disabled" : ""}>
          ${product.stock ? "Adicionar ao carrinho" : "Esgotado"}
        </button>
      </div>
    </article>
  `;
}

function renderProductGrid(container, products) {
  if (!container) return;
  if (products.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Não encontramos nenhum relógio para essa busca.</p>
        <a href="catalogo.html" class="btn btn-outline">Limpar busca</a>
      </div>`;
    return;
  }
  container.innerHTML = products.map(renderProductCard).join("");
}

/* ---------- Delegação de eventos globais ---------- */
function initGlobalActions() {
  document.body.addEventListener("click", (e) => {
    const favBtn = e.target.closest("[data-fav-toggle]");
    if (favBtn) {
      const id = Number(favBtn.dataset.favToggle);
      const active = toggleFavorite(id);
      favBtn.dataset.active = active;
      favBtn.querySelector("svg").setAttribute("fill", active ? "currentColor" : "none");
      return;
    }

    const addBtn = e.target.closest("[data-add-to-cart]");
    if (addBtn && !addBtn.disabled) {
      const id = Number(addBtn.dataset.addToCart);
      addToCart(id, 1);
      const original = addBtn.textContent;
      addBtn.textContent = "Adicionado ✓";
      setTimeout(() => (addBtn.textContent = original), 1200);
      return;
    }

    const checkoutBtn = e.target.closest("[data-whatsapp-checkout]");
    if (checkoutBtn) {
      checkoutViaWhatsApp();
    }
  });
}

/* ---------- Preenche links de config (whatsapp/instagram) ---------- */
function applyStoreConfig() {
  document.querySelectorAll("[data-whatsapp-link]").forEach((el) => {
    el.href = `${WHATSAPP_BASE_URL}${STORE_CONFIG.whatsapp}`;
  });
  document.querySelectorAll("[data-instagram-link]").forEach((el) => {
    el.href = STORE_CONFIG.instagram;
  });
  document.querySelectorAll("[data-instagram-handle]").forEach((el) => {
    el.textContent = STORE_CONFIG.instagramHandle;
  });
  document.querySelectorAll("[data-store-name]").forEach((el) => {
    el.textContent = STORE_CONFIG.name;
  });
  document.querySelectorAll("[data-store-hours]").forEach((el) => {
    el.textContent = STORE_CONFIG.hours;
  });
  document.querySelectorAll("[data-store-location]").forEach((el) => {
    el.textContent = STORE_CONFIG.address ? `${STORE_CONFIG.address} — ${STORE_CONFIG.location}` : STORE_CONFIG.location;
  });
}

/* ---------- Botão flutuante do WhatsApp (aparece em todas as páginas) ---------- */
function initFloatingWhatsApp() {
  if (document.querySelector(".whatsapp-float")) return;
  const link = document.createElement("a");
  link.className = "whatsapp-float";
  link.target = "_blank";
  link.rel = "noopener";
  link.setAttribute("aria-label", "Falar no WhatsApp");
  link.href = `${WHATSAPP_BASE_URL}${STORE_CONFIG.whatsapp}`;
  link.innerHTML = `
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
      <path d="M17.472 14.382c-.297-.149-1.758-.868-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12.004 2C6.486 2 2 6.486 2 12.004c0 1.816.482 3.59 1.396 5.147L2 22l4.964-1.37A9.957 9.957 0 0 0 12.004 22C17.522 22 22 17.514 22 12.004 22 6.486 17.522 2 12.004 2zm0 18.062a8.02 8.02 0 0 1-4.09-1.122l-.293-.174-3.012.832.804-2.943-.19-.301a8.03 8.03 0 0 1-1.235-4.291c0-4.444 3.617-8.062 8.06-8.062 4.444 0 8.062 3.618 8.062 8.062 0 4.444-3.618 8-8.106 8z"/>
    </svg>
  `;
  document.body.appendChild(link);
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initGlobalActions();
  applyStoreConfig();
  updateCartBadge();
  updateFavBadge();
  initFloatingWhatsApp();
});
