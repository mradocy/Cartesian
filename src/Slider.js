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
    sl.WIDTH = 115;
    sl.HEIGHT = 59;
    game.physics.enable(sl, Phaser.Physics.ARCADE);
    sl.body.immovable = true;
    sl.body.setSize(sl.WIDTH, sl.HEIGHT, 0, 0);
    sl.color = color;
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
    
    sl.NORMAL_LASER_MAX_ACCEL = 450;
    sl.MAX_SPEED = 120;
    sl.FRICTION = 450; //only applied when no force acting on it
    sl.forceApplied = false;
    
    sl.applyForce = function(edgeNormal, angle) {
        var dt = game.time.physicsElapsed;
        
        //force vector
        var vx = this.NORMAL_LASER_MAX_ACCEL*dt * Math.cos(angle);
        var vy = this.NORMAL_LASER_MAX_ACCEL*dt * Math.sin(angle);
        //project onto edgeNormal
        var dot = vx*Math.cos(edgeNormal) + vy*Math.sin(edgeNormal);
        var wx = dot * Math.cos(edgeNormal);
        var wy = dot * Math.sin(edgeNormal);
        
        //project force onto path
        var pathAngle = Math.atan2(this.pathP2.y-this.pathP1.y, this.pathP2.x-this.pathP1.x);
        var dot = wx*Math.cos(pathAngle) + wy*Math.sin(pathAngle);
        wx = dot * Math.cos(pathAngle);
        wy = dot * Math.sin(pathAngle);
        
        this.body.velocity.x += wx;
        this.body.velocity.y += wy;
        
        if (Math.abs(wx) > 1 || Math.abs(wy) > 1)
            this.forceApplied = true;
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
                        if (obj.name != this.pathName) continue;
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
                        break;
                    }
                }
                if (this.path == null){
                    console.log("WARNING: Path " + this.pathName + " not found.");
                }
            }
            this.searchedForPath = true;
        }
        
        //project velocity onto path
        var pathAngle = Math.atan2(this.pathP2.y-this.pathP1.y, this.pathP2.x-this.pathP1.x);
        var dot = this.body.velocity.x*Math.cos(pathAngle) + this.body.velocity.y*Math.sin(pathAngle);
        var wx = dot * Math.cos(pathAngle);
        var wy = dot * Math.sin(pathAngle);
        this.body.velocity.x = wx;
        this.body.velocity.y = wy;
        
        var spd = this.body.velocity.getMagnitude();
        if (spd > 0){
            //max speed
            var spdNew = Math.min(spd, this.MAX_SPEED);
            if (!this.forceApplied){
                //apply friction if no force applied this frame
                spdNew = Math.max(0, spdNew - this.FRICTION*dt);
            }
            this.body.velocity.x *= spdNew / spd;
            this.body.velocity.y *= spdNew / spd;
        }
        
        //detect moving off points
        var nextX = this.x + this.body.velocity.x*dt;
        var nextY = this.y + this.body.velocity.y*dt;
        var dist2 = (this.pathP1.x-this.pathP2.x)*(this.pathP1.x-this.pathP2.x) + (this.pathP1.y-this.pathP2.y)*(this.pathP1.y-this.pathP2.y);
        if ((this.pathP1.x-nextX)*(this.pathP1.x-nextX) + (this.pathP1.y-nextY)*(this.pathP1.y-nextY) > dist2){
            //will go past pathP2, stop there
            this.x = this.pathP2.x;
            this.y = this.pathP2.y;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            /*this.body.velocity.x = (this.pathP2.x - this.x) / dt;
            this.body.velocity.y = (this.pathP2.y - this.y) / dt;*/
        }
        if ((this.pathP2.x-nextX)*(this.pathP2.x-nextX) + (this.pathP2.y-nextY)*(this.pathP2.y-nextY) > dist2){
            //will go past pathP1, stop there
            this.x = this.pathP1.x;
            this.y = this.pathP1.y;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            /*this.body.velocity.x = (this.pathP1.x - this.x) / dt;
            this.body.velocity.y = (this.pathP1.y - this.y) / dt;*/
        }
            
        this.forceApplied = false;
        
    };
    
    sl.afterCollision = function() {
        
       
    };
    
    return sl;
};