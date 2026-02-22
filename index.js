`use strict`;
import {
  cart,
  addToCart,
  calculateCart,
  displayCartItems,
  deleteCartItem,
  isCartEmpty,
  saveCart,
} from "./cart.js";
const API_BASE = "https://v2.api.noroff.dev/";
const API_PATH = "gamehub";
const url = API_BASE + API_PATH;

let allGames = [];

const cartIcon = document.querySelector(".cart-container i");
const cartContainer = document.querySelector(".cart");
const closeBtn = document.querySelector(".cart-header button");

// Open and close cart

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

// API FETCH
async function fetchGames() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    const result = await response.json();
    allGames = result.data;
  } catch (error) {
    displayMessage(error);
  } finally {
    displayGames(allGames);
  }
}

// DISPLAY GAMES FROM API
async function displayGames(gamesToDisplay) {
  const container = document.querySelector(".games-container");
  stopLoading();
  container.innerHTML = "";

  gamesToDisplay.forEach((game) => {
    const gameCard = document.createElement("div");
    gameCard.classList.add("game-card");
    gameCard.dataset.id = game.id;

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");

    const image = document.createElement("img");

    const sale = document.createElement("div");
    sale.classList.add("sale");
    sale.innerHTML = "Sale";

    const title = document.createElement("h2");
    title.classList.add("title");

    const categories = document.createElement("p");
    categories.classList.add("categories");

    const priceContainer = document.createElement("div");
    priceContainer.classList.add("price-container");

    const normalPrice = document.createElement("p");
    normalPrice.classList.add("normal-price");

    const salePrice = document.createElement("p");
    salePrice.classList.add("sale-price");

    const addToCartBtn = document.createElement("button");
    addToCartBtn.classList.add("add-to-cart-btn");
    addToCartBtn.setAttribute(`aria-label`, `Add to cart button`);

    const buttonIcon = document.createElement("i");
    buttonIcon.classList.add("fa-sharp", "fa-regular", "fa-cart-shopping");

    const productTag = document.createElement("a");
    productTag.setAttribute(`href`, `product/index.html?id=${game.id}`);
    productTag.classList.add("product-link");

    image.src = game.image.url;
    title.textContent = game.title;
    categories.textContent = game.genre;
    normalPrice.textContent = `$${game.price}`;
    salePrice.textContent = `$${game.discountedPrice}`;

    container.appendChild(gameCard);
    gameCard.appendChild(productTag);
    productTag.appendChild(imageContainer);
    productTag.appendChild(title);
    productTag.appendChild(categories);
    productTag.appendChild(priceContainer);
    if (game.onSale) {
      imageContainer.appendChild(image);
      imageContainer.appendChild(sale);
      priceContainer.appendChild(normalPrice);
      normalPrice.classList.add("line-through");
      priceContainer.appendChild(salePrice);
    } else {
      imageContainer.appendChild(image);
      priceContainer.appendChild(normalPrice);
    }
    gameCard.appendChild(addToCartBtn);
    addToCartBtn.appendChild(buttonIcon);
  });
}

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

// SEARCH
let searchInputContainer = document.querySelector("#search-input");
if (!searchInputContainer) {
} else {
}
document.querySelector("#search-input").addEventListener(`input`, (event) => {
  const searchTerm = event.target.value;

  const filteredGames = filterGames(searchTerm);

  displayGames(filteredGames);
});
function filterGames(searchText) {
  let searchString = searchText.toLowerCase().trim();

  if (!searchString) {
    return allGames;
  }

  const filtered = allGames.filter((game) => {
    const nameMatch = game.title.toLowerCase().includes(searchString);
    const descriptionMatch = game.description
      .toLowerCase()
      .includes(searchString);
    const genreMatch = game.genre.toLowerCase().includes(searchString);

    return nameMatch || descriptionMatch || genreMatch;
  });
  return filtered;
}

fetchGames(); // Fetch games when site loads

loading(); // Start loading spinner

// ADD PRODUCT TO CART
document
  .querySelector(".games-container")
  .addEventListener("click", (event) => {
    if (event.target.closest(".add-to-cart-btn")) {
      let game = event.target.closest(".game-card");
      let gameId = game.dataset.id;
      const gameToAdd = allGames.find(function (gameIdToFind) {
        return gameIdToFind.id === gameId;
      });
      let price = gameToAdd.price;
      if (gameToAdd.onSale) {
        price = gameToAdd.discountedPrice;
      }
      cart.push(gameToAdd);
      saveCart();
      displayCartItems();
      calculateCart();
      displayMessage(`${gameToAdd.title} was added to the cart`, "success");
      isCartEmpty();
      event.stopPropagation();
      cartContainer.classList.toggle("hidden");
    }
  });

// Delete cart item
document
  .querySelector(".items-container")
  .addEventListener("click", (event) => {
    if (event.target.closest(".fa-trash")) {
      event.stopPropagation();
      deleteCartItem(event);
    }
  });
// Render cart from localStorage on page load
displayCartItems();
calculateCart();
