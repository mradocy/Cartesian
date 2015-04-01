//returns made eyebot, but doesn't add it to FullGame.GI.objs (will be done in ParseObjects)
/* coating can be "allblack", "normal", "allwhite"
 */
FullGame.makeEyebot = function(x, y, laserColor, coating) {
    
    var eb;
    var spriteKey;
    var deathParticleKey;
    var frontColor;
    var backColor;
    var backSpread = 45 *Math.PI/180;
    switch (laserColor){
    case FullGame.Til.BLUE:
        if (coating == "normal" || true){
            spriteKey = "eyebot_blue";
            frontColor = FullGame.Til.WHITE;
            backColor = FullGame.Til.BLACK;
        }
        deathParticleKey = "player_blue_death_particle";
        break;
    case FullGame.Til.GREEN:
        if (coating == "normal" || true){
            spriteKey = "eyebot_green";
            frontColor = FullGame.Til.WHITE;
            backColor = FullGame.Til.BLACK;
        }
        deathParticleKey = "player_green_death_particle";
        break;
    case FullGame.Til.RED:
    default:
        if (coating == "normal" || true){
            spriteKey = "eyebot_red";
            frontColor = FullGame.Til.WHITE;
            backColor = FullGame.Til.BLACK;
        }
        deathParticleKey = "player_red_death_particle";
    }
    eb = game.add.sprite(x, y, spriteKey, undefined, FullGame.GI.objGroup);
    eb.anchor.setTo(.5, .5); //sprite is centered
    eb.scale.set(.5, .5);
    eb.isEyebot = true;
    eb.laserColor = laserColor;
    eb.laserType = FullGame.Til.LASER_TRANSPARENT; //this will change based on the player's laser color
    eb.frontColor = frontColor;
    eb.backColor = backColor;
    eb.backSpread = backSpread; //size, in radians, of the back color of the eyebot
    eb.deathParticleKey = deathParticleKey;
    
    eb.initialSet = false; //so points at player at start
    eb.damageDuration = 0; //how long laser has pointed at volnurable part of eyebot
    eb.takeDamageThisFrame = false;
    eb.dead = false;
    eb.rs = 0; //rotate speed
    eb.dx = 0;
    eb.dy = 0;
    eb.dr = 0;
    
    eb.RADIUS = 24;
    eb.FIRE_OFFSET = 0;
    eb.ROTATION_SPEED = 90 * Math.PI/180; //max rotation speed
    eb.OSCIL_FORCE = 28;
    eb.DAMP_FORCE = 5;
    eb.DURATION_DAMAGE_FOR_DEATH = .1;
    
    eb.update = function() {
        
        var dt = game.time.physicsElapsed;
        var plr = FullGame.GI.player;
        
        if (this.dead) return;
        if (plr == null){
            return;
        }
        
        //adjust laser type based on if player laser color is the same or not
        if (plr.laserColor == this.laserColor){
            this.laserType = FullGame.Til.LASER_TRANSPARENT;
        } else {
            this.laserType = FullGame.Til.LASER_NORMAL;
        }
        
        var targetRot = Math.atan2(plr.y - this.y, plr.x - this.x);
        if (!this.initialSet){
            this.rotation = targetRot;
            this.initialSet = true;
        }
        
        var diff = targetRot - this.rotation;
        while (diff > Math.PI) diff -= Math.PI*2;
        while (diff < -Math.PI) diff += Math.PI*2;
        
        var accel = this.OSCIL_FORCE * diff - this.DAMP_FORCE * this.rs;
        this.rs += accel * dt;
        this.rs = Math.max(-this.ROTATION_SPEED, Math.min(this.ROTATION_SPEED, this.rs));
        
        this.dr = this.rs * dt;
        
        this.rotation += this.dr;
        
        if (this.takeDamageThisFrame){
            this.damageDuration += dt;
            
            if (this.damageDuration >= this.DURATION_DAMAGE_FOR_DEATH){
                this.dead = true;
                this.visible = false;
                FullGame.playSFX("damage_flesh");
                FullGame.playSFX("eyebot_death");
                
                for (var i=0; i<8; i++){
                    var part = game.add.sprite(this.x, this.y, this.deathParticleKey, undefined, FullGame.GI.objGroup);
                    part.anchor.setTo(.5, .5); //sprite is centered
                    part.vx = (Math.random()*2-1)*200;
                    part.vy = Math.random()*-200;
                    part.rotation = Math.random()*Math.PI*2;
                    part.rotationSpeed = (Math.random()*2-1)*10;
                    part.gravity = 500;
                    part.lifespan = 1000* (1 + 1*Math.random());
                    part.update = function() {
                        var dt = game.time.physicsElapsed;
                        this.rotation += this.rotationSpeed * dt;
                        this.vy += this.gravity * dt;
                        this.x += this.vx * dt;
                        this.y += this.vy * dt;
                    };
                }
                
                
            }
            
            this.takeDamageThisFrame = false;
        } else {
            this.damageDuration = 0;
        }
        
    };
    
    eb.afterCollision = function() {
        if (this.dead) return;
        //fire laser
        var cos = Math.cos(this.rotation+this.dr);
        var sin = Math.sin(this.rotation+this.dr);
        FullGame.Lasers.fireLaser(
            this.x+this.dx + this.FIRE_OFFSET*cos, this.y+this.dy + this.FIRE_OFFSET*sin,
            cos, sin,
            this.laserColor, this.laserType);
    };
    
    //gets the color the laser would hit based on the normal angle
    eb.colorHit = function(angle) {
        var diff = angle - this.rotation;
        while (diff > Math.PI) diff -= Math.PI*2;
        while (diff < -Math.PI) diff += Math.PI*2;
        if (this.backSpread == 0 || Math.abs(diff) < Math.PI - this.backSpread){
            return this.frontColor;
        } else {
            return this.backColor;
        }
    };
    
    //call this every frame laser is pointed at volnerable part
    eb.damage = function() {
        if (!this.dead){
            this.takeDamageThisFrame = true;
        }
    };
    
    return eb;
};