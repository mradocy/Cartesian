//catch-all for the game's menus
FullGame.Menus = {};

FullGame.Menus.bg = null;
FullGame.Menus.text = null;
FullGame.Menus.cursor = null;
FullGame.Menus.textSelected = null;
FullGame.Menus.prevTextSelected = null;
FullGame.Menus.X = 400;
FullGame.Menus.Y = 200;
FullGame.Menus.H = 35;
FullGame.Menus.HIT_AREA = {x:0, y:0, width:0, height:0};
FullGame.Menus.SELECTED_COLOR = "#FEFEFE";
FullGame.Menus.UNSELECTED_COLOR = "#BBBBBB";
FullGame.Menus.levelSelectScreen = false;
FullGame.Menus.levelSelectMenu = null;
FullGame.Menus.musicWasMuted = false;

//clears the currently displayed menu
FullGame.Menus.clearMenu = function() {
    if (this.cursor != null){
        FullGame.GI.hudGroup.remove(this.cursor);
        this.cursor = null;
    }
    if (this.text != null){
        for (var key in this.text) {
            FullGame.GI.hudGroup.remove(this.text[key]);
        }
        this.text = null;
    }
    this.textSelected = null;
    this.prevTextSelected = null;
    if (this.bg != null){
        FullGame.GI.hudGroup.remove(this.bg);
        this.bg = null;
    }
};

//brings up a pause menu.
//called by the player when the pause button is pressed
FullGame.Menus.pauseMenu = function() {
    if (game.paused) return;
    game.paused = true;
    
    //background
    this.bg = game.add.graphics(0, 0, FullGame.GI.hudGroup);
    var bg = this.bg;
    bg.beginFill(0x000000, .9);
    bg.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    bg.endFill();
    
    this.musicWasMuted = FullGame.Vars.musicMuted;
    
    //text
    /*this.X = 400;
    this.Y = 200;
    this.H = 35;*/
    this.HIT_AREA.x = -5;
    this.HIT_AREA.y = -5;
    this.HIT_AREA.width = 200;
    this.HIT_AREA.height = this.H;
    this.howToPlayImage = null;
    this.text = {};
    var txt = this.text;
    txt.continueT = game.add.text(
        this.X,
        this.Y,
        "CONTINUE",
        { font: "24px Verdana", fill: this.UNSELECTED_COLOR },
        FullGame.GI.hudGroup);
    /*txt.levelSelectT = game.add.text(
        this.X,
        this.Y + this.H,
        "LEVEL SELECT",
        { font: "24px Verdana", fill: this.UNSELECTED_COLOR },
        FullGame.GI.hudGroup);*/
    txt.optionsT = game.add.text(
        this.X,
        this.Y + this.H*1,
        "OPTIONS",
        { font: "24px Verdana", fill: this.UNSELECTED_COLOR },
        FullGame.GI.hudGroup);
    txt.howToPlayT = game.add.text(
        this.X,
        this.Y + this.H*2,
        "HOW TO PLAY",
        { font: "24px Verdana", fill: this.UNSELECTED_COLOR },
        FullGame.GI.hudGroup);
    txt.quitT = game.add.text(
        this.X,
        this.Y + this.H*3,
        "QUIT",
        { font: "24px Verdana", fill: this.UNSELECTED_COLOR },
        FullGame.GI.hudGroup);
    this.textSelected = txt.continueT;
    
    //instructions on how to toggle fullscreen
    txt.fullscreenInstructionsT = game.add.text(
        380,
        450,
        "(Press F10 to toggle fullscreen modes)",
        { font: "14px Verdana", fill: this.UNSELECTED_COLOR },
        FullGame.GI.hudGroup);
    
    //other text that won't be immediately visible
    txt.toggleFullscreenT = game.add.text(
        this.X,
        this.Y,
        "TOGGLE FULLSCREEN",
        { font: "24px Verdana", fill: this.UNSELECTED_COLOR },
        FullGame.GI.hudGroup);
    txt.toggleFullscreenT.visible = false;
    txt.toggleSFXT = game.add.text(
        this.X,
        this.Y + this.H,
        "MUTE SFX",
        { font: "24px Verdana", fill: this.UNSELECTED_COLOR },
        FullGame.GI.hudGroup);
    txt.toggleSFXT.visible = false;
    txt.toggleMusicT = game.add.text(
        this.X,
        this.Y + this.H*2,
        "MUTE MUSIC",
        { font: "24px Verdana", fill: this.UNSELECTED_COLOR },
        FullGame.GI.hudGroup);
    txt.toggleMusicT.visible = false;
    txt.backFromOptionsT = game.add.text(
        this.X,
        this.Y + this.H*3,
        "BACK",
        { font: "24px Verdana", fill: this.UNSELECTED_COLOR },
        FullGame.GI.hudGroup);
    txt.backFromOptionsT.visible = false;
    
    txt.quitSureT = game.add.text(
        this.X,
        this.Y,
        "QUIT THE GAME?",
        { font: "24px Verdana", fill: this.SELECTED_COLOR },
        FullGame.GI.hudGroup);
    txt.quitSureT.visible = false;
    txt.quitNoT = game.add.text(
        this.X,
        this.Y + this.H*3,
        "NO",
        { font: "24px Verdana", fill: this.UNSELECTED_COLOR },
        FullGame.GI.hudGroup);
    txt.quitNoT.visible = false;
    txt.quitYesT = game.add.text(
        this.X,
        this.Y + this.H*2,
        "YES",
        { font: "24px Verdana", fill: this.UNSELECTED_COLOR },
        FullGame.GI.hudGroup);
    txt.quitYesT.visible = false;
    
    //cursor
    var spriteKey = FullGame.HUD.reticleSpriteKey;
    if (spriteKey == "") spriteKey = "reticle_red";
    this.cursor = game.add.sprite(0, 0, spriteKey, 0, FullGame.HUD.group);
    this.cursor.anchor.setTo(.5, .5);
    this.cursor.scale.set(.5, .5);
    
    
    FullGame.GI.pauseObj = {
        pauseTime:0,
        pauseUpdate:function() {
            this.pauseTime += 1.0/60;
            
            //cursor selecting other text
            var cursor = FullGame.Menus.cursor;
            cursor.x = FullGame.Keys.mouseX;
            cursor.y = FullGame.Keys.mouseY;
            FullGame.Menus.textSelected = null;
            for (var key in FullGame.Menus.text) {
                var txt = FullGame.Menus.text[key];
                if (!txt.visible) continue;
                if (txt == FullGame.Menus.text.quitSureT ||
                    txt == FullGame.Menus.text.fullscreenInstructionsT) continue;
                if (txt.x+FullGame.Menus.HIT_AREA.x <= cursor.x &&
                    cursor.x <= txt.x+FullGame.Menus.HIT_AREA.x+FullGame.Menus.HIT_AREA.width &&
                    txt.y+FullGame.Menus.HIT_AREA.y <= cursor.y &&
                    cursor.y <= txt.y+FullGame.Menus.HIT_AREA.y+FullGame.Menus.HIT_AREA.height){
                    FullGame.Menus.textSelected = txt;
                }
            }
            if (FullGame.Menus.textSelected != FullGame.Menus.prevTextSelected){
                if (FullGame.Menus.prevTextSelected != null){
                    FullGame.Menus.prevTextSelected.clearColors();
                    FullGame.Menus.prevTextSelected.addColor(FullGame.Menus.UNSELECTED_COLOR, 0);
                }
                if (FullGame.Menus.textSelected != null){
                    FullGame.Menus.textSelected.clearColors();
                    FullGame.Menus.textSelected.addColor(FullGame.Menus.SELECTED_COLOR, 0);
                }
                FullGame.Menus.prevTextSelected = FullGame.Menus.textSelected;
            }
            
            
            if ((FullGame.Keys.pausePressed || FullGame.Keys.lmbPressed) && this.pauseTime > .2){
                if ((FullGame.Keys.pausePressed && FullGame.Menus.text.continueT.visible) ||
                    FullGame.Menus.textSelected == FullGame.Menus.text.continueT){
                    //continue pressed
                    //update music
                    if (FullGame.Menus.musicWasMuted != FullGame.Vars.musicMuted){
                        if (FullGame.Vars.musicMuted){
                            FullGame.stopMusic();
                        } else {
                            FullGame.playMusic(FullGame.GI.bgMusic, .5);
                        }
                    }
                    //clear visual stuff
                    FullGame.Menus.clearMenu();
                    //unpause game
                    FullGame.GI.pauseObj = null;
                    game.paused = false;
                } else if (FullGame.Menus.textSelected == FullGame.Menus.text.optionsT){
                    
                    this.pauseMenuInvisible();
                    var txt = FullGame.Menus.text;
                    //txt.toggleFullscreenT.visible = true;
                    txt.toggleSFXT.visible = true;
                    if (FullGame.Vars.sfxMuted){
                        txt.toggleSFXT.text = "UNMUTE SFX";
                    } else {
                        txt.toggleSFXT.text = "MUTE SFX";
                    }
                    txt.toggleMusicT.visible = true;
                    if (FullGame.Vars.musicMuted){
                        txt.toggleMusicT.text = "UNMUTE MUSIC";
                    } else {
                        txt.toggleMusicT.text = "MUTE MUSIC";
                    }
                    txt.backFromOptionsT.visible = true;
                    
                    
                } else if (FullGame.Menus.textSelected == FullGame.Menus.text.howToPlayT){
                    
                    this.pauseMenuInvisible();
                    FullGame.Menus.howToPlayImage = game.add.image(0, 0, "controls", 0, FullGame.GI.hudGroup);
                    FullGame.Menus.cursor.bringToTop();
                    
                } else if (FullGame.Menus.textSelected == FullGame.Menus.text.quitT){
                    
                    this.pauseMenuInvisible();
                    var txt = FullGame.Menus.text;
                    txt.quitSureT.visible = true;
                    txt.quitNoT.visible = true;
                    txt.quitYesT.visible = true;
                    
                } else if (FullGame.Menus.textSelected == FullGame.Menus.text.toggleFullscreenT){
                    
                    toggleFullscreen();
                    
                } else if (FullGame.Menus.textSelected == FullGame.Menus.text.toggleSFXT){
                    
                    if (FullGame.Vars.sfxMuted){
                        FullGame.Vars.sfxMuted = false;
                        FullGame.Menus.text.toggleSFXT.text = "MUTE SFX";
                    } else {
                        FullGame.Vars.sfxMuted = true;
                        FullGame.Menus.text.toggleSFXT.text = "UNMUTE SFX";
                    }
                    
                } else if (FullGame.Menus.textSelected == FullGame.Menus.text.toggleMusicT){
                    
                    if (FullGame.Vars.musicMuted){
                        FullGame.Vars.musicMuted = false;
                        FullGame.Menus.text.toggleMusicT.text = "MUTE MUSIC";
                    } else {
                        FullGame.Vars.musicMuted = true;
                        FullGame.Menus.text.toggleMusicT.text = "UNMUTE MUSIC";
                    }
                    
                } else if (FullGame.Menus.textSelected == FullGame.Menus.text.backFromOptionsT){
                    
                    var txt = FullGame.Menus.text;
                    txt.toggleFullscreenT.visible = false;
                    txt.toggleSFXT.visible = false;
                    txt.toggleMusicT.visible = false;
                    txt.backFromOptionsT.visible = false;
                    this.pauseMenuVisible();
                    
                } else if (FullGame.Menus.howToPlayImage != null) {
                    
                    FullGame.Menus.howToPlayImage.destroy();
                    FullGame.Menus.howToPlayImage = null;
                    this.pauseMenuVisible();
                    
                } else if (FullGame.Menus.textSelected == FullGame.Menus.text.quitNoT){
                    
                    var txt = FullGame.Menus.text;
                    txt.quitSureT.visible = false;
                    txt.quitNoT.visible = false;
                    txt.quitYesT.visible = false;
                    this.pauseMenuVisible();
                    
                } else if (FullGame.Menus.textSelected == FullGame.Menus.text.quitYesT){
                    
                    FullGame.stopMusic();
                    FullGame.GI.sound.stopAll();
                    FullGame.HUD.haltMsg(true);
                    FullGame.GI.pauseObj = null;
                    game.paused = false;
                    game.state.start("Title");
                }
            }
        },
        pauseMenuVisible:function() {
            var txt = FullGame.Menus.text;
            txt.continueT.visible = true;
            txt.optionsT.visible = true;
            txt.howToPlayT.visible = true;
            txt.quitT.visible = true;
            txt.fullscreenInstructionsT.visible = true;
            FullGame.Menus.textSelected = null;
        },
        pauseMenuInvisible:function() {
            var txt = FullGame.Menus.text;
            txt.continueT.visible = false;
            txt.optionsT.visible = false;
            txt.howToPlayT.visible = false;
            txt.quitT.visible = false;
            txt.fullscreenInstructionsT.visible = false;
            FullGame.Menus.textSelected = null;
        }
        
        
    };
    
    
};