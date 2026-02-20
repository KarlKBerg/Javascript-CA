`use strict`;
export {
  cart,
  addToCart,
  displayCartItems,
  deleteCartItem,
  isCartEmpty,
  saveCart,
};
let cart = JSON.parse(localStorage.getItem("cart")) || [];

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

function deleteCartItem() {
  let game = event.target.closest(".cart-product");
  let gameId = game.dataset.id;
  cart = cart.filter((item) => item.id !== gameId);
  isCartEmpty();

  saveCart();
  displayCartItems();
}

// Check if cart is empty and display empty text
function isCartEmpty() {
  const cartContainer = document.querySelector(".cart-price-container");
  const cartBtn = document.querySelector(".checkout-btn");
  if (cart.length === 0) {
    const container = document.querySelector(".items-container");
    container.innerHTML = "";
    cartContainer.classList.add("hidden");
    cartBtn.classList.add("hidden");

    const cartMessage = document.createElement("h2");
    cartMessage.classList.add("cart-message");
    cartMessage.textContent = "Cart is empty!";

    container.appendChild(cartMessage);
  } else {
    cartContainer.classList.remove("hidden");
    cartBtn.classList.remove("hidden");
  }
}
// Save cart array to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
