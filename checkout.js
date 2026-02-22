`use strict`;
// Import
import {
  displayCartItems,
  isCartEmpty,
  cart,
  calculateCart,
  saveCart,
} from "./cart.js";
const cartIcon = document.querySelector(".cart-container i");
const cartContainer = document.querySelector(".cart");
const closeBtn = document.querySelector(".cart-header button");
// LOADING SPINNER
function loading() {
  const container = document.querySelector(".loading-container .loading");
  const containerP = document.querySelector(".loading-container p");
  container.classList.remove("hidden");
  containerP.classList.remove("hidden");
}

// STOP LOADING SPINER
function stopLoading() {
  const container = document.querySelector(".loading-container .loading");
  const containerP = document.querySelector(".loading-container p");
  container.classList.add("hidden");
  containerP.classList.add("hidden");
}
// ERROR / SUCCESS MESSAGE
// Display and remove success or error message
function displayMessage(text, type) {
  const messageContainer = document.querySelector("main .message-container");
  messageContainer.innerHTML = "";
  messageContainer.classList.remove("hidden");
  if (type === "success") {
    messageContainer.classList.add("success");
  } else {
    messageContainer.classList.add("error");
  }
  const message = document.createElement("h3");
  message.textContent = text;
  messageContainer.appendChild(message);
  setTimeout(() => {
    messageContainer.classList.add("hidden");
  }, 4000);
}
// Delete cart item
document
  .querySelector(".items-container")
  .addEventListener("click", (event) => {
    if (event.target.closest(".fa-trash")) {
      event.stopPropagation();
      deleteCartItem(event);
    }
  });

cartIcon.addEventListener("click", (event) => {
  isCartEmpty();
  event.stopPropagation();
  cartContainer.classList.toggle("hidden");
});
// Close cart by clicking outside
document.addEventListener("click", (event) => {
  if (!cartContainer.contains(event.target)) {
    cartContainer.classList.add("hidden");
  }
});
// Close cart with close button
closeBtn.addEventListener("click", () => {
  cartContainer.classList.add("hidden");
});
function displayCartItemsPage() {
  stopLoading();
  const itemsContainer = document.querySelector(".checkout-items");
  if (!itemsContainer) return;
  itemsContainer.innerHTML = "";
  cart.forEach((item) => {
    const cartItemContainer = document.createElement("div");

    const leftContainer = document.createElement("div");
    leftContainer.classList.add("cart-left");
    cartItemContainer.classList.add("cart-product", "checkout-item");
    cartItemContainer.dataset.id = item.id;

    const productImage = document.createElement("img");
    productImage.src = item.image.url;

    const titleGenreDiv = document.createElement("div");
    titleGenreDiv.classList.add("title-genre-container");

    const cartTitle = document.createElement("h2");
    cartTitle.classList.add("cart-item-title");
    cartTitle.textContent = item.title;

    const cartGenre = document.createElement("p");
    cartGenre.classList.add("cart-item-genre");
    cartGenre.textContent = item.genre;

    const rightContainer = document.createElement("div");
    rightContainer.classList.add("cart-right");

    const removeIcon = document.createElement("i");
    removeIcon.classList.add("fa-solid", "fa-trash");

    const cartItemPrice = document.createElement("h2");
    cartItemPrice.classList.add("cart-item-price");
    if (item.onSale) {
      cartItemPrice.textContent = item.discountedPrice;
    } else {
      cartItemPrice.textContent = `$${item.price}`;
    }

    itemsContainer.appendChild(cartItemContainer);
    cartItemContainer.appendChild(leftContainer);
    leftContainer.appendChild(productImage);
    leftContainer.appendChild(titleGenreDiv);
    titleGenreDiv.appendChild(cartTitle);
    titleGenreDiv.appendChild(cartGenre);
    cartItemContainer.appendChild(rightContainer);
    rightContainer.appendChild(removeIcon);
    rightContainer.appendChild(cartItemPrice);
  });
}
function calculateCartPage() {
  let subtotal = 0;
  cart.forEach((game) => {
    let priceToUse = game.onSale ? game.discountedPrice : game.price;
    subtotal += Number(priceToUse);
  });
  subtotal = Number(subtotal.toFixed(2));
  let tax = subtotal * 0.25;
  tax = parseFloat(tax.toFixed(2));
  const total = subtotal + tax;
  const formattedTotal = parseFloat(total.toFixed(2));
  displayCartPrices(subtotal, tax, formattedTotal);
}

function displayCartPrices(sub, tax, total) {
  const subtotalPrice = document.querySelector(
    ".page-price-container #subtotal",
  );
  const taxPrice = document.querySelector(".page-price-container #tax");
  const totalPrice = document.querySelector(".page-price-container #total");
  if (!subtotalPrice || !taxPrice || !totalPrice) return;
  subtotalPrice.textContent = `$${sub.toFixed(2)}`;
  taxPrice.textContent = `$${tax.toFixed(2)}`;
  totalPrice.textContent = `$${total.toFixed(2)}`;
}

document.querySelector(".purchase-btn").addEventListener("click", () => {
  cart.length = 0;
  saveCart();
});
displayCartItems();
displayCartItemsPage();
calculateCart();
calculateCartPage();
