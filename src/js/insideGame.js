import "../styles/style.css";
const approvedGameSettings = JSON.parse(localStorage.getItem("gameSettings"));
const menuBtn = document.querySelector("[data-menu-btn]");

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

function handleWinning() {
  document.querySelector("[data-winner-color]")?.remove();
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

function checkWin(board, player) {
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
  tileElementCell.dataset.state = `${
    currentActivePlayer === 1 ? "red" : "yellow"
  }`;
  if (tileElementCell == null) return;
  tileElementCell.appendChild(tileElement);
}

function switchPlayer() {
  currentActivePlayer = currentActivePlayer === 1 ? 2 : 1;
  document.querySelectorAll("[data-player-type]").forEach((playerSpot) => {
    if (playerSpot.dataset.playerType === currentActivePlayer.toString())
      return (playerSpot.dataset.state = "active");
    playerSpot.dataset.state = "stable";
  });
}

function makeTileComesIntoExistence(column) {
  console.log(gameOver);
  if (!gameOver) {
    const lowestEmptyRow = getLowestEmptyRow(column);
    if (lowestEmptyRow === -1) return;
    gameBoard[lowestEmptyRow][column - 1] = currentActivePlayer;
    const tileElementAboutToBeInserted = createTileElement(
      lowestEmptyRow,
      column,
      currentActivePlayer
    );
    checkWin(gameBoard, currentActivePlayer);
    insertTileElement(tileElementAboutToBeInserted);
    switchPlayer();
    updateThePointer(document.querySelector(`[data-column-num="${column}"]`));
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
     <span class="block w-fit mx-auto text-6xl font-bold" data-user-score
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
    document.querySelectorAll(".player").forEach((playerSpot) => {
      playerSpot.dataset.state = "animated";
      playerSpot.addEventListener("transitionend", () => {
        if (playerSpot.dataset.playerType === "1")
          playerSpot.dataset.state = "active";
      });
    });
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

function updateThePointer(targetColumn) {
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
    }.svg" alt="" />`
  );
}

window.addEventListener("load", initGameView);

menuBtn.addEventListener("click", openMenuWindow);

document.addEventListener("mousemove", ({ target }) =>
  updateThePointer(target)
);

document
  .querySelector("[data-grid-column-only]")
  .addEventListener("click", ({ target }) => {
    const choosenColumnNum =
      target.closest("[data-column-num]")?.dataset.columnNum;

    if (choosenColumnNum == null) return;

    makeTileComesIntoExistence(+choosenColumnNum);
  });

/* 

if (cell === player) {
  // if board[0][0] === 1
  for (const [dx, dy] of directions) {
    let settledCells = 0;
    for (let k = 0; k < 4; k++) {
      const anotherRow = row + k * dx; // 0
      const anotherCol = col + k * dy; // 0

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
      return console.log("Connect four!");
    }
  }
}

*/
