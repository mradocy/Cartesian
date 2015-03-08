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
    lowHealthFG:null, //large overlay that changes the screen when player is low on health
    LOW_HEALTH_FG_FADEOUT_DURATION:.5, //extra time for overlay to exist after player's health recharged
    TEXT_AREA_NUM_LINES:3,
    TEXT_AREA_NUM_CHARACTERS:80,
    MESSAGE_SPEED:85,
    MESSAGE_FINISH_DELAY:9999999, //new: need to press down to advance message
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
    
    FullGame.HUD.messageStrs.splice(0, FullGame.HUD.messageStrs.length);
    if (typeof messages == "string"){
        FullGame.HUD.messageStrs.push(messages);
    } else {
        for (var i=0; i<messages.length; i++){
            FullGame.HUD.messageStrs.push(messages[i]);
        }
    }
    FullGame.HUD.messageIndex = 0.0;
    if (name == undefined){
        FullGame.HUD.messageName = "";
    } else {
        FullGame.HUD.messageName = name;
    }
    if (!FullGame.HUD.textArea.visible){
        FullGame.HUD.textAreaIntro();
    }
    FullGame.HUD.messageMapStartedIn = FullGame.Vars.startMap;
    FullGame.HUD.messageDisplaying = true;
};

FullGame.HUD.haltMsg = function(immediatelyHideTextArea) {
    FullGame.HUD.messageStrs.splice(0, FullGame.HUD.messageStrs.length);
    FullGame.HUD.messageIndex = 0;
    FullGame.HUD.messageDisplaying = false;
    if (immediatelyHideTextArea){
        FullGame.HUD.textArea.text = "";
        FullGame.HUD.textNameArea.text = "";
        FullGame.HUD.textBG.visible = false;
        FullGame.HUD.textNameBG.visible = false;
    } else {
        if (FullGame.HUD.textBG.visible && !FullGame.HUD.textAreaTransitioning()){
            FullGame.HUD.textAreaOutro();
        }
    }
};

FullGame.HUD.makeGroup = function() {
    FullGame.HUD.group = game.add.group(undefined, "HUD", true, false); //group being added to stage instead of the world
    FullGame.HUD.graphics = game.add.graphics(0, 0, FullGame.HUD.group);
    if (FullGame.HUD.reticle == null && FullGame.HUD.reticleSpriteKey != ""){
        FullGame.HUD.reticle = game.add.sprite(0, 0, FullGame.HUD.reticleSpriteKey, 0, FullGame.HUD.group);
        FullGame.HUD.reticle.anchor.setTo(.5, .5);
        FullGame.HUD.reticle.scale.set(.5, .5);
    }
    FullGame.HUD.prevReticleAngleSet = false;
    FullGame.HUD.lowHealthFG = game.add.sprite(0, 0, "low_health_fg", 0, FullGame.HUD.group);
    FullGame.HUD.lowHealthFG.visible = false;
    FullGame.HUD.TEXT_BG_X = 160;
    FullGame.HUD.TEXT_BG_WIDTH = 847;
    FullGame.HUD.textBG = game.add.graphics(
        FullGame.HUD.TEXT_BG_X,
        487, //y of text bg
        FullGame.HUD.group);
    FullGame.HUD.textBG.beginFill(0x191919/*0x191E19*/, .9);
    FullGame.HUD.textBG.drawRect(0, 0, FullGame.HUD.TEXT_BG_WIDTH, 77);
    FullGame.HUD.textBG.endFill();
    FullGame.HUD.textBG.visible = false;
    FullGame.HUD.textArea = game.add.text(
        172, //x of text area
        496, //y of text area
        "", { font: "17px 'Lucida Console'", fill: "#00FF21" },
        FullGame.HUD.group);
    FullGame.HUD.textArea.lineSpacing = 7;
    FullGame.HUD.TEXT_NAME_BG_X = 15;
    FullGame.HUD.TEXT_NAME_BG_WIDTH = 129;
    FullGame.HUD.textNameBG = game.add.graphics(
        FullGame.HUD.TEXT_NAME_BG_X, //x of text bg
        487, //y of text bg
        FullGame.HUD.group);
    FullGame.HUD.textNameBG.beginFill(0x191919/*0x191E19*/, .9);
    FullGame.HUD.textNameBG.drawRect(0, 0, FullGame.HUD.TEXT_NAME_BG_WIDTH, 77);
    FullGame.HUD.textNameBG.endFill();
    FullGame.HUD.textNameBG.visible = false;
    FullGame.HUD.textNameArea = game.add.text(
        15, //x of text name area
        518, //y of text name area
        "???\n             ", //extra spaces are to keep text centered
        { font: "17px 'Lucida Console'", fill: "#00FF21" },
        FullGame.HUD.group);
    FullGame.HUD.textNameArea.align = 'center';
    FullGame.HUD.messageAdvanceIcon = game.add.sprite(
        977, //x of icon
        FullGame.HUD.MESSAGE_ADVANCE_ICON_Y,
        "msg_advance_icon",
        undefined, FullGame.HUD.group);
    FullGame.HUD.messageAdvanceIcon.animations.add("wasd", [0], 30, true);
    FullGame.HUD.messageAdvanceIcon.animations.add("arrows", [1], 30, true);
    FullGame.HUD.messageAdvanceIcon.animations.play("idle");
    FullGame.HUD.messageAdvanceIcon.visible = false;
    FullGame.HUD.timerTextBG = game.add.graphics(942, 7, FullGame.HUD.group);
    FullGame.HUD.timerTextBG.beginFill(0x000000, .9);
    FullGame.HUD.timerTextBG.drawRect(0, 0, 72, 27);
    FullGame.HUD.timerTextBG.endFill();
    FullGame.HUD.timerTextBG.visible = false;
    FullGame.HUD.timerText = game.add.text(
        949, //x of text name area
        14, //y of text name area
        "000:00",
        { font: "14px 'Lucida Console'", fill: "#FEFEFE" },
        FullGame.HUD.group);
    FullGame.HUD.timerText.visible = false;
    FullGame.HUD.blackScreen = game.add.graphics(0, 0, FullGame.HUD.group);
    FullGame.HUD.blackScreen.beginFill(0x000000, 1);
    FullGame.HUD.blackScreen.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    FullGame.HUD.blackScreen.endFill();
    FullGame.HUD.blackScreen.visible = false;
    FullGame.HUD.blackScreenFadeTime = 0;
    FullGame.HUD.blackScreenFadeIn = false;
    
    return FullGame.HUD.group;
};

//sets reticle based on laserType (Til.LASER_NORMAL or Til.LASER_THICK) and color
FullGame.HUD.setReticle = function(laserType, laserColor) {
    if (FullGame.HUD.reticle != null){
        FullGame.HUD.reticle.kill();
        if (FullGame.HUD.reticle.group != null){
            FullGame.HUD.reticle.group.remove(FullGame.HUD.reticle);
        }
    }
    var spriteKey = "";
    switch (laserColor){
    case FullGame.Til.BLUE:
        if (laserType == FullGame.Til.LASER_THICK && false){
        } else {
            spriteKey = "reticle_blue";
        }
        break;
    case FullGame.Til.GREEN:
        if (laserType == FullGame.Til.LASER_THICK && false){
        } else {
            spriteKey = "reticle_green";
        }
        break;
    case FullGame.Til.RED:
    default:
        if (laserType == FullGame.Til.LASER_THICK && false){
        } else {
            spriteKey = "reticle_red";
        }
    }
    
    FullGame.HUD.reticleSpriteKey = spriteKey;
    if (FullGame.HUD.group != null){
        FullGame.HUD.reticle = game.add.sprite(0, 0, spriteKey, 0, FullGame.HUD.group);
        FullGame.HUD.reticle.anchor.setTo(.5, .5);
        FullGame.HUD.reticle.scale.set(.5, .5);
    }
};

FullGame.HUD.update = function() {
    var dt = game.time.physicsElapsed;
    
    //fading in or out (with blackScreen)
    if (FullGame.HUD.blackScreenFadeTime < FullGame.HUD.BLACK_SCREEN_FADE_DURATION){
        FullGame.HUD.blackScreenFadeTime = Math.min(FullGame.HUD.BLACK_SCREEN_FADE_DURATION, FullGame.HUD.blackScreenFadeTime + dt);
        FullGame.HUD.blackScreen.visible = true;
        if (FullGame.HUD.blackScreenFadeIn){
            FullGame.HUD.blackScreen.alpha = FullGame.HUD.blackScreenFadeTime / FullGame.HUD.BLACK_SCREEN_FADE_DURATION;
        } else {
            FullGame.HUD.blackScreen.alpha = 1 - (FullGame.HUD.blackScreenFadeTime / FullGame.HUD.BLACK_SCREEN_FADE_DURATION);
            if (FullGame.HUD.blackScreen.alpha <= .0001){
                FullGame.HUD.blackScreen.visible = false;
            }
        }
    }
    
    //timer
    var str = "";
    var hours = Math.floor(FullGame.Vars.totalPlayTime / 3600);
    str += "" + hours + ":";
    var mins = Math.floor((FullGame.Vars.totalPlayTime - hours*3600) / 60);
    if (mins < 10) str += "0";
    str += "" + mins + ":";
    var secs = Math.floor(FullGame.Vars.totalPlayTime - mins*60);
    if (secs < 10) str += "0";
    str += "" + secs;
    FullGame.HUD.timerText.text = str;
    FullGame.HUD.timerText.visible = FullGame.Vars.showTimer;
    FullGame.HUD.timerTextBG.visible = FullGame.HUD.timerText.visible;
    
    //text area transitions
    if (FullGame.HUD.textAreaTransitionTime < FullGame.HUD.textAreaTransitionDuration){
        var prevT = FullGame.HUD.textAreaTransitionTime;
        FullGame.HUD.textAreaTransitionTime = Math.min(FullGame.HUD.textAreaTransitionDuration, FullGame.HUD.textAreaTransitionTime + dt);
        var t = FullGame.HUD.textAreaTransitionTime;
        var bgX = 0;
        var bgSX = 0;
        var nameBGX = 0;
        var nameBGSX = 0;
        var x0 = FullGame.HUD.TEXT_NAME_BG_X;
        var totW = FullGame.HUD.TEXT_BG_X + FullGame.HUD.TEXT_BG_WIDTH - x0;
        var piv;
        if (FullGame.HUD.textAreaTransitionIntro){
            //growing from right to left
            piv = Math.easeOutQuad(t, x0+totW, -totW, FullGame.HUD.textAreaTransitionDuration);
        } else {
            //shrinking from left to right
            piv = Math.easeOutQuad(t, x0, totW, FullGame.HUD.textAreaTransitionDuration);
        }
        bgX = piv;
        bgSX = (FullGame.HUD.TEXT_BG_X + FullGame.HUD.TEXT_BG_WIDTH - piv) / FullGame.HUD.TEXT_BG_WIDTH;
        nameBGX = piv;
        nameBGSX = (FullGame.HUD.TEXT_NAME_BG_X + FullGame.HUD.TEXT_NAME_BG_WIDTH - piv) / FullGame.HUD.TEXT_NAME_BG_WIDTH;
        bgX = Math.max(FullGame.HUD.TEXT_BG_X, Math.min(FullGame.HUD.TEXT_BG_X + FullGame.HUD.TEXT_BG_WIDTH, bgX));
        bgSX = Math.max(0, Math.min(1, bgSX));
        nameBGX = Math.max(FullGame.HUD.TEXT_NAME_BG_X, Math.min(FullGame.HUD.TEXT_NAME_BG_X + FullGame.HUD.TEXT_NAME_BG_WIDTH, nameBGX));
        nameBGSX = Math.max(0, Math.min(1, nameBGSX));
        if (bgSX <= 0){
            FullGame.HUD.textBG.visible = false;
        } else {
            FullGame.HUD.textBG.visible = true;
            FullGame.HUD.textBG.x = bgX;
            FullGame.HUD.textBG.scale.x = bgSX;
        }
        if (nameBGSX <= 0){
            FullGame.HUD.textNameBG.visible = false;
        } else {
            FullGame.HUD.textNameBG.visible = true;
            FullGame.HUD.textNameBG.x = nameBGX;
            FullGame.HUD.textNameBG.scale.x = nameBGSX;
        }
    }
    FullGame.HUD.textArea.visible = (FullGame.HUD.textBG.visible && FullGame.HUD.textBG.scale.x > .9999);
    FullGame.HUD.textNameArea.visible = (FullGame.HUD.textNameBG.visible && FullGame.HUD.textNameBG.scale.x > .9999);
    
    //message displaying
    if (FullGame.HUD.messageDisplaying){
        if (FullGame.HUD.textAreaTransitioning()){
            FullGame.HUD.textArea.text = "";
            FullGame.HUD.textNameArea.text = "";
        } else {
            var messageStr = FullGame.HUD.messageStrs[0];
            var maxIndex = messageStr.length;
            if (FullGame.HUD.messageIndex <= 0){
                FullGame.playSFX("msg_advance");
            }
            FullGame.HUD.textBG.visible = true;
            FullGame.HUD.textNameBG.visible = true;
            FullGame.HUD.messageIndex += FullGame.HUD.MESSAGE_SPEED * dt;
            FullGame.HUD.displayText(messageStr, Math.floor(FullGame.HUD.messageIndex));
            FullGame.HUD.textNameArea.text = FullGame.HUD.messageName + "\n             "; //extra space is needed to keep text centered
            //skipping dialogue
            FullGame.HUD.messageAdvanceIcon.visible = (FullGame.HUD.messageIndex >= maxIndex);
            var moveDown = ((FullGame.HUD.messageIndex-maxIndex)/FullGame.HUD.MESSAGE_SPEED - Math.floor((FullGame.HUD.messageIndex-maxIndex)/FullGame.HUD.MESSAGE_SPEED / 1.0)*1.0 > .5);
            if (moveDown){
                FullGame.HUD.messageAdvanceIcon.y = FullGame.HUD.MESSAGE_ADVANCE_ICON_Y + 4;
            } else {
                FullGame.HUD.messageAdvanceIcon.y = FullGame.HUD.MESSAGE_ADVANCE_ICON_Y;
            }
            if (FullGame.Keys.downPressed){
                if (FullGame.HUD.messageIndex < maxIndex){
                    FullGame.HUD.messageIndex = maxIndex;
                } else {
                    FullGame.HUD.messageIndex = maxIndex + FullGame.HUD.MESSAGE_FINISH_DELAY*FullGame.HUD.MESSAGE_SPEED + 1;
                }
            }
            
            if (FullGame.HUD.messageIndex > maxIndex + FullGame.HUD.MESSAGE_FINISH_DELAY*FullGame.HUD.MESSAGE_SPEED){
                if (FullGame.HUD.messageStrs.length > 1){
                    //move on to the next message
                    FullGame.HUD.messageStrs.splice(0, 1);
                    FullGame.HUD.messageIndex = 0;
                } else {
                    //go to outro
                    FullGame.HUD.textAreaOutro();
                    FullGame.HUD.messageDisplaying = false;
                    FullGame.HUD.messageAdvanceIcon.visible = false;
                }
            }
        }
    }
    
    if (FullGame.GI.player == null){
        FullGame.HUD.reticleUpdate();
    } else { //do stuff with player
        
        if (FullGame.GI.player.lowHealthTime < FullGame.GI.player.HEALTH_RECHARGE_DURATION+FullGame.HUD.LOW_HEALTH_FG_FADEOUT_DURATION ||
            FullGame.GI.player.dead()){
            //low health overlay
            FullGame.HUD.lowHealthFG.visible = true;
            if (FullGame.GI.player.dead()){
                FullGame.HUD.lowHealthFG.alpha = .5;
            } else {
                FullGame.HUD.lowHealthFG.alpha =
                    (.4 + .1 * Math.cos(10 * FullGame.GI.player.lowHealthTime)) *
                    Math.min(1, 7 * (1 - FullGame.GI.player.lowHealthTime /
                    (FullGame.GI.player.HEALTH_RECHARGE_DURATION + FullGame.HUD.LOW_HEALTH_FG_FADEOUT_DURATION)));
            }
        } else if (FullGame.HUD.lowHealthFG.visible){
            FullGame.HUD.lowHealthFG.visible = false;
        }
    }
};

//updates reticle position (called by the Player, if Player exists)
FullGame.HUD.reticleUpdate = function() {
    FullGame.HUD.graphics.clear();
    if (FullGame.HUD.reticle == null)
        return;
    
    var x = FullGame.Keys.mouseX;
    var y = FullGame.Keys.mouseY;
    
    //provide zeno easing with the angle
    if (FullGame.GI.player != null){
        var firePt = FullGame.GI.player.globalFirePt();
        var currentAngle = Math.atan2(y - firePt.y, x - firePt.x);
        if (FullGame.HUD.prevReticleAngleSet){
            var r = Math.sqrt((firePt.x - x)*(firePt.x - x) + (firePt.y - y)*(firePt.y - y));
            var diff = currentAngle - FullGame.HUD.prevReticleAngle;
            while (diff > Math.PI) diff -= Math.PI*2;
            while (diff < -Math.PI) diff += Math.PI*2;
            var zeno = 1;
            if (r < 100){
                zeno = Math.min(1, Math.max(.2, r / 100));
            }
            zeno = 1; //effect isn't as good as I thought it'd be
            currentAngle = FullGame.HUD.prevReticleAngle + diff * zeno;
            x = firePt.x + r * Math.cos(currentAngle);
            y = firePt.y + r * Math.sin(currentAngle);
            FullGame.HUD.prevReticleAngle = currentAngle;
        } else {
            FullGame.HUD.prevReticleAngle = currentAngle;
            FullGame.HUD.prevReticleAngleSet = true;
        }
    }
    
    
    FullGame.HUD.reticle.position.set(x, y);
    
    if (FullGame.GI.player == null){
        FullGame.HUD.reticle.rotation = 0;
    } else if (FullGame.GI.player.dead()){
        FullGame.HUD.reticle.visible = false;
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
        FullGame.HUD.graphics.lineStyle(FullGame.Lasers.THICKNESS_RETICLE, color, FullGame.Lasers.ALPHA_RETICLE);
        FullGame.HUD.graphics.moveTo(x, y);
        FullGame.HUD.graphics.lineTo(firePt.x, firePt.y);
        FullGame.HUD.reticle.rotation = Math.atan2(y - firePt.y, x - firePt.x);
    }
};

FullGame.HUD.fadeIn = function() {
    //fade blackScreen out
    FullGame.HUD.blackScreenFadeTime = 0;
    FullGame.HUD.blackScreenFadeIn = false;
    FullGame.HUD.blackScreen.visible = true;
};

FullGame.HUD.fadeOut = function() {
    //fade blackScreen in
    FullGame.HUD.blackScreenFadeTime = 0;
    FullGame.HUD.blackScreenFadeIn = true;
    FullGame.HUD.blackScreen.visible = true;
};

FullGame.HUD.textAreaIntro = function() {
    FullGame.HUD.textAreaTransitionTime = 0;
    FullGame.HUD.textAreaTransitionDuration = 1.0;
    FullGame.HUD.textAreaTransitionIntro = true;
    FullGame.playSFX("msg_on");
};
FullGame.HUD.textAreaOutro = function() {
    FullGame.HUD.textAreaTransitionTime = 0;
    FullGame.HUD.textAreaTransitionDuration = .5;
    FullGame.HUD.textAreaTransitionIntro = false;
    FullGame.playSFX("msg_off");
};

//if text area in a transition phase
FullGame.HUD.textAreaTransitioning = function() {
    return (FullGame.HUD.textAreaTransitionTime < FullGame.HUD.textAreaTransitionDuration);
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
            if (line.length + word.length > FullGame.HUD.TEXT_AREA_NUM_CHARACTERS){
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
                if (line.length + 1 > FullGame.HUD.TEXT_AREA_NUM_CHARACTERS){
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
    if (line.length + fullWordLength > FullGame.HUD.TEXT_AREA_NUM_CHARACTERS){
        //end line; add to lines and create new line
        lines.push(line);
        line = "";
    }
    line = line + word;
    //add last line
    lines.push(line);
    
    //display the last n lines
    var disp = "";
    var m = Math.max(0, lines.length-FullGame.HUD.TEXT_AREA_NUM_LINES);
    for (i = lines.length-1; i >= m; i--){
        disp = lines[i] + disp;
        if (i > m) disp = '\n' + disp;
    }
    FullGame.HUD.textArea.text = disp;
};

FullGame.HUD.destroy = function() {
    FullGame.HUD.group = null;
    FullGame.HUD.reticle = null;
    FullGame.HUD.reticleSpriteKey = "";
    FullGame.HUD.graphics.clear();
    FullGame.HUD.graphics = null;
    FullGame.HUD.prevReticleAngle = 0;
    FullGame.HUD.prevReticleAngleSet = false;
    FullGame.HUD.blackScreen.clear();
    FullGame.HUD.blackScreen = null;
    FullGame.HUD.blackScreenFadeTime = 0;
    FullGame.HUD.blackScreenFadeIn = false;
    FullGame.HUD.lowHealthFG = null;
    FullGame.HUD.textBG.clear();
    FullGame.HUD.textBG = null;
    FullGame.HUD.textArea = null;
    FullGame.HUD.textNameBG.clear();
    FullGame.HUD.textNameBG = null;
    FullGame.HUD.textNameArea = null;
    FullGame.HUD.messageAdvanceIcon = null;
    /* Not doing these so messages can continue when changing maps
    FullGame.HUD.textAreaTransitionTime = 0;
    FullGame.HUD.textAreaTransitionDuration = 0;
    FullGame.HUD.textAreaTransitionIntro = false;
    FullGame.HUD.messageStrs.splice(0, FullGame.HUD.messageStrs.length);
    FullGame.HUD.messageName = "";
    FullGame.HUD.messageIndex = 0.0;
    FullGame.HUD.messageMapStartedIn = "";
    FullGame.HUD.messageDisplaying = false;
    */
};
