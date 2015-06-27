//returns made griddy, but doesn't add it to FullGame.GI.objs (will be done in ParseObjects)
FullGame.makeGriddy = function(cx, cy) {
    
    /*
    - Has purple fire swirl around it, then spreads out
        - Lasers absorbed by purple fire.
        - They need to all be offscreen for griddy to be beaten
    - There are 3 Griddys, each get fought in separate rooms
    
    - Room 1 fight opening:
        1. 2-layered square of purple flame forms
        2. The 3 Griddys phase into the square, following square path around center tile
        3. 2 Griddys phase away, other remains to fight.  Flame square fades away too.
    
    - Room 2 and 3 fight opening:
        1. Griddy is already in the square, waiting
    
    */
    
    var gr_l1 = game.add.sprite(cx, cy, "griddy_l1", undefined, FullGame.GI.frontGroup);
    gr_l1.anchor.setTo(.5, .5); //sprite is centered
    gr_l1.rotateSpeed = 60 *Math.PI/180;
    var gr_l2 = game.add.sprite(cx, cy, "griddy_l2", undefined, FullGame.GI.frontGroup);
    gr_l2.anchor.setTo(.5, .5); //sprite is centered
    gr_l2.rotateSpeed = -60 *Math.PI/180;
    var gr_damage = game.add.sprite(cx, cy, "griddy_damage", undefined, FullGame.GI.frontGroup);
    gr_damage.anchor.setTo(.5, .5); //sprite is centered
    gr_damage.rotateSpeed = 200 *Math.PI/180; //rotates when dead
    gr_damage.trueDeadRotateSpeed = 40 *Math.PI/180;
    gr_damage.animations.add("idle", [0, 1], 30, true);
    gr_damage.animations.play("idle");
    gr_damage.visible = false;
    
    var gr;
    
    gr = game.add.sprite(cx, cy, "griddy", undefined, FullGame.GI.frontGroup);
    gr.CENTER_X = 96/2.0;
    gr.CENTER_Y = 96/2.0;
    gr.RADIUS = 32;
    gr.SMOKE_RADIUS = 30;
    gr.SMOKE_SPEED = 40;
    gr.SMOKE_ACCEL = 300;
    gr.SMOKE_PERIOD = .009;
    gr.smokeTime = 0;
    gr.smokeCache = []; //recycles smoke particles
    
    
    gr.deadJumpTileBreakCoors = [];
    gr.goToTrueDeath = false;
    if (FullGame.Vars.startMap == "griddy1"){
        gr.deadJumpTileBreakCoors.push("7,8");
        gr.deadJumpTileBreakCoors.push("8,8");
    } else if (FullGame.Vars.startMap == "griddy2"){
        gr.deadJumpTileBreakCoors.push("11,8");
        gr.deadJumpTileBreakCoors.push("12,8");
    } else if (FullGame.Vars.startMap == "griddy3"){
        gr.goToTrueDeath = true;
    }
    
    gr.anchor.setTo(.5, .5); //sprite is centered
    gr.dead = false;
    gr.DEAD_INITIAL_Y_VELOCITY = -400;
    gr.DEAD_GRAVITY = 600;
    gr.deadVY = 0;
    gr.inDanger = false;
    gr.l1 = gr_l1;
    gr.l2 = gr_l2;
    gr.damage = gr_damage;
    
    gr.sameDirCount = 0; //number of tiles travelled going in same direction
    gr.direction = "left";
    gr.state = "pickMove";
    gr.deadOffscreen = false;
    gr.trueDeadTime = 0;
    gr.TRUE_DEAD_DURATION = 2.0;
    gr.startX = 0; //tile started in
    gr.startY = 0; //tile started in
    gr.speed = 100;
    
    gr.timeSinceTeleport = 0;
    gr.rotatingBlackFlames = [];
    gr.rotatingBlackFlamesRadius = 0;
    gr.ROTATING_BLACK_FLAMES_RADIUS_MAX = 55;
    gr.ROTATING_BLACK_FLAMES_SPAWN_DURATION = 1.0;
    gr.ROTATING_BLACK_FLAMES_RADIUS_DURATION = .7;
    gr.AUTO_TELEPORT_DURATION = 6.0;
    gr.TELEPORT_MIN_DURATION = .2; //prevents teleporting immediately after another
    
    //returns if the position is not occupied by a tile or a laser
    gr.openTile = function(x, y){
        if (x < 1 || x >= FullGame.GI.tileCols.length-1) return false;
        if (y < 1 || y >= FullGame.GI.tileCols[0].length-1) return false;
        if (FullGame.GI.tileCols[x][y] != "") return false;
        if (FullGame.Lasers.tilesFilled[x][y]) return false; //not tested yet
        return true;
    };
    
    gr.move = function(direction) { //will move 1 tile in the direction
        this.roundPosition();
        this.direction = direction;
        this.state = "move";
        this.roundPosition();
    };
    
    gr.roundPosition = function() {
        this.startX = Math.round(this.tileCoorFromPosition(this.x));
        this.startY = Math.round(this.tileCoorFromPosition(this.y));
        this.x = this.positionFromTileCoor(this.startX);
        this.y = this.positionFromTileCoor(this.startY);
    };
    
    gr.teleport = function(position) { //position is [x, y] in tiles
        
        //prevent teleporting too fast
        if (this.timeSinceTeleport < this.TELEPORT_MIN_DURATION)
            return;
        
        var oldX = this.x;
        var oldY = this.y;
        
        //launch all currently orbiting flames
        while (this.rotatingBlackFlames.length > 0){
            var bf = this.rotatingBlackFlames.pop();
            bf.launchAngle(bf.ang);
        }
        
        this.x = this.positionFromTileCoor(position[0]);
        this.y = this.positionFromTileCoor(position[1]);
        this.roundPosition();
        this.state = "pickMove";
        this.timeSinceTeleport = 0;
        
        //spawn purple smoke
        this.makePurpleSmoke(oldX, oldY, true);
        this.makePurpleSmoke(oldX, oldY, false);
        this.makePurpleSmoke(this.x, this.y, true);
        this.makePurpleSmoke(this.x, this.y, false);
        FullGame.playSFX("griddy_poof");
    };
    
    gr.shotAt = function() { //called when laser would hit Griddy
        if (this.dead) return;
        this.inDanger = true;
    };
    
    //HELPERS
    gr.tileCoorFromPosition = function(position){
        return (position / FullGame.GI.tileWidth) - .5;
    };
    gr.positionFromTileCoor = function(tileCoor){
        return (tileCoor + .5) * FullGame.GI.tileWidth;
    };
    gr.randomTeleportCoors = function(){
        var choices = [];
        for (var i=0; i<FullGame.GI.tileCols.length; i++){
            for (var j=0; j<FullGame.GI.tileCols[i].length; j++){
                if (this.openTile(i,j)){
                    choices.push([i,j]);
                }
            }
        }
        if (choices.length == 0)
            return null;
        return choices[Math.floor(Math.random() * choices.length)];
    };
    gr.die = function() {
        //Griddy death
        //destroy all currently orbiting flames
        while (this.rotatingBlackFlames.length > 0){
            var bf = this.rotatingBlackFlames.pop();
            bf.destroy();
        }
        //change visibility
        this.visible = false;
        this.l1.visible = false;
        this.l2.visible = false;
        this.damage.visible = true;
        this.damage.rotation = 0;
        this.dead = true;
        
        FullGame.playSFX("damage_flesh");
        if (this.goToTrueDeath){
            this.state = "trueDead";
            this.damage.rotateSpeed = this.damage.trueDeadRotateSpeed;
            FullGame.fadeOutMusic(1.0);
            FullGame.playSFX("griddy_death");
        } else {
            this.state = "deadJump";
            this.deadVY = this.DEAD_INITIAL_Y_VELOCITY;
            FullGame.playSFX("griddy_damage");
        }
    };
    
    //GAME LOOP
    gr.update = function() {
        var dt = game.time.physicsElapsed;
        var plr = FullGame.GI.player;
        
        if (this.state == "deadJump"){
            if (!this.deadOffscreen){
                this.deadVY += dt * this.DEAD_GRAVITY;
                this.y += this.deadVY * dt;
                if (this.y-100 > FullGame.GI.worldHeight){
                    this.deadOffscreen = true;
                    
                    for (var i=0; i<this.deadJumpTileBreakCoors.length; i++){
                        FullGame.GI.tilesPressuredThisFrame.push(this.deadJumpTileBreakCoors[i]);
                    }
                    
                }
            }
            
        } else if (this.state == "trueDead"){
            this.trueDeadTime += dt;
            if (this.trueDeadTime >= this.TRUE_DEAD_DURATION){
                this.damage.visible = false;
                this.state = "foreverDead";
                //open black doors
                for (var i=0; i<FullGame.GI.objs.length; i++){
                    var door = FullGame.GI.objs[i];
                    if (door.type == undefined || door.type != "door") continue;
                    if (door.color != FullGame.Til.BLACK) continue;
                    if (door.opening) continue;
                    door.open();
                }
                //Griddy final death
            }
            
        } else if (this.state == "move"){
            var moveDone = false;
            if (this.direction == "right"){
                this.x += this.speed * dt;
                if (this.x >= this.positionFromTileCoor(this.startX+1)){ //if would go too far
                    this.x = this.positionFromTileCoor(this.startX+1); //end here
                    moveDone = true;
                }
            } else if (this.direction == "left"){
                this.x -= this.speed * dt;
                if (this.x <= this.positionFromTileCoor(this.startX-1)){ //if would go too far
                    this.x = this.positionFromTileCoor(this.startX-1); //end here
                    moveDone = true;
                }
            } else if (this.direction == "down"){
                this.y += this.speed * dt;
                if (this.y >= this.positionFromTileCoor(this.startY+1)){ //if would go too far
                    this.y = this.positionFromTileCoor(this.startY+1); //end here
                    moveDone = true;
                }
            } else if (this.direction == "up"){
                this.y -= this.speed * dt;
                if (this.y <= this.positionFromTileCoor(this.startY-1)){ //if would go too far
                    this.y = this.positionFromTileCoor(this.startY-1); //end here
                    moveDone = true;
                }
            }
            
            if (moveDone){
                this.state = "pickMove";
            }
            
        }
        if (this.state == "pickMove"){ //no else
            
            var x = Math.round(this.tileCoorFromPosition(this.x));
            var y = Math.round(this.tileCoorFromPosition(this.y));
            var choices = []; //array of possible directions
            if (this.openTile(x-1, y)){
                choices.push("left");
            }
            if (this.openTile(x, y-1)){
                choices.push("up");
            }
            if (this.openTile(x+1, y)){
                choices.push("right");
            }
            if (this.openTile(x, y+1)){
                choices.push("down");
            }
            if (choices.length > 1){ //take out choice that goes in opposite direction, if possible
                if (this.direction == "left"){
                    if (choices.indexOf("right") != -1)
                        choices.splice(choices.indexOf("right"), 1);
                } else if (this.direction == "up"){
                    if (choices.indexOf("down") != -1)
                        choices.splice(choices.indexOf("down"), 1);
                } else if (this.direction == "right"){
                    if (choices.indexOf("left") != -1)
                        choices.splice(choices.indexOf("left"), 1);
                } else if (this.direction == "down"){
                    if (choices.indexOf("up") != -1)
                        choices.splice(choices.indexOf("up"), 1);
                }
            }
            //make choice
            if (choices.length >= 1){
                var ind = Math.floor(Math.random() * choices.length);
                this.move(choices[ind]);
            } else { //no choices available, do nothing
                
            }
            
        }
        
        //black flame handling
        if (!this.dead){
            
            this.timeSinceTeleport += dt;
            
            if (this.timeSinceTeleport-dt < this.ROTATING_BLACK_FLAMES_SPAWN_DURATION &&
                this.timeSinceTeleport >= this.ROTATING_BLACK_FLAMES_SPAWN_DURATION){
                //spawn flames
                var NUM_BLACK_FLAMES = 6;
                var startHeading = Math.random() * Math.PI*2;
                for (var i=0; i<NUM_BLACK_FLAMES; i++){
                    var angle = startHeading + Math.PI*2*i/NUM_BLACK_FLAMES;
                    var bf = this.makeBlackFlame(this.x + 10*Math.cos(angle), this.y + 10*Math.sin(angle));
                    bf.orbitX = this.x;
                    bf.orbitY = this.y;
                    bf.orbit();
                    this.rotatingBlackFlames.push(bf);
                }
            }
            
            //update flame position
            if (this.timeSinceTeleport >= this.ROTATING_BLACK_FLAMES_SPAWN_DURATION){
                for (var i=0; i<this.rotatingBlackFlames.length; i++){
                    var bf = this.rotatingBlackFlames[i];
                    bf.orbitX = this.x;
                    bf.orbitY = this.y;
                    var ease = (this.timeSinceTeleport - this.ROTATING_BLACK_FLAMES_SPAWN_DURATION) / this.ROTATING_BLACK_FLAMES_RADIUS_DURATION;
                    ease = Math.min(1, Math.max(.1, ease));
                    ease = Math.easeOutQuad(ease, 0, 1, 1);
                    bf.setOrbitRadius(this.ROTATING_BLACK_FLAMES_RADIUS_MAX);
                }
            }
            
            //auto teleporting
            if (this.timeSinceTeleport >= this.AUTO_TELEPORT_DURATION){
                var coors = this.randomTeleportCoors();
                if (coors != null){ //don't teleport if can't
                    this.teleport(coors);
                }
            }
            
        }
    };
    
    gr.afterCollision = function() {
        var dt = game.time.physicsElapsed;
        var plr = FullGame.GI.player;
        
        //move layers
        this.l1.x = this.x;
        this.l1.y = this.y;
        this.l1.rotation += dt * this.l1.rotateSpeed;
        this.l2.x = this.x;
        this.l2.y = this.y;
        this.l2.rotation += dt * this.l2.rotateSpeed;
        this.damage.x = this.x;
        this.damage.y = this.y;
        this.damage.rotation += dt * this.damage.rotateSpeed;
        if (this.state == "trueDead"){
            this.damage.alpha = Math.max(0, 1 - this.trueDeadTime / this.TRUE_DEAD_DURATION);
        }
        
        //spawn dead smoke
        if (this.dead && this.damage.visible){
            this.smokeTime += dt;
            if (this.smokeTime >= this.SMOKE_PERIOD){
                var smokes = Math.floor(this.smokeTime / this.SMOKE_PERIOD);
                this.spawnSmoke(smokes);
                this.smokeTime -= smokes*this.SMOKE_PERIOD;
            }
        }
    };
    
    //called by Lasers just before tilesFilled is reset
    gr.dangerStep = function() {
        if (this.inDanger){ //need to teleport out of the way
            var coors = this.randomTeleportCoors();
            if (coors == null){ //can't teleport to safety, die instead
                this.die();
            } else {
                this.teleport(coors);
            }
            this.inDanger = false;
        }
    };
    
    gr.recycledBlackFlames = [];
    gr.makeBlackFlame = function(x, y){
        var bf;
        if (this.recycledBlackFlames.length > 0){
            bf = this.recycledBlackFlames.pop();
            bf.visible = true;
            bf.x = x;
            bf.y = y;
            bf.alpha = 0;
            bf.destroyed = false;
            bf.state = "none";
        } else {
            bf = game.add.sprite(x, y, "blackFlame", undefined, FullGame.GI.frontGroup);
            bf.anchor.setTo(.5, .5); //sprite is centered
            bf.animations.add("idle", [0, 1], 30, true);
            bf.alpha = 0;
            bf.RADIUS = 19;
            FullGame.GI.blackFlames.push(this);
            
            bf.ORBIT_SPEED = 100;
            bf.LAUNCH_SPEED_MIN = 50;
            bf.LAUNCH_SPEED_MAX = 300;
            bf.LAUNCH_SPEED_DURATION = .5;
            bf.orbitX = 0;
            bf.orbitY = 0;
            bf.vx = 0;
            bf.vy = 0;
            bf.rad = 0;
            bf.ang = 0;
            bf.speed = 0;
            bf.launchTime = 0;
            bf.destroyed = false;
            bf.state = "none"; //"none", "orbiting", or "launching"
            
            //set bf.ORBIT_SPEED and bt.orbitX, bf.orbitY beforehand
            bf.orbit = function() {
                this.state = "orbiting";
                this.rad = Math.sqrt((this.x-this.orbitX)*(this.x-this.orbitX) + (this.y-this.orbitY)*(this.y-this.orbitY));
                this.ang = Math.atan2(this.y - this.orbitY, this.x - this.orbitX);
            };
            bf.setOrbitRadius = function(newOrbitRadius) {
                var oldRadius = Math.sqrt((this.x-this.orbitX)*(this.x-this.orbitX) + (this.y-this.orbitY)*(this.y-this.orbitY));
                var ratio = newOrbitRadius / oldRadius;
                this.x = this.orbitX + (this.x - this.orbitX) * ratio;
                this.y = this.orbitY + (this.y - this.orbitY) * ratio;
                this.rad = newOrbitRadius;
            };
            //launches, but preserves previous speed
            bf.launch = function() {
                this.state = "launching";
                this.speed = this.LAUNCH_SPEED_MIN;
                this.launchTime = 0;
            };
            //launches at specified angle
            bf.launchAngle = function(angle) {
                this.launch();
                this.vx = this.speed * Math.cos(angle);
                this.vy = this.speed * Math.sin(angle);
            };
            
            bf.update = function() {
                var dt = game.time.physicsElapsed;
                if (this.destroyed)
                    return;
                if (this.state == "none"){
                    //do nothing
                } else if (this.state == "orbiting"){
                    var dist = this.ORBIT_SPEED * dt;
                    var anglePlus = dist / this.rad;
                    this.ang += anglePlus;
                    var newX = this.orbitX + this.rad * Math.cos(this.ang);
                    var newY = this.orbitY + this.rad * Math.sin(this.ang);
                    this.vx = (newX - this.x) / dt;
                    this.vy = (newY - this.y) / dt;
                    this.x = newX;
                    this.y = newY;
                } else if (this.state == "launching"){
                    this.launchTime += dt;
                    var ease = this.launchTime / this.LAUNCH_SPEED_DURATION;
                    ease = Math.max(0, Math.min(1, ease));
                    var newSpeed = this.LAUNCH_SPEED_MIN + (this.LAUNCH_SPEED_MAX - this.LAUNCH_SPEED_MIN) * ease;
                    this.vx *= newSpeed / this.speed;
                    this.vy *= newSpeed / this.speed;
                    this.speed = newSpeed;
                    this.x += this.vx * dt;
                    this.y += this.vy * dt;
                }
                this.alpha = Math.min(1, this.alpha + dt/this.griddy.ROTATING_BLACK_FLAMES_RADIUS_DURATION);
                this.rotation += -200*Math.PI/180 * dt;
                
                //detect hitting player
                var plr = FullGame.GI.player;
                if (plr != null){
                    if ((plr.x-this.x)*(plr.x-this.x) + (plr.y-this.y)*(plr.y-this.y) <
                        (plr.RADIUS+this.RADIUS)*(plr.RADIUS+this.RADIUS)){
                        plr.damage(this.x < plr.x, false);
                    }
                }
                
                //detect out of bounds
                if (this.x+this.RADIUS*2 < 0 || this.x-this.RADIUS*2 > FullGame.GI.worldWidth ||
                    this.y+this.RADIUS*2 < 0 || this.y-this.RADIUS*2 > FullGame.GI.worldHeight){
                    this.destroy();
                }
            };
            
            bf.destroy = function(){
                this.griddy.recycledBlackFlames.push(this);
                this.visible = false;
                this.destroyed = true;
                this.state = "none";
            };
            
        }
        
        bf.griddy = this;
        bf.animations.play("idle");
        
        return bf;
    };
    
    
    gr.recycledPurpleSmoke = [];
    gr.makePurpleSmoke = function(x, y, right){
        var ps;
        if (this.recycledPurpleSmoke.length > 0){
            ps = this.recycledPurpleSmoke.pop();
            ps.destroyed = false;
            ps.visible = true;
            
        } else {
            ps = game.add.sprite(x, y, "purple_smoke", undefined, FullGame.GI.frontGroup);
            ps.anchor.setTo(.5, .5); //sprite is centered
            ps.alpha = 0;
            ps.griddy = this;
            ps.destroyed = false;
            ps.DURATION = .6;
            ps.SPEED = 50;
            
            ps.update = function() {
                var dt = game.time.physicsElapsed;
                if (this.destroyed)
                    return;
                
                this.time += dt;
                if (this.right){
                    this.x += this.SPEED * dt;
                } else {
                    this.x -= this.SPEED * dt;
                }
                this.alpha = Math.max(0, 1 - this.time / this.DURATION);
                
                if (this.time >= this.DURATION){
                    this.destroy();
                }
                
            };
            
            ps.destroy = function(){
                this.griddy.recycledPurpleSmoke.push(this);
                this.visible = false;
                this.destroyed = true;
            };
            
        }
        ps.x = x;
        ps.y = y;
        ps.alpha = 1;
        ps.right = right;
        ps.time = 0;
    };
    
    
    
    gr.spawnSmoke = function(numSmokes) {
        
        for (var i=0; i<numSmokes; i++){
            
            var angle = Math.random() * Math.PI*2;
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var rad = Math.random() * this.SMOKE_RADIUS;
            var x = rad * c;
            var y = rad * s;
            
            x += this.x;
            y += this.y;
            
            
            var sm;
            if (this.smokeCache.length == 0){
                sm = game.add.sprite(x, y, "alien_smoke_purple", undefined, FullGame.GI.frontGroup);
                sm.animations.add("play", [0, 1, 2, 3, 4, 5, 6, 7], 15, false);
                sm.alien = this;
                sm.update = function() {
                    var dt = game.time.physicsElapsed;
                    this.vx += this.ax * dt;
                    this.vy += this.ay * dt;
                    this.x += this.vx * dt;
                    this.y += this.vy * dt;
                    this.t += dt;
                    if (this.t > this.duration){
                        this.visible = false;
                        this.alien.smokeCache.push(this);
                    }
                };
            } else {
                sm = this.smokeCache.pop();
                sm.x = x;
                sm.y = y;
                sm.visible = true;
                sm.animations.stop();
            }
            sm.animations.play("play");
            if (this.state != "trueDead"){
                FullGame.GI.frontGroup.setChildIndex(sm, 0);
            } else {
                sm.bringToTop();
            }
            sm.t = 0;
            sm.duration = 8 / 15.0;
            sm.anchor.setTo(.5, .5);
            sm.vx = this.SMOKE_SPEED * c;
            sm.vy = this.SMOKE_SPEED * s;
            sm.ax = this.SMOKE_ACCEL * c;
            sm.ay = this.SMOKE_ACCEL * s;
            
        }
    };
    
    
    
    return gr;
    
};