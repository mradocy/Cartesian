//returns made slider, but doesn't add it to FullGame.GI.objs (will be done in ParseObjects)
FullGame.makeSlider = function(cx, cy, color) {
    
    var sl;
    var spriteKey;
    switch (color){
    case FullGame.Til.RED:
        spriteKey = "slider_red";
        break;
    case FullGame.Til.GREEN:
        spriteKey = "slider_green";
        break;
    case FullGame.Til.BLUE:
    default:
        spriteKey = "slider_blue";
    }
    sl = game.add.sprite(cx, cy, spriteKey, undefined, FullGame.GI.objGroup);
    sl.anchor.setTo(.5, .5); //sprite is centered
    game.physics.enable(sl, Phaser.Physics.ARCADE);
    sl.body.immovable = true;
    sl.color = color;
    sl.WIDTH = 115;
    sl.HEIGHT = 59;
    sl.isSlider = true;
    sl.pathName = "";
    sl.searchedForPath = false;
    sl.path = null;
    sl.pathDist = 0; //distance along the path
    sl.pathP1 = {x:0, y:0}; //two points of the path the slider is between
    sl.pathP2 = {x:0, y:0};
    
    sl.laserLines = [
        {x0:-sl.WIDTH/2, y0:-sl.HEIGHT/2, x1:sl.WIDTH/2, y1:-sl.HEIGHT/2, color:color},
        {x0:sl.WIDTH/2, y0:-sl.HEIGHT/2, x1:sl.WIDTH/2, y1:sl.HEIGHT/2, color:color},
        {x0:sl.WIDTH/2, y0:sl.HEIGHT/2, x1:-sl.WIDTH/2, y1:sl.HEIGHT/2, color:color},
        {x0:-sl.WIDTH/2, y0:sl.HEIGHT/2, x1:-sl.WIDTH/2, y1:-sl.HEIGHT/2, color:color},
        ];
    
    sl.NORMAL_LASER_MAX_ACCEL = 500;
    sl.MAX_SPEED = 100;
    sl.FRICTION = 500; //only applied when no force acting on it
    sl.forceApplied = false;
    
    sl.applyForce = function(edgeNormal, angle) {
        var dt = game.time.physicsElapsed;
        /*
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
        */
    };
    
    sl.applyThickForce = function(edgeNormal, angle) {
        this.applyForce(edgeNormal, angle);
        this.applyForce(edgeNormal, angle);
    };
    
    sl.update = function() {
        var dt = game.time.physicsElapsed;
        
        if (!this.searchedForPath){
            if (this.pathName != ""){
                //go through objs and search for path
                for (var i=0; i<FullGame.GI.objs.length; i++){
                    var obj = FullGame.GI.objs[i];
                    if (obj.isPath != undefined && obj.isPath == true){
                        //found the path
                        this.path = obj;
                        //set distance on path to distance way from the path's first point
                        this.pathDist = Math.sqrt((this.path.startX-this.x)*(this.path.startX-this.x) + (this.path.startY-this.y)*(this.path.startY-this.y));
                        var pos = this.path.positionFromDist(this.pathDist);
                        this.x = pos.x;
                        this.y = pos.y;
                        
                        var pts = this.path.pointsFromDist(this.pathDist);
                        this.pathP1.x = pts.p1.x;
                        this.pathP1.y = pts.p1.y;
                        this.pathP2.x = pts.p2.x;
                        this.pathP2.y = pts.p2.y;
                        console.log("" + this.pathP1.x + "," + this.pathP1.y + " " + this.pathP2.x + "," + this.pathP2.y);
                        
                        break;
                    }
                }
                if (this.path == null){
                    console.log("WARNING: Path " + this.pathName + " not found.");
                }
            }
            this.searchedForPath = true;
        }
        
        
        if (!this.forceApplied){
            if (this.speed > 0){
                this.speed = Math.max(0, this.speed - this.FRICTION * dt);
            } else {
                this.speed = Math.min(0, this.speed + this.FRICTION * dt);
            }
        }
        this.forceApplied = false;
        this.speed = Math.max(-this.MAX_SPEED, Math.min(this.MAX_SPEED, this.speed));
        
        
    };
    
    sl.afterCollision = function() {
        
       
    };
    
    return sl;
};