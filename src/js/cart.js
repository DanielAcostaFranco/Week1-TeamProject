import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./shoppingCart.mjs";

/**
 * Converts something like "$12.99" to 12.99
 */
function parsePrice(priceText) {
  return Number(priceText.replace(/[^0-9.]/g, ""));
}

/**
 * Cart total based on rendered DOM (.cart-card).
 * Works on the cart page after ShoppingCart() has rendered items.
 */
export function calculateCartTotal() {
  const cartItems = document.querySelectorAll(".cart-card");
  const emptyMessage = document.querySelector(".empty-cart");
  let total = 0;

  if (cartItems.length === 0) {
    if (emptyMessage) emptyMessage.textContent = "No items in cart yet";
    return 0;
  }

  cartItems.forEach((item) => {
    const priceEl = item.querySelector(".cart-card__price");
    const qtyEl = item.querySelector(".cart-card__quantity");
    if (!priceEl || !qtyEl) return;

    const price = parsePrice(priceEl.textContent);
    const qty = Number(qtyEl.textContent.replace(/\D/g, ""));

    total += price * qty;
  });

  return total;
}

/**
 * Only run cart-page behavior if we're on the cart page
 * (i.e., if .product-list exists).
 */
document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();

  const productList = document.querySelector(".product-list");
  if (!productList) return; // ✅ prevents checkout from crashing

  // Render cart items (cart page only)
  ShoppingCart();

  // Update cart total (cart page only)
  const total = calculateCartTotal();
  const totalEl = document.querySelector(".cart-total");
  if (totalEl) {
    totalEl.textContent = `Total: $${total.toFixed(2)}`;
  }
});
