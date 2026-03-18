// 2048 Pro - S-Tier Edition
// Features: Animations, Mobile Support, Local Storage, Undo, Win Detection, Sound Effects

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const grid = document.getElementById('grid');
  const scoreDisplay = document.getElementById('score');
  const bestScoreDisplay = document.getElementById('best-score');
  const restartBtn = document.getElementById('restart');
  const undoBtn = document.getElementById('undo');
  const themeToggle = document.getElementById('theme-toggle');
  const soundToggle = document.getElementById('sound-toggle');
  
  // Game State
  let board = Array(4).fill().map(() => Array(4).fill(0));
  let score = 0;
  let bestScore = 0;
  let gameOver = false;
  let gameWon = false;
  let boardHistory = [];
  let scoreHistory = [];
  let soundEnabled = true;
  let currentTheme = 'light';
  
  // Touch support variables
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  // Initialize game
  function initGame() {
    board = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    gameOver = false;
    gameWon = false;
    boardHistory = [];
    scoreHistory = [];
    
    scoreDisplay.textContent = score;
    updateBestScore();
    
    addRandomTile();
    addRandomTile();
    renderBoard();
    
    // Remove win overlay if it exists
    const winOverlay = document.querySelector('.win-overlay');
    if (winOverlay) winOverlay.remove();
    
    saveGameState();
  }

  // Load game state from localStorage
  function loadGameState() {
    const savedState = localStorage.getItem('2048ProState');
    if (savedState) {
      const state = JSON.parse(savedState);
      board = state.board;
      score = state.score;
      bestScore = state.bestScore || 0;
      currentTheme = state.theme || 'light';
      soundEnabled = state.soundEnabled !== false;
      
      scoreDisplay.textContent = score;
      bestScoreDisplay.textContent = bestScore;
      
      if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      }
      
      if (!soundEnabled) {
        soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
      }
      
      renderBoard();
    } else {
      // First time playing
      bestScore = 0;
      bestScoreDisplay.textContent = bestScore;
    }
  }

  // Save game state to localStorage
  function saveGameState() {
    const state = {
      board: board,
      score: score,
      bestScore: bestScore,
      theme: currentTheme,
      soundEnabled: soundEnabled,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('2048ProState', JSON.stringify(state));
  }

  // Update best score
  function updateBestScore() {
    if (score > bestScore) {
      bestScore = score;
      bestScoreDisplay.textContent = bestScore;
      saveGameState();
    }
  }

  // Add random tile (2 or 4)
  function addRandomTile() {
    const emptyTiles = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) emptyTiles.push({i, j});
      }
    }
    
    if (emptyTiles.length > 0) {
      const {i, j} = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      board[i][j] = Math.random() < 0.9 ? 2 : 4;
      return {i, j, value: board[i][j]};
    }
    return null;
  }

  // Render the board with animations
  function renderBoard() {
    const tiles = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const tile = document.createElement('div');
        const value = board[i][j];
        tile.className = `tile ${value ? 'tile-' + value : ''}`;
        tile.textContent = value ? value : '';
        tile.dataset.row = i;
        tile.dataset.col = j;
        tile.dataset.value = value;
        tiles.push(tile);
      }
    }
    
    // Animate tile changes
    const currentTiles = grid.querySelectorAll('.tile');
    currentTiles.forEach((oldTile, index) => {
      const newTile = tiles[index];
      const oldValue = parseInt(oldTile.dataset.value) || 0;
      const newValue = parseInt(newTile.dataset.value) || 0;
      
      if (oldValue !== newValue) {
        if (newValue > 0) {
          if (oldValue === 0) {
            newTile.classList.add('tile-new');
          } else if (newValue > oldValue) {
            newTile.classList.add('tile-merged');
          }
        }
      }
    });
    
    // Replace all tiles
    grid.innerHTML = '';
    tiles.forEach(tile => grid.appendChild(tile));
    
    // Remove animation classes after animation completes
    setTimeout(() => {
      document.querySelectorAll('.tile-new, .tile-merged').forEach(tile => {
        tile.classList.remove('tile-new', 'tile-merged');
      });
    }, 200);
  }

  // Save board state for undo
  function saveBoardState() {
    boardHistory.push(JSON.parse(JSON.stringify(board)));
    scoreHistory.push(score);
    
    // Keep only the last 5 states to prevent memory issues
    if (boardHistory.length > 5) {
      boardHistory.shift();
      scoreHistory.shift();
    }
    
    undoBtn.disabled = false;
  }

  // Undo last move
  function undoMove() {
    if (boardHistory.length === 0 || gameOver) return;
    
    board = boardHistory.pop();
    score = scoreHistory.pop();
    scoreDisplay.textContent = score;
    gameOver = false;
    
    if (boardHistory.length === 0) {
      undoBtn.disabled = true;
    }
    
    renderBoard();
    saveGameState();
  }

  // Movement functions
  function moveLeft() {
    let moved = false;
    const newBoard = JSON.parse(JSON.stringify(board));
    let merged = Array(4).fill().map(() => Array(4).fill(false));
    
    for (let i = 0; i < 4; i++) {
      let row = newBoard[i].filter(val => val !== 0);
      
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1] && !merged[i][j]) {
          row[j] *= 2;
          row[j + 1] = 0;
          score += row[j];
          merged[i][j] = true;
          moved = true;
          if (soundEnabled) playSound('merge');
        }
      }
      
      row = row.filter(val => val !== 0);
      while (row.length < 4) row.push(0);
      
      if (JSON.stringify(row) !== JSON.stringify(newBoard[i])) moved = true;
      newBoard[i] = row;
    }
    
    return {newBoard, moved};
  }

  function moveRight() {
    let moved = false;
    const newBoard = JSON.parse(JSON.stringify(board));
    let merged = Array(4).fill().map(() => Array(4).fill(false));
    
    for (let i = 0; i < 4; i++) {
      let row = newBoard[i].filter(val => val !== 0).reverse();
      
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1] && !merged[i][3 - j]) {
          row[j] *= 2;
          row[j + 1] = 0;
          score += row[j];
          merged[i][3 - j] = true;
          moved = true;
          if (soundEnabled) playSound('merge');
        }
      }
      
      row = row.filter(val => val !== 0).reverse();
      while (row.length < 4) row.unshift(0);
      
      if (JSON.stringify(row) !== JSON.stringify(newBoard[i])) moved = true;
      newBoard[i] = row;
    }
    
    return {newBoard, moved};
  }

  function moveUp() {
    let moved = false;
    const newBoard = JSON.parse(JSON.stringify(board));
    let merged = Array(4).fill().map(() => Array(4).fill(false));
    
    for (let j = 0; j < 4; j++) {
      let col = [];
      for (let i = 0; i < 4; i++) {
        if (newBoard[i][j] !== 0) col.push(newBoard[i][j]);
      }
      
      for (let k = 0; k < col.length - 1; k++) {
        if (col[k] === col[k + 1] && !merged[k][j]) {
          col[k] *= 2;
          col[k + 1] = 0;
          score += col[k];
          merged[k][j] = true;
          moved = true;
          if (soundEnabled) playSound('merge');
        }
      }
      
      col = col.filter(val => val !== 0);
      while (col.length < 4) col.push(0);
      
      for (let i = 0; i < 4; i++) {
        if (newBoard[i][j] !== col[i]) moved = true;
        newBoard[i][j] = col[i];
      }
    }
    
    return {newBoard, moved};
  }

  function moveDown() {
    let moved = false;
    const newBoard = JSON.parse(JSON.stringify(board));
    let merged = Array(4).fill().map(() => Array(4).fill(false));
    
    for (let j = 0; j < 4; j++) {
      let col = [];
      for (let i = 3; i >= 0; i--) {
        if (newBoard[i][j] !== 0) col.push(newBoard[i][j]);
      }
      
      for (let k = 0; k < col.length - 1; k++) {
        if (col[k] === col[k + 1] && !merged[3 - k][j]) {
          col[k] *= 2;
          col[k + 1] = 0;
          score += col[k];
          merged[3 - k][j] = true;
          moved = true;
          if (soundEnabled) playSound('merge');
        }
      }
      
      col = col.filter(val => val !== 0);
      while (col.length < 4) col.unshift(0);
      
      for (let i = 3; i >= 0; i--) {
        if (newBoard[i][j] !== col[3 - i]) moved = true;
        newBoard[i][j] = col[3 - i];
      }
    }
    
    return {newBoard, moved};
  }

  // Handle move with animations and state management
  function handleMove(direction) {
    if (gameOver) return;
    
    saveBoardState();
    
    let result;
    switch (direction) {
      case 'left':
        result = moveLeft();
        break;
      case 'right':
        result = moveRight();
        break;
      case 'up':
        result = moveUp();
        break;
      case 'down':
        result = moveDown();
        break;
    }
    
    if (result.moved) {
      board = result.newBoard;
      const newTile = addRandomTile();
      scoreDisplay.textContent = score;
      updateBestScore();
      renderBoard();
      checkWinCondition();
      checkGameOver();
      saveGameState();
    } else {
      // No move happened, remove the saved state
      boardHistory.pop();
      scoreHistory.pop();
    }
  }

  // Check if player won
  function checkWinCondition() {
    if (gameWon) return;
    
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 2048) {
          gameWon = true;
          showWinOverlay();
          if (soundEnabled) playSound('win');
          return;
        }
      }
    }
  }

  // Show win overlay
  function showWinOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'win-overlay';
    overlay.innerHTML = `
      <div class="win-content">
        <h2>🎉 You Win! 🎉</h2>
        <p>You reached the 2048 tile!</p>
        <p>Your score: ${score}</p>
        <button id="continue-btn">Continue Playing</button>
      </div>
    `;
    document.body.appendChild(overlay);
    
    document.getElementById('continue-btn').addEventListener('click', () => {
      overlay.remove();
      gameWon = false;
    });
  }

  // Check if game is over
  function checkGameOver() {
    if (gameWon) return;
    
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return;
        if (j < 3 && board[i][j] === board[i][j + 1]) return;
        if (i < 3 && board[i][j] === board[i + 1][j]) return;
      }
    }
    
    gameOver = true;
    setTimeout(() => {
      if (soundEnabled) playSound('gameover');
      setTimeout(() => {
        alert(`Game Over! Your score: ${score}\nBest score: ${bestScore}`);
      }, 100);
    }, 100);
  }

  // Play sound with fallback handling
  function playSound(type) {
    let sound;
    switch (type) {
      case 'merge':
        sound = document.getElementById('merge-sound');
        break;
      case 'gameover':
        sound = document.getElementById('gameover-sound');
        break;
      case 'win':
        sound = document.getElementById('win-sound');
        break;
    }
    
    if (sound && soundEnabled) {
      sound.currentTime = 0;
      sound.play().catch(e => {
        console.log('Audio play failed:', e);
        // If audio fails, disable sound to prevent repeated errors
        if (e.name === 'NotAllowedError') {
          soundEnabled = false;
          soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
          alert('Sound playback was blocked. Please interact with the page first or check your browser settings.');
        }
      });
    }
  }

  // Check if sound files are available
  function checkSoundFiles() {
    const mergeSound = document.getElementById('merge-sound');
    const winSound = document.getElementById('win-sound');
    const gameoverSound = document.getElementById('gameover-sound');
    
    // If any sound file is missing or invalid, disable sound by default
    if (!mergeSound || mergeSound.duration === 0 ||
        !winSound || winSound.duration === 0 ||
        !gameoverSound || gameoverSound.duration === 0) {
      soundEnabled = false;
      soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
      console.log('Sound files not available. Sound disabled.');
    }
  }

  // Toggle theme
  function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-theme');
    
    if (currentTheme === 'dark') {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    saveGameState();
  }

  // Toggle sound
  function toggleSound() {
    soundEnabled = !soundEnabled;
    
    if (soundEnabled) {
      soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
      soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
    
    saveGameState();
  }

  // Touch event handlers for mobile
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }

  function handleTouchEnd(e) {
    if (gameOver) return;
    
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    // Minimum swipe distance
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 50) {
        handleMove('right');
      } else if (diffX < -50) {
        handleMove('left');
      }
    } else {
      if (diffY > 50) {
        handleMove('down');
      } else if (diffY < -50) {
        handleMove('up');
      }
    }
  }

  // Keyboard shortcuts
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') handleMove('left');
      if (e.key === 'ArrowRight') handleMove('right');
      if (e.key === 'ArrowUp') handleMove('up');
      if (e.key === 'ArrowDown') handleMove('down');
      
      // Undo with Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undoMove();
      }
    });
  }

  // Initialize everything
  function init() {
    loadGameState();
    setupKeyboardShortcuts();
    
    // Check sound files and initialize sound state
    checkSoundFiles();
    
    // Button event listeners
    restartBtn.addEventListener('click', initGame);
    undoBtn.addEventListener('click', undoMove);
    themeToggle.addEventListener('click', toggleTheme);
    soundToggle.addEventListener('click', toggleSound);
    
    // Touch events for mobile
    grid.addEventListener('touchstart', handleTouchStart, {passive: true});
    grid.addEventListener('touchend', handleTouchEnd, {passive: true});
    
    // If no game state was loaded, start a new game
    if (board.flat().every(cell => cell === 0)) {
      initGame();
    }
  }

  // Start the game
  init();
});