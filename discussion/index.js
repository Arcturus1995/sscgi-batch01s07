const container2 = document.querySelector(".container2");
let boardLength = 16;

// Create the board (16x16)
let board = [];

// Loop to create rows and cells
for (let i = 0; i < boardLength; i++) {
  let row = [];
  for (let j = 0; j < boardLength; j++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    row.push(cell);
    container2.appendChild(cell);
  }
  board.push(row);
}

container2.style.display = "grid";
container2.style.gridTemplateColumns = `repeat(${boardLength}, 1fr)`;
container2.style.gridTemplateRows = `repeat(${boardLength}, 1fr)`;

// Style the cells
const cells = document.querySelectorAll(".cell");
cells.forEach((cell) => {
  cell.style.border = "1px solid #000";
  cell.style.width = "40px";
  cell.style.height = "30px";
});

const ghostSvg1 = '<img src="img/maria.svg" alt="" />';
const ghostSvg2 = '<img src="img/jason.svg" alt="" />';
const ghostSvg3 = '<img src="img/jean.svg" alt="" />';
const ghostSvg4 = '<img src="img/ghost.svg" alt="" />';
const ghosts = [ghostSvg1, ghostSvg2, ghostSvg3, ghostSvg4];

let ghostPositions = [];

// Randomly place ghosts
function placeGhosts() {
  const placedGhosts = new Set();
  while (placedGhosts.size < ghosts.length) {
    const randomIndex = Math.floor(Math.random() * (boardLength * boardLength)); // Random index
    if (!placedGhosts.has(randomIndex)) {
      placedGhosts.add(randomIndex);
      const randomGhost = ghosts[Math.floor(Math.random() * ghosts.length)];
      ghostPositions.push({ index: randomIndex, ghost: randomGhost });
    }
  }

  // Place the ghosts on the board
  ghostPositions.forEach((ghostData) => {
    cells[ghostData.index].innerHTML = ghostData.ghost;
  });
}

// Place Pacman in the initial position
let pacmanPosition = { x: 0, y: 0 };
const pacmanSVG = '<img src="img/Pacman.svg" alt="" />';

function updatePacmanPosition() {
  // Clear all cells (remove any Pacman SVG that might already be present)
  cells.forEach((cell) => {
    if (cell.innerHTML.includes("Pacman.svg")) {
      cell.innerHTML = ""; // Clear any Pacman instance
    }
  });

  // Set Pacman in the new position
  const index = pacmanPosition.y * boardLength + pacmanPosition.x;
  cells[index].innerHTML = pacmanSVG; // Place Pacman in the correct cell
}

// Move Pacman
function movePacman(direction) {
  switch (direction) {
    case "up":
      if (pacmanPosition.y > 0) pacmanPosition.y--;
      break;
    case "down":
      if (pacmanPosition.y < boardLength - 1) pacmanPosition.y++;
      break;
    case "left":
      if (pacmanPosition.x > 0) pacmanPosition.x--;
      break;
    case "right":
      if (pacmanPosition.x < boardLength - 1) pacmanPosition.x++;
      break;
  }
  updatePacmanPosition();
}

// Change direction using mouse clicks
container2.addEventListener("click", (event) => {
  const rect = container2.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  const pacmanCellX = pacmanPosition.x * 40 + 20; // 40px width, offset to center
  const pacmanCellY = pacmanPosition.y * 30 + 15; // 30px height, offset to center

  // Calculate direction based on click relative to Pacman's position
  const deltaX = clickX - pacmanCellX;
  const deltaY = clickY - pacmanCellY;

  let direction = "";
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    direction = deltaX > 0 ? "right" : "left"; // Move horizontally
  } else {
    direction = deltaY > 0 ? "down" : "up"; // Move vertically
  }

  // Move Pacman after determining the direction
  movePacman(direction);
});

// Keyboard controls for Pacman
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      movePacman("up");
      break;
    case "ArrowDown":
      movePacman("down");
      break;
    case "ArrowLeft":
      movePacman("left");
      break;
    case "ArrowRight":
      movePacman("right");
      break;
  }
});

// Initialize game state
updatePacmanPosition();
// Call to place the ghosts randomly on the board
placeGhosts();
