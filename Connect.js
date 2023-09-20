document.addEventListener("DOMContentLoaded", () => {
  class Player {
    constructor(color) {
      this.color = color;
    }
  }
  
  class Game {
    constructor(width, height) {
      this.WIDTH = width;
      this.HEIGHT = height;
      this.players = []; // Store player objects
      this.currPlayer = null;
      this.board = [];
      this.isGameOver = false;
  
      this.initializePlayers();
      this.makeBoard();
      this.makeHtmlBoard();
  
      const startButton = document.getElementById('start-button');
      startButton.addEventListener('click', () => {
        this.startGame();
        this.initializePlayers();
        console.log('game started');
        console.log(this.players);
      });
  
      const colorForm = document.getElementById("color-form");
      colorForm.addEventListener("submit", (event) => {
        console.log('form submitted');
        event.preventDefault();
        this.initializePlayers(); // Update player colors on form submission
      });
    }
  
    initializePlayers() {
      const player1Color = document.getElementById("player1-color").value;
      const player2Color = document.getElementById("player2-color").value;
  
      this.players[0] = new Player(player1Color);
      this.players[1] = new Player(player2Color);
    }
  
    startGame() {
      this.restartGame();
      this.isGameOver = false;
    }
  
    makeBoard() {
      for (let y = 0; y < this.HEIGHT; y++) {
        this.board[y] = Array.from({ length: this.WIDTH }); // Initialize each row with null
      }
    }
  
    makeHtmlBoard() {
      const htmlBoard = document.getElementById("board");
  
      const top = document.createElement("tr");
      top.setAttribute("id", "column-top");
      top.addEventListener("click", this.handleClick.bind(this));
  
      for (let x = 0; x < this.WIDTH; x++) {
        const headCell = document.createElement("td");
        headCell.setAttribute("id", x);
        top.appendChild(headCell);
      }
      htmlBoard.appendChild(top);
  
      for (let y = 0; y < this.HEIGHT; y++) {
        const row = document.createElement("tr");
        for (let x = 0; x < this.WIDTH; x++) {
          const cell = document.createElement("td");
          cell.setAttribute("id", `${y}-${x}`);
          row.appendChild(cell);
        }
        htmlBoard.appendChild(row);
      }
    }
  
    findSpotForCol(x) {
      for (let y = this.HEIGHT - 1; y >= 0; y--) {
        if (!this.board[y][x]) {
          return y;
        }
      }
      return null; // Column is completely filled
    }
  
    placeInTable(y, x) {
      const piece = document.createElement("div");
      piece.classList.add("piece");
      piece.style.backgroundColor = this.currPlayer === 1 ? this.players[0].color : this.players[1].color; // Set piece color
      const cell = document.getElementById(`${y}-${x}`);
      cell.appendChild(piece);
  
      const initialY = -50 - y * 50;
      const finalY = 0;
  
      piece.style.transform = `translateY(${initialY}px)`;
      setTimeout(() => {
        piece.style.transform = `translateY(${finalY}px)`;
      }, 10);
      console.log('piece placed');
    }
  
    endGame(msg) {
      alert(msg);
    }
  
    checkForWin() {
      function _win(cells) {
        return cells.every(
          ([y, x]) =>
            y >= 0 &&
            y < this.HEIGHT &&
            x >= 0 &&
            x < this.WIDTH &&
            this.board[y][x] === this.currPlayer
        );
      }
  
      for (let y = 0; y < this.HEIGHT; y++) {
        for (let x = 0; x < this.WIDTH; x++) {
          const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
          const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
          const diagR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
          const diagL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
          if (
            _win.call(this, horiz) ||
            _win.call(this, vert) ||
            _win.call(this, diagR) ||
            _win.call(this, diagL)
          ) {
            return true;
          }
        }
      }
      return false;
    }
  
    handleClick(evt) {
  
      if (this.isGameOver) {
        return;
      }
  
      if (this.checkForWin()) {
        return;
      }
  
      const x = +evt.target.id;
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }
      console.log('Click');
  
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);
  
      if (this.checkForWin()) {
        this.isGameOver = true;
        return this.endGame(`Player ${this.currPlayer} wins!`);
      }
  
      if (this.board.every(row => row.every(cell => cell))) {
        this.isGameOver = true;
        return this.endGame("It's a tie!");
      }
  
      this.currPlayer = this.currPlayer === 1 ? 2 : 1;
    }
  
    restartGame() {
      for (let row = 0; row < this.HEIGHT; row++) {
        for (let col = 0; col < this.WIDTH; col++) {
          this.board[row][col] = null;
          const cell = document.getElementById(`${row}-${col}`);
          while (cell.firstChild) {
            cell.removeChild(cell.firstChild);
          }
        }
      }
      this.currPlayer = 1;
      const winMessage = document.querySelector('.win-message');
      if (winMessage) {
        winMessage.remove();
      }
    }
  }

  const game = new Game(7, 6);
});