//returns made colorchip, but doesn't add it to FullGame.GI.objs (will be done in ParseObjects)
FullGame.makeColorchip = function(cx, cy, color, laserType) {
    
    var c;
    var spriteKey;
    switch (color){
    case FullGame.Til.RED:
        spriteKey = "colorchip_red";
        break;
    case FullGame.Til.GREEN:
        spriteKey = "colorchip_green";
        break;
    case FullGame.Til.BLUE:
    default:
        spriteKey = "colorchip_blue";
    }
    if (laserType == FullGame.Til.LASER_THICK){
        spriteKey = "powerchip_red";
    }
    c = game.add.sprite(cx, cy, spriteKey, undefined, FullGame.GI.objGroup);
    c.anchor.setTo(.5, .5); //sprite is centered
    
    c.animations.add("glow", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 20, true);
    c.animations.add("noGlow", [0], 20, true);
    c.color = color;
    c.laserType = laserType;
    c.isColorchip = true;
    c.startX = c.x;
    c.startY = c.y;
    c.t = 0;
    c.firstFrameCheck = true;
    
    c.BOB_SPEED = 3;
    c.BOB_DIST = 6;
    c.USED_ALPHA = .3;
    
    //make not usable by default, first frame check will make it usable if player is a different color
    c.animations.play("noGlow");
    c.alpha = c.USED_ALPHA;
    c.usable = false;
    
    c.update = function() {
        
        var dt = game.time.physicsElapsed;
        var plr = FullGame.GI.player;
        
        if (this.firstFrameCheck){
            if (plr != null){
                if (plr.laserType != FullGame.Til.LASER_THICK &&
                    (plr.laserColor != this.color || this.laserType == FullGame.Til.LASER_THICK)){
                    this.makeUsable();
                }
            }
            this.firstFrameCheck = false;
        }
        
        //bob up and down
        this.t += dt;
        this.x = this.startX;
        this.y = this.startY + this.BOB_DIST/2 * Math.sin(this.t * this.BOB_SPEED);
        
        //check if should be used by player
        if (this.usable && plr != null && plr.state == plr.STATE_NORMAL && plr.behavior == "none"){
            if ((plr.x-this.x)*(plr.x-this.x) + (plr.y-this.y)*(plr.y-this.y) <
                (plr.RADIUS+this.width/2)*(plr.RADIUS+this.width/2)){
                this.useColorchip();
            }
        }
        
    };
    
    c.useColorchip = function() {
        if (this.laserType == FullGame.Til.LASER_THICK){
            FullGame.playSFX("powerchip");
            FullGame.Vars.playerLaserColor = this.color;
            FullGame.Vars.playerLaserType = this.laserType;
            
            var plr = FullGame.GI.player;
            if (plr != null){
                plr.getPoweredUp();
            }
            
            //update HUD
            FullGame.HUD.setReticle(this.laserType, this.color);
            
        } else {
            FullGame.playSFX("colorchip");
            FullGame.Vars.playerLaserColor = this.color;
            FullGame.Vars.playerLaserType = this.laserType;
            FullGame.GI.recreatePlayerAtFrameEnd = true;
            
            //update HUD
            FullGame.HUD.setReticle(this.laserType, this.color);
        }
        
        //make this and other colorchips usable/unusable
        for (var i=0; i<FullGame.GI.objs.length; i++){
            var obj = FullGame.GI.objs[i];
            if (obj.isColorchip == undefined || !obj.isColorchip) continue;
            if (obj.color == this.color &&
                obj.laserType == this.laserType){
                obj.animations.play("noGlow");
                obj.alpha = this.USED_ALPHA;
                obj.usable = false;
            } else {
                obj.makeUsable();
            }
        }
        
    };
    
    //called when colorchip is a different color than the player
    c.makeUsable = function() {
        if (this.usable) return;
        this.animations.play("glow");
        this.alpha = 1;
        this.usable = true;
    };
    
    c.afterCollision = function() {
        
       
    };
    
    return c;
};