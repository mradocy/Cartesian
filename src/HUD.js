FullGame.HUD = {
    group:null, //the phaser group to hold all the images
    reticle:null, //the reticle for the player
    reticleSpriteKey:"", //sprite key for reticle set before group is actually created
    graphics:null, //graphics object for drawing things
    prevReticleAngle:0,
    prevReticleAngleSet:false,
    blackScreen:null,
    BLACK_SCREEN_FADE_DURATION:.5,
    blackScreenFadeTime:0,
    blackScreenFadeIn:false,
    solveFlashG:null,
    solveFlashTime:9999,
    lowHealthFG:null, //large overlay that changes the screen when player is low on health
    LOW_HEALTH_FG_FADEOUT_DURATION:.5, //extra time for overlay to exist after player's health recharged
    beatFinalG:null,
    beatFinalTime:9999,
    TEXT_AREA_NUM_LINES:3,
    TEXT_AREA_NUM_CHARACTERS:80,
    MESSAGE_SPEED:85,
    MESSAGE_FINISH_DELAY:8.0, //new: need to press down to advance message
    MESSAGE_COLOR_NORMAL:"#00FF21",
    MESSAGE_COLOR_UNKNOWN:"#CCCCCC",
    textArea:null, //large text object
    textBG:null, //bg for textArea
    textNameArea:null, //small text object for the name
    textNameBG:null, //bg for textNameArea
    textAreaTransitionTime:0,
    textAreaTransitionDuration:0,
    textAreaTransitionIntro:false,
    messageStrs:[],
    messageName:"",
    messageIndex:0.0,
    messageMapStartedIn:"",
    messageDisplaying:false,
    messageAdvanceIcon:null, //icon appearing at the bottom of the chat to indicate when to move on
    MESSAGE_ADVANCE_ICON_Y:542,
    timerText:null,
    timerTextBG:null
};

/* puts a message on the text area, doing everything automatically
 * Optionally, pass in an array of strings, each string being a message that will play in sequence
*/
FullGame.HUD.msg = function(messages, name) {
    
    this.messageStrs.splice(0, this.messageStrs.length);
    if (typeof messages == "string"){
        this.messageStrs.push(messages);
    } else {
        for (var i=0; i<messages.length; i++){
            this.messageStrs.push(messages[i]);
        }
    }
    this.messageIndex = 0.0;
    if (name == undefined){
        this.messageName = "";
    } else {
        this.messageName = name;
    }
    if (!this.textArea.visible){
        this.textAreaIntro();
    }
    this.messageMapStartedIn = FullGame.Vars.startMap;
    this.messageDisplaying = true;
};

FullGame.HUD.haltMsg = function(immediatelyHideTextArea) {
    this.messageStrs.splice(0, this.messageStrs.length);
    this.messageIndex = 0;
    this.messageDisplaying = false;
    if (immediatelyHideTextArea){
        this.textArea.text = "";
        this.textNameArea.text = "";
        this.textBG.visible = false;
        this.textNameBG.visible = false;
        this.messageAdvanceIcon.visible = false;
        this.textAreaTransitionTime = 0;
        this.textAreaTransitionDuration = 0;
        this.textAreaTransitionIntro = false;
    } else {
        if (this.textBG.visible && !this.textAreaTransitioning()){
            this.textAreaOutro();
        }
    }
};

FullGame.HUD.makeGroup = function() {
    this.group = game.add.group(undefined, "HUD", true, false); //group being added to stage instead of the world
    this.graphics = game.add.graphics(0, 0, this.group);
    if (this.reticle == null && this.reticleSpriteKey != ""){
        this.reticle = game.add.sprite(0, 0, this.reticleSpriteKey, 0, this.group);
        this.reticle.anchor.setTo(.5, .5);
        this.reticle.scale.set(.5, .5);
    }
    this.prevReticleAngleSet = false;
    this.lowHealthFG = game.add.sprite(0, 0, "low_health_fg", 0, this.group);
    this.lowHealthFG.visible = false;
    this.TEXT_BG_X = 160;
    this.TEXT_BG_WIDTH = 847;
    this.textBG = game.add.graphics(
        this.TEXT_BG_X,
        487, //y of text bg
        this.group);
    this.textBG.beginFill(0x191919/*0x191E19*/, .9);
    this.textBG.drawRect(0, 0, this.TEXT_BG_WIDTH, 77);
    this.textBG.endFill();
    this.textBG.visible = false;
    this.textArea = game.add.text(
        172, //x of text area
        496, //y of text area
        "", { font: "17px 'Lucida Console'", fill: this.MESSAGE_COLOR_NORMAL },
        this.group);
    this.textArea.lineSpacing = 7;
    this.TEXT_NAME_BG_X = 15;
    this.TEXT_NAME_BG_WIDTH = 129;
    this.textNameBG = game.add.graphics(
        this.TEXT_NAME_BG_X, //x of text bg
        487, //y of text bg
        this.group);
    this.textNameBG.beginFill(0x191919/*0x191E19*/, .9);
    this.textNameBG.drawRect(0, 0, this.TEXT_NAME_BG_WIDTH, 77);
    this.textNameBG.endFill();
    this.textNameBG.visible = false;
    this.textNameArea = game.add.text(
        15, //x of text name area
        518, //y of text name area
        "???\n             ", //extra spaces are to keep text centered
        { font: "17px 'Lucida Console'", fill: this.MESSAGE_COLOR_NORMAL },
        this.group);
    this.textNameArea.align = 'center';
    this.messageAdvanceIcon = game.add.sprite(
        977, //x of icon
        this.MESSAGE_ADVANCE_ICON_Y,
        "msg_advance_icon",
        undefined, this.group);
    this.messageAdvanceIcon.animations.add("wasd", [0], 30, true);
    this.messageAdvanceIcon.animations.add("arrows", [1], 30, true);
    this.messageAdvanceIcon.animations.play("idle");
    this.messageAdvanceIcon.visible = false;
    this.timerTextBG = game.add.graphics(942, 7, this.group);
    this.timerTextBG.beginFill(0x000000, .9);
    this.timerTextBG.drawRect(0, 0, 72, 27);
    this.timerTextBG.endFill();
    this.timerTextBG.visible = false;
    this.timerText = game.add.text(
        949, //x of text name area
        14, //y of text name area
        "0:00:00",
        { font: "14px 'Lucida Console'", fill: "#FEFEFE" },
        this.group);
    this.timerText.visible = false;
    this.solveFlashG = game.add.graphics(0, 0, this.group);
    this.solveFlashG.beginFill(0xF0F0F0, .1);
    this.solveFlashG.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    this.solveFlashG.endFill();
    this.solveFlashG.visible = false;
    
    this.beatFinalG = game.add.graphics(0, 0, this.group);
    this.beatFinalG.beginFill(0xEAEAEA, 1);
    this.beatFinalG.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    this.beatFinalG.endFill();
    this.beatFinalG.visible = false;
    
    this.blackScreen = game.add.graphics(0, 0, this.group);
    this.blackScreen.beginFill(0x000000, 1);
    this.blackScreen.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    this.blackScreen.endFill();
    this.blackScreen.visible = false;
    this.blackScreenFadeTime = 0;
    this.blackScreenFadeIn = false;
    
    
    return this.group;
};

//sets reticle based on laserType (Til.LASER_NORMAL or Til.LASER_THICK) and color
FullGame.HUD.setReticle = function(laserType, laserColor) {
    if (this.reticle != null){
        this.reticle.kill();
        if (this.reticle.group != null){
            this.reticle.group.remove(this.reticle);
        }
    }
    var spriteKey = "reticle_red";
    switch (laserColor){
    case FullGame.Til.BLUE:
        if (laserType == FullGame.Til.LASER_THICK){
        } else {
            spriteKey = "reticle_blue";
        }
        break;
    case FullGame.Til.GREEN:
        if (laserType == FullGame.Til.LASER_THICK){
        } else {
            spriteKey = "reticle_green";
        }
        break;
    case FullGame.Til.RED:
    default:
        if (laserType == FullGame.Til.LASER_THICK){
            spriteKey = "reticle_power";
        } else {
            spriteKey = "reticle_red";
        }
    }
    
    this.reticleSpriteKey = spriteKey;
    if (this.group != null){
        this.reticle = game.add.sprite(0, 0, spriteKey, 0, this.group);
        this.reticle.anchor.setTo(.5, .5);
        this.reticle.scale.set(.5, .5);
    }
};

FullGame.HUD.update = function() {
    var dt = game.time.physicsElapsed;
    
    //fading in or out (with blackScreen)
    if (this.blackScreenFadeTime < this.BLACK_SCREEN_FADE_DURATION){
        this.blackScreenFadeTime = Math.min(this.BLACK_SCREEN_FADE_DURATION, this.blackScreenFadeTime + dt);
        this.blackScreen.visible = true;
        if (this.blackScreenFadeIn){
            this.blackScreen.alpha = this.blackScreenFadeTime / this.BLACK_SCREEN_FADE_DURATION;
        } else {
            this.blackScreen.alpha = 1 - (this.blackScreenFadeTime / this.BLACK_SCREEN_FADE_DURATION);
            if (this.blackScreen.alpha <= .0001){
                this.blackScreen.visible = false;
            }
        }
    }
    
    //door open flash
    if (this.solveFlashTime < .32){
        this.solveFlashTime += dt;
        if (this.solveFlashTime >= .32 ||
            Math.floor(this.solveFlashTime / .08) % 2 == 1){
            this.solveFlashG.visible = false;
        } else {
            this.solveFlashG.visible = true;
        }
    }
    
    //beat final boss flash
    if (this.beatFinalTime < 4.0){
        this.beatFinalTime += dt;
        this.beatFinalG.visible = true;
        if (this.beatFinalTime >= 4.0){
            this.beatFinalG.visible = false;
        } else if (this.beatFinalTime < .5) {
            this.beatFinalG.alpha = this.beatFinalTime / .5;
        } else if (this.beatFinalTime < 1.0){
            this.beatFinalG.alpha = 1.0;
        } else {
            this.beatFinalG.alpha = 1 - (this.beatFinalTime-1.0) / 3.0;
        }
    }
    
    //timer
    var str = "";
    var hours = Math.floor(FullGame.Vars.totalPlayTime / 3600);
    str += "" + hours + ":";
    var mins = Math.floor((FullGame.Vars.totalPlayTime - hours*3600) / 60);
    if (mins < 10) str += "0";
    str += "" + mins + ":";
    var secs = Math.floor(FullGame.Vars.totalPlayTime - hours*3600 - mins*60);
    if (secs < 10) str += "0";
    str += "" + secs;
    this.timerText.text = str;
    this.timerText.visible = FullGame.Vars.showTimer;
    this.timerTextBG.visible = this.timerText.visible;
    
    //text area transitions
    if (this.textAreaTransitionTime < this.textAreaTransitionDuration){
        var prevT = this.textAreaTransitionTime;
        this.textAreaTransitionTime = Math.min(this.textAreaTransitionDuration, this.textAreaTransitionTime + dt);
        var t = this.textAreaTransitionTime;
        var bgX = 0;
        var bgSX = 0;
        var nameBGX = 0;
        var nameBGSX = 0;
        var x0 = this.TEXT_NAME_BG_X;
        var totW = this.TEXT_BG_X + this.TEXT_BG_WIDTH - x0;
        var piv;
        if (this.textAreaTransitionIntro){
            //growing from right to left
            piv = Math.easeOutQuad(t, x0+totW, -totW, this.textAreaTransitionDuration);
        } else {
            //shrinking from left to right
            piv = Math.easeOutQuad(t, x0, totW, this.textAreaTransitionDuration);
        }
        bgX = piv;
        bgSX = (this.TEXT_BG_X + this.TEXT_BG_WIDTH - piv) / this.TEXT_BG_WIDTH;
        nameBGX = piv;
        nameBGSX = (this.TEXT_NAME_BG_X + this.TEXT_NAME_BG_WIDTH - piv) / this.TEXT_NAME_BG_WIDTH;
        bgX = Math.max(this.TEXT_BG_X, Math.min(this.TEXT_BG_X + this.TEXT_BG_WIDTH, bgX));
        bgSX = Math.max(0, Math.min(1, bgSX));
        nameBGX = Math.max(this.TEXT_NAME_BG_X, Math.min(this.TEXT_NAME_BG_X + this.TEXT_NAME_BG_WIDTH, nameBGX));
        nameBGSX = Math.max(0, Math.min(1, nameBGSX));
        if (bgSX <= 0){
            this.textBG.visible = false;
        } else {
            this.textBG.visible = true;
            this.textBG.x = bgX;
            this.textBG.scale.x = bgSX;
        }
        if (nameBGSX <= 0){
            this.textNameBG.visible = false;
        } else {
            this.textNameBG.visible = true;
            this.textNameBG.x = nameBGX;
            this.textNameBG.scale.x = nameBGSX;
        }
    }
    this.textArea.visible = (this.textBG.visible && this.textBG.scale.x > .9999);
    this.textNameArea.visible = (this.textNameBG.visible && this.textNameBG.scale.x > .9999);
    
    //message displaying
    if (this.messageDisplaying){
        if (this.textAreaTransitioning()){
            this.textArea.text = "";
            this.textNameArea.text = "";
        } else {
            var messageStr = this.messageStrs[0];
            var maxIndex = messageStr.length;
            if (this.messageIndex <= 0){
                FullGame.playSFX("msg_advance");
            }
            this.textBG.visible = true;
            this.textNameBG.visible = true;
            this.messageIndex += this.MESSAGE_SPEED * dt;
            this.displayText(messageStr, Math.floor(this.messageIndex));
            this.textNameArea.text = this.messageName + "\n             "; //extra space is needed to keep text centered
            //changing text color based on message name
            if (this.messageName == "???"){
                this.textArea.clearColors();
                this.textArea.addColor(this.MESSAGE_COLOR_UNKNOWN, 0);
                this.textNameArea.clearColors();
                this.textNameArea.addColor(this.MESSAGE_COLOR_UNKNOWN, 0);
            } else {
                this.textArea.clearColors();
                this.textArea.addColor(this.MESSAGE_COLOR_NORMAL, 0);
                this.textNameArea.clearColors();
                this.textNameArea.addColor(this.MESSAGE_COLOR_NORMAL, 0);
            }
            
            //skipping dialogue
            this.messageAdvanceIcon.visible = (this.messageIndex >= maxIndex);
            var moveDown = ((this.messageIndex-maxIndex)/this.MESSAGE_SPEED - Math.floor((this.messageIndex-maxIndex)/this.MESSAGE_SPEED / 1.0)*1.0 > .5);
            if (moveDown){
                this.messageAdvanceIcon.y = this.MESSAGE_ADVANCE_ICON_Y + 4;
            } else {
                this.messageAdvanceIcon.y = this.MESSAGE_ADVANCE_ICON_Y;
            }
            if (FullGame.Keys.downPressed){
                if (this.messageIndex < maxIndex){
                    this.messageIndex = maxIndex;
                } else {
                    this.messageIndex = maxIndex + this.MESSAGE_FINISH_DELAY*this.MESSAGE_SPEED + 1;
                }
            }
            
            if (this.messageIndex > maxIndex + this.MESSAGE_FINISH_DELAY*this.MESSAGE_SPEED){
                //move on to the next message
                if (this.messageStrs.length > 0){
                    this.messageStrs.splice(0, 1);
                }
                this.messageIndex = 0;
                if (this.messageStrs.length < 1){
                    //go to outro
                    this.textAreaOutro();
                    this.messageDisplaying = false;
                    this.messageAdvanceIcon.visible = false;
                }
            }
        }
    }
    
    if (FullGame.GI.player == null){
        this.reticleUpdate();
    } else { //do stuff with player
        
        if (FullGame.GI.player.lowHealthTime < FullGame.GI.player.HEALTH_RECHARGE_DURATION+this.LOW_HEALTH_FG_FADEOUT_DURATION ||
            FullGame.GI.player.dead()){
            //low health overlay
            this.lowHealthFG.visible = true;
            if (FullGame.GI.player.dead()){
                this.lowHealthFG.alpha = .5;
            } else {
                this.lowHealthFG.alpha =
                    (.4 + .1 * Math.cos(10 * FullGame.GI.player.lowHealthTime)) *
                    Math.min(1, 7 * (1 - FullGame.GI.player.lowHealthTime /
                    (FullGame.GI.player.HEALTH_RECHARGE_DURATION + this.LOW_HEALTH_FG_FADEOUT_DURATION)));
            }
        } else if (this.lowHealthFG.visible){
            this.lowHealthFG.visible = false;
        }
    }
};

//updates reticle position (called by the Player, if Player exists)
FullGame.HUD.reticleUpdate = function() {
    this.graphics.clear();
    if (this.reticle == null)
        return;
    
    var x = FullGame.Keys.mouseX;
    var y = FullGame.Keys.mouseY;
    
    //provide zeno easing with the angle
    if (FullGame.GI.player != null){
        var firePt = FullGame.GI.player.globalFirePt();
        var currentAngle = Math.atan2(y - firePt.y, x - firePt.x);
        if (this.prevReticleAngleSet){
            var r = Math.sqrt((firePt.x - x)*(firePt.x - x) + (firePt.y - y)*(firePt.y - y));
            var diff = currentAngle - this.prevReticleAngle;
            while (diff > Math.PI) diff -= Math.PI*2;
            while (diff < -Math.PI) diff += Math.PI*2;
            var zeno = 1;
            if (r < 100){
                zeno = Math.min(1, Math.max(.2, r / 100));
            }
            zeno = 1; //effect isn't as good as I thought it'd be
            currentAngle = this.prevReticleAngle + diff * zeno;
            x = firePt.x + r * Math.cos(currentAngle);
            y = firePt.y + r * Math.sin(currentAngle);
            this.prevReticleAngle = currentAngle;
        } else {
            this.prevReticleAngle = currentAngle;
            this.prevReticleAngleSet = true;
        }
    }
    
    
    this.reticle.position.set(x, y);
    
    if (FullGame.GI.player == null){
        this.reticle.rotation = 0;
    } else if (FullGame.GI.player.dead() || !FullGame.GI.player.visible){
        this.reticle.visible = false;
    } else {
        var firePt = FullGame.GI.player.globalFirePt();
        var color;
        switch (FullGame.GI.player.laserColor){
        case FullGame.Til.BLUE:
            color = FullGame.Lasers.COLOR_BLUE1;
            break;
        case FullGame.Til.GREEN:
            color = FullGame.Lasers.COLOR_GREEN1;
            break;
        case FullGame.Til.RED:
        default:
            color = FullGame.Lasers.COLOR_RED1;
        }
        this.graphics.lineStyle(FullGame.Lasers.THICKNESS_RETICLE, color, FullGame.Lasers.ALPHA_RETICLE);
        this.graphics.moveTo(x, y);
        this.graphics.lineTo(firePt.x, firePt.y);
        this.reticle.rotation = Math.atan2(y - firePt.y, x - firePt.x);
    }
};

FullGame.HUD.fadeIn = function() {
    //fade blackScreen out
    this.blackScreenFadeTime = 0;
    this.blackScreenFadeIn = false;
    this.blackScreen.visible = true;
};

FullGame.HUD.fadeOut = function() {
    //fade blackScreen in
    this.blackScreenFadeTime = 0;
    this.blackScreenFadeIn = true;
    this.blackScreen.visible = true;
};

FullGame.HUD.textAreaIntro = function() {
    this.textAreaTransitionTime = 0;
    this.textAreaTransitionDuration = 1.0;
    this.textAreaTransitionIntro = true;
    FullGame.playSFX("msg_on");
};
FullGame.HUD.textAreaOutro = function() {
    this.textAreaTransitionTime = 0;
    this.textAreaTransitionDuration = .5;
    this.textAreaTransitionIntro = false;
    FullGame.playSFX("msg_off");
};

FullGame.HUD.solveFlash = function() {
    this.solveFlashTime = 0;
};

FullGame.HUD.beatFinalBoss = function() {
    this.beatFinalTime = 0;
};

//if text area in a transition phase
FullGame.HUD.textAreaTransitioning = function() {
    return (this.textAreaTransitionTime < this.textAreaTransitionDuration);
};

//Display a substring from 0 to index of str on the textArea, adhering to max lines and character rules
FullGame.HUD.displayText = function(str, index) {
    index = Math.max(0, Math.min(str.length, index));
    var lines = [];
    var line = "";
    var word = "";
    for (var i=0; i < index; i++){
        var c = str.charAt(i);
        if (c == ' ' || c == '\t' || c == '-' ||
            c == '\n'){
            //word ended, add word to line
            if (line.length + word.length > this.TEXT_AREA_NUM_CHARACTERS){
                //end line; add to lines and create new line
                lines.push(line);
                line = "";
            }
            line = line + word;
            if (c == '\n'){
                //end line; add to lines and create new line, do not insert the '\n' character
                lines.push(line);
                line = "";
            } else {
                if (line.length + 1 > this.TEXT_AREA_NUM_CHARACTERS){
                    //end line; add to lines and create new line
                    lines.push(line);
                    line = "";
                }
                if (!(c == ' ' && line.length == 0)){ //don't have a space character begin a line
                    line = line + c;
                }
            }
            word = "";
        } else {
            //c is regular character.  add c to the word
            word = word + c;
        }
    }
    //got up to index, but still may need to add last word
    var fullWordLength = word.length;
    for (i=index; i<str.length; i++){
        var c = str.charAt(i);
        if (c == ' ' || c == '\t' || c == '-' ||
            c == '\n'){
            //end word
            break;
        }
        fullWordLength++;
    }
    if (line.length + fullWordLength > this.TEXT_AREA_NUM_CHARACTERS){
        //end line; add to lines and create new line
        lines.push(line);
        line = "";
    }
    line = line + word;
    //add last line
    lines.push(line);
    
    //display the last n lines
    var disp = "";
    var m = Math.max(0, lines.length-this.TEXT_AREA_NUM_LINES);
    for (i = lines.length-1; i >= m; i--){
        disp = lines[i] + disp;
        if (i > m) disp = '\n' + disp;
    }
    this.textArea.text = disp;
};

FullGame.HUD.destroy = function() {
    this.group = null;
    this.reticle = null;
    this.reticleSpriteKey = "";
    this.graphics.clear();
    this.graphics = null;
    this.prevReticleAngle = 0;
    this.prevReticleAngleSet = false;
    this.blackScreen.clear();
    this.blackScreen = null;
    this.blackScreenFadeTime = 0;
    this.blackScreenFadeIn = false;
    this.solveFlashG.clear();
    this.solveFlashG = null;
    this.solveFlashTime = 9999;
    this.beatFinalG.clear();
    this.beatFinalG = null;
    this.beatFinalTime = 9999;
    this.lowHealthFG = null;
    this.textBG.clear();
    this.textBG = null;
    this.textArea = null;
    this.textNameBG.clear();
    this.textNameBG = null;
    this.textNameArea = null;
    this.messageAdvanceIcon = null;
    /* Not doing these so messages can continue when changing maps
    this.textAreaTransitionTime = 0;
    this.textAreaTransitionDuration = 0;
    this.textAreaTransitionIntro = false;
    this.messageStrs.splice(0, this.messageStrs.length);
    this.messageName = "";
    this.messageIndex = 0.0;
    this.messageMapStartedIn = "";
    this.messageDisplaying = false;
    */
};
