import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
    loadHeaderFooter();

    const subtotalElement = document.querySelector(".item-subtotal");
    if (!subtotalElement) return;

    const cartItems = getLocalStorage("so-cart") || [];

    const totalQty = cartItems.length;

    const total = cartItems.reduce((sum, item) => {
        return sum + Number(item.FinalPrice || 0);
    }, 0);

    subtotalElement.textContent = `Item Subtotal (${totalQty}): $${total.toFixed(2)}`;
});