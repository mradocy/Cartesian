
FullGame.SpaceshipCutscene = function (game) {
    //I hate everything about this cutscene
};

FullGame.SpaceshipCutscene.prototype = {
    
    bg:null,
    laserG:null,
    shipSprite:null,
    shipDamagedSprite:null,
    playerSprite:null,
    playerVY:0,
    powerPlayerSprite:null,
    powerPlayerVY:0,
    skipText:null,
    reticlePower:null,
    reticle:null,
    
    //ship exhaust
    EX_X:75 -110 + 24,
    EX_WIDTH:34,
    EX_Y:295 -170,
    EX_SPEED:50,
    EX_ACCEL:300,
    EX_MAX_ANGLE:40 *Math.PI/180,
    EX_PERIOD:.01,
    EX_DURATION:.5,
    EX_SPRITE_KEYS:["ship_ex_1", "ship_ex_2"],
    exTime:0,
    exCache:[], //recycles exhaust particles
    
    //blackscreen
    blackScreen:null,
    blackScreenFadeTime:0,
    blackScreenFadeIn:false,
    BLACK_SCREEN_FADE_DURATION:.5,
    beginGameAfterFadeToBlack:false,
    
    //damagescreen
    damageScreen:null,
    
    laserThickSound:null,
    
    state:"begin",
    laserState:"transparent",
    time:0,
    
    preload: function () {
        
    },
    
    create: function () {
        
        //bg
        var bgKey = "space1";
        this.bg = game.add.image(0, 0, bgKey);
        
        //laser graphics
        this.laserG = game.add.graphics(0, 0);
        
        //ship
        this.shipSprite = game.add.sprite(0, 0, "spaceship", undefined);
        this.shipSprite.animations.add("blink", [0], 4, true);
        this.shipSprite.animations.play("blink");
        this.shipSprite.anchor.setTo(.5, .5); //sprite is centered
        
        //ship damaged
        this.shipDamagedSprite = game.add.image(0, 0, "spaceship_damaged", undefined);
        this.shipDamagedSprite.anchor.setTo(.5, .5); //sprite is centered
        this.shipDamagedSprite.visible = false;
        
        //player sprite
        this.playerSprite = game.add.sprite(0, 0, "player_red", undefined);
        this.playerSprite.animations.add("falling", [26], 20, true);
        this.playerSprite.animations.play("falling");
        this.playerSprite.anchor.setTo(.5, .5); //sprite is centered
        this.playerSprite.scale.set(.5, .5);
        this.playerSprite.visible = false;
        this.powerPlayerSprite = game.add.image(0, 0, "power_player");
        this.powerPlayerSprite.anchor.setTo(.5, .5); //sprite is centered
        this.powerPlayerSprite.scale.set(.5, .5);
        this.powerPlayerSprite.visible = false;
        
        //skiptext
        this.skipText = game.add.text(
                50,
                520,
                "(press S or ↓ to advance)",
                { font: "14px Lucida Console", fill: "#BBBBBB" });
        this.skipText.alpha = 0;
        
        //reticle
        this.reticlePower = game.add.sprite(0, 0, "reticle_power", 0);
        this.reticlePower.anchor.setTo(.5, .5);
        this.reticlePower.scale.set(.5, .5);
        this.reticlePower.visible = true;
        this.reticle = game.add.sprite(0, 0, "reticle_red", 0);
        this.reticle.anchor.setTo(.5, .5);
        this.reticle.scale.set(.5, .5);
        this.reticle.visible = true;
        
        //blackScreen
        this.blackScreen = game.add.graphics(0, 0);
        this.blackScreen.beginFill(0x000000, 1);
        this.blackScreen.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this.blackScreen.endFill();
        this.blackScreen.visible = false;
        this.blackScreenFadeTime = 0;
        this.blackScreenFadeIn = false;
        
        //damageScreen
        this.damageScreen = game.add.graphics(0, 0),
        this.damageScreen.beginFill(0xEA0000, .3);
        this.damageScreen.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this.damageScreen.endFill();
        this.damageScreen.visible = false;
        
        this.laserThickSound = game.sound.add("laser_thick_alien", 1, true);
        
        //start cutscene
        this.fadeIn();
        this.state = "begin";
        this.time = 0;
        this.shipSprite.x = 200;
        this.shipSprite.y = 750;
        
    },
    
    update: function() {
        FullGame.Keys.refresh();
        
        var dt = game.time.physicsElapsed;
        
        //move reticle
        this.reticlePower.x = FullGame.Keys.mouseX;
        this.reticlePower.y = FullGame.Keys.mouseY;
        this.reticle.x = this.reticlePower.x;
        this.reticle.y = this.reticlePower.y;
        
        this.time += dt;
        
        if (this.state == "begin"){
            
            //move ship
            this.shipSprite.y -= 120 * dt;
            
            //spawn exhaust
            if (this.time < 3.0){
                this.exTime += dt;
                while (this.exTime > this.EX_PERIOD){
                    this.exTime -= this.EX_PERIOD;
                    this.spawnEx(1);
                }
            }
            if (this.time > 4.95){
                this.laserState = "thick";
                if (!FullGame.Vars.sfxMuted){
                    this.laserThickSound.play("", 0, 1, true);
                }
                this.state = "damageFlash";
                FullGame.playSFX("damage_flesh");
            }
            
        } else if (this.state == "damageFlash"){
            
            if (this.time > 5.2 ||
                Math.floor(this.time / .08) % 2 == 1){
                this.damageScreen.visible = false;
            } else {
                this.damageScreen.visible = true;
            }
            
            if (this.time > 5.1 && this.time-dt <= 5.1){
                this.shipSprite.visible = false;
                this.shipDamagedSprite.x = this.shipSprite.x;
                this.shipDamagedSprite.y = this.shipSprite.y;
                this.shipDamagedSprite.visible = true;
            }
            
            if (this.time > 5.2){
                this.state = "damage";
                this.laserState = "transparent";
                if (!FullGame.Vars.sfxMuted){
                    this.laserThickSound.stop();
                }
                this.playerSprite.visible = true;
                this.playerSprite.x = this.shipDamagedSprite.x;
                this.playerSprite.y = this.shipDamagedSprite.y;
                this.playerVY = -300;
                this.powerPlayerSprite.visible = true;
                this.powerPlayerSprite.x = this.playerSprite.x;
                this.powerPlayerSprite.y = this.playerSprite.y;
                this.powerPlayerVY = -200;
                this.reticlePower.visible = false;
                this.reticle.visible = true;
                
            }
        } else if (this.state == "damage"){
            this.shipDamagedSprite.x -= 90 * dt;
            this.shipDamagedSprite.y -= 140 * dt;
            this.shipDamagedSprite.rotation -= .3 * dt;
            
            this.playerVY += 300 * dt;
            this.playerSprite.y += this.playerVY * dt;
            this.playerSprite.x += 100 * dt;
            this.playerSprite.rotation += 2.0 * dt;
            
            this.powerPlayerVY += 300 * dt;
            this.powerPlayerSprite.y += this.powerPlayerVY * dt;
            this.powerPlayerSprite.x += 300 * dt;
            this.powerPlayerSprite.rotation += 4.5 * dt;
            
            if (this.time > 8.5 && this.time-dt <= 8.5){
                this.fadeOut();
            }
            if (this.time > 9.2){
                this.startGame();
            }
        }
        
        
        //laser
        var color1 = FullGame.Lasers.COLOR_PURPLE1;
        var color2 = FullGame.Lasers.COLOR_PURPLE2;
        var thickness1 = 0;
        var thickness2 = 0;
        var alpha1 = 0;
        var alpha2 = 0;
        var x0a = 1150;
        var y0a = 600;
        var x0b = 1100;
        var y0b = 650;
        var x1a=0; var y1a=0;
        var x1b=0; var y1b=0;
        if (this.laserState == "transparent"){
            thickness1 = FullGame.Lasers.THICKNESS_TRANSPARENT;
            alpha1 = FullGame.Lasers.ALPHA_TRANSPARENT;
        } else if (this.laserState == "thick"){
            thickness1 = FullGame.Lasers.THICKNESS_THICK1;
            thickness2 = FullGame.Lasers.THICKNESS_THICK2;
            alpha1 = FullGame.Lasers.ALPHA_THICK1;
            alpha2 = FullGame.Lasers.ALPHA_THICK2;
        }
        
        var t = 0;
        if (this.time < 1.5){
            t = this.time;
            x1a = Math.easeInOutQuad(t, 700, 1100-700, 1.5);
            y1a = -10;
            x1b = Math.easeInOutQuad(t, 600, 1100-600, 1.5);
            y1b = -10;
        } else if (this.time < 5.0){
            t = this.time - 1.5;
            x1a = Math.easeInOutQuad(t, 1200, -220-1200, 3.5);
            y1a = -50;
            x1b = Math.easeInOutQuad(t, 1100, -150-1100, 3.5);
            y1b = -50;
        } else if (this.time < 5.3){
            t = this.time - 5.0;
            x1a = -220;
            y1a = -50;
            x1b = -150;
            y1b = -50;
        } else if (this.time < 8.0) {
            t = this.time - 5.1;
            x1a = -200;
            y1a = Math.easeInOutQuad(t, -50, 700+50, 3.0);
            x1b = -150;
            y1b = Math.easeInOutQuad(t, -50, 600+50, 3.0);
        } else {
            x1a = -200;
            y1a = 700;
            x1b = -150;
            y1b = 600;
        }
        
        this.laserG.clear();
        if (thickness1 > 0){
            this.laserG.lineStyle(thickness1, color1, alpha1);
            this.laserG.moveTo(x0a, y0a);
            this.laserG.lineTo(x1a, y1a);
            this.laserG.moveTo(x0b, y0b);
            this.laserG.lineTo(x1b, y1b);
            if (thickness2 > 0){
                this.laserG.lineStyle(thickness2, color2, alpha2);
                this.laserG.moveTo(x0a, y0a);
                this.laserG.lineTo(x1a, y1a);
                this.laserG.moveTo(x0b, y0b);
                this.laserG.lineTo(x1b, y1b);
            }
        }
        
        
        //skipText
        /*
        this.skipText.alpha = Math.min(1, Math.max(0, (this.playerRotateTime - 3) * .4));
        */
        //blackscreen fading
        if (this.blackScreenFadeTime < this.BLACK_SCREEN_FADE_DURATION){
            this.blackScreenFadeTime = Math.min(this.BLACK_SCREEN_FADE_DURATION, this.blackScreenFadeTime + dt);
            this.blackScreen.visible = true;
            if (this.blackScreenFadeIn){
                this.blackScreen.alpha = this.blackScreenFadeTime / this.BLACK_SCREEN_FADE_DURATION;
                if (this.blackScreen.alpha > .9999){
                    if (this.beginGameAfterFadeToBlack){
                        this.state.start(FullGame.Vars.startMap);
                    }
                }
            } else {
                this.blackScreen.alpha = 1 - (this.blackScreenFadeTime / this.BLACK_SCREEN_FADE_DURATION);
                if (this.blackScreen.alpha <= .0001){
                    this.blackScreen.visible = false;
                }
            }
        }
        
    },
    
    render: function() {
        //called after displaying everything
    },
    
    fadeIn: function() {
        this.blackScreenFadeTime = 0;
        this.blackScreenFadeIn = false;
        this.blackScreen.visible = true;
    },
    
    fadeOut: function() {
        this.blackScreenFadeTime = 0;
        this.blackScreenFadeIn = true;
        this.blackScreen.visible = true;
    },
    
    startGame: function() {
        FullGame.Vars.startMap = "landedAgain";
        FullGame.Vars.lastMap = "openArea";
        FullGame.Vars.playerLaserColorOnLevelStart = FullGame.Til.RED;
        FullGame.Vars.playerLaserColor = FullGame.Til.RED;
        FullGame.Vars.playerLaserTypeOnLevelStart = FullGame.Til.LASER_NORMAL;
        FullGame.Vars.playerLaserType = FullGame.Til.LASER_NORMAL;
        FullGame.GI.state.start(FullGame.Vars.startMap);
    },
        
    spawnEx: function(numExs) {
        
        for (var i=0; i<numExs; i++){
            
            var r = (Math.random()*2-1);
            var angle = Math.PI/2 - r * this.EX_MAX_ANGLE;
            var x = this.shipSprite.x + this.EX_X + this.EX_WIDTH * (r+1)/2;
            var y = this.shipSprite.y + this.EX_Y;
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            
            var ex;
            if (this.exCache.length == 0){
                ex = game.add.image(x, y, this.EX_SPRITE_KEYS[Math.floor(this.EX_SPRITE_KEYS.length*Math.random())]);
                ex.anchor.setTo(.5, .5);
                ex.spaceShip = this;
                ex.update = function() {
                    var dt = game.time.physicsElapsed;
                    this.speed += this.accel * dt;
                    this.x += this.c * this.speed * dt;
                    this.y += this.s * this.speed * dt;
                    this.t += dt;
                    this.alpha = Math.min(1, 1 - this.t / this.duration);
                    if (this.t > this.duration){
                        this.visible = false;
                        this.spaceShip.exCache.push(this);
                    }
                };
            } else {
                ex = this.exCache.pop();
                ex.x = x;
                ex.y = y;
                ex.visible = true;
            }
            ex.c = c;
            ex.s = s;
            ex.speed = this.EX_SPEED;
            ex.accel = this.EX_ACCEL;
            ex.t = 0;
            ex.duration = this.EX_DURATION;
            ex.alpha = 1;
            ex.parent.setChildIndex(ex, 2);
        }
    },
    
    shutdown: function () {
        //destroy stuff
        this.exCache.splice(0, this.exCache.length);
        this.playerSprite.destroy();
        this.playerSprite = null;
        this.blackScreen.destroy();
        this.blackScreen = null;
    },
    

};