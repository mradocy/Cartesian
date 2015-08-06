//contains all the dialogue
FullGame.Messages = {
    LEVEL_START_MESSAGE_DELAY:1.0,
    PUZZLE_STUCK_DURATION:120.0
};

//called a bit after starting a level
FullGame.Messages.onLevelStart = function() {
    var msg = "";
    var msgs = [];
    var msgName = "";
    var sm = FullGame.Vars.startMap;
    var lm = FullGame.Vars.lastMap;
    var vms = FullGame.Vars.messagesSaid;
    var hasPower = (FullGame.Vars.playerLaserType == FullGame.Til.LASER_THICK);
    
    if (sm == "firstLevel" && vms.indexOf(sm) == -1){
        if (this.msgFromText(sm))
            vms.push(sm); //ensures message won't be said again
    } else if (sm == "firstOrb" && vms.indexOf(sm) == -1){
        if (this.msgFromText(sm))
            vms.push(sm); //ensures message won't be said again
    } else if (sm == "firstReflect" && vms.indexOf(sm) == -1){
        if (this.msgFromText(sm))
            vms.push(sm); //ensures message won't be said again
    } else if (sm == "firstMultReflect" && vms.indexOf(sm) == -1){
        if (this.msgFromText(sm))
            vms.push(sm); //ensures message won't be said again
    } else if (sm == "trapped2" && vms.indexOf(sm) == -1){
        
        msgName = "???";
        
        msg = "You are doing very well, robot.  ";
        msg += "It has been a while since we found someone that made it this far.";
        msgs.push(msg);
        var playTime = FullGame.Vars.totalPlayTime;
        var mins = Math.floor(playTime / 60);
        if (playTime >= 3600*2){
            msg = "Your speed isn't that impressive, but making it here in one piece is still an accomplishment.";
        } else if (mins >= 100){
            msg = "And you've been playing for less than 2 hours.  That is no easy feat.";
        } else if (mins >= 10) {
            msg = "And it has only been " + mins + " minutes so far!  That might just be a new record.";
        } else {
            var secs = Math.floor(playTime - (mins*60));
            msg = "Not even 10 minutes have passed yet!  That's incredible!";
        }
        msgs.push(msg);
        msg = "Keep up the good work little robot.  You are certainly proving your worth.";
        msgs.push(msg);
        
        FullGame.HUD.msg(msgs, msgName); //display message
        
        vms.push(sm); //ensures message won't be said again
    } else if (sm == "firstGem" && vms.indexOf(sm) == -1){
        this.msgFromText("minerSitting");
        //sm is NOT pushed to vms here; the MinerSitting object in the room will do this once the gem is placed
    } else if (sm == "useShooter" && vms.indexOf("useShooterText") == -1){
        
        msgName = "???";
        
        msg = "Leaving so soon?  ";
        var playTime = FullGame.Vars.totalPlayTime;
        var hours = Math.floor(playTime / 3600);
        var mins = Math.floor(playTime / 60);
        if (hours >= 3){
            msg += "You seemed to be enjoying it here.";
        } else if (mins >= 100){
            msg += "It has only been an hour or two!";
        } else if (mins >= 2) {
            msg += "It has only been " + mins + " minutes since you started!";
        } else {
            msg += "You just started!";
        }
        msgs.push(msg);
        msg = "We highly recommend you stay.  ";
        msg += "You are preforming at a much higher level than those three humans scurrying about.";
        msgs.push(msg);
        msg = "One of our kind will be meeting with you personally to further incentivize you."; 
        msgs.push(msg);
        
        FullGame.HUD.msg(msgs, msgName); //display message
        
        //using a different name so that message won't be repeated if player dies
        vms.push("useShooterText"); //ensures message won't be said again
    } else if (sm == "openArea" && !hasPower && vms.indexOf(sm) == -1){
        if (this.msgFromText(sm))
            vms.push(sm); //ensures message won't be said again
    } else if (sm == "tightReflect" && vms.indexOf(sm) == -1){
        this.msgFromText("minerScared");
        //sm is NOT pushed to vms here; the MinerSitting object in the room will do this once the gem is placed
    } else if (sm == "lastRescue" && vms.indexOf(sm) == -1){
        this.msgFromText("minerStanding");
        //sm is NOT pushed to vms here; the MinerStanding object in the room will do this once the gem is placed
    } else if (sm == "keyRoom" && hasPower && vms.indexOf(sm+"Power") == -1){
        if (this.msgFromText(sm+"Power"))
            vms.push(sm+"Power"); //ensures message won't be said again
    } else if (sm == "whiteAreaBuffer" && vms.indexOf(sm) == -1){
        if (this.msgFromText(sm))
            vms.push(sm); //ensures message won't be said again
    } else if (sm == "openArea" && hasPower && vms.indexOf(sm+"Power") == -1){
        if (this.msgFromText(sm+"Power"))
            vms.push(sm+"Power"); //ensures message won't be said again
    } else if (sm == "landedAgain" && vms.indexOf(sm) == -1){
        if (this.msgFromText(sm))
            vms.push(sm); //ensures message won't be said again
    } else if (sm == "pinkLevel" && vms.indexOf(sm) == -1){
        if (this.msgFromText(sm))
            vms.push(sm); //ensures message won't be said again
    } else if (sm == "thickRoplate" && FullGame.Vars.playerLaserColor == FullGame.Til.BLUE && vms.indexOf("laserSkip") == -1){
        if (this.msgFromText("laserSkip"))
            vms.push("laserSkip"); //ensures message won't be said again
    } else if (sm == "beforeFinal" && vms.indexOf(sm) == -1){
        if (this.msgFromText(sm))
            vms.push(sm); //ensures message won't be said again
    }
    
    //message when backtracking
    if (FullGame.rooms.indexOf(lm) > FullGame.rooms.indexOf(sm) && vms.indexOf("backtrack") == -1 &&
        (sm=="firstMultReflect" || sm=="firstSpring" || sm=="firstGlass" || sm=="firstMultOrb" || sm=="firstSand")){
        
        if (this.msgFromText("backtrack"))
            vms.push("backtrack");
    }
    
};

FullGame.Messages.onDoorOpen = function() {
    var msg = "";
    var msgs = [];
    var msgName = "";
    var sm = FullGame.Vars.startMap;
    var lm = FullGame.Vars.lastMap;
    var vms = FullGame.Vars.messagesSaid;
    
    if (sm == "firstSand" && vms.indexOf(sm+"doorOpen") == -1){
        if (this.msgFromText(sm))
            vms.push(sm+"doorOpen"); //ensures message won't be said again
    } else if (sm == "revisit" && vms.indexOf(sm+"doorOpen") == -1){
        if (this.msgFromText(sm))
            vms.push(sm+"doorOpen"); //ensures message won't be said again
    } else if (sm == "platforming2" && vms.indexOf(sm+"doorOpen") == -1){
        if (this.msgFromText(sm))
            vms.push(sm+"doorOpen"); //ensures message won't be said again
    } else if (sm == "gemPortals" && vms.indexOf(sm+"doorOpen") == -1){
        if (this.msgFromText(sm))
            vms.push(sm+"doorOpen"); //ensures message won't be said again
    }
    
    if (msgs.length == 0){
        if (msg == "")
            return;
        msgs.push(msg);
    }
    FullGame.HUD.msg(msgs, msgName);
    
};


/* Called when player is taking too long to solve a level */
FullGame.Messages.onPlayerStuck = function() {
    var sm = FullGame.Vars.startMap;
    var lm = FullGame.Vars.lastMap;
    var vms = FullGame.Vars.messagesSaid;
    
    if (sm == "numbers"){
        this.msgFromText("numbersHelp");
    } else if (sm == "trapped"){
        this.msgFromText("trappedHelp");
    } else if (sm == "reflectOffDoor"){
        this.msgFromText("reflectOffDoorHelp");
    } else if (sm == "useShooter"){
        this.msgFromText("useShooterHelp");
    } else if (sm == "sandTime"){
        this.msgFromText("sandTimeHelp");
    }
    
};




/* Called when leaving a level.
 * Should be used to make sure messages don't get repeated when reentering a level */
FullGame.Messages.onLevelLeave = function(mapTo) {
    var sm = FullGame.Vars.startMap;
    var lm = FullGame.Vars.lastMap;
    var vms = FullGame.Vars.messagesSaid;
    
    var haltMessage = false;
    //cease message if going to another map (but not to a previous map)
    /*
    var mapToIndex = FullGame.rooms.indexOf(mapTo);
    var startIndex = FullGame.rooms.indexOf(FullGame.HUD.messageMapStartedIn);
    if (mapToIndex != -1 && mapToIndex > startIndex){
        haltMessage = true;
    }
    */
    if (sm == "firstGem" && mapTo == "split"){ //special case where message will be reapeated again upon reentering the room
        haltMessage = true;
    }
    if (sm == "beforeFinal" && mapTo == "finalArena"){
        haltMessage = true;
    }
    
    if (haltMessage){
        FullGame.HUD.haltMsg(false);
    }
};

/* Called when player dies
 * Should be used to alter Vars.messagesSaid instead of displaying a message */
FullGame.Messages.onPlayerDeath = function() {
    
    FullGame.HUD.haltMsg(true);
    
    var sm = FullGame.Vars.startMap;
    var lm = FullGame.Vars.lastMap;
    var vms = FullGame.Vars.messagesSaid;
    var hasPower = (FullGame.Vars.playerLaserType == FullGame.Til.LASER_THICK);
    
    //if went in rooms in correct order, get rid of opening message
    var lastIndex = FullGame.rooms.indexOf(lm);
    var startIndex = FullGame.rooms.indexOf(sm);
    var index = 0;
    if (lastIndex != -1 && startIndex > lastIndex){
        index = FullGame.Vars.messagesSaid.indexOf(sm);
        if (index != -1){
            FullGame.Vars.messagesSaid.splice(index, 1);
        }
        index = FullGame.Vars.messagesSaid.indexOf(sm+"doorOpen");
        if (index != -1){
            FullGame.Vars.messagesSaid.splice(index, 1);
        }
    }
    
    //special cases
    if (sm == "keyRoom" && hasPower){
        index = FullGame.Vars.messagesSaid.indexOf("keyRoomPower");
        if (index != -1){
            FullGame.Vars.messagesSaid.splice(index, 1);
        }
    }
};

FullGame.Messages.textFile = "";
//retruns true if message found, false otherwise
FullGame.Messages.msgFromText = function(label) {
    //label identified with % symbol on left and right
    var index = this.textFile.indexOf('%' + label + '%');
    if (index == -1) return false;
    var left = this.textFile.indexOf('(', index);
    var right = this.textFile.indexOf(')', left);
    var msgName = this.textFile.substring(left+1, right);
    left = this.textFile.indexOf('[', right);
    right = this.textFile.indexOf(']', left);
    var msg = this.textFile.substring(left+1, right);
    var msgs = msg.split("\r\n\r\n");
    
    
    FullGame.HUD.msg(msgs, msgName);
    return true;
};