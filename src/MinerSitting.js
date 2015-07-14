//this is a one-time, one-level kind of asset

//returns made minerSitting, but doesn't add it to FullGame.GI.objs (will be done in ParseObjects)
FullGame.makeMinerSitting = function() {
    //initialization
    var miner = game.add.sprite(
        675, 265, //position
        "miner_sitting",
        undefined, FullGame.GI.objGroup);
    miner.animations.add("idle", [0], 20, true);
    miner.animations.add("toss", [1, 2, 3, 4, 5], 20, false);
    miner.animations.add("retract", [4, 3, 2, 1, 0], 20, false);
    miner.animations.play("idle");
    
    miner.GEM_X0 = 685;
    miner.GEM_Y0 = 275;
    miner.GEM_X1 = 512;
    miner.GEM_Y1 = 288;
    
    miner.threwGem = false;
    miner.t = 0;
    miner.gem = null;
    
    
    if (FullGame.Vars.messagesSaid.indexOf("firstGem") != -1){
        //conversation with miner already happened, so put gem there
        miner.gem = FullGame.makeGem(miner.GEM_X1, miner.GEM_Y1, FullGame.Til.BLUE); //copied from code in ParseObjects
        FullGame.GI.objs.push(miner.gem);
        FullGame.GI.gems.push(miner.gem);
    }
    
    miner.update = function() {
        var dt = game.time.physicsElapsed;
        
        if (miner.threwGem){
            this.t += dt;
            
            if (this.t-dt < .2 && .2 <= this.t){
                //create gem to throw
                this.gem = FullGame.makeGem(this.GEM_X0, this.GEM_Y0, FullGame.Til.BLUE); //copied from code in ParseObjects
                FullGame.GI.objs.push(this.gem);
                FullGame.GI.gems.push(this.gem);
                
                //this indicates that gem should now be on the screen in this room
                FullGame.Vars.messagesSaid.push("firstGem");
            }
            
            //moving gem
            if (.2 < this.t && this.t < 1.2){
                this.gem.x = Math.easeInOutQuad(this.t-.2, this.GEM_X0, this.GEM_X1-this.GEM_X0, 1.0);
                this.gem.y = Math.easeInOutQuad(this.t-.2, this.GEM_Y0, this.GEM_Y1-this.GEM_Y0, 1.0);
            } else if (this.t >= 1.2){
                this.gem.x = this.GEM_X1;
                this.gem.y = this.GEM_Y1;
            }
            
            //retract animation
            if (this.t-dt < 1.5 && 1.5 <= this.t){
                this.animations.play("retract");
            }
            
        } else {
            if (FullGame.HUD.messageStrs.length == 1){
                //throw gem
                this.animations.play("toss");
                
                this.threwGem = true;
            }
        }
    };
    
    
    return miner;
};

//returns made minerScared, but doesn't add it to FullGame.GI.objs (will be done in ParseObjects)
FullGame.makeMinerScared = function() {
    //initialization
    var miner = game.add.sprite(
        312, 265, //position
        "miner_scared",
        undefined, FullGame.GI.objGroup);
    miner.animations.add("idle", [0], 20, true);
    miner.animations.add("toss", [1, 2, 3, 4], 20, false);
    miner.animations.add("retract", [3, 2, 1, 0], 20, false);
    miner.animations.play("idle");
    
    miner.CC_X0 = 359;
    miner.CC_Y0 = 270;
    miner.CC_X1 = 448;
    miner.CC_Y1 = 128;
    
    miner.threwCC = false;
    miner.t = 0;
    miner.cc = null;
    
    
    if (FullGame.Vars.messagesSaid.indexOf("tightReflect") != -1){
        //conversation with miner already happened, so put gem there
        miner.cc = FullGame.makeColorchip(miner.CC_X1, miner.CC_Y1, FullGame.Til.RED, FullGame.Til.LASER_NORMAL); //copied from code in ParseObjects
        FullGame.GI.objs.push(miner.cc);
    }
    
    miner.update = function() {
        var dt = game.time.physicsElapsed;
        
        if (miner.threwCC){
            this.t += dt;
            
            if (this.t-dt < .2 && .2 <= this.t){
                //create colorChip to throw
                this.cc = FullGame.makeColorchip(this.CC_X0, this.CC_Y0, FullGame.Til.RED, FullGame.Til.LASER_NORMAL); //copied from code in ParseObjects
                FullGame.GI.objs.push(this.cc);
                //this indicates that colorChip should now be on the screen in this room
                FullGame.Vars.messagesSaid.push("tightReflect");
            }
            
            //moving colorChip
            if (.2 < this.t && this.t < 1.2){
                this.cc.startX = Math.easeInOutQuad(this.t-.2, this.CC_X0, this.CC_X1-this.CC_X0, 1.0);
                this.cc.startY = Math.easeInOutQuad(this.t-.2, this.CC_Y0, this.CC_Y1-this.CC_Y0, 1.0);
            } else if (this.t >= 1.2){
                this.cc.startX = this.CC_X1;
                this.cc.startY = this.CC_Y1;
            }
            
            //retract animation
            if (this.t-dt < 1.5 && 1.5 <= this.t){
                this.animations.play("retract");
            }
            
        } else {
            if (FullGame.HUD.messageStrs.length == 1){
                //throw colorChip
                this.animations.play("toss");
                
                this.threwCC = true;
            }
        }
    };
    
    
    return miner;
};

//returns made minerStanding, but doesn't add it to FullGame.GI.objs (will be done in ParseObjects)
FullGame.makeMinerStanding = function() {
    //initialization
    var miner = game.add.sprite(
        768, 433, //position
        "miner_standing",
        undefined, FullGame.GI.objGroup);
    miner.animations.add("idle", [0], 20, true);
    miner.animations.add("toss", [1, 2, 3, 4], 20, false);
    miner.animations.add("retract", [3, 2, 1, 0], 20, false);
    miner.animations.play("idle");
    
    miner.PC_X0 = 825;
    miner.PC_Y0 = 445;
    miner.PC_X1 = 960;
    miner.PC_Y1 = 448;
    
    miner.threwPC = false;
    miner.t = 0;
    miner.pc = null;
    
    
    if (FullGame.Vars.messagesSaid.indexOf("lastRescue") != -1){
        //conversation with miner already happened, so put gem there
        miner.pc = FullGame.makeColorchip(miner.PC_X1, miner.PC_Y1, FullGame.Til.RED, FullGame.Til.LASER_THICK); //copied from code in ParseObjects
        FullGame.GI.objs.push(miner.pc);
    }
    
    miner.update = function() {
        var dt = game.time.physicsElapsed;
        
        if (miner.threwPC){
            this.t += dt;
            
            if (this.t-dt < .2 && .2 <= this.t){
                //create powerChip to throw
                this.pc = FullGame.makeColorchip(this.PC_X0, this.PC_Y0, FullGame.Til.RED, FullGame.Til.LASER_THICK); //copied from code in ParseObjects
                FullGame.GI.objs.push(this.pc);
                //this indicates that powerChip should now be on the screen in this room
                FullGame.Vars.messagesSaid.push("lastRescue");
            }
            
            //moving powerChip
            if (.2 < this.t && this.t < 1.2){
                this.pc.startX = Math.easeInOutQuad(this.t-.2, this.PC_X0, this.PC_X1-this.PC_X0, 1.0);
                this.pc.startY = Math.easeInOutQuad(this.t-.2, this.PC_Y0, this.PC_Y1-this.PC_Y0, 1.0);
            } else if (this.t >= 1.2){
                this.pc.startX = this.PC_X1;
                this.pc.startY = this.PC_Y1;
            }
            
            //retract animation
            if (this.t-dt < 1.5 && 1.5 <= this.t){
                this.animations.play("retract");
            }
            
        } else {
            if (FullGame.HUD.messageStrs.length == 1){
                //throw powerChip
                this.animations.play("toss");
                
                this.threwPC = true;
            }
        }
    };
    
    
    return miner;
};