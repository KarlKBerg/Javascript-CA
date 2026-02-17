`use strict`;
const API_BASE = "https://v2.api.noroff.dev/";
const API_PATH = "gamehub";
const url = API_BASE + API_PATH;

let allGames = [];

// API FETCH
async function fetchGames() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    const result = await response.json();
    allGames = result.data;
    console.log(allGames);
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
  console.log(filterGames);
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
