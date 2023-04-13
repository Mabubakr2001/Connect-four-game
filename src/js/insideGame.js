import "../styles/style.css";
const approvedGameSettings = JSON.parse(localStorage.getItem("gameSettings"));

let currentActivePlayer = 1;
let gameOver = false;

const gameBoard = [
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
];

function initGameView() {
  document.querySelector("[data-manipulate-game]").dataset.state = "visible";
  document.querySelector("[data-playing-interaction]").dataset.state =
    "visible";
  checkPlayingOption(approvedGameSettings.playingOption);
  setTimeout(() => {
    document.querySelectorAll(".player").forEach((playerSpot) => {
      playerSpot.dataset.state = "animated";
      playerSpot.addEventListener("transitionend", () => {
        if (playerSpot.dataset.playerType === "1")
          playerSpot.dataset.state = "active";
      });
    });
  }, 5);
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

function createElement(elementType, elementState = undefined) {
  let element;
  if (elementType === "playerOne") {
    element = `
 <div class="player" data-state="${elementState}" data-player-type="1">
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
 <div class="player" data-state="${elementState}" data-player-type="2">
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
 <div class="player" data-state="${elementState}" data-player-type="1">
   <img
     class="mx-auto -mt-11 mb-3"
     src="./assets/images/you.svg"
     alt=""
   />
   <h2 class="text-center text-xl font-bold uppercase">You</h2>
   <span class="block w-fit mx-auto text-6xl font-bold" data-player-one-score
     >0</span
   >
 </div>
`;
  }
  if (elementType === "cpu") {
    element = `
 <div class="player" data-state="${elementState}" data-player-type="2">
   <img
     class="mx-auto -mt-11 mb-3"
     src="./assets/images/cpu.svg"
     alt=""
   />
   <h2 class="text-center text-xl font-bold uppercase">cpu</h2>
   <span class="block w-fit mx-auto text-6xl font-bold" data-player-two-score
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
   data-window-btn="continue"
   class="block w-full mt-10 font-bold text-2xl border-3 border-black py-3 px-4 rounded-2xl uppercase bg-white duration-main cursor-pointer"
 >
   continue game
 </button>
 <button
   data-window-btn="restart"
   class="block w-full mt-8 font-bold text-2xl border-3 border-black py-3 px-4 rounded-2xl uppercase bg-white duration-main cursor-pointer"
 >
   restart
 </button>
 <button
   data-window-btn="quit"
   class="block w-full mt-8 font-bold text-2xl border-3 text-white border-black py-3 px-4 rounded-2xl uppercase bg-main2 duration-main cursor-pointer"
 >
   quit game
 </button>
</div>
 `;
  }
  document.body.insertAdjacentHTML("beforeend", element);
}

function openMenuWindow() {
  createElement("overlay", "hidden");
  setTimeout(() => {
    const overlay = document.querySelector("[data-overlay]");
    overlay.dataset.state = "visible";
    overlay.addEventListener("transitionend", () => {
      if (overlay.dataset.state === "hidden") return;
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
    `<img src="./assets/images/marker-${
      currentActivePlayer === 1 ? "red" : "yellow"
    }.svg" alt="" data-pointer/>`
  );
}

function updatePointerColor(pointerElement, newColor) {
  if (pointerElement == null) return;
  pointerElement.src = `./assets/images/marker-${newColor}.svg`;
}

function getLowestEmptyRow(column) {
  for (let row = gameBoard.length - 1; row >= 0; row--) {
    if (gameBoard[row][column - 1] == null) return row;
  }
  return -1;
}

function createTileElement(row, column, player) {
  const tileElement = document.createElement("div");
  tileElement.className = "tile";
  tileElement.dataset.row = row;
  tileElement.dataset.column = column;
  tileElement.classList.add(`bg-${player === 1 ? "main2" : "main3"}`);
  return tileElement;
}

function insertTileElement(tileElement) {
  const tileElementRow = +tileElement.dataset.row;
  const tileElementColumn = +tileElement.dataset.column;
  const tileElementCell = document.querySelector(
    `[data-row="${tileElementRow + 1}"][data-column="${tileElementColumn}"]`
  );
  if (tileElementCell == null) return;
  tileElementCell.appendChild(tileElement);
}

function switchPlayer(newPlayer) {
  document.querySelectorAll("[data-player-type]").forEach((playerSpot) => {
    if (playerSpot.dataset.playerType === newPlayer.toString())
      return (playerSpot.dataset.state = "active");
    playerSpot.dataset.state = "stable";
  });
}

function makeTileComesIntoExistence(column) {
  const lowestEmptyRow = getLowestEmptyRow(column);
  if (lowestEmptyRow === -1) return;
  gameBoard[lowestEmptyRow][column - 1] = currentActivePlayer;
  const tileElementAboutToBeInserted = createTileElement(
    lowestEmptyRow,
    column,
    currentActivePlayer
  );
  insertTileElement(tileElementAboutToBeInserted);
}

function handleWinning() {
  const winningElement = `
   <span
   class="absolute p-3 text-xl font-bold rounded-md"
   data-winner-color="${currentActivePlayer === 1 ? "red" : "yellow"}"
   >Winner!</span
 `;
  document.body.insertAdjacentHTML("beforeend", winningElement);
  const winnerPlayerSpot = document.querySelector(
    `[data-player-${currentActivePlayer === 1 ? "one" : "two"}-score]`
  );

  winnerPlayerSpot.textContent = +winnerPlayerSpot.textContent + 1;
}

function checkWinning(board, player) {
  const numRows = board.length;
  const numCols = board[0].length;

  const directions = [
    [0, 1], // horizontal
    [1, 1], // diagonal /
    [1, 0], // vertical |
    [1, -1], // diagonal \
  ];

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const cell = board[row][col];

      if (cell !== player) {
        continue;
      }

      for (const [dx, dy] of directions) {
        let settledCells = 0;

        for (let i = 0; i < 4; i++) {
          const anotherRow = row + i * dx;
          const anotherCol = col + i * dy;

          if (
            anotherRow >= 0 &&
            anotherRow < numRows &&
            anotherCol >= 0 &&
            anotherCol < numCols &&
            board[anotherRow][anotherCol] === player
          ) {
            settledCells++;
          }
        }

        if (settledCells === 4) {
          gameOver = true;
          handleWinning();
          return true;
        }
      }
    }
  }

  return false;
}

function runTheGame(clickedSpot) {
  if (gameOver) return;

  const choosenColumnNum =
    clickedSpot.closest("[data-column-num]")?.dataset.columnNum;

  if (choosenColumnNum == null) return;

  const theColumnIsNotEmpty = gameBoard.every(
    (row) => row[choosenColumnNum - 1] != null
  );

  if (theColumnIsNotEmpty) return;

  makeTileComesIntoExistence(+choosenColumnNum);

  if (checkWinning(gameBoard, currentActivePlayer)) return;

  switchPlayer((currentActivePlayer = currentActivePlayer === 1 ? 2 : 1));
  updatePointerColor(
    document.querySelector("[data-pointer]"),
    currentActivePlayer === 1 ? "red" : "yellow"
  );
}

function resetGameBoard(board) {
  const allRows = board.length;
  const allCols = board.at(0).length;
  for (let row = 0; row < allRows; row++) {
    for (let col = 0; col < allCols; col++) {
      const cellElement = document.querySelector(
        `[data-row="${row + 1}"][data-column="${col + 1}"]`
      );
      if (board[row][col] === null) {
        continue;
      }
      board[row][col] = null;
      cellElement.innerHTML = "";
    }
  }
}

function restartTheGame() {
  currentActivePlayer = 1;
  switchPlayer(1);
  document.querySelector("[data-winner-color]")?.remove();
  updatePointerColor(
    document.querySelector("[data-pointer]"),
    currentActivePlayer === 1 ? "red" : "yellow"
  );
  resetGameBoard(gameBoard);
  gameOver = false;
  document.querySelector("[data-restart-btn-sub]").dataset.state = "enabled";
}

function handleModalWindowBtnsClick(action, modalWindow) {
  switch (action) {
    case "restart":
    case "continue":
      modalWindow.dataset.state = "hidden";
      modalWindow.addEventListener("transitionend", () => {
        modalWindow.remove();
        const overlay = document.querySelector("[data-overlay]");
        overlay.dataset.state = "hidden";
        overlay.addEventListener("transitionend", () => overlay.remove());
      });
      break;
    case "quit":
      modalWindow.dataset.state = "hidden";
      modalWindow.addEventListener("transitionend", () => {
        modalWindow.remove();
        const overlay = document.querySelector("[data-overlay]");
        overlay.dataset.state = "hidden";
        document.querySelector("[data-manipulate-game]").dataset.state =
          "hidden";
        document.querySelector("[data-playing-interaction]").dataset.state =
          "hidden";
        document.querySelector("[data-winner-color]")?.remove();
        document
          .querySelectorAll("[data-player-type]")
          .forEach((playerSpot) => (playerSpot.dataset.state = "hidden"));
        overlay.addEventListener("transitionend", () => {
          overlay.remove();
          window.location.href = "index.html";
        });
      });
      break;
    default:
      return;
  }
  document.querySelector("[data-menu-btn]").dataset.state = "enabled";
}

function observeMutationOnTheBody() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const menuWindow = Array.from(mutation.addedNodes).find(
        (node) => node.dataset?.window === "menu"
      );

      if (menuWindow == null) return;

      menuWindow.addEventListener("click", ({ target }) => {
        const clickedBtn = target.closest("[data-window-btn]");

        if (clickedBtn == null) return;

        if (clickedBtn.dataset.windowBtn === "restart") {
          restartTheGame();
          handleModalWindowBtnsClick("restart", menuWindow);
        }

        if (clickedBtn.dataset.windowBtn === "quit")
          handleModalWindowBtnsClick("quit", menuWindow);

        if (clickedBtn.dataset.windowBtn === "continue")
          handleModalWindowBtnsClick("continue", menuWindow);
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
  });
}

window.addEventListener("load", initGameView);

document
  .querySelector("[data-manipulate-game]")
  .addEventListener("click", ({ target }) => {
    if (target.dataset.menuBtn != null) {
      target.dataset.state = "disabled";
      openMenuWindow();
    }
    if (target.dataset.restartBtnSub != null) restartTheGame();
  });

document.addEventListener("mousemove", ({ target }) => moveThePointer(target));

document
  .querySelector("[data-grid-column-only]")
  .addEventListener("click", ({ target }) => runTheGame(target));

observeMutationOnTheBody();

/* <div class="winning-circle" data-winning-circle></div> */
