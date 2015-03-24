FullGame.Title = function (game) {
    
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

FullGame.Title.prototype = {
    TEXT_X:800,
    TEXT_BOTTOM_Y:480,
    TEXT_H:35,
    HIT_AREA:{x:-5, y:-5, width:200, height:35},
    bg:null,
    fg:null,
    bgDust1:[], //array of tiled images
    bgDust2:[], //array of tiled images
    text:null, //holds Text objects as options
    reticle:null,
    playerSprite:null,
    PLAYER_X:250,
    PLAYER_Y:447,
    textSelected:null,
    prevTextSelected:null,
    blackScreen:null,
    blackScreenFadeTime:0,
    blackScreenFadeIn:false,
    BLACK_SCREEN_FADE_DURATION:.9,
    saveWarningBlackScreen:null,
    //jumpingAnimation:{active:false, t:0.0, vx:0.0, vy:0.0, ACCEL_X:0, SPEED_X:300, JUMP_V:-500, GRAVITY:1800, JUMP_DUR:.16},
    jumpingAnimation:{active:false, t:0.0, vx:0.0, vy:0.0, ACCEL_X:7000, SPEED_X:160, JUMP_V:-300, GRAVITY:800, JUMP_DUR:.20},
    beginGameAfterFadeToBlack:false,
    
    preload: function () {
        
    },
    
    create: function () {
        
        //load data (comment this line to simulate starting game for the first time)
        FullGame.Vars.loadData();
        
        
        //creating reticle
        var reticleSpriteKey = "";
        var playerKey = "";
        switch (FullGame.Vars.playerLaserColor){
        case FullGame.Til.BLUE:
            reticleSpriteKey = "reticle_blue";
            playerKey = "player_blue";
            break;
        case FullGame.Til.RED:
        default:
            reticleSpriteKey = "reticle_red";
            playerKey = "player_red";
            break;
        }
        this.reticle = game.add.sprite(0, 0, reticleSpriteKey, 0);
        this.reticle.anchor.setTo(.5, .5);
        this.reticle.scale.set(.5, .5);
        
        //setting up background animatons
        var bgKey = "space1";
        var dustKey1 = "dust_red1";
        var dustKey2 = "dust_red2";
        this.bg = game.add.image(0, 0, bgKey);
        this.bgDust1.push(game.add.image(0, 0, dustKey1));
        this.bgDust1.push(game.add.image(0, 0, dustKey1));
        this.fg = game.add.image(0, 0, "title_fg");
        this.playerSprite = game.add.sprite(this.PLAYER_X, this.PLAYER_Y, playerKey, undefined);
        this.playerSprite.animations.add("idle", [0], 30, true);
        this.playerSprite.animations.add("rising", [17, 18, 19, 20, 21], 20, false);
        this.playerSprite.animations.add("falling", [22, 23, 24, 25, 26], 20, false);
        this.playerSprite.animations.play("idle");
        this.playerSprite.anchor.setTo(.5, .5); //sprite is centered
        this.playerSprite.scale.set(.5, .5);
        this.bgDust2.push(game.add.image(0, 0, dustKey2));
        this.bgDust2.push(game.add.image(0, 0, dustKey2));
        
        //setting up text options
        var continueOption = FullGame.Vars.saveCreated;
        var creditsOption = false;
        var closeGameOption = false;
        this.text = {};
        var textA = [];
        if (continueOption){
            this.text.continueT = game.add.text(
                this.TEXT_X,
                0,
                "CONTINUE",
                { font: "24px Verdana", fill: FullGame.Menus.UNSELECTED_COLOR });
            textA.push(this.text.continueT);
        }
        this.text.newGameT = game.add.text(
            this.TEXT_X,
            0,
            "NEW GAME",
            { font: "24px Verdana", fill: FullGame.Menus.UNSELECTED_COLOR });
        textA.push(this.text.newGameT);
        /*this.text.howToPlayT = game.add.text(
            this.TEXT_X,
            0,
            "HOW TO PLAY",
            { font: "24px Verdana", fill: FullGame.Menus.UNSELECTED_COLOR });
        textA.push(this.text.howToPlayT);*/
        if (creditsOption){
            this.text.creditsT = game.add.text(
                this.TEXT_X,
                0,
                "CREDITS",
                { font: "24px Verdana", fill: FullGame.Menus.UNSELECTED_COLOR });
            textA.push(this.text.creditsT);
        }
        this.text.optionsT = game.add.text(
            this.TEXT_X,
            0,
            "OPTIONS",
            { font: "24px Verdana", fill: FullGame.Menus.UNSELECTED_COLOR });
        textA.push(this.text.optionsT);
        if (closeGameOption){
            this.text.closeGameT = game.add.text(
                this.TEXT_X,
                0,
                "CLOSE GAME",
                { font: "24px Verdana", fill: FullGame.Menus.UNSELECTED_COLOR });
            textA.push(this.text.closeGameT);
        }
        for (var i=0; i<textA.length; i++){
            textA[i].y = this.TEXT_BOTTOM_Y - this.TEXT_H * (textA.length-1 - i);
        }
        
        this.saveWarningBlackScreen = game.add.graphics(0, 0);
        this.saveWarningBlackScreen.beginFill(0x000000, .9);
        this.saveWarningBlackScreen.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this.saveWarningBlackScreen.endFill();
        this.saveWarningBlackScreen.visible = false;
        this.text.saveWarningT = game.add.text(
            100,
            150,
            "Save warning\nContinue?",
            { font: "22px Verdana", fill: FullGame.Menus.SELECTED_COLOR });
        this.text.saveWarningT.align = "center";
        this.text.saveWarningT.visible = false;
        this.text.saveWarningNoT = game.add.text(
            450,
            350,
            "NO",
            { font: "24px Verdana", fill: FullGame.Menus.UNSELECTED_COLOR });
        this.text.saveWarningNoT.visible = false;
        this.text.saveWarningYesT = game.add.text(
            450,
            350+this.TEXT_H,
            "YES",
            { font: "24px Verdana", fill: FullGame.Menus.UNSELECTED_COLOR });
        this.text.saveWarningYesT.visible = false;
        
        this.text.toggleFullscreenT = game.add.text(
            FullGame.Menus.X,
            FullGame.Menus.Y,
            "TOGGLE FULLSCREEN",
            { font: "24px Verdana", fill: FullGame.Menus.UNSELECTED_COLOR });
        this.text.toggleFullscreenT.visible = false;
        this.text.toggleSFXT = game.add.text(
            FullGame.Menus.X,
            FullGame.Menus.Y + FullGame.Menus.H,
            "MUTE SFX",
            { font: "24px Verdana", fill: FullGame.Menus.UNSELECTED_COLOR });
        this.text.toggleSFXT.visible = false;
        this.text.toggleMusicT = game.add.text(
            FullGame.Menus.X,
            FullGame.Menus.Y + FullGame.Menus.H*2,
            "MUTE MUSIC",
            { font: "24px Verdana", fill: FullGame.Menus.UNSELECTED_COLOR });
        this.text.toggleMusicT.visible = false;
        this.text.backFromOptionsT = game.add.text(
            FullGame.Menus.X,
            FullGame.Menus.Y + FullGame.Menus.H*3,
            "BACK",
            { font: "24px Verdana", fill: FullGame.Menus.UNSELECTED_COLOR });
        this.text.backFromOptionsT.visible = false;
        
        
        this.reticle.bringToTop();
        
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
        
        //moving bg dust
        var dust1Speed = -200;//-110;
        var dust2Speed = -70;//-50;
        var dust = this.bgDust1[0];
        var w = dust.width;
        dust.x += dust1Speed * dt;
        for (var i=1; i<this.bgDust1.length; i++){
            this.bgDust1[i].x = this.bgDust1[i-1].x + w;
        }
        if (dust.x+w < 0){
            this.bgDust1.shift();
            dust.x = this.bgDust1[this.bgDust1.length-1].x + w;
            this.bgDust1.push(dust);
        }
        dust = this.bgDust2[0];
        w = dust.width;
        dust.x += dust2Speed * dt;
        for (var i=1; i<this.bgDust2.length; i++){
            this.bgDust2[i].x = this.bgDust2[i-1].x + w;
        }
        if (dust.x+w < 0){
            this.bgDust2.shift();
            dust.x = this.bgDust2[this.bgDust2.length-1].x + w;
            this.bgDust2.push(dust);
        }
        
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
        
        //jumping animation
        if (this.jumpingAnimation.active){
            this.jumpingAnimation.t += dt;
            if (this.jumpingAnimation.t < this.jumpingAnimation.JUMP_DUR){
                this.jumpingAnimation.vy = this.jumpingAnimation.JUMP_V;
            }
            this.jumpingAnimation.vx += this.jumpingAnimation.ACCEL_X*dt;
            this.jumpingAnimation.vx = Math.min(this.jumpingAnimation.vx, this.jumpingAnimation.SPEED_X);
            var prevVY = this.jumpingAnimation.vy;
            this.jumpingAnimation.vy += this.jumpingAnimation.GRAVITY*dt;
            this.playerSprite.x += this.jumpingAnimation.vx*dt;
            this.playerSprite.y += this.jumpingAnimation.vy*dt;
            if (prevVY < 0 && this.jumpingAnimation.vy >= 0){
                this.playerSprite.animations.play("falling");
            }
            if (this.playerSprite.y > SCREEN_HEIGHT+60){
                this.jumpingAnimation.active = false;
                //begin game after fading to black
                this.blackScreenFadeTime = 0;
                this.blackScreenFadeIn = true;
                this.beginGameAfterFadeToBlack = true;
            }
        }
        
        
        //cursor selecting other text
        var cursor = this.reticle;
        cursor.x = FullGame.Keys.mouseX;
        cursor.y = FullGame.Keys.mouseY;
        this.textSelected = null;
        if (!this.beginGameAfterFadeToBlack){
            for (var key in this.text) {
                var txt = this.text[key];
                if (!txt.visible) continue;
                if (txt == this.text.saveWarningT) continue;
                if (this.saveWarningBlackScreen.visible && cursor.x > this.TEXT_X+this.HIT_AREA.x-5) continue;
                if (txt.x+this.HIT_AREA.x <= cursor.x &&
                    cursor.x <= txt.x+this.HIT_AREA.x+this.HIT_AREA.width &&
                    txt.y+this.HIT_AREA.y <= cursor.y &&
                    cursor.y <= txt.y+this.HIT_AREA.y+this.HIT_AREA.height){
                    this.textSelected = txt;
                }
            }
        }
        if (this.textSelected != this.prevTextSelected){
            if (this.prevTextSelected != null){
                this.prevTextSelected.clearColors();
                this.prevTextSelected.addColor(FullGame.Menus.UNSELECTED_COLOR, 0);
            }
            if (this.textSelected != null){
                this.textSelected.clearColors();
                this.textSelected.addColor(FullGame.Menus.SELECTED_COLOR, 0);
            }
            this.prevTextSelected = this.textSelected;
        }


        if (FullGame.Keys.lmbPressed && this.textSelected != null &&
            this.textSelected.visible){
            
            if (this.textSelected == this.text.continueT){
                
                //begin game after fading to black
                this.blackScreenFadeTime = 0;
                this.blackScreenFadeIn = true;
                FullGame.playSFX("colorchip");
                this.beginGameAfterFadeToBlack = true;
                
            } else if (this.textSelected == this.text.newGameT){
                //new game pressed
                
                if (FullGame.Vars.saveCreated){
                    this.text.saveWarningT.visible = true;
                    this.text.saveWarningT.text =
                        "Starting a new game will delete your previous save file.\nBegin new game?";
                    this.text.saveWarningT.x = 185;
                    this.text.saveWarningNoT.text = "NO";
                    this.text.saveWarningNoT.visible = true;
                    this.text.saveWarningNoT.x = 475;
                    this.text.saveWarningYesT.text = "YES";
                    this.text.saveWarningYesT.visible = true;
                    this.text.saveWarningYesT.x = this.text.saveWarningNoT.x;
                } else {
                    this.text.saveWarningT.visible = true;
                    this.text.saveWarningT.text =
                        "This game uses an automatic save system.\n\n" +
                        "Save data is stored in your browser's local cache.  Note that if your\n" +
                        " browser cache is cleared, your save data will be lost.";
                    this.text.saveWarningT.x = 139;
                    this.text.saveWarningYesT.text = "CONTINUE";
                    this.text.saveWarningYesT.visible = true;
                    this.text.saveWarningYesT.x = 450;
                    
                }
                
                this.saveWarningBlackScreen.visible = true;
                
            } else if (this.textSelected == this.text.optionsT){
                
                this.saveWarningBlackScreen.visible = true;
                this.text.toggleSFXT.visible = true;
                if (FullGame.Vars.sfxMuted){
                    this.text.toggleSFXT.text = "UNMUTE SFX";
                } else {
                    this.text.toggleSFXT.text = "MUTE SFX";
                }
                this.text.toggleMusicT.visible = true;
                if (FullGame.Vars.musicMuted){
                    this.text.toggleMusicT.text = "UNMUTE MUSIC";
                } else {
                    this.text.toggleMusicT.text = "MUTE MUSIC";
                }
                this.text.backFromOptionsT.visible = true;
                
            } else if (this.textSelected == this.text.saveWarningNoT){
                
                //go back
                this.saveWarningBlackScreen.visible = false;
                this.text.saveWarningT.visible = false;
                this.text.saveWarningNoT.visible = false;
                this.text.saveWarningYesT.visible = false;
                
            } else if (this.textSelected == this.text.saveWarningYesT){
                //begin new game
                
                this.saveWarningBlackScreen.visible = false;
                this.text.saveWarningT.visible = false;
                this.text.saveWarningNoT.visible = false;
                this.text.saveWarningYesT.visible = false;
                
                //start jumping animation
                this.jumpingAnimation.active = true;
                this.jumpingAnimation.t = 0;
                this.jumpingAnimation.vy = this.jumpingAnimation.JUMP_V;
                this.playerSprite.animations.play("rising");
                FullGame.playSFX("jump");
                FullGame.playSFX("colorchip");
                this.beginGameAfterFadeToBlack = true;
                
                //delete save
                FullGame.Vars.fillDefaultValues();
                
                //trick to get to a future level
                if (false && FullGame.Keys.downHeld){
                    FullGame.Vars.lastMap = "split";
                    FullGame.Vars.startMap = "firstRoplate";
                }
                
                
            } else if (FullGame.Menus.textSelected == this.text.toggleFullscreenT){
                
                toggleFullscreen();
                
            } else if (this.textSelected == this.text.toggleSFXT){

                if (FullGame.Vars.sfxMuted){
                    FullGame.Vars.sfxMuted = false;
                    this.text.toggleSFXT.text = "MUTE SFX";
                } else {
                    FullGame.Vars.sfxMuted = true;
                    this.text.toggleSFXT.text = "UNMUTE SFX";
                }
                
            } else if (this.textSelected == this.text.toggleMusicT){

                if (FullGame.Vars.musicMuted){
                    FullGame.Vars.musicMuted = false;
                    this.text.toggleMusicT.text = "MUTE MUSIC";
                } else {
                    FullGame.Vars.musicMuted = true;
                    this.text.toggleMusicT.text = "UNMUTE MUSIC";
                }
                
            } else if (this.textSelected == this.text.backFromOptionsT){
                
                var txt = this.text;
                txt.toggleFullscreenT.visible = false;
                txt.toggleSFXT.visible = false;
                txt.toggleMusicT.visible = false;
                txt.backFromOptionsT.visible = false;
                this.saveWarningBlackScreen.visible = false;

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
        this.bg = null;
        this.fg = null;
        this.bgDust1.splice(0, this.bgDust1.length);
        this.bgDust2.splice(0, this.bgDust2.length);
        this.reticle = null;
        this.playerSprite = null;
        for (txt in this.text){
            delete this.text[txt];
        }
        this.textSelected = null;
        this.prevTextSelected = null;
        this.blackScreen = null;
        this.saveWarningBlackScreen = null;
        this.beginGameAfterFadeToBlack = false;
        
    },
    
    startGame: function(startMap, lastMap) {
        FullGame.Vars.startMap = startMap;
        FullGame.Vars.lastMap = lastMap;
        this.state.start(FullGame.Vars.startMap);
    },
    

};