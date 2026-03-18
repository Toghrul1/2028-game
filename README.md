# 2048 Pro - S-Tier Edition 🎮

A premium implementation of the classic 2048 game with advanced features that make it truly S-Tier!

## 🚀 Features

### **Core Gameplay**
- ✅ Classic 2048 mechanics with smooth animations
- ✅ Score tracking with local storage persistence
- ✅ Best score saved across sessions
- ✅ Win detection (2048 tile) with celebration
- ✅ Game over detection

### **S-Tier Enhancements**

#### 🎨 **Visual & UI**
- ✅ Beautiful responsive design (mobile, tablet, desktop)
- ✅ Dark/Light theme toggle
- ✅ Tile pop and merge animations
- ✅ Color-coded tiles (2-2048+)
- ✅ Professional UI with Font Awesome icons
- ✅ Win overlay with continue option

#### 🎮 **Gameplay Features**
- ✅ **Undo functionality** (Ctrl+Z or button)
- ✅ **Mobile touch support** (swipe gestures)
- ✅ **Sound effects** (merge, win, game over)
- ✅ **Local storage** (save game state)
- ✅ **Keyboard shortcuts** (arrow keys, Ctrl+Z)
- ✅ Continue playing after winning

#### 🔧 **Technical Excellence**
- ✅ Optimized performance (60fps)
- ✅ Clean, modular JavaScript
- ✅ Responsive CSS with media queries
- ✅ Accessible design
- ✅ Cross-browser compatibility
- ✅ Progressive enhancement

## 📁 Folder Structure

```
2048-game/
├── index.html          # Main game file
├── css/
│   └── style.css       # Premium styling
├── js/
│   └── game.js         # Advanced game logic
├── sounds/
│   ├── merge.mp3       # Tile merge sound
│   ├── win.mp3         # Win sound
│   └── gameover.mp3    # Game over sound
└── README.md           # This file
```

## 🕹️ How to Play

### **Controls**
- **Arrow Keys** (↑, ↓, ←, →) - Move tiles
- **Swipe Gestures** - Mobile touch support
- **Ctrl+Z** - Undo last move
- **Undo Button** - Undo last move
- **Restart Button** - Start new game
- **Theme Toggle** - Switch between light/dark mode
- **Sound Toggle** - Enable/disable sound effects

### **Game Rules**
1. Use arrow keys or swipe to move all tiles in a direction
2. Tiles with the same number merge into one (2+2=4, 4+4=8, etc.)
3. A new tile (2 or 4) appears after each move
4. Reach the 2048 tile to win!
5. Game ends when no more moves are possible
6. You can continue playing after reaching 2048

## 📱 Mobile Support

The game is fully responsive and works great on mobile devices:
- **Swipe up/down/left/right** to move tiles
- **Responsive grid** that adapts to screen size
- **Touch-friendly buttons**
- **Optimized tile sizes** for small screens

## 🎨 Themes

- **Light Theme** - Classic 2048 look
- **Dark Theme** - Easy on the eyes
- Toggle with the palette icon in the top right

## 🔊 Sound Effects

The game includes sound effect support with graceful fallback handling:

- **Merge Sound** - Plays when tiles combine
- **Win Sound** - Celebration when you reach 2048  
- **Game Over Sound** - Game over notification
- Toggle with the speaker icon in the top right

### Adding Custom Sound Files

To add your own sound files:

1. Replace the files in the `sounds/` directory:
   - `merge.mp3` - Tile merge sound
   - `win.mp3` - Win celebration sound
   - `gameover.mp3` - Game over sound

2. Use short sound files (< 1 second) in MP3 format
3. The game automatically detects missing sound files and disables sound gracefully
4. If browser audio is blocked, the game will notify you and disable sound

### Recommended Sound Sources

You can find free sound effects at:
- [Mixkit](https://mixkit.co/free-sound-effects/)
- [Zapsplat](https://www.zapsplat.com/)
- [Freesound](https://freesound.org/)

## 🛠️ Sound Troubleshooting

If sounds aren't working:
1. Check if sound is enabled (speaker icon should show volume up)
2. Interact with the page first (click anywhere) before sounds will play
3. Check browser settings to ensure audio isn't blocked
4. Replace the sound files in the `sounds/` directory

## 💾 Local Storage

The game automatically saves:
- Your current game state
- Best score
- Theme preference
- Sound settings
- Game continues where you left off

## 🚀 Performance

- **60 FPS animations** - Smooth tile movements
- **Optimized rendering** - Only updates changed tiles
- **Memory efficient** - Limits undo history to 5 moves
- **Fast load times** - Minimal assets

## 🎯 Future Enhancements

Possible additions for future versions:
- Leaderboard system
- Multiple grid sizes (5x5, 6x6)
- Custom tile skins
- Daily challenges
- Multiplayer mode
- Achievement system

## 📝 License

This is a free, open-source implementation of 2048. Feel free to modify and distribute!

## 🎮 Play Now!

Open `index.html` in your browser and enjoy the S-Tier 2048 experience!