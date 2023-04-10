import "../styles/style.css";
const approvedGameSettings = JSON.parse(localStorage.getItem("gameSettings"));
const menuBtn = document.querySelector("[data-menu-btn]");
approvedGameSettings.currentTurnColor = "red";

const gameBoard = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

function createElement(elementType, elementState = undefined) {
  let element;
  if (elementType === "playerOne") {
    element = `
   <div class="player" data-state="${elementState}" data-player-type="one">
     <img
       class="mx-auto -mt-11 mb-3"
       src="./assets/images/player-one.svg"
       alt=""
     />
     <h2 class="text-center text-xl font-bold uppercase">Player 1</h2>
     <span class="block w-fit mx-auto text-6xl font-bold" data-player-one-score
       >0</span
     >
   </div>
  `;
  }
  if (elementType === "playerTwo") {
    element = `
   <div class="player" data-state="${elementState}" data-player-type="two">
     <img
       class="mx-auto -mt-11 mb-3"
       src="./assets/images/player-two.svg"
       alt=""
     />
     <h2 class="text-center text-xl font-bold uppercase">Player 2</h2>
     <span class="block w-fit mx-auto text-6xl font-bold" data-player-two-score
       >0</span
     >
   </div>
  `;
  }
  if (elementType === "user") {
    element = `
   <div class="player" data-state="${elementState}" data-player-type="user">
     <img
       class="mx-auto -mt-11 mb-3"
       src="./assets/images/you.svg"
       alt=""
     />
     <h2 class="text-center text-xl font-bold uppercase">You</h2>
     <span class="block w-fit mx-auto text-6xl font-bold" data-user-score
       >0</span
     >
   </div>
  `;
  }
  if (elementType === "cpu") {
    element = `
   <div class="player" data-state="${elementState}" data-player-type="cpu">
     <img
       class="mx-auto -mt-11 mb-3"
       src="./assets/images/cpu.svg"
       alt=""
     />
     <h2 class="text-center text-xl font-bold uppercase">cpu</h2>
     <span class="block w-fit mx-auto text-6xl font-bold" data-cpu-score
       >0</span
     >
   </div>
  `;
  }
  if (elementType === "overlay") {
    element = `
   <div data-overlay data-state="${elementState}"></div>
  `;
  }
  if (elementType === "menu") {
    element = `
   <div
   class="game-window duration-600 z-10"
   data-window="menu"
   data-state="${elementState}"
 >
   <span class="block w-fit text-white mx-auto font-bold text-6xl uppercase"
     >pause</span
   >
   <button
     data-continue-btn
     class="block w-full mt-10 font-bold text-2xl border-3 border-black py-3 px-4 rounded-2xl uppercase bg-white duration-main cursor-pointer"
   >
     continue game
   </button>
   <button
     data-restart-btn-main
     class="block w-full mt-8 font-bold text-2xl border-3 border-black py-3 px-4 rounded-2xl uppercase bg-white duration-main cursor-pointer"
   >
     restart
   </button>
   <button
     data-quit-btn
     class="block w-full mt-8 font-bold text-2xl border-3 text-white border-black py-3 px-4 rounded-2xl uppercase bg-main2 duration-main cursor-pointer"
   >
     quit game
   </button>
 </div>
   `;
  }
  document.body.insertAdjacentHTML("beforeend", element);
}

function checkPlayingOption(playingOption) {
  if (playingOption === "playerVSplayer") {
    createElement("playerOne", "hidden");
    createElement("playerTwo", "hidden");
  }
  if (playingOption === "playerVScpu") {
    createElement("user", "hidden");
    createElement("cpu", "hidden");
  }
}

function initGameView() {
  document.querySelector("[data-manipulate-game]").dataset.state = "visible";
  document.querySelector("[data-playing-interaction]").dataset.state =
    "visible";
  checkPlayingOption(approvedGameSettings.playingOption);
  setTimeout(() => {
    document
      .querySelectorAll(".player")
      .forEach((playerSpot) => (playerSpot.dataset.state = "visible"));
  }, 5);
}

function openMenuWindow() {
  createElement("overlay", "hidden");
  setTimeout(() => {
    const overlay = document.querySelector("[data-overlay]");
    overlay.dataset.state = "visible";
    overlay.addEventListener("transitionend", () => {
      createElement("menu", "hidden");
      setTimeout(() => {
        const menuWindow = document.querySelector(`[data-window="menu"]`);
        menuWindow.dataset.state = "visible";
      }, 5);
    });
  }, 5);
}

function moveThePointer(targetColumn) {
  const hoveredGridColumnNum =
    targetColumn.closest("[data-column-num]")?.dataset.columnNum;

  if (hoveredGridColumnNum == null) return;

  document
    .querySelectorAll("[data-pointer-column]")
    .forEach((spot) => (spot.innerHTML = ""));

  const targetPointerSpot = document.querySelector(
    `[data-pointer-column="${hoveredGridColumnNum}"]`
  );

  targetPointerSpot.insertAdjacentHTML(
    "beforeend",
    `<img src="./assets/images/marker-${approvedGameSettings.currentTurnColor}.svg" alt="" />`
  );
}

window.addEventListener("load", initGameView);

menuBtn.addEventListener("click", openMenuWindow);

document.addEventListener("mousemove", ({ target }) => moveThePointer(target));
