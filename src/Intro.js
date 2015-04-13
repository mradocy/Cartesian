FullGame.Intro = function (game) {
    
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

FullGame.Intro.prototype = {
    
    bgs:[],
    fgs:[],
    playerSprite:null,
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
    
    FG_SPEED:-700,
    BG_SPEED_MULTIPLIER:.7,
    PLAYER_X:736-10,
    PLAYER_SPEED:30,
    MESSAGE_SPEED:65,
    SELECT_NEXT_MESSAGE_DURATION:10.0,
    playerRotateTime:0,
    
    blackScreen:null,
    blackScreenFadeTime:0,
    blackScreenFadeIn:false,
    BLACK_SCREEN_FADE_DURATION:.5,
    beginGameAfterFadeToBlack:false,
    
    preload: function () {
        
    },
    
    create: function () {
        
        //bgs and fgs
        var bgKey = "intro_bg";
        var fgKey = "intro_fg";
        for (var i=0; i<2; i++){
            this.bgs.push(game.add.image(0, 0, bgKey));
        }
        for (var i=0; i<2; i++){
            this.fgs.push(game.add.image(-10, 0, fgKey));
        }
        
        //player sprite
        this.playerSprite = game.add.sprite(this.PLAYER_X, -50, "player_red", undefined);
        this.playerSprite.animations.add("falling", [26], 20, true);
        this.playerSprite.animations.play("falling");
        this.playerSprite.anchor.setTo(.5, .5); //sprite is centered
        this.playerSprite.scale.set(.5, .5);
        
        //lighting
        this.lighting = game.add.image(0, 0, "intro_lighting");
        
        //text
        var index = FullGame.Messages.textFile.indexOf("%intro1%");
        var left = FullGame.Messages.textFile.indexOf('[', index);
        var right = FullGame.Messages.textFile.indexOf(']', left);
        this.messages.push(FullGame.Messages.textFile.substring(left+1, right));
        index = FullGame.Messages.textFile.indexOf("%intro2%");
        left = FullGame.Messages.textFile.indexOf('[', index);
        right = FullGame.Messages.textFile.indexOf(']', left);
        this.messages.push(FullGame.Messages.textFile.substring(left+1, right));
        for (var i=0; i<this.messages.length; i++){
            this.messages[i] = this.messages[i].replace("\r\n", "\n");
        }
        
        this.text = game.add.text(
                50,
                50,
                this.messages[0],
                { font: "22px Lucida Console", fill: "#FEFEFE" });
        this.text.lineSpacing = 7;
        this.messageIndex = 0;
        this.messageSelected = 0;
        
        this.skipText = game.add.text(
                50,
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
        
    },
    
    update: function() {
        FullGame.Keys.refresh();
        
        var dt = game.time.physicsElapsed;
        
        //move reticle
        this.reticle.x = FullGame.Keys.mouseX;
        this.reticle.y = FullGame.Keys.mouseY;
        
        //animate bg and fg
        var fg = this.fgs[0];
        fg.y += this.FG_SPEED * dt;
        for (var i=1; i<this.fgs.length; i++){
            this.fgs[i].y = this.fgs[i-1].y + fg.height - 1;
        }
        if (fg.y < -fg.height){
            this.fgs.splice(0, 1);
            fg.y = this.fgs[this.fgs.length-1].y + fg.height - 1;
            this.fgs.push(fg);
        }
        var bg = this.bgs[0];
        bg.y += this.FG_SPEED * this.BG_SPEED_MULTIPLIER * dt;
        for (i=1; i<this.bgs.length; i++){
            this.bgs[i].y = this.bgs[i-1].y + bg.height - 1;
        }
        if (bg.y < -bg.height){
            this.bgs.splice(0, 1);
            bg.y = this.bgs[this.bgs.length-1].y + bg.height - 1;
            this.bgs.push(bg);
        }
        
        //animate player
        this.playerSprite.y += this.PLAYER_SPEED * dt;
        this.playerRotateTime += dt;
        this.playerSprite.rotation = .15 * Math.cos(1.2 * this.playerRotateTime);
        this.playerSprite.x = this.PLAYER_X + 10 * Math.cos(1.0 * this.playerRotateTime);
        
        //make particles
        this.partsTime += dt;
        if (this.partsTime >= this.partsSpawn && !this.beginGameAfterFadeToBlack){
            
            //make part
            var part = null;
            var key = "sand_parts";
            if (this.recycledParts.length > 0){
                part = this.recycledParts.pop();
                part.visible = true;
            } else {
                part = game.add.sprite(0, 0, key, undefined);
                part.anchor.setTo(.5, .5); //sprite is centered
            }
            part.animations.frame = Math.floor(Math.random()*5);
            part.rotation = Math.PI*2 * Math.random();
            part.x = 576-10 + 320*Math.random();
            part.y = -10;
            part.vy = 100;
            part.ay = 70;
            part.vx = 0;
            part.ax = 0;
            part.vr = Math.random() * 4;
            this.parts.push(part);
            
            this.partsTime = 0;
            this.partsSpawn = (.1 + Math.random()) * .5;
        }
        
        //move particles
        for (var i=0; i<this.parts.length; i++){
            var part = this.parts[i];
            
            part.vx += part.ax * dt;
            part.vy += part.ay * dt;
            part.x += part.vx * dt;
            part.y += part.vy * dt;
            part.rotation += part.vr * dt;
            
            if (part.y > SCREEN_HEIGHT){
                part.visible = false;
                this.recycledParts.push(part);
                this.parts.splice(i, 1);
                i--;
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
        
        this.skipText.alpha = Math.min(1, Math.max(0, (this.playerRotateTime - 3) * .4));
        
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
        for (var i=0; i<this.parts.length; i++){
            this.parts[i].visible = false;
        }
    },
    
    shutdown: function () {
        //destroy stuff
        this.fgs.splice(0, this.fgs.length);
        this.bgs.splice(0, this.bgs.length);
        this.parts.splice(0, this.parts.length);
        this.recycledParts.splice(0, this.recycledParts.length);
        this.playerSprite.destroy();
        this.playerSprite = null;
        this.lighting.destroy();
        this.lighting = null;
        this.blackScreen.destroy();
        this.blackScreen = null;
        this.messages.splice(0, this.messages.length);
    },
    

};