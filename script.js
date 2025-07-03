class WildBlocks {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.BOARD_WIDTH = 10;
        this.BOARD_HEIGHT = 20;
        this.BLOCK_SIZE = 30; // Back to responsive sizing
        
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
        
        // Mobile detection and settings
        this.isMobile = this.detectMobile();
        this.mobileControls = document.getElementById('mobileControls');
        this.desktopControls = document.querySelector('.desktop-controls');
        
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
        this.beeSpawnChance = 0.015; // Reduced spawn chance
        this.maxBees = 12; // Reduced max bees
        this.beeAnimationFrame = 0;
        this.beeAnimationSpeed = 0.15;
        
        // Ferret Mode settings
        this.ferretMode = false;
        this.ferretSpawnChance = 0.08; // 8% chance for ferret piece
        this.ferretAnimationFrame = 0;
        this.ferretAnimationSpeed = 0.2;
        this.ferretNoodling = false;
        this.ferretNoodleSteps = 0;
        this.maxNoodleSteps = 120; // Much slower animation - 2 seconds at 60fps
        this.ferretNoodlePositions = []; // Store noodling animation positions
        this.ferretNoodleProgress = 0; // Animation progress
        this.ferretNoodlePhase = 0; // Current noodling phase
        this.maxNoodlePhases = 5; // Maximum number of noodling phases
        this.ferretNoodleDelay = 0; // Delay between phases
        
        // Cat Mode settings
        this.catMode = false;
        this.cat = null;
        this.catSpawnChance = 0.02; // 2% chance per frame for cat to appear
        this.catLeaveChance = 0.005; // 0.5% chance per frame for cat to leave
        this.catAnimationFrame = 0;
        this.catAnimationSpeed = 0.1;
        this.catActionTimer = 0;
        this.catActionInterval = 180; // 3 seconds between actions
        this.catClawChance = 0.3; // 30% chance to claw when taking action
        this.catNapChance = 0.7; // 70% chance to nap when taking action
        this.catNapDuration = 300; // 5 seconds nap duration
        this.catNapTimer = 0;
        this.catClawing = false;
        this.catClawTarget = null;
        this.catClawProgress = 0;
        this.catClawDuration = 60; // 1 second claw animation
        
        // Line clear animation
        this.lineClearAnimation = {
            active: false,
            lines: [],
            progress: 0,
            duration: 30, // 0.5 seconds at 60fps
            outlineAlpha: 1,
            fadeAlpha: 1
        };
        
        this.init();
    }
    
    init() {
        this.createBoard();
        this.createPieces();
        this.setupEventListeners();
        
        // Set canvas size for desktop
        if (!this.isMobile) {
            this.updateDesktopCanvasSize();
        }
        
        // Ensure mobile controls are hidden on initialization
        if (this.isMobile && this.mobileControls) {
            this.mobileControls.classList.remove('game-running');
        }
        
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
        
        // Ferret piece for Ferret Mode
        this.ferretPiece = {
            shape: [[1, 1, 1, 1, 1, 1, 1]], // 1x7 piece
            color: '#8B4513', // Brown color for ferret
            isFerret: true
        };
        

    }
    
    detectMobile() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768 && window.innerHeight <= 1024);
        console.log(`Mobile detection: ${isMobile}, window size: ${window.innerWidth}x${window.innerHeight}`);
        return isMobile;
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        
        // Mobile touch controls
        if (this.isMobile) {
            this.setupMobileControls();
        }
        
        // Handle window resize for responsive canvas
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('orientationchange', () => {
            // Wait for orientation change to complete
            setTimeout(() => this.handleResize(), 100);
        });
        this.handleResize();
    }
    
    setupMobileControls() {
        // Hide desktop controls on mobile
        if (this.desktopControls) {
            this.desktopControls.style.display = 'none';
        }
        
        // Ensure mobile controls are hidden by default
        if (this.mobileControls) {
            this.mobileControls.classList.remove('game-running');
        }
        
        // Prevent touch zoom and other unwanted behaviors
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault(); // Prevent pinch zoom
            }
        }, { passive: false });
        
        // Only prevent double-tap zoom on the canvas, not everywhere
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault(); // Prevent double-tap zoom on canvas only
        }, { passive: false });
        
        // Touch event listeners
        document.getElementById('leftBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTouchMove(-1, 0);
        });
        
        document.getElementById('rightBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTouchMove(1, 0);
        });
        
        document.getElementById('downBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTouchMove(0, 1);
        });
        
        document.getElementById('rotateBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTouchRotate();
        });
        
        document.getElementById('hardDropBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTouchHardDrop();
        });
        
        document.getElementById('pauseBtnMobile').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.togglePause();
        });
        
        // Mouse events for desktop testing
        document.getElementById('leftBtn').addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.handleTouchMove(-1, 0);
        });
        
        document.getElementById('rightBtn').addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.handleTouchMove(1, 0);
        });
        
        document.getElementById('downBtn').addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.handleTouchMove(0, 1);
        });
        
        document.getElementById('rotateBtn').addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.handleTouchRotate();
        });
        
        document.getElementById('hardDropBtn').addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.handleTouchHardDrop();
        });
        
        document.getElementById('pauseBtnMobile').addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.togglePause();
        });
    }
    
    handleTouchMove(dx, dy) {
        if (!this.gameRunning || this.gamePaused || this.gameOver) return;
        this.movePiece(dx, dy);
    }
    
    handleTouchRotate() {
        if (!this.gameRunning || this.gamePaused || this.gameOver) return;
        this.rotatePiece();
    }
    
    handleTouchHardDrop() {
        if (!this.gameRunning || this.gamePaused || this.gameOver) return;
        this.hardDrop();
    }
    
    handleResize() {
        // Adjust canvas size for mobile
        if (this.isMobile) {
            this.updateMobileCanvasSize();
        } else {
            // Responsive desktop canvas sizing
            this.updateDesktopCanvasSize();
        }
    }
    
    updateDesktopCanvasSize() {
        // Calculate available space for the canvas
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Reserve space for side panel and margins
        const sidePanelWidth = 280; // Side panel width + gap
        const headerHeight = 120; // Header + margins
        const padding = 80; // Overall padding
        
        const maxWidth = viewportWidth - sidePanelWidth - padding;
        const maxHeight = viewportHeight - headerHeight - padding;
        
        // Calculate block size based on available space
        const blockSizeByWidth = Math.floor(maxWidth / this.BOARD_WIDTH);
        const blockSizeByHeight = Math.floor(maxHeight / this.BOARD_HEIGHT);
        
        // Use the smaller of the two to ensure the board fits
        let blockSize = Math.min(blockSizeByWidth, blockSizeByHeight);
        
        // Ensure minimum and maximum block sizes
        const minBlockSize = 25;
        const maxBlockSize = 40;
        blockSize = Math.max(minBlockSize, Math.min(maxBlockSize, blockSize));
        
        // Calculate final canvas dimensions - EXACTLY match the game grid
        const newWidth = blockSize * this.BOARD_WIDTH;
        const newHeight = blockSize * this.BOARD_HEIGHT;
        
        // Set canvas size - both internal and display size must match
        this.canvas.width = newWidth;
        this.canvas.height = newHeight;
        this.canvas.style.width = newWidth + 'px';
        this.canvas.style.height = newHeight + 'px';
        
        // Update block size for drawing calculations
        this.BLOCK_SIZE = blockSize;
        
        console.log(`Desktop canvas: ${newWidth}x${newHeight}, block size: ${blockSize}, board: ${this.BOARD_WIDTH}x${this.BOARD_HEIGHT}`);
    }
    
    updateMobileCanvasSize() {
        // Get the actual viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Calculate available space for the canvas
        // Account for mobile controls overlay at the bottom
        const padding = 20; // Reduced padding
        const uiHeight = 100; // Reduced UI height
        const mobileControlsHeight = 120; // Height of mobile controls overlay
        const maxWidth = viewportWidth - padding;
        const maxHeight = viewportHeight - uiHeight - mobileControlsHeight;
        
        // Calculate block size based on available space
        // Calculate block size based on width and height
        let blockSizeByWidth = Math.floor(maxWidth / this.BOARD_WIDTH);
        let blockSizeByHeight = Math.floor(maxHeight / this.BOARD_HEIGHT);
        
        // Use the smaller of the two to ensure the board fits
        let blockSize = Math.min(blockSizeByWidth, blockSizeByHeight);
        
        // Ensure minimum block size for visibility
        const minBlockSize = 18; // Increased minimum block size
        if (blockSize < minBlockSize) {
            blockSize = minBlockSize;
        }
        
        // For very small screens, try to use more space
        if (viewportWidth < 400) {
            // Use 90% of available width
            const aggressiveWidth = Math.floor(viewportWidth * 0.9);
            const aggressiveBlockSize = Math.floor(aggressiveWidth / this.BOARD_WIDTH);
            if (aggressiveBlockSize >= minBlockSize) {
                blockSize = aggressiveBlockSize;
            }
        }
        
        // Calculate final canvas dimensions
        const newWidth = blockSize * this.BOARD_WIDTH;
        const newHeight = blockSize * this.BOARD_HEIGHT;
        
        // Set canvas size
        this.canvas.style.width = newWidth + 'px';
        this.canvas.style.height = newHeight + 'px';
        
        // Update block size for drawing calculations
        this.BLOCK_SIZE = blockSize;
        
        console.log(`Mobile canvas: ${newWidth}x${newHeight}, block size: ${blockSize}, viewport: ${viewportWidth}x${viewportHeight}`);
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
        
        // Show mobile controls when game starts
        if (this.isMobile) {
            document.body.classList.add('game-running');
            this.updateMobileCanvasSize();
        }
        
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
        
        // Check if Ferret Mode is enabled
        this.ferretMode = document.getElementById('ferretMode').checked;
        
        // Check if Cat Mode is enabled
        this.catMode = document.getElementById('catMode').checked;
        if (this.catMode) {
            this.cat = null;
        }
        
        this.currentPiece = this.createNewPiece();
        this.nextPiece = this.createNewPiece();
        
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'block';
        document.getElementById('difficultySelect').disabled = true;
        document.getElementById('ohDeerMode').disabled = true;
        document.getElementById('beeMode').disabled = true;
        document.getElementById('ferretMode').disabled = true;
        document.getElementById('catMode').disabled = true;
        
        // Show mobile controls if on mobile device
        if (this.isMobile && this.mobileControls) {
            this.mobileControls.classList.add('game-running');
        }
        
        this.gameLoop();
    }
    
    togglePause() {
        if (!this.gameRunning || this.gameOver) return;
        
        this.gamePaused = !this.gamePaused;
        document.getElementById('pauseBtn').textContent = this.gamePaused ? 'Resume' : 'Pause';
        
        // Handle mobile controls based on pause state
        if (this.isMobile) {
            if (this.gamePaused) {
                // Hide mobile controls when paused
                document.body.classList.remove('game-running');
                if (this.mobileControls) {
                    this.mobileControls.classList.remove('game-running');
                }
            } else {
                // Show mobile controls when resuming
                document.body.classList.add('game-running');
                if (this.mobileControls) {
                    this.mobileControls.classList.add('game-running');
                }
            }
        }
    }
    
    createNewPiece() {
        let type, piece;
        
        // Check if Ferret Mode is enabled and if we should spawn a ferret piece
        if (this.ferretMode && Math.random() < this.ferretSpawnChance) {
            piece = this.ferretPiece;
        }
        // Check if Oh Deer God mode is enabled and if we should spawn a crazy block
        else if (this.ohDeerMode && Math.random() < this.crazyBlockChance) {
            type = this.crazyBlockTypes[Math.floor(Math.random() * this.crazyBlockTypes.length)];
            piece = this.crazyBlocks[type];
        } else {
            type = this.pieceTypes[Math.floor(Math.random() * this.pieceTypes.length)];
            piece = this.pieces[type];
        }
        
        // Calculate initial position, ensuring ferret pieces start in valid positions
        let initialX = Math.floor(this.BOARD_WIDTH / 2) - Math.floor(piece.shape[0].length / 2);
        
        // For ferret pieces, ensure they start within bounds and check if position is valid
        if (piece.isFerret) {
            initialX = Math.max(0, Math.min(this.BOARD_WIDTH - piece.shape[0].length, initialX));
            
            // Check if the ferret can actually spawn at this position
            if (!this.isValidMove(piece.shape, initialX, 0)) {
                // Try to find a valid spawn position
                let validSpawnFound = false;
                for (let tryX = 0; tryX <= this.BOARD_WIDTH - piece.shape[0].length; tryX++) {
                    if (this.isValidMove(piece.shape, tryX, 0)) {
                        initialX = tryX;
                        validSpawnFound = true;
                        break;
                    }
                }
                
                // If no valid spawn position found, don't spawn a ferret
                if (!validSpawnFound) {
                    // Fallback to normal piece
                    type = this.pieceTypes[Math.floor(Math.random() * this.pieceTypes.length)];
                    piece = this.pieces[type];
                    initialX = Math.floor(this.BOARD_WIDTH / 2) - Math.floor(piece.shape[0].length / 2);
                }
            }
        }
        
        return {
            shape: piece.shape,
            color: piece.color,
            x: initialX,
            y: 0,
            isCrazy: piece.isCrazy || false,
            isFerret: piece.isFerret || false
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
        // For ferret pieces, use special hard drop logic
        if (this.currentPiece.isFerret) {
            this.hardDropFerret();
        } else {
            while (this.movePiece(0, 1)) {
                this.score += 2;
            }
            this.placePiece();
        }
    }
    
    hardDropFerret() {
        // Find the lowest valid position for the ferret
        let lowestY = this.BOARD_HEIGHT - 1;
        while (lowestY >= 0 && !this.isValidMove(this.currentPiece.shape, this.currentPiece.x, lowestY)) {
            lowestY--;
        }
        
        // If we found a valid position, place the ferret there
        if (lowestY >= 0) {
            this.currentPiece.y = lowestY;
            this.placePiece();
        } else {
            // If no valid position found, end the game
            this.endGame();
        }
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
                    
                    // Check if cat is napping on this position
                    if (this.catMode && this.cat && this.cat.napping && this.cat.napBoardX !== undefined && this.cat.napBoardY !== undefined) {
                        // Check if the piece would occupy the space where the cat is napping
                        if (newX === this.cat.napBoardX && newY === this.cat.napBoardY) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }
    
    placePiece() {
        // Special handling for ferret pieces
        if (this.currentPiece.isFerret) {
            this.placeFerretPiece();
        } else {
            // Normal piece placement
            this.placeNormalPiece();
        }
        
        this.clearLines();
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createNewPiece();
        
        if (!this.isValidMove(this.currentPiece.shape, this.currentPiece.x, this.currentPiece.y)) {
            this.endGame();
        }
    }
    
    placeFerretPiece() {
        // Always place the ferret normally first
        this.placeNormalPiece();
        
        // Reset noodling state
        this.ferretNoodling = false;
        this.ferretNoodleSteps = 0;
        this.ferretNoodleProgress = 0;
        this.ferretNoodlePhase = 0;
        this.ferretNoodleDelay = 0;
        this.ferretNoodlePositions = [];
        
        // Start the noodling process
        this.startFerretNoodling();
        
        // Add bonus points for ferret placement
        this.score += 50;
        this.updateScore();
    }
    
    startFerretNoodling() {
        this.ferretNoodling = true;
        this.ferretNoodleSteps = 0;
        this.ferretNoodleProgress = 0;
        this.ferretNoodlePhase = 0;
        this.ferretNoodleDelay = 0;
        this.ferretNoodlePositions = [];
        
        // Start the first noodling phase
        this.startNextNoodlePhase();
    }
    
    startNextNoodlePhase() {
        // Find the best position for this phase
        const bestPosition = this.findBestFerretNoodlePosition();
        if (bestPosition) {
            // Generate intermediate positions for smooth animation
            this.generateNoodleAnimationPath(bestPosition);
            
            // If we have valid positions, start the phase
            if (this.ferretNoodlePositions.length > 0) {
                this.ferretNoodleSteps = 0;
                this.ferretNoodleProgress = 0;
            } else {
                // No valid positions found, stop noodling
                this.ferretNoodling = false;
            }
        } else {
            // No better position found, stop noodling
            this.ferretNoodling = false;
        }
    }
    
    updateFerretNoodling() {
        if (!this.ferretNoodling) {
            return;
        }
        
        // Handle delay between phases
        if (this.ferretNoodleDelay > 0) {
            this.ferretNoodleDelay--;
            return;
        }
        
        // Check if current phase is complete
        if (this.ferretNoodleSteps >= this.maxNoodleSteps) {
            // Complete the current phase
            this.completeNoodlePhase();
            return;
        }
        
        // Update animation progress
        this.ferretNoodleProgress = this.ferretNoodleSteps / this.maxNoodleSteps;
        
        // Perform animated noodling - only update every few frames for slower movement
        if (this.ferretNoodlePositions.length > 0 && this.ferretNoodleSteps % 2 === 0) {
            this.performAnimatedFerretNoodle();
        }
        
        this.ferretNoodleSteps++;
    }
    
    completeNoodlePhase() {
        // Place ferret at final position of current phase
        if (this.ferretNoodlePositions.length > 0) {
            const finalPosition = this.ferretNoodlePositions[this.ferretNoodlePositions.length - 1];
            this.removeActiveFerretFromBoard();
            // Use the bend shape directly instead of bend index
            const bendShape = finalPosition.bendShape || this.ferretPiece.shape;
            this.placeFerretAtPosition(finalPosition.x, finalPosition.y, bendShape);
        }
        
        this.ferretNoodlePhase++;
        
        // Check if we should continue noodling
        if (this.ferretNoodlePhase < this.maxNoodlePhases) {
            // Add a small delay before next phase
            this.ferretNoodleDelay = 30; // 0.5 second delay at 60fps
            
            // Start next phase
            setTimeout(() => {
                if (this.ferretNoodling) {
                    this.startNextNoodlePhase();
                }
            }, 500);
        } else {
            // Maximum phases reached, stop noodling
            this.ferretNoodling = false;
        }
    }
    
    generateNoodleAnimationPath(finalPosition) {
        // Get current ferret position and shape
        let currentX = 0, currentY = 0;
        let currentShape = this.ferretPiece.shape;
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this.board[y][x] === this.ferretPiece.color) {
                    currentX = x;
                    currentY = y;
                    currentShape = this.detectCurrentFerretShape(x, y);
                    break;
                }
            }
        }
        
        // Validate final position - ensure it's not at the top and is below current position
        const bendShape = finalPosition.shape || currentShape;
        if (finalPosition.y <= 0 || finalPosition.y < currentY || !this.canPlaceFerretBendAt(finalPosition.x, finalPosition.y, bendShape)) {
            // If final position is invalid or would move upward, don't noodle
            this.ferretNoodlePositions = [];
            return;
        }
        
        // Generate intermediate positions with bending effect - more steps for slower animation
        const steps = 40; // More steps for smoother, slower animation
        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const easeProgress = this.easeInOutQuad(progress);
            
            // Create bending effect by adding some curve to the movement
            const bendOffset = Math.sin(progress * Math.PI) * 3;
            
            const intermediateX = currentX + (finalPosition.x - currentX) * easeProgress;
            const intermediateY = currentY + (finalPosition.y - currentY) * easeProgress + bendOffset;
            
            // Validate intermediate position - ensure it never goes above current position
            const roundedX = Math.round(intermediateX);
            const roundedY = Math.round(intermediateY);
            
            // Only add valid positions that are at or below current Y
            if (roundedY >= currentY && this.canPlaceFerretBendAt(roundedX, roundedY, bendShape)) {
                this.ferretNoodlePositions.push({
                    x: roundedX,
                    y: roundedY,
                    progress: progress,
                    bendShape: bendShape
                });
            }
        }
    }
    
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    performAnimatedFerretNoodle() {
        if (this.ferretNoodlePositions.length === 0) return;
        
        // Get current animation frame
        const frameIndex = Math.floor(this.ferretNoodleProgress * (this.ferretNoodlePositions.length - 1));
        const position = this.ferretNoodlePositions[frameIndex];
        
        if (position && position.y > 0) { // Extra safety check
            // Remove ferret from current position
            this.removeActiveFerretFromBoard();
            
            // Place ferret at intermediate position with bend shape
            const bendShape = position.bendShape || this.ferretPiece.shape;
            this.placeFerretAtPosition(position.x, position.y, bendShape);
        }
    }
    

    
    removeActiveFerretFromBoard() {
        // Only remove the active ferret (the one that's currently noodling)
        // This is a more targeted approach that preserves settled ferrets
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this.board[y][x] === this.ferretPiece.color) {
                    this.board[y][x] = 0;
                    // Only remove the first ferret we find (the active one)
                    return;
                }
            }
        }
    }
    
    placeFerretAtPosition(x, y, bendShape = null) {
        // Place the ferret at the specified position with optional bend shape
        const shapeToUse = bendShape || this.ferretPiece.shape;
        
        for (let row = 0; row < shapeToUse.length; row++) {
            for (let col = 0; col < shapeToUse[row].length; col++) {
                if (shapeToUse[row][col]) {
                    const boardX = x + col;
                    const boardY = y + row;
                    if (boardX >= 0 && boardX < this.BOARD_WIDTH && boardY >= 0 && boardY < this.BOARD_HEIGHT) {
                        this.board[boardY][boardX] = this.ferretPiece.color;
                    }
                }
            }
        }
    }
    
    // Helper: Detect the current shape of the ferret on the board
    detectCurrentFerretShape(startX, startY) {
        // Check if it's horizontal (1x7)
        let horizontalCount = 0;
        for (let x = startX; x < this.BOARD_WIDTH && this.board[startY][x] === this.ferretPiece.color; x++) {
            horizontalCount++;
        }
        
        // Check if it's vertical (7x1)
        let verticalCount = 0;
        for (let y = startY; y < this.BOARD_HEIGHT && this.board[y][startX] === this.ferretPiece.color; y++) {
            verticalCount++;
        }
        
        // Return the appropriate shape
        if (horizontalCount >= 7) {
            return this.ferretPiece.shape; // 1x7 horizontal
        } else if (verticalCount >= 7) {
            // Return rotated shape (7x1 vertical)
            return this.rotateMatrix(this.ferretPiece.shape);
        } else {
            // Fallback to original shape
            return this.ferretPiece.shape;
        }
    }
    
    // Helper: Get all reachable positions for the active ferret using BFS
    getReachableFerretPositions(startX, startY, shape) {
        const visited = new Set();
        const queue = [];
        const positions = [];
        const key = (x, y) => `${x},${y}`;
        queue.push({ x: startX, y: startY });
        visited.add(key(startX, startY));
        
        while (queue.length > 0) {
            const { x, y } = queue.shift();
            if (this.canPlaceFerretBendAt(x, y, shape)) {
                positions.push({ x, y });
                // Try moving down, left, right (no up)
                const moves = [
                    { dx: 0, dy: 1 },
                    { dx: -1, dy: 0 },
                    { dx: 1, dy: 0 }
                ];
                for (const move of moves) {
                    const nx = x + move.dx;
                    const ny = y + move.dy;
                    const k = key(nx, ny);
                    if (!visited.has(k) && this.canPlaceFerretBendAt(nx, ny, shape)) {
                        visited.add(k);
                        queue.push({ x: nx, y: ny });
                    }
                }
            }
        }
        return positions;
    }

    findBestFerretNoodlePosition() {
        let bestScore = -1;
        let bestPosition = null;
        let bestBend = 0; // Index of the best bend configuration
        
        // Get current ferret position and shape
        let currentX = 0, currentY = 0;
        let currentShape = this.ferretPiece.shape; // Default to original shape
        
        outer: for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this.board[y][x] === this.ferretPiece.color) {
                    currentX = x;
                    currentY = y;
                    // Try to determine the current shape by checking the pattern
                    currentShape = this.detectCurrentFerretShape(x, y);
                    break outer;
                }
            }
        }
        
        // Try different bend configurations that all have exactly 7 blocks
        const bendConfigs = [
            currentShape, // Use detected current shape instead of always 1x7
            this.createBendShape(2, 4), // 2x4 with 7 blocks (L-shape)
            this.createBendShape(3, 3), // 3x3 with 7 blocks (T-shape)
            this.createBendShape(2, 5), // 2x5 with 7 blocks (long L-shape)
            this.createBendShape(4, 2), // 4x2 with 7 blocks (tall L-shape)
        ];
        
        // For the first phase, be more permissive - try all positions, not just reachable ones
        if (this.ferretNoodlePhase === 0) {
            // Try all possible positions for each bend configuration
            for (let bendIndex = 0; bendIndex < bendConfigs.length; bendIndex++) {
                const bendShape = bendConfigs[bendIndex];
                const maxX = this.BOARD_WIDTH - bendShape[0].length;
                
                for (let x = 0; x <= maxX; x++) {
                    for (let y = currentY; y < this.BOARD_HEIGHT; y++) {
                        if (this.canPlaceFerretBendAt(x, y, bendShape)) {
                            const score = this.calculateBendScore(x, y, bendShape);
                            if (score > bestScore) {
                                bestScore = score;
                                bestPosition = { x, y };
                                bestBend = bendIndex;
                            }
                        }
                    }
                }
            }
        } else {
            // For subsequent phases, use reachable positions only
            for (let bendIndex = 0; bendIndex < bendConfigs.length; bendIndex++) {
                const bendShape = bendConfigs[bendIndex];
                const reachable = this.getReachableFerretPositions(currentX, currentY, bendShape);
                for (const pos of reachable) {
                    const { x, y } = pos;
                    const score = this.calculateBendScore(x, y, bendShape);
                    if (score > bestScore) {
                        bestScore = score;
                        bestPosition = { x, y };
                        bestBend = bendIndex;
                    }
                }
            }
        }
        
        // If no good position found, don't noodle
        if (bestScore <= 0) {
            return null;
        }
        
        // For multi-phase noodling, only move if the improvement is significant
        // This prevents endless tiny movements, but be more lenient in later game states
        const minScoreThreshold = this.ferretNoodlePhase > 0 ? 30 : 0; // Lower threshold
        if (this.ferretNoodlePhase > 0 && bestScore < minScoreThreshold) {
            return null; // Not enough improvement to continue
        }
        
        return { ...bestPosition, shape: bendConfigs[bestBend] };
    }
    

    
    canPlaceFerretBendAt(x, y, bendShape) {
        // Check if we can place the ferret bend at this position
        for (let row = 0; row < bendShape.length; row++) {
            for (let col = 0; col < bendShape[row].length; col++) {
                if (bendShape[row][col]) {
                    const boardX = x + col;
                    const boardY = y + row;
                    
                    if (boardX < 0 || boardX >= this.BOARD_WIDTH || 
                        boardY < 0 || boardY >= this.BOARD_HEIGHT) {
                        return false;
                    }
                    
                    // Can't place on top of existing blocks (except other ferret blocks)
                    if (this.board[boardY][boardX] !== 0 && this.board[boardY][boardX] !== this.ferretPiece.color) {
                        return false;
                    }
                }
            }
        }
        
        return true;
    }
    

    
    calculateBendScore(x, y, bendShape) {
        let score = 0;
        
        // Get current ferret position to ensure we only score downward movement
        let currentY = 0;
        for (let y2 = 0; y2 < this.BOARD_HEIGHT; y2++) {
            for (let x2 = 0; x2 < this.BOARD_WIDTH; x2++) {
                if (this.board[y2][x2] === this.ferretPiece.color) {
                    currentY = y2;
                    break;
                }
            }
        }
        
        // Only score positions that are at or below current position
        if (y < currentY) {
            return -1; // Penalize upward movement
        }
        
        let filledSpaces = 0;
        let gapFills = 0;
        let lineClearPotential = 0;
        let blocksBelow = 0;
        
        // Check each position the bent ferret would occupy
        for (let row = 0; row < bendShape.length; row++) {
            for (let col = 0; col < bendShape[row].length; col++) {
                if (bendShape[row][col]) {
                    const boardX = x + col;
                    const boardY = y + row;
                    
                    if (boardX >= 0 && boardX < this.BOARD_WIDTH && boardY >= 0 && boardY < this.BOARD_HEIGHT) {
                        // Bonus for filling empty spaces
                        if (this.board[boardY][boardX] === 0) {
                            filledSpaces++;
                            score += 30; // Higher bonus for bent ferret filling spaces
                            
                            // Extra bonus for filling gaps (spaces with blocks above)
                            let hasBlocksAbove = false;
                            let gapHeight = 0;
                            for (let aboveY = boardY - 1; aboveY >= 0; aboveY--) {
                                if (this.board[aboveY][boardX] !== 0 && this.board[aboveY][boardX] !== this.ferretPiece.color) {
                                    hasBlocksAbove = true;
                                    break;
                                }
                                gapHeight++;
                            }
                            if (hasBlocksAbove) {
                                gapFills++;
                                score += 60 + (gapHeight * 8); // Extra points for filling gaps, more for deeper gaps
                            }
                            
                            // Check if there are blocks below this position (creating a bridge)
                            if (boardY < this.BOARD_HEIGHT - 1 && this.board[boardY + 1][boardX] !== 0 && this.board[boardY + 1][boardX] !== this.ferretPiece.color) {
                                blocksBelow++;
                                score += 25; // Bonus for bridging gaps
                            }
                        }
                        
                        // Bonus for being near other blocks (creating potential line clears)
                        if (boardY > 0 && this.board[boardY - 1][boardX] !== 0 && this.board[boardY - 1][boardX] !== this.ferretPiece.color) {
                            score += 15;
                            lineClearPotential++;
                        }
                        if (boardX > 0 && this.board[boardY][boardX - 1] !== 0 && this.board[boardY][boardX - 1] !== this.ferretPiece.color) {
                            score += 10;
                            lineClearPotential++;
                        }
                        if (boardX < this.BOARD_WIDTH - 1 && this.board[boardY][boardX + 1] !== 0 && this.board[boardY][boardX + 1] !== this.ferretPiece.color) {
                            score += 10;
                            lineClearPotential++;
                        }
                    }
                }
            }
        }
        
        // Prefer lower positions (closer to bottom)
        score += (this.BOARD_HEIGHT - y) * 6;
        
        // Bonus for using bent shapes (more interesting)
        if (bendShape.length > 1) {
            score += 25;
        }
        
        // Bonus for filling multiple gaps
        if (gapFills >= 2) {
            score += 40;
        }
        
        // Bonus for bridging gaps (connecting blocks above and below)
        if (blocksBelow >= 2) {
            score += 35;
        }
        
        // Bonus for high line clear potential
        if (lineClearPotential >= 3) {
            score += 30;
        }
        
        // Heavy penalty for not filling any spaces
        if (filledSpaces === 0) {
            score -= 200;
        }
        
        // Bonus for filling spaces directly below current ferret position
        if (y > currentY) {
            score += 20; // Extra incentive to move down
        }
        
        return score;
    }
    
    placeNormalPiece() {
        // Fallback to normal piece placement
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
    }
    
    createBendShape(rows, cols) {
        // Create a bent ferret shape that always has 7 blocks total
        const shape = [];
        let blocksPlaced = 0;
        const totalBlocks = 7; // Ferret should always have 7 blocks
        
        for (let row = 0; row < rows; row++) {
            shape[row] = [];
            for (let col = 0; col < cols; col++) {
                if (blocksPlaced < totalBlocks) {
                    shape[row][col] = true;
                    blocksPlaced++;
                } else {
                    shape[row][col] = false;
                }
            }
        }
        
        // If we didn't place all 7 blocks, fill the remaining positions
        if (blocksPlaced < totalBlocks) {
            for (let row = 0; row < rows && blocksPlaced < totalBlocks; row++) {
                for (let col = 0; col < cols && blocksPlaced < totalBlocks; col++) {
                    if (!shape[row][col]) {
                        shape[row][col] = true;
                        blocksPlaced++;
                    }
                }
            }
        }
        
        return shape;
    }
    

    

    
    clearLines() {
        let linesToClear = [];
        
        // Find lines to clear
        for (let y = this.BOARD_HEIGHT - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                linesToClear.push(y);
            }
        }
        
        if (linesToClear.length > 0) {
            // Start line clear animation
            this.lineClearAnimation.active = true;
            this.lineClearAnimation.lines = linesToClear;
            this.lineClearAnimation.progress = 0;
            this.lineClearAnimation.outlineAlpha = 1;
            this.lineClearAnimation.fadeAlpha = 1;
        }
    }
    
    updateLineClearAnimation() {
        if (!this.lineClearAnimation.active) return;
        
        this.lineClearAnimation.progress++;
        
        if (this.lineClearAnimation.progress >= this.lineClearAnimation.duration) {
            // Animation complete, actually clear the lines
            this.completeLineClear();
        } else {
            // Update animation values
            const progress = this.lineClearAnimation.progress / this.lineClearAnimation.duration;
            
            // Outline effect: start bright, then fade
            if (progress < 0.3) {
                this.lineClearAnimation.outlineAlpha = 1;
            } else {
                this.lineClearAnimation.outlineAlpha = 1 - ((progress - 0.3) / 0.7);
            }
            
            // Fade effect: start normal, then fade out
            if (progress < 0.5) {
                this.lineClearAnimation.fadeAlpha = 1;
            } else {
                this.lineClearAnimation.fadeAlpha = 1 - ((progress - 0.5) / 0.5);
            }
        }
    }
    
    completeLineClear() {
        // Actually clear the lines
        const linesToClear = this.lineClearAnimation.lines;
        let linesCleared = linesToClear.length;
        
        // Sort lines from bottom to top to avoid index issues
        linesToClear.sort((a, b) => b - a);
        
        for (let lineY of linesToClear) {
            this.board.splice(lineY, 1);
            this.board.unshift(new Array(this.BOARD_WIDTH).fill(0));
        }
        
        // Update score and level
        this.lines += linesCleared;
        this.score += linesCleared * 100 * this.level;
        this.level = Math.floor(this.lines / 10) + 1;
        
        // Calculate new speed based on difficulty
        const baseSpeed = this.difficultySettings[document.getElementById('difficultySelect').value].initialSpeed;
        this.dropInterval = Math.max(50, baseSpeed - (this.level - 1) * this.speedIncrease);
        
        this.updateScore();
        
        // Reset animation
        this.lineClearAnimation.active = false;
        this.lineClearAnimation.lines = [];
        this.lineClearAnimation.progress = 0;
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lines').textContent = this.lines;
        document.getElementById('level').textContent = this.level;
    }
    
    endGame() {
        this.gameRunning = false;
        this.gameOver = true;
        
        // Hide mobile controls when game ends
        if (this.isMobile) {
            document.body.classList.remove('game-running');
        }
        
        document.getElementById('startBtn').style.display = 'block';
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('pauseBtn').textContent = 'Pause';
        document.getElementById('difficultySelect').disabled = false;
        document.getElementById('ohDeerMode').disabled = false;
        document.getElementById('beeMode').disabled = false;
        document.getElementById('ferretMode').disabled = false;
        
        // Hide mobile controls when game ends
        if (this.isMobile && this.mobileControls) {
            this.mobileControls.classList.remove('game-running');
        }
        
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
            <button onclick="this.parentElement.remove(); wildBlocks.startGame()">Play Again</button>
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
        
        // Update ferret animation and noodling
        if (this.ferretMode) {
            this.ferretAnimationFrame += this.ferretAnimationSpeed;
            this.updateFerretNoodling();
        }
        
        // Update cat animation and behavior
        if (this.catMode) {
            this.catAnimationFrame += this.catAnimationSpeed;
            this.updateCat();
        }
        
        // Update line clear animation
        this.updateLineClearAnimation();
        
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
        // Spawn new bees (reduced frequency)
        if (this.bees.length < this.maxBees && Math.random() < this.beeSpawnChance) {
            this.spawnBee();
        }
        
        // Update existing bees
        for (let i = this.bees.length - 1; i >= 0; i--) {
            const bee = this.bees[i];
            bee.x += bee.vx;
            bee.y += bee.vy;
            
            // Add some random movement
            bee.vx += (Math.random() - 0.5) * 0.3; // Reduced randomness
            bee.vy += (Math.random() - 0.5) * 0.3;
            
            // Keep bees within bounds
            bee.vx = Math.max(-1.5, Math.min(1.5, bee.vx)); // Reduced speed
            bee.vy = Math.max(-1.5, Math.min(1.5, bee.vy));
            
            // Check if bee should fill a gap (only occasionally)
            if (Math.random() < 0.1 && this.shouldBeeFillGap(bee)) { // 10% chance per frame
                this.fillGapWithBee(bee);
                this.bees.splice(i, 1);
            }
            
            // Remove bees that are out of bounds or too old
            if (bee.x < -10 || bee.x > this.canvas.width + 10 || 
                bee.y < -10 || bee.y > this.canvas.height + 10 ||
                bee.age > 400) { // Increased age limit
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
        const blockSize = this.getBlockSize();
        const boardX = Math.floor(bee.x / blockSize);
        const boardY = Math.floor(bee.y / blockSize);
        
        // Check if bee is within board bounds
        if (boardX < 0 || boardX >= this.BOARD_WIDTH || 
            boardY < 0 || boardY >= this.BOARD_HEIGHT) {
            return false;
        }
        
        // Check if there's a gap (empty space with blocks above it)
        if (this.board[boardY][boardX] === 0) {
            // Check if there are blocks above this position
            let hasBlocksAbove = false;
            let gapSize = 0;
            
            for (let y = boardY - 1; y >= 0; y--) {
                if (this.board[y][boardX] !== 0) {
                    hasBlocksAbove = true;
                    break;
                }
                gapSize++;
            }
            
            // Only fill if there are blocks above AND the gap is small (like a real bee would)
            if (hasBlocksAbove && gapSize <= 3) {
                // Additional check: make sure it's not a large open area
                let surroundingBlocks = 0;
                
                // Check blocks to the left and right
                if (boardX > 0 && this.board[boardY][boardX - 1] !== 0) surroundingBlocks++;
                if (boardX < this.BOARD_WIDTH - 1 && this.board[boardY][boardX + 1] !== 0) surroundingBlocks++;
                
                // Check blocks above (within 2 spaces)
                for (let y = boardY - 1; y >= Math.max(0, boardY - 3); y--) {
                    if (this.board[y][boardX] !== 0) surroundingBlocks++;
                }
                
                // Only fill if there are enough surrounding blocks (it's a small hole, not open space)
                return surroundingBlocks >= 2;
            }
        }
        
        return false;
    }
    
    fillGapWithBee(bee) {
        const blockSize = this.getBlockSize();
        const boardX = Math.floor(bee.x / blockSize);
        const boardY = Math.floor(bee.y / blockSize);
        
        // Fill the gap with a honey-colored block
        this.board[boardY][boardX] = 'honey'; // Special honey color identifier
        
        // Add some points for filling gaps
        this.score += 5;
        this.updateScore();
    }
    
    updateCat() {
        // Spawn cat if none exists
        if (!this.cat && Math.random() < this.catSpawnChance) {
            this.spawnCat();
        }
        
        // Update existing cat
        if (this.cat) {
            // Check if cat should leave
            if (Math.random() < this.catLeaveChance) {
                this.cat = null;
                return;
            }
            
            // Update cat position (slow walking)
            if (!this.cat.napping && !this.cat.clawing) {
                this.cat.x += this.cat.vx;
                this.cat.y += this.cat.vy;
                
                // Keep cat within board bounds
                if (this.cat.x < 0) this.cat.x = 0;
                if (this.cat.x > this.canvas.width - 20) this.cat.x = this.canvas.width - 20;
                if (this.cat.y < 0) this.cat.y = 0;
                if (this.cat.y > this.canvas.height - 20) this.cat.y = this.canvas.height - 20;
                
                // Random direction changes
                if (Math.random() < 0.02) {
                    this.cat.vx = (Math.random() - 0.5) * 0.5;
                    this.cat.vy = (Math.random() - 0.5) * 0.5;
                }
            } else if (this.cat.napping && this.cat.targetX !== null && this.cat.targetY !== null) {
                // Keep cat in nap position
                this.cat.x = this.cat.targetX;
                this.cat.y = this.cat.targetY;
            }
            
            // Update action timer
            this.catActionTimer++;
            
            // Take action when timer expires
            if (this.catActionTimer >= this.catActionInterval && !this.cat.napping && !this.cat.clawing) {
                this.catTakeAction();
                this.catActionTimer = 0;
            }
            
            // Update nap timer
            if (this.cat.napping) {
                this.catNapTimer++;
                if (this.catNapTimer >= this.catNapDuration) {
                    this.cat.napping = false;
                    this.catNapTimer = 0;
                    this.cat.napBoardX = null;
                    this.cat.napBoardY = null;
                }
            }
            
            // Update clawing animation
            if (this.cat.clawing) {
                this.catClawProgress++;
                if (this.catClawProgress >= this.catClawDuration) {
                    this.completeCatClaw();
                }
            }
        }
    }
    
    spawnCat() {
        // Spawn cat at a random edge of the board
        const side = Math.floor(Math.random() * 4);
        let x, y, vx, vy;
        
        switch(side) {
            case 0: // top
                x = Math.random() * this.canvas.width;
                y = -20;
                vx = (Math.random() - 0.5) * 0.5;
                vy = Math.random() * 0.5 + 0.2;
                break;
            case 1: // right
                x = this.canvas.width + 20;
                y = Math.random() * this.canvas.height;
                vx = -Math.random() * 0.5 - 0.2;
                vy = (Math.random() - 0.5) * 0.5;
                break;
            case 2: // bottom
                x = Math.random() * this.canvas.width;
                y = this.canvas.height + 20;
                vx = (Math.random() - 0.5) * 0.5;
                vy = -Math.random() * 0.5 - 0.2;
                break;
            case 3: // left
                x = -20;
                y = Math.random() * this.canvas.height;
                vx = Math.random() * 0.5 + 0.2;
                vy = (Math.random() - 0.5) * 0.5;
                break;
        }
        
        this.cat = {
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            napping: false,
            clawing: false,
            targetX: null,
            targetY: null,
            napBoardX: null,
            napBoardY: null
        };
    }
    
    catTakeAction() {
        // Decide whether to nap or claw
        if (Math.random() < this.catNapChance) {
            this.catStartNap();
        } else {
            this.catStartClaw();
        }
    }
    
    catStartNap() {
        // Find the top of each column (highest block in each column)
        const topPositions = [];
        
        for (let x = 0; x < this.BOARD_WIDTH; x++) {
            // Find the highest block in this column
            for (let y = 0; y < this.BOARD_HEIGHT; y++) {
                if (this.board[y][x] !== 0) {
                    // Found a block, this is the top of the column
                    topPositions.push({x, y});
                    break;
                }
            }
        }
        
        if (topPositions.length > 0) {
            const blockSize = this.getBlockSize();
            const napSpot = topPositions[Math.floor(Math.random() * topPositions.length)];
            
            // Position cat on top of the block (slightly above it)
            this.cat.targetX = napSpot.x * blockSize + blockSize / 2;
            this.cat.targetY = napSpot.y * blockSize - blockSize / 4; // Position above the block
            
            // Move cat to nap position immediately
            this.cat.x = this.cat.targetX;
            this.cat.y = this.cat.targetY;
            
            this.cat.napping = true;
            this.catNapTimer = 0;
            
            // Store the board position for collision detection
            this.cat.napBoardX = napSpot.x;
            this.cat.napBoardY = napSpot.y;
        }
    }
    
    catStartClaw() {
        // Find a random block to claw
        const occupiedPositions = [];
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this.board[y][x] !== 0) {
                    occupiedPositions.push({x, y});
                }
            }
        }
        
        if (occupiedPositions.length > 0) {
            const blockSize = this.getBlockSize();
            const clawTarget = occupiedPositions[Math.floor(Math.random() * occupiedPositions.length)];
            
            // Move cat to the target position and stop movement during clawing
            this.cat.x = clawTarget.x * blockSize + blockSize / 2;
            this.cat.y = clawTarget.y * blockSize + blockSize / 2;
            this.cat.targetX = this.cat.x;
            this.cat.targetY = this.cat.y;
            
            this.cat.clawing = true;
            this.catClawTarget = {x: clawTarget.x, y: clawTarget.y};
            this.catClawProgress = 0;
        }
    }
    
    completeCatClaw() {
        if (this.catClawTarget) {
            // Remove the target block
            this.board[this.catClawTarget.y][this.catClawTarget.x] = 0;
            this.cat.clawing = false;
            this.catClawTarget = null;
            this.catClawProgress = 0;
            
            // Reset target position so cat can move again
            this.cat.targetX = null;
            this.cat.targetY = null;
        }
    }
    
    draw() {
        this.drawBoard();
        this.drawCurrentPiece();
        this.drawNextPiece();
        this.drawBees();
        this.drawCat();
    }
    
    drawBoard() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        
        const blockSize = this.getBlockSize();
        
        // Ensure pixel-perfect grid lines
        for (let x = 0; x <= this.BOARD_WIDTH; x++) {
            const gridX = Math.round(x * blockSize);
            this.ctx.beginPath();
            this.ctx.moveTo(gridX, 0);
            this.ctx.lineTo(gridX, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.BOARD_HEIGHT; y++) {
            const gridY = Math.round(y * blockSize);
            this.ctx.beginPath();
            this.ctx.moveTo(0, gridY);
            this.ctx.lineTo(this.canvas.width, gridY);
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
        
        // Draw line clear animation
        if (this.lineClearAnimation.active) {
            this.drawLineClearAnimation();
        }
    }
    
    drawLineClearAnimation() {
        const blockSize = this.getBlockSize();
        for (let lineY of this.lineClearAnimation.lines) {
            // Draw outline effect
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${this.lineClearAnimation.outlineAlpha})`;
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(
                0, 
                lineY * blockSize, 
                this.BOARD_WIDTH * blockSize, 
                blockSize
            );
            
            // Draw fade effect on blocks
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this.board[lineY][x]) {
                    const blockX = x * blockSize + 1;
                    const blockY = lineY * blockSize + 1;
                    const blockSizeInner = blockSize - 2;
                    
                    // Create a fade effect by drawing a semi-transparent overlay
                    this.ctx.fillStyle = `rgba(255, 255, 255, ${1 - this.lineClearAnimation.fadeAlpha})`;
                    this.ctx.fillRect(blockX, blockY, blockSizeInner, blockSizeInner);
                    
                    // Add a glow effect
                    this.ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                    this.ctx.shadowBlur = 10 * this.lineClearAnimation.outlineAlpha;
                    this.ctx.fillStyle = `rgba(255, 255, 255, ${this.lineClearAnimation.outlineAlpha * 0.3})`;
                    this.ctx.fillRect(blockX - 2, blockY - 2, blockSizeInner + 4, blockSizeInner + 4);
                    this.ctx.shadowBlur = 0; // Reset shadow
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
                        
                        // Draw animated ferret emoji on ferret pieces
                        if (this.currentPiece.isFerret && this.ferretMode) {
                            this.drawFerretEmoji(x, y);
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
        // Check if this is a ferret block
        const isFerretBlock = color === this.ferretPiece.color;
        
        if (isFerretBlock) {
            this.drawFerretBlock(x, y);
        } else if (color === 'honey') {
            this.drawHoneyBlock(x, y);
        } else {
            this.drawNormalBlock(x, y, color);
        }
    }
    
    getBlockSize() {
        // Return the current block size (responsive)
        if (this.isMobile) {
            // Ensure block size is always a whole number for perfect grid alignment
            return Math.floor(this.BLOCK_SIZE);
        }
        return this.BLOCK_SIZE; // Use the actual calculated block size for desktop
    }
    
    drawNormalBlock(x, y, color) {
        const blockSize = this.getBlockSize();
        const blockX = Math.round(x * blockSize + 1);
        const blockY = Math.round(y * blockSize + 1);
        const blockSizeInner = Math.round(blockSize - 2);
        
        this.ctx.fillStyle = color;
        this.ctx.fillRect(blockX, blockY, blockSizeInner, blockSizeInner);
        
        // Add highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(blockX, blockY, blockSizeInner, 2);
        this.ctx.fillRect(blockX, blockY, 2, blockSizeInner);
        
        // Add shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(blockX + blockSizeInner - 2, blockY, 2, blockSizeInner);
        this.ctx.fillRect(blockX, blockY + blockSizeInner - 2, blockSizeInner, 2);
    }
    
    drawFerretBlock(x, y) {
        const blockSize = this.getBlockSize();
        const blockX = x * blockSize + 1;
        const blockY = y * blockSize + 1;
        const blockSizeInner = blockSize - 2;
        
        // Base ferret color with gradient
        const gradient = this.ctx.createLinearGradient(blockX, blockY, blockX + blockSizeInner, blockY + blockSizeInner);
        gradient.addColorStop(0, '#8B4513'); // Brown
        gradient.addColorStop(0.5, '#A0522D'); // Saddle brown
        gradient.addColorStop(1, '#654321'); // Dark brown
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(blockX, blockY, blockSizeInner, blockSizeInner);
        
        // Add ferret fur texture pattern
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 1;
        
        // Draw fur lines
        for (let i = 0; i < 3; i++) {
            const offset = (i * blockSizeInner / 3) + 2;
            this.ctx.beginPath();
            this.ctx.moveTo(blockX + 2, blockY + offset);
            this.ctx.lineTo(blockX + blockSizeInner - 2, blockY + offset);
            this.ctx.stroke();
        }
        
        // Add animated sparkle effect
        if (this.ferretMode) {
            const sparkleOffset = Math.sin(this.ferretAnimationFrame + x * 0.5 + y * 0.3) * 2;
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.fillRect(blockX + 4 + sparkleOffset, blockY + 4, 2, 2);
            this.ctx.fillRect(blockX + blockSizeInner - 6 - sparkleOffset, blockY + blockSizeInner - 6, 2, 2);
        }
        
        // Enhanced highlight for ferret blocks
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.fillRect(blockX, blockY, blockSizeInner, 3);
        this.ctx.fillRect(blockX, blockY, 3, blockSizeInner);
        
        // Enhanced shadow for ferret blocks
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.fillRect(blockX + blockSizeInner - 3, blockY, 3, blockSizeInner);
        this.ctx.fillRect(blockX, blockY + blockSizeInner - 3, blockSizeInner, 3);
        
        // Add subtle glow effect
        this.ctx.shadowColor = '#8B4513';
        this.ctx.shadowBlur = 3;
        this.ctx.strokeRect(blockX, blockY, blockSizeInner, blockSizeInner);
        this.ctx.shadowBlur = 0;
    }
    
    drawHoneyBlock(x, y) {
        const blockSize = this.getBlockSize();
        const blockX = x * blockSize + 1;
        const blockY = y * blockSize + 1;
        const blockSizeInner = blockSize - 2;
        
        // Create honey gradient
        const gradient = this.ctx.createLinearGradient(blockX, blockY, blockX + blockSizeInner, blockY + blockSizeInner);
        gradient.addColorStop(0, '#FFD700'); // Golden yellow
        gradient.addColorStop(0.3, '#FFA500'); // Orange
        gradient.addColorStop(0.7, '#FF8C00'); // Dark orange
        gradient.addColorStop(1, '#DAA520'); // Goldenrod
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(blockX, blockY, blockSizeInner, blockSizeInner);
        
        // Add honey texture pattern (wavy lines)
        this.ctx.strokeStyle = '#B8860B';
        this.ctx.lineWidth = 1;
        
        // Draw wavy honey texture
        for (let i = 0; i < 3; i++) {
            const offset = (i * blockSizeInner / 3) + 2;
            this.ctx.beginPath();
            this.ctx.moveTo(blockX + 2, blockY + offset);
            
            // Create wavy pattern
            for (let j = 0; j < blockSizeInner - 4; j += 4) {
                const waveOffset = Math.sin(j * 0.5) * 2;
                this.ctx.lineTo(blockX + 2 + j, blockY + offset + waveOffset);
            }
            this.ctx.stroke();
        }
        
        // Add highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.fillRect(blockX, blockY, blockSizeInner, 3);
        this.ctx.fillRect(blockX, blockY, 3, blockSizeInner);
        
        // Add shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(blockX + blockSizeInner - 3, blockY, 3, blockSizeInner);
        this.ctx.fillRect(blockX, blockY + blockSizeInner - 3, blockSizeInner, 3);
        
        // Draw bee emoji
        const centerX = blockX + blockSizeInner / 2;
        const centerY = blockY + blockSizeInner / 2;
        
        // Animate bee emoji with a gentle floating effect
        const floatOffset = Math.sin(this.beeAnimationFrame + x * 0.2 + y * 0.3) * 1;
        const beeY = centerY + floatOffset;
        
        // Responsive font size for bee emoji
        const fontSize = Math.max(8, Math.min(12, blockSizeInner * 0.4));
        this.ctx.font = fontSize + 'px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Add glow effect for bee emoji
        this.ctx.shadowColor = '#FFD700';
        this.ctx.shadowBlur = 3;
        this.ctx.fillText('🐝', centerX, beeY);
        this.ctx.shadowBlur = 0;
        
        // Add subtle glow effect for the whole block
        this.ctx.shadowColor = '#FFD700';
        this.ctx.shadowBlur = 2;
        this.ctx.strokeRect(blockX, blockY, blockSize, blockSize);
        this.ctx.shadowBlur = 0;
    }
    
    drawDeerEmoji(x, y) {
        const blockSize = this.getBlockSize();
        const centerX = x * blockSize + blockSize / 2;
        const centerY = y * blockSize + blockSize / 2;
        
        // Animate deer position with a bouncing effect
        const bounceOffset = Math.sin(this.deerAnimationFrame) * 3;
        const deerY = centerY + bounceOffset;
        
        // Draw deer emoji with responsive font size
        const fontSize = Math.max(12, Math.min(16, blockSize * 0.5));
        this.ctx.font = fontSize + 'px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🦌', centerX, deerY);
        
        // Add a subtle glow effect
        this.ctx.shadowColor = '#FFD700';
        this.ctx.shadowBlur = 5;
        this.ctx.fillText('🦌', centerX, deerY);
        this.ctx.shadowBlur = 0;
    }
    
    drawFerretEmoji(x, y) {
        const blockSize = this.getBlockSize();
        const centerX = x * blockSize + blockSize / 2;
        const centerY = y * blockSize + blockSize / 2;
        
        // Animate ferret with a wiggling effect
        const wiggleOffset = Math.sin(this.ferretAnimationFrame + x * 0.3) * 2;
        const ferretX = centerX + wiggleOffset;
        const ferretY = centerY;
        
        // Draw ferret emoji with responsive font size
        const fontSize = Math.max(10, Math.min(14, blockSize * 0.45));
        this.ctx.font = fontSize + 'px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Add glow effect
        this.ctx.shadowColor = '#8B4513';
        this.ctx.shadowBlur = 4;
        this.ctx.fillText('🦦', ferretX, ferretY);
        this.ctx.shadowBlur = 0;
    }
    
    drawBees() {
        if (!this.beeMode) return;
        
        for (const bee of this.bees) {
            // Animate bee with buzzing effect
            const buzzOffset = Math.sin(this.beeAnimationFrame + bee.x * 0.1) * 2;
            const beeX = bee.x + buzzOffset;
            const beeY = bee.y;
            
            // Draw bee emoji with responsive font size
            const fontSize = this.isMobile ? 10 : 12;
            this.ctx.font = fontSize + 'px Arial';
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
    
    drawCat() {
        if (!this.catMode || !this.cat) return;
        
        // Animate cat with gentle movement
        const catX = this.cat.x + Math.sin(this.catAnimationFrame) * 1;
        const catY = this.cat.y;
        
        // Draw cat emoji with responsive font size
        const fontSize = this.isMobile ? 16 : 20;
        this.ctx.font = fontSize + 'px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Add glow effect
        this.ctx.shadowColor = '#FFA500';
        this.ctx.shadowBlur = 4;
        this.ctx.fillText('🐱', catX, catY);
        this.ctx.shadowBlur = 0;
        
        // Draw speech bubble if napping
        if (this.cat.napping) {
            this.drawCatNapBubble(catX, catY);
        }
        
        // Draw clawing animation if clawing
        if (this.cat.clawing) {
            this.drawCatClawingAnimation(catX, catY);
        }
    }
    
    drawCatNapBubble(catX, catY) {
        const bubbleX = catX + 15;
        const bubbleY = catY - 25;
        
        // Draw speech bubble background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        
        // Bubble shape
        this.ctx.beginPath();
        this.ctx.rect(bubbleX - 20, bubbleY - 15, 40, 30);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw "zzz" text
        this.ctx.fillStyle = '#333';
        const fontSize = this.isMobile ? 10 : 12;
        this.ctx.font = fontSize + 'px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('zzz', bubbleX, bubbleY - 5);
        
        // Draw sleeping cat emoji
        const emojiSize = this.isMobile ? 12 : 14;
        this.ctx.font = emojiSize + 'px Arial';
        this.ctx.fillText('😴', bubbleX, bubbleY + 5);
    }
    
    drawCatClawingAnimation(catX, catY) {
        const bubbleX = catX + 15;
        const bubbleY = catY - 25;
        
        // Draw speech bubble background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        
        // Bubble shape
        this.ctx.beginPath();
        this.ctx.rect(bubbleX - 25, bubbleY - 15, 50, 30);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw clawing text
        this.ctx.fillStyle = '#333';
        const fontSize = this.isMobile ? 8 : 10;
        this.ctx.font = fontSize + 'px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('scratch', bubbleX, bubbleY - 5);
        this.ctx.fillText('scratch', bubbleX, bubbleY + 5);
        
        // Animate the cat emoji with scratching motion
        const scratchOffset = Math.sin(this.catClawProgress * 0.3) * 3;
        const emojiSize = this.isMobile ? 14 : 16;
        this.ctx.font = emojiSize + 'px Arial';
        this.ctx.fillText('🐾', catX + scratchOffset, catY);
    }
}

// Initialize the game when the page loads
let wildBlocks;
document.addEventListener('DOMContentLoaded', () => {
    wildBlocks = new WildBlocks();
}); 