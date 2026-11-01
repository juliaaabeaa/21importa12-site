/* =========================================================
   CATÁLOGO DE PRODUTOS
   =========================================================
   Os produtos da loja NÃO ficam mais escritos neste arquivo.
   Eles ficam em data/products.json, que é o arquivo que o
   painel de administração (/admin) edita quando você adiciona,
   muda ou remove um relógio por lá.

   Se você preferir editar manualmente (sem o painel), pode abrir
   o data/products.json num editor de texto e seguir o mesmo
   modelo de campos de cada produto — é só uma lista comum, sem
   nenhuma instrução de programação.

   Este arquivo só contém o código que BUSCA o products.json e
   deixa ele disponível pro resto do site (catálogo, busca,
   filtros, categoria, página de produto, relacionados, destaques,
   ofertas, carrinho e mensagem do WhatsApp).
   ========================================================= */

let PRODUCTS = [];

// Toda página que precisa dos produtos espera essa Promise antes de
// desenhar qualquer coisa na tela — assim nunca mostra uma lista vazia
// só porque o arquivo ainda não tinha terminado de carregar.
const productsReady = fetch("data/products.json")
  .then((res) => res.json())
  .then((data) => {
    PRODUCTS = data.products || [];
    return PRODUCTS;
  })
  .catch((err) => {
    console.error("Não foi possível carregar data/products.json", err);
    PRODUCTS = [];
    return PRODUCTS;
  });

/* Produtos publicamente visíveis (exclui os com active:false).
   Use PRODUCTS quando precisar olhar o cadastro completo
   (ex: para achar um item pelo id, mesmo se estiver inativo),
   e getVisibleProducts() para tudo que é mostrado ao cliente. */
function getVisibleProducts() {
  return PRODUCTS.filter((p) => p.active !== false);
}

function findProductByIdOrSlug(idOrSlug) {
  return PRODUCTS.find(
    (p) => p.slug === idOrSlug || String(p.id) === String(idOrSlug)
  );
}

function productUrl(product) {
  const ref = product.slug || product.id;
  return `produto.html?slug=${encodeURIComponent(ref)}`;
}
