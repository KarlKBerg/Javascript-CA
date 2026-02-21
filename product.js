`use strict`;
// Import
import {
  cart,
  addToCart,
  displayCartItems,
  deleteCartItem,
  isCartEmpty,
  saveCart,
  calculateCart,
} from "./cart.js";
const API_BASE = "https://v2.api.noroff.dev/";
const API_PATH = "gamehub";
const url = API_BASE + API_PATH;
const cartIcon = document.querySelector(".cart-container i");
const cartContainer = document.querySelector(".cart");
const closeBtn = document.querySelector(".cart-header button");
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Fetch product

async function fetchProduct(id) {
  try {
    const response = await fetch(`${url}/${id}`);
    if (!response.ok) {
      throw new Error("Product not found");
    }

    const result = await response.json();
    stopLoading();
    displayProduct(result.data);
  } catch (error) {
    displayMessage(error);
  }
}

function displayProduct(data) {
  const container = document.querySelector("#product-info");
  container.innerHTML = `
    <img src="${data.image.url}" alt="${data.title}">
    <div class="title-description">
        <h3 class="title">${data.title}</h3>
        <p class="description">${data.description}</p>
        <p class="categories">${data.genre}</p>
        <h3 class="price">${data.onSale ? `$${data.discountedPrice}` : `$${data.price}`}</h3>
        <button class="add-to-cart-btn">
            <i class="fa-sharp fa-regular fa-cart-shopping"></i>
          </button>
    </div>
    `;

  const button = container.querySelector(".add-to-cart-btn");

  button.addEventListener("click", () => {
    cart.push(data);
    saveCart();
    displayCartItems();
    calculateCart();
  });
}
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
if (!id) {
  displayMessage("No id found");
} else {
  loading();
  fetchProduct(id);
}

document
  .querySelector(".items-container")
  .addEventListener("click", (event) => {
    if (event.target.closest(".fa-trash")) {
      event.stopPropagation();
      deleteCartItem(event);
      calculateCart();
    }
  });

displayCartItems();
calculateCart();
