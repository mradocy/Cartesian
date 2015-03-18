//contains all the dialogue
FullGame.Messages = {
    LEVEL_START_MESSAGE_DELAY:1.0
};

//called a bit after starting a level
FullGame.Messages.onLevelStart = function() {
    var msg = "";
    var msgs = [];
    var msgName = "";
    var sm = FullGame.Vars.startMap;
    var lm = FullGame.Vars.lastMap;
    var vms = FullGame.Vars.messagesSaid;
    
    if (sm == "firstLevel" && vms.indexOf(sm) == -1){
        this.msgFromText(sm);
        vms.push(sm); //ensures message won't be said again
    } else if (sm == "firstOrb" && vms.indexOf(sm) == -1){
        this.msgFromText(sm);
        vms.push(sm); //ensures message won't be said again
    } else if (sm == "redEyebot" && vms.indexOf(sm) == -1){
        this.msgFromText(sm);
        vms.push(sm); //ensures message won't be said again
    } else if (sm == "trapped2" && vms.indexOf(sm) == -1){
        this.msgFromText(sm);
        
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
            msg = "Your current time is " + mins + ":";
            if (secs < 10) msg += "0";
            msg += secs + "!  That's incredible!";
        }
        msgs.push(msg);
        msg = "Keep up the good work little robot.  You are certainly proving your worth.";
        msgs.push(msg);
        
        FullGame.HUD.msg(msgs, msgName); //display message
        
        vms.push(sm); //ensures message won't be said again
    }
    
    //message when backtracking
    if (FullGame.rooms.indexOf(lm) > FullGame.rooms.indexOf(sm) && vms.indexOf("backtrack") == -1 &&
        (sm=="firstMultReflect" || sm=="firstSpring" || sm=="firstGlass" || sm=="firstMultOrb" || sm=="firstSand")){
        
        this.msgFromText("backtrack");
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
    
    if (sm == "firstReflect" && vms.indexOf(sm+"doorOpen") == -1){
        
        this.msgFromText(sm);
        vms.push(sm+"doorOpen"); //ensures message won't be said again
        
    } else if (sm == "firstMultReflect" && vms.indexOf(sm+"doorOpen") == -1){
        
        this.msgFromText(sm);
        vms.push(sm+"doorOpen"); //ensures message won't be said again
        
    } else if (sm == "firstSpring" && vms.indexOf(sm+"doorOpen") == -1){
        
        this.msgFromText(sm);
        vms.push(sm+"doorOpen"); //ensures message won't be said again
        
    } else if (sm == "firstGlass" && vms.indexOf(sm+"doorOpen") == -1){
        
        this.msgFromText(sm);
        vms.push(sm+"doorOpen"); //ensures message won't be said again
        
    } else if (sm == "firstMultOrb" && vms.indexOf(sm+"doorOpen") == -1){
        
        this.msgFromText(sm);
        vms.push(sm+"doorOpen"); //ensures message won't be said again
        
    } else if (sm == "firstSand" && vms.indexOf(sm+"doorOpen") == -1){
        
        this.msgFromText(sm);
        vms.push(sm+"doorOpen"); //ensures message won't be said again
        
    } else if (sm == "numbers" && vms.indexOf(sm+"doorOpen") == -1){
        
        this.msgFromText(sm);
        vms.push(sm+"doorOpen"); //ensures message won't be said again
        
    } else if ((sm == "platforming1" || sm == "secret1") && vms.indexOf("platforming1"+"doorOpen") == -1){
        
        this.msgFromText("platforming1");
        vms.push("platforming1"+"doorOpen"); //ensures message won't be said again
        
    }
    
    if (msgs.length == 0){
        if (msg == "")
            return;
        msgs.push(msg);
    }
    FullGame.HUD.msg(msgs, msgName);
    
};

/* Called when leaving a level.
 * Should be used to make sure messages don't get repeated when reentering a level */
FullGame.Messages.onLevelLeave = function(mapTo) {
    var sm = FullGame.Vars.startMap;
    var lm = FullGame.Vars.lastMap;
    var vms = FullGame.Vars.messagesSaid;
    
    var haltMessage = false;
    //cease message if going to another map (but not to a previous map)
    var mapToIndex = FullGame.rooms.indexOf(mapTo);
    var startIndex = FullGame.rooms.indexOf(FullGame.HUD.messageMapStartedIn);
    if (mapToIndex != -1 && mapToIndex > startIndex){
        haltMessage = true;
    }
    haltMessage = false;
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
    
    //if went in rooms in correct order, get rid of opening message
    var lastIndex = FullGame.rooms.indexOf(lm);
    var startIndex = FullGame.rooms.indexOf(sm);
    if (lastIndex != -1 && startIndex > lastIndex){
        var index = FullGame.Vars.messagesSaid.indexOf(sm);
        if (index != -1){
            FullGame.Vars.messagesSaid.splice(index, 1);
        }
        index = FullGame.Vars.messagesSaid.indexOf(sm+"doorOpen");
        if (index != -1){
            FullGame.Vars.messagesSaid.splice(index, 1);
        }
    }
};

FullGame.Messages.textFile = "";
FullGame.Messages.msgFromText = function(label) {
    //label identified with % symbol on left and right
    var index = this.textFile.indexOf('%' + label + '%');
    var left = this.textFile.indexOf('(', index);
    var right = this.textFile.indexOf(')', left);
    var msgName = this.textFile.substring(left+1, right);
    left = this.textFile.indexOf('[', right);
    right = this.textFile.indexOf(']', left);
    var msg = this.textFile.substring(left+1, right);
    var msgs = msg.split("\r\n\r\n");
    
    
    FullGame.HUD.msg(msgs, msgName);
};