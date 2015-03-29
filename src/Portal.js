//returns made portal, but doesn't add it to FullGame.GI.objs (will be done in ParseObjects)
FullGame.makePortal = function(cx, cy, name, portalTo, mapTo) {
    
    var p;
    var spriteKey = "portal";
    p = game.add.sprite(cx, cy, spriteKey, undefined, FullGame.GI.objGroup);
    p.anchor.setTo(.5, .5); //sprite is centered
    
    p.animations.add("animate", [0, 1, 2, 3, 4, 5, 6, 7, 8], 30, true);
    p.animations.play("animate");
    p.isPortal = true;
    if (name == undefined)
        p.name = "";
    else
        p.name = name;
    if (portalTo == undefined)
        p.portalToName = "";
    else
        p.portalToName = portalTo;
    p.portalTo = null; //will be found first frame
    if (mapTo == undefined)
        p.mapTo = "";
    else
        p.mapTo = mapTo;
    p.portalToFirstFrameCheck = true;
    p.RADIUS = 18;
    
    p.teleportTime = 0;
    p.TELEPORT_ENABLE_DELAY = .6; //amount of time since level started or teleporter used until it can be used again
    p.PLAYER_TELEPORT_RADIUS = 35; //how far away center of player is to trigger teleport
    
    p.update = function() {
        
        var dt = game.time.physicsElapsed;
        var plr = FullGame.GI.player;
        
        //find portal to link to
        if (this.portalToFirstFrameCheck){
            if (this.mapTo != ""){
                //will teleport to another map; just hope it exists
            } else if (FullGame.GI.portals.length == 2){
                //if only 2 portals, automatically choose the other one
                if (FullGame.GI.portals[0] == this)
                    this.portalTo = FullGame.GI.portals[1];
                else
                    this.portalTo = FullGame.GI.portals[0];
            } else if (this.portalToName != ""){
                for (var i=0; i<FullGame.GI.portals.length; i++){
                    var por = FullGame.GI.portals[i];
                    if (por == this) continue;
                    if (por.name == this.portalToName){
                        this.portalTo = por;
                        break;
                    }
                }
            } else {
                console.log("WARNING: portal named " + this.name + " not linked to another portal.");
            }
            this.portalToFirstFrameCheck = false;
        }
        
        this.teleportTime += dt;
        
        if (this.teleportTime >= this.TELEPORT_ENABLE_DELAY){
            //check if can teleport player
            if (plr != null && !plr.dead()){
                if ((plr.x-this.x)*(plr.x-this.x) + (plr.y-this.y)*(plr.y-this.y) <
                    this.PLAYER_TELEPORT_RADIUS*this.PLAYER_TELEPORT_RADIUS){
                    //teleport player
                    if (this.mapTo != ""){
                        FullGame.playSFX("teleport");
                        plr.setBehavior("portal");
                        plr.startLevelAfterDuration(this.mapTo, FullGame.HUD.BLACK_SCREEN_FADE_DURATION);
                        FullGame.HUD.fadeOut();
                        
                        FullGame.Messages.onLevelLeave(this.mapTo);
                        
                        this.teleportTime = 0;
                        
                    } else if (this.portalTo != null){
                        FullGame.playSFX("teleport");
                        plr.teleport(this.portalTo.x, this.portalTo.y);
                        this.teleportTime = 0;
                        this.portalTo.teleportTime = 0;
                        
                    }
                }
            }
        }
        
    };
    
    p.afterCollision = function() {
        
       
    };
    
    return p;
};