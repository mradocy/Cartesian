//returns made alien, but doesn't add it to FullGame.GI.objs (will be done in ParseObjects)
FullGame.makeAlien = function(cx, cy, color) {
    
    var al;
    var backHand;
    var frontHand;
    var eyes;
    var key;
    var handKey;
    var eyesKey;
    var smokeKey;
    var laserColor;
    
    switch (color){
    case FullGame.Til.RED:
    default:
        key = "alien_red";
        handKey = "alien_hand_red";
        eyesKey = "alien_eyes_red";
        smokeKey = "alien_smoke_red";
        laserColor = FullGame.Til.RED;
        break;
    }
    
    backHand = game.add.sprite(cx, cy, handKey, undefined, FullGame.GI.objGroup);
    backHand.animations.add("idle", [0], 30, true);
    backHand.animations.add("glow", [1], 30, true);
    backHand.animations.play("idle");
    backHand.anchor.setTo(.5, .5); //sprite is centered
    al = game.add.sprite(cx, cy, key, undefined, FullGame.GI.objGroup);
    al.animations.add("idle", [0], 30, true);
    al.animations.add("mouth", [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0], 15, false);
    al.animations.add("damage", [3, 4], 30, true);
    al.animations.play("idle");
    eyes = game.add.sprite(cx, cy, eyesKey, undefined, FullGame.GI.objGroup);
    eyes.animations.add("idle", [0], 30, true);
    eyes.animations.add("blink", [1, 2, 3, 4, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0], 90, false);
    eyes.animations.play("idle");
    frontHand = game.add.sprite(cx, cy, handKey, undefined, FullGame.GI.objGroup);
    frontHand.animations.add("idle", [0], 30, true);
    frontHand.animations.add("glow", [1], 30, true);
    frontHand.animations.play("idle");
    frontHand.anchor.setTo(.5, .5); //sprite is centered
    
    
    al.anchor.setTo(.5, .5); //sprite is centered
    al.eyes = eyes;
    al.backHand = backHand;
    al.frontHand = frontHand;
    al.smokeKey = smokeKey;
    al.laserColor = laserColor;
    al.isAlien = true;
    al.x = cx;
    al.y = cy;
    al.EYES_X = 53 - 41;
    al.EYES_Y = 23 - 71;
    al.blinkTime = 0;
    al.blinkPeriod = 0;
    al.mouthTime = 0;
    al.mouthPeriod = 0;
    al.vx = 0;
    al.vy = 0;
    al.MAX_SPEED = 150;
    al.ACCEL = 400;
    al.FRICTION = 400;
    al.ROTATE_ZENO = .05;
    al.ROTATE_MAX_DIFF = .006;
    al.ROTATE_MIN = -15 *Math.PI/180;
    al.ROTATE_MAX = 15 *Math.PI/180;
    al.targetX = 0;
    al.targetY = 0;
    al.TARGET_RADIUS = 40; //how close alien can be to the target to be considered at the target
    al.state = "idle";
    al.bobOffset = 0; //y offset for slightly bobbing up and down
    al.bobTime = 0;
    al.BOB_PERIOD = 2.5;
    al.BOB_AMPLITUDE = 12;
    al.SMOKE_SPAWN_BOX = {
        x:21 - 41,
        y:83 - 71,
        w:50,
        h:14,
        r:65 *Math.PI/180
    };
    al.SMOKE_SPEED = 20;
    al.SMOKE_ACCEL = 250;
    al.SMOKE_PERIOD = .012;
    al.smokeTime = 0;
    al.smokeCache = []; //recycles smoke particles
    al.FRONT_HAND_X = 65 - 41;
    al.FRONT_HAND_Y = 85 - 71;
    al.BACK_HAND_X = 94 - 41;
    al.BACK_HAND_Y = 65 - 71;
    al.HAND_PERIOD = 3;
    al.HAND_AMPLITUDE = 14;
    al.backHand.bobTime = al.HAND_PERIOD / 4;
    al.backHand.bobOffset = 0;
    al.backHand.smokeTime = 0;
    al.backHand.startAngle = 0;
    al.frontHand.bobTime = 0;
    al.frontHand.bobOffset = 0;
    al.frontHand.smokeTime = 0;
    al.frontHand.startAngle = 0;
    al.HAND_SMOKE_PERIOD = .1;
    al.HAND_SMOKE_SPAWN_BOX = {
        x:7 - 23,
        y:17 - 17,
        w:8,
        h:5,
        r:Math.PI/2
    };
    al.laserState = "idle"; //"preAim", "aim", "fire", "postFire"
    al.laserTime = 0;
    al.IDLE_DURATION = 2.5;
    al.PRE_AIM_DURATION = .5;
    al.AIM_DURATION = 1.5;
    al.FIRE_DURATION = .2;//1.0;
    al.POST_FIRE_DURATION = .5;
    al.AIM_SPREAD_INITIAL = 40 *Math.PI/180;
    al.AIM_SPREAD_FINAL = 1 *Math.PI/180;
    //al.knockbackTime = 0;
    //al.KNOCKBACK_DURATION 
    al.invincibleTime = 99999;
    al.INVINCIBLE_DURATION = 2.0;
    
    //base laser lines are when alien isn't transformed
    var cFront = FullGame.Til.WHITE;
    var cBack = FullGame.Til.BLACK;
    var cHead = color;
    al.laserLines = [];
    al.baseLaserLines = [
        {x0:76, y0:44, x1:70, y1:58, color:cFront},
        {x0:70, y0:58, x1:55, y1:59, color:cFront},
        {x0:55, y0:59, x1:48, y1:65, color:cFront},
        {x0:48, y0:65, x1:58, y1:97, color:cFront},
        {x0:58, y0:97, x1:51, y1:126, color:cFront},
        {x0:51, y0:126, x1:41, y1:139, color:cFront},
        {x0:41, y0:139, x1:14, y1:81, color:cBack},
        {x0:14, y0:81, x1:24, y1:64, color:cBack},
        {x0:24, y0:64, x1:21, y1:41, color:cBack},
        {x0:21, y0:41, x1:12, y1:64, color:cBack},
        {x0:12, y0:64, x1:10, y1:43, color:cHead},
        {x0:10, y0:43, x1:17, y1:20, color:cHead},
        {x0:17, y0:20, x1:29, y1:11, color:cHead},
        {x0:29, y0:11, x1:64, y1:12, color:cHead},
        {x0:64, y0:12, x1:76, y1:27, color:cHead},
        {x0:76, y0:27, x1:76, y1:44, color:cHead}
    ];
    for (var i=0; i<al.baseLaserLines.length; i++){
        al.baseLaserLines[i].x0 -= 41;
        al.baseLaserLines[i].y0 -= 71;
        al.baseLaserLines[i].x1 -= 41;
        al.baseLaserLines[i].y1 -= 71;
        al.laserLines.push(
            {x0:al.baseLaserLines[i].x0,
             y0:al.baseLaserLines[i].y0,
             x1:al.baseLaserLines[i].x1,
             y1:al.baseLaserLines[i].y1,
             color:al.baseLaserLines[i].color}
        );
    }
    al.setLaserLines = function() {
        var c = Math.cos(this.rotation);
        var s = Math.sin(this.rotation);
        for (var i=0; i<this.baseLaserLines.length; i++){
            var bll = this.baseLaserLines[i];
            var x0 = bll.x0 * this.scale.x;
            var y0 = bll.y0 * this.scale.y;
            var x1 = bll.x1 * this.scale.x;
            var y1 = bll.y1 * this.scale.y;
            this.laserLines[i].x0 = x0*c - y0*s;
            this.laserLines[i].y0= x0*s + y0*c;
            this.laserLines[i].x1 = x1*c - y1*s;
            this.laserLines[i].y1 = x1*s + y1*c;
        }
    };
    al.setLaserLines();
    
    al.positionEyes = function() {
        var c = Math.cos(this.rotation);
        var s = Math.sin(this.rotation);
        var x0 = this.EYES_X * this.scale.x;
        var y0 = this.EYES_Y * this.scale.y;
        this.eyes.x = x0*c - y0*s;
        this.eyes.y = x0*s + y0*c;
        this.eyes.x += this.x;
        this.eyes.y += this.y;
        this.eyes.scale.x = this.scale.x;
        this.eyes.scale.y = this.scale.y;
        this.eyes.rotation = this.rotation;
    };
    
    al.spawnSmoke = function(numSmokes, source) {
        var spawnBox;
        if (source == this){
            spawnBox = this.SMOKE_SPAWN_BOX;
        } else if (source == this.backHand || source == this.frontHand){
            spawnBox = this.HAND_SMOKE_SPAWN_BOX;
        }
        
        var c = Math.cos(spawnBox.r);
        var s = Math.sin(spawnBox.r);
        var c2 = Math.cos(source.rotation);
        var s2 = Math.sin(source.rotation);
        var heading;
        if (this.scale.x > 0){
            heading = spawnBox.r + source.rotation + Math.PI/2;
        } else {
            heading = -spawnBox.r + source.rotation + Math.PI/2;
        }
        var ch = Math.cos(heading);
        var sh = Math.sin(heading);
        for (var i=0; i<numSmokes; i++){
            
            var x0 = Math.random() * spawnBox.w;
            var y0 = Math.random() * spawnBox.h;
            var x = x0*c - y0*s;
            var y = x0*s + y0*c;
            x0 = (x + spawnBox.x) * source.scale.x;
            y0 = (y + spawnBox.y) * source.scale.y;
            x = x0*c2 - y0*s2;
            y = x0*s2 + y0*c2;
            x += source.x;
            y += source.y;
            
            var sm;
            if (this.smokeCache.length == 0){
                sm = game.add.sprite(x, y, this.smokeKey, undefined, FullGame.GI.objGroup);
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
            if (source == this.backHand){
                FullGame.GI.objGroup.setChildIndex(sm, 0);
            }
            sm.t = 0;
            sm.duration = 8 / 15.0;
            sm.anchor.setTo(.5, .5);
            sm.vx = this.SMOKE_SPEED * ch + this.vx;
            sm.vy = this.SMOKE_SPEED * sh + this.vy;
            sm.ax = this.SMOKE_ACCEL * ch;
            sm.ay = this.SMOKE_ACCEL * sh;
            
        }
    };
    
    al.moveTo = function(x, y) {
        //don't move if already there
        if ((x-this.x)*(x-this.x) + (y-this.y)*(y-this.y) <
            this.TARGET_RADIUS * this.TARGET_RADIUS)
            return;
        this.state = "move";
        this.targetX = x;
        this.targetY = y;
    };
    
    al.damage = function() {
        
        if (this.invincibleTime < this.INVINCIBLE_DURATION){
        }
        
        this.state = "damage";
        
    };
    
    al.update = function() {
        
        var dt = game.time.physicsElapsed;
        if (this.dead) return;
        
        //test
        if (FullGame.Keys.rmbHeld){
            this.moveTo(FullGame.Keys.mouseX, FullGame.Keys.mouseY);
        }
        
        //undo bob offset for calculations
        this.y -= this.bobOffset;
        
        if (this.state == "idle"){
            //idle state
            var s0 = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
            if (s0 > 0){
                var a = Math.atan2(this.vy, this.vx);
                var s1 = Math.max(0, s0 - this.FRICTION * dt);
                this.vx = Math.cos(a) * s1;
                this.vy = Math.sin(a) * s1;
            }
            
        } else if (this.state == "move"){
            //move state; moving to target point
            var a = Math.atan2(this.targetY - this.y, this.targetX - this.x);
            this.vx += Math.cos(a) * this.ACCEL * dt;
            this.vy += Math.sin(a) * this.ACCEL * dt;
            var s2 = this.vx*this.vx + this.vy*this.vy;
            if (s2 > this.MAX_SPEED*this.MAX_SPEED){
                var mult = Math.sqrt(this.MAX_SPEED*this.MAX_SPEED / s2);
                this.vx *= mult;
                this.vy *= mult;
            }
            //detect when at the target
            if ((this.targetX-this.x)*(this.targetX-this.x) + (this.targetY-this.y)*(this.targetY-this.y) <
                this.TARGET_RADIUS*this.TARGET_RADIUS){
                this.state = "idle";
            }
        } else if (this.state == "damage") {
            
            
            
        }
        
        //adjust to look at player
        var plr = FullGame.GI.player;
        if (plr != null){
            var dist = Math.sqrt((this.x-plr.x)*(this.x-plr.x) + (this.y-plr.y)*(this.y-plr.y));
            if (this.canFlipAround()){
                if (this.scale.x > 0){
                    if (this.x > plr.x+16){
                        this.scale.x *= -1;
                        this.rotation *= -1;
                    }
                } else {
                    if (this.x < plr.x-16){
                        this.scale.x *= -1;
                        this.rotation *= -1;
                    }
                }
            }
            
            var targetR = Math.asin((plr.y - this.y) / dist);
            targetR = Math.max(this.ROTATE_MIN, Math.min(this.ROTATE_MAX, targetR));
            if (this.scale.x < 0) targetR *= -1;
            
            var diff = (targetR - this.rotation) * this.ROTATE_ZENO;
            diff = Math.max(-this.ROTATE_MAX_DIFF, Math.min(this.ROTATE_MAX_DIFF, diff));
            this.rotation += diff;
            
        }
        
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        //this.rotation += 1 * dt;
        
        //bobbing up and down
        this.bobTime += dt;
        this.bobOffset = Math.sin(2*Math.PI* this.bobTime / this.BOB_PERIOD) * this.BOB_AMPLITUDE/2;
        this.y += this.bobOffset;
        
        //position hands
        var hand = this.frontHand;
        var isFrontHand = true;
        while (hand != null){
            
            hand.bobTime += dt;
            hand.bobOffset = Math.sin(Math.PI*2* hand.bobTime / this.HAND_PERIOD) * this.HAND_AMPLITUDE/2;
            
            var x0, y0;
            if (isFrontHand){
                x0 = this.FRONT_HAND_X;
                y0 = this.FRONT_HAND_Y;
            } else {
                x0 = this.BACK_HAND_X;
                y0 = this.BACK_HAND_Y;
            }
            x0 += hand.bobOffset;
            x0 *= this.scale.x;
            y0 *= this.scale.y;
            var x = x0*Math.cos(this.rotation) - y0*Math.sin(this.rotation);
            var y = x0*Math.sin(this.rotation) + y0*Math.cos(this.rotation);
            x += this.x;
            y += this.y;
            
            hand.x = x;
            hand.y = y;
            hand.scale.x = this.scale.x;
            hand.scale.y = this.scale.y;
            if (this.laserState == "idle"){
                hand.rotation = this.rotation;
            }
            
            //spawn smoke
            hand.smokeTime += dt;
            if (hand.smokeTime >= this.HAND_SMOKE_PERIOD){
                var smokes = Math.floor(hand.smokeTime / this.HAND_SMOKE_PERIOD);
                this.spawnSmoke(smokes, hand);
                hand.smokeTime -= smokes*this.HAND_SMOKE_PERIOD;
            }
            
            
            if (hand == this.backHand) break;
            hand = this.backHand;
            isFrontHand = false;
        }
        
        
        this.positionEyes();
        this.setLaserLines();
        
    };
    
    al.afterCollision = function() {
        
        var dt = game.time.physicsElapsed;
        var plr = FullGame.GI.player;
        
        //spawning smoke
        this.smokeTime += dt;
        if (this.smokeTime >= this.SMOKE_PERIOD){
            var smokes = Math.floor(this.smokeTime / this.SMOKE_PERIOD);
            this.spawnSmoke(smokes, this);
            this.smokeTime -= this.SMOKE_PERIOD * smokes;
        }
        //blinking
        this.blinkTime += dt;
        if (this.blinkTime >= this.blinkPeriod){
            this.eyes.animations.play("blink");
            this.blinkTime = 0;
            this.blinkPeriod = 2 + Math.random()*1;
        }
        //moving mouth
        this.mouthTime += dt;
        if (this.mouthTime >= this.mouthPeriod){
            this.animations.play("mouth");
            this.mouthTime = 0;
            this.mouthPeriod = 3 + Math.random()*1.5;
        }
        
        //firing lasers
        this.laserTime += dt;
        var frontHandAngle = 0;
        var backHandAngle = 0;
        if (plr != null){
            frontHandAngle = Math.atan2(plr.y - this.frontHand.y, plr.x - this.frontHand.x);
            backHandAngle = Math.atan2(plr.y - this.backHand.y, plr.x - this.backHand.x);
        }
        
        var diffF0, diffF1, diffB0, diffB1;
        if (this.scale.x > 0){
            diffF0 = -this.AIM_SPREAD_INITIAL/2;
            diffF1 = -this.AIM_SPREAD_FINAL/2;
            diffB0 = this.AIM_SPREAD_INITIAL/2;
            diffB1 = this.AIM_SPREAD_FINAL/2;
        } else {
            diffF0 = this.AIM_SPREAD_INITIAL/2;
            diffF1 = this.AIM_SPREAD_FINAL/2;
            diffB0 = -this.AIM_SPREAD_INITIAL/2;
            diffB1 = -this.AIM_SPREAD_FINAL/2;
        }
        if (this.laserState == "idle"){
            if (this.laserTime >= this.IDLE_DURATION){
                this.laserState = "preAim";
                this.laserTime = 0;
                this.frontHand.startAngle = this.frontHand.rotation;
                this.backHand.startAngle = this.backHand.rotation;
                if (this.scale.x < 0){
                    this.frontHand.startAngle -= Math.PI;
                    this.backHand.startAngle -= Math.PI;
                }
            }
        } else if (this.laserState == "preAim") {
            
            var diff = Math.angleDiff(frontHandAngle + diffF0, this.frontHand.startAngle);
            frontHandAngle = this.frontHand.startAngle + Math.easeInOutQuad(
                this.laserTime, 0, diff, this.PRE_AIM_DURATION);
            diff = Math.angleDiff(backHandAngle + diffB0, this.backHand.startAngle);
            backHandAngle = this.backHand.startAngle + Math.easeInOutQuad(
                this.laserTime, 0, diff, this.PRE_AIM_DURATION);
            if (this.scale.x > 0){
                this.frontHand.rotation = frontHandAngle;
                this.backHand.rotation = backHandAngle;
            } else {
                this.frontHand.rotation = frontHandAngle + Math.PI;
                this.backHand.rotation = backHandAngle + Math.PI;
            }
            
            if (this.laserTime >= this.PRE_AIM_DURATION){
                this.laserState = "aim";
                this.laserTime = 0;
                this.frontHand.animations.play("glow");
                this.backHand.animations.play("glow");
            }
        } else if (this.laserState == "aim") {
            
            frontHandAngle = frontHandAngle + Math.easeInOutQuad(
                this.laserTime, diffF0, diffF1-diffF0, this.AIM_DURATION);
            backHandAngle = backHandAngle + Math.easeInOutQuad(
                this.laserTime, diffB0, diffB1-diffB0, this.AIM_DURATION);
            FullGame.Lasers.fireLaser(
                frontHand.x, frontHand.y,
                Math.cos(frontHandAngle), Math.sin(frontHandAngle),
                this.laserColor, FullGame.Til.LASER_TRANSPARENT);
            FullGame.Lasers.fireLaser(
                backHand.x, backHand.y,
                Math.cos(backHandAngle), Math.sin(backHandAngle),
                this.laserColor, FullGame.Til.LASER_TRANSPARENT);
            if (this.scale.x > 0){
                this.frontHand.rotation = frontHandAngle;
                this.backHand.rotation = backHandAngle;
            } else {
                this.frontHand.rotation = frontHandAngle + Math.PI;
                this.backHand.rotation = backHandAngle + Math.PI;
            }
            
            if (this.laserTime >= this.AIM_DURATION){
                this.laserState = "fire";
                this.laserTime = 0;
            }
        } else if (this.laserState == "fire") {
            
            frontHandAngle = frontHandAngle + diffF1;
            backHandAngle = backHandAngle + diffB1;
            var laserType = FullGame.Til.LASER_NORMAL;
            if (this.laserTime >= this.FIRE_DURATION){
                laserType = FullGame.Til.LASER_FADEOUT;
            }
            FullGame.Lasers.fireLaser(
                frontHand.x, frontHand.y,
                Math.cos(frontHandAngle), Math.sin(frontHandAngle),
                this.laserColor, laserType);
            FullGame.Lasers.fireLaser(
                backHand.x, backHand.y,
                Math.cos(backHandAngle), Math.sin(backHandAngle),
                this.laserColor, laserType);
            if (this.scale.x > 0){
                this.frontHand.rotation = frontHandAngle;
                this.backHand.rotation = backHandAngle;
            } else {
                this.frontHand.rotation = frontHandAngle + Math.PI;
                this.backHand.rotation = backHandAngle + Math.PI;
            }
            
            if (this.laserTime >= this.FIRE_DURATION){
                this.laserState = "postFire";
                this.laserTime = 0;
                this.frontHand.animations.play("idle");
                this.backHand.animations.play("idle");
                this.frontHand.startAngle = this.frontHand.rotation;
                this.backHand.startAngle = this.backHand.rotation;
                if (this.scale.x < 0){
                    this.frontHand.startAngle -= Math.PI;
                    this.backHand.startAngle -= Math.PI;
                }
            }
        } else if (this.laserState == "postFire") {
            
            var rot = this.rotation;
            if (this.scale.x < 0) rot -= Math.PI;
            var diff = Math.angleDiff(rot, this.frontHand.startAngle);
            frontHandAngle = this.frontHand.startAngle + Math.easeInOutQuad(
                this.laserTime, 0, diff, this.PRE_AIM_DURATION);
            diff = Math.angleDiff(rot, this.backHand.startAngle);
            backHandAngle = this.backHand.startAngle + Math.easeInOutQuad(
                this.laserTime, 0, diff, this.PRE_AIM_DURATION);
            if (this.scale.x > 0){
                this.frontHand.rotation = frontHandAngle;
                this.backHand.rotation = backHandAngle;
            } else {
                this.frontHand.rotation = frontHandAngle + Math.PI;
                this.backHand.rotation = backHandAngle + Math.PI;
            }
            
            if (this.laserTime >= this.POST_FIRE_DURATION){
                this.laserState = "idle";
                this.laserTime = 0;
            }
        }
        
        
        
    };
    
    al.canFlipAround = function() {
        var ret = this.laserState != "preAim" && this.laserState != "fire" &&
            this.laserState != "postFire";
        return ret;
    };
    
    return al;
};

//finds x-y in [-Math.PI, Math.PI]
Math.angleDiff = function(x, y) {
    var d = x - y;
    d -= Math.PI*2 * Math.floor(d / (Math.PI*2));
    if (d > Math.PI) d -= Math.PI*2;
    return d;
};