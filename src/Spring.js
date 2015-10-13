//returns made spring, but doesn't add it to FullGame.GI.objs (will be done in ParseObjects)
FullGame.makeSpring = function(x, y, jumpHeight) {
    
    var sp;
    var color = FullGame.Til.BLUE;
    
    sp = game.add.sprite(x, y-8, "spring", undefined, FullGame.GI.objGroup);
    sp.animations.add("stop", [12], 30, true);
    sp.animations.add("spring", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12], 30, true);
    
    sp.animations.play("stop");
    sp.prevAnimFrame = 12;
    
    sp.anchor.setTo(.5, .5); //sprite is centered
    game.physics.enable(sp, Phaser.Physics.ARCADE);
    sp.body.immovable = true;
    
    sp.body.setSize(128, 46, 0, 17);
    
    sp.jumpVelocity = -770;
    sp.jumpDuration = .2;
    
    sp.springCooldown = 9999;
    
    sp.update = function() {
        
        var dt = game.time.physicsElapsed;
        this.springCooldown += dt;
        
        
        
        if (FullGame.GI.player == null) return;
        var plr = FullGame.GI.player;
        
        var hw = 64;
        var hh = 11.5;
        
        if (this.springCooldown < .2) return;
        if (!plr.body.wasTouching.down) return;
        if (this.x-hw <= plr.x+plr.RADIUS && plr.x-plr.RADIUS <= this.x+hw &&
            this.y-13 <= plr.y+plr.RADIUS && plr.y+plr.RADIUS <= this.y-10){
            
            plr.springJump(this.jumpVelocity, this.jumpDuration);
            this.springCooldown = 0;
            this.animations.play("spring");
            FullGame.playSFX("spring_bounce");
        }
        
        
    };
    
    sp.laserLines = [{x0:0, y0:0, x1:0, y1:0, color:color},
                     {x0:0, y0:0, x1:0, y1:0, color:color},
                     {x0:0, y0:0, x1:0, y1:0, color:color},
                     {x0:0, y0:0, x1:0, y1:0, color:color}];
    
    sp.setLaserLines = function(left, top, right, bottom) {
        this.laserLines[0].x0 = left;
        this.laserLines[0].y0 = top;
        this.laserLines[0].x1 = right;
        this.laserLines[0].y1 = top;
        this.laserLines[1].x0 = right;
        this.laserLines[1].y0 = top;
        this.laserLines[1].x1 = right;
        this.laserLines[1].y1 = bottom;
        this.laserLines[2].x0 = right;
        this.laserLines[2].y0 = bottom;
        this.laserLines[2].x1 = left;
        this.laserLines[2].y1 = bottom;
        this.laserLines[3].x0 = left;
        this.laserLines[3].y0 = bottom;
        this.laserLines[3].x1 = left;
        this.laserLines[3].y1 = top;
    };
    sp.setLaserLines(-60, -6, 60, 38);
    sp.frameHeightDiff = [-12, -22, -29, -34, -29, -24, -19, -15, -11, -8, -5, -2, 0];
    
    sp.afterCollision = function() {
        //getting currentAnim.frame will break the game if the animation isn't looping
        //holy fuck this is so stupid
        if (this.animations.currentAnim.name == "spring" && this.animations.currentAnim.frame == 12){
            this.animations.play("stop");
        }
        if (this.prevAnimFrame != this.animations.currentAnim.frame){
            this.setLaserLines(-64, -6 + this.frameHeightDiff[this.animations.currentAnim.frame],
                               64, 40);
            this.prevAnimFrame = this.animations.currentAnim.frame;
        }
        
    };
    
    return sp;
};

/* spring top diff during the animation:
-12
-22
-29
-34
-29
-24
-19
-15
-11
-8
-5
-2
0
[-12, -22, -29, -34, -29, -24, -19, -15, -11, -8, -5, -2, 0]
*/