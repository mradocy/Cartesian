//returns made finalBoss, but doesn't add it to FullGame.GI.objs (will be done in ParseObjects)
FullGame.makeFinalBoss = function(cx, cy) {
    
    var fb;
    
    fb = game.add.sprite(cx, cy, "final_boss", undefined, FullGame.GI.objGroup);
    fb.CENTER_X = 720/2.0;
    fb.CENTER_Y = 720/2.0;
    fb.anchor.setTo(fb.CENTER_X / 720, fb.CENTER_Y / 720); //sprite is centered
    fb.dead = false;
    fb.eyes = [];
    
    // EYE LOCATIONS
    fb.eyeLocs = [];
    fb.currentEyeLoc = 2;
    fb.NUM_EYES = 4;
    //0th eyes location
    fb.eyeLocs.push([
        {x:320, y:228, r:50*Math.PI/180},
        {x:273, y:276, r:25*Math.PI/180},
        {x:720-320, y:228, r:-50*Math.PI/180},
        {x:720-273, y:276, r:-25*Math.PI/180}
        ]);
    //1th eyes location
    fb.eyeLocs.push([
        {x:360, y:225, r:0*Math.PI/180},
        {x:360, y:315, r:90*Math.PI/180},
        {x:242, y:260, r:20*Math.PI/180},
        {x:720-242, y:260, r:-20*Math.PI/180}
        ]);
    //2th eyes location
    fb.eyeLocs.push([
        {x:223, y:203, r:50*Math.PI/180},
        {x:307, y:276, r:40*Math.PI/180},
        {x:720-223, y:203, r:-50*Math.PI/180},
        {x:720-307, y:276, r:-40*Math.PI/180}
        ]);
    //alter
    for (var i=0; i<fb.eyeLocs.length; i++){
        for (var j=0; j<fb.NUM_EYES; j++){
            fb.eyeLocs[i][j].x -= fb.CENTER_X;
            fb.eyeLocs[i][j].y -= fb.CENTER_Y;
        }
    }
    
    fb.setEyes = function(locationIndex){
        
        while (this.eyes.length < this.NUM_EYES){
            var eye = FullGame.makeOrb(game, FullGame.Til.RED, false, true);
            FullGame.GI.objs.push(eye.glow);
            FullGame.GI.objs.push(eye.orb);
            FullGame.GI.orbs.push(eye.orb);
            this.eyes.push(eye.orb);
        }
        this.currentEyeLoc = locationIndex;
        for (var i=0; i<this.NUM_EYES; i++){
            var eye = this.eyes[i];
            eye.relX = this.eyeLocs[locationIndex][i].x;
            eye.relY = this.eyeLocs[locationIndex][i].y;
            eye.relR = this.eyeLocs[locationIndex][i].r;
            eye.glow.rotation = eye.rotation;
            //reuse eyes/orbs
            eye.openedDoors = false;
            eye.glow.alpha = 0;
        }
    };
    fb.setEyes(fb.currentEyeLoc);
    fb.updateEyeLocations = function(){
        var c = Math.cos(this.rotation);
        var s = Math.sin(this.rotation);
        for (var i=0; i<this.eyes.length; i++){
            var eye = this.eyes[i];
            var x0 = eye.relX;
            var y0 = eye.relY;
            eye.setX(this.x + x0*c - y0*s);
            eye.setY(this.y + x0*s + y0*c);
            eye.setR(this.rotation + eye.relR);
        }
    };
    
    // CLAWS
    fb.claw1 = game.add.sprite(cx, cy, "final_claw", undefined, FullGame.GI.objGroup);
    fb.claw1.anchor.setTo(.5, .5); //sprite is centered
    var claw1 = fb.claw1;
    claw1.relX = 0;
    claw1.relY = 0;
    claw1.relR = 0;
    claw1.LASER1_X = 66 -107;
    claw1.LASER1_Y = 104 -82;
    claw1.LASER1_ANGLE = 65 *Math.PI/180;
    claw1.LASER2_X = 144 -107;
    claw1.LASER2_Y = 79 -82;
    claw1.LASER2_ANGLE = 70 *Math.PI/180;
    claw1.START_ANGLE_H3 = 20 *Math.PI/180;
    claw1.END_ANGLE_H3 = -30 *Math.PI/180;
    claw1.START_ANGLE_H2 = 25 *Math.PI/180;
    claw1.END_ANGLE_H2 = -35 *Math.PI/180;
    claw1.START_ANGLE_H1 = 30 *Math.PI/180;
    claw1.END_ANGLE_H1 = -40 *Math.PI/180;
    claw1.angleState = "idle"; //idle, start, sweep, end, damage
    claw1.angleTime = 0;
    claw1.angleDuration = 0;
    claw1.anglePrev = 0;
    claw1.BOB_DURATION = 4.0;
    claw1.BOB0_X = 20 -360;
    claw1.BOB0_Y = 320 -360;
    claw1.BOB1_X = 60 -360;
    claw1.BOB1_Y = 370 -360;
    claw1.bobTime = 0;
    claw1.DAMAGE_ANGLE = 40 *Math.PI/180;
    fb.claw2 = game.add.sprite(cx, cy, "final_claw", undefined, FullGame.GI.objGroup);
    fb.claw2.anchor.setTo(.5, .5); //sprite is centered
    fb.claw2.scale.x = -1; //reflected, but we'll try to pretend it's not
    var claw2 = fb.claw2;
    claw2.relX = 0;
    claw2.relY = 0;
    claw2.relR = 0;
    claw2.LASER1_X = 107- 66; //because reflected
    claw2.LASER1_Y = 104 -82;
    claw2.LASER1_ANGLE = Math.PI- claw1.LASER1_ANGLE;
    claw2.LASER2_X = 107- 144; //because reflected
    claw2.LASER2_Y = 79 -82;
    claw2.LASER2_ANGLE = Math.PI- claw1.LASER2_ANGLE;
    claw2.START_ANGLE_H3 = -claw1.START_ANGLE_H3;
    claw2.END_ANGLE_H3 = -claw1.END_ANGLE_H3;
    claw2.START_ANGLE_H2 = -claw1.START_ANGLE_H2;
    claw2.END_ANGLE_H2 = -claw1.END_ANGLE_H2;
    claw2.START_ANGLE_H1 = -claw1.START_ANGLE_H1;
    claw2.END_ANGLE_H1 = -claw1.END_ANGLE_H1;
    claw2.angleState = "idle"; //idle, start, sweep, end, damage
    claw2.angleTime = 0;
    claw2.angleDuration = 0;
    claw2.anglePrev = 0;
    claw2.BOB_DURATION = claw1.BOB_DURATION;
    claw2.BOB0_X = 360- 20;
    claw2.BOB0_Y = 320 -360;
    claw2.BOB1_X = 360- 60;
    claw2.BOB1_Y = 370 -360;
    claw2.bobTime = claw2.BOB_DURATION / 4;
    claw2.DAMAGE_ANGLE = -claw1.DAMAGE_ANGLE;
    fb.moveClaws = function() {
        var dt = game.time.physicsElapsed;
        var c = Math.cos(this.rotation);
        var s = Math.sin(this.rotation);
        
        var claw;
        for (var i=0; i<2; i++){
            if (i == 0) claw = this.claw1;
            else claw = this.claw2;
            
            //angleState
            claw.angleTime += dt;
            var targetAngle = 0;
            if (claw.angleState == "start"){
                claw.angleTime = Math.min(claw.angleTime, claw.angleDuration);
                switch (this.health){
                case 3:
                default:
                    targetAngle = claw.START_ANGLE_H3;
                    break;
                case 2:
                    targetAngle = claw.START_ANGLE_H2;
                    break;
                case 1:
                    targetAngle = claw.START_ANGLE_H2;
                    break;
                }
                claw.relR = Math.easeInOutQuad(claw.angleTime, claw.anglePrev, targetAngle - claw.anglePrev, claw.angleDuration);
            } else if (claw.angleState == "sweep"){
                claw.angleTime = Math.min(claw.angleTime, claw.angleDuration);
                switch (this.health){
                case 3:
                default:
                    targetAngle = claw.END_ANGLE_H3;
                    break;
                case 2:
                    targetAngle = claw.END_ANGLE_H2;
                    break;
                case 1:
                    targetAngle = claw.END_ANGLE_H2;
                    break;
                }
                claw.relR = Math.easeInOutQuad(claw.angleTime, claw.anglePrev, targetAngle - claw.anglePrev, claw.angleDuration);
            } else if (claw.angleState == "end"){
                claw.angleTime = Math.min(claw.angleTime, claw.angleDuration);
                targetAngle = 0;
                claw.relR = Math.easeInOutQuad(claw.angleTime, claw.anglePrev, targetAngle - claw.anglePrev, claw.angleDuration);
                if (claw.angleTime >= claw.angleDuration){
                    claw.angleState = "idle";
                }
            } else if (claw.angleState == "damage"){
                claw.angleTime = Math.min(claw.angleTime, claw.angleDuration);
                targetAngle = claw.DAMAGE_ANGLE;
                claw.relR = Math.easeOutQuad(claw.angleTime, claw.anglePrev, targetAngle - claw.anglePrev, claw.angleDuration);
                if (claw.angleTime >= claw.angleDuration){
                    claw.angleState = "end";
                    claw.angleTime = 0;
                    claw.angleDuration = this.CLAW_ANGLE_END_DURATION;
                    claw.anglePrev = claw.rotation;
                }
            }
            
            //bobbing
            claw.bobTime += dt;
            var t = (Math.sin(claw.bobTime / claw.BOB_DURATION *Math.PI*2) +1)/2;
            claw.relX = claw.BOB0_X + t * (claw.BOB1_X-claw.BOB0_X);
            claw.relY = claw.BOB0_Y + t * (claw.BOB1_Y-claw.BOB0_Y);
            
            //absolute position
            var x0 = claw.relX;
            var y0 = claw.relY;
            claw.x = this.x + x0*c - y0*s;
            claw.y = this.y + x0*s + y0*c;
            claw.rotation = claw.relR; //rotation not influenced by fb rotation
            
            //firing laser
            var lc = Math.cos(claw.rotation);
            var ls = Math.sin(claw.rotation);
            var x_1 = claw.LASER1_X;
            var y_1 = claw.LASER1_Y;
            var r_1 = claw.LASER1_ANGLE;
            var x1 = claw.x + x_1*lc - y_1*ls;
            var y1 = claw.y + x_1*ls + y_1*lc;
            var r1 = r_1 + claw.rotation;
            var x_2 = claw.LASER2_X;
            var y_2 = claw.LASER2_Y;
            var r_2 = claw.LASER2_ANGLE;
            var x2 = claw.x + x_2*lc - y_2*ls;
            var y2 = claw.y + x_2*ls + y_2*lc;
            var r2 = r_2 + claw.rotation;
            var color = FullGame.Til.BLUE;
            if (claw.angleState == "start"){
                FullGame.Lasers.fireLaser(
                    x1, y1,
                    Math.cos(r1), Math.sin(r1),
                    color, FullGame.Til.LASER_TRANSPARENT);
                FullGame.Lasers.fireLaser(
                    x2, y2,
                    Math.cos(r2), Math.sin(r2),
                    color, FullGame.Til.LASER_TRANSPARENT);
            } else if (claw.angleState == "sweep"){
                FullGame.Lasers.fireLaser(
                    x1, y1,
                    Math.cos(r1), Math.sin(r1),
                    color, FullGame.Til.LASER_THICK);
                 FullGame.Lasers.fireLaser(
                    x2, y2,
                    Math.cos(r2), Math.sin(r2),
                    color, FullGame.Til.LASER_THICK);
            }
            
        }
    };
    
    // BLOCKER
    fb.blocker = game.add.sprite(cx, cy, "final_blocker", undefined, FullGame.GI.objGroup);
    FullGame.GI.objs.push(fb.blocker);
    fb.blocker.CENTER_X = 60/2.0;
    fb.blocker.CENTER_Y = 86/2.0;
    fb.blocker.anchor.setTo(fb.blocker.CENTER_X / 60, fb.blocker.CENTER_Y / 86); //sprite is centered
    fb.blocker.relX = 0;
    fb.blocker.relY = 0;
    var color = FullGame.Til.BLUE;
    fb.blocker.laserLines = [];
    fb.blocker.baseLaserLines = [
        {x0:4, y0:7, x1:12, y1:39, color:color},
        {x0:12, y0:39, x1:14, y1:74, color:color},
        {x0:14, y0:74, x1:30, y1:79, color:color},
        {x0:30, y0:79, x1:60-14, y1:74, color:color},
        {x0:60-14, y0:74, x1:60-12, y1:39, color:color},
        {x0:60-12, y0:39, x1:60-4, y1:7, color:color}
        ];
    //alter and create current laser lines
    for (var i=0; i<fb.blocker.baseLaserLines.length; i++){
        fb.blocker.baseLaserLines[i].x0 -= fb.blocker.CENTER_X;
        fb.blocker.baseLaserLines[i].y0 -= fb.blocker.CENTER_Y;
        fb.blocker.baseLaserLines[i].x1 -= fb.blocker.CENTER_X;
        fb.blocker.baseLaserLines[i].y1 -= fb.blocker.CENTER_Y;
        fb.blocker.laserLines.push(
            {x0:fb.blocker.baseLaserLines[i].x0,
             y0:fb.blocker.baseLaserLines[i].y0,
             x1:fb.blocker.baseLaserLines[i].x1,
             y1:fb.blocker.baseLaserLines[i].y1,
             color:fb.blocker.baseLaserLines[i].color}
        );
    }
    fb.currentBlockerLoc = 0;
    fb.prevBlockerLoc = -1;
    fb.blockerTime = 9999;
    fb.BLOCKER_DURATION = 1.0;
    fb.blockerLocs = [
        {x:360, y:136},
        {x:360, y:160},
        {x:360, y:220}
        ];
    //alter
    for (var i=0; i<fb.blockerLocs.length; i++){
        fb.blockerLocs[i].x -= fb.CENTER_X;
        fb.blockerLocs[i].y -= fb.CENTER_Y;
    }
    fb.setBlocker = function(locationIndex){
        if (this.prevBlockerLoc == -1){
            this.blocker.relX = fb.blockerLocs[locationIndex].x;
            this.blocker.relY = fb.blockerLocs[locationIndex].y;
        } else {
            this.blockerTime = 0;
        }
        this.prevBlockerLoc = this.currentBlockerLoc;
        this.currentBlockerLoc = locationIndex;
    };
    fb.setBlocker(fb.currentBlockerLoc);
    fb.updateBlockerLocation = function(){
        var dt = game.time.physicsElapsed;
        var blocker = this.blocker;
        if (this.blockerTime < this.BLOCKER_DURATION){
            this.blockerTime += dt;
            var x0 = this.blockerLocs[this.prevBlockerLoc].x;
            var y0 = this.blockerLocs[this.prevBlockerLoc].y;
            var x1 = this.blockerLocs[this.currentBlockerLoc].x;
            var y1 = this.blockerLocs[this.currentBlockerLoc].y;
            if (this.blockerTime >= this.BLOCKER_DURATION){
                blocker.relX = x1;
                blocker.relY = y1;
            } else {
                blocker.relX = x0 + (x1-x0) * this.blockerTime;
                blocker.relY = y0 + (y1-y0) * this.blockerTime;
            }
        }
        var c = Math.cos(this.rotation);
        var s = Math.sin(this.rotation);
        var x0 = blocker.relX;
        var y0 = blocker.relY;
        blocker.x = this.x + x0*c - y0*s;
        blocker.y = this.y + x0*s + y0*c;
        blocker.rotation = this.rotation;
    };
    
    // LASER LINES
    var cHead = FullGame.Til.RED;
    var cInner = FullGame.Til.BLACK;
    fb.laserLines = [];
    //left side
    fb.baseLaserLines = [
        
        {x0:59, y0:184, x1:135, y1:158, color:cHead},
        {x0:135, y0:158, x1:225, y1:152, color:cHead},
        {x0:225, y0:152, x1:345, y1:189, color:cHead},
        
        {x0:160, y0:182, x1:160, y1:273, color:cHead},
        {x0:160, y0:273, x1:179, y1:179, color:cHead},
        
        {x0:168, y0:161, x1:150, y1:176, color:cInner},
        {x0:150, y0:176, x1:119, y1:226, color:cInner},
        {x0:119, y0:226, x1:100, y1:310, color:cInner},
        {x0:100, y0:310, x1:137, y1:228, color:cInner},
        {x0:137, y0:228, x1:171, y1:190, color:cInner},
        {x0:171, y0:190, x1:237, y1:154, color:cInner}
        
    ];
    //add right side (reflection of left)
    var l = fb.baseLaserLines.length;
    for (var i=0; i<l; i++){
        var bll = fb.baseLaserLines[i];
        fb.baseLaserLines.push( {x0:(fb.CENTER_X*2-bll.x0), y0:bll.y0, x1:(fb.CENTER_X*2-bll.x1), y1:bll.y1, color:bll.color} );
    }
    //the flat center part
    fb.baseLaserLines.push( {x0:345, y0:189, x1:375, y1:189, color:cHead} );
    //alter and create current laser lines
    for (var i=0; i<fb.baseLaserLines.length; i++){
        fb.baseLaserLines[i].x0 -= fb.CENTER_X;
        fb.baseLaserLines[i].y0 -= fb.CENTER_Y;
        fb.baseLaserLines[i].x1 -= fb.CENTER_X;
        fb.baseLaserLines[i].y1 -= fb.CENTER_Y;
        fb.laserLines.push(
            {x0:fb.baseLaserLines[i].x0,
             y0:fb.baseLaserLines[i].y0,
             x1:fb.baseLaserLines[i].x1,
             y1:fb.baseLaserLines[i].y1,
             color:fb.baseLaserLines[i].color}
        );
    }
    fb.setLaserLines = function() {
        if (this.dead) return;
        var c = Math.cos(this.rotation);
        var s = Math.sin(this.rotation);
        var lines = this.baseLaserLines;
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
        //for blocker too
        var blocker = this.blocker;
        c = Math.cos(blocker.rotation);
        s = Math.sin(blocker.rotation);
        var lines = blocker.baseLaserLines;
        for (var i=0; i<blocker.baseLaserLines.length; i++){
            bll = blocker.baseLaserLines[i];
            x0 = bll.x0 * blocker.scale.x;
            y0 = bll.y0 * blocker.scale.y;
            x1 = bll.x1 * blocker.scale.x;
            y1 = bll.y1 * blocker.scale.y;
            blocker.laserLines[i].x0 = x0*c - y0*s;
            blocker.laserLines[i].y0= x0*s + y0*c;
            blocker.laserLines[i].x1 = x1*c - y1*s;
            blocker.laserLines[i].y1 = x1*s + y1*c;
        }
    };
    fb.setLaserLines();
    fb.setLaserLinesTempBlack = function() {
        if (this.dead) return;
        for (var i=0; i<this.laserLines.length; i++){
            this.laserLines[i].color = FullGame.Til.BLACK;
        }
    };
    fb.setLaserLinesRevertColor = function() {
        if (this.dead) return;
        for (var i=0; i<this.baseLaserLines.length; i++){
            this.laserLines[i].color = this.baseLaserLines[i].color;
        }
    };
    
    // PATHS, MOVING
    fb.pathPoints = []; //to be filled with {x, y} from left to right (coordinates from AlienPath)
    fb.findPathPoints = function() {
        for (var i=0; i<FullGame.AlienPath.points.length; i++){
            this.pathPoints.push(
                {x:FullGame.AlienPath.points[i].x, y:FullGame.AlienPath.points[i].y});
        }
        this.pathPoints.sort(function(pt1, pt2){
            return pt1.x - pt2.x;
        });
    };
    fb.health = 3;
    fb.moveState = "begin"; //begin, idle, rise, move
    fb.moveTime = 0;
    fb.moveDuration = 0;
    fb.movingRight = false;
    fb.prevX = 0;
    fb.prevY = 0;
    fb.MOVE_HORIZ_SPEED_H3 = 70; //determins move duration
    fb.MOVE_HORIZ_SPEED_H2 = 110;
    fb.MOVE_HORIZ_SPEED_H1 = 150;
    fb.IDLE_DURATION_H3 = 5.0;
    fb.IDLE_DURATION_H2 = 4.5;
    fb.IDLE_DURATION_H1 = 4.0;
    fb.CLAW_ANGLE_START_DURATION = .8;
    fb.CLAW_ANGLE_END_DURATION = .4;
    fb.RISE_DURATION = 4.0;
    fb.RISE_DIST = 800;
    fb.MAX_INDEX_MOVE = 99;
    fb.pathIndexTo = 0;
    fb.MOVE_ROTATION_MAX = 15 *Math.PI/180;
    fb.DAMAGE_DIST = 100;
    fb.DAMAGE_DURATION = 1.3;
    
    fb.idle = function(){
        this.moveState = "idle";
        this.moveTime = 0;
        switch (this.health){
        case 3:
        default:
            this.moveDuration = this.IDLE_DURATION_H3;
            break;
        case 2:
            this.moveDuration = this.IDLE_DURATION_H2;
            break;
        case 1:
            this.moveDuration = this.IDLE_DURATION_H1;
            break;
        }
    };
    fb.rise = function(pathIndex){
        this.moveState = "rise";
        this.moveTime = 0;
        this.moveDuration = this.RISE_DURATION;
        this.pathIndexTo = pathIndex;
        this.x = this.pathPoints[this.pathIndexTo].x;
        this.y = this.pathPoints[this.pathIndexTo].y + this.RISE_DIST;
        this.prevX = this.x;
        this.prevY = this.y;
    };
    fb.move = function(pathIndex){
        this.moveState = "move";
        this.moveTime = 0;
        this.pathIndexTo = pathIndex;
        this.prevX = this.x;
        this.prevY = this.y;
        var x1 = this.pathPoints[this.pathIndexTo].x;
        var dist = Math.abs(x1 - this.x);
        var speed = this.MOVE_HORIZ_SPEED_H3;
        switch (this.health){
        case 3:
            speed = this.MOVE_HORIZ_SPEED_H3;
            break;
        case 2:
            speed = this.MOVE_HORIZ_SPEED_H2;
            break;
        case 1:
            speed = this.MOVE_HORIZ_SPEED_H1;
            break;
        }
        this.moveDuration = dist / speed;
    };
    fb.dealDamage = function(){
        if (this.moveState == "damage")
            return;
        this.health--;
        if (this.health == 2){
            this.setBlocker(1);
        }
        if (this.health == 1){
            this.setBlocker(2);
        }
        this.moveState = "damage";
        this.damageShake(10 *Math.PI/180);
        this.moveTime = 0;
        this.prevX = this.x;
        this.prevY = this.y;
        this.moveDuration = this.DAMAGE_DURATION;
        this.setLaserLinesTempBlack(); //temporarily set to black so player does hit himself by mistake
        
        //claws behavior
        claw1.angleState = "damage";
        claw1.anglePrev = claw1.rotation;
        claw1.angleTime = 0;
        claw1.angleDuration = this.moveDuration - this.CLAW_ANGLE_END_DURATION - .1;
        claw2.angleState = "damage";
        claw2.anglePrev = claw2.rotation;
        claw2.angleTime = 0;
        claw2.angleDuration = claw1.angleDuration;
        
    };
    
    
    
    // SHAKING
    fb.shakeTime = 99999;
    fb.shakeDuration = 2.5;
    fb.shakeAmplitdue = 0;
    fb.DAMAGE_SHAKE_PERIOD = .6;
    fb.damageShake = function(amplitude) {
        this.shakeTime = 0;
        this.shakeAmplitude = amplitude;
    };
    
    
    fb.update = function() {
        var dt = game.time.physicsElapsed;
        var plr = FullGame.GI.player;
        
        if (this.pathPoints.length == 0){
            this.findPathPoints();
        }
        
        //moveState
        this.moveTime += dt;
        if (this.moveState == "begin"){
            this.rise(2);
        } else if (this.moveState == "idle"){
            
            if (this.moveTime >= this.moveDuration-this.CLAW_ANGLE_START_DURATION &&
                this.moveTime-dt < this.moveDuration-this.CLAW_ANGLE_START_DURATION){
                
                //get ready to move claw
                
                //find direction
                this.movingRight = (this.x < plr.x);
                if (this.movingRight && this.pathPoints[this.pathPoints.length-1].x-10 < this.x)
                    this.movingRight = false;
                if (!this.movingRight && this.pathPoints[0].x+10 > this.x)
                    this.movingRight = true;
                //move claw into start phase
                var claw = this.claw1;
                if (!this.movingRight) claw = this.claw2;
                claw.angleState = "start";
                claw.anglePrev = claw.rotation;
                claw.angleTime = 0;
                claw.angleDuration = this.CLAW_ANGLE_START_DURATION;
                
            } else if (this.moveTime >= this.moveDuration && (plr != null && !plr.dead())){
                //move somewhere else
                
                //decide where to move
                var x = 0;
                var ind = 0;
                if (this.movingRight){
                    //move right, try to go past player
                    x = plr.x + 0;
                    for (ind=0; ind<this.pathPoints.length-1; ind++){
                        if (x < this.pathPoints[ind].x && this.x < this.pathPoints[ind].x)
                            break;
                    }
                    
                    ind = this.pathIndexTo + Math.min(this.MAX_INDEX_MOVE, ind - this.pathIndexTo);
                } else {
                    //move left, try to go past player
                    x = plr.x - 0;
                    for (ind=this.pathPoints.length-1; ind>=1; ind--){
                        if (this.pathPoints[ind].x < x && this.pathPoints[ind].x < this.x)
                            break;
                    }
                    
                    ind = this.pathIndexTo + Math.min(this.MAX_INDEX_MOVE, ind - this.pathIndexTo);
                }
                
                this.move(ind);
                
                //move claw into sweep phase
                var claw = this.claw1;
                if (!this.movingRight) claw = this.claw2;
                claw.angleState = "sweep";
                claw.anglePrev = claw.rotation;
                claw.angleTime = 0;
                claw.angleDuration = this.moveDuration;
            }
        } else if (this.moveState == "rise"){
            if (this.moveTime < this.moveDuration){
                this.x = Math.easeOutQuad(this.moveTime, this.prevX, this.pathPoints[this.pathIndexTo].x-this.prevX, this.moveDuration);
                this.y = Math.easeOutQuad(this.moveTime, this.prevY, this.pathPoints[this.pathIndexTo].y-this.prevY, this.moveDuration);
                
            } else {
                this.x = this.pathPoints[this.pathIndexTo].x;
                this.y = this.pathPoints[this.pathIndexTo].y;
                this.idle();
                this.moveTime = this.moveDuration - this.CLAW_ANGLE_START_DURATION - .1; //so can start attacking earlier
            }
        } else if (this.moveState == "move"){
            if (this.moveTime < this.moveDuration){
                //position
                this.x = Math.easeInOutQuad(this.moveTime, this.prevX, this.pathPoints[this.pathIndexTo].x-this.prevX, this.moveDuration);
                this.y = Math.easeOutQuad(this.moveTime, this.prevY, this.pathPoints[this.pathIndexTo].y-this.prevY, this.moveDuration);
                
                //rotation
                var r = Math.min(1, this.moveTime / this.moveDuration);
                if (r < .6){
                    r = Math.easeInOutQuad(r, 0, 1, .6);
                } else {
                    r = Math.easeInOutQuad(r-.6, 1, -1, .4);
                }
                if (this.pathPoints[this.pathIndexTo].x - this.prevX > 0){ //moving right
                    this.rotation = r * this.MOVE_ROTATION_MAX;
                } else { //moving left
                    this.rotation = -r * this.MOVE_ROTATION_MAX;
                }
                
            } else {
                this.x = this.pathPoints[this.pathIndexTo].x;
                this.y = this.pathPoints[this.pathIndexTo].y;
                this.rotation = 0;
                this.idle();
                
                //move claw into end phase
                var claw = this.claw1;
                if (!this.movingRight) claw = this.claw2;
                claw.angleState = "end";
                claw.anglePrev = claw.rotation;
                claw.angleTime = 0;
                claw.angleDuration = this.CLAW_ANGLE_END_DURATION;
            }
        } else if (this.moveState == "damage"){
            if (this.moveTime < this.moveDuration){
                //position
                this.x = this.prevX;
                if (this.moveTime < this.moveDuration*2/3){
                    this.y = Math.easeOutQuad(this.moveTime, this.prevY, this.DAMAGE_DIST, this.moveDuration*2/3);
                } else {
                    this.y = Math.easeOutQuad(this.moveTime-this.moveDuration*2/3, this.prevY+this.DAMAGE_DIST, -this.DAMAGE_DIST/3, this.moveDuration/3);
                }
                
            } else {
                this.setLaserLinesRevertColor();
                this.idle();
                this.moveTime = this.moveDuration - this.CLAW_ANGLE_START_DURATION - .1; //so can start attacking earlier
            }
        }
        
        //shaking
        if (this.moveState != "move"){
            if (this.shakeTime < this.shakeDuration){
                this.shakeTime = Math.min(this.shakeDuration, this.shakeTime+dt);
                var ampl = this.shakeAmplitude * Math.easeOutQuad(this.shakeTime, 1, -1, this.shakeDuration);
                this.rotation = ampl * Math.sin(this.shakeTime / this.DAMAGE_SHAKE_PERIOD *Math.PI*2);
            } else {
                this.rotation = 0;
            }
        }
        
        this.updateEyeLocations();
        this.updateBlockerLocation();
        this.moveClaws();
        this.setLaserLines();
    };
    
    fb.afterCollision = function() {
        var dt = game.time.physicsElapsed;
        var plr = FullGame.GI.player;
        
    };
    
    return fb;
    
};