FullGame.Credits = function (game) {
    
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

FullGame.Credits.prototype = {
    
    bg:null,
    textStr:"",
    text:null,
    logo:null,
    betashark:null,
    reticle:null,
    moveTime:0,
    lastPause:false,
    lastPauseTime:0,
    
    SCROLL_SPEED:-65,
    SCROLL_FAST_SPEED:-300,
    
    blackScreen:null,
    blackScreenFadeTime:0,
    blackScreenFadeIn:false,
    BLACK_SCREEN_FADE_DURATION:1.0,
    beginGameAfterFadeToBlack:false,
    
    preload: function () {
        
    },
    
    create: function () {
        
        //bg
        var bgKey = "credits_bg";
        this.bg = game.add.image(0, 0, bgKey);
        
        //logo
        this.logo = game.add.image(0, 0, "credits_logo");
        this.logo.anchor.setTo(.5, .5); //sprite is centered
        this.logo.scale.set(.4, .4);
        this.logo.x = 512;
        this.logo.y = 610;
        this.betashark = game.add.image(0, 0, "betashark");
        this.betashark.anchor.setTo(.5, .5); //sprite is centered
        this.betashark.scale.set(1.0, 1.0);
        this.betashark.x = 512;
        this.betashark.y = 2550;
        
        //text
        var index = FullGame.Messages.textFile.indexOf("%credits%");
        var left = FullGame.Messages.textFile.indexOf('[', index);
        var right = FullGame.Messages.textFile.indexOf(']', left);
        this.textStr = FullGame.Messages.textFile.substring(left+1, right);
        this.textStr.replace("\r\n", "\n");
        
        this.text = game.add.text(
                120,
                700,
                this.textStr,
                { font: "22px Lucida Console", fill: "#FEFEFE" });
        this.text.lineSpacing = 7;
        this.text.align = "center";
        
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
        //FullGame.playMusic("level_blue", .5); (done in EndScene instead)
        
    },
    
    update: function() {
        FullGame.Keys.refresh();
        
        var dt = game.time.physicsElapsed;
        
        var scrollDist = 0;
        if (FullGame.Keys.downHeld){
            scrollDist = this.SCROLL_FAST_SPEED * dt;
        } else {
            scrollDist = this.SCROLL_SPEED * dt;
        }
        if (this.lastPause){
            scrollDist = 0;
            this.lastPauseTime += dt;
        }
        
        //move reticle
        this.reticle.x = FullGame.Keys.mouseX;
        this.reticle.y = FullGame.Keys.mouseY;
        
        //move text
        this.logo.y += scrollDist;
        this.betashark.y += scrollDist;
        this.text.y += scrollDist;
        
        //detect end
        if (this.betashark.y < 300){
            this.lastPause = true;
        }
        if (this.lastPauseTime > 5.0 && !this.blackScreen.visible){
            this.fadeOut();
            this.beginGameAfterFadeToBlack = true;
            FullGame.fadeOutMusic(1.0);
        }
        
        //blackscreen fading
        if (this.blackScreenFadeTime < this.BLACK_SCREEN_FADE_DURATION){
            this.blackScreenFadeTime = Math.min(this.BLACK_SCREEN_FADE_DURATION, this.blackScreenFadeTime + dt);
            this.blackScreen.visible = true;
            if (this.blackScreenFadeIn){
                this.blackScreen.alpha = this.blackScreenFadeTime / this.BLACK_SCREEN_FADE_DURATION;
                if (this.blackScreen.alpha > .9999){
                    if (this.beginGameAfterFadeToBlack){
                        this.state.start("Title");
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
    
    
    shutdown: function () {
        //destroy stuff
        //this.lighting.destroy();
        //this.lighting = null;
        this.blackScreen.destroy();
        this.blackScreen = null;
        
        this.moveTime = 0;
        this.lastPause = false;
        this.lastPauseTime = 0;
    },
    

};