/* =========================================================
   product.js — página individual do produto
   ========================================================= */

function initProductPage() {
  const wrap = document.querySelector("[data-product-page]");
  if (!wrap) return;

  const ref = getQueryParam("slug") || getQueryParam("id");
  const product = findProductByIdOrSlug(ref);

  if (!product || product.active === false) {
    wrap.innerHTML = `<div class="empty-state"><p>Produto não encontrado.</p><a href="catalogo.html" class="btn btn-outline">Voltar ao catálogo</a></div>`;
    return;
  }

  document.title = `${product.name} — ${STORE_CONFIG.name}`;

  const specs = [
    ["Marca", product.brand],
    ["Modelo", product.code],
    ["Categoria", product.category],
    ["Cor", product.color],
    ["Material", product.material],
    ["Tipo de pulseira", product.strap],
    ["Tipo de mostrador", product.display],
    ["Resistência à água", product.waterResistance],
    ["Garantia", product.warranty],
    ["Código do produto", product.code],
  ].filter(([, value]) => value);

  const isFav = getFavorites().includes(product.id);
  const oldPriceHtml = product.oldPrice
    ? `<span class="product-price-old">${money(product.oldPrice)}</span>`
    : "";

  const images = product.images && product.images.length ? product.images : ["images/produtos/placeholder.svg"];

  const thumbsHtml = images.length > 1
    ? `<div class="gallery-thumbs">
        ${images.map((src, i) => `
          <button type="button" class="gallery-thumb ${i === 0 ? "active" : ""}" data-thumb="${i}">
            <img src="${src}" alt="${product.name} — foto ${i + 1}" />
          </button>
        `).join("")}
      </div>`
    : "";

  wrap.innerHTML = `
    <div class="product-detail-grid">
      <div class="product-gallery">
        <div class="product-gallery-main" data-gallery-main data-zoom-trigger>
          <img src="${images[0]}" alt="${product.name}" data-gallery-image />
        </div>
        ${thumbsHtml}
      </div>
      <div class="product-info">
        <span class="product-brand">${product.brand}</span>
        <h1>${product.name}</h1>
        <div class="product-price-row" style="margin-top:10px">
          <span class="product-price${product.oldPrice ? " is-discounted" : ""}" style="font-size:1.5rem">${money(product.price)}</span>
          ${oldPriceHtml}
        </div>
        <p class="stock-label ${product.stock ? "" : "out"}">${product.stockLabel}</p>
        <p class="product-description">${product.description}</p>

        <div class="qty-row">
          <div class="qty-control">
            <button type="button" data-qty-minus aria-label="Diminuir quantidade">−</button>
            <span data-qty-value>1</span>
            <button type="button" data-qty-plus aria-label="Aumentar quantidade">+</button>
          </div>
          <button class="btn btn-primary" data-add-to-cart="${product.id}" ${!product.stock ? "disabled" : ""}>
            ${product.stock ? "Adicionar ao carrinho" : "Esgotado"}
          </button>
          <button class="product-fav" style="position:static" data-fav-toggle="${product.id}" data-active="${isFav}" aria-label="Favoritar">
            <svg viewBox="0 0 24 24" fill="${isFav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.6-10-9.3C.5 8 2 4.5 5.6 4 8 3.6 10 5 12 7c2-2 4-3.4 6.4-3 3.6.5 5.1 4 3.6 7.7C19.5 16.4 12 21 12 21z"/></svg>
          </button>
        </div>

        ${specs.length ? `
        <div class="specs-table">
          ${specs.map(([label, value]) => `
            <div class="specs-row"><span>${label}</span><span>${value}</span></div>
          `).join("")}
        </div>` : ""}
      </div>
    </div>

    <div class="lightbox" data-lightbox>
      <button type="button" class="lightbox-close" data-lightbox-close aria-label="Fechar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      ${images.length > 1 ? `
      <button type="button" class="lightbox-nav lightbox-prev" data-lightbox-prev aria-label="Foto anterior">‹</button>
      <button type="button" class="lightbox-nav lightbox-next" data-lightbox-next aria-label="Próxima foto">›</button>
      ` : ""}
      <img src="${images[0]}" alt="${product.name}" data-lightbox-image />
    </div>
  `;

  /* ---------- Galeria: troca de imagem, miniaturas, swipe ---------- */
  let current = 0;
  const mainImg = wrap.querySelector("[data-gallery-image]");
  const lightboxImg = wrap.querySelector("[data-lightbox-image]");
  const thumbs = wrap.querySelectorAll("[data-thumb]");

  function setImage(index) {
    current = (index + images.length) % images.length;
    mainImg.src = images[current];
    lightboxImg.src = images[current];
    thumbs.forEach((t, i) => t.classList.toggle("active", i === current));
  }

  thumbs.forEach((t) => {
    t.addEventListener("click", () => setImage(Number(t.dataset.thumb)));
  });

  // Swipe no celular (troca de foto arrastando)
  const mainEl = wrap.querySelector("[data-gallery-main]");
  let touchStartX = null;
  mainEl.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  mainEl.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) setImage(current + (delta < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });

  /* ---------- Zoom / lightbox ---------- */
  const lightbox = wrap.querySelector("[data-lightbox]");
  wrap.querySelector("[data-zoom-trigger]").addEventListener("click", () => {
    lightbox.classList.add("open");
  });
  wrap.querySelector("[data-lightbox-close]")?.addEventListener("click", () => {
    lightbox.classList.remove("open");
  });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.classList.remove("open");
  });
  wrap.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => setImage(current - 1));
  wrap.querySelector("[data-lightbox-next]")?.addEventListener("click", () => setImage(current + 1));
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") lightbox.classList.remove("open");
    if (e.key === "ArrowLeft") setImage(current - 1);
    if (e.key === "ArrowRight") setImage(current + 1);
  });

  /* ---------- Quantidade e carrinho ---------- */
  let qty = 1;
  const qtyValue = wrap.querySelector("[data-qty-value]");
  wrap.querySelector("[data-qty-minus]")?.addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    qtyValue.textContent = qty;
  });
  wrap.querySelector("[data-qty-plus]")?.addEventListener("click", () => {
    qty += 1;
    qtyValue.textContent = qty;
  });
  wrap.querySelector("[data-add-to-cart]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(product.id, qty);
  }, true);

  // Relacionados: mesma categoria, excluindo o produto atual
  const related = getVisibleProducts().filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 4);

  const relatedSection = document.querySelector("[data-related-products]");
  if (relatedSection && related.length > 0) {
    relatedSection.innerHTML = `
      <h2>Você também pode gostar</h2>
      <div class="product-grid" style="margin-top:24px">
        ${related.map(renderProductCard).join("")}
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  productsReady.then(initProductPage);
});
