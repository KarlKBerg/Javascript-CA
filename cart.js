`use strict`;
export {
  cart,
  calculateCart,
  addToCart,
  displayCartItems,
  deleteCartItem,
  isCartEmpty,
  saveCart,
  displayCartPrices,
};
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function calculateCart() {
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
  const subtotalPrice = document.querySelector("#subtotal");
  const taxPrice = document.querySelector("#tax");
  const totalPrice = document.querySelector("#total");
  if (!subtotalPrice || !taxPrice || !totalPrice) return;
  subtotalPrice.textContent = `$${sub.toFixed(2)}`;
  taxPrice.textContent = `$${tax.toFixed(2)}`;
  totalPrice.textContent = `$${total}`;
}

function addToCart() {
  displayCartItems();
  calculateCart();
}

function displayCartItems() {
  const itemsContainer = document.querySelector(".items-container");
  if (!itemsContainer) return;
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
function deleteCartItem(event) {
  const game = event.target.closest(".cart-product");
  if (!game) return;
  const gameId = game.dataset.id;
  cart = cart.filter((item) => item.id !== gameId);
  isCartEmpty();
  displayMessage(`The item was removed`, "success");
  saveCart();
  displayCartItems();
  calculateCart();
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
