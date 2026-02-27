import { getLocalStorage} from "./utils.mjs";
import { checkout as submitOrder } from "./externalServices.mjs";


function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    price: Number(item.FinalPrice || 0),
    name: item.Name,
    quantity: 1,
  }));
}

function formatExpiration(monthValue) {
  if (!monthValue) return "";

  const [year, month] = monthValue.split("-");
  if (!year || !month) return monthValue;

  const m = String(Number(month));    
  const yy = year.slice(-2);         
  return `${m}/${yy}`;               
}

const checkoutProcess = {
  key: "",
  outputSelector: "",
  list: [],
  itemTotal: 0,
  shipping: 0,
  tax: 0,
  orderTotal: 0,

  init: function (key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = getLocalStorage(key) || [];
    this.calculateItemSummary();
  },

  calculateItemSummary: function () {
    const summaryElement = document.querySelector(
      this.outputSelector + " #cartTotal"
    );
    const itemNumElement = document.querySelector(
      this.outputSelector + " #num-items"
    );

    if (!summaryElement || !itemNumElement) return;

    itemNumElement.innerText = this.list.length;

    this.itemTotal = this.list.reduce((sum, item) => {
      return sum + Number(item.FinalPrice || 0);
    }, 0);

    summaryElement.innerText = `Item Subtotal (${this.list.length}): $${this.itemTotal.toFixed(2)}`;
  },

  calculateOrdertotal: function () {
    const itemCount = this.list.length;
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;

    this.tax = +(this.itemTotal * 0.06).toFixed(2);

    this.orderTotal = +(
      this.itemTotal +
      this.shipping +
      this.tax
    ).toFixed(2);

    this.displayOrderTotals();
  },

  displayOrderTotals: function () {
    const shippingEl = document.querySelector(this.outputSelector + " #shipping");
    const taxEl = document.querySelector(this.outputSelector + " #tax");
    const orderTotalEl = document.querySelector(this.outputSelector + " #orderTotal");

    if (!shippingEl || !taxEl || !orderTotalEl) return;

    shippingEl.innerText = `Shipping Estimate: $${this.shipping.toFixed(2)}`;
    taxEl.innerText = `Tax: $${this.tax.toFixed(2)}`;
    orderTotalEl.innerText = `Order Total: $${this.orderTotal.toFixed(2)}`;
  },

checkout: async function (form){
  const data = formDataToJSON(form);

  const order = {
    orderDate: new Date().toISOString(),

    fname: data.fname, 
    lname: data.lname,
    street: data.street,
    city: data.city,
    state: data.state,
    zip: data.zip,

    cardNumber: data.cardNumber,
    expiration: formatExpiration(data.expiration),
    code: data.code,

    items: packageItems(this.list),

    orderTotal: this.orderTotal.toFixed(2),
    shipping: this.shipping, 
    tax: this.tax.toFixed(2),
  };

  try {
    const res = await submitOrder(order);
    console.log("Server response:", res);

    // Happy path
    localStorage.removeItem(this.key);
    window.location.href = "/checkout/success.html";

  } catch (err) {
    console.log("Checkout error:", err);
    alert(JSON.stringify(err.message));
  }
},
};

export default checkoutProcess;