FullGame.makePlayer = function(game) {
    //initialization
    var laserType = FullGame.Vars.playerLaserType;
    var laserColor = FullGame.Vars.playerLaserColor;
    var p;
    var spriteKey;
    var deathParticleKey;
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
    
    p.deathParticleKey = deathParticleKey;
    
    p.laserNormalSound = game.sound.add("laser_normal", 1, true);
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
    
    //camera constants
    p.CAMERA_MAX_HORIZ_OFFSET = SCREEN_WIDTH/2 - 128; //maximum horizontal part of camera will move from the center (player)
    p.CAMERA_HORIZ_BORDER = 90; //move mouse into left or right part of screen to start horizontal camera offset
    p.CAMERA_HORIZ_OFFSET_MAX_SPEED = 400;
    p.CAMERA_MAX_VERT_OFFSET = SCREEN_HEIGHT/2 - 128; //maximum vertical part of camera will move from the center (player)
    p.CAMERA_VERT_BORDER = 90; //move mouse into upper or lower part of screen to start vertical camera offset
    p.CAMERA_VERT_OFFSET_MAX_SPEED = 400;
    
    //varaibales
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
    
    p.update = function() {
        
        var dt = game.time.physicsElapsed;
        var vx = this.body.velocity.x;
        var vy = this.body.velocity.y;
        if (this.body.onFloor() || this.body.wasTouching.down)
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
    
    //do things that do not invlove moving
    p.afterCollision = function() {
        
        var dt = game.time.physicsElapsed;
        
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
            if (!this.laserNormalSound.isPlaying && !FullGame.Vars.sfxMuted)
                this.laserNormalSound.play("", 0, 1, true);
            if (FullGame.Keys.lmbPressed){
                this.cameraXWhenStartedFiring = firePt.x + this.cameraHorizOffset;
                this.cameraYWhenStartedFiring = firePt.y + this.cameraVertOffset;
            }
            
            //camera shaking (testing for now)
            if (this.laserType == FullGame.Til.LASER_THICK){
                this.camShakeAmplitude = Math.max(this.camShakeAmplitude, 3);
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
        } else {
            this.firing = false;
            if (this.laserNormalSound.isPlaying)
                this.laserNormalSound.stop();
        }
        
        //fire fadeout laser if just stopped firing
        if (!firedNormalThisFrame && this.firedNormalLastFrame){
            FullGame.Lasers.fireLaser(
                firePt.x, firePt.y,
                cosHeading, sinHeading,
                this.laserColor, FullGame.Til.LASER_FADEOUT);
        }
        this.firedNormalLastFrame = firedNormalThisFrame;
        
        var onFloor = (this.body.onFloor() || this.body.wasTouching.down);
        
        //detect step sound effect
        this.timeSinceStepSoundFX += dt;
        if (this.timeSinceStepSoundFX > .1){
            if (onFloor && this.prevVY > 90){
                FullGame.playSFX("step");
                this.timeSinceStepSoundFX = 0;
            }
            if (this.animations.currentAnim.name == "walk_forward" &&
                (this.animations.currentAnim.frame == 7 || this.animations.currentAnim.frame == 15)){
                FullGame.playSFX("step");
                this.timeSinceStepSoundFX = 0;
            }
            if (this.animations.currentAnim.name == "walk_backward" &&
                (this.animations.currentAnim.frame == 8 || this.animations.currentAnim.frame == 1)){
                FullGame.playSFX("step");
                this.timeSinceStepSoundFX = 0;
            }
        }
        
        this.prevVY = this.body.velocity.y;
        
        //pause game if asked
        if (willPause){
            FullGame.Menus.pauseMenu();
        }
        
        //test removing tiles
        if (FullGame.Keys.rmbPressed){
            //FullGame.GI.removeTile(Math.floor(localPt.x/FullGame.GI.tileWidth), Math.floor(localPt.y/FullGame.GI.tileHeight));
        }
        
        
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
        var noCameraMovementWhenFiring = FullGame.Keys.rmbHeld;
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
        
        FullGame.GI.camera.setPosition(cx - SCREEN_WIDTH/2 + this.camShakeX,
                                       cy - SCREEN_HEIGHT/2 + this.camShakeY);
        
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
            this.knockbackTime = 0;
            FullGame.playSFX("death");
            FullGame.Vars.totalDeaths++;
            FullGame.Messages.onPlayerDeath();
            
            //particle effect (bullshit phaser emitter didn't work at all)
            for (var i=0; i<8; i++){
                var part = game.add.sprite(this.x, this.y, this.deathParticleKey, undefined, FullGame.GI.objGroup);
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
            this.behaviorDuration = .4;
        } else if (behavior == "walkRight"){
            this.behaviorTime = 0;
            this.behaviorDuration = .4;
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
    
    p.dead = function() {
        return (this.state == this.STATE_DEATH);
    };
    p.damageInvincible = function() {
        return (this.damageInvincibleTime < this.DAMAGE_INVINCIBILITY_DURATION || this.dead());
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
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};