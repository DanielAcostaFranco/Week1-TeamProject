import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import { findProductById } from "./productData.mjs";

function addProductToCart(product) {
  // read existing cart and append the new product (don't overwrite)
  let cart = getLocalStorage("so-cart");
  if (!cart) {
    cart = [];
  } else if (!Array.isArray(cart)) {
    cart = [cart];
  }

  cart.push(product);
  setLocalStorage("so-cart", cart);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
