//returns made shooter, but doesn't add it to FullGame.GI.objs (will be done in ParseObjects)
FullGame.makeShooter = function(x, y, rotation, laserColor, laserType, mobile) {
    
    var sh;
    var spriteKey;
    switch (laserColor){
    case FullGame.Til.BLUE:
        if (mobile)
            spriteKey = "mobile_shooter_blue";
        else
            spriteKey = "shooter_blue";
        break;
    case FullGame.Til.GREEN:
        if (mobile)
            spriteKey = "mobile_shooter_green";
        else
            spriteKey = "shooter_green";
        break;
    case FullGame.Til.RED:
    default:
        if (mobile)
            spriteKey = "mobile_shooter_red";
        else
            spriteKey = "shooter_red";
    }
    sh = game.add.sprite(x, y, spriteKey, undefined, FullGame.GI.objGroup);
    sh.anchor.setTo(.5, .5); //sprite is centered
    sh.rotation = rotation;
    sh.laserColor = laserColor;
    sh.laserType = laserType;
    sh.mobile = mobile;
    sh.pathName = "";
    sh.searchedForPath = false;
    sh.path = null;
    sh.pathDist = 0; //distance along the path
    sh.speed = 150;
    sh.accel = 200; //affects movement when about to turn around
    sh.rotationSpeed = 0; //in rad/sec.  Set in Tiled in degrees/sec
    sh.rotationAccel = 5;
    sh.rotationMin = 0; //in rad, but is set in Tiled in degrees
    sh.rotationMax = -1; //if rotationMax < rotationMin, that means rotation is unbounded
    sh.s = 0; //is usually equal to sh.speed, but can change sometimes
    sh.rs = 0; //is usually equal to sh.rotationSpeed, but can change sometimes
    sh.dx = 0;
    sh.dy = 0;
    sh.dr = 0;
    
    sh.FIRE_OFFSET = 4; //distances laser start a bit from the center of the sprite
    
    sh.update = function() {
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
                        break;
                    }
                }
                if (this.path == null){
                    console.log("WARNING: Path " + this.pathName + " not found.");
                }
            }
            this.s = this.speed;
            this.speed = Math.abs(this.speed);
            this.rs = this.rotationSpeed;
            this.rotationSpeed = Math.abs(this.rotationSpeed);
            this.searchedForPath = true;
        }
        
        //movement
        var dt = game.time.physicsElapsed;
        if (this.mobile){
            
            //moving along path
            if (this.path != null && this.speed != 0){
                
                if (this.path.loop){
                    this.pathDist += dt * this.s;
                } else {
                    var d = -this.speed*this.speed / (2 * -this.accel);
                    if (this.s > 0){ //going forward
                        if (this.pathDist < d && this.pathDist > 0){
                            //ease when just starting
                            this.s = Math.sqrt(-2 * -this.accel * this.pathDist);
                        } else if (this.path.totalDist - this.pathDist < d && this.path.totalDist - this.pathDist > 0){
                            //ease when getting to the end
                            this.s = Math.sqrt(-2 * -this.accel * (this.path.totalDist - this.pathDist));
                        } else {
                            //no easing
                            this.s = this.speed;
                        }
                        this.pathDist += dt * this.s;
                        if (this.pathDist >= this.path.totalDist){
                            this.s = -.1; //begin to go backward
                            this.pathDist = this.path.totalDist - .1;
                        }
                    } else { //going backward
                        if (this.path.totalDist - this.pathDist < d && this.path.totalDist-this.pathDist > 0){
                            //ease when just starting
                            this.s = -Math.sqrt(-2 * -this.accel * (this.path.totalDist - this.pathDist));
                        } else if (this.pathDist < d && this.pathDist > 0){
                            //ease when getting to the end
                            this.s = -Math.sqrt(-2 * -this.accel * this.pathDist);
                        } else {
                            //no easing
                            this.s = -this.speed;
                        }
                        this.pathDist += dt * this.s;
                        if (this.pathDist <= 0){
                            this.s = .1; //begin to go forward
                            this.pathDist = .1;
                        }
                    }
                }
                
                //vf^2 = vi^2 + 2*a*d
                //vi = sqrt(-2*a*d)
                //-speed^2/(2*a) = d
                
                var pos = this.path.positionFromDist(this.pathDist);
                this.dx = pos.x - this.x;
                this.dy = pos.y - this.y;
                this.x = pos.x;
                this.y = pos.y;
            }
            
            
            //rotating
            if (this.rotationSpeed != 0){
                
                var prevRot = this.rotation;
                if (this.rotationMax < this.rotationMin){ //then rotation is boundless
                    this.rotation += dt * this.rs;
                } else {
                    var d = -this.rotationSpeed*this.rotationSpeed / (2 * -this.rotationAccel);
                    console.log(d * 180/Math.PI);
                    if (this.rs > 0){ //rotating clockwise
                        if (this.rotation - this.rotationMin < d && this.rotation - this.rotationMin > 0){
                            //ease when just starting
                            this.rs = Math.sqrt(-2 * -this.rotationAccel * (this.rotation-this.rotationMin));
                        } else if (this.rotationMax - this.rotation < d && this.rotationMax - this.rotation > 0){
                            //ease when getting to the end
                            this.rs = Math.sqrt(-2 * -this.rotationAccel * (this.rotationMax-this.rotation));
                        } else {
                            //no easing
                            this.rs = this.rotationSpeed;
                        }
                        this.rotation += dt * this.rs;
                        if (this.rotation >= this.rotationMax){
                            this.rs = -.01; //begin to go backward
                            this.rotation = this.rotationMax - .01;
                        }
                    } else { //rotating counterclockwise
                        if (this.rotationMax - this.rotation < d && this.rotationMax - this.rotation > 0){
                            //ease when just starting
                            this.rs = -Math.sqrt(-2 * -this.rotationAccel * (this.rotationMax - this.rotation));
                        } else if (this.rotation - this.rotationMin < d && this.rotation - this.rotationMin > 0){
                            //ease when getting to the end
                            this.rs = -Math.sqrt(-2 * -this.rotationAccel * this.rotation);
                        } else {
                            //no easing
                            this.rs = -this.rotationSpeed;
                        }
                        this.rotation += dt * this.rs;
                        if (this.rotation <= this.rotationMin){
                            this.rs = .01; //begin to go forward
                            this.rotation = this.rotationMin + .01;
                        }
                    }
                }
                
                this.dr = this.rotation - prevRot;

            } //end if (this.rotationSpeed != 0)
            
            
        }
        
        
        
    };
    
    sh.afterCollision = function() {
        //fire laser
        var cos = Math.cos(this.rotation+this.dr);
        var sin = Math.sin(this.rotation+this.dr);
        FullGame.Lasers.fireLaser(
            this.x+this.dx + this.FIRE_OFFSET*cos, this.y+this.dy + this.FIRE_OFFSET*sin,
            cos, sin,
            this.laserColor, this.laserType);
    };
    
    return sh;
};