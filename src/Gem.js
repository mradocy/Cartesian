//returns made gem, but doesn't add them to FullGame.GI.objs (will be done in ParseObjects)
FullGame.makeGem = function(cx, cy, color) {
    //initialization
    var gem;
    var spriteKey;
    switch (color){
    case FullGame.Til.BLUE:
        spriteKey = "gem_blue";
        break;
    case FullGame.Til.GREEN:
        spriteKey = "gem_green";
        break;
    case FullGame.Til.RED:
    default:
        spriteKey = "gem_red";
    }
    gem = game.add.sprite(cx, cy, spriteKey, undefined, FullGame.GI.objGroup);
    gem.anchor.setTo(.5, .5); //sprite is centered
    gem.color = color;
    gem.radius = 25;
    gem.isGem = true;
    gem.lasersSpawnedThisFrame = 0;
    gem.MAX_LASERS_SPAWNED = 50;
    
    //argument is where the laser that passed through intersected the circle
    gem.spawnLasers = function(laserColor, laserType, x0, y0, x1, y1) {
        if (this.lasersSpawnedThisFrame >= this.MAX_LASERS_SPAWNED)
            return;
        if (laserColor != color) return;
        if (laserType == FullGame.Til.LASER_FADEOUT) return;
        
        //positioning
        var x = (x0 + x1) / 2;
        var y = (y0 + y1) / 2;
        var angle = Math.atan2(y1-y0, x1-x0) + Math.PI/2;
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        
        //fire lasers
        this.lasersSpawnedThisFrame += 2;
        FullGame.Lasers.fireLaser(
            x, y,
            cos, sin,
            laserColor, laserType);
        FullGame.Lasers.fireLaser(
            x, y,
            -cos, -sin,
            laserColor, laserType);
        
    };
    
    gem.update = function() {
        var dt = game.time.physicsElapsed;
        
        this.lasersSpawnedThisFrame = 0;
    };
    
    
    return gem;
};