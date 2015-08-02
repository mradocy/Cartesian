//returns made finalBoss, but doesn't add it to FullGame.GI.objs (will be done in ParseObjects)
FullGame.makeFinalBoss = function(cx, cy) {
    
    var fb;
    
    fb = game.add.sprite(cx, cy, "final_boss", undefined, FullGame.GI.objGroup);
    fb.CENTER_X = 720/2.0;
    fb.CENTER_Y = 720/2.0;
    fb.anchor.setTo(fb.CENTER_X / 720, fb.CENTER_Y / 720); //sprite is centered
    fb.animations.add("idle", [0], 30, true);
    fb.animations.add("flash", [1, 2], 20, true);
    fb.animations.play("idle");
    fb.dead = false;
    fb.eyes = [];
    fb.laserTranspSound = game.sound.add("laser_transp_alien", 1, true);
    fb.laserThickSound = game.sound.add("laser_thick_alien", 1, true);
    fb.spaceship = null;
    fb.encounter = (FullGame.Vars.startMap != "finalArena");
    
    // EYE LOCATIONS
    fb.eyeLocs = [];
    fb.currentEyeLoc = 0;
    if (fb.encounter)
        fb.currentEyeLoc = 0;
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
        {x:360, y:227, r:0*Math.PI/180},
        {x:360, y:315, r:90*Math.PI/180},
        {x:242, y:260, r:20*Math.PI/180},
        {x:720-242, y:260, r:-20*Math.PI/180}
        ]);
    //2th eyes location
    fb.eyeLocs.push([
        {x:223, y:199, r:50*Math.PI/180},
        {x:309, y:276, r:55*Math.PI/180},
        {x:720-223, y:199, r:-50*Math.PI/180},
        {x:720-309, y:276, r:-55*Math.PI/180}
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
            eye.orb.morph = game.add.sprite(0, 0, "final_eye_morph", undefined, FullGame.GI.objGroup);
            eye.orb.morph.anchor.setTo(.5, .5); //sprite is centered
            eye.orb.morph.animations.add("idle", [0], 20, true);
            eye.orb.morph.animations.add("open", [0, 1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], 18, true);
            eye.orb.morph.animations.add("close", [4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 18, true);
            eye.orb.morph.visible = false;
            eye.orb.morph.time = 9999;
            eye.orb.morph.duration = 5 / 18.0;
            eye.orb.morph.opening = false;
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
            //set morphs
            eye.morph.visible = true;
            eye.morph.animations.play("open");
            eye.morph.time = 0;
            eye.morph.opening = true;
            eye.visible = false;
        }
    };
    fb.setEyes(fb.currentEyeLoc);
    fb.closeEyes = function(){
        for (var i=0; i<this.NUM_EYES; i++){
            var eye = this.eyes[i];
            //set morphs
            eye.morph.visible = true;
            eye.morph.animations.play("close");
            eye.morph.time = 0;
            eye.morph.opening = false;
            eye.visible = false;
        }
    };
    fb.updateEyeLocations = function(){
        var dt = game.time.physicsElapsed;
        var c = Math.cos(this.rotation);
        var s = Math.sin(this.rotation);
        for (var i=0; i<this.eyes.length; i++){
            var eye = this.eyes[i];
            var x0 = eye.relX;
            var y0 = eye.relY;
            eye.setX(this.x + x0*c - y0*s);
            eye.setY(this.y + x0*s + y0*c);
            eye.setR(this.rotation + eye.relR);
            //morphs
            eye.morph.x = eye.x;
            eye.morph.y = eye.y;
            eye.morph.rotation = eye.rotation;
            if (eye.morph.time < eye.morph.duration){
                eye.morph.time += dt;
                if (eye.morph.time >= eye.morph.duration){
                    if (eye.morph.opening){
                        eye.morph.visible = false;
                        eye.visible = true;
                    } else {
                        eye.morph.visible = false;
                        eye.visible = false;
                    }
                }
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
    fb.blocker.falling = false; //will fall from head during the final blow
    fb.blocker.vx = 0;
    fb.blocker.vy = 0;
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
    fb.BLOCKER_DURATION = 2.0;
    fb.blockerLocs = [
        {x:360, y:136},
        {x:360, y:162},
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
        if (blocker.falling){
            if (blocker.y < FullGame.GI.worldHeight + 200){
                var GRAVITY = 600;
                blocker.vx = 100;
                blocker.vy += GRAVITY * dt;
                blocker.x += blocker.vx * dt;
                blocker.y += blocker.vy * dt;
                blocker.rotation += 3 * dt;
            }
        } else {
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
                    blocker.relX = x0 + (x1-x0) * this.blockerTime / this.BLOCKER_DURATION;
                    blocker.relY = y0 + (y1-y0) * this.blockerTime / this.BLOCKER_DURATION;
                }
            }
            var c = Math.cos(this.rotation);
            var s = Math.sin(this.rotation);
            var x0 = blocker.relX;
            var y0 = blocker.relY;
            blocker.x = this.x + x0*c - y0*s;
            blocker.y = this.y + x0*s + y0*c;
            blocker.rotation = this.rotation;
        }
    };
    fb.hair = game.add.sprite(cx, cy, "final_hair", undefined, FullGame.GI.objGroup);
    fb.hair.anchor.setTo(fb.CENTER_X / 720, fb.CENTER_Y / 330); //sprite is centered
    fb.hair.animations.add("idle", [0], 30, true);
    fb.hair.animations.add("flash", [0, 1], 20, true);
    fb.hair.animations.play("idle");
    
    
    // CLAWS
    fb.claw1 = game.add.sprite(cx, cy, "final_claw", undefined, FullGame.GI.objGroup);
    fb.claw1.anchor.setTo(.5, .5); //sprite is centered
    fb.claw1.animations.add("idle", [0], 30, true);
    fb.claw1.animations.add("glow", [1], 30, true);
    fb.claw1.animations.play("idle");
    var claw1 = fb.claw1;
    claw1.relX = 0;
    claw1.relY = 0;
    claw1.relR = 0;
    claw1.LASER1_X = 66 -107;
    claw1.LASER1_Y = 104 -82;
    claw1.LASER1_ANGLE = 64 *Math.PI/180;
    claw1.LASER2_X = 144 -107;
    claw1.LASER2_Y = 79 -82;
    claw1.LASER2_ANGLE = 71 *Math.PI/180;
    claw1.START_ANGLE_H3 = 20 *Math.PI/180;
    claw1.END_ANGLE_H3 = -25 *Math.PI/180;
    claw1.START_ANGLE_H2 = 25 *Math.PI/180;
    claw1.END_ANGLE_H2 = -40 *Math.PI/180;
    claw1.START_ANGLE_H1 = 30 *Math.PI/180;
    claw1.END_ANGLE_H1 = -50 *Math.PI/180;
    claw1.angleState = "idle"; //idle, start, sweep, end, damage, deadClear
    claw1.angleTime = 0;
    claw1.angleDuration = 0;
    claw1.anglePrev = 0;
    claw1.BOB_DURATION = 4.0;
    claw1.BOB0_X = 20 -360;
    claw1.BOB0_Y = 330 -360;
    claw1.BOB1_X = 60 -360;
    claw1.BOB1_Y = 370 -360;
    claw1.bobTime = 0;
    claw1.DAMAGE_ANGLE = 40 *Math.PI/180;
    claw1.smokeTime = 0;
    fb.claw2 = game.add.sprite(cx, cy, "final_claw", undefined, FullGame.GI.objGroup);
    fb.claw2.animations.add("idle", [0], 30, true);
    fb.claw2.animations.add("glow", [1], 30, true);
    fb.claw2.animations.play("idle");
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
    claw2.angleState = "idle"; //idle, start, sweep, end, damage, deadClear
    claw2.angleTime = 0;
    claw2.angleDuration = 0;
    claw2.anglePrev = 0;
    claw2.BOB_DURATION = claw1.BOB_DURATION;
    claw2.BOB0_X = 360- 20;
    claw2.BOB0_Y = 330 -360;
    claw2.BOB1_X = 360- 60;
    claw2.BOB1_Y = 370 -360;
    claw2.bobTime = claw2.BOB_DURATION / 4;
    claw2.DAMAGE_ANGLE = -claw1.DAMAGE_ANGLE;
    claw2.smokeTime = 0;
    fb.moveClaws = function() {
        var dt = game.time.physicsElapsed;
        var plr = FullGame.GI.player;
        var c = Math.cos(this.rotation);
        var s = Math.sin(this.rotation);
        
        var claw;
        var transpPlaying = false;
        var thickPlaying = false;
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
                    targetAngle = claw.START_ANGLE_H1;
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
                    targetAngle = claw.END_ANGLE_H1;
                    break;
                }
                claw.relR = Math.easeInOutQuad(claw.angleTime, claw.anglePrev, targetAngle - claw.anglePrev, claw.angleDuration);
            } else if (claw.angleState == "end"){
                claw.angleTime = Math.min(claw.angleTime, claw.angleDuration);
                targetAngle = 0;
                claw.relR = Math.easeInOutQuad(claw.angleTime, claw.anglePrev, targetAngle - claw.anglePrev, claw.angleDuration);
                if (claw.angleTime >= claw.angleDuration){
                    claw.angleState = "idle";
                    claw.animations.play("idle");
                }
            } else if (claw.angleState == "damage"){
                claw.angleTime = Math.min(claw.angleTime, claw.angleDuration);
                targetAngle = claw.DAMAGE_ANGLE;
                claw.relR = Math.easeOutQuad(claw.angleTime, claw.anglePrev, targetAngle - claw.anglePrev, claw.angleDuration);
                if (claw.angleTime >= claw.angleDuration){
                    claw.angleState = "end";
                    claw.animations.play("idle");
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
            var color = FullGame.Til.PURPLE;
            if (claw.angleState == "start"){
                FullGame.Lasers.fireLaser(
                    x1, y1,
                    Math.cos(r1), Math.sin(r1),
                    color, FullGame.Til.LASER_TRANSPARENT);
                FullGame.Lasers.fireLaser(
                    x2, y2,
                    Math.cos(r2), Math.sin(r2),
                    color, FullGame.Til.LASER_TRANSPARENT);
                transpPlaying = true;
            } else if (claw.angleState == "sweep"){
                FullGame.Lasers.fireLaser(
                    x1, y1,
                    Math.cos(r1), Math.sin(r1),
                    color, FullGame.Til.LASER_THICK);
                 FullGame.Lasers.fireLaser(
                    x2, y2,
                    Math.cos(r2), Math.sin(r2),
                    color, FullGame.Til.LASER_THICK);
                thickPlaying = true;
            }
            
        }
        
        if (plr.dead() ||
            FullGame.HUD.blackScreen.visible){
            transpPlaying = false;
            thickPlaying = false;
        }
        if (transpPlaying){
            if (!this.laserTranspSound.isPlaying && !FullGame.Vars.sfxMuted &&
                (plr != null && !plr.dead())){
                this.laserTranspSound.play("", 0, 1, true);
            }
        } else {
            if (this.laserTranspSound.isPlaying)
                this.laserTranspSound.stop();
        }
        if (thickPlaying){
            if (!this.laserThickSound.isPlaying && !FullGame.Vars.sfxMuted &&
                (plr != null && !plr.dead())){
                this.laserThickSound.play("", 0, 1, true);
            }
        } else {
            if (this.laserThickSound.isPlaying)
                this.laserThickSound.stop();
        }
        
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
    if (fb.encounter)
        fb.health = 2;
    fb.moveState = "begin"; //begin, idle, rise, move, deadClear
    fb.moveTime = 0;
    fb.moveDuration = 0;
    fb.movingRight = false;
    fb.prevX = 0;
    fb.prevY = 0;
    fb.MOVE_HORIZ_SPEED_H3 = 70; //determins move duration
    fb.MOVE_HORIZ_SPEED_H2 = 100;
    fb.MOVE_HORIZ_SPEED_H1 = 130;
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
    fb.DAMAGE_DEAD_DURATION = 6;
    
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
        } else if (this.health == 1){
            this.setBlocker(2);
        } else if (this.health == 0){
            this.blocker.falling = true;
            this.dead = true;
        }
        this.closeEyes();
        FullGame.playSFX("damage_flesh");
        if (this.health == 0){
            FullGame.playSFX("final_death");
            FullGame.HUD.solveFlash();
            FullGame.fadeOutMusic(1.0);
        } else {
            FullGame.playSFX("final_damage");
        }
        
        this.moveState = "damage";
        this.damageShake(10 *Math.PI/180);
        this.animations.play("flash");
        this.hair.animations.play("flash");
        this.moveTime = 0;
        this.prevX = this.x;
        this.prevY = this.y;
        this.moveDuration = this.DAMAGE_DURATION;
        if (this.dead){
            this.moveDuration = this.DAMAGE_DEAD_DURATION;
        }
        this.setLaserLinesTempBlack(); //temporarily set to black so player does hit himself by mistake
        
        //claws behavior
        claw1.angleState = "damage";
        claw1.animations.play("idle");
        claw1.anglePrev = claw1.rotation;
        claw1.angleTime = 0;
        claw1.angleDuration = this.moveDuration - this.CLAW_ANGLE_END_DURATION - .1;
        claw2.angleState = "damage";
        claw2.animations.play("idle");
        claw2.anglePrev = claw2.rotation;
        claw2.angleTime = 0;
        claw2.angleDuration = claw1.angleDuration;
        
    };
    
    // SMOKE
    fb.SMOKE_SPAWN_BOX = {
        x:-170,
        y:590 - 360,
        w:340,
        h:30,
        r:0
    };
    fb.DEAD_SMOKE_SPAWN_BOX = {
        x:-190,
        y:155 - 360,
        w:380,
        h:460,
        r:0
    };
    fb.SMOKE_SPEED = 100;
    fb.SMOKE_ACCEL = 250;
    fb.SMOKE_PERIOD = .012;
    fb.DEAD_SMOKE_PERIOD = .030;
    fb.CLAW_SMOKE_SPAWN_BOX = {
        x:160 - 107,
        y:100 - 82,
        w:110,
        h:30,
        r:-140 *Math.PI/180
    };
    fb.CLAW_SMOKE_PERIOD = .040;
    fb.CLAW_SMOKE_SPEED = 40;
    fb.CLAW_SMOKE_ACCEL = 0;
    fb.smokeTime = 0;
    fb.smokeCache = []; //recycles smoke particles
    fb.smokeClawCache = [];
    fb.uniformT = 0;
    fb.uniformTPeriod = 1.0/5;
    fb.spawnSmoke = function(numSmokes, source) {
        var spawnBox;
        var smokeKey = "final_smoke";
        if (source == this){
            if (this.dead){
                spawnBox = this.DEAD_SMOKE_SPAWN_BOX;
            } else {
                spawnBox = this.SMOKE_SPAWN_BOX;
            }
            smokeKey = "final_smoke";
        } else if (source == this.claw1 || source == this.claw2){
            spawnBox = this.CLAW_SMOKE_SPAWN_BOX;
            smokeKey = "final_claw_smoke";
        }
        
        var c = Math.cos(spawnBox.r);
        var s = Math.sin(spawnBox.r);
        var c2 = Math.cos(source.rotation);
        var s2 = Math.sin(source.rotation);
        var heading;
        if (source.scale.x > 0){
            heading = spawnBox.r + source.rotation + Math.PI/2;
        } else {
            heading = -spawnBox.r + source.rotation + Math.PI/2;
        }
        var ch = Math.cos(heading);
        var sh = Math.sin(heading);
        for (var i=0; i<numSmokes; i++){
            
            var x0 = 0;
            if (source == this){
                this.uniformT += this.uniformTPeriod;
                if (this.uniformT > 1.0001)
                    this.uniformT = 0;
                x0 = this.uniformT * spawnBox.w;
            } else {
                x0 = Math.random() * spawnBox.w;
            }
            var y0 = Math.random() * spawnBox.h;
            var x = x0*c - y0*s;
            var y = x0*s + y0*c;
            if (false && this.dead){
                x = x0 + spawnBox.x;
                y = y0 + spawnBox.y;
                heading = Math.atan2(y, x);
                ch = Math.cos(heading);
                sh = Math.sin(heading);
            } else {
                x0 = (x + spawnBox.x) * source.scale.x;
                y0 = (y + spawnBox.y) * source.scale.y;
                x = x0*c2 - y0*s2;
                y = x0*s2 + y0*c2;
            }
            x += source.x;
            y += source.y;
            
            var sm;
            if (smokeKey == "final_smoke"){
                if (this.smokeCache.length == 0){
                    sm = game.add.sprite(x, y, smokeKey, undefined, FullGame.GI.objGroup);
                    sm.animations.add("play", [0, 1, 2, 3, 4, 5], 10, false);
                    sm.fb = this;
                    sm.update = function() {
                        var dt = game.time.physicsElapsed;
                        this.vx += this.ax * dt;
                        this.vy += this.ay * dt;
                        this.x += this.vx * dt;
                        this.y += this.vy * dt;
                        this.t += dt;
                        if (this.t > this.duration){
                            this.visible = false;
                            this.fb.smokeCache.push(this);
                        }
                    };
                } else {
                    sm = this.smokeCache.pop();
                    sm.x = x;
                    sm.y = y;
                    sm.visible = true;
                    sm.animations.stop();
                }
            } else {
                if (this.smokeClawCache.length == 0){
                    sm = game.add.sprite(x, y, smokeKey, undefined, FullGame.GI.objGroup);
                    sm.animations.add("play", [0, 1, 2, 3, 4, 5], 10, false);
                    sm.fb = this;
                    sm.update = function() {
                        var dt = game.time.physicsElapsed;
                        this.vx += this.ax * dt;
                        this.vy += this.ay * dt;
                        this.x += this.vx * dt;
                        this.y += this.vy * dt;
                        this.t += dt;
                        if (this.t > this.duration){
                            this.visible = false;
                            this.fb.smokeClawCache.push(this);
                        }
                    };
                } else {
                    sm = this.smokeClawCache.pop();
                    sm.x = x;
                    sm.y = y;
                    sm.visible = true;
                    sm.animations.stop();
                }
            }
            sm.animations.play("play");
            if (source == this){
                //FullGame.GI.objGroup.setChildIndex(sm, FullGame.GI.objGroup.getChildIndex(this)+1);
                FullGame.GI.objGroup.setChildIndex(sm, 0);
            } else if (source == this.claw1 || source == this.claw2){
                FullGame.GI.objGroup.setChildIndex(sm, 0);
            }
            if (this.dead){
                sm.bringToTop();
            }
            sm.t = 0;
            sm.duration = 6 / 10.0 + .5;
            sm.anchor.setTo(.5, .5);
            if (source == this) {
                sm.vx = this.SMOKE_SPEED * ch + 0;
                sm.vy = this.SMOKE_SPEED * sh + 0;
                sm.ax = this.SMOKE_ACCEL * ch;
                sm.ay = this.SMOKE_ACCEL * sh;
            } else {
                sm.vx = this.CLAW_SMOKE_SPEED * ch + 0;
                sm.vy = this.CLAW_SMOKE_SPEED * sh + 0;
                sm.ax = this.CLAW_SMOKE_ACCEL * ch;
                sm.ay = this.CLAW_SMOKE_ACCEL * sh;
            }
            
        }
    };
    
    // SHAKING
    fb.shakeTime = 99999;
    fb.shakeDuration = 2.5;
    fb.shakeDeadDuration = 7;
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
            this.rise(1);
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
                claw.animations.play("idle");
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
                claw.animations.play("glow");
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
                claw.animations.play("idle");
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
                //go back to idle
                this.setLaserLinesRevertColor();
                this.idle();
                if (this.health == 2){
                    this.setEyes(1);
                }
                if (this.health <= 1){
                    this.setEyes(2);
                }
                this.animations.play("idle");
                this.hair.animations.play("idle");
                this.moveTime = this.moveDuration - this.CLAW_ANGLE_START_DURATION - .1; //so can start attacking earlier
            }
            
            if (this.dead){
                //final explosion events
                if (this.moveTime >= 1.1 &&
                    this.moveTime-dt < 1.1){
                    FullGame.playSFX("damage_flesh");
                    FullGame.HUD.solveFlash();
                }
                if (this.moveTime >= 1.6 &&
                    this.moveTime-dt < 1.6){
                    FullGame.playSFX("damage_flesh");
                    FullGame.HUD.solveFlash();
                }
                if (this.moveTime >= 1.9 &&
                    this.moveTime-dt < 1.9){
                    FullGame.playSFX("final_explode");
                    FullGame.HUD.beatFinalBoss();
                }
                if (this.moveTime >= 2.5 &&
                    this.moveTime-dt < 2.5){
                    this.deadClear();
                }
            }
        } else if (this.moveState == "deadClear"){
            this.spaceshipUpdate();
        }
        
        //shaking
        if (this.moveState != "move"){
            var dur = this.shakeDuration;
            if (this.dead)
                dur = this.shakeDeadDuration;
            if (this.shakeTime < dur){
                this.shakeTime = Math.min(dur, this.shakeTime+dt);
                var ampl = this.shakeAmplitude * Math.easeOutQuad(this.shakeTime, 1, -1, dur);
                this.rotation = ampl * Math.sin(this.shakeTime / this.DAMAGE_SHAKE_PERIOD *Math.PI*2);
            } else {
                this.rotation = 0;
            }
        }
        
        //update hair position
        this.hair.x = this.x;
        this.hair.y = this.y;
        this.hair.rotation = this.rotation;
        
        this.updateEyeLocations();
        this.updateBlockerLocation();
        this.moveClaws();
        this.setLaserLines();
    };
    
    fb.afterCollision = function() {
        var dt = game.time.physicsElapsed;
        var plr = FullGame.GI.player;
        
        if (this.moveState == "deadClear"){
            this.spaceshipAfterCollision();
        }
        
        //spawning smoke
        if (this.moveState != "deadClear"){
            this.smokeTime += dt;
            if (this.dead){
                if (this.smokeTime >= this.DEAD_SMOKE_PERIOD/* && this.state == "dead1"*/){
                    var smokes = Math.floor(this.smokeTime / this.DEAD_SMOKE_PERIOD);
                    this.spawnSmoke(smokes, this);
                    this.smokeTime -= this.DEAD_SMOKE_PERIOD * smokes;
                }
            } else {
                if (this.smokeTime >= this.SMOKE_PERIOD){
                    var smokes = Math.floor(this.smokeTime / this.SMOKE_PERIOD);
                    this.spawnSmoke(smokes, this);
                    this.smokeTime -= this.SMOKE_PERIOD * smokes;
                }
            }
            this.claw1.smokeTime += dt;
            if (this.claw1.smokeTime >= this.CLAW_SMOKE_PERIOD){
                var smokes = Math.floor(this.claw1.smokeTime / this.CLAW_SMOKE_PERIOD);
                this.spawnSmoke(smokes, this.claw1);
                this.claw1.smokeTime -= this.CLAW_SMOKE_PERIOD * smokes;
            }
            this.claw2.smokeTime += dt;
            if (this.claw2.smokeTime >= this.CLAW_SMOKE_PERIOD){
                var smokes = Math.floor(this.claw2.smokeTime / this.CLAW_SMOKE_PERIOD);
                this.spawnSmoke(smokes, this.claw2);
                this.claw2.smokeTime -= this.CLAW_SMOKE_PERIOD * smokes;
            }
        }
        
        
    };
    
    //makes stuff invisible during the flash of light
    fb.deadClear = function(){
        this.visible = false;
        this.hair.visible = false;
        this.moveState = "deadClear";
        this.moveTime = 0;
        for (var i=0; i<this.NUM_EYES; i++){
            var eye = this.eyes[i];
            eye.visible = false;
            eye.glow.visible = false;
            eye.morph.visible = false;
            eye.morph.time = 9999;
        }
        this.claw1.visible = false;
        this.claw1.angleState = "deadClear";
        this.claw2.visible = false;
        this.claw2.angleState = "deadClear";
        this.laserLines.splice(this.laserLines.length);
        delete this.laserLines;
        this.baseLaserLines.splice(this.baseLaserLines.length);
        delete this.baseLaserLines;
        
        //prepare spaceship
        this.spaceship = FullGame.makeSpaceship(1330, -370, true);
        this.spaceship.landing = true;
        this.spaceship.endShip = true;
        
        
    };
    
    fb.spaceshipUpdate = function() {
        var dt = game.time.physicsElapsed;
        var plr = FullGame.GI.player;
    };
    fb.spaceshipAfterCollision = function() {
        var dt = game.time.physicsElapsed;
        var plr = FullGame.GI.player;
        
    };
    
    return fb;
    
};