# 21IMPORTA12 ONLINE — guia rápido

Este site foi feito em HTML, CSS e JavaScript puros. Não precisa de banco de
dados nem de servidor próprio — pode ser hospedado gratuitamente (este guia
usa o Netlify como exemplo, já que é o que você já tem conta).

Os produtos ficam guardados em `data/products.json`, e existem **duas
formas** de editar esse arquivo:

- **Painel de admin** (`/admin`) — uma telinha visual, com login, onde você
  adiciona/edita/remove produtos clicando, sem abrir nenhum arquivo. É a
  forma recomendada no dia a dia. Veja como configurar logo abaixo.
- **Editando o arquivo na mão** — abrindo `data/products.json` num editor
  de texto, do jeito que foi explicado no início deste projeto. Continua
  funcionando normalmente, é só uma alternativa pro painel.

⚠️ **Importante:** como os produtos agora são carregados de um arquivo
separado, **abrir o `index.html` com duplo clique no computador não mostra
mais os produtos** (os navegadores bloqueiam esse tipo de carregamento em
arquivos locais, por segurança). Isso não é um problema de verdade: a
partir de agora, o jeito certo de conferir o site é sempre pelo link do
Netlify (seja o link de produção ou os links de prévia de cada alteração).

## Como colocar o painel de admin (`/admin`) pra funcionar

O painel já está dentro do projeto (pasta `admin/`). Com o site já no
GitHub e no Netlify, faltam 3 passos, feitos uma única vez:

**1. Diga ao painel qual é o seu repositório**
No GitHub, abra o arquivo `admin/config.yml`, clique no lápis (editar) e
confira que a linha `repo:` (já preenchida com `juliaaabeaa/21importa12-site`) está igual ao
endereço do seu repositório (aparece no topo da página dele, no formato
`usuario/repositorio`). Clique em "Commit changes".

**2. Crie um "aplicativo de login" no GitHub**
GitHub → sua foto → Settings → Developer settings → OAuth Apps → New
OAuth App. Preencha:
- Application name: qualquer nome (ex: Painel da Loja)
- Homepage URL: o endereço do seu site no Netlify
- Authorization callback URL: `https://api.netlify.com/auth/done`
Depois clique em Register application, copie o **Client ID** e clique em
"Generate a new client secret" para copiar o **Client Secret**.

**3. Entregue esses dois códigos ao Netlify**
Netlify → seu site → Site configuration → Access control → OAuth →
"Install provider" → GitHub → cole o Client ID e o Client Secret → Install.

Pronto: acesse `seusite.netlify.app/admin`, clique em "Login with GitHub"
e use o painel. Quando você salva algo, o site atualiza sozinho em cerca
de 1 minuto. (Só quem tem permissão de escrita no repositório consegue
entrar.)

## Como adicionar um produto novo (sem usar o painel)

Se preferir editar direto, sem o painel:

1. Abra o arquivo `data/products.json`.
2. Copie um dos produtos existentes (do `{` até o `}` correspondente).
3. Cole no final da lista, antes do `]`.
4. Troque o `id` para um número que ainda não exista, e o `slug` para um
   texto único (ex: `"relogio-classico-preto"`) — é ele que aparece no
   link do produto.
5. Preencha os campos (nome, marca, categoria, preço, descrição, etc.).
6. Salve o arquivo.

O produto aparecerá **sozinho**, sem precisar editar nenhuma página HTML:
- no catálogo, na busca e nos filtros de categoria/marca/cor;
- na categoria correspondente;
- na página individual do produto (pelo link `produto.html?slug=...`);
- nos produtos relacionados, quando aplicável;
- nos destaques da Home, se `featured: true`;
- nas ofertas, se `promotion: true`;
- no carrinho, quando o cliente adicionar;
- na mensagem enviada pelo WhatsApp.

## Como alterar um preço

No arquivo `data/products.json` (ou pelo painel `/admin`), encontre o produto pelo nome e altere o
valor de `price` (preço atual) ou `oldPrice` (preço anterior, usado para
mostrar desconto). Se não houver desconto, deixe `oldPrice: null`. A
mudança aparece em todo o site automaticamente — não precisa editar mais
nada.

## Como trocar as fotos de um produto

1. Coloque as imagens dentro de `images/produtos/`.
2. Siga o padrão de nome: `relogio-001-1.jpg`, `relogio-001-2.jpg`, etc.
3. No produto correspondente em `data/products.json`, liste os arquivos no
   campo `images`, por exemplo:
   `images: ["images/produtos/relogio-001-1.jpg", "images/produtos/relogio-001-2.jpg"]`

Enquanto fotos reais não existirem, o site usa uma imagem de teste
(`images/produtos/placeholder.svg`) para não deixar nada quebrado.

## Como alterar o número de WhatsApp

Abra `js/config.js` e altere a linha `whatsapp:`. Use apenas números, com
DDI e DDD (exemplo: `"5585999999999"`). Esse é o único lugar do site onde
o número precisa ser alterado — todos os botões de WhatsApp usam esse valor
automaticamente.

## Como alterar o Instagram

No mesmo arquivo `js/config.js`, altere `instagram` (o link completo) e
`instagramHandle` (o texto exibido, como `@sualoja`).

## Como trocar a imagem de fundo do hero (atrás de "Seu tempo. Seu estilo.")

Substitua o arquivo `images/loja/hero-bg.svg` pela foto/logo real, mantendo
o mesmo nome de arquivo — assim não precisa alterar nada no CSS. Se a foto
nova for `.jpg` ou `.png`, troque só a extensão na linha `background:` do
seletor `.hero` em `css/style.css` (procure por `hero-bg.svg`). Por cima da
imagem já existe um degradê escuro para o texto continuar legível em
qualquer foto.

## Como criar uma categoria nova

Basta usar o nome novo no campo `category` do produto (ex:
`category: "Infantil"`). O filtro de categoria do catálogo é gerado
automaticamente a partir dos produtos cadastrados — você não precisa
editar `catalogo.html` nem nenhum outro arquivo para isso.

Se também quiser um card dessa categoria na Home (seção "Categorias"),
copie um dos blocos `<a class="category-card" ...>` no `index.html` e
ajuste o texto e o link (`catalogo.html?categoria=NomeDaCategoria`) — mas
isso é só um atalho visual, o filtro já funciona mesmo sem esse card.

## Como destacar um produto na Home

No arquivo `data/products.json` (ou pelo painel `/admin`), altere o campo do produto para `featured: true`.
Para tirar da Home, use `featured: false`.

## Como colocar um produto em promoção

No arquivo `data/products.json` (ou pelo painel `/admin`), altere o produto para `promotion: true` e
preencha `oldPrice` com o preço anterior. O selo "Oferta" e o produto na
página de Ofertas aparecerão automaticamente.

## Como marcar um produto como esgotado

No arquivo `data/products.json` (ou pelo painel `/admin`), altere o produto para `stock: false` e
`stockLabel: "Esgotado"`. O botão de compra será desativado automaticamente.

Se quiser já deixar preparado o controle de quantidade em estoque para o
futuro, preencha `stockQuantity` com o número de unidades (ex:
`stockQuantity: 5`). Por enquanto esse campo não é exibido nem usado para
nada — é só um espaço reservado, pode deixar `null` sem problema.

## Como remover um produto sem apagar o cadastro

Altere o campo do produto para `active: false`. Ele some do catálogo, da
busca, da Home, das ofertas e dos favoritos — mas o cadastro continua no
arquivo, então basta voltar para `active: true` quando quiser reativá-lo.
Isso é mais seguro do que apagar o bloco inteiro do produto.

## Como funciona o link de cada produto

Cada produto tem um `slug` (ex: `"relogio-urban-noir"`), e o link da
página dele é sempre `produto.html?slug=o-slug-do-produto`. Isso significa
que o link não muda mesmo que você edite o nome, o preço ou qualquer outra
informação do produto depois — só muda se você alterar o próprio `slug`.

## Como publicar o site

1. Escolha um serviço gratuito de hospedagem estática, como Netlify,
   Vercel, GitHub Pages ou Cloudflare Pages.
2. Envie a pasta inteira do projeto (mantendo a estrutura de pastas).
3. Aponte o arquivo `index.html` como página inicial (a maioria dos
   serviços já faz isso automaticamente).

## Estrutura do projeto

```
/
├── index.html        Home
├── catalogo.html      Catálogo com busca e filtros
├── produto.html        Página individual de produto
├── carrinho.html        Carrinho de compras
├── favoritos.html       Lista de favoritos
├── ofertas.html          Produtos em promoção
├── sobre.html             Sobre a loja
├── contato.html            Fale conosco
├── politicas.html           Políticas da loja
│
├── admin/
│   ├── index.html     Painel de administração (/admin)
│   └── config.yml      Configuração do painel (campos do formulário)
│
├── data/
│   └── products.json  Catálogo de produtos — o painel edita este arquivo
│
├── css/
│   ├── style.css       Identidade visual e layout principal
│   ├── components.css   Componentes específicos (carrinho, produto, filtros)
│   └── responsive.css     Ajustes para celular e tablet
│
├── js/
│   ├── config.js       Nome da loja, WhatsApp, Instagram, textos
│   ├── products.js      Carrega data/products.json para o site usar
│   ├── app.js             Carrinho, favoritos, menu mobile, WhatsApp
│   ├── catalog.js          Busca, filtros e ordenação do catálogo
│   ├── product.js           Página individual do produto
│   ├── cart.js                Página do carrinho
│   └── favorites.js            Página de favoritos
│
└── images/
    ├── produtos/    Fotos dos relógios
    ├── banners/      Imagens de destaque/promoções
    └── loja/           Logo, favicon e imagens institucionais
```

## Acessibilidade e SEO (Fase 7)

- Todas as páginas têm um link "Pular para o conteúdo" (aparece ao navegar
  pelo teclado) e uma marcação `<main>` identificando o conteúdo principal.
- Foco visível em links, botões e campos ao navegar com Tab.
- Movimento/animações são reduzidos automaticamente se a pessoa tiver
  ativado "reduzir movimento" no sistema.
- Campos de busca, ordenação e faixa de preço têm rótulos para leitores de tela.
- Título, meta description e tags Open Graph em todas as páginas.
- `robots.txt` e `sitemap.xml` inclusos — depois de publicar o site em um
  domínio, troque "SEU-DOMINIO-AQUI" no `sitemap.xml` pelo endereço real.

## O que já está pronto (Fase 1)

- Identidade visual (paleta, tipografia, componentes)
- Home, header e footer
- Estrutura do catálogo com busca, filtros e ordenação
- Página individual de produto com produtos relacionados
- Carrinho e favoritos com `localStorage`
- Finalização de pedido via WhatsApp
- Responsividade para celular, tablet e desktop
- 6 produtos de demonstração (marcados como dados de teste)

## Catálogo 100% editável (reforço de arquitetura)

- `data/products.json` é a única fonte de dados — nada é cadastrado em mais
  de um lugar.
- Filtros de categoria, marca e cor são gerados automaticamente a partir
  dos produtos cadastrados (nunca são listas fixas no HTML).
- Cada produto tem um `slug` próprio, usado no link da página
  (`produto.html?slug=...`).
- Campo `active` permite tirar um produto de circulação sem apagar o
  cadastro.
- Campo `stockQuantity` reservado para um futuro controle de estoque por
  quantidade.

## Identidade visual (ajustes)

- Tema claro (fundo branco, texto escuro), com **preto e vermelho** como
  cores de marca (dois tons de vermelho: vivo e escuro/bordô).
- Cabeçalho e menu mobile em preto, com texto branco.
- Tudo relacionado a WhatsApp (botões, link do rodapé, botão flutuante)
  em verde.
- Animações de glow no logo, no título da Home, na moldura do produto em
  destaque, nos cards ao passar o mouse e no botão principal — todas
  desativadas automaticamente se a pessoa tiver "reduzir movimento"
  ativado no sistema.
- Fundo do hero (atrás de "Seu tempo. Seu estilo.") preparado para
  receber a foto da logo — veja a seção sobre isso mais acima.

## O que falta antes de publicar

- Substituir os produtos de teste pelos reais em `data/products.json`
  (ou pelo painel `/admin`, depois de configurado)
- Adicionar fotos reais dos relógios
- Trocar `images/loja/hero-bg.svg` pela foto da logo
- Preencher endereço e horário reais em `js/config.js`, se mudarem
- Preencher os textos de Sobre e Políticas
- Configurar o login do painel `/admin` (passo a passo no início deste
  arquivo)
