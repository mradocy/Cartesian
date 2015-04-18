//returns made doors, but doesn't add them to FullGame.GI.miscObjs (will be done in ParseObjects)
FullGame.makeExit = function(x, y, width, height, playerBehavior, mapTo) {
    
    var exit = {
        x:x,
        y:y,
        width:width,
        height:height,
        playerBehavior:playerBehavior,
        mapTo:mapTo,
        fadeOutMusic:false,
        alreadyTriggered:false,
        update: function() {
            if (this.alreadyTriggered) return;
            if (this.mapTo == "") return;
            if (FullGame.GI.player == undefined) return;
            var plr = FullGame.GI.player;
            if (plr.behavior != "" && plr.behavior != "none") return;
            if (plr.dead()) return;
            if ((this.playerBehavior == "springJumpLeft" || this.playerBehavior == "springJumpRight") &&
                !plr.springJumping) return;
            var hw = 24;
            var hh = 20;
            if (this.x < plr.x+hw && plr.x-hw < this.x+this.width &&
                this.y < plr.y+hh && plr.y-hh < this.y+this.height){
                
                plr.setBehavior(playerBehavior);
                plr.startLevelAfterDuration(this.mapTo, FullGame.HUD.BLACK_SCREEN_FADE_DURATION);
                FullGame.HUD.fadeOut();
                if (this.fadeOutMusic){
                    FullGame.fadeOutMusic(FullGame.HUD.BLACK_SCREEN_FADE_DURATION);
                }
                
                FullGame.Messages.onLevelLeave(this.mapTo);
                
                this.alreadyTriggered = true;
            }
        }
    };
    
    return exit;
};