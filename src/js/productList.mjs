 
import { getData } from "./productData.mjs";
import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  // map some product Ids to their static product page filenames
  const productPageMap = {
    "880RR": "marmot-ajax-3.html",
    "985RF": "northface-talus-4.html",
    "985PR": "northface-alpine-3.html",
    "344YJ": "cedar-ridge-rimrock-2.html",
  };

  const page = productPageMap[product.Id]
    ? `/product_pages/${productPageMap[product.Id]}`
    : `/product_pages/index.html?product=${product.Id}`;

  return `<li class="product-card">
    <a href="${page}">
    <img
      src="${product.Image}"
      alt="Image of ${product.Name}"
    />
    <h3 class="card__brand">${product.Brand.Name}</h3>
    <h2 class="card__name">${product.NameWithoutBrand}</h2>
    <p class="product-card__price">$${product.FinalPrice}</p></a>
  </li>`;
}

export default async function productList(selector, category) {
  // get the element we will insert the list into from the selector
  const el = document.querySelector(selector);
  // get the list of products
  const products = await getData(category);
  console.log(products);
  // render out the product list to the element
  renderListWithTemplate(productCardTemplate, el, products);
}

