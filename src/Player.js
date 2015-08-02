FullGame.makePlayer = function(game) {
    //initialization
    var laserType = FullGame.Vars.playerLaserType;
    var laserColor = FullGame.Vars.playerLaserColor;
    var p;
    var spriteKey;
    var deathParticleKey;
    var powerKey;
    switch (laserColor){
    case FullGame.Til.BLUE:
        spriteKey = "player_blue";
        deathParticleKey = "player_blue_death_particle";
        break;
    case FullGame.Til.GREEN:
        spriteKey = "player_green";
        deathParticleKey = "player_green_death_particle";
        break;
    case FullGame.Til.RED:
    default:
        spriteKey = "player_red";
        deathParticleKey = "player_red_death_particle";
    }
    powerKey = "power_player";
    p = game.add.sprite(FullGame.Vars.startX, FullGame.Vars.startY, spriteKey, undefined, FullGame.GI.objGroup);
    p.animations.add("idle", [0], 30, true);
    p.animations.add("walk_forward", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 25, true);
    p.animations.add("walk_backward", [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 16], 25, true);
    p.animations.add("rising", [17, 18, 19, 20, 21], 20, false);
    p.animations.add("falling", [22, 23, 24, 25, 26], 20, false);
    p.animations.add("damaged", [27], 30, true);
    
    p.animations.play("idle");
    
    p.anchor.setTo(.5, .5); //sprite is centered
    p.scale.set(.5, .5);
    game.physics.enable(p, Phaser.Physics.ARCADE);
    p.body.setSize(80, 102, 0, 4);
    p.body.tilePadding.x = 100;
    p.body.tilePadding.y = 100;
    
    p.powerSprite = game.add.sprite(0, 0, powerKey, undefined, FullGame.GI.objGroup);
    p.powerSprite.anchor.setTo(.5, .5); //sprite is centered
    p.powerSprite.scale.set(.5, .5);
    if (laserType != FullGame.Til.LASER_THICK){
        p.powerSprite.visible = false;
    }
    
    p.dummyWrapSprite = game.add.sprite(0, 0, spriteKey, undefined, FullGame.GI.objGroup);
    p.dummyWrapSprite.anchor.setTo(.5, .5); //sprite is centered
    p.dummyWrapSprite.scale.set(.5, .5);
    p.dummyWrapSprite.visible = false;
    
    p.deathParticleKey = deathParticleKey;
    
    p.laserNormalSound = game.sound.add("laser_normal", 1, true);
    p.laserThickSound = game.sound.add("laser_thick", 1, true);
    p.NUM_BOOP_SOUNDS = 3;
    
    //movement constants
    p.RADIUS = 24;
    p.GRAVITY = 1800;
    p.TERMINAL_VELOCITY = 800;
    p.SNAP_SIZE = 4; //not implemented
    p.MAX_SPEED = 300;
    p.ACCEL = 2000;
    p.AIR_ACCEL = 700;
    p.FRICTION = 2000;
    p.AIR_FRICTION = 500;
    p.FIRING_MAX_SPEED = p.MAX_SPEED;//150;
    p.FIRING_ACCEL = p.ACCEL;//800;
    p.FIRING_AIR_ACCEL = p.AIR_ACCEL;
    p.FIRING_FRICTION = p.FRICTION;
    p.FIRING_AIR_FRICTION = p.AIR_FRICTION;
    p.JUMP_VELOCITY = -500;
    p.JUMP_MAX_DURATION = .16;
    p.DAMAGE_KNOCKBACK_DURATION = .4;
    p.DAMAGE_INVINCIBILITY_DURATION = .6;
    p.DAMAGE_KNOCKBACK_SPEED = 300;
    p.DAMAGE_KNOCKBACK_Y_VEL = -150;
    p.DAMAGE_KNOCKBACK_FRICTION = 1000;
    p.HEALTH_RECHARGE_DURATION = 2.2;
    p.DEATH_DURATION = 2.0;
    p.STATE_NORMAL = 0;
    p.STATE_DAMAGE_KNOCKBACK = 1;
    p.STATE_DEATH = 2;
    p.STATE_PORTAL = 3;
    p.STATE_SPACESHIP = 4;
    
    //camera constants
    p.CAMERA_MAX_HORIZ_OFFSET = SCREEN_WIDTH/2 - 128; //maximum horizontal part of camera will move from the center (player)
    p.CAMERA_HORIZ_BORDER = 90; //move mouse into left or right part of screen to start horizontal camera offset
    p.CAMERA_HORIZ_OFFSET_MAX_SPEED = 400;
    p.CAMERA_MAX_VERT_OFFSET = SCREEN_HEIGHT/2 - 128; //maximum vertical part of camera will move from the center (player)
    p.CAMERA_VERT_BORDER = 90; //move mouse into upper or lower part of screen to start vertical camera offset
    p.CAMERA_VERT_OFFSET_MAX_SPEED = 300;
    
    //variables
    p.state = p.STATE_NORMAL;
    p.laserType = laserType;
    p.laserColor = laserColor;
    p.behavior = "none"; //if not "none", controls autonomously (like when entering or leaving a level)
    p.behaviorTime = 0;
    p.behaviorDuration = 0;
    p.jumpTime = 0;
    p.prevVY = 0; //previous velocity y
    p.firing = false;
    p.firedNormalLastFrame = false;
    p.offFloorTime = 0;
    p.fireLaserInterrupt = false; //used to ensure laser can only start firing on button press when state is STATE_NORMAL
    p.knockbackTime = 0;
    p.damageInvincibleTime = 99999;
    p.lowHealthTime = 99999; //needs to be public for HUD to display the lowHealthFG correctly
    p.cameraHorizOffset = 0;
    p.cameraVertOffset = 0;
    p.cameraXWhenStartedFiring = 0;
    p.cameraYWhenStartedFiring = 0;
    
    p.camShakeAmplitude = 0; //set this to start camera shaking.  Will automatically decrease over time
    p.camShakeAmplitudeDecline = 4; //how fast camera shake goes to normal
    p.camShakeX = 0;
    p.camShakeY = 0;
    
    p.springJumpVelocity = 0;
    p.springJumpDuration = 0;
    p.springSpriteSpinTime = 999999;
    p.springSpriteSpinDuration = 0;
    p.springSpriteSpinClockwise = true;
    p.springJumping = false;
    p.timeSinceStepSoundFX = 99999;
    p.stepSoundEffectCounter = 0;
    
    p.update = function() {
        
        var dt = game.time.physicsElapsed;
        var vx = this.body.velocity.x;
        var vy = this.body.velocity.y;
        if (this.body.onFloor() || this.body.touching.down)
            this.offFloorTime = 0;
        else
            this.offFloorTime += dt;
        var onFloor = (this.offFloorTime < dt + .02);
        if (this.springJumping && onFloor && this.jumpTime > this.springJumpDuration){
            this.springJumping = false;
            this.springSpriteSpinTime = 999999;
        }
        
        var leftHeld = FullGame.Keys.leftHeld;
        var rightHeld = FullGame.Keys.rightHeld;
        var jumpPressed = FullGame.Keys.jumpPressed;
        var jumpHeld = FullGame.Keys.jumpHeld;
        //behavior can control movement keys
        if (this.behavior != "" && this.behavior != "none"){
            jumpPressed = false;
            jumpHeld = false;
            if (this.behavior == "walkLeft" || this.behavior == "springJumpLeft"){
                leftHeld = true;
                rightHeld = false;
            } else if (this.behavior == "walkRight" || this.behavior == "springJumpRight"){
                leftHeld = false;
                rightHeld = true;
            } else if (this.behavior == "jumpLeft"){
                leftHeld = true;
                rightHeld = false;
                jumpHeld = true;
            } else if (this.behavior == "jumpRight"){
                leftHeld = false;
                rightHeld = true;
                jumpHeld = true;
            }
            this.behaviorTime += dt;
            if (this.behaviorTime >= this.behaviorDuration){
                this.behavior = "none";
            }
        }
        
        switch (this.state){
        case this.STATE_NORMAL:
        default:
            
            //horizontal movement
            var facingRight = (this.mousePt().x > this.x);
            if (facingRight != (this.scale.x > 0) &&
                this.springSpriteSpinTime > this.springSpriteSpinDuration){
                this.scale.x *= -1;
            }
            
            var maxSpeed, accel, friction;
            if (onFloor){
                if (this.firing){
                    maxSpeed = this.FIRING_MAX_SPEED;
                    accel = this.FIRING_ACCEL;
                    friction = this.FIRING_FRICTION;
                } else {
                    maxSpeed = this.MAX_SPEED;
                    accel = this.ACCEL;
                    friction = this.FRICTION;
                }
            } else {
                if (this.firing){
                    maxSpeed = this.FIRING_MAX_SPEED;
                    accel = this.FIRING_AIR_ACCEL;
                    friction = this.FIRING_AIR_FRICTION;
                } else {
                    maxSpeed = this.MAX_SPEED;
                    accel = this.AIR_ACCEL;
                    friction = this.AIR_FRICTION;
                }
            }

            if (leftHeld == rightHeld){
                //no direction held; just apply friction
                if (vx > 0){
                    vx = Math.max(0, vx - friction * dt);
                } else {
                    vx = Math.min(0, vx + friction * dt);
                }
                if (onFloor && this.animations.currentAnim.name != "idle"){
                    this.animations.play("idle");
                }
            } else {
                //going right or left
                if (rightHeld){
                    //right held
                    if (vx < 0){ //also apply friction since changing direction
                        vx = Math.min(0, vx + friction * dt);
                    }
                    vx = Math.min(maxSpeed, vx + accel * dt);
                } else {
                    //left held
                    if (vx > 0){ //also apply friction since changing direction
                        vx = Math.max(0, vx - friction * dt);
                    }
                    vx = Math.max(-maxSpeed, vx - accel * dt);
                }
                
                if (onFloor){
                    var expectedAnim = "walk_forward";
                    if (facingRight != rightHeld){
                        expectedAnim = "walk_backward";
                    }
                    if (this.animations.currentAnim.name != expectedAnim) {
                        this.animations.play(expectedAnim);
                    }
                }
            }

            //vertical movement
            var gravity = this.GRAVITY;
            var terminalVelocity = this.TERMINAL_VELOCITY;
            var jumpVel = this.JUMP_VELOCITY;
            if (onFloor && !this.springJumping){
                if (jumpPressed){
                    vy = jumpVel;
                    this.jumpTime = 0;
                    FullGame.playSFX("jump");
                }
            } else {
                this.jumpTime += dt;
                if (this.springJumping){
                    if (this.jumpTime > this.springJumpDuration){
                        //not spring jumping anymore
                        this.springJumping = false;
                    } else {
                        //continue spring jump
                        vy = this.springJumpVelocity;
                    }
                } else if (this.jumpTime > this.JUMP_MAX_DURATION || !jumpHeld){
                    //not jumping anymore
                    this.jumpTime = 9999;
                } else {
                    //continue jump
                    vy = jumpVel;
                }
            }
            vy = Math.min(terminalVelocity, vy + gravity * dt);
            if (!onFloor){
                if (vy < 0 && this.animations.currentAnim.name != "rising"){
                    this.animations.play("rising");
                }
                if (vy >= 0 && this.animations.currentAnim.name != "falling"){
                    this.animations.play("falling");
                }
            }
            
            break;
            
        case this.STATE_DAMAGE_KNOCKBACK:
            
            //apply knockback velocity almost immidately after being hit
            if (this.knockbackTime < .04 && .04 <= this.knockbackTime+dt){
                if (this.knockbackRight){
                    vx = this.DAMAGE_KNOCKBACK_SPEED;
                } else {
                    vx = -this.DAMAGE_KNOCKBACK_SPEED;
                }
                vy = this.DAMAGE_KNOCKBACK_Y_VEL;
            }
            
            //just apply friction
            var friction = 0;
            if (onFloor && vy > 0){
                friction = this.DAMAGE_KNOCKBACK_FRICTION;
            }
            if (vx > 0){
                vx = Math.max(0, vx - friction * dt);
            } else {
                vx = Math.min(0, vx + friction * dt);
            }
            //still apply gravity
            var gravity = this.GRAVITY;
            var terminalVelocity = this.TERMINAL_VELOCITY;
            vy = Math.min(terminalVelocity, vy + gravity * dt);
            
            //check for going back to normal state
            this.knockbackTime += dt;
            if (this.knockbackTime >= this.DAMAGE_KNOCKBACK_DURATION){
                this.state = this.STATE_NORMAL;
                if (onFloor){
                    this.animations.play("idle");
                } else {
                    this.animations.play("falling");
                }
            }
            
            break;
            
        case this.STATE_DEATH:
            
            //blackscreen
            if (this.knockbackTime < this.DEATH_DURATION-FullGame.HUD.BLACK_SCREEN_FADE_DURATION &&
                this.knockbackTime+dt >= this.DEATH_DURATION-FullGame.HUD.BLACK_SCREEN_FADE_DURATION){
                FullGame.HUD.fadeOut();
            }
            this.knockbackTime += dt;
            if (this.knockbackTime >= this.DEATH_DURATION){
                //reset level
                FullGame.GI.restart();
            }
            
            break;
            
        case this.STATE_PORTAL:
            break;
        case this.STATE_SPACESHIP:
            break;
        }
        
        this.body.velocity.x = vx;
        this.body.velocity.y = vy;
        
        this.damageInvincibleTime += dt;
        this.lowHealthTime += dt;
        
        //rotation in spring jump
        if (this.springSpriteSpinTime < this.springSpriteSpinDuration){
            this.springSpriteSpinTime += dt;
            var rot = Math.easeOutQuad(
                Math.min(this.springSpriteSpinTime, this.springSpriteSpinDuration),
                0, Math.PI*2,
                this.springSpriteSpinDuration);
            if (!this.springSpriteSpinClockwise){
                rot *= -1;
            }
            this.rotation = rot;
            
        } else {
            this.rotation = 0;
        }
        
        
        //failsafe in case player glitches and is falling out bottom of world
        if (this.state == this.STATE_NORMAL &&
            this.y > FullGame.GI.worldHeight + 20 && this.behavior == "none" && this.startLevelAfterMap == ""){
            FullGame.HUD.fadeOut();
            this.startLevelAfterDuration(game.state.current, FullGame.HUD.BLACK_SCREEN_FADE_DURATION);
        }
        
        //if starting new level soon
        if (this.startLevelAfterMap != ""){
            this.startLevelAfterTime += dt;
            if (this.startLevelAfterTime >= this.startLevelAfterDur){
                FullGame.GI.newLevel(this.startLevelAfterMap);
            }
        }
        
    };
    
    //setting reticle based on laser type
    FullGame.HUD.setReticle(p.laserType, p.laserColor);
    
    //getting power ability
    p.getPoweredUp = function() {
        this.laserType = FullGame.Til.LASER_THICK;
        this.powerSprite.visible = true;
    };
    p.losePowerAbility = function() {
        this.laserType = FullGame.Til.LASER_NORMAL;
        this.powerSprite.visible = false;
    };
    
    //do things that do not invlove moving
    p.afterCollision = function() {
        
        var dt = game.time.physicsElapsed;
        
        //world wrap
        if (FullGame.GI.worldWrap){
            if (this.x < 0){
                this.x += FullGame.GI.worldWidth;
            } else if (this.x >= FullGame.GI.worldWidth){
                this.x -= FullGame.GI.worldWidth;
            }
            if (this.y < 0){
                this.y += FullGame.GI.worldHeight;
            } else if (this.y >= FullGame.GI.worldHeight){
                this.y -= FullGame.GI.worldHeight;
            }
            //update dummy sprite
            p.dummyWrapSprite.visible = this.visible;
            if (this.x < 64){
                this.dummyWrapSprite.x = this.x + FullGame.GI.worldWidth;
                this.dummyWrapSprite.y = this.y;
            } else if (this.x > FullGame.GI.worldWidth-64) {
                this.dummyWrapSprite.x = this.x - FullGame.GI.worldWidth;
                this.dummyWrapSprite.y = this.y;
            } else if (this.y < 64){
                this.dummyWrapSprite.y = this.y + FullGame.GI.worldHeight;
                this.dummyWrapSprite.x = this.x;
            } else if (this.y > FullGame.GI.worldHeight-64) {
                this.dummyWrapSprite.y = this.y - FullGame.GI.worldHeight;
                this.dummyWrapSprite.x = this.x;
            }
            this.dummyWrapSprite.scale.set(this.scale.x, this.scale.y);
            this.dummyWrapSprite.animations.frame = this.animations.frame;
        }
        
        
        //move camera
        this.positionCamera();
        
        //update reticle position
        FullGame.HUD.reticleUpdate();
        
        //pause game soon?
        var willPause = false;
        if (this.state == this.STATE_NORMAL &&
            (this.behavior == "" || this.behavior == "none")){
            willPause = FullGame.Keys.pausePressed;
        }
        
        //firing laser
        if (this.state == this.STATE_NORMAL &&
            (this.behavior == "" || this.behavior == "none") &&
            !this.outOfBounds() &&
            !willPause){
            if (FullGame.Keys.lmbPressed || FullGame.Keys.rmbPressed){
                this.laserFireInterrupt = false;
            }
        } else {
            this.laserFireInterrupt = true;
        }
        var firePt = this.firePt();
        var localPt = {x:(FullGame.HUD.reticle.x + FullGame.GI.camera.x), y:(FullGame.HUD.reticle.y + FullGame.GI.camera.y)}; //this.mousePt();
        var dist = Math.sqrt((localPt.x-firePt.x)*(localPt.x-firePt.x) + (localPt.y-firePt.y)*(localPt.y-firePt.y));
        var cosHeading = (localPt.x - firePt.x) / dist;
        var sinHeading = (localPt.y - firePt.y) / dist;
        var firedNormalThisFrame = false;
        if (FullGame.Keys.lmbHeld && !this.laserFireInterrupt){
            //firing laser
            FullGame.Lasers.fireLaser(
                firePt.x, firePt.y,
                cosHeading, sinHeading,
                this.laserColor, this.laserType);
            this.firing = true;
            firedNormalThisFrame = true;
            if (this.laserType == FullGame.Til.LASER_NORMAL){
                if (!this.laserNormalSound.isPlaying && !FullGame.Vars.sfxMuted)
                    this.laserNormalSound.play("", 0, 1, true);
                if (this.laserThickSound.isPlaying)
                    this.laserThickSound.stop();
            } else if (this.laserType == FullGame.Til.LASER_THICK){
                if (!this.laserThickSound.isPlaying && !FullGame.Vars.sfxMuted)
                    this.laserThickSound.play("", 0, 1, true);
                if (this.laserNormalSound.isPlaying)
                    this.laserNormalSound.stop();
            }
            if (FullGame.Keys.lmbPressed){
                this.cameraXWhenStartedFiring = firePt.x + this.cameraHorizOffset;
                this.cameraYWhenStartedFiring = firePt.y + this.cameraVertOffset;
            }
            
            //camera shaking when firing thick laser
            if (this.laserType == FullGame.Til.LASER_THICK){
                this.shakeCamera(3);
            }
            
        } else if (FullGame.Keys.rmbHeld && !this.laserFireInterrupt){
            //firing preview laser
            FullGame.Lasers.fireLaser(
                firePt.x, firePt.y,
                cosHeading, sinHeading,
                this.laserColor, FullGame.Til.LASER_TRANSPARENT);
            this.firing = true;
            if (FullGame.Keys.rmbPressed){
                this.cameraXWhenStartedFiring = firePt.x + this.cameraHorizOffset;
                this.cameraYWhenStartedFiring = firePt.y + this.cameraVertOffset;
            }
            //going from lmb to rmb immediately
            if (this.laserNormalSound.isPlaying)
                this.laserNormalSound.stop();
            if (this.laserThickSound.isPlaying)
                this.laserThickSound.stop();
        } else {
            this.firing = false;
            if (this.laserNormalSound.isPlaying)
                this.laserNormalSound.stop();
            if (this.laserThickSound.isPlaying)
                this.laserThickSound.stop();
        }
        
        //fire fadeout laser if just stopped firing
        if (!firedNormalThisFrame && this.firedNormalLastFrame){
            FullGame.Lasers.fireLaser(
                firePt.x, firePt.y,
                cosHeading, sinHeading,
                this.laserColor, FullGame.Til.LASER_FADEOUT);
        }
        this.firedNormalLastFrame = firedNormalThisFrame;
        
        var onFloor = (this.body.onFloor() || this.body.touching.down);
        
        //detect step sound effect
        this.timeSinceStepSoundFX += dt;
        if (this.timeSinceStepSoundFX > .1 && this.visible){
            if (onFloor && this.prevVY > 150){
                //implement shake land either
                if (false && this.stepSoundEffectCounter == 0 &&
                    ((FullGame.Vars.startMap == "firstLevel" && FullGame.Vars.lastMap != "firstOrb"))){
                    this.shakeCamera(6);
                    FullGame.playSFX("step");
                } else {
                    FullGame.playSFX("step");
                }
                this.stepSoundEffectCounter++;
                this.timeSinceStepSoundFX = 0;
            }
            if (this.animations.currentAnim.name == "walk_forward" &&
                (this.animations.currentAnim.frame == 7 || this.animations.currentAnim.frame == 15)){
                FullGame.playSFX("step");
                this.stepSoundEffectCounter++;
                this.timeSinceStepSoundFX = 0;
            }
            if (this.animations.currentAnim.name == "walk_backward" &&
                (this.animations.currentAnim.frame == 8 || this.animations.currentAnim.frame == 1)){
                FullGame.playSFX("step");
                this.stepSoundEffectCounter++;
                this.timeSinceStepSoundFX = 0;
            }
        }
        
        this.prevVY = this.body.velocity.y;
        
        //move power sprite
        this.powerSprite.x = firePt.x;
        this.powerSprite.y = firePt.y;
        this.powerSprite.scale.x = this.scale.x;
        this.powerSprite.scale.y = this.scale.y;
        this.powerSprite.rotation = this.rotation;
        
        //pause game if asked
        if (willPause){
            FullGame.Menus.pauseMenu();
        }
        
        
    };
    
    p.shakeCamera = function(amplitude){
        this.camShakeAmplitude = Math.max(this.camShakeAmplitude, amplitude);
    };
    
    p.outOfBounds = function() {
        return (this.x<0 || this.x>FullGame.GI.worldWidth || this.y<0 || this.y>FullGame.GI.worldHeight);
    };
    
    p.positionCamera = function() {
        if (this.dead()) return;
        if (this.outOfBounds()) return;
        var dt = game.time.physicsElapsed;
        var firePt = this.firePt();
        var cx = firePt.x;
        var cy = firePt.y;
        var dt = game.time.physicsElapsed;
        var mx = FullGame.Keys.mouseX;
        var my = FullGame.Keys.mouseY;
        var ratio;
        
        //stupid fix to make camera pan up during spaceship part
        if (this.state == this.STATE_SPACESHIP){
            mx = SCREEN_WIDTH/2;
            my = 0;
        }
        
        var prevCameraHorizOffset = this.cameraHorizOffset;
        var prevCameraVertOffset = this.cameraVertOffset;
        if (mx < this.CAMERA_HORIZ_BORDER){ //move camera left
            ratio = 1 - mx / this.CAMERA_HORIZ_BORDER;
            this.cameraHorizOffset -= ratio * this.CAMERA_HORIZ_OFFSET_MAX_SPEED * dt;
        } else if (mx > SCREEN_WIDTH - this.CAMERA_HORIZ_BORDER){ //move camera right
            ratio = 1 - (SCREEN_WIDTH - mx) / this.CAMERA_HORIZ_BORDER;
            this.cameraHorizOffset += ratio * this.CAMERA_HORIZ_OFFSET_MAX_SPEED * dt;
        }
        if (my < this.CAMERA_VERT_BORDER){ //move camera up
            ratio = 1 - my / this.CAMERA_VERT_BORDER;
            this.cameraVertOffset -= ratio * this.CAMERA_VERT_OFFSET_MAX_SPEED * dt;
        } else if (my > SCREEN_HEIGHT - this.CAMERA_VERT_BORDER){ //move camera down
            ratio = 1 - (SCREEN_HEIGHT - my) / this.CAMERA_VERT_BORDER;
            this.cameraVertOffset += ratio * this.CAMERA_VERT_OFFSET_MAX_SPEED * dt;
        }
        var noCameraMovementWhenFiring = false; //NEW: holding RMB doesn't lock camera.  //FullGame.Keys.rmbHeld;
        if (noCameraMovementWhenFiring && this.firing){ //currently firing, try to not have camera move
            
            //weird fix so that camera will still move when mouse goes to the borders
            this.cameraXWhenStartedFiring += this.cameraHorizOffset - prevCameraHorizOffset;
            this.cameraXWhenStartedFiring = Math.max(SCREEN_WIDTH/2, Math.min(FullGame.GI.worldWidth - SCREEN_WIDTH/2, this.cameraXWhenStartedFiring));
            this.cameraYWhenStartedFiring += this.cameraVertOffset - prevCameraVertOffset;
            this.cameraYWhenStartedFiring = Math.max(SCREEN_HEIGHT/2, Math.min(FullGame.GI.worldHeight - SCREEN_HEIGHT/2, this.cameraYWhenStartedFiring));
            
            //set offsets in a way such that the camera doesn't move when player moves
            this.cameraHorizOffset = this.cameraXWhenStartedFiring - firePt.x;
            this.cameraVertOffset = this.cameraYWhenStartedFiring - firePt.y;
        }
        
        this.cameraHorizOffset = Math.max(-this.CAMERA_MAX_HORIZ_OFFSET, Math.min(this.CAMERA_MAX_HORIZ_OFFSET, this.cameraHorizOffset));
        this.cameraVertOffset = Math.max(-this.CAMERA_MAX_VERT_OFFSET, Math.min(this.CAMERA_MAX_VERT_OFFSET, this.cameraVertOffset));
        
        cx = firePt.x + this.cameraHorizOffset;
        cy = firePt.y + this.cameraVertOffset;
        
        //don't go off edge of the world
        cx = Math.max(SCREEN_WIDTH/2, Math.min(FullGame.GI.worldWidth - SCREEN_WIDTH/2, cx));
        cy = Math.max(SCREEN_HEIGHT/2, Math.min(FullGame.GI.worldHeight - SCREEN_HEIGHT/2, cy));
        this.cameraHorizOffset = cx - firePt.x;
        this.cameraVertOffset = cy - firePt.y;
        
        //camera shaking
        this.camShakeAmplitude = Math.max(0, this.camShakeAmplitude - this.camShakeAmplitudeDecline * dt);
        this.camShakeX = (Math.random()*2-1) * this.camShakeAmplitude;
        this.camShakeY = (Math.random()*2-1) * this.camShakeAmplitude;
        
        FullGame.GI.camera.setPosition(
            Math.max(0, Math.min(FullGame.GI.worldWidth-SCREEN_WIDTH, cx - SCREEN_WIDTH/2 + this.camShakeX)),
            Math.max(0, Math.min(FullGame.GI.worldHeight-SCREEN_HEIGHT, cy - SCREEN_HEIGHT/2 + this.camShakeY)));
        
    };
    
    p.damage = function(knockbackRight, fatal) {
        if (this.damageInvincible()) return;
        
        FullGame.Vars.totalDamages++;
        
        if (this.lowHealth() || fatal){
            //player death
            this.state = this.STATE_DEATH;
            this.body.enable = false;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.visible = false;
            this.powerSprite.visible = false;
            this.knockbackTime = 0;
            FullGame.playSFX("death");
            FullGame.stopMusic();
            FullGame.Vars.totalDeaths++;
            FullGame.Messages.onPlayerDeath();
            
            var powerPlayer = (FullGame.Vars.playerLaserType == FullGame.Til.LASER_THICK);
            
            //particle effect (bullshit phaser emitter didn't work at all)
            var numParts = 8;
            if (powerPlayer)
                numParts++;
            for (var i=0; i<numParts; i++){
                var part;
                if (powerPlayer && i == numParts-1){
                    part = game.add.sprite(this.x, this.y, "power_player", undefined, FullGame.GI.objGroup);
                    part.scale.set(.5, .5);
                } else {
                    part = game.add.sprite(this.x, this.y, this.deathParticleKey, undefined, FullGame.GI.objGroup);
                }
                part.anchor.setTo(.5, .5); //sprite is centered
                game.physics.enable(part, Phaser.Physics.ARCADE);
                part.body.setSize(15, 15, 0, 0);
                part.body.velocity.set((Math.random()*2-1)*200, Math.random()*-200);
                part.rotation = Math.random()*Math.PI*2;
                part.rotationSpeed = (Math.random()*2-1)*10;
                part.body.immovable = true;
                part.body.gravity.y = 500;
                part.update = function() {
                    var dt = game.time.physicsElapsed;
                    this.rotation += this.rotationSpeed * dt;
                    game.physics.arcade.collide(this, FullGame.GI.tileLayer);
                    if (this.body.onFloor()){
                        this.body.velocity.x = 0;
                        this.rotationSpeed = 0;
                    }
                };
            }
            
        } else {
            
            this.state = this.STATE_DAMAGE_KNOCKBACK;
            this.knockbackTime = 0;
            this.damageInvincibleTime = 0;
            this.lowHealthTime = 0;
            this.body.velocity.x = 0; //will apply knockback velocity in a short amount of time in update()
            this.body.velocity.y = 0;
            this.jumpTime = 9999; //no longer jumping
            this.springJumping = false;
            this.knockbackRight = knockbackRight;
            this.animations.play("damaged");
            FullGame.playSFX("damage");
            var boopSound = "boop" + (1+Math.floor(Math.random()*this.NUM_BOOP_SOUNDS));
            FullGame.playSFX(boopSound);
        }
        
    };
    
    p.springJump = function(velocity, duration) {
        if (this.springJumping) return;
        this.jumpTime = 0;
        this.springJumpVelocity = velocity;
        this.springJumpDuration = duration;
        this.body.velocity.y = this.springJumpVelocity;
        this.springJumping = true;
        this.springSpriteSpinTime = 0;
        this.springSpriteSpinDuration = duration - velocity / this.GRAVITY + .2;
        if (FullGame.Keys.rightHeld == FullGame.Keys.lefttHeld){
            this.springSpriteSpinClockwise = (this.body.velocity.x > 0);
        } else {
            this.springSpriteSpinClockwise = FullGame.Keys.rightHeld;
        }
    };
    
    p.setBehavior = function(behavior) {
        if (behavior == "walkLeft"){
            this.behaviorTime = 0;
            this.behaviorDuration = .45;
        } else if (behavior == "walkRight"){
            this.behaviorTime = 0;
            this.behaviorDuration = .45;
        } else if (behavior == "fall"){
            this.behaviorTime = 0;
            this.behaviorDuration = .4;
        } else if (behavior == "jumpLeft" || behavior == "jumpRight"){
            this.body.velocity.y = this.JUMP_VELOCITY;
            this.jumpTime = 0;
            this.behaviorTime = 0;
            this.behaviorDuration = .35;
        } else if (behavior == "springJumpLeft" || behavior == "springJumpRight"){
            this.springJump(-770, .04);
            this.springSpriteSpinClockwise = (behavior == "springJumpRight");
            this.behaviorTime = 0;
            this.behaviorDuration = .35;
        } else if (behavior == "portal"){
            this.behaviorTime = 0;
            this.behaviorDuration = .44;
            this.visible = false;
            this.powerSprite.visible = false;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.state = this.STATE_PORTAL;
        } else if (behavior == "spaceship"){
            this.behaviorTime = 0;
            this.behaviorDuration = 3;
            this.visible = false;
            this.powerSprite.visible = false;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.state = this.STATE_SPACESHIP;
        } else if (behavior == "none"){
            this.behaviorTime = 0;
            this.behaviorDuration = 0;
        } else {
            console.log("WARNING: Player not currently able to follow behavior '" + behavior + "'");
        }
        this.behavior = behavior;
    };
    //setting things based on initial behvaior
    p.setBehavior(FullGame.Vars.startBehavior);
    
    p.startLevelAfterTime = 0;
    p.startLevelAfterDur = 0;
    p.startLevelAfterMap = "";
    p.startLevelAfterDuration = function(map, duration){
        this.startLevelAfterMap = map;
        this.startLevelAfterTime = 0;
        this.startLevelAfterDur = duration;
    };
    
    p.teleport = function(x, y) {
        this.x = x;
        this.y = y;
    };
    
    p.dead = function() {
        return (this.state == this.STATE_DEATH);
    };
    p.damageInvincible = function() {
        return (this.damageInvincibleTime < this.DAMAGE_INVINCIBILITY_DURATION || this.dead()
               || this.behavior == "portal" || this.behavior == "spaceship");
    };
    p.lowHealth = function() {
        return (this.lowHealthTime < this.HEALTH_RECHARGE_DURATION || this.dead());
    };
    
    //returns {x, y} of the mouse coordinates in this space
    p.mousePt = function() {
        var localPt = {x:FullGame.Keys.mouseX, y:FullGame.Keys.mouseY};
        localPt.x += FullGame.GI.camera.x;
        localPt.y += FullGame.GI.camera.y;
        return localPt;
    };
    
    //returns {x, y} of the coordinates where laser will spawn when fired
    p.firePt = function() {
        var fireX = this.position.x + this.body.velocity.x * game.time.physicsElapsed;
        var fireY = this.position.y + this.body.velocity.y * game.time.physicsElapsed;
        return {x:fireX, y:fireY};
    };
    
    //returns {x, y} of firePt in the global space
    p.globalFirePt = function() {
        var firePt = this.firePt();
        return {x:(firePt.x - FullGame.GI.camera.x), y:(firePt.y - FullGame.GI.camera.y)};
    };
    
    return p;
};

Math.easeOutQuad = function (t, b, c, d) {
	t /= d;
	return -c * t*(t-2) + b;
};
Math.easeInQuad = function (t, b, c, d) {
	t /= d;
	return c*t*t + b;
};
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};