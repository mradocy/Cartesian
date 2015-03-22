//returns made roplate, but doesn't add it to FullGame.GI.objs (will be done in ParseObjects)
FullGame.makeRoplate = function(cx, cy, rotation, color1, color2) {
    
    var rp;
    var spriteKey;
    switch (color1){
    case FullGame.Til.RED:
        spriteKey = "roplate_red";
        break;
    case FullGame.Til.GREEN:
        spriteKey = "roplate_green";
        break;
    case FullGame.Til.BLUE:
    default:
        spriteKey = "roplate_blue";
    }
    rp = game.add.sprite(cx, cy, spriteKey, undefined, FullGame.GI.objGroup);
    rp.anchor.setTo(.5, .5); //sprite is centered
    rp.rotation = rotation;
    rp.color1 = color1;
    rp.color2 = color2;
    rp.WIDTH = 115;
    rp.HEIGHT = 9;
    rp.isRoplate = true;
    
    
    rp.laserLines = [{x0:0, y0:0, x1:0, y1:0, color:color1},
                     {x0:0, y0:0, x1:0, y1:0, color:color1}, //side color 1
                     {x0:0, y0:0, x1:0, y1:0, color:color2}, //side color 2
                     {x0:0, y0:0, x1:0, y1:0, color:color2},
                     {x0:0, y0:0, x1:0, y1:0, color:color2}, //side color 2
                     {x0:0, y0:0, x1:0, y1:0, color:color1}  //side color 1
                     ];
    
    rp.setLaserLines = function(angle, width, height) {
        var hw = width/2;
        var hh = height/2;
        var x0 = -hw * Math.cos(angle) +hh * Math.sin(angle);
        var y0 = -hw * Math.sin(angle) -hh * Math.cos(angle);
        var x1 = hw * Math.cos(angle) +hh * Math.sin(angle);
        var y1 = hw * Math.sin(angle) -hh * Math.cos(angle);
        var x2 = hw * Math.cos(angle) - hh * Math.sin(angle);
        var y2 = hw * Math.sin(angle) + hh * Math.cos(angle);
        var x3 = -hw * Math.cos(angle) - hh * Math.sin(angle);
        var y3 = -hw * Math.sin(angle) + hh * Math.cos(angle);
        this.laserLines[0].x0 = x0;
        this.laserLines[0].y0 = y0;
        this.laserLines[0].x1 = x1;
        this.laserLines[0].y1 = y1;
        this.laserLines[1].x0 = x1;
        this.laserLines[1].y0 = y1;
        this.laserLines[1].x1 = (x1+x2)/2;
        this.laserLines[1].y1 = (y1+y2)/2;
        this.laserLines[2].x0 = (x1+x2)/2;
        this.laserLines[2].y0 = (y1+y2)/2;
        this.laserLines[2].x1 = x2;
        this.laserLines[2].y1 = y2;
        this.laserLines[3].x0 = x2;
        this.laserLines[3].y0 = y2;
        this.laserLines[3].x1 = x3;
        this.laserLines[3].y1 = y3;
        this.laserLines[4].x0 = x3;
        this.laserLines[4].y0 = y3;
        this.laserLines[4].x1 = (x3+x0)/2;
        this.laserLines[4].y1 = (y3+y0)/2;
        this.laserLines[5].x0 = (x3+x0)/2;
        this.laserLines[5].y0 = (y3+y0)/2;
        this.laserLines[5].x1 = x0;
        this.laserLines[5].y1 = y0;
    };
    rp.setLaserLines(rotation, rp.WIDTH, rp.HEIGHT);
    
    rp.NORMAL_LASER_MAX_ACCEL = 4; //accel 
    rp.MAX_SPEED = 1; // rad/second
    rp.FRICTION = 2; //only applied when no force acting on it
    rp.speed = 0; //rotation speed
    rp.forceApplied = false;
    
    rp.applyForce = function(x, y, angle) {
        var dt = game.time.physicsElapsed;
        var dist = Math.sqrt((x-this.x)*(x-this.x) + (y-this.y)*(y-this.y));
        var diff = Math.atan2(y-this.y, x-this.x) - this.rotation;
        while (diff > Math.PI) diff -= Math.PI*2;
        while (diff < -Math.PI) diff += Math.PI*2;
        if (Math.abs(diff) > Math.PI/2)
            dist *= -1;
        var distRatio = Math.min(1, Math.max(-1, dist / (this.WIDTH/2)));
        //projecting force vector onto the normal of the roplate
        var nx = Math.cos(this.rotation + Math.PI/2);
        var ny = Math.sin(this.rotation + Math.PI/2);
        // a dot b a
        var normRatio =
            (nx * Math.cos(angle) +
             ny * Math.sin(angle));
        this.speed += normRatio * rp.NORMAL_LASER_MAX_ACCEL * dt * distRatio;
        this.forceApplied = true;
    };
    
    rp.applyThickForce = function(x, y, angle) {
        this.applyForce(x, y, angle);
        this.applyForce(x, y, angle);
    };
    
    rp.update = function() {
        
        var dt = game.time.physicsElapsed;
        
        if (!this.forceApplied){
            if (this.speed > 0){
                this.speed = Math.max(0, this.speed - this.FRICTION * dt);
            } else {
                this.speed = Math.min(0, this.speed + this.FRICTION * dt);
            }
        }
        this.forceApplied = false;
        this.speed = Math.max(-this.MAX_SPEED, Math.min(this.MAX_SPEED, this.speed));
        
        this.rotation += this.speed * dt;
        this.setLaserLines(this.rotation, this.WIDTH, this.HEIGHT);
        
    };
    
    rp.afterCollision = function() {
        
       
    };
    
    return rp;
};