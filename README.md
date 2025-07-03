# 🐾 Wild Blocks - Ultra Lightweight Block-Stacking Game

A feature-rich, mobile-responsive block-stacking game with multiple game modes, built with pure JavaScript, HTML5 Canvas, and CSS3. Experience classic block-stacking gameplay enhanced with chaotic elements, helpful companions, and strategic challenges.

## ✨ Features

### 🎮 Core Gameplay
- **Classic block-stacking mechanics** with smooth piece movement and rotation
- **4 difficulty levels** from Easy to Expert with progressive speed increases
- **Score tracking** with points for line clears, hard drops, and special actions
- **Level progression** every 10 lines cleared
- **Line clear animations** with glowing outlines and fade effects
- **Next piece preview** to help with strategic planning

### 📱 Mobile Responsive Design
- **Automatic mobile detection** - switches to touch controls on mobile devices
- **Responsive canvas scaling** - game board adapts to screen size
- **Touch-friendly controls** with intuitive button layout:
  - ⬅️➡️ Move left/right
  - ⬇️ Soft drop
  - 🔄 Rotate piece
  - 💥 Hard drop
  - ⏸️ Pause game
- **Optimized for all screen sizes** - works on phones, tablets, and desktops
- **Touch-optimized interactions** with proper event handling
- **Responsive typography** and UI elements

### 🦌 Oh Deer God Mode
- **Chaotic gameplay** with randomly spawning crazy blocks
- **Deer-shaped pieces** that are larger and more complex than standard pieces
- **Animated deer emojis** that bounce around on special pieces
- **15% spawn chance** for crazy blocks to appear
- **Multiple deer block types** including L-shapes, T-shapes, and massive squares
- **Visual chaos** with glowing effects and bouncing animations

### 🐝 Bee Mode
- **Swarming bees** that automatically fill gaps in the board
- **Honey-colored blocks** with bee emojis appear where bees have filled spaces
- **Intelligent gap detection** - bees only fill small holes, not open areas
- **Reduced spawn frequency** for balanced gameplay
- **Strategic element** - can help or hinder depending on placement
- **Animated bee movement** with buzzing effects and trails

### 🦦 Ferret Mode
- **Special ferret pieces** that spawn randomly (8% chance)
- **Intelligent automatic placement** - ferret finds optimal positions
- **Multi-phase noodling** - ferret moves in stages to reach the best position
- **Gap detection and filling** - ferret specifically targets gaps below blocks
- **Bend configurations** - ferret can bend into L-shapes, T-shapes, and other forms
- **Animated ferret emojis** with wiggling effects and sparkles
- **Fur texture** - realistic ferret appearance with gradient colors
- **Strategic placement** - ferret bridges gaps and creates line clear opportunities
- **Rotation support** - ferret works in both horizontal and vertical orientations
- **Reachable position logic** - ferret can't teleport, only moves to accessible areas

### 🐱 Cat Mode
- **Lazy cat companion** that randomly appears and walks around the board
- **Realistic napping behavior** - cat naps on top of the highest block in each column
- **Prevents piece placement** - blocks can't be placed where cat is napping
- **Accurate clawing action** - cat scratches and removes the exact block it's targeting
- **Speech bubbles** - visual indicators for cat's actions ("zzz" for napping, "scratch" for clawing)
- **Random timing** - cat comes and goes unpredictably, adding challenge when enabled
- **Position tracking** - cat stays in place while napping or clawing

### 🎯 Controls

#### Desktop Controls
- **← →**: Move pieces left/right
- **↓**: Soft drop (move down faster)
- **↑**: Rotate piece
- **Space**: Hard drop (instant drop)
- **P**: Pause/Resume game

#### Mobile Touch Controls
- **⬅️➡️**: Move pieces left/right
- **⬇️**: Soft drop
- **🔄**: Rotate piece
- **💥**: Hard drop
- **⏸️**: Pause/Resume game

### 🎨 Visual Design
- **Modern dark theme** with cyan accents
- **Fully responsive design** that works on desktop and mobile
- **Smooth animations** and visual effects
- **Clean, minimalist UI** with score tracking
- **Line clear animations** with outlines and fading effects
- **Special block rendering** for ferrets, honey blocks, and crazy blocks
- **Responsive canvas scaling** for optimal viewing on all devices

## 🚀 Getting Started

1. **Download** or clone this repository
2. **Open** `index.html` in any modern web browser
3. **Select** your preferred difficulty and game mode(s)
4. **Click** "Start Game" and enjoy!

**Mobile users**: The game automatically detects mobile devices and switches to touch controls!

## 🎯 Game Modes

### Classic Mode
- Standard block-stacking gameplay
- Choose from 4 difficulty levels
- Perfect for beginners and veterans alike

### Oh Deer God Mode
- Adds chaotic elements to the game
- Crazy blocks appear randomly
- Deer emojis bounce around on special pieces
- Great for players who want an extra challenge

### Bee Mode
- Swarming bees automatically fill gaps in the board
- Honey-colored blocks with bee emojis appear where bees have filled spaces
- Helps players by filling problematic gaps
- Adds visual chaos with constant bee movement
- Strategic element - can help or hinder gameplay

### Ferret Mode
- Special ferret pieces that spawn randomly
- Intelligent automatic placement system
- Ferret noodles into optimal positions to fill gaps
- Multiple bend configurations for strategic placement
- Animated ferret emojis with realistic fur textures
- Works in both horizontal and vertical orientations

### Cat Mode
- Lazy cat that randomly appears and walks around the board
- Takes naps on top of placed blocks, preventing piece placement
- May claw and remove blocks from the board (accurately targets specific blocks)
- Visual speech bubbles show cat's current action
- Adds unpredictable challenge when enabled

### Mode Combinations
- **Mix and match** any combination of modes
- **Oh Deer God + Bee Mode**: Chaotic gameplay with helpful bees
- **Bee Mode + Ferret Mode**: Maximum gap-filling assistance
- **Cat Mode + Any Mode**: Adds unpredictable challenge with lazy cat behavior
- **All modes**: Ultimate chaos with crazy blocks, bees, ferrets, and cats

## 📊 Scoring System

- **Line clear**: 100 points × current level
- **Hard drop**: 2 points per cell dropped
- **Bee gap fill**: 5 points per gap filled
- **Ferret placement**: 50 points bonus
- **Level progression**: Every 10 lines cleared
- **Speed increase**: Based on selected difficulty

## 🛠️ Technical Details

- **Pure JavaScript** - no frameworks or libraries
- **HTML5 Canvas** for smooth rendering
- **CSS3** for modern styling and animations
- **Mobile-first responsive design**
- **Touch event handling** for mobile devices
- **Automatic device detection**
- **Responsive canvas scaling**
- **Cross-browser compatibility**

## 📱 Mobile Features

- **Automatic mobile detection** using user agent and screen size
- **Touch-optimized controls** with visual feedback
- **Responsive layout** that adapts to different screen sizes
- **Prevented zooming** and text selection for better gameplay
- **Optimized performance** for mobile devices
- **Landscape and portrait support**

## 🎮 Browser Compatibility

- **Chrome** (recommended)
- **Firefox**
- **Safari**
- **Edge**
- **Mobile browsers** (iOS Safari, Chrome Mobile, etc.)

## 🔧 Recent Updates

### Mobile Responsiveness
- Added automatic mobile detection
- Implemented touch controls with intuitive button layout
- Created responsive canvas scaling
- Optimized layout for all screen sizes
- Added touch event handling with proper feedback

### Cat Mode Improvements
- Fixed cat napping to occur on top of placed blocks
- Improved cat scratching accuracy to target specific blocks
- Added position tracking for better collision detection
- Enhanced visual behavior and movement patterns

### General Improvements
- Enhanced responsive design across all game modes
- Improved performance on mobile devices
- Better visual feedback for all interactions
- Optimized animations for smooth gameplay

## 🎯 Future Enhancements

- Additional game modes
- Sound effects and music
- High score tracking
- Custom themes
- Multiplayer support
- More special pieces and effects

---

**Enjoy playing Wild Blocks! 🐾**

*Built with ❤️ using vanilla JavaScript, HTML5, and CSS3*
