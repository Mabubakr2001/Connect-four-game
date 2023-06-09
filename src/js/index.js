// To make the file known to Webpack
import "../styles/style.css";

const gameSettings = {};

function createElement(elementType, elementState = undefined) {
  let element;
  if (elementType === "gameSetup") {
    element = `
   <div class="game-window" data-state="${elementState}" data-window="setup">
   <img src="./assets/images/logo.svg" class="w-fit mx-auto mb-20" />
   <button
     class="flex justify-between text-white items-center text-2xl font-bold border-3 border-black mb-5 py-3 px-4 rounded-2xl uppercase bg-main2 duration-main cursor-pointer w-full"
     data-option="playerVScpu"
   >
     <p class="pointer-events-none">player vs cpu</p>
     <img
       src="./assets/images/player-vs-cpu.svg"
       alt=""
       class="pointer-events-none"
     />
   </button>
   <button
     class="flex justify-between items-center text-2xl font-bold border-3 border-black mb-5 py-3 px-4 rounded-2xl uppercase bg-main3 duration-main cursor-pointer w-full"
     data-option="playerVSplayer"
   >
     <p class="pointer-events-none">player vs player</p>
     <img
       src="./assets/images/player-vs-player.svg"
       alt=""
       class="pointer-events-none"
     />
   </button>
   <button
     class="flex justify-between items-center font-bold text-2xl border-3 border-black py-3 px-4 rounded-2xl uppercase bg-white duration-main cursor-pointer w-full"
     data-rules-btn
   >
     <p class="pointer-events-none">game rules</p>
     <img
       src="./assets/images/rules.svg"
       alt=""
       class="pointer-events-none"
     />
   </button>
 </div>
    `;
  }

  if (elementType === "gameRules") {
    element = `
   <div class="game-window" data-state="${elementState}" data-window="rules">
   <h1 class="text-center uppercase tracking-wide font-extrabold text-6xl">
     Rules
   </h1>
   <h3 class="mt-8 mb-4 text-xl uppercase text-main font-bold">objective</h3>
   <p class="font-medium">
     Be the first player to connect 4 of the same colored discs in a row
     (either vertically, horizontally, or diagonally).
   </p>
   <h3 class="mt-8 mb-4 text-xl uppercase text-main font-bold">
     how to play
   </h3>
   <p class="font-medium mb-2">
     <span class="font-extrabold mr-2">1.</span> Red goes first in the first
     game.
   </p>
   <p class="font-medium mb-2">
     <span class="font-extrabold mr-2">2.</span> Players must alternate
     turns, and only one disc can be dropped in each turn.
   </p>
   <p class="font-medium mb-2">
     <span class="font-extrabold mr-2">3.</span> The game ends when there is
     a 4-in-a-row or a stalemate.
   </p>
   <p class="font-medium mb-2">
     <span class="font-extrabold mr-2">4.</span> The starter of the previous
     game goes second on the next game.
   </p>
   <svg
     data-check
     width="70px"
     height="75px"
     viewBox="0 0 70 75"
     version="1.1"
     xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
   >
     <g
       class="pointer-events-none"
       id="Designs"
       stroke="none"
       stroke-width="1"
       fill="none"
       fill-rule="evenodd"
     >
       <g id="icon-check" class="pointer-events-none">
         <circle
           class="border pointer-events-none"
           fill="#000000"
           cx="35"
           cy="35"
           r="35"
         ></circle>
         <circle
           class="box-shadow pointer-events-none"
           fill="#000000"
           cx="35"
           cy="40"
           r="35"
         ></circle>
         <circle
           class="pointer-events-none"
           id="Oval-Copy-39"
           fill="#FD6687"
           cx="35"
           cy="35"
           r="32"
         ></circle>
         <polyline
           class="pointer-events-none"
           id="Path"
           stroke="#FFFFFF"
           stroke-width="3"
           points="20 34.5819497 30.2640104 44.84596 50.1099704 25"
         ></polyline>
       </g>
     </g>
   </svg>
 </div>
   `;
  }

  document.body.insertAdjacentHTML("beforeend", element);
}

function enterTheGame() {
  const gameSetupWindow = document.querySelector(`[data-window="setup"]`);
  gameSetupWindow.dataset.state = "hidden";
  gameSetupWindow.addEventListener("animationend", () => {
    gameSetupWindow.remove();
    window.location.href = "insideGame.html";
  });

  localStorage.setItem("gameSettings", JSON.stringify(gameSettings));
}

function observeMutationOnTheBody() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const gameWindowElement = Array.from(mutation.addedNodes).find(
        (node) => node.dataset?.window != null
      );

      if (gameWindowElement == null) return;

      gameWindowElement.addEventListener("click", ({ target }) => {
        const clickedSpot = target;
        const clickedSpotDataAttribute = clickedSpot.dataset;

        if (clickedSpotDataAttribute.option) {
          gameSettings.playingOption = clickedSpotDataAttribute.option;
          enterTheGame();
        }

        if (clickedSpotDataAttribute.rulesBtn != null) {
          gameWindowElement.dataset.state = "hidden";
          gameWindowElement.addEventListener("animationend", () => {
            gameWindowElement.remove();
            createElement("gameRules", "animated");
          });
        }

        if (clickedSpotDataAttribute.check != null) {
          gameWindowElement.dataset.state = "hidden";
          gameWindowElement.addEventListener("animationend", () => {
            gameWindowElement.remove();
            createElement("gameSetup", "animated");
          });
        }
      });
    });
  });
  observer.observe(document.body, {
    childList: true,
  });
}

observeMutationOnTheBody();
createElement("gameSetup", "visible");
