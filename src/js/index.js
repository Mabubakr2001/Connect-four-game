// To make the file known to Webpack
import "../styles/style.css";
const rulesBtn = document.querySelector("[data-rules]");
const gameSetupDiv = document.querySelector(".game-setup");

rulesBtn.addEventListener("click", () => {
  gameSetupDiv.dataset.state = "hidden";
  gameSetupDiv.addEventListener("animationend", () => {
    gameSetupDiv.remove();
  });
});
