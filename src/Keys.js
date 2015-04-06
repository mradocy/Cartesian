FullGame.Keys = {
    leftPressed:false,
    upPressed:false,
    rightPressed:false,
    downPressed:false,
    jumpPressed:false,
    lmbPressed:false,
    mmbPressed:false,
    rmbPressed:false,
    pausePressed:false,
    leftHeld:false,
    upHeld:false,
    rightHeld:false,
    downHeld:false,
    jumpHeld:false,
    pauseHeld:false,
    lmbHeld:false,
    mmbHeld:false,
    rmbHeld:false,
    mouseX:0.0,
    mouseY:0.0
};

FullGame.Keys.init = function() {
    //so these keys won't affect the webpage
    game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.F10,
        Phaser.Keyboard.F11,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN,
        Phaser.Keyboard.SPACEBAR]);
    //so right click won't bring up menu
    game.canvas.oncontextmenu = function (e) { e.preventDefault(); /*destroyAnchor()*/ };
    
};

//call this at the beginning of game update()
FullGame.Keys.refresh = function() {
    var temp;
    temp = this.leftHeld;
    this.leftHeld = game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || game.input.keyboard.isDown(Phaser.Keyboard.A);
    if (this.leftHeld == null) this.leftHeld = false; //need these lines to fix annoying Phaser bug
    if (temp) this.leftPressed = false;
    else this.leftPressed = this.leftHeld;
    temp = this.upHeld;
    this.upHeld = game.input.keyboard.isDown(Phaser.Keyboard.UP) || game.input.keyboard.isDown(Phaser.Keyboard.W);
    if (this.upHeld == null) this.upHeld = false;
    if (temp) this.upPressed = false;
    else this.upPressed = this.upHeld;
    temp = this.rightHeld;
    this.rightHeld = game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.D);
    if (this.rightHeld == null) this.rightHeld = false;
    if (temp) this.rightPressed = false;
    else this.rightPressed = this.rightHeld;
    temp = this.downHeld;
    this.downHeld = game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || game.input.keyboard.isDown(Phaser.Keyboard.S);
    if (this.downHeld == null) this.downHeld = false;
    if (temp) this.downPressed = false;
    else this.downPressed = this.downHeld;
    temp = this.jumpHeld;
    this.jumpHeld = this.upHeld || game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
    if (this.jumpHeld == null) this.jumpHeld = false;
    if (temp) this.jumpPressed = false;
    else this.jumpPressed = this.jumpHeld;
    temp = this.lmbHeld;
    this.lmbHeld = (game.input.mouse.button == Phaser.Mouse.LEFT_BUTTON);
    if (this.lmbHeld == null) this.lmbHeld = false;
    if (temp) this.lmbPressed = false;
    else this.lmbPressed = this.lmbHeld;
    temp = this.mmbHeld;
    this.mmbHeld = (game.input.mouse.button == Phaser.Mouse.MIDDLE_BUTTON);
    if (this.mmbHeld == null) this.mmbHeld = false;
    if (temp) this.mmbPressed = false;
    else this.mmbPressed = this.mmbHeld;
    temp = this.rmbHeld;
    this.rmbHeld = (game.input.mouse.button == Phaser.Mouse.RIGHT_BUTTON || game.input.keyboard.isDown(Phaser.Keyboard.SHIFT));
    if (this.rmbHeld == null) this.rmbHeld = false;
    if (temp) this.rmbPressed = false;
    else this.rmbPressed = this.rmbHeld;
    temp = this.pauseHeld;
    this.pauseHeld = game.input.keyboard.isDown(Phaser.Keyboard.ENTER) || game.input.keyboard.isDown(Phaser.Keyboard.ESC)  || game.input.keyboard.isDown(Phaser.Keyboard.P);
    if (this.pauseHeld == null) this.pauseHeld = false;
    if (temp) this.pausePressed = false;
    else this.pausePressed = this.pauseHeld;
    this.mouseX = game.input.x;
    this.mouseY = game.input.y;
    
};
