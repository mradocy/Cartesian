//returns made doors, but doesn't add them to FullGame.GI.objs (will be done in ParseObjects)
FullGame.makeDoor = function(game, horizontally, color, autoClose) {
    //initialization
    var door1;
    var door2;
    var spriteKey1;
    var spriteKey2;
    switch (color){
    case FullGame.Til.BLUE:
        spriteKey1 = "door_blue_1";
        spriteKey2 = "door_blue_2";
        break;
    case FullGame.Til.GREEN:
        spriteKey1 = "door_green_1";
        spriteKey2 = "door_green_2";
        break;
    case FullGame.Til.BLACK:
        spriteKey1 = "door_black_1";
        spriteKey2 = "door_black_2";
        break;
    case FullGame.Til.RED:
    default:
        spriteKey1 = "door_red_1";
        spriteKey2 = "door_red_2";
    }
    door1 = game.add.sprite(0, 0, spriteKey1, undefined, FullGame.GI.objGroup);
    door2 = game.add.sprite(0, 0, spriteKey2, undefined, FullGame.GI.objGroup);
    door1.door2 = door2;
    
    //constants
    door1.WIDTH = 48;
    door1.HEIGHT = 64;
    door1.OPEN_DURATION = 1.0;
    door1.OPEN_DELAY_UNTIL_PUZZLE_SOLVED_SOUND = .5;
    door1.CLOSE_DURATION = .5;
    
    door1.anchor.setTo(.5, .5); //sprite is centered
    door2.anchor.setTo(.5, .5); //sprite is centered
    game.physics.enable(door1, Phaser.Physics.ARCADE);
    game.physics.enable(door2, Phaser.Physics.ARCADE);
    door1.body.checkCollision.any = false;
    door2.body.checkCollision.any = false;
    door1.body.immovable = true;
    door2.body.immovable = true;
    
    if (horizontally){
        door1.horiz = true;
        door1.rotation = -Math.PI/2;
        door2.rotation = -Math.PI/2;
        door1.body.setSize(door1.HEIGHT, door1.WIDTH, 0, 0);
        door2.body.setSize(door1.HEIGHT, door1.WIDTH, 0, 0);
        door1.body.checkCollision.left = false;
        door2.body.checkCollision.right = false;
        door1.laserLines = [{x0:(-door1.HEIGHT/2), y0:(-door1.WIDTH/2), x1:(door1.HEIGHT/2), y1:(-door1.WIDTH/2), color:color},
                            {x0:(door1.HEIGHT/2), y0:(-door1.WIDTH/2), x1:(door1.HEIGHT/2), y1:(door1.WIDTH/2), color:color},
                            {x0:(door1.HEIGHT/2), y0:(door1.WIDTH/2), x1:(-door1.HEIGHT/2), y1:(door1.WIDTH/2), color:color},
                            {x0:(-door1.HEIGHT/2), y0:(door1.WIDTH/2), x1:(-door1.HEIGHT/2), y1:(-door1.WIDTH/2), color:color}];
    } else {
        door1.horiz = false;
        door1.body.setSize(door1.WIDTH, door1.HEIGHT, 0, 0);
        door2.body.setSize(door1.WIDTH, door1.HEIGHT, 0, 0);
        door1.body.checkCollision.up = false;
        door2.body.checkCollision.down = false;
        door1.laserLines = [{x0:(-door1.WIDTH/2), y0:(-door1.HEIGHT/2), x1:(door1.WIDTH/2), y1:(-door1.HEIGHT/2), color:color},
                            {x0:(door1.WIDTH/2), y0:(-door1.HEIGHT/2), x1:(door1.WIDTH/2), y1:(door1.HEIGHT/2), color:color},
                            {x0:(door1.WIDTH/2), y0:(door1.HEIGHT/2), x1:(-door1.WIDTH/2), y1:(door1.HEIGHT/2), color:color},
                            {x0:(-door1.WIDTH/2), y0:(door1.HEIGHT/2), x1:(-door1.WIDTH/2), y1:(-door1.HEIGHT/2), color:color}];
    }
    door2.laserLines = door1.laserLines;
    
    door1.type = "door";
    door1.color = color;
    door1.opening = false;
    door1.opened = false;
    door1.closing = false;
    door1.autoClose = autoClose;
    door1.stopsMusic = false;
    door1.cannotOpen = false;
    door1.autoCloseTime = 0;
    door1.AUTO_CLOSE_DELAY = .6;
    door1.lastSetX = 0;
    door1.lastSetY = 0;
    door1.specialTime = 0;
    
    door1.setX = function(x) {
        if (this.horiz){
            this.x = x - this.HEIGHT/2;
            this.door2.x = x + this.HEIGHT/2;
        } else {
            this.x = x;
            this.door2.x = x;
        }
        this.lastSetX = x;
    };
    door1.setY = function(y) {
        if (this.horiz){
            this.y = y;
            this.door2.y = y;
        } else {
            this.y = y - this.HEIGHT/2;
            this.door2.y = y + this.HEIGHT/2;
        }
        this.lastSetY = y;
    };
    
    door1.open = function() {
        if (this.opening) return;
        if (this.cannotOpen) return;
        
        //play sound effect
        FullGame.playSFX("door_open");
        FullGame.HUD.solveFlash();
        if (this.stopsMusic){
            FullGame.fadeOutMusic(1.0);
        }
        
        if (this.horiz){
            this.body.velocity.x = -this.HEIGHT / this.OPEN_DURATION;
            this.door2.body.velocity.x = this.HEIGHT / this.OPEN_DURATION;
        } else {
            this.body.velocity.y = -this.HEIGHT / this.OPEN_DURATION;
            this.door2.body.velocity.y = this.HEIGHT / this.OPEN_DURATION;
        }
        this.openTime = 0;
        
        this.opening = true;
    };
    
    door1.close = function(delay) {
        if (this.closing) return;
        
        if (this.horiz){
            this.body.x -= this.HEIGHT;
            this.door2.body.x += this.HEIGHT;
        } else {
            this.body.y -= this.HEIGHT;
            this.door2.body.y += this.HEIGHT;
        }
        this.openTime = -delay;
        
        this.closing = true;
    };
    
    door1.update = function() {
        var dt = game.time.physicsElapsed;
        
        
        //check for special conditions that would open the door
        if (FullGame.Vars.startMap == "numbers"){
            if (FullGame.Lasers.number6Rendered){
                this.specialTime += dt;
                if (this.specialTime > .4){
                    this.open();
                }
            } else {
                this.specialTime = 0;
            }
        } else if (FullGame.Vars.startMap == "star"){
            if (FullGame.Lasers.starRendered){
                this.specialTime += dt;
                if (this.specialTime > .4){
                    this.open();
                }
            } else {
                this.specialTime = 0;
            }
        }
        
        
        
        if (this.autoClose){
            //only close if coming from back
            if (FullGame.rooms.indexOf(FullGame.Vars.lastMap) <
                FullGame.rooms.indexOf(FullGame.Vars.startMap)){
                this.close(this.AUTO_CLOSE_DELAY);
            }
            this.autoClose = false;
        }
        
        if (this.opening && !this.opened){
            if (this.openTime < this.OPEN_DELAY_UNTIL_PUZZLE_SOLVED_SOUND &&
                this.openTime+dt >= this.OPEN_DELAY_UNTIL_PUZZLE_SOLVED_SOUND){
                FullGame.playSFX("puzzle_solved");
            }
            this.openTime += dt;
            if (this.openTime >= this.OPEN_DURATION){
                this.body.velocity.set(0, 0);
                this.door2.body.velocity.set(0, 0);
                this.visible = false;
                this.body.enable = false;
                this.door2.visible = false;
                this.door2.body.enable = false;
                delete this.laserLines;
                delete this.door2.laserLines;
                FullGame.Messages.onDoorOpen();
                
                this.opened = true;
            }
        } else if (this.closing){
            
            if (this.openTime <= 0 && this.openTime+dt > 0){
                //actually begin closing
                if (this.horiz){
                    this.body.velocity.x = this.HEIGHT / this.CLOSE_DURATION;
                    this.door2.body.velocity.x = -this.HEIGHT / this.CLOSE_DURATION;
                } else {
                    this.body.velocity.y = this.HEIGHT / this.CLOSE_DURATION;
                    this.door2.body.velocity.y = -this.HEIGHT / this.CLOSE_DURATION;
                }
            }
            this.openTime += dt;
            
            if (this.openTime >= this.CLOSE_DURATION - .02){
                //done closing
                this.body.velocity.set(0, 0);
                this.door2.body.velocity.set(0, 0);
                this.setX(this.lastSetX);
                this.setY(this.lastSetY);
                this.closing = false;
                FullGame.playSFX("door_open");
            }
            
        } else {
            this.setX(this.lastSetX);
            this.setY(this.lastSetY);
        }
    };
    
    return {door1:door1, door2:door2};
};