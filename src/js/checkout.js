import { loadHeaderFooter, alertMessage } from "./utils.mjs";
import checkoutProcess from "./checkoutProcess.mjs";

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();

  checkoutProcess.init("so-cart", ".order-summary");

  const form = document.querySelector(".checkout-form");
  if (!form) return;


  const zipInput = document.querySelector("#zip");
  if (zipInput) {
    const updateTotals = () => {
      if (/^\d{5}$/.test(zipInput.value.trim())) {
        checkoutProcess.calculateOrdertotal();
      }
    };

    zipInput.addEventListener("input", updateTotals);
    zipInput.addEventListener("change", updateTotals);
  }

  // existing submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const chk_status = form.checkValidity();
    form.reportValidity();

    if (!chk_status) return;

    checkoutProcess.calculateOrdertotal();

    try {
      await checkoutProcess.checkout(form);
      console.log("Order submitted successfully");
    } catch (err) {
      console.error("Checkout failed:", err);
      alertMessage(JSON.stringify(err.message));
    }
  });
});