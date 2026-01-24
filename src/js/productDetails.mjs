import { findProductById } from "./productData.mjs";
import { setLocalStorage } from "./utils.mjs";

let product = null;

function addProductToCart(product) {
  setLocalStorage("so-cart", product);
}

function addToCartHandler() {
  addProductToCart(product);
}

function renderProductDetails() {
  document.querySelector("#productName").textContent = product.Name;
  document.querySelector("#productNameWithoutBrand").textContent = product.NameWithoutBrand;

  const img = document.querySelector("#productImage");
  img.src = product.Image;
  img.alt = product.NameWithoutBrand;

  document.querySelector("#productFinalPrice").textContent = `$${product.FinalPrice}`;

  const colorName = product.Colors?.[0]?.ColorName ?? "";
  document.querySelector("#productColorName").textContent = colorName;

  document.querySelector("#productDescriptionHtmlSimple").innerHTML =
    product.DescriptionHtmlSimple;

  document.querySelector("#addToCart").dataset.id = product.Id;
}

export default async function productDetails(productId) {
  product = await findProductById(productId);

  renderProductDetails();

  document
    .getElementById("addToCart")
    .addEventListener("click", addToCartHandler);
}
