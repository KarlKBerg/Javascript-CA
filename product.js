`use strict`;
// Import
import {
  cart,
  addToCart,
  displayCartItems,
  deleteCartItem,
  isCartEmpty,
  saveCart,
} from "./cart.js";
const API_BASE = "https://v2.api.noroff.dev/";
const API_PATH = "gamehub";
const url = API_BASE + API_PATH;
const cartIcon = document.querySelector(".cart-container i");
const cartContainer = document.querySelector(".cart");
const closeBtn = document.querySelector(".cart-header button");

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

displayCartItems();
