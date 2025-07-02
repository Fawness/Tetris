class Tetris {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.BOARD_WIDTH = 10;
        this.BOARD_HEIGHT = 20;
        this.BLOCK_SIZE = 30;
        
        this.board = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameOver = false;
        
        this.dropTime = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;
        
        // Difficulty settings
        this.difficultySettings = {
            easy: { initialSpeed: 1500, speedIncrease: 50 },
            normal: { initialSpeed: 1000, speedIncrease: 100 },
            hard: { initialSpeed: 600, speedIncrease: 150 },
            expert: { initialSpeed: 300, speedIncrease: 200 }
        };
        
        // Oh Deer God mode settings
        this.ohDeerMode = false;
        this.crazyBlockChance = 0.15; // 15% chance for crazy blocks
        this.deerAnimationFrame = 0;
        this.deerAnimationSpeed = 0.1;
        
        // Bee Mode settings
        this.beeMode = false;
        this.bees = [];
        this.beeSpawnChance = 0.02; // 2% chance per frame
        this.maxBees = 15;
        this.beeAnimationFrame = 0;
        this.beeAnimationSpeed = 0.15;
        
        this.init();
    }
    
    init() {
        this.createBoard();
        this.createPieces();
        this.setupEventListeners();
        this.draw();
    }
    
    createBoard() {
        this.board = [];
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            this.board[y] = [];
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                this.board[y][x] = 0;
            }
        }
    }
    
    createPieces() {
        this.pieces = {
            I: {
                shape: [
                    [1, 1, 1, 1]
                ],
                color: '#00f5ff'
            },
            O: {
                shape: [
                    [1, 1],
                    [1, 1]
                ],
                color: '#ffff00'
            },
            T: {
                shape: [
                    [0, 1, 0],
                    [1, 1, 1]
                ],
                color: '#a000f0'
            },
            S: {
                shape: [
                    [0, 1, 1],
                    [1, 1, 0]
                ],
                color: '#00f000'
            },
            Z: {
                shape: [
                    [1, 1, 0],
                    [0, 1, 1]
                ],
                color: '#f00000'
            },
            J: {
                shape: [
                    [1, 0, 0],
                    [1, 1, 1]
                ],
                color: '#0000f0'
            },
            L: {
                shape: [
                    [0, 0, 1],
                    [1, 1, 1]
                ],
                color: '#f0a000'
            }
        };
        
        // Crazy blocks for Oh Deer God mode
        this.crazyBlocks = {
            DEER_L: {
                shape: [
                    [1, 0, 0, 0],
                    [1, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 1]
                ],
                color: '#8B4513',
                isCrazy: true
            },
            DEER_T: {
                shape: [
                    [0, 1, 0, 0],
                    [1, 1, 1, 1],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0]
                ],
                color: '#654321',
                isCrazy: true
            },
            DEER_Z: {
                shape: [
                    [1, 1, 0, 0, 0],
                    [0, 1, 1, 1, 0],
                    [0, 0, 0, 1, 1]
                ],
                color: '#8B7355',
                isCrazy: true
            },
            DEER_SQUARE: {
                shape: [
                    [1, 1, 1],
                    [1, 1, 1],
                    [1, 1, 1]
                ],
                color: '#A0522D',
                isCrazy: true
            },
            DEER_LINE: {
                shape: [
                    [1, 1, 1, 1, 1, 1]
                ],
                color: '#CD853F',
                isCrazy: true
            }
        };
        
        this.pieceTypes = Object.keys(this.pieces);
        this.crazyBlockTypes = Object.keys(this.crazyBlocks);
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning || this.gamePaused || this.gameOver) return;
        
        switch(e.code) {
            case 'ArrowLeft':
                this.movePiece(-1, 0);
                break;
            case 'ArrowRight':
                this.movePiece(1, 0);
                break;
            case 'ArrowDown':
                this.movePiece(0, 1);
                break;
            case 'ArrowUp':
                this.rotatePiece();
                break;
            case 'Space':
                this.hardDrop();
                break;
            case 'KeyP':
                this.togglePause();
                break;
        }
        e.preventDefault();
    }
    
    startGame() {
        this.createBoard();
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameRunning = true;
        this.gamePaused = false;
        this.gameOver = false;
        
        // Get selected difficulty
        const difficulty = document.getElementById('difficultySelect').value;
        const settings = this.difficultySettings[difficulty];
        this.dropInterval = settings.initialSpeed;
        this.speedIncrease = settings.speedIncrease;
        
        // Check if Oh Deer God mode is enabled
        this.ohDeerMode = document.getElementById('ohDeerMode').checked;
        
        // Check if Bee Mode is enabled
        this.beeMode = document.getElementById('beeMode').checked;
        if (this.beeMode) {
            this.bees = [];
        }
        
        this.currentPiece = this.createNewPiece();
        this.nextPiece = this.createNewPiece();
        
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'block';
        document.getElementById('difficultySelect').disabled = true;
        document.getElementById('ohDeerMode').disabled = true;
        document.getElementById('beeMode').disabled = true;
        
        this.gameLoop();
    }
    
    togglePause() {
        if (!this.gameRunning || this.gameOver) return;
        
        this.gamePaused = !this.gamePaused;
        document.getElementById('pauseBtn').textContent = this.gamePaused ? 'Resume' : 'Pause';
    }
    
    createNewPiece() {
        let type, piece;
        
        // Check if Oh Deer God mode is enabled and if we should spawn a crazy block
        if (this.ohDeerMode && Math.random() < this.crazyBlockChance) {
            type = this.crazyBlockTypes[Math.floor(Math.random() * this.crazyBlockTypes.length)];
            piece = this.crazyBlocks[type];
        } else {
            type = this.pieceTypes[Math.floor(Math.random() * this.pieceTypes.length)];
            piece = this.pieces[type];
        }
        
        return {
            shape: piece.shape,
            color: piece.color,
            x: Math.floor(this.BOARD_WIDTH / 2) - Math.floor(piece.shape[0].length / 2),
            y: 0,
            isCrazy: piece.isCrazy || false
        };
    }
    
    movePiece(dx, dy) {
        const newX = this.currentPiece.x + dx;
        const newY = this.currentPiece.y + dy;
        
        if (this.isValidMove(this.currentPiece.shape, newX, newY)) {
            this.currentPiece.x = newX;
            this.currentPiece.y = newY;
            return true;
        }
        return false;
    }
    
    rotatePiece() {
        const rotated = this.rotateMatrix(this.currentPiece.shape);
        if (this.isValidMove(rotated, this.currentPiece.x, this.currentPiece.y)) {
            this.currentPiece.shape = rotated;
        }
    }
    
    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = [];
        
        for (let i = 0; i < cols; i++) {
            rotated[i] = [];
            for (let j = 0; j < rows; j++) {
                rotated[i][j] = matrix[rows - 1 - j][i];
            }
        }
        
        return rotated;
    }
    
    hardDrop() {
        while (this.movePiece(0, 1)) {
            this.score += 2;
        }
        this.placePiece();
    }
    
    isValidMove(shape, x, y) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = x + col;
                    const newY = y + row;
                    
                    if (newX < 0 || newX >= this.BOARD_WIDTH || 
                        newY >= this.BOARD_HEIGHT ||
                        (newY >= 0 && this.board[newY][newX])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    placePiece() {
        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    const x = this.currentPiece.x + col;
                    const y = this.currentPiece.y + row;
                    if (y >= 0) {
                        this.board[y][x] = this.currentPiece.color;
                    }
                }
            }
        }
        
        this.clearLines();
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createNewPiece();
        
        if (!this.isValidMove(this.currentPiece.shape, this.currentPiece.x, this.currentPiece.y)) {
            this.endGame();
        }
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.BOARD_HEIGHT - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(new Array(this.BOARD_WIDTH).fill(0));
                linesCleared++;
                y++; // Check the same line again
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += linesCleared * 100 * this.level;
            this.level = Math.floor(this.lines / 10) + 1;
            
            // Calculate new speed based on difficulty
            const baseSpeed = this.difficultySettings[document.getElementById('difficultySelect').value].initialSpeed;
            this.dropInterval = Math.max(50, baseSpeed - (this.level - 1) * this.speedIncrease);
            
            this.updateScore();
        }
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lines').textContent = this.lines;
        document.getElementById('level').textContent = this.level;
    }
    
    endGame() {
        this.gameRunning = false;
        this.gameOver = true;
        document.getElementById('startBtn').style.display = 'block';
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('pauseBtn').textContent = 'Pause';
        document.getElementById('difficultySelect').disabled = false;
        document.getElementById('ohDeerMode').disabled = false;
        document.getElementById('beeMode').disabled = false;
        
        this.showGameOver();
    }
    
    showGameOver() {
        const overlay = document.createElement('div');
        overlay.className = 'game-over';
        overlay.innerHTML = `
            <h2>Game Over!</h2>
            <p>Final Score: ${this.score}</p>
            <p>Lines: ${this.lines}</p>
            <p>Level: ${this.level}</p>
            <button onclick="this.parentElement.remove(); tetris.startGame()">Play Again</button>
        `;
        document.body.appendChild(overlay);
    }
    
    gameLoop(currentTime = 0) {
        if (!this.gameRunning || this.gamePaused || this.gameOver) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.dropTime += deltaTime;
        
        // Update deer animation
        if (this.ohDeerMode) {
            this.deerAnimationFrame += this.deerAnimationSpeed;
        }
        
        // Update bee animation and spawn bees
        if (this.beeMode) {
            this.beeAnimationFrame += this.beeAnimationSpeed;
            this.updateBees();
        }
        
        if (this.dropTime >= this.dropInterval) {
            if (!this.movePiece(0, 1)) {
                this.placePiece();
            }
            this.dropTime = 0;
        }
        
        this.draw();
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    updateBees() {
        // Spawn new bees
        if (this.bees.length < this.maxBees && Math.random() < this.beeSpawnChance) {
            this.spawnBee();
        }
        
        // Update existing bees
        for (let i = this.bees.length - 1; i >= 0; i--) {
            const bee = this.bees[i];
            bee.x += bee.vx;
            bee.y += bee.vy;
            
            // Add some random movement
            bee.vx += (Math.random() - 0.5) * 0.5;
            bee.vy += (Math.random() - 0.5) * 0.5;
            
            // Keep bees within bounds
            bee.vx = Math.max(-2, Math.min(2, bee.vx));
            bee.vy = Math.max(-2, Math.min(2, bee.vy));
            
            // Check if bee should fill a gap
            if (this.shouldBeeFillGap(bee)) {
                this.fillGapWithBee(bee);
                this.bees.splice(i, 1);
            }
            
            // Remove bees that are out of bounds or too old
            if (bee.x < -10 || bee.x > this.canvas.width + 10 || 
                bee.y < -10 || bee.y > this.canvas.height + 10 ||
                bee.age > 300) {
                this.bees.splice(i, 1);
            }
            
            bee.age++;
        }
    }
    
    spawnBee() {
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        let x, y, vx, vy;
        
        switch(side) {
            case 0: // top
                x = Math.random() * this.canvas.width;
                y = -10;
                vx = (Math.random() - 0.5) * 2;
                vy = Math.random() * 2 + 1;
                break;
            case 1: // right
                x = this.canvas.width + 10;
                y = Math.random() * this.canvas.height;
                vx = -Math.random() * 2 - 1;
                vy = (Math.random() - 0.5) * 2;
                break;
            case 2: // bottom
                x = Math.random() * this.canvas.width;
                y = this.canvas.height + 10;
                vx = (Math.random() - 0.5) * 2;
                vy = -Math.random() * 2 - 1;
                break;
            case 3: // left
                x = -10;
                y = Math.random() * this.canvas.height;
                vx = Math.random() * 2 + 1;
                vy = (Math.random() - 0.5) * 2;
                break;
        }
        
        this.bees.push({
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            age: 0
        });
    }
    
    shouldBeeFillGap(bee) {
        // Convert bee position to board coordinates
        const boardX = Math.floor(bee.x / this.BLOCK_SIZE);
        const boardY = Math.floor(bee.y / this.BLOCK_SIZE);
        
        // Check if bee is within board bounds
        if (boardX < 0 || boardX >= this.BOARD_WIDTH || 
            boardY < 0 || boardY >= this.BOARD_HEIGHT) {
            return false;
        }
        
        // Check if there's a gap (empty space with blocks above it)
        if (this.board[boardY][boardX] === 0) {
            // Check if there are blocks above this position
            for (let y = boardY - 1; y >= 0; y--) {
                if (this.board[y][boardX] !== 0) {
                    return true; // Found a gap to fill
                }
            }
        }
        
        return false;
    }
    
    fillGapWithBee(bee) {
        const boardX = Math.floor(bee.x / this.BLOCK_SIZE);
        const boardY = Math.floor(bee.y / this.BLOCK_SIZE);
        
        // Fill the gap with a bee-colored block
        this.board[boardY][boardX] = '#FFD700'; // Golden yellow for bees
        
        // Add some points for filling gaps
        this.score += 5;
        this.updateScore();
    }
    
    draw() {
        this.drawBoard();
        this.drawCurrentPiece();
        this.drawNextPiece();
        this.drawBees();
    }
    
    drawBoard() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.BOARD_WIDTH; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.BLOCK_SIZE, 0);
            this.ctx.lineTo(x * this.BLOCK_SIZE, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.BOARD_HEIGHT; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.BLOCK_SIZE);
            this.ctx.lineTo(this.canvas.width, y * this.BLOCK_SIZE);
            this.ctx.stroke();
        }
        
        // Draw placed pieces
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this.board[y][x]) {
                    this.drawBlock(x, y, this.board[y][x]);
                }
            }
        }
    }
    
    drawCurrentPiece() {
        if (!this.currentPiece) return;
        
        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    const x = this.currentPiece.x + col;
                    const y = this.currentPiece.y + row;
                    if (y >= 0) {
                        this.drawBlock(x, y, this.currentPiece.color);
                        
                        // Draw animated deer emoji on crazy blocks
                        if (this.currentPiece.isCrazy && this.ohDeerMode) {
                            this.drawDeerEmoji(x, y);
                        }
                    }
                }
            }
        }
    }
    
    drawNextPiece() {
        this.nextCtx.fillStyle = '#000';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (!this.nextPiece) return;
        
        const blockSize = 20;
        const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0].length * blockSize) / 2;
        const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * blockSize) / 2;
        
        for (let row = 0; row < this.nextPiece.shape.length; row++) {
            for (let col = 0; col < this.nextPiece.shape[row].length; col++) {
                if (this.nextPiece.shape[row][col]) {
                    const x = offsetX + col * blockSize;
                    const y = offsetY + row * blockSize;
                    
                    this.nextCtx.fillStyle = this.nextPiece.color;
                    this.nextCtx.fillRect(x, y, blockSize - 1, blockSize - 1);
                    
                    this.nextCtx.strokeStyle = '#fff';
                    this.nextCtx.lineWidth = 1;
                    this.nextCtx.strokeRect(x, y, blockSize - 1, blockSize - 1);
                }
            }
        }
    }
    
    drawBlock(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.BLOCK_SIZE + 1, y * this.BLOCK_SIZE + 1, 
                         this.BLOCK_SIZE - 2, this.BLOCK_SIZE - 2);
        
        // Add highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(x * this.BLOCK_SIZE + 1, y * this.BLOCK_SIZE + 1, 
                         this.BLOCK_SIZE - 2, 2);
        this.ctx.fillRect(x * this.BLOCK_SIZE + 1, y * this.BLOCK_SIZE + 1, 
                         2, this.BLOCK_SIZE - 2);
        
        // Add shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(x * this.BLOCK_SIZE + this.BLOCK_SIZE - 3, y * this.BLOCK_SIZE + 1, 
                         2, this.BLOCK_SIZE - 2);
        this.ctx.fillRect(x * this.BLOCK_SIZE + 1, y * this.BLOCK_SIZE + this.BLOCK_SIZE - 3, 
                         this.BLOCK_SIZE - 2, 2);
    }
    
    drawDeerEmoji(x, y) {
        const centerX = x * this.BLOCK_SIZE + this.BLOCK_SIZE / 2;
        const centerY = y * this.BLOCK_SIZE + this.BLOCK_SIZE / 2;
        
        // Animate deer position with a bouncing effect
        const bounceOffset = Math.sin(this.deerAnimationFrame) * 3;
        const deerY = centerY + bounceOffset;
        
        // Draw deer emoji
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🦌', centerX, deerY);
        
        // Add a subtle glow effect
        this.ctx.shadowColor = '#FFD700';
        this.ctx.shadowBlur = 5;
        this.ctx.fillText('🦌', centerX, deerY);
        this.ctx.shadowBlur = 0;
    }
    
    drawBees() {
        if (!this.beeMode) return;
        
        for (const bee of this.bees) {
            // Animate bee with buzzing effect
            const buzzOffset = Math.sin(this.beeAnimationFrame + bee.x * 0.1) * 2;
            const beeX = bee.x + buzzOffset;
            const beeY = bee.y;
            
            // Draw bee emoji
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            // Add glow effect
            this.ctx.shadowColor = '#FFD700';
            this.ctx.shadowBlur = 3;
            this.ctx.fillText('🐝', beeX, beeY);
            this.ctx.shadowBlur = 0;
            
            // Add a small trail effect
            this.ctx.globalAlpha = 0.3;
            this.ctx.fillText('🐝', beeX - bee.vx * 2, beeY - bee.vy * 2);
            this.ctx.globalAlpha = 1.0;
        }
    }
}

// Initialize the game when the page loads
let tetris;
document.addEventListener('DOMContentLoaded', () => {
    tetris = new Tetris();
}); 