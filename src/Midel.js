//returns made midel, but doesn't add it to FullGame.GI.objs (will be done in ParseObjects)
FullGame.makeMidel = function(cx, cy) {
    
    var m;
    var mBroken;
    var backHand;
    var frontHand;
    var backSword;
    var frontSword;
    var eyes;
    var blood;
    
    var SWORD_ORIGIN_X = 20;
    var SWORD_ORIGIN_Y = 136;
    backHand = game.add.sprite(cx, cy, "midel_hand", undefined, FullGame.GI.frontGroup);
    backHand.animations.add("idle", [0], 30, true);
    backHand.animations.add("glow", [1], 30, true);
    backHand.animations.play("idle");
    backHand.anchor.setTo(.5, .5); //sprite is centered
    backSword = game.add.sprite(cx, cy, "midel_sword", undefined, FullGame.GI.frontGroup);
    backSword.animations.add("idle", [0], 30, true);
    backSword.animations.add("toSwing", [1, 2, 3, 4, 5], 10, false);
    backSword.animations.add("fromSwing", [4, 3, 2, 1, 0], 10, false);
    backSword.animations.play("idle");
    backSword.anchor.setTo(SWORD_ORIGIN_X / 71.0, SWORD_ORIGIN_Y / 158.0); //sprite rotates around hand
    backSword.scale.y = -1;
    backSword.visible = false;
    m = game.add.sprite(cx, cy, "midel_body", undefined, FullGame.GI.frontGroup);
    m.animations.add("idle", [0], 30, true);
    m.animations.add("mouth", [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0], 15, false);
    m.animations.add("damage", [2, 3], 20, true);
    m.animations.play("idle");
    m.anchor.setTo(.5, .5); //sprite is centered
    m.SWORD_ORIGIN_X = SWORD_ORIGIN_X;
    m.SWORD_ORIGIN_Y = SWORD_ORIGIN_Y;
    mBroken = game.add.sprite(cx, cy, "midel_body_broken", undefined, FullGame.GI.frontGroup);
    mBroken.animations.add("idle", [0], 30, true);
    mBroken.animations.add("mouth", [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0], 15, false);
    mBroken.animations.add("damage", [2, 3], 20, true);
    mBroken.animations.play("idle");
    mBroken.anchor.setTo(.5, .5); //sprite is centered
    mBroken.visible = false;
    eyes = game.add.sprite(cx, cy, "midel_eyes", undefined, FullGame.GI.frontGroup);
    eyes.animations.add("idle", [0], 30, true);
    //eyes.animations.add("blink", [1, 2, 3, 4, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0], 90, false);
    eyes.animations.add("blink", [0], 90, false);
    eyes.animations.play("idle");
    blood = game.add.sprite(cx, cy, "midel_blood", undefined, FullGame.GI.frontGroup);
    blood.animations.add("idle", [0], 30, true);
    blood.animations.add("bleed", [0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6], 10, false);
    blood.animations.play("idle");
    blood.visible = false;
    frontHand = game.add.sprite(cx, cy, "midel_hand", undefined, FullGame.GI.frontGroup);
    frontHand.animations.add("idle", [0], 30, true);
    frontHand.animations.add("glow", [1], 30, true);
    frontHand.animations.play("idle");
    frontHand.anchor.setTo(.5, .5); //sprite is centered
    frontSword = game.add.sprite(cx, cy, "midel_sword", undefined, FullGame.GI.frontGroup);
    frontSword.animations.add("idle", [0], 30, true);
    frontSword.animations.add("toSwing", [1, 2, 3, 4, 5], 10, false);
    frontSword.animations.add("fromSwing", [4, 3, 2, 1, 0], 10, false);
    frontSword.animations.play("idle");
    frontSword.anchor.setTo(m.SWORD_ORIGIN_X / 71.0, m.SWORD_ORIGIN_Y / 158.0); //sprite rotates around hand
    frontSword.visible = false;
    
    
    m.mb = mBroken;
    m.eyes = eyes;
    m.blood = blood;
    m.backHand = backHand;
    m.frontHand = frontHand;
    m.backSword = backSword;
    m.frontSword = frontSword;
    m.smokeKey = "alien_smoke_white";
    m.laserColor = FullGame.Til.RED;
    m.isAlien = true;
    m.isMidel = true;
    m.x = cx;
    m.y = cy;
    m.EYES_X = 70 - 64;
    m.EYES_Y = 34 - 128;
    m.BLOOD_X = 50 - 64;
    m.BLOOD_Y = 35 - 128;
    m.SWORD_HAND_ROTATION_OFFSET = -32 *Math.PI/180;
    m.blinkTime = 0;
    m.blinkPeriod = 0;
    m.mouthTime = 0;
    m.mouthPeriod = 0;
    m.vx = 0;
    m.vy = 0;
    m.timeSinceMove = 0;
    m.MAX_SPEED_H5 = 110; //max speed when health>=5
    m.MAX_SPEED_H4 = 130;
    m.MAX_SPEED_H3 = 130;
    m.MAX_SPEED_H2 = 155;
    m.MAX_SPEED_H1 = 170;
    m.ACCEL = 350;
    m.FRICTION = 500;
    m.ROTATE_ZENO = .05;
    m.ROTATE_MAX_DIFF = .006;
    m.ROTATE_MIN = -15 *Math.PI/180;
    m.ROTATE_MAX = 15 *Math.PI/180;
    m.targetX = 0;
    m.targetY = 0;
    m.TARGET_RADIUS = 40; //how close midel can be to the target to be considered at the target
    m.state = "idle";
    m.time = 0.0;
    m.broken = false;
    m.bobOffset = 0; //y offset for slightly bobbing up and down
    m.bobTime = 0;
    m.BOB_PERIOD = 2.5;
    m.BOB_AMPLITUDE = 12;
    m.SMOKE_SPAWN_BOX = {
        x:38 - 64,
        y:159 - 128,
        w:81,
        h:19,
        r:85 *Math.PI/180
    };
    m.SMOKE_SPEED = 20;
    m.SMOKE_ACCEL = 250;
    m.SMOKE_PERIOD = .009;
    m.smokeTime = 0;
    m.smokeCache = []; //recycles smoke particles
    m.FRONT_HAND_X = 93 - 64;
    m.FRONT_HAND_Y = 154 - 128;
    m.BACK_HAND_X = 134 - 64;
    m.BACK_HAND_Y = 114 - 128;
    m.HAND_PERIOD = 3;
    m.HAND_AMPLITUDE = 14;
    m.SWORD_PERIOD = 3.5;
    m.SWORD_AMPLITUDE = 10;
    m.SWORD_ROTATION_AMPLITUDE = -10 *Math.PI/180; //negative so closed first, then open
    m.backHand.bobTime = m.HAND_PERIOD / 4;
    m.backHand.bobOffset = 0;
    m.backHand.smokeTime = 0;
    m.backHand.startAngle = 0;
    m.backHand.startX = 0;
    m.backHand.startY = 0;
    m.backHand.HAIR_X = 56 - 64;
    m.backHand.HAIR_Y = 34 - 128;
    m.backHand.HAIR_ROTATION = 30 *Math.PI/180; //is also flipped vertically
    m.frontHand.bobTime = 0;
    m.frontHand.bobOffset = 0;
    m.frontHand.smokeTime = 0;
    m.frontHand.startAngle = 0;
    m.frontHand.startX = 0;
    m.frontHand.startY = 0;
    m.frontHand.HAIR_X = 53 - 64;
    m.frontHand.HAIR_Y = 23 - 128;
    m.frontHand.HAIR_ROTATION = 175 *Math.PI/180;
    m.backSword.bobTime = m.SWORD_PERIOD / 4;
    m.backSword.bobOffset = 0;
    m.backSword.smokeTime = 0;
    m.backSword.startAngle = 0;
    m.backSword.startX = 0;
    m.backSword.startY = 0;
    m.frontSword.bobTime = 0;
    m.frontSword.bobOffset = 0;
    m.frontSword.smokeTime = 0;
    m.frontSword.startAngle = 0;
    m.frontSword.startX = 0;
    m.frontSword.startY = 0;
    
    //ps1=preSwing1, s1=swing1, ps2=preSwing2, s2=swing2
    m.backSword.IDLE_X = 135 - 64;
    m.backSword.IDLE_Y = 45 - 128;
    m.backSword.IDLE_ROTATION = 25 *Math.PI/180;
    
    m.backSword.S1_X = 130 -64;
    m.backSword.S1_Y = 90 -128;
    m.backSword.S1_ROTATION = 35 *Math.PI/180;
    
    m.backSword.PS2_X = 76 -64;
    m.backSword.PS2_Y = 219 -128;
    m.backSword.PS2_ROTATION = 65 *Math.PI/180;
    
    m.backSword.S2_X = 146 -64;
    m.backSword.S2_Y = 75 -128;
    m.backSword.S2_ROTATION = -125 *Math.PI/180;
    
    m.frontSword.IDLE_X = 80 - 64;
    m.frontSword.IDLE_Y = 240 - 128;
    m.frontSword.IDLE_ROTATION = 30 *Math.PI/180;
    
    m.frontSword.PS1_X = 127 -64;
    m.frontSword.PS1_Y = 47 -128;
    m.frontSword.PS1_ROTATION = -60 *Math.PI/180;
    
    m.frontSword.S1_X = 110 -64;
    m.frontSword.S1_Y = 240 -128;
    m.frontSword.S1_ROTATION = 120 *Math.PI/180;
    
    m.frontSword.S2_X = 104 -64;
    m.frontSword.S2_Y = 185 -128;
    m.frontSword.S2_ROTATION = 0 *Math.PI/180;
    m.SWORD_IDLE_MIN_DURATION = 2.0;
    m.PS1_DURATION = 1.2;
    m.S1_DURATION = .4;
    m.PS2_DURATION = .4;
    m.S2_DURATION = .4;
    
    m.RUSH_DURATION = m.PS1_DURATION + m.S1_DURATION + m.PS2_DURATION + m.S2_DURATION;
    m.RUSH_X_DIST = 100; //target distance from player during a rush
    m.RUSH_Y_DIST = -40; //
    m.RUSH_TRIGGER_X_DIST = 600; //how close have to be to player to start a rush
    m.RUSH_TRIGGER_Y_DIST = 150;
    //during a rush, x accel and velocity is high, y accel and velocity is low
    m.RUSH_X_SPEED_H3 = 250;
    m.RUSH_X_SPEED_H2 = 300;
    m.RUSH_X_SPEED_H1 = 350;
    m.RUSH_X_ACCEL = 1200;
    m.RUSH_Y_SPEED = 100;
    m.RUSH_Y_ACCEL = 400;
    
    
    m.HAND_SMOKE_PERIOD = .1;
    m.HAND_SMOKE_SPAWN_BOX = {
        x:7 - 23,
        y:17 - 17,
        w:8,
        h:5,
        r:Math.PI/2
    };
    m.laserState = "idle"; //"preAim", "aim", "fire", "postFire"
    m.laserTime = 0;
    m.swordState = "none"; //"toIdle", "idle"
    m.swordTime = 0;
    m.IDLE_DURATION = 2.5;
    m.PRE_AIM_DURATION = .3;
    m.AIM_DURATION_H5 = 1.8;
    m.AIM_DURATION_H4 = 1.4;
    m.FIRE_DURATION_H5 = .3;
    m.FIRE_DURATION_H4 = .5;//.9;
    m.POST_FIRE_DURATION = .3;
    m.AIM_SPREAD_INITIAL = 8 *Math.PI/180;
    m.AIM_SPREAD_FINAL = 1 *Math.PI/180;
    m.invincibleTime = 99999;
    m.INVINCIBLE_DURATION = 2.0;
    m.KNOCKBACK_VX = 300;
    m.KNOCKBACK_VY = -150;
    m.HAIR1_DURATION = 1.2;
    m.HAIR2_DURATION = 1.2;
    m.pathPoint = null;
    m.TARGET_DIST_FROM_PLAYER = 150;
    m.HEALTH = 5;
    m.BROKEN_HEALTH = 3; //amount of health to go into broken form
    m.health = m.HEALTH;
    m.dead = false;
    m.DEAD1_DURATION = 2.0;
    m.DEAD_SMOKE_SPAWN_BOX = {
        x:-30,
        y:-40,
        w:60,
        h:80,
        r:0
    };
    m.DEAD_SMOKE_SPEED = 100;
    m.DEAD_SMOKE_ACCEL = 0;
    m.DEAD_SMOKE_PERIOD = .006;
    m.DEAD_ROTATION = -25 *Math.PI/180;
    m.laserTranspSound = game.sound.add("laser_transp_alien", 1, true);
    m.laserNormalSound = game.sound.add("laser_alien", 1, true);
    
    //base laser lines are when alien isn't transformed
    var cFront = FullGame.Til.BLACK;
    var cBack = FullGame.Til.WHITE;
    var cHead = FullGame.Til.RED;
    m.laserLines = [];
    m.baseLaserLines = [
        {x0:111, y0:48, x1:115, y1:61, color:cBack},
        {x0:115, y0:61, x1:116, y1:75, color:cBack},
        {x0:116, y0:75, x1:105, y1:101, color:cFront},
        {x0:105, y0:101, x1:84, y1:99, color:cFront},
        {x0:84, y0:99, x1:73, y1:112, color:cFront},
        {x0:73, y0:112, x1:91, y1:145, color:cFront},
        {x0:91, y0:145, x1:83, y1:160, color:cFront},
        {x0:83, y0:160, x1:69, y1:210, color:cFront},
        {x0:69, y0:210, x1:59, y1:228, color:cBack},
        {x0:59, y0:228, x1:43, y1:243, color:cBack},
        {x0:43, y0:243, x1:29, y1:248, color:cBack},
        {x0:29, y0:248, x1:38, y1:192, color:cBack},
        {x0:38, y0:192, x1:26, y1:151, color:cBack},
        {x0:26, y0:151, x1:32, y1:140, color:cBack}, //reached hair point
        {x0:32, y0:140, x1:24, y1:111, color:cHead},
        {x0:24, y0:111, x1:28, y1:67, color:cHead},
        {x0:28, y0:67, x1:17, y1:98, color:cHead},
        {x0:17, y0:98, x1:12, y1:153, color:cHead},
        {x0:12, y0:153, x1:9, y1:93, color:cHead},
        {x0:9, y0:93, x1:25, y1:34, color:cHead},
        {x0:25, y0:34, x1:62, y1:9, color:cHead}, //reached intact hair point
        {x0:62, y0:9, x1:97, y1:18, color:cHead},
        {x0:97, y0:18, x1:113, y1:37, color:cHead},
        {x0:113, y0:37, x1:120, y1:55, color:cHead},
        {x0:120, y0:55, x1:111, y1:48, color:cHead} //total: 25 lines
    ];
    m.baseBrokenLaserLines = [
        {x0:111, y0:48, x1:115, y1:61, color:cBack},
        {x0:115, y0:61, x1:116, y1:75, color:cBack},
        {x0:116, y0:75, x1:105, y1:101, color:cFront},
        {x0:105, y0:101, x1:84, y1:99, color:cFront},
        {x0:84, y0:99, x1:73, y1:112, color:cFront},
        {x0:73, y0:112, x1:91, y1:145, color:cFront},
        {x0:91, y0:145, x1:83, y1:160, color:cFront},
        {x0:83, y0:160, x1:69, y1:210, color:cFront},
        {x0:69, y0:210, x1:59, y1:228, color:cBack},
        {x0:59, y0:228, x1:43, y1:243, color:cBack},
        {x0:43, y0:243, x1:29, y1:248, color:cBack},
        {x0:29, y0:248, x1:38, y1:192, color:cBack},
        {x0:38, y0:192, x1:26, y1:151, color:cBack},
        {x0:26, y0:151, x1:32, y1:140, color:cBack}, //reached hair point
        {x0:32, y0:140, x1:40, y1:107, color:cBack},
        {x0:40, y0:107, x1:36, y1:103, color:cHead},
        {x0:36, y0:103, x1:34, y1:66, color:cHead},
        {x0:34, y0:66, x1:41, y1:39, color:cHead},
        {x0:41, y0:39, x1:53, y1:28, color:cHead},
        {x0:53, y0:28, x1:52, y1:16, color:cFront}, //secret alternate weak point where wound is
        {x0:52, y0:16, x1:62, y1:9, color:cHead}, //reached intact hair point
        {x0:62, y0:9, x1:97, y1:18, color:cHead},
        {x0:97, y0:18, x1:113, y1:37, color:cHead},
        {x0:113, y0:37, x1:120, y1:55, color:cHead},
        {x0:120, y0:55, x1:111, y1:48, color:cHead} //total: 25 lines (matches not broken laser lines by coincidence)
    ];
    for (var i=0; i<m.baseLaserLines.length; i++){
        m.baseLaserLines[i].x0 -= 64;
        m.baseLaserLines[i].y0 -= 128;
        m.baseLaserLines[i].x1 -= 64;
        m.baseLaserLines[i].y1 -= 128;
        m.laserLines.push(
            {x0:m.baseLaserLines[i].x0,
             y0:m.baseLaserLines[i].y0,
             x1:m.baseLaserLines[i].x1,
             y1:m.baseLaserLines[i].y1,
             color:m.baseLaserLines[i].color}
        );
    }
    for (i=0; i<m.baseBrokenLaserLines.length; i++){
        m.baseBrokenLaserLines[i].x0 -= 64;
        m.baseBrokenLaserLines[i].y0 -= 128;
        m.baseBrokenLaserLines[i].x1 -= 64;
        m.baseBrokenLaserLines[i].y1 -= 128;
    }
    
    m.baseSwordLaserLines = [
        {x0:15, y0:130, x1:35, y1:114, color:cHead},
        {x0:35, y0:114, x1:53, y1:61, color:cHead},
        {x0:53, y0:61, x1:59, y1:6, color:cHead},
        {x0:59, y0:6, x1:63, y1:65, color:cHead},
        {x0:63, y0:65, x1:46, y1:124, color:cHead},
        {x0:46, y0:124, x1:26, y1:138, color:cHead},
        {x0:26, y0:138, x1:15, y1:130, color:cHead}
    ];
    m.backSword.laserLines = [];
    m.frontSword.laserLines = [];
    for (i=0; i<m.baseSwordLaserLines.length; i++){
        m.baseSwordLaserLines[i].x0 -= m.SWORD_ORIGIN_X;
        m.baseSwordLaserLines[i].y0 -= m.SWORD_ORIGIN_Y;
        m.baseSwordLaserLines[i].x1 -= m.SWORD_ORIGIN_X;
        m.baseSwordLaserLines[i].y1 -= m.SWORD_ORIGIN_Y;
        m.backSword.laserLines.push(
            {x0:m.baseSwordLaserLines[i].x0,
             y0:m.baseSwordLaserLines[i].y0,
             x1:m.baseSwordLaserLines[i].x1,
             y1:m.baseSwordLaserLines[i].y1,
             color:m.baseSwordLaserLines[i].color}
        );
        m.frontSword.laserLines.push(
            {x0:m.baseSwordLaserLines[i].x0,
             y0:m.baseSwordLaserLines[i].y0,
             x1:m.baseSwordLaserLines[i].x1,
             y1:m.baseSwordLaserLines[i].y1,
             color:m.baseSwordLaserLines[i].color}
        );
    }
    m.swordHitLines = [ //for hitting player
        {x0:56 -m.SWORD_ORIGIN_X, y0:92 -m.SWORD_ORIGIN_Y, x1:59 -m.SWORD_ORIGIN_X, y1:6 -m.SWORD_ORIGIN_Y},
        {x0:35 -m.SWORD_ORIGIN_X, y0:132 -m.SWORD_ORIGIN_Y, x1:64 -m.SWORD_ORIGIN_X, y1:66 -m.SWORD_ORIGIN_Y},
        {x0:-10 -m.SWORD_ORIGIN_X, y0:147 -m.SWORD_ORIGIN_Y, x1:46 -m.SWORD_ORIGIN_X, y1:125 -m.SWORD_ORIGIN_Y}
    ];
    
    m.setLaserLines = function(broken) {
        if (this.dead) return;
        var c = Math.cos(this.rotation);
        var s = Math.sin(this.rotation);
        var lines = this.baseLaserLines;
        if (broken != undefined && broken == true)
            lines = this.baseBrokenLaserLines;
        for (var i=0; i<lines.length; i++){
            var bll = lines[i];
            var x0 = bll.x0 * this.scale.x;
            var y0 = bll.y0 * this.scale.y;
            var x1 = bll.x1 * this.scale.x;
            var y1 = bll.y1 * this.scale.y;
            this.laserLines[i].x0 = x0*c - y0*s;
            this.laserLines[i].y0= x0*s + y0*c;
            this.laserLines[i].x1 = x1*c - y1*s;
            this.laserLines[i].y1 = x1*s + y1*c;
            this.laserLines[i].color = bll.color;
        }
        
        //set laserLines for swords
        if (broken){
            var sword;
            for (var j=0; j<2; j++){
                if (j == 0) sword = this.backSword;
                else sword = this.frontSword;
                c = Math.cos(sword.rotation);
                s = Math.sin(sword.rotation);
                lines = this.baseSwordLaserLines;
                for (i=0; i<lines.length; i++){
                    var bll = lines[i];
                    var x0 = bll.x0 * sword.scale.x;
                    var y0 = bll.y0 * sword.scale.y;
                    var x1 = bll.x1 * sword.scale.x;
                    var y1 = bll.y1 * sword.scale.y;
                    sword.laserLines[i].x0 = x0*c - y0*s;
                    sword.laserLines[i].y0= x0*s + y0*c;
                    sword.laserLines[i].x1 = x1*c - y1*s;
                    sword.laserLines[i].y1 = x1*s + y1*c;
                }
            }
        }
        
    };
    m.setLaserLines();
    
    m.positionEyes = function() {
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
    m.positionBlood = function() {
        var c = Math.cos(this.rotation);
        var s = Math.sin(this.rotation);
        var x0 = this.BLOOD_X * this.scale.x;
        var y0 = this.BLOOD_Y * this.scale.y;
        this.blood.x = x0*c - y0*s;
        this.blood.y = x0*s + y0*c;
        this.blood.x += this.x;
        this.blood.y += this.y;
        this.blood.scale.x = this.scale.x;
        this.blood.scale.y = this.scale.y;
        this.blood.rotation = this.rotation;
    };
    
    m.spawnSmoke = function(numSmokes, source) {
        var spawnBox;
        if (source == this){
            if (this.dead){
                spawnBox = this.DEAD_SMOKE_SPAWN_BOX;
            } else {
                spawnBox = this.SMOKE_SPAWN_BOX;
            }
        } else if (source == this.backHand || source == this.frontHand ||
                   source == this.backSword || source == this.frontSword){
            spawnBox = this.HAND_SMOKE_SPAWN_BOX;
        }
        var sRotation = source.rotation;
        if (source == this.backSword){
            if (this.scale.x < 0) sRotation += this.SWORD_HAND_ROTATION_OFFSET;
            else sRotation -= this.SWORD_HAND_ROTATION_OFFSET;
        } else if (source == this.frontSword){
            if (this.scale.x < 0) sRotation -= this.SWORD_HAND_ROTATION_OFFSET;
            else sRotation += this.SWORD_HAND_ROTATION_OFFSET;
        }
        
        var c = Math.cos(spawnBox.r);
        var s = Math.sin(spawnBox.r);
        var c2 = Math.cos(sRotation);
        var s2 = Math.sin(sRotation);
        var heading;
        if (this.scale.x > 0){
            heading = spawnBox.r + sRotation + Math.PI/2;
        } else {
            heading = -spawnBox.r + sRotation + Math.PI/2;
        }
        var ch = Math.cos(heading);
        var sh = Math.sin(heading);
        for (var i=0; i<numSmokes; i++){
            
            var x0 = Math.random() * spawnBox.w;
            var y0 = Math.random() * spawnBox.h;
            var x = x0*c - y0*s;
            var y = x0*s + y0*c;
            if (this.dead){
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
            if (this.smokeCache.length == 0){
                sm = game.add.sprite(x, y, this.smokeKey, undefined, FullGame.GI.frontGroup);
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
                FullGame.GI.frontGroup.setChildIndex(sm, 0);
            }
            if (this.dead){
                sm.bringToTop();
            }
            sm.t = 0;
            sm.duration = 8 / 15.0;
            sm.anchor.setTo(.5, .5);
            if (this.dead){
                sm.vx = this.DEAD_SMOKE_SPEED * ch + this.vx;
                sm.vy = this.DEAD_SMOKE_SPEED * sh + this.vy;
                sm.ax = this.DEAD_SMOKE_ACCEL * ch;
                sm.ay = this.DEAD_SMOKE_ACCEL * sh;
            } else {
                sm.vx = this.SMOKE_SPEED * ch + this.vx;
                sm.vy = this.SMOKE_SPEED * sh + this.vy;
                sm.ax = this.SMOKE_ACCEL * ch;
                sm.ay = this.SMOKE_ACCEL * sh;
            }
            
        }
    };
    
    m.moveTo = function(x, y) {
        this.targetX = x;
        this.targetY = y;
        //don't move if already there
        if ((x-this.x)*(x-this.x) + (y-this.y)*(y-this.y) <
            this.TARGET_RADIUS * this.TARGET_RADIUS)
            return;
        this.state = "move";
        this.timeSinceMove = 0;
    };
    
    m.damage = function() {
        if (this.invincibleTime < this.INVINCIBLE_DURATION) //don't damage if invincible
            return;
        if (this.dead) return;
        
        this.health -= 1;
        
        if (this.health <= 0){
            //die
            this.state = "dead1";
            this.animations.play("damage");
            this.smokeTime = 0;
            FullGame.playSFX("damage_flesh");
            FullGame.playSFX("midel_death");
            FullGame.fadeOutMusic(1.0);
            this.vx = 0;
            this.vy = 0;
            delete this.laserLines;
            delete this.backSword.laserLines;
            delete this.frontSword.laserLines;
            this.laserState = "idle";
            this.laserTime = 0; //use this to keep track of time
            this.swordState = "idle";
            this.backSword.animations.play("idle");
            this.frontSword.animations.play("idle");
            this.dead = true;
            
        } else {
            //deal damage
            if (this.scale.x < 0){
                this.vx = this.KNOCKBACK_VX;
            } else {
                this.vx = -this.KNOCKBACK_VX;
            }
            this.vy = this.KNOCKBACK_VY;
            this.invincibleTime = 0;
            if (this.broken){
                this.mb.animations.play("damage");
            } else {
                this.animations.play("damage");
            }
            FullGame.playSFX("damage_flesh");
            FullGame.playSFX("midel_damage");
            this.mouthTime = 0;
            
            if (!this.broken && this.health <= this.BROKEN_HEALTH){
                //go into the hair state
                
                this.backHand.startX = this.backHand.bobOffset + this.BACK_HAND_X;
                this.backHand.startY = this.BACK_HAND_Y;
                this.backHand.startAngle = 0;
                this.frontHand.startX = this.frontHand.bobOffset + this.FRONT_HAND_X;
                this.frontHand.startY = this.FRONT_HAND_Y;
                this.frontHand.startAngle = 0;
                
                this.state = "hair1";
                this.time = 0;
                this.laserState = "idle";
                this.laserTime = -99999;
                
            } else {
                
                //immediately go for counterattack
                if (!this.broken){
                    if (this.laserState != "aim"){
                        this.laserTime = 0;
                    }
                    this.laserState = "aim";
                    this.frontHand.animations.play("glow");
                    this.backHand.animations.play("glow");
                }
            }
        }
    };
    
    m.update = function() {
        
        var dt = game.time.physicsElapsed;
        
        //undo bob offset for calculations
        this.y -= this.bobOffset;
        
        if (this.state == "idle"){
            //idle state
            //apply friction
            var s0 = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
            if (s0 > 0){
                var a = Math.atan2(this.vy, this.vx);
                var s1 = Math.max(0, s0 - this.FRICTION * dt);
                this.vx = Math.cos(a) * s1;
                this.vy = Math.sin(a) * s1;
            }
            
            if (this.pathPoint == null){
                //not on alien path.  Find entry point to path and go there
                this.pathPoint = FullGame.AlienPath.closestPoint(this.x, this.y);
                if (this.pathPoint != null){
                    this.moveTo(this.pathPoint.x, this.pathPoint.y);
                    if (this.state != "move"){
                        //won't go to move state if point is really close
                        this.state = "move";
                    }
                }
            }
            
        } else if (this.state == "move"){
            //move state; moving to target point
            this.timeSinceMove += dt;
            var a = Math.atan2(this.targetY - this.y, this.targetX - this.x);
            this.vx += Math.cos(a) * this.ACCEL * dt;
            this.vy += Math.sin(a) * this.ACCEL * dt;
            var s2 = this.vx*this.vx + this.vy*this.vy;
            var maxSpeed = this.MAX_SPEED_H5;
            switch (this.health){
            default:
            case 5: maxSpeed = this.MAX_SPEED_H5; break;
            case 4: maxSpeed = this.MAX_SPEED_H4; break;
            case 3: maxSpeed = this.MAX_SPEED_H3; break;
            case 2: maxSpeed = this.MAX_SPEED_H2; break;
            case 1: maxSpeed = this.MAX_SPEED_H1; break;
            }
            if (s2 > maxSpeed*maxSpeed){
                var mult = Math.sqrt(maxSpeed*maxSpeed / s2);
                this.vx *= mult;
                this.vy *= mult;
            }
            //detect when at the target
            if ((this.targetX-this.x)*(this.targetX-this.x) + (this.targetY-this.y)*(this.targetY-this.y) <
                this.TARGET_RADIUS*this.TARGET_RADIUS ||
               this.timeSinceMove > 5.0){
                
                var findNextPoint = true;
                if (this.pathPoint == null)
                    findNextPoint = false;
                
                if (findNextPoint){
                    if (this.pathPoint != null &&
                        this.targetX == this.pathPoint.x && this.targetY == this.pathPoint.y){
                        //go to an adjacent point
                        if (this.pathPoint.adj.length == 0){
                            this.state = "idle";
                        } else {
                            
                            var plr = FullGame.GI.player;
                            if (plr == null){
                                var index = Math.floor(Math.random() * this.pathPoint.adj.length);
                                this.pathPoint = this.pathPoint.adj[index];
                            } else {
                                //trying to get a certain distance away from the player
                                var pt = this.pathPoint.adj[0];
                                var diff = Math.abs(Math.sqrt((pt.x-plr.x)*(pt.x-plr.x) + (pt.y-plr.y)*(pt.y-plr.y)) - this.TARGET_DIST_FROM_PLAYER);
                                for (var i=1; i<this.pathPoint.adj.length; i++){
                                    var ptTest = this.pathPoint.adj[i];
                                    var diffTest = Math.abs(
                                        Math.sqrt((ptTest.x-plr.x)*(ptTest.x-plr.x) + (ptTest.y-plr.y)*(ptTest.y-plr.y))
                                        - this.TARGET_DIST_FROM_PLAYER);
                                    if (diffTest < diff){
                                        pt = ptTest;
                                        diff = diffTest;
                                    }
                                }
                                this.pathPoint = pt;
                            }

                            this.moveTo(this.pathPoint.x, this.pathPoint.y);
                        }
                    } else {
                        //go to closest point
                        this.pathPoint = FullGame.AlienPath.closestPoint(this.x, this.y);
                        if (this.pathPoint == null){
                            this.state = "idle";
                        } else {
                            this.moveTo(this.pathPoint.x, this.pathPoint.y);
                        }
                    }
                } else {
                    this.state = "idle";
                }
            }
            
            //detect swinging sword
            var plr = FullGame.GI.player;
            if (this.broken && plr != null && this.swordState == "idle"){
                var swordIdleMinDuration = this.SWORD_IDLE_MIN_DURATION;
                if (Math.abs(plr.x - this.x) < this.RUSH_TRIGGER_X_DIST &&
                    Math.abs(plr.y - this.y + this.RUSH_Y_DIST) < this.RUSH_TRIGGER_Y_DIST &&
                    this.swordTime >= swordIdleMinDuration){
                    //start swinging sword
                    this.backSword.startX = this.backSword.IDLE_X + this.backSword.bobOffset;
                    this.backSword.startY = this.backSword.IDLE_Y;
                    this.backSword.startAngle = this.backSword.IDLE_ROTATION;
                    this.frontSword.startX = this.frontSword.IDLE_X + this.backSword.bobOffset;
                    this.frontSword.startY = this.frontSword.IDLE_Y;
                    this.frontSword.startAngle = this.frontSword.IDLE_ROTATION;
                    this.frontSword.animations.play("toSwing");
                    this.swordState = "preSwing1";
                    this.time = 0;
                    this.swordTime = 0;
                    
                    //start rush
                    this.state = "rush";
                }
            }
            
        } else if (this.state == "hair1" || this.state == "hair2"){ //reaching to head to get swords
            
            this.time += dt;
            
            if (this.state == "hair1"){
                if (this.time >= this.HAIR1_DURATION){
                    //transform into broken form
                    this.backSword.visible = true;
                    this.backSword.startX = this.backHand.HAIR_X;
                    this.backSword.startY = this.backHand.HAIR_Y;
                    this.backSword.startAngle = this.backHand.HAIR_ROTATION;
                    this.frontSword.visible = true;
                    this.frontSword.startX = this.frontHand.HAIR_X;
                    this.frontSword.startY = this.frontHand.HAIR_Y;
                    this.frontSword.startAngle = this.frontHand.HAIR_ROTATION;
                    this.backHand.visible = false;
                    this.frontHand.visible = false;
                    FullGame.GI.objs.push(this.backSword);
                    FullGame.GI.objs.push(this.frontSword);
                    this.mb.visible = true;
                    this.blood.visible = true;
                    this.blood.animations.play("bleed");
                    this.visible = false;
                    this.broken = true;
                    FullGame.playSFX("hair_snap");
                    
                    //go to hair2 state
                    this.state = "hair2";
                    this.time = 0;
                    this.swordState = "toIdle";
                    this.swordTime = 0;
                }
            } else { //this.state == "hair2"
                if (this.time >= this.HAIR2_DURATION){
                    //go to move state
                    this.state = "move";
                    this.time = 0;
                }
            }
            
            //apply friction
            var s0 = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
            if (s0 > 0){
                var a = Math.atan2(this.vy, this.vx);
                var s1 = Math.max(0, s0 - this.FRICTION * dt);
                this.vx = Math.cos(a) * s1;
                this.vy = Math.sin(a) * s1;
            }
            
        } else if (this.state == "rush"){
            
            var plr = FullGame.GI.player;
            if (this.scale.x > 0){
                this.targetX = plr.x - this.RUSH_X_DIST;
            } else {
                this.targetX = plr.x + this.RUSH_X_DIST;
            }
            this.targetY = plr.y + this.RUSH_Y_DIST;
            
            var rushXSpeed = this.RUSH_X_SPEED_H3;
            switch (this.health){
            case 3: rushXSpeed = this.RUSH_X_SPEED_H3; break;
            case 2: rushXSpeed = this.RUSH_X_SPEED_H2; break;
            case 1: rushXSpeed = this.RUSH_X_SPEED_H1; break;
            }
            
            if (this.x < this.targetX){
                if (this.vx < 0){ //apply friction
                    this.vx = Math.min(0, this.vx + this.FRICTION*dt);
                }
                this.vx += this.RUSH_X_ACCEL * dt;
                this.vx = Math.min((this.targetX - this.x)/dt, this.vx);
            } else {
                if (this.vx > 0){ //apply friction
                    this.vx = Math.max(0, this.vx - this.FRICTION*dt);
                }
                this.vx -= this.RUSH_X_ACCEL * dt;
                this.vx = Math.max((this.targetX - this.x)/dt, this.vx);
            }
            this.vx = Math.max(-rushXSpeed, Math.min(rushXSpeed, this.vx));
            
            if (this.y < this.targetY){
                if (this.vy < 0){ //apply friction
                    this.vy = Math.min(0, this.vy + this.FRICTION*dt);
                }
                this.vy += this.RUSH_Y_ACCEL * dt;
            } else {
                if (this.vy > 0){ //apply friction
                    this.vy = Math.max(0, this.vy - this.FRICTION*dt);
                }
                this.vy -= this.RUSH_Y_ACCEL * dt;
            }
            this.vy = Math.max(-this.RUSH_Y_SPEED, Math.min(this.RUSH_Y_SPEED, this.vy));
            
            //detecting rush end
            this.time += dt;
            if (this.time >= this.RUSH_DURATION){
                //go to closest point
                this.pathPoint = FullGame.AlienPath.closestPoint(this.x, this.y);
                if (this.pathPoint == null){
                    this.state = "idle";
                } else {
                    this.moveTo(this.pathPoint.x, this.pathPoint.y);
                }
            }
            
        } else if (this.state == "dead1"){
            //apply friction
            var s0 = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
            if (s0 > 0){
                var a = Math.atan2(this.vy, this.vx);
                var s1 = Math.max(0, s0 - this.FRICTION * dt);
                this.vx = Math.cos(a) * s1;
                this.vy = Math.sin(a) * s1;
            }
            
            var r = Math.max(0, Math.min(1, 6*(1 - this.laserTime/this.DEAD1_DURATION)));
            this.alpha = r;
            this.eyes.alpha = r;
            this.frontHand.alpha = r;
            this.backHand.alpha = r;
            this.mb.alpha = r;
            this.frontSword.alpha = r;
            this.backSword.alpha = r;
            this.blood.alpha = r;
            
            if (this.laserTime >= this.DEAD1_DURATION){
                this.visible = false;
                this.frontHand.visible = false;
                this.backHand.visible = false;
                this.eyes.visible = false;
                this.state = "dead2";
                
                //open black doors
                for (var i=0; i<FullGame.GI.objs.length; i++){
                    var door = FullGame.GI.objs[i];
                    if (door.type == undefined || door.type != "door") continue;
                    if (door.color != FullGame.Til.BLACK) continue;
                    if (door.opening) continue;
                    door.open();
                }
            }
        }
        
        //invincibility from being damaged
        if (this.invincibleTime < this.INVINCIBLE_DURATION){
            this.invincibleTime += dt;
            if (this.invincibleTime >= this.INVINCIBLE_DURATION && !this.dead){
                if (this.broken){
                    this.mb.animations.play("idle")
                } else {
                    this.animations.play("idle");
                }
            }
        }
        
        //adjust to look at player
        var plr = FullGame.GI.player;
        if (plr != null){
            var dist = Math.sqrt((this.x-plr.x)*(this.x-plr.x) + (this.y-plr.y)*(this.y-plr.y));
            if (this.canFlipAround()){
                if (this.scale.x > 0){
                    if (this.x > plr.x+10){
                        this.scale.x *= -1;
                        this.rotation *= -1;
                    }
                } else {
                    if (this.x < plr.x-10){
                        this.scale.x *= -1;
                        this.rotation *= -1;
                    }
                }
            }
            
            var targetR;
            if (this.dead){
                targetR = this.DEAD_ROTATION;
            } else {
                targetR = Math.asin((plr.y - this.y) / dist);
                targetR = Math.max(this.ROTATE_MIN, Math.min(this.ROTATE_MAX, targetR));
            }
            if (this.scale.x < 0) targetR *= -1;
            var diff = (targetR - this.rotation) * this.ROTATE_ZENO;
            diff = Math.max(-this.ROTATE_MAX_DIFF, Math.min(this.ROTATE_MAX_DIFF, diff));
            this.rotation += diff;
            
        }
        
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        //bobbing up and down
        if (!this.dead){
            this.bobTime += dt;
        }
        this.bobOffset = Math.sin(2*Math.PI* this.bobTime / this.BOB_PERIOD) * this.BOB_AMPLITUDE/2;
        this.y += this.bobOffset;
        
        //position hands
        var hand = this.frontHand;
        var isFrontHand = true;
        while (hand != null){
            
            var x0, y0, r0;
            
            if (this.state == "hair1"){
                x0 = Math.easeInOutQuad(this.time, hand.startX, hand.HAIR_X-hand.startX, this.HAIR1_DURATION);
                y0 = Math.easeInOutQuad(this.time, hand.startY, hand.HAIR_Y-hand.startY, this.HAIR1_DURATION);
                r0 = Math.easeInOutQuad(this.time, hand.startAngle, hand.HAIR_ROTATION-hand.startAngle, this.HAIR1_DURATION);
                
            } else if (this.state == "hair2"){
                
            } else {
                hand.bobTime += dt;
                hand.bobOffset = Math.sin(Math.PI*2* hand.bobTime / this.HAND_PERIOD) * this.HAND_AMPLITUDE/2;
                
                if (isFrontHand){
                    x0 = this.FRONT_HAND_X;
                    y0 = this.FRONT_HAND_Y;
                } else {
                    x0 = this.BACK_HAND_X;
                    y0 = this.BACK_HAND_Y;
                }
                x0 += hand.bobOffset;
                r0 = 0;
            }
            
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
                hand.rotation = r0 + this.rotation;
            }
            
            //spawn smoke
            if (hand.visible){
                hand.smokeTime += dt;
                if (hand.smokeTime >= this.HAND_SMOKE_PERIOD && !this.dead){
                    var smokes = Math.floor(hand.smokeTime / this.HAND_SMOKE_PERIOD);
                    this.spawnSmoke(smokes, hand);
                    hand.smokeTime -= smokes*this.HAND_SMOKE_PERIOD;
                }
            }
            
            
            if (hand == this.backHand) break;
            hand = this.backHand;
            isFrontHand = false;
        }
        
        //position swords
        if (!this.dead){
            this.swordTime += dt;
        }
        if (this.swordState == "preSwing1"){
            if (this.swordTime >= this.PS1_DURATION){
                this.swordState = "swing1";
                FullGame.playSFX("midel_swing");
            }
        } else if (this.swordState == "swing1"){
            if (this.swordTime >= this.PS1_DURATION+this.S1_DURATION){
                //only have 1 swing if on easy phase or player isn't nearby
                if (this.health >= this.BROKEN_HEALTH || plr.dead() ||
                    (Math.abs(plr.x - this.x) > this.RUSH_TRIGGER_X_DIST ||
                    Math.abs(plr.y - this.y + this.RUSH_Y_DIST) > this.RUSH_TRIGGER_Y_DIST*1.5)){
                    //immediately go to idle
                    this.swordTime = 0;
                    this.backSword.startX = this.backSword.S1_X;
                    this.backSword.startY = this.backSword.S1_Y;
                    this.backSword.startAngle = this.backSword.S1_ROTATION;
                    this.frontSword.startX = this.frontSword.S1_X;
                    this.frontSword.startY = this.frontSword.S1_Y;
                    this.frontSword.startAngle = this.frontSword.S1_ROTATION;
                    this.swordState = "toIdle";
                    //end rush
                    if (this.state == "rush"){
                        this.time = 9999;
                    }
                } else {
                    this.swordTime = 0;
                    this.swordState = "preSwing2";
                    this.backSword.animations.play("toSwing");
                }
                this.frontSword.animations.play("fromSwing");
            }
        } else if (this.swordState == "preSwing2"){
            if (this.swordTime >= this.PS2_DURATION){
                this.swordState = "swing2";
                FullGame.playSFX("midel_swing");
            }
        } else if (this.swordState == "swing2"){
            if (this.swordTime >= this.PS2_DURATION+this.S2_DURATION){
                this.swordTime = 0;
                this.backSword.startX = this.backSword.S2_X;
                this.backSword.startY = this.backSword.S2_Y;
                this.backSword.startAngle = this.backSword.S2_ROTATION;
                this.frontSword.startX = this.frontSword.S2_X;
                this.frontSword.startY = this.frontSword.S2_Y;
                this.frontSword.startAngle = this.frontSword.S2_ROTATION;
                this.backSword.animations.play("fromSwing");
                this.swordState = "toIdle";
            }
        }
        
        var sword = this.frontSword;
        var isFrontSword = true;
        while (sword != null){
            
            var x0, y0, r0;
            
            if (this.swordState == "toIdle"){
                
                sword.bobTime = 0;
                if (!isFrontSword) sword.bobTime = Math.PI / 4;
                
                var endX = sword.IDLE_X + Math.sin(Math.PI*2* sword.bobTime / this.HAND_PERIOD) * this.SWORD_AMPLITUDE/2;
                var endY = sword.IDLE_Y;
                if (!isFrontSword){
                    endY += Math.sin(Math.PI*2* sword.bobTime / 3.5) * 10/2;
                }
                var endRot = sword.IDLE_ROTATION + Math.sin(Math.PI*2* sword.bobTime / this.SWORD_PERIOD) * this.SWORD_ROTATION_AMPLITUDE/2;
                
                x0 = Math.easeInOutQuad(this.swordTime, sword.startX, endX-sword.startX, this.HAIR2_DURATION);
                y0 = Math.easeInOutQuad(this.swordTime, sword.startY, endY-sword.startY, this.HAIR2_DURATION);
                r0 = Math.easeInOutQuad(this.swordTime, sword.startAngle, endRot-sword.startAngle, this.HAIR2_DURATION);
                
                if (this.swordTime >= this.HAIR2_DURATION){
                    this.swordState = "idle";
                    this.swordTime = 0;
                    this.frontSword.bobTime = 0;
                    this.backSword.bobTime = this.SWORD_PERIOD / 4;
                }
                
            } else if (this.swordState == "idle"){
                
                sword.bobTime += dt;
                sword.bobOffset = Math.sin(Math.PI*2* sword.bobTime / this.HAND_PERIOD) * this.SWORD_AMPLITUDE/2;
                if (sword == this.backSword){
                    sword.yBobOffset = Math.sin(Math.PI*2* sword.bobTime / 3.5) * 10/2;
                } else {
                    sword.yBobOffset = 0;
                }
                
                var rotOffset = Math.sin(Math.PI*2* sword.bobTime / this.SWORD_PERIOD) * this.SWORD_ROTATION_AMPLITUDE/2;
                
                x0 = sword.IDLE_X + sword.bobOffset;
                y0 = sword.IDLE_Y + sword.yBobOffset;
                r0 = sword.IDLE_ROTATION + rotOffset;
                
            } else if (this.swordState == "preSwing1"){
                
                if (isFrontSword){
                    x0 = Math.easeInOutQuad(this.swordTime, sword.IDLE_X, sword.PS1_X-sword.IDLE_X, this.PS1_DURATION);
                    y0 = Math.easeInOutQuad(this.swordTime, sword.IDLE_Y, sword.PS1_Y-sword.IDLE_Y, this.PS1_DURATION);
                    r0 = Math.easeInOutQuad(this.swordTime, sword.IDLE_ROTATION, sword.PS1_ROTATION-sword.IDLE_ROTATION, this.PS1_DURATION);
                } else {
                    x0 = Math.easeOutQuad(this.swordTime, sword.IDLE_X, sword.S1_X-sword.IDLE_X, this.PS1_DURATION+this.S1_DURATION);
                    y0 = Math.easeOutQuad(this.swordTime, sword.IDLE_Y, sword.S1_Y-sword.IDLE_Y, this.PS1_DURATION+this.S1_DURATION);
                    //r0 = Math.easeOutQuad(this.swordTime, sword.IDLE_ROTATION, sword.S1_ROTATION-sword.IDLE_ROTATION, this.PS1_DURATION+this.S1_DURATION);
                    r0 = Math.easeOutQuad(this.swordTime, sword.IDLE_ROTATION, sword.S1_ROTATION-sword.IDLE_ROTATION, this.PS1_DURATION);
                }
                
            } else if (this.swordState == "swing1"){
                
                if (isFrontSword){
                    x0 = Math.easeInOutQuad(this.swordTime-this.PS1_DURATION, sword.PS1_X, sword.S1_X-sword.PS1_X, this.S1_DURATION);
                    y0 = Math.easeInOutQuad(this.swordTime-this.PS1_DURATION, sword.PS1_Y, sword.S1_Y-sword.PS1_Y, this.S1_DURATION);
                    r0 = Math.easeInOutQuad(this.swordTime-this.PS1_DURATION, sword.PS1_ROTATION, sword.S1_ROTATION-sword.PS1_ROTATION, this.S1_DURATION);
                } else {
                    x0 = Math.easeOutQuad(this.swordTime, sword.IDLE_X, sword.S1_X-sword.IDLE_X, this.PS1_DURATION+this.S1_DURATION);
                    y0 = Math.easeOutQuad(this.swordTime, sword.IDLE_Y, sword.S1_Y-sword.IDLE_Y, this.PS1_DURATION+this.S1_DURATION);
                    //r0 = Math.easeOutQuad(this.swordTime, sword.IDLE_ROTATION, sword.S1_ROTATION-sword.IDLE_ROTATION, this.PS1_DURATION+this.S1_DURATION);
                    r0 = sword.S1_ROTATION;
                }
                
            } else if (this.swordState == "preSwing2"){
                
                if (isFrontSword){
                    x0 = Math.easeOutQuad(this.swordTime, sword.S1_X, sword.S2_X-sword.S1_X, this.PS2_DURATION+this.S2_DURATION);
                    y0 = Math.easeOutQuad(this.swordTime, sword.S1_Y, sword.S2_Y-sword.S1_Y, this.PS2_DURATION+this.S2_DURATION);
                    //r0 = Math.easeOutQuad(this.swordTime, sword.S1_ROTATION, sword.S2_ROTATION-sword.S1_ROTATION, this.PS2_DURATION+this.S2_DURATION);
                    r0 = Math.easeOutQuad(this.swordTime, sword.S1_ROTATION, sword.S2_ROTATION-sword.S1_ROTATION, this.PS2_DURATION);
                } else {
                    x0 = Math.easeInOutQuad(this.swordTime, sword.S1_X, sword.PS2_X-sword.S1_X, this.PS2_DURATION);
                    y0 = Math.easeInOutQuad(this.swordTime, sword.S1_Y, sword.PS2_Y-sword.S1_Y, this.PS2_DURATION);
                    r0 = Math.easeInOutQuad(this.swordTime, sword.S1_ROTATION, sword.PS2_ROTATION-sword.S1_ROTATION, this.PS2_DURATION);
                }
            } else if (this.swordState == "swing2"){
                
                if (isFrontSword){
                    x0 = Math.easeOutQuad(this.swordTime, sword.S1_X, sword.S2_X-sword.S1_X, this.PS2_DURATION+this.S2_DURATION);
                    y0 = Math.easeOutQuad(this.swordTime, sword.S1_Y, sword.S2_Y-sword.S1_Y, this.PS2_DURATION+this.S2_DURATION);
                    //r0 = Math.easeOutQuad(this.swordTime, sword.S1_ROTATION, sword.S2_ROTATION-sword.S1_ROTATION, this.PS2_DURATION+this.S2_DURATION);
                    r0 = sword.S2_ROTATION;
                } else {
                    x0 = Math.easeInOutQuad(this.swordTime-this.PS2_DURATION, sword.PS2_X, sword.S2_X-sword.PS2_X, this.S2_DURATION);
                    y0 = Math.easeInOutQuad(this.swordTime-this.PS2_DURATION, sword.PS2_Y, sword.S2_Y-sword.PS2_Y, this.S2_DURATION);
                    r0 = Math.easeInOutQuad(this.swordTime-this.PS2_DURATION, sword.PS2_ROTATION, sword.S2_ROTATION-sword.PS2_ROTATION, this.S2_DURATION);
                }
            }
            
            x0 *= this.scale.x;
            y0 *= this.scale.y;
            var x = x0*Math.cos(this.rotation) - y0*Math.sin(this.rotation);
            var y = x0*Math.sin(this.rotation) + y0*Math.cos(this.rotation);
            x += this.x;
            y += this.y;
            
            sword.x = x;
            sword.y = y;
            sword.scale.x = this.scale.x;
            if (sword == this.backSword){
                sword.scale.y = this.scale.y * -1;
            } else {
                sword.scale.y = this.scale.y;
            }
            if (this.scale.x < 0){
                sword.rotation = -r0 + this.rotation;
            } else {
                sword.rotation = r0 + this.rotation;
            }
            
            //spawn smoke
            if (sword.visible){
                sword.smokeTime += dt;
                if (sword.smokeTime >= this.HAND_SMOKE_PERIOD && !this.dead){
                    var smokes = Math.floor(sword.smokeTime / this.HAND_SMOKE_PERIOD);
                    this.spawnSmoke(smokes, sword);
                    sword.smokeTime -= smokes*this.HAND_SMOKE_PERIOD;
                }
            }
            
            if (sword == this.frontSword){
                sword = this.backSword;
                isFrontSword = false;
            } else sword = null;
        }
        
        this.mb.x = this.x;
        this.mb.y = this.y;
        this.mb.scale.x = this.scale.x;
        this.mb.scale.y = this.scale.y;
        this.mb.rotation = this.rotation;
        
        this.positionEyes();
        this.positionBlood();
        this.setLaserLines(this.broken);
        
    };
    
    m.afterCollision = function() {
        
        var dt = game.time.physicsElapsed;
        var plr = FullGame.GI.player;
        
        //spawning smoke
        this.smokeTime += dt;
        if (this.dead){
            if (this.smokeTime >= this.DEAD_SMOKE_PERIOD && this.state == "dead1"){
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
        //blinking
        this.blinkTime += dt;
        if (this.blinkTime >= this.blinkPeriod){
            this.eyes.animations.play("blink");
            this.blinkTime = 0;
            this.blinkPeriod = 2 + Math.random()*1;
        }
        //moving mouth
        if (this.invincibleTime >= this.INVINCIBLE_DURATION && !this.dead){
            this.mouthTime += dt;
            if (this.mouthTime >= this.mouthPeriod){
                if (this.broken){
                    this.mb.animations.play("mouth");
                } else {
                    this.animations.play("mouth");
                }
                this.mouthTime = 0;
                this.mouthPeriod = 3 + Math.random()*1.5;
            }
        }
        
        //hitting player with sword
        if (!this.dead && plr != null &&
            (this.swordState == "swing1" || this.swordState == "swing2")){
            
            var sword;
            if (this.swordState == "swing1")
                sword = this.frontSword;
            else
                sword = this.backSword;
            
            c = Math.cos(sword.rotation);
            s = Math.sin(sword.rotation);
            lines = this.swordHitLines;
            for (i=0; i<lines.length; i++){
                var bll = lines[i];
                var tx0 = bll.x0 * sword.scale.x;
                var ty0 = bll.y0 * sword.scale.y;
                var tx1 = bll.x1 * sword.scale.x;
                var ty1 = bll.y1 * sword.scale.y;
                var x0 = tx0*c - ty0*s;
                var y0 = tx0*s + ty0*c;
                var x1 = tx1*c - ty1*s;
                var y1 = tx1*s + ty1*c;
                x0 += sword.x;
                y0 += sword.y;
                x1 += sword.x;
                y1 += sword.y;
                
                var pt = FullGame.Lasers.laserHitCirclePoint(
                    x0, y0, x1, y1, plr.x, plr.y, plr.RADIUS, false);
                if (pt != null){
                    plr.damage(this.scale.x > 0, false);
                }
            }
            
        }
        
        //firing lasers
        this.laserTime += dt;
        var frontHandAngle = 0;
        var backHandAngle = 0;
        if (plr != null){
            frontHandAngle = Math.atan2(plr.y - this.frontHand.y, plr.x - this.frontHand.x);
            backHandAngle = Math.atan2(plr.y - this.backHand.y, plr.x - this.backHand.x);
        }
        if (this.laserState != "aim" ||
           (plr != null && plr.dead())){
            if (this.laserTranspSound.isPlaying)
                this.laserTranspSound.stop();
        }
        if (this.laserState != "fire" ||
           (plr != null && plr.dead())){
            if (this.laserNormalSound.isPlaying)
                this.laserNormalSound.stop();
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
            if (this.laserTime >= this.IDLE_DURATION && !this.dead){
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
            
            var aimDuration = this.AIM_DURATION_H5;
            switch (this.health){
            default:
            case 5: aimDuration = this.AIM_DURATION_H5; break;
            case 4: aimDuration = this.AIM_DURATION_H4; break;
            }
            
            frontHandAngle = frontHandAngle + Math.easeInOutQuad(
                this.laserTime, diffF0, diffF1-diffF0, aimDuration);
            backHandAngle = backHandAngle + Math.easeInOutQuad(
                this.laserTime, diffB0, diffB1-diffB0, aimDuration);
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
            if (!this.laserTranspSound.isPlaying && !FullGame.Vars.sfxMuted &&
                (plr != null && !plr.dead()))
                this.laserTranspSound.play("", 0, 1, true);
            
            if (this.laserTime >= aimDuration){
                this.laserState = "fire";
                this.laserTime = 0;
            }
        } else if (this.laserState == "fire") {
            
            frontHandAngle = frontHandAngle + diffF1;
            backHandAngle = backHandAngle + diffB1;
            var laserType = FullGame.Til.LASER_NORMAL;
            var fireDuration = this.FIRE_DURATION_H5;
            switch (this.health){
            default:
            case 5: fireDuration = this.FIRE_DURATION_H5; break;
            case 4: fireDuration = this.FIRE_DURATION_H4; break;
            }
            if (this.laserTime >= fireDuration){
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
            if (!this.laserNormalSound.isPlaying && !FullGame.Vars.sfxMuted &&
                (plr != null && !plr.dead()))
                this.laserNormalSound.play("", 0, 1, true);
            
            if (this.laserTime >= fireDuration){
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
    
    m.canFlipAround = function() {
        var ret = this.laserState != "preAim" && this.laserState != "fire" &&
            this.laserState != "postFire" && !this.dead &&
            this.swordState != "swing1" && this.swordState != "swing2";
        return ret;
    };
    
    return m;
};
