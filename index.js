`use strict`;
const API_BASE = "https://v2.api.noroff.dev/";
const API_PATH = "gamehub";
const url = API_BASE + API_PATH;

let allGames = [];

async function fetchGames() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    const result = await response.json();
    allGames = result.data;
  } catch (error) {
    displayMessage("Error: " + error);
  }
}
fetchGames();

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
