'use strict';

const WINS = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]          // diagonals
];

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let vsAI = false;
let scores = { X: 0, O: 0, draws: 0 };

const cells = document.querySelectorAll('.cell');
const statusEl = document.getElementById('status');
const btn2p = document.getElementById('btn-2p');
const btnAI = document.getElementById('btn-ai');
const resetBtn = document.getElementById('reset-btn');
const resetScoreBtn = document.getElementById('reset-score-btn');

cells.forEach(cell => cell.addEventListener('click', onCellClick));
btn2p.addEventListener('click', () => setMode(false));
btnAI.addEventListener('click', () => setMode(true));
resetBtn.addEventListener('click', newGame);
resetScoreBtn.addEventListener('click', resetScores);

function setMode(ai) {
  vsAI = ai;
  btn2p.classList.toggle('active', !ai);
  btnAI.classList.toggle('active', ai);
  newGame();
}

function onCellClick(e) {
  const idx = +e.target.dataset.index;
  if (gameOver || board[idx]) return;
  if (vsAI && currentPlayer === 'O') return; // AI's turn

  makeMove(idx, currentPlayer);

  if (!gameOver && vsAI && currentPlayer === 'O') {
    setTimeout(aiMove, 300);
  }
}

function makeMove(idx, player) {
  board[idx] = player;
  const cell = cells[idx];
  cell.textContent = player;
  cell.classList.add(player.toLowerCase(), 'taken');

  const winLine = checkWin(board);
  if (winLine) {
    endGame(player, winLine);
  } else if (board.every(Boolean)) {
    endGame(null);
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
  }
}

function endGame(winner, winLine = []) {
  gameOver = true;
  if (winner) {
    scores[winner]++;
    updateScoreboard();
    winLine.forEach(i => cells[i].classList.add('win'));
    statusEl.textContent = `Player ${winner} wins!`;
    statusEl.className = `status winner ${winner.toLowerCase()}-turn`;
  } else {
    scores.draws++;
    updateScoreboard();
    statusEl.textContent = "It's a draw!";
    statusEl.className = 'status draw';
  }
}

function updateStatus() {
  const who = vsAI && currentPlayer === 'O' ? 'AI' : `Player ${currentPlayer}`;
  statusEl.textContent = `${who}'s turn`;
  statusEl.className = `status ${currentPlayer.toLowerCase()}-turn`;
}

function updateScoreboard() {
  document.getElementById('x-wins').textContent = scores.X;
  document.getElementById('o-wins').textContent = scores.O;
  document.getElementById('draws').textContent = scores.draws;
}

function newGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
  });
  updateStatus();
}

function resetScores() {
  scores = { X: 0, O: 0, draws: 0 };
  updateScoreboard();
  newGame();
}

// --- AI (minimax) ---

function checkWin(b) {
  for (const line of WINS) {
    const [a, c, d] = line;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return line;
  }
  return null;
}

function aiMove() {
  const idx = bestMove(board);
  makeMove(idx, 'O');
}

function bestMove(b) {
  let best = -Infinity, move = -1;
  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      b[i] = 'O';
      const score = minimax(b, false, -Infinity, Infinity);
      b[i] = null;
      if (score > best) { best = score; move = i; }
    }
  }
  return move;
}

function minimax(b, isMax, alpha, beta) {
  const win = checkWin(b);
  if (win) return isMax ? -10 : 10;
  if (b.every(Boolean)) return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = 'O';
        best = Math.max(best, minimax(b, false, alpha, beta));
        b[i] = null;
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = 'X';
        best = Math.min(best, minimax(b, true, alpha, beta));
        b[i] = null;
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  }
}
