//returns made finalBoss, but doesn't add it to FullGame.GI.objs (will be done in ParseObjects)
FullGame.makeFinalBoss = function(cx, cy) {
    
    var fb;
    
    fb = game.add.sprite(cx, cy, "final_boss", undefined, FullGame.GI.objGroup);
    fb.CENTER_X = 517/2.0;
    fb.CENTER_Y = 402/2.0;
    fb.anchor.setTo(fb.CENTER_X / 517, fb.CENTER_Y / 402); //sprite is centered
    fb.dead = false;
    
    var cHead = FullGame.Til.RED;
    fb.laserLines = [];
    fb.baseLaserLines = [
        {x0:60, y0:137, x1:85, y1:20, color:cHead},
        {x0:85, y0:20, x1:245, y1:68, color:cHead},
        {x0:245, y0:68, x1:270, y1:68, color:cHead},
        {x0:270, y0:68, x1:430, y1:20, color:cHead},
        {x0:430, y0:20, x1:455, y1:137, color:cHead}
    ];
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
            this.laserLines[i].color = bll.color;
        }
        
    };
    fb.setLaserLines();
    
    fb.update = function() {
        var dt = game.time.physicsElapsed;
        var plr = FullGame.GI.player;
        
        this.setLaserLines();
    };
    
    fb.afterCollision = function() {
        var dt = game.time.physicsElapsed;
        var plr = FullGame.GI.player;
        
    };
    
    return fb;
    
};