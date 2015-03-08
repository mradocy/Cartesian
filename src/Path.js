//returns made path, but doesn't add it to FullGame.GI.objs (will be done in ParseObjects)
//points is array of {x, y}, loop is boolean
FullGame.makePath = function(name, points, loop) {
    
    var p = {};
    p.SPRITE_INTERVAL = 32;
    p.spriteKey = "mobile_shooter_path";
    p.name = name;
    p.isPath = true;
    p.points = [];
    p.loop = loop;
    for (var i=0; i<points.length; i++){
        //d is distance to next point
        p.points.push({x:(points[i].x), y:(points[i].y), d:0});
    }
    if (p.points.length < 2){
        console.log("ERROR: Path must have at least 2 points");
        return;
    }
    p.startX = p.points[0].x;
    p.startY = p.points[0].y;
    
    //finding d values for points
    p.totalDist = 0;
    for (i=0; i<p.points.length; i++){
        var p0 = p.points[i];
        var p1;
        if (i < p.points.length-1){
            p1 = p.points[i+1];
        } else if (p.loop){
            p1 = p.points[0];
        } else {
            continue;
        }
        p0.d = Math.sqrt((p1.x-p0.x)*(p1.x-p0.x) + (p1.y-p0.y)*(p1.y-p0.y));
        p.totalDist += p0.d;
    }
    
    /* dist is the distance from the first point down the list.
     * if this.loop, then dist will cycle around if it's too big.
     * if not, position will NOT turn the other way */
    p.positionFromDist = function(dist) {
        var cycles = Math.floor(dist / this.totalDist);
        var d = dist - cycles*this.totalDist;
        /*if (!this.loop && cycles % 2 == 1){
            d = this.totalDist - d; //since when not loop, goes in reverse
        }*/
        if (!this.loop){
            d = Math.max(0, Math.min(this.totalDist-.1, dist));
        }
        
        var tot = 0;
        var ret = {x:0, y:0};
        for (var i=0; i<this.points.length; i++){
            if (i >= this.points.length-1 && !loop){
                //this shouldn't happen
                ret.x = this.points[this.points.length-1].x;
                ret.y = this.points[this.points.length-1].y;
                return ret;
            }
            if (i >= this.points.length && loop){
                //this shouldn't happen
                ret.x = this.points[0].x;
                ret.y = this.points[0].y;
                return ret;
            }
            var p0 = this.points[i];
            var p1;
            if (i == this.points.length-1 && loop)
                p1 = this.points[0];
            else 
                p1 = this.points[i+1];
            if (tot <= d && d < tot+p0.d){
                ret.x = p0.x + (p1.x - p0.x) * (d - tot) / p0.d;
                ret.y = p0.y + (p1.y - p0.y) * (d - tot) / p0.d;
                return ret;
            } else {
                tot += p0.d;
            }
        }
        
    };
    
    
    
    
    
    p.makeSprites = function() {
        for (var d=0; d <= this.totalDist; ){
            var pt = this.positionFromDist(d);
            var img = game.add.image(pt.x, pt.y, this.spriteKey, 0, FullGame.GI.backTileGroup);
            img.anchor.setTo(.5, .5); //sprite is centered
            
            if (d == this.totalDist) break;
            d = Math.min(d+this.SPRITE_INTERVAL, this.totalDist);
        }
    };
    
    p.makeSprites();
    
    return p;
    
};
