/* =========================================================
   favorites.js — renderização da página de favoritos
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  productsReady.then(() => {
    const grid = document.querySelector("[data-favorites-grid]");
    if (!grid) return;

    const favIds = getFavorites();
    const products = getVisibleProducts().filter((p) => favIds.includes(p.id));

    if (products.length === 0) {
      grid.outerHTML = `
        <div class="empty-state">
          <p>Você ainda não adicionou nenhum relógio aos favoritos.</p>
          <a href="catalogo.html" class="btn btn-outline">Explorar catálogo</a>
        </div>`;
      return;
    }

    renderProductGrid(grid, products);
  });
});
