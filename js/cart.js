/* =========================================================
   cart.js — renderização da página de carrinho
   ========================================================= */

function renderCartPage() {
  const wrap = document.querySelector("[data-cart-page]");
  if (!wrap) return;

  const cart = getCart();

  if (cart.length === 0) {
    wrap.innerHTML = `
      <div class="empty-state">
        <p>Seu carrinho está vazio.</p>
        <a href="catalogo.html" class="btn btn-outline">Explorar catálogo</a>
      </div>`;
    return;
  }

  const items = cart
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      if (!product) return "";
      const subtotal = product.price * item.qty;
      return `
        <div class="cart-item" data-cart-item="${product.id}">
          <img src="${product.images[0]}" alt="${product.name}" />
          <div>
            <div class="cart-item-name">${product.name}</div>
            <div class="cart-item-unit">${money(product.price)} un.</div>
            <div class="cart-item-actions">
              <div class="qty-control">
                <button type="button" data-cart-minus="${product.id}">−</button>
                <span>${item.qty}</span>
                <button type="button" data-cart-plus="${product.id}">+</button>
              </div>
              <button type="button" class="btn btn-outline btn-sm btn-danger-outline" data-cart-remove="${product.id}">Remover</button>
            </div>
          </div>
          <div style="font-weight:700">${money(subtotal)}</div>
        </div>
      `;
    })
    .join("");

  const total = cart.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    return product ? sum + product.price * item.qty : sum;
  }, 0);

  wrap.innerHTML = `
    <div class="cart-layout">
      <div>${items}</div>
      <div class="cart-summary">
        <div class="cart-summary-row total">
          <span>Total</span>
          <span>${money(total)}</span>
        </div>
        <button class="btn btn-whatsapp btn-block" style="margin-top:16px" data-whatsapp-checkout>
          Finalizar pelo WhatsApp
        </button>
        <a href="catalogo.html" class="btn btn-outline btn-block" style="margin-top:10px">Continuar comprando</a>
      </div>
    </div>
  `;

  wrap.addEventListener("click", (e) => {
    const minus = e.target.closest("[data-cart-minus]");
    const plus = e.target.closest("[data-cart-plus]");
    const remove = e.target.closest("[data-cart-remove]");

    if (minus) {
      const id = Number(minus.dataset.cartMinus);
      const item = getCart().find((i) => i.id === id);
      if (item) updateCartQty(id, item.qty - 1);
      renderCartPage();
    }
    if (plus) {
      const id = Number(plus.dataset.cartPlus);
      const item = getCart().find((i) => i.id === id);
      if (item) updateCartQty(id, item.qty + 1);
      renderCartPage();
    }
    if (remove) {
      removeFromCart(Number(remove.dataset.cartRemove));
      renderCartPage();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  productsReady.then(renderCartPage);
});
