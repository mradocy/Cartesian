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
        
    };
    
    
    FullGame.GI.miscObjs.push(obj);
    
};


//adds background stuff to FullGame.GI.bgGroup
FullGame.addSandParticles = function() {
    
    var obj = {
        
        key:"sand_parts",
        parts:[],
        recycledParts:[],
        time:0,
        nextSpawn:(1*Math.random()),
        
        makePart:function() {
            var part = null;
            if (this.recycledParts.length > 0){
                part = this.recycledParts.pop();
                part.visible = true;
            } else {
                part = game.add.sprite(0, 0, this.key, undefined, FullGame.GI.bgGroup);
                part.anchor.setTo(.5, .5); //sprite is centered
            }
            part.animations.frame = Math.floor(Math.random()*5);
            part.rotation = Math.PI*2 * Math.random();
            
            part.startX = FullGame.GI.worldWidth * Math.random();
            part.startY = 0;
            part.vy = 100;
            part.ay = 100;
            part.vx = 0;
            part.ax = 0;
            part.vr = Math.random() * 4;
            
            this.parts.push(part);
            return part;
        },
        
        update:function() {
            var dt = game.time.physicsElapsed;
            //use startX and startY for movement, and games will take care of adjusting it to the camera
            
            //spawn parts
            this.time += dt;
            if (this.time >= this.nextSpawn){
                this.makePart();
                
                this.time = 0;
                this.nextSpawn = (.5 + Math.random()) * 2000/FullGame.GI.worldWidth;
            }
            
            //move parts
            for (var i=0; i<this.parts.length; i++){
                var part = this.parts[i];
                
                part.vx += part.ax * dt;
                part.vy += part.ay * dt;
                part.startX += part.vx * dt;
                part.startY += part.vy * dt;
                part.rotation += part.vr * dt;
                
                if (part.startY > FullGame.GI.worldHeight){
                    part.visible = false;
                    this.recycledParts.push(part);
                    this.parts.splice(i, 1);
                    i--;
                }
            }
            
        }
        
    };
    
    FullGame.GI.miscObjs.push(obj);
    
};