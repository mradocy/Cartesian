FullGame.EndScene = function (game) {
    
    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
    
    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)
    
    
};

FullGame.EndScene.prototype = {
    
    bgs:[],
    shipSprite:null,
    lighting:null,
    text:null,
    messages:[],
    skipText:null,
    reticle:null,
    messageIndex:0.0,
    messageSelected:0,
    parts:[], //particles
    recycledParts:[], //recycled particles
    partsTime:0,
    partsSpawn:0,
    moveTime:0,
    
    BG_SPEED:300,
    SHIP_X:228,
    SHIP_SPEED:-16,
    MESSAGE_SPEED:45, //65
    SELECT_NEXT_MESSAGE_DURATION:12.0,
    SPRITE_SCALE:.5,
    
    EX_X:-8,
    EX_WIDTH:16,
    EX_Y:60,
    EX_SPEED:50,
    EX_LANDING_SPEED:50,
    EX_ACCEL:150,
    EX_MAX_ANGLE:40 *Math.PI/180,
    EX_PERIOD:.01,
    EX_DURATION:.5,
    EX_SPRITE_KEYS:["ship_ex_1", "ship_ex_2"],
    exTime:0,
    exCache:[], //recycles exhaust particles
    
    blackScreen:null,
    blackScreenFadeTime:0,
    blackScreenFadeIn:false,
    BLACK_SCREEN_FADE_DURATION:.5,
    beginGameAfterFadeToBlack:false,
    
    preload: function () {
        
    },
    
    create: function () {
        
        //bgs and fgs
        var bgKey = "space1";
        for (var i=0; i<2; i++){
            this.bgs.push(game.add.image(0, 0, bgKey));
        }
        
        //ship sprite
        this.shipSprite = game.add.sprite(this.SHIP_X, 550, "spaceship_repaired", undefined);
        this.shipSprite.animations.add("idle", [0], 20, true);
        this.shipSprite.animations.play("idle");
        this.shipSprite.anchor.setTo(.5, .5); //sprite is centered
        this.shipSprite.scale.set(this.SPRITE_SCALE, this.SPRITE_SCALE);
        
        //lighting
        this.lighting = game.add.image(0, 0, "endscene_lighting");
        
        //text
        var index = FullGame.Messages.textFile.indexOf("%ending1%");
        var left = FullGame.Messages.textFile.indexOf('[', index);
        var right = FullGame.Messages.textFile.indexOf(']', left);
        this.messages.push(FullGame.Messages.textFile.substring(left+1, right));
        index = FullGame.Messages.textFile.indexOf("%ending2%");
        left = FullGame.Messages.textFile.indexOf('[', index);
        right = FullGame.Messages.textFile.indexOf(']', left);
        this.messages.push(FullGame.Messages.textFile.substring(left+1, right));
        index = FullGame.Messages.textFile.indexOf("%ending3%");
        left = FullGame.Messages.textFile.indexOf('[', index);
        right = FullGame.Messages.textFile.indexOf(']', left);
        this.messages.push(FullGame.Messages.textFile.substring(left+1, right));
        for (var i=0; i<this.messages.length; i++){
            this.messages[i] = this.messages[i].replace("\r\n", "\n");
        }
        
        this.text = game.add.text(
                450,
                50,
                this.messages[0],
                { font: "22px Lucida Console", fill: "#FEFEFE" });
        this.text.lineSpacing = 7;
        this.messageIndex = 0;
        this.messageSelected = 0;
        
        this.skipText = game.add.text(
                780,
                520,
                "(press S or ↓ to advance)",
                { font: "14px Lucida Console", fill: "#BBBBBB" });
        this.skipText.alpha = 0;
        
        //reticle
        this.reticle = game.add.sprite(0, 0, "reticle_red", 0);
        this.reticle.anchor.setTo(.5, .5);
        this.reticle.scale.set(.5, .5);
        
        //blackScreen
        this.blackScreen = game.add.graphics(0, 0);
        this.blackScreen.beginFill(0x000000, 1);
        this.blackScreen.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this.blackScreen.endFill();
        this.blackScreen.visible = false;
        this.blackScreenFadeTime = 0;
        this.blackScreenFadeIn = false;
        this.fadeIn();
        FullGame.playMusic("level_blue", .5);
        
    },
    
    update: function() {
        FullGame.Keys.refresh();
        
        var dt = game.time.physicsElapsed;
        
        //move reticle
        this.reticle.x = FullGame.Keys.mouseX;
        this.reticle.y = FullGame.Keys.mouseY;
        
        //animate bg
        var bg = this.bgs[this.bgs.length-1];
        bg.y += this.BG_SPEED * dt;
        for (i=this.bgs.length-2; i>=0; i--){
            this.bgs[i].y = this.bgs[i+1].y - bg.height + 1;
        }
        if (bg.y > bg.height){
            this.bgs.splice(this.bgs.length-1, 1);
            bg.y = this.bgs[0].y - bg.height + 1;
            this.bgs.unshift(bg);
        }
        
        //animate ship
        this.moveTime += dt;
        this.shipSprite.y += this.SHIP_SPEED * dt;
        
        if (this.moveTime < 6.0){
            this.exTime += dt;
            while (this.exTime > this.EX_PERIOD){
                this.exTime -= this.EX_PERIOD;
                this.spawnEx(1);
            }
        }
        
        
        //text
        this.messageIndex += this.MESSAGE_SPEED * dt;
        if (FullGame.Keys.downPressed){ //can advance through messages
            if (this.messageIndex < this.messages[this.messageSelected].length){
                this.messageIndex = this.messages[this.messageSelected].length;
            } else {
                this.messageIndex = this.SELECT_NEXT_MESSAGE_DURATION*this.MESSAGE_SPEED+1;
            }
        }
        this.text.text = this.messages[this.messageSelected].substring(0, Math.floor(this.messageIndex));
        if (this.messageIndex/this.MESSAGE_SPEED > this.SELECT_NEXT_MESSAGE_DURATION){
            if (this.messageSelected >= this.messages.length-1){
                //start game
                if (!this.blackScreen.visible){
                    this.fadeOut();
                    this.beginGameAfterFadeToBlack = true;
                }
            } else {
                this.messageIndex = 0;
                this.messageSelected++;
            }
        }
        
        this.skipText.alpha = Math.min(1, Math.max(0, (this.moveTime - 3) * .4));
        
        //blackscreen fading
        if (this.blackScreenFadeTime < this.BLACK_SCREEN_FADE_DURATION){
            this.blackScreenFadeTime = Math.min(this.BLACK_SCREEN_FADE_DURATION, this.blackScreenFadeTime + dt);
            this.blackScreen.visible = true;
            if (this.blackScreenFadeIn){
                this.blackScreen.alpha = this.blackScreenFadeTime / this.BLACK_SCREEN_FADE_DURATION;
                if (this.blackScreen.alpha > .9999){
                    if (this.beginGameAfterFadeToBlack){
                        this.state.start("Credits");
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
        for (var i=0; i<this.parts.length; i++){
            this.parts[i].visible = false;
        }
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
                ex = game.add.image(x, y, this.EX_SPRITE_KEYS[Math.floor(this.EX_SPRITE_KEYS.length*Math.random())], undefined);
                ex.anchor.setTo(.5, .5);
                ex.scale.set(this.SPRITE_SCALE, this.SPRITE_SCALE);
                ex.shipSprite = this;
                ex.update = function() {
                    var dt = game.time.physicsElapsed;
                    this.speed += this.accel * dt;
                    this.x += this.c * this.speed * dt;
                    this.y += this.s * this.speed * dt;
                    this.t += dt;
                    this.alpha = Math.min(1, 1 - this.t / this.duration);
                    if (this.t > this.duration){
                        this.visible = false;
                        this.shipSprite.exCache.push(this);
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
            if (this.landing){
                ex.speed = this.EX_LANDING_SPEED;
            }
            ex.accel = this.EX_ACCEL;
            ex.t = 0;
            ex.duration = this.EX_DURATION;
            ex.alpha = 1;
            ex.parent.setChildIndex(ex, this.shipSprite.parent.getChildIndex(this.shipSprite)-1);
            //ex.bringToTop();
            
        }
    },
    
    
    shutdown: function () {
        //destroy stuff
        this.bgs.splice(0, this.bgs.length);
        this.parts.splice(0, this.parts.length);
        this.recycledParts.splice(0, this.recycledParts.length);
        this.shipSprite.destroy();
        this.shipSprite = null;
        this.lighting.destroy();
        this.lighting = null;
        this.blackScreen.destroy();
        this.blackScreen = null;
        this.messages.splice(0, this.messages.length);
        
        this.messageIndex = 0;
        this.messageSelected = 0;
        this.partsTime = 0;
        this.partsSpawn = 0;
        this.moveTime = 0;
        this.exTime = 0;
        this.exCache.splice(0, this.exCache.length);
    },
    

};