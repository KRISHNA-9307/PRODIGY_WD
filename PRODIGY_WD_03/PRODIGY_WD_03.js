const modeSelection = document.getElementById('mode-selection');
const gameContainer = document.getElementById('game-container');
const pvpModeButton = document.getElementById('pvp-mode');
const pveModeButton = document.getElementById('pve-mode');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset-button');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isAIMode = false;

const winningConditions = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal
  [2, 4, 6]  // Diagonal
];

// Handle mode selection
pvpModeButton.addEventListener('click', () => {
  isAIMode = false;
  startGame();
});

pveModeButton.addEventListener('click', () => {
  isAIMode = true;
  startGame();
});

// Start the game
function startGame() {
  modeSelection.style.display = 'none'; // Hide mode selection
  gameContainer.style.display = 'block'; // Show game board
  resetGame(); // Reset the game state
}

// Handle cell clicks
function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (gameState[clickedCellIndex] !== '' || !gameActive) {
    return;
  }

  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;

  checkForWinner();

  if (gameActive) {
    if (isAIMode && currentPlayer === 'X') {
      // Switch to AI's turn
      currentPlayer = 'O';
      statusText.textContent = `AI is thinking...`;
      setTimeout(() => {
        aiMove();
        checkForWinner();
      }, 500); // Add a small delay for better UX
    } else {
      // Switch to the other player
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      statusText.textContent = `It's ${currentPlayer}'s turn`;
    }
  }
}

// AI's move using Minimax
function aiMove() {
  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < 9; i++) {
    if (gameState[i] === '') {
      gameState[i] = 'O'; // AI is 'O'
      let score = minimax(gameState, 0, false);
      gameState[i] = ''; // Undo the move
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  gameState[bestMove] = 'O';
  cells[bestMove].textContent = 'O';
  currentPlayer = 'X'; // Switch back to human player
  statusText.textContent = `It's ${currentPlayer}'s turn`;
}

// Minimax algorithm
function minimax(board, depth, isMaximizing) {
  const result = checkWinner(board);

  if (result !== null) {
    return result === 'O' ? 10 - depth : result === 'X' ? depth - 10 : 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Check for a winner or draw
function checkForWinner() {
  const result = checkWinner(gameState);

  if (result === 'X') {
    statusText.textContent = isAIMode ? 'You win!' : 'Player X wins!';
    gameActive = false;
  } else if (result === 'O') {
    statusText.textContent = isAIMode ? 'AI wins!' : 'Player O wins!';
    gameActive = false;
  } else if (!gameState.includes('')) {
    statusText.textContent = 'Draw!';
    gameActive = false;
  }
}

// Check the board for a winner
function checkWinner(board) {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
      return board[a]; // Return the winning player ('X' or 'O')
    }
  }
  if (!board.includes('')) return 'draw'; // If the board is full and no winner
  return null; // No winner yet
}

// Reset the game
function resetGame() {
  gameState = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = `It's ${currentPlayer}'s turn`;
  cells.forEach(cell => cell.textContent = '');
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);