`use strict`;
const API_BASE = "https://v2.api.noroff.dev/";
const API_PATH = "gamehub";
const url = API_BASE + API_PATH;

let allGames = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartIcon = document.querySelector(".cart-container i");
const cartContainer = document.querySelector(".cart");
const closeBtn = document.querySelector(".cart-header button");

// Open and close cart

cartIcon.addEventListener("click", (event) => {
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

    image.src = game.image.url;
    title.textContent = game.title;
    categories.textContent = game.genre;
    normalPrice.textContent = `$${game.price}`;
    salePrice.textContent = `$${game.discountedPrice}`;

    container.appendChild(gameCard);
    gameCard.appendChild(imageContainer);
    gameCard.appendChild(title);
    gameCard.appendChild(categories);
    gameCard.appendChild(priceContainer);
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
  console.log(allGames);
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
      cart.push(gameToAdd);
      saveCart();
      displayCartItems();
    }
  });
function addToCart() {
  displayCartItems();
}
function displayCartItems() {
  const itemsContainer = document.querySelector(".items-container");
  itemsContainer.innerHTML = "";
  cart.forEach((item) => {
    const cartItemContainer = document.createElement("div");

    const leftContainer = document.createElement("div");
    leftContainer.classList.add("cart-left");
    cartItemContainer.classList.add("cart-product");
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
// Delete cart item
document
  .querySelector(".items-container")
  .addEventListener("click", (event) => {
    if (event.target.closest(".fa-trash")) {
      let game = event.target.closest(".cart-product");
      let gameId = game.dataset.id;
      cart = cart.filter((item) => item.id !== gameId);
      saveCart();
      displayCartItems();
    }
  });

// Save cart array to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
// Render cart from localStorage on page load
displayCartItems();

// The 'arr' variable now holds the new filtered array.
/* 
TODAYS GOAL:
- FOOTER (style)
- PRODUCT PAGE
*/

/*
GOALS:
- Error handling
- Categories search (buttons?)
- Finish static pages (TOS, EULA, About, Contact)
- 
*/
