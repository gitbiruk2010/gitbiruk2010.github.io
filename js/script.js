// ================================================================
// NAV (MOBILE MENU)
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  const nav = document.querySelector('.nav');

  if (!toggle || !links) return;

  function closeMenu() {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) closeMenu();
  });

  // Bold the nav link of the section currently in view
  const tabs = [...links.querySelectorAll('a[href^="#"]')].map(a => {
    a.dataset.text = a.textContent;
    return { link: a, section: document.querySelector(a.getAttribute('href')) };
  }).filter(t => t.section);

  function updateActive() {
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    let current = null;
    tabs.forEach(t => {
      if (t.section.getBoundingClientRect().top <= 120) current = t;
    });
    if (atBottom) current = tabs[tabs.length - 1];
    tabs.forEach(t => {
      const on = t === current;
      t.link.classList.toggle('active', on);
      if (on) t.link.setAttribute('aria-current', 'true');
      else t.link.removeAttribute('aria-current');
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', updateActive);
  updateActive();
});

// ================================================================
// MYSTIC SQUARE GAME
// ================================================================

(function () {
  const GRID = 4;
  const TOTAL = GRID * GRID;

  let tiles = [];
  let emptyIndex = TOTAL - 1;
  let moveCount = 0;
  let elapsedSecs = 0;
  let timerInt = null;
  let gameActive = false;

  const boardEl = document.getElementById('game-board');
  const movesEl = document.getElementById('game-moves');
  const timeEl = document.getElementById('game-time');
  const winMsgEl = document.getElementById('game-win-message');
  const winTxtEl = document.getElementById('win-stats-text');
  const newBtn = document.getElementById('new-game-btn');
  const bestTimeEl = document.getElementById('best-time');
  const bestMovesEl = document.getElementById('best-moves');

  if (!boardEl) return;

  // localStorage can throw (private mode, blocked storage)
  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) {
      return null;
    }
    return null;
  }

  function fmt(s) {
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
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
    if (r > 0) n.push(emptyIndex - GRID);
    if (r < GRID - 1) n.push(emptyIndex + GRID);
    if (c > 0) n.push(emptyIndex - 1);
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
    if (isSolved()) shuffle();
  }

  function startTimer() {
    timerInt = setInterval(() => {
      elapsedSecs++;
      if (timeEl) timeEl.textContent = fmt(elapsedSecs);
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInt);
    timerInt = null;
  }

  function render() {
    boardEl.innerHTML = '';
    const idle = !gameActive && moveCount === 0;
    const moveables = idle ? neighbors() : [];

    tiles.forEach((num, idx) => {
      const tile = document.createElement('div');
      if (num === 0) {
        tile.className = 'game-tile game-tile-empty';
      } else {
        tile.className = 'game-tile';
        if (num === idx + 1) tile.classList.add('game-tile-correct');
        if (moveables.includes(idx)) tile.classList.add('game-tile-moveable');
        tile.textContent = num;
        tile.addEventListener('click', () => onTileClick(idx));
      }
      boardEl.appendChild(tile);
    });

    if (movesEl) movesEl.textContent = moveCount;

    const hintEl = document.getElementById('game-hint');
    if (hintEl) hintEl.classList.toggle('hide', !idle);
  }

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

  function showWin() {
    if (!winMsgEl) return;
    const timeStr = fmt(elapsedSecs);
    if (winTxtEl) {
      winTxtEl.textContent = `Solved in ${moveCount} move${moveCount !== 1 ? 's' : ''} and ${timeStr}!`;
    }
    winMsgEl.classList.add('show');

    const prevTime = parseInt(store('msq-best-time') || 'Infinity', 10);
    const prevMoves = parseInt(store('msq-best-moves') || 'Infinity', 10);

    if (elapsedSecs < prevTime) {
      store('msq-best-time', elapsedSecs);
      if (bestTimeEl) bestTimeEl.textContent = timeStr;
    }
    if (moveCount < prevMoves) {
      store('msq-best-moves', moveCount);
      if (bestMovesEl) bestMovesEl.textContent = moveCount;
    }
  }

  function newGame() {
    stopTimer();
    moveCount = 0;
    elapsedSecs = 0;
    gameActive = false;

    if (timeEl) timeEl.textContent = fmt(0);
    if (movesEl) movesEl.textContent = '0';
    if (winMsgEl) winMsgEl.classList.remove('show');

    shuffle();
    render();
  }

  function loadBest() {
    const bt = store('msq-best-time');
    const bm = store('msq-best-moves');
    if (bt && bestTimeEl) bestTimeEl.textContent = fmt(parseInt(bt, 10));
    if (bm && bestMovesEl) bestMovesEl.textContent = bm;
  }

  if (newBtn) newBtn.addEventListener('click', newGame);

  document.addEventListener('DOMContentLoaded', () => {
    loadBest();
    newGame();
  });
})();
