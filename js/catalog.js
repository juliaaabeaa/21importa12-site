/* =========================================================
   catalog.js — busca, filtros e ordenação do catálogo
   ========================================================= */

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function initCatalogPage() {
  const grid = document.querySelector("[data-product-grid]");
  if (!grid) return;

  const searchInput = document.querySelector("[data-search-input]");
  const sortSelect = document.querySelector("[data-sort-select]");
  const categoryList = document.querySelector("[data-filter-category-list]");
  const brandList = document.querySelector("[data-filter-brand-list]");
  const colorList = document.querySelector("[data-filter-color-list]");
  const priceMin = document.querySelector("[data-filter-price-min]");
  const priceMax = document.querySelector("[data-filter-price-max]");
  const stockOnly = document.querySelector("[data-filter-stock]");
  const resultCount = document.querySelector("[data-result-count]");
  const clearBtn = document.querySelector("[data-clear-search]");

  const visibleProducts = getVisibleProducts();

  // Categoria, marca e cor são geradas a partir do catálogo, nunca
  // escritas à mão — assim uma categoria nova cadastrada em products.js
  // aparece aqui sozinha, sem precisar editar este arquivo ou o HTML.
  const categories = [...new Set(visibleProducts.map((p) => p.category).filter(Boolean))].sort();
  const brands = [...new Set(visibleProducts.map((p) => p.brand).filter(Boolean))].sort();
  const colors = [...new Set(visibleProducts.map((p) => p.color).filter(Boolean))].sort();

  if (categoryList) {
    categoryList.innerHTML = categories
      .map((c) => `<label class="filter-option"><input type="checkbox" data-filter-category value="${c}" /> ${c}</label>`)
      .join("");
  }
  if (brandList) {
    brandList.innerHTML = brands
      .map((b) => `<label class="filter-option"><input type="checkbox" data-filter-brand value="${b}" /> ${b}</label>`)
      .join("");
  }
  if (colorList) {
    colorList.innerHTML = colors
      .map((c) => `<label class="filter-option"><input type="checkbox" data-filter-color value="${c}" /> ${c}</label>`)
      .join("");
  }

  const categoryChecks = () => document.querySelectorAll("[data-filter-category]");
  const brandChecks = () => document.querySelectorAll("[data-filter-brand]");
  const colorChecks = () => document.querySelectorAll("[data-filter-color]");

  const state = {
    query: getQueryParam("busca") || "",
    category: getQueryParam("categoria") || "",
    sort: "recent",
  };

  if (searchInput) searchInput.value = state.query;

  categoryChecks().forEach((cb) => {
    cb.checked = state.category ? cb.value === state.category : false;
  });

  function apply() {
    let list = [...visibleProducts];

    if (state.query) {
      const q = state.query.toLowerCase();
      list = list.filter((p) =>
        [p.name, p.brand, p.category, p.color, p.code, p.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    const activeCategories = Array.from(categoryChecks())
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    if (activeCategories.length > 0) {
      list = list.filter((p) => activeCategories.includes(p.category));
    }

    const activeBrands = Array.from(brandChecks())
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    if (activeBrands.length > 0) {
      list = list.filter((p) => activeBrands.includes(p.brand));
    }

    const activeColors = Array.from(colorChecks())
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    if (activeColors.length > 0) {
      list = list.filter((p) => activeColors.includes(p.color));
    }

    const min = parseFloat(priceMin?.value);
    const max = parseFloat(priceMax?.value);
    if (!isNaN(min)) list = list.filter((p) => p.price >= min);
    if (!isNaN(max)) list = list.filter((p) => p.price <= max);

    if (stockOnly?.checked) {
      list = list.filter((p) => p.stock);
    }

    switch (state.sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case "promotion":
        list.sort((a, b) => (b.promotion ? 1 : 0) - (a.promotion ? 1 : 0));
        break;
      default:
        list.sort((a, b) => b.id - a.id);
    }

    renderProductGrid(grid, list);
    if (resultCount) {
      resultCount.textContent = `${list.length} relógio${list.length === 1 ? "" : "s"} encontrado${list.length === 1 ? "" : "s"}`;
    }
  }

  searchInput?.addEventListener("input", (e) => {
    state.query = e.target.value;
    apply();
  });

  sortSelect?.addEventListener("change", (e) => {
    state.sort = e.target.value;
    apply();
  });

  // Delegação para categoria/marca/cor/disponibilidade, já que a lista
  // de categoria/marca/cor é criada dinamicamente a partir do catálogo.
  document.body.addEventListener("change", (e) => {
    if (e.target.matches("[data-filter-category], [data-filter-brand], [data-filter-color], [data-filter-stock]")) {
      apply();
    }
  });

  priceMin?.addEventListener("input", apply);
  priceMax?.addEventListener("input", apply);

  clearBtn?.addEventListener("click", () => {
    state.query = "";
    state.category = "";
    if (searchInput) searchInput.value = "";
    categoryChecks().forEach((cb) => (cb.checked = false));
    brandChecks().forEach((cb) => (cb.checked = false));
    colorChecks().forEach((cb) => (cb.checked = false));
    if (priceMin) priceMin.value = "";
    if (priceMax) priceMax.value = "";
    if (stockOnly) stockOnly.checked = false;
    apply();
  });

  apply();
}

document.addEventListener("DOMContentLoaded", () => {
  productsReady.then(initCatalogPage);
});
