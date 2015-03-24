//adds space background stuff to FullGame.GI.bgGroup
FullGame.addSpaceBackground = function() {
    
    var obj = {};
    
    var bgKey = "space1";
    var dustKey1 = "dust_red1";
    var dustKey2 = "dust_red2";
    
    var bg = game.add.image(0, 0, bgKey, 0, FullGame.GI.bgGroup);
    bg.x = (FullGame.GI.worldWidth - bg.width) / 2;
    bg.y = (FullGame.GI.worldHeight - bg.height) / 2;
    bg.startX = bg.x;
    bg.startY = bg.y;
    bg.customParallaxX = 0; //so background won't move with camera at all
    bg.customParallaxY = 0;
    obj.bg = bg;
    
    obj.bgDust1 = [];
    for (var i=0; i<2; i++){
        var dust = game.add.image(0, 0, dustKey1, 0, FullGame.GI.bgGroup);
        //move with startX, startY so won't move with camera at all
        dust.startX = (FullGame.GI.worldWidth - bg.width) / 2;
        dust.startY = (FullGame.GI.worldHeight - dust.height) / 2;
        dust.customParallaxX = 0;
        dust.customParallaxY = 0;
        obj.bgDust1.push(dust);
    }
    
    obj.bgDust2 = [];
    for (var i=0; i<2; i++){
        var dust = game.add.image(0, 0, dustKey2, 0, FullGame.GI.bgGroup);
        //move with startX, startY so won't move with camera at all
        dust.startX = (FullGame.GI.worldWidth - bg.width) / 2;
        dust.startY = (FullGame.GI.worldHeight - dust.height) / 2;
        dust.customParallaxX = 0;
        dust.customParallaxY = 0;
        obj.bgDust2.push(dust);
    }
    
    obj.update = function() {
        var dt = game.time.physicsElapsed;
        
        //use startX and startY for movement, and games will take care of adjusting it to the camera
        
        //moving bg dust
        var dust1Speed = -200;
        var dust2Speed = -70;
        var dust = this.bgDust1[0];
        var w = dust.width;
        dust.startX += dust1Speed * dt;
        for (var i=1; i<this.bgDust1.length; i++){
            this.bgDust1[i].startX = this.bgDust1[i-1].startX + w;
        }
        if (dust.startX+w < (FullGame.GI.worldWidth - bg.width) / 2){
            this.bgDust1.shift();
            dust.startX = this.bgDust1[this.bgDust1.length-1].startX + w;
            this.bgDust1.push(dust);
        }
        
        dust = this.bgDust2[0];
        w = dust.width;
        dust.startX += dust2Speed * dt;
        for (var i=1; i<this.bgDust2.length; i++){
            this.bgDust2[i].startX = this.bgDust2[i-1].startX + w;
        }
        if (dust.startX+w < (FullGame.GI.worldWidth - bg.width) / 2){
            this.bgDust2.shift();
            dust.startX = this.bgDust2[this.bgDust2.length-1].startX + w;
            this.bgDust2.push(dust);
        }
        
        
        /*
        dust = this.bgDust2[0];
        w = dust.width;
        dust.x += dust2Speed * dt;
        for (var i=1; i<this.bgDust2.length; i++){
            this.bgDust2[i].x = this.bgDust2[i-1].x + w;
        }
        if (dust.x+w < 0){
            this.bgDust2.shift();
            dust.x = this.bgDust2[this.bgDust2.length-1].x + w;
            this.bgDust2.push(dust);
        }*/
        
    };
    
    
    FullGame.GI.miscObjs.push(obj);
    
};