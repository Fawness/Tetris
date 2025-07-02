# Tetris - Ultra Lightweight Browser Game

A modern, feature-rich implementation of the classic Tetris game that runs entirely in the browser with no dependencies.

## 🎮 Features

### Core Gameplay
- **Classic Tetris mechanics** with all 7 standard pieces (I, O, T, S, Z, J, L)
- **Smooth piece movement** and rotation
- **Line clearing** with stunning visual effects and animations
- **Progressive difficulty** - speed increases as you level up
- **Next piece preview** to plan your moves
- **Visual line clear effects** with outlines, fading, and glow animations

### Difficulty Settings
- **Easy**: Slower initial speed (1.5s), gentle speed increase
- **Normal**: Balanced gameplay (1s), moderate speed increase
- **Hard**: Fast-paced (0.6s), aggressive speed increase
- **Expert**: Lightning fast (0.3s), very aggressive speed increase

### 🦌 Oh Deer God Mode
- **Optional chaos mode** with special "crazy blocks"
- **5 unique crazy block types** with unusual, cumbersome shapes
- **Animated deer emojis** that bounce on crazy blocks with golden glow
- **15% chance** of spawning crazy blocks when enabled
- **Brown color scheme** to distinguish from normal pieces

### 🐝 Bee Mode
- **Swarming micro bees** that fly around the game board
- **Automatic gap filling** - bees fill empty spaces with honey-colored blocks
- **Smart gap detection** - finds spaces with blocks above them
- **Honey blocks with bee emojis** - special golden blocks with animated bee emojis
- **Score bonus** - 5 points for each gap filled by bees
- **Visual effects** - glowing bees with buzzing animation and trails
- **Maximum 12 bees** with natural movement patterns
- **Honey texture** - wavy patterns and gradient colors on filled blocks

### 🦦 Ferret Mode
- **Special 1x7 ferret piece** that spawns randomly (8% chance)
- **Intelligent noodling behavior** - ferret automatically finds optimal positions
- **Multi-phase noodling** - ferret moves in stages to reach the best position
- **Gap detection and filling** - ferret specifically targets gaps below blocks
- **Bend configurations** - ferret can bend into L-shapes, T-shapes, and other forms
- **Animated ferret emojis** with wiggling effects and sparkles
- **Fur texture** - realistic ferret appearance with gradient colors
- **Strategic placement** - ferret bridges gaps and creates line clear opportunities
- **Rotation support** - ferret works in both horizontal and vertical orientations
- **Reachable position logic** - ferret can't teleport, only moves to accessible areas

### Controls
- **← →**: Move pieces left/right
- **↓**: Soft drop (move down faster)
- **↑**: Rotate piece
- **Space**: Hard drop (instant drop)
- **P**: Pause/Resume game

### Visual Design
- **Modern dark theme** with cyan accents
- **Responsive design** that works on desktop and mobile
- **Smooth animations** and visual effects
- **Clean, minimalist UI** with score tracking
- **Line clear animations** with outlines and fading effects
- **Special block rendering** for ferrets, honey blocks, and crazy blocks

## 🚀 Getting Started

1. **Download** or clone this repository
2. **Open** `index.html` in any modern web browser
3. **Select** your preferred difficulty and game mode(s)
4. **Click** "Start Game" and enjoy!

## 🎯 Game Modes

### Classic Mode
- Standard Tetris gameplay
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

### Mode Combinations
- **Mix and match** any combination of modes
- **Oh Deer God + Bee Mode**: Chaotic gameplay with helpful bees
- **Bee Mode + Ferret Mode**: Maximum gap-filling assistance
- **All modes**: Ultimate chaos with crazy blocks, bees, and ferrets

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
- **Responsive design** for all screen sizes
- **Local browser storage** - no server required
- **Advanced AI algorithms** for ferret noodling behavior
- **Pathfinding algorithms** for reachable position detection
- **Animation systems** for smooth visual effects

## 🎨 Customization

The game is built with modularity in mind:
- Easy to modify piece colors and shapes
- Adjustable difficulty settings
- Customizable crazy block types
- Flexible scoring system
- Bee behavior and spawning mechanics
- Ferret noodling algorithms and bend configurations
- Animation timing and visual effects

## 📱 Browser Compatibility

Works on all modern browsers:
- Chrome/Chromium
- Firefox
- Safari
- Edge

## 🎵 Future Enhancements

Potential features for future versions:
- Sound effects and background music
- Mobile touch controls
- High score persistence
- Multiplayer support
- Custom piece themes
- Additional special pieces and modes
- Advanced ferret behaviors and patterns

---

**Enjoy the game! 🎮**
