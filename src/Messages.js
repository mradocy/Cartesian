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
        msg = "That was quite the fall, Sibro!  "
        msg += "Try moving around a bit to make sure everything is still functioning.";
        msgs.push(msg);
        
        msg = "It seems that's the case.  You're equipped with self-repair micro-machines, ";
        msg += "so you'll be fine as long as you don't get hurt too badly.";
        msgs.push(msg);
        
        msg = "Ha, look at me talking with a robot.  ";
        msg += "I didn't think being alone in this room would make me go crazy that fast.  ";
        msg += "But with you walking around, there's still some hope for us!";
        msgs.push(msg);
        
        msgName = "Baz";
        
        vms.push(sm); //ensures message won't be said again
        
    } else if (sm == "firstOrb" && vms.indexOf(sm) == -1){
        msg = "I'm stuck in this room with really tall crystal walls; I don't know where the other guys are.  "
        msg += "Do you see anything like that around?  I can't say how far away you are from where we dropped in. ";
        msgs.push(msg);
        
        msg = "It seems most of the walls here are impervious to your current laser.  ";
        msg += "But try shooting it at things that look interesting anyway.  ";
        msg += "That's always worked for us in the past, hasn't it?";
        msgs.push(msg);
        
        msgName = "Baz";
        
        vms.push(sm); //ensures message won't be said again
        
    } else if (sm == "redEyebot" && vms.indexOf(sm) == -1){
        msg = "We saw some intriguing eye-like creatures on our way in, but they seemed pretty harmless.  ";
        msg += "My theory is they were the ones that created these passages.";
        msgs.push(msg);
        
        msg = "It must have been pretty hard, like without limbs and all.  ";
        msg += "The inability to move probably didn't help either.  ";
        msg += "On second thought, it seems they'd be really lousy workers, huh?  Hmm...";
        msgs.push(msg);
        
        msgName = "Baz";
        
        vms.push(sm); //ensures message won't be said again
        
    } else if (sm == "firstReflect" && vms.indexOf(sm) == -1){
        
    }
    
    
    if (msgs.length == 0){
        if (msg == "")
            return;
        msgs.push(msg);
    }
    FullGame.HUD.msg(msgs, msgName);
};

FullGame.Messages.onDoorOpen = function() {
    var msg = "";
    var msgs = [];
    var msgName = "";
    var sm = FullGame.Vars.startMap;
    var lm = FullGame.Vars.lastMap;
    var vms = FullGame.Vars.messagesSaid;
    
    if (sm == "firstReflect" && vms.indexOf(sm+"doorOpen") == -1){
        
        msg = "A reminder: use ESC or ENTER to refresh yourself if you need it.";
        msgs.push(msg);
        
        msg = "Well with nothing better to do, I guess I'll lie down myself.  Ahh...\n";
        msg += "                    \n";
        msg += "Wait, what is this red circular thing on the ceiling?";
        msgs.push(msg);
        
        msgName = "Baz";
        
        vms.push(sm+"doorOpen"); //ensures message won't be said again
        
    } else if (sm == "firstMultReflect" && vms.indexOf(sm+"doorOpen") == -1){
        
        msg = "Hey Sibro, check out what I discovered!  ";
        msg += "By pointing my laser pistol at this orb up there, ";
        msg += "I was able to open the door leading out of my room!  Wow!";
        msgs.push(msg);
        
        msg = "Impressive how quickly I was able to escape, isn't it?  ";
        msg += "Try doing something similar if you come across an orb like that!\n";
        msg += "Anyway, I'm going to take a look around.";
        msgs.push(msg);
        
        msgName = "Baz";
        
        vms.push(sm+"doorOpen"); //ensures message won't be said again
        
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
    
    //cease message if going to another map (but not to a previous map)
    var mapToIndex = FullGame.rooms.indexOf(mapTo);
    var startIndex = FullGame.rooms.indexOf(FullGame.HUD.messageMapStartedIn);
    if (mapToIndex != -1 && mapToIndex > startIndex){
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