const boardElement = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("statusText");
const resetBtn = document.getElementById("resetBtn");

const scoreXElement = document.getElementById("scoreX");
const scoreOElement = document.getElementById("scoreO");
const scoreDrawElement = document.getElementById("scoreDraw");

// Overlay elements
const resultOverlay = document.getElementById("resultOverlay");
const resultMessage = document.getElementById("resultMessage");
const newGameBtn = document.getElementById("newGameBtn");

let boardState = Array(9).fill(null); // ['X', 'O', ...]
let currentPlayer = "X";
let gameActive = true;

let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

const winningPatterns = [
  [0, 1, 2], // rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // cols
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // diagonals
  [2, 4, 6],
];

function handleCellClick(e) {
  const cell = e.target;
  const index = parseInt(cell.getAttribute("data-index"), 10);

  if (!gameActive) return;
  if (boardState[index] !== null) return; // already filled

  // Update state
  boardState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("filled");

  // Check win / draw
  if (checkWin(currentPlayer)) {
    handleWin(currentPlayer);
  } else if (boardState.every((v) => v !== null)) {
    handleDraw();
  } else {
    // Switch player
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatusText();
  }
}

function checkWin(player) {
  return winningPatterns.some((pattern) => {
    return pattern.every((index) => boardState[index] === player);
  });
}

function handleWin(player) {
  gameActive = false;
  highlightWinningCells(player);
  statusText.textContent = `Player ${player} wins! 🎉`;

  if (player === "X") {
    scoreX++;
    scoreXElement.textContent = scoreX;
  } else {
    scoreO++;
    scoreOElement.textContent = scoreO;
  }

  boardElement.classList.add("disabled");

  // Show result screen
  resultMessage.textContent = `Player ${player} wins! 🎉`;
  showOverlay();
}

function handleDraw() {
  gameActive = false;
  statusText.textContent = "It's a draw! 🤝";
  scoreDraw++;
  scoreDrawElement.textContent = scoreDraw;
  boardElement.classList.add("disabled");

  // Show result screen
  resultMessage.textContent = "It's a draw! 🤝";
  showOverlay();
}

function highlightWinningCells(player) {
  winningPatterns.forEach((pattern) => {
    if (pattern.every((index) => boardState[index] === player)) {
      pattern.forEach((index) => {
        cells[index].classList.add("win");
      });
    }
  });
}

function updateStatusText() {
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function resetGame() {
  boardState = Array(9).fill(null);
  currentPlayer = "X";
  gameActive = true;
  boardElement.classList.remove("disabled");

  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("filled", "win");
  });

  updateStatusText();
  hideOverlay();
}

function showOverlay() {
  resultOverlay.classList.add("show");
}

function hideOverlay() {
  resultOverlay.classList.remove("show");
}

// Event listeners
cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);

// Initial status text
updateStatusText();
