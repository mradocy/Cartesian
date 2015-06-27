//returns made orb and glow, but doesn't add them to FullGame.GI.objs (will be done in ParseObjects)
FullGame.makeOrb = function(game, colorFromTiled, blackWhenPower) {
    //initialization
    var orb;
    var glow;
    var spriteKey;
    var glowSpriteKey;
    var color = colorFromTiled;
    if (blackWhenPower && FullGame.Vars.playerLaserType == FullGame.Til.LASER_THICK){
        color = FullGame.Til.BLACK;
    }
    switch (color){
    case FullGame.Til.BLUE:
        spriteKey = "orb_blue";
        glowSpriteKey = "orb_blue_glow";
        break;
    case FullGame.Til.GREEN:
        spriteKey = "orb_green";
        glowSpriteKey = "orb_green_glow";
        break;
    case FullGame.Til.BLACK:
        spriteKey = "orb_black";
        glowSpriteKey = "orb_black_glow";
        break;
    case FullGame.Til.RED:
    default:
        spriteKey = "orb_red";
        glowSpriteKey = "orb_red_glow";
    }
    glow = game.add.sprite(0, 0, glowSpriteKey, undefined, FullGame.GI.objGroup);
    orb = game.add.sprite(0, 0, spriteKey, undefined, FullGame.GI.objGroup);
    
    //constants
    orb.LASER_ACTIVATE_DURATION = .6; //how long orb has laser pointed at it for it to "activate"
    orb.LASER_DEACTIVATE_DURATION = .3; //how fast an orb will be deactivated when not pointed at by laser
    
    orb.anchor.setTo(.5, .5); //sprite is centered
    orb.scale.set(.5, .5);
    glow.anchor.setTo(.5, .5); //sprite is centered
    glow.scale.set(.5, .5);
    glow.alpha = 0;
    
    orb.type = "orb";
    orb.glow = glow;
    orb.color = color;
    orb.radius = 28;
    orb.x = 0;
    orb.y = 0;
    orb.glowThisFrame = false; //set to true each frame orb is supposed to glow
    orb.halfGlowThisFrame = false; //set to true each frame orb has just a transparent laser going through it
    orb.HALF_GLOW_MECHANIC_EXISTS = false;
    orb.openedDoors = false;
    orb.setX = function(x) {
        this.x = x;
        this.glow.x = x;
    };
    orb.setY = function(y) {
        this.y = y;
        this.glow.y = y;
    };
    
    orb.activated = function() {
        return (this.glow.alpha >= 1);
    };
    
    orb.update = function() {
        var dt = game.time.physicsElapsed;
        
        //handle glow
        if (this.glowThisFrame){
            this.glow.alpha = Math.min(1, this.glow.alpha + dt / this.LASER_ACTIVATE_DURATION);
            this.glowThisFrame = false;
        } else {
            this.glow.alpha = Math.max(0, this.glow.alpha - dt / this.LASER_DEACTIVATE_DURATION);
        }
        this.halfGlowThisFrame = false;
        
        //check if should open doors
        if (!this.openedDoors && this.activated()){
            var allActivated = true;
            for (var i=0; i<FullGame.GI.orbs.length; i++){
                var orb = FullGame.GI.orbs[i];
                if (orb.color != this.color) continue;
                if (!orb.activated())
                    allActivated = false;
            }
            if (allActivated){
                //open doors of the same color
                for (var i=0; i<FullGame.GI.objs.length; i++){
                    var door = FullGame.GI.objs[i];
                    if (door.type == undefined || door.type != "door") continue;
                    if (door.color != this.color) continue;
                    if (door.opening) continue;
                    door.open();
                }
                //the orbs can't be used again
                for (var i=0; i<FullGame.GI.orbs.length; i++){
                    var orb = FullGame.GI.orbs[i];
                    if (orb.color != this.color) continue;
                    orb.openedDoors = true;
                }
            }
        }
    };
    
    
    return {orb:orb, glow:glow};
};