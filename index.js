const root = document.querySelector("#root");
const flags = document.querySelector("#flags");
let isGameOver = false;
const numRows = 15;
const numColums = 15;
const numBombs = 30;
let numFlags = 30;
flags.innerText = `Flags left: ${numFlags}`;
let createdBombs = 0;
const cellWidth = 40;
let GRID = [];
const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const gameOver = () => {
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numColums; j++) {
      if (GRID[i][j]) {
        const bomb = document.getElementById(`${i}-${j}`);
        bomb.innerText = "💣";
      }
    }
  }
};

const checkForWin = () => {
  let counterBombs = 0;
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numColums; j++) {
      if (GRID[i][j]) {
        const bomb = document.getElementById(`${i}-${j}`);
        if (bomb.classList.contains("flag")) {
          counterBombs++;
        }
      }
    }
  }
  if (counterBombs === numBombs) {
    alert("you win");
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numColums; j++) {
        const bomb = document.getElementById(`${i}-${j}`);
        if (bomb.classList.contains("flag")) {
          bomb.classList.add("checked");
        }
      }
    }
  }
};

const checkNeighbors = (i, j) => {
  operations.forEach(([x, y]) => {
    const newI = i + x;
    const newJ = j + y;
    if (checkBounds(newI, newJ)) {
      setTimeout(
        cellClicked(document.getElementById(`${newI}-${newJ}`), newI, newJ),
        2000
      );
    }
  });
};

const checkBounds = (i, j) => {
  return i >= 0 && i < numRows && j >= 0 && j < numColums;
};

const cellClicked = (cell, i, j) => {
  if (
    isGameOver ||
    cell.classList.contains("checked") ||
    cell.classList.contains("flag")
  )
    return;

  if (cell.classList.contains("bomb")) {
    isGameOver = true;
    gameOver();
  } else {
    cell.classList.add("checked");
    if (cell.getAttribute("data") != "0") {
      cell.innerText = cell.getAttribute("data");
      return;
    }
    checkNeighbors(i, j);
  }
  cell.classList.add("checked");
};

const addFlag = (cell) => {
  if (!cell.classList.contains("checked")) {
    if (!cell.classList.contains("flag")) {
      cell.classList.add("flag");
      cell.innerText = "🚩";
      numFlags--;
      flags.innerText = `Flags left: ${numFlags}`;
      checkForWin();
    } else {
      cell.classList.remove("flag");
      cell.innerText = "";
      numFlags++;
      flags.innerText = `Flags left: ${numFlags}`;
    }
  }
};

const createGrid = () => {
  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = `repeat(${numColums},${cellWidth}px)`;
  grid.setAttribute("id", "grid");
  root.append(grid);

  for (let i = 0; i < numRows; i++) {
    GRID.push(Array(numColums).fill(0));
  }

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numColums; j++) {
      const cell = document.createElement("div");
      cell.style.width = `${cellWidth}px`;
      cell.style.height = `${cellWidth}px`;
      cell.setAttribute("id", `${i}-${j}`);
      cell.classList.add("cell");
      cell.onclick = (e) => {
        e.preventDefault();
        cellClicked(cell, i, j);
      };
      cell.oncontextmenu = (e) => {
        e.preventDefault();
        addFlag(cell);
      };
      grid.append(cell);
    }
  }

  while (createdBombs < numBombs) {
    const newI = Math.floor(Math.random() * numRows);
    const newJ = Math.floor(Math.random() * numColums);
    const cell = document.getElementById(`${newI}-${newJ}`);
    if (GRID[newI][newJ] === 0) {
      cell.classList.add("bomb");
      GRID[newI][newJ] = 1;
      createdBombs++;
    }
  }

  let bombsAround = 0;
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numColums; j++) {
      const cell = document.getElementById(`${i}-${j}`);
      operations.forEach(([x, y]) => {
        const newI = i + x;
        const newJ = j + y;
        if (checkBounds(newI, newJ)) {
          if (GRID[newI][newJ]) {
            bombsAround++;
          }
        }
      });
      if (!GRID[i][j]) {
        cell.setAttribute("data", bombsAround);
      }
      bombsAround = 0;
    }
  }
};

window.onload = () => {
  createGrid();
};
