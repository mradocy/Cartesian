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