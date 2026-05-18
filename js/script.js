// ================================================================
// HAMBURGER MENU
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  const menubar   = document.querySelector('.nav-menubar');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (menubar && !menubar.contains(e.target)) {
        navLinks.classList.remove('active');
      }
    });
  }
});

// ================================================================
// EXTERNAL LINKS
// ================================================================

document.querySelectorAll('a[href^="http"]').forEach(link => {
  if (!link.href.includes(window.location.host)) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
  }
});

// ================================================================
// ROTATING LOGO
// ================================================================

const logoImages = [
  './images/logo01.png',
  './images/logo02.png',
  './images/logo03.png',
  './images/logo04.png'
];

let currentLogoIndex = 0;
const logoElement = document.getElementById('rotating-logo');

if (logoElement) {
  setInterval(() => {
    logoElement.style.opacity = '0.6';
    setTimeout(() => {
      currentLogoIndex = (currentLogoIndex + 1) % logoImages.length;
      logoElement.src = logoImages[currentLogoIndex];
      logoElement.style.opacity = '1';
    }, 200);
  }, 3000);
}

// ================================================================
// TASKBAR CLOCK
// ================================================================

function updateClock() {
  const clock = document.getElementById('taskbar-clock');
  if (!clock) return;
  const now = new Date();
  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  clock.textContent = `${h}:${m} ${ampm}`;
}

updateClock();
setInterval(updateClock, 10000);

// ================================================================
// MYSTIC SQUARE GAME
// ================================================================

(function () {
  const GRID = 4;
  const TOTAL = GRID * GRID;

  let tiles       = [];
  let emptyIndex  = TOTAL - 1;
  let moveCount   = 0;
  let elapsedSecs = 0;
  let timerInt    = null;
  let gameActive  = false;

  const boardEl   = document.getElementById('game-board');
  const movesEl   = document.getElementById('game-moves');
  const timeEl    = document.getElementById('game-time');
  const dispEl    = document.getElementById('game-display-timer');
  const winMsgEl  = document.getElementById('game-win-message');
  const winTxtEl  = document.getElementById('win-stats-text');
  const newBtn    = document.getElementById('new-game-btn');
  const bestTimeEl  = document.getElementById('best-time');
  const bestMovesEl = document.getElementById('best-moves');

  if (!boardEl) return;

  // ── Helpers ──────────────────────────────────────────────────

  function fmt(s) {
    const h   = String(Math.floor(s / 3600)).padStart(2, '0');
    const m   = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${sec}`;
  }

  function isSolved() {
    for (let i = 0; i < TOTAL - 1; i++) {
      if (tiles[i] !== i + 1) return false;
    }
    return tiles[TOTAL - 1] === 0;
  }

  function neighbors() {
    const r = Math.floor(emptyIndex / GRID);
    const c = emptyIndex % GRID;
    const n = [];
    if (r > 0)        n.push(emptyIndex - GRID);
    if (r < GRID - 1) n.push(emptyIndex + GRID);
    if (c > 0)        n.push(emptyIndex - 1);
    if (c < GRID - 1) n.push(emptyIndex + 1);
    return n;
  }

  function swap(idx) {
    tiles[emptyIndex] = tiles[idx];
    tiles[idx] = 0;
    emptyIndex = idx;
  }

  function shuffle() {
    tiles = Array.from({ length: TOTAL - 1 }, (_, i) => i + 1);
    tiles.push(0);
    emptyIndex = TOTAL - 1;
    let prev = -1;
    for (let i = 0; i < 400; i++) {
      const opts = neighbors().filter(n => n !== prev);
      const pick = opts[Math.floor(Math.random() * opts.length)];
      prev = emptyIndex;
      swap(pick);
    }
  }

  // ── Timer ─────────────────────────────────────────────────────

  function startTimer() {
    timerInt = setInterval(() => {
      elapsedSecs++;
      const t = fmt(elapsedSecs);
      if (timeEl) timeEl.textContent = t;
      if (dispEl)  dispEl.textContent = t;
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInt);
    timerInt = null;
  }

  // ── Render ────────────────────────────────────────────────────

  function render() {
    boardEl.innerHTML = '';
    const idle      = !gameActive && moveCount === 0;
    const moveables = idle ? neighbors() : [];

    tiles.forEach((num, idx) => {
      const tile = document.createElement('div');
      if (num === 0) {
        tile.className = 'game-tile game-tile-empty';
      } else {
        tile.className = 'game-tile';
        if (num === idx + 1) tile.classList.add('game-tile-correct');
        if (idle && moveables.includes(idx)) tile.classList.add('game-tile-moveable');
        tile.textContent = num;
        tile.addEventListener('click', () => onTileClick(idx));
      }
      boardEl.appendChild(tile);
    });

    if (movesEl) movesEl.textContent = moveCount;

    const hintEl = document.getElementById('game-hint');
    if (hintEl) hintEl.classList.toggle('hide', !idle);
  }

  // ── Click ─────────────────────────────────────────────────────

  function onTileClick(idx) {
    if (!neighbors().includes(idx)) return;

    if (!gameActive) {
      gameActive = true;
      startTimer();
    }

    swap(idx);
    moveCount++;
    render();

    if (isSolved()) {
      stopTimer();
      gameActive = false;
      showWin();
    }
  }

  // ── Win ───────────────────────────────────────────────────────

  function showWin() {
    if (!winMsgEl) return;
    const timeStr = fmt(elapsedSecs);
    if (winTxtEl) {
      winTxtEl.textContent =
        `Solved in ${moveCount} move${moveCount !== 1 ? 's' : ''} and ${timeStr}!`;
    }
    winMsgEl.classList.add('show', 'game-win-flash');

    const prevTime  = parseInt(localStorage.getItem('msq-best-time')  || 'Infinity', 10);
    const prevMoves = parseInt(localStorage.getItem('msq-best-moves') || 'Infinity', 10);

    if (elapsedSecs < prevTime) {
      localStorage.setItem('msq-best-time', elapsedSecs);
      if (bestTimeEl) bestTimeEl.textContent = timeStr;
    }
    if (moveCount < prevMoves) {
      localStorage.setItem('msq-best-moves', moveCount);
      if (bestMovesEl) bestMovesEl.textContent = moveCount;
    }
  }

  // ── New Game ──────────────────────────────────────────────────

  function newGame() {
    stopTimer();
    moveCount   = 0;
    elapsedSecs = 0;
    gameActive  = false;

    const zero = fmt(0);
    if (timeEl)  timeEl.textContent  = zero;
    if (dispEl)  dispEl.textContent  = zero;
    if (movesEl) movesEl.textContent = '0';
    if (winMsgEl) winMsgEl.classList.remove('show', 'game-win-flash');

    shuffle();
    render();
  }

  // ── Load Best ─────────────────────────────────────────────────

  function loadBest() {
    const bt = localStorage.getItem('msq-best-time');
    const bm = localStorage.getItem('msq-best-moves');
    if (bt && bestTimeEl)   bestTimeEl.textContent  = fmt(parseInt(bt, 10));
    if (bm && bestMovesEl)  bestMovesEl.textContent = bm;
  }

  // ── Init ──────────────────────────────────────────────────────

  if (newBtn) newBtn.addEventListener('click', newGame);

  document.addEventListener('DOMContentLoaded', () => {
    loadBest();
    newGame();
  });
})();
