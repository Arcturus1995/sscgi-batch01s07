const container2 = document.querySelector("#container2");
const pacmanHealthInput = document.querySelector("#pacman-health");
const pacmanPowerInput = document.querySelector("#pacman-power");
const ghostsHealthContainer = document.querySelector("#ghosts-list");

let boardLength = 16;

// Create the board (16x16)
let board = [];
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

const cells = document.querySelectorAll(".cell");
cells.forEach((cell) => {
  cell.style.width = "40px";
  cell.style.height = "30px";
});

// Define Pacman and ghost properties
let pacman = {
  position: { x: 0, y: 0 },
  maxHp: 3,
  hp: getRandomPacmanHp(),
  power: 1,
  svg: '<img src="img/Pacman.svg" alt="" />',
};

// Define ghost properties
let ghosts = [
  {
    svg: '<img src="img/maria.svg" alt="" />',
    hp: getRandomHp(),
    maxHp: 70,
    position: null,
  },
  {
    svg: '<img src="img/jason.svg" alt="" />',
    hp: getRandomHp(),
    maxHp: 70,
    position: null,
  },
  {
    svg: '<img src="img/jean.svg" alt="" />',
    hp: getRandomHp(),
    maxHp: 70,
    position: null,
  },
  {
    svg: '<img src="img/ghost.svg" alt="" />',
    hp: getRandomHp(),
    maxHp: 70,
    position: null,
  },
];

// Get a random HP between 60% and 80% of max HP (3)
function getRandomPacmanHp() {
  return Math.floor(Math.random() * 2) + 2;
}

// Get a random HP between 30% and 70% of max HP (70)
function getRandomHp() {
  return Math.floor(Math.random() * 41) + 30;
}

// Update health inputs and ghost health display
function updateHealthInputs() {
  pacmanHealthInput.value = ((pacman.hp / pacman.maxHp) * 100).toFixed(0) + "%";
  pacmanPowerInput.value = pacman.power;

  // Update ghost health display
  ghostsHealthContainer.innerHTML = "";
  ghosts.forEach((ghost, index) => {
    const ghostElement = document.createElement("div");
    const ghostHpPercentage = ghost.hp;
    ghostElement.innerHTML = `
      Ghost ${index + 1}: ${ghost.svg} HP: ${ghostHpPercentage}%
    `;
    ghostsHealthContainer.appendChild(ghostElement);
  });
}

// Randomly place ghosts
function placeGhosts() {
  const placedGhosts = new Set();
  while (placedGhosts.size < ghosts.length) {
    const randomIndex = Math.floor(Math.random() * (boardLength * boardLength));
    if (!placedGhosts.has(randomIndex)) {
      placedGhosts.add(randomIndex);
      const ghost = ghosts[placedGhosts.size - 1];
      ghost.position = {
        x: randomIndex % boardLength,
        y: Math.floor(randomIndex / boardLength),
      };
      cells[randomIndex].innerHTML = `${ghost.svg}`;
    }
  }
}

// Update Pacman's position
function updatePacmanPosition() {
  cells.forEach((cell) => {
    if (cell.innerHTML.includes("Pacman.svg")) {
      cell.innerHTML = "";
    }
  });

  const index = pacman.position.y * boardLength + pacman.position.x;
  cells[index].innerHTML = `${pacman.svg}`;
}

// Move Pacman
function movePacman(direction) {
  switch (direction) {
    case "up":
      if (pacman.position.y > 0) pacman.position.y--;
      break;
    case "down":
      if (pacman.position.y < boardLength - 1) pacman.position.y++;
      break;
    case "left":
      if (pacman.position.x > 0) pacman.position.x--;
      break;
    case "right":
      if (pacman.position.x < boardLength - 1) pacman.position.x++;
      break;
  }

  checkCollision();
  updatePacmanPosition();
  updateHealthInputs();
}
function checkCollision() {
  ghosts.forEach((ghost, index) => {
    if (
      pacman.position.x === ghost.position.x &&
      pacman.position.y === ghost.position.y
    ) {
      const pacmanHpPercentage = (pacman.hp / pacman.maxHp) * 100;
      const ghostHpPercentage = ghost.hp;

      console.log(`Pacman HP: ${pacmanHpPercentage}%`);
      console.log(`Ghost ${index + 1} HP: ${ghostHpPercentage}%`);

      if (pacmanHpPercentage > ghostHpPercentage) {
        pacman.hp = Math.min(pacman.maxHp, pacman.hp + 1);
        ghost.hp = 0;
        const ghostIndex = ghost.position.y * boardLength + ghost.position.x;
        cells[ghostIndex].innerHTML = "";
        ghosts.splice(index, 1);
      } else if (pacmanHpPercentage === ghostHpPercentage) {
        alert("Pacman and the ghost have the same HP! Find another ghost.");
      } else {
        alert("Game Over! Pacman encountered a stronger ghost!");
        resetGame();
      }
    }
  });
}

// Reset the game
function resetGame() {
  pacman.hp = pacman.maxHp;
  pacman.position = { x: 0, y: 0 };
  ghosts.forEach((ghost) => (ghost.hp = getRandomHp()));
  cells.forEach((cell) => (cell.innerHTML = ""));
  updatePacmanPosition();
  placeGhosts();
  updateHealthInputs();
}

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

// Initialize the game
updatePacmanPosition();
placeGhosts();
updateHealthInputs();
