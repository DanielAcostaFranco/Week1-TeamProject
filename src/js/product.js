import { setLocalStorage, getLocalStorage, getParam } from "./utils.mjs";
import { findProductById } from "./productData.mjs";
import productDetails from "./productDetails.mjs";

const productId = getParam("product");
productDetails(productId);

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
async function addToCartHandler() {
  const product = await findProductById(productId);
  addProductToCart(product);
}

// add listener to Add to Cart button (only if it exists on the page)
const btn = document.getElementById("addToCart");
if (btn) btn.addEventListener("click", addToCartHandler);
