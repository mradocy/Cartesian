//converts object data from Tiled map into an actual game object
FullGame.parseObjectsInTiledObjectgroup = function(data, groupTo){
    //console.log(data);
    for (var i=0; i<data.objects.length; i++){
        var od = data.objects[i];
        var obj;
        var type = od.type;
        var x = od.x;
        var y = od.y;
        var width = od.width;
        var height = od.height;
        var cx = x + width/2;
        var cy = y + height/2;
        
        if (type == "OrbRed" || type == "OrbBlue" || type == "OrbGreen"){
            var color = FullGame.Til.RED;
            if (type == "OrbRed"){
                color = FullGame.Til.RED;
            } else if (type == "OrbBlue"){
                color = FullGame.Til.BLUE;
            } else if (type == "OrbGreen"){
                color = FullGame.Til.GREEN;
            }
            obj = FullGame.makeOrb(game, color);
            obj.orb.setX(cx);
            obj.orb.setY(cy);
            FullGame.GI.objs.push(obj.glow);
            FullGame.GI.objs.push(obj.orb);
            FullGame.GI.orbs.push(obj.orb);
            
        } else if (type == "DoorRed" || type == "DoorBlue" ||
                   type == "DoorGreen" || type == "DoorBlack"){ //have box be wider than it is tall to put the door on its side
            var color = FullGame.Til.RED;
            if (type == "DoorRed"){
                color = FullGame.Til.RED;
            } else if (type == "DoorBlue"){
                color = FullGame.Til.BLUE;
            } else if (type == "DoorGreen"){
                color = FullGame.Til.GREEN;
            } else if (type == "DoorBlack"){
                color = FullGame.Til.BLACK;
            }
            var autoClose = false;
            var cannotOpen = false;
            if (od.properties != undefined){
                if (od.properties.autoClose != undefined)
                    autoClose = (od.properties.autoClose == "true");
                if (od.properties.cannotOpen != undefined)
                    cannotOpen = (od.properties.cannotOpen == "true");
            }
            obj = FullGame.makeDoor(game, (width > height), color, autoClose);
            obj.door1.setX(cx);
            obj.door1.setY(cy);
            obj.door1.cannotOpen = cannotOpen;
            FullGame.GI.objs.push(obj.door1);
            FullGame.GI.objs.push(obj.door2); //this is required for lasers to hit door2
            
        } else if (type == "ShooterRed" || type == "ShooterBlue" || type == "ShooterGreen" || type == "ShooterBlack"){
            var laserColor = FullGame.Til.RED;
            var laserType;
            if (type == "ShooterRed"){
                laserColor = FullGame.Til.RED;
            } else if (type == "ShooterBlue"){
                laserColor = FullGame.Til.BLUE;
            } else if (type == "ShooterGreen"){
                laserColor = FullGame.Til.GREEN;
            } else if (type == "ShooterBlack"){
                laserColor = FullGame.Til.BLACK;
            }
            laserType = FullGame.Til.LASER_NORMAL;
            if (od.properties != undefined && od.properties.type != undefined){
                if (od.properties.type == "transparent")
                    laserType = FullGame.Til.LASER_TRANSPARENT;
                else if (od.properties.type == "thick")
                    laserType = FullGame.Til.LASER_THICK;
            }
            
            if (od.polyline == undefined || od.polyline.length != 2){
                console.log("WARNING: shooter needs to be a polyline with 2 points in Tiled");
                continue;
            }
            var x0 = x + Number(od.polyline[0].x);
            var y0 = y + Number(od.polyline[0].y);
            var x1 = x + Number(od.polyline[1].x);
            var y1 = y + Number(od.polyline[1].y);
            var heading = Math.atan2(y1-y0, x1-x0);
            
            var mobile = false;
            if (od.properties != undefined && od.properties.mobile != undefined)
                mobile = (od.properties.mobile == "true");
            
            obj = FullGame.makeShooter(x0, y0, heading, laserColor, laserType, mobile);
            if (od.properties != undefined){
                if (od.properties.path != undefined)
                    obj.pathName = od.properties.path;
                if (od.properties.speed != undefined)
                    obj.speed = Number(od.properties.speed);
                if (od.properties.accel != undefined)
                    obj.accel = Number(od.properties.accel);
                if (od.properties.rotationSpeed != undefined)
                    obj.rotationSpeed = Number(od.properties.rotationSpeed) *Math.PI/180;
                if (od.properties.rotationMin != undefined)
                    obj.rotationMin = Number(od.properties.rotationMin) *Math.PI/180;
                if (od.properties.rotationMax != undefined)
                    obj.rotationMax = Number(od.properties.rotationMax) *Math.PI/180;
                if (od.properties.rotationAccel != undefined)
                    obj.rotationAccel = Number(od.properties.rotationAccel) *Math.PI/180;
            }
            FullGame.GI.objs.push(obj);
            
        } else if (type == "Spring"){
            obj = FullGame.makeSpring(cx, cy);
            FullGame.GI.objs.push(obj);
            
        } else if (type == "SmallStar"){
            game.add.image(cx, cy, "small_star", undefined, FullGame.GI.frontGroup);
            
        } else if (type == "MediumStar"){
            obj = game.add.image(cx, cy, "medium_star", undefined, FullGame.GI.frontGroup);
            obj.anchor.setTo(.5, .5); //sprite is centered
            
        } else if (type == "Path" || type == "AlienPath"){
            
            var points;
            var loop = false;
            if (od.polygon != undefined){
                points = od.polygon;
                loop = true;
            } else if (od.polyline != undefined){
                points = od.polyline;
                loop = false;
            } else {
                console.log(type + " object needs to be a polygon or polyline");
                continue;
            }
            var pts = [];
            for (var j=0; j<points.length; j++){
                pts.push({x:(x+points[j].x), y:(y+points[j].y)});
            }
            
            if (type == "Path"){
                obj = FullGame.makePath(od.name, pts, loop);
                FullGame.GI.objs.push(obj);
            } else if (type == "AlienPath"){
                FullGame.AlienPath.addPolyline(pts, loop);
            }
            
        } else if (type == "EyebotRed" || type == "EyebotBlue" || type == "EyebotGreen"){
            
            var color = FullGame.Til.RED;
            if (type == "EyebotRed"){
                color = FullGame.Til.RED;
            } else if (type == "EyebotBlue"){
                color = FullGame.Til.BLUE;
            } else if (type == "EyebotGreen"){
                color = FullGame.Til.GREEN;
            }
            
            var coating = "normal";
            if (od.properties != undefined){
                if (od.properties.coating != undefined)
                    coating = od.properties.coating;
            }
            
            obj = FullGame.makeEyebot(cx, cy, color, coating);
            FullGame.GI.objs.push(obj);
            FullGame.GI.eyebots.push(obj);
            
        } else if (type == "RoplateRed" || type == "RoplateBlue" || type == "RoplateGreen"){
            
            var color1 = FullGame.Til.RED;
            var color2 = FullGame.Til.BLACK;
            if (type == "RoplateRed"){
                color1 = FullGame.Til.RED;
            } else if (type == "RoplateBlue"){
                color1 = FullGame.Til.BLUE;
            } else if (type == "RoplateGreen"){
                color1 = FullGame.Til.GREEN;
            }
            
            if (od.properties != undefined){
                if (od.properties.color2 != undefined){
                    
                }
            }
            
            var x0, y0, x1, y1;
            if ((od.polygon == undefined || od.polygon.length < 2) &&
                (od.polyline == undefined || od.polyline.length < 2)){
                console.log("WARNING: roplate needs to be a polylgon or polyline with at least 2 points in Tiled");
                continue;
            }
            if (od.polygon != undefined){
                x0 = x + Number(od.polygon[0].x);
                y0 = y + Number(od.polygon[0].y);
                x1 = x + Number(od.polygon[1].x);
                y1 = y + Number(od.polygon[1].y);
            } else {
                x0 = x + Number(od.polyline[0].x);
                y0 = y + Number(od.polyline[0].y);
                x1 = x + Number(od.polyline[1].x);
                y1 = y + Number(od.polyline[1].y);
            }
            cx = (x0 + x1) / 2;
            cy = (y0 + y1) / 2;
            var rotation = Math.atan2(y1-y0, x1-x0);
            
            obj = FullGame.makeRoplate(cx, cy, rotation, color1, color2);
            FullGame.GI.objs.push(obj);
            
        } else if (type == "ColorchipRed" || type == "ColorchipBlue" || type == "ColorchipGreen"){
            var color = FullGame.Til.BLUE;
            var laserType = FullGame.Til.LASER_NORMAL;
            if (type == "ColorchipRed"){
                color = FullGame.Til.RED;
            } else if (type == "ColorchipGreen"){
                color = FullGame.Til.GREEN;
            } else if (type == "ColorchipBlue"){
                color = FullGame.Til.BLUE;
            }
            obj = FullGame.makeColorchip(cx, cy, color, laserType);
            FullGame.GI.objs.push(obj);
            
        } else if (type == "Alien" || type == "AlienRed"){
            //do not add alien if already defeated it
            if (FullGame.rooms.indexOf(FullGame.Vars.lastMap) <
                FullGame.rooms.indexOf(FullGame.Vars.startMap)){
                
                var color = FullGame.Til.RED;
                if (type == "AlienRed"){
                    color = FullGame.Til.RED;
                }
                obj = FullGame.makeAlien(cx, cy, color);
                FullGame.GI.objs.push(obj);
                FullGame.GI.objs.push(obj.eyes);
                FullGame.GI.objs.push(obj.backHand);
                FullGame.GI.objs.push(obj.frontHand);
            }
            
        } else if (type == "GemRed" || type == "GemBlue" || type == "GemGreen"){
            var color = FullGame.Til.RED;
            if (type == "GemRed"){
                color = FullGame.Til.RED;
            } else if (type == "GemBlue"){
                color = FullGame.Til.BLUE;
            } else if (type == "GemGreen"){
                color = FullGame.Til.GREEN;
            }
            obj = FullGame.makeGem(cx, cy, color);
            FullGame.GI.objs.push(obj);
            FullGame.GI.gems.push(obj);
            
        } else if (type == "MinerSitting"){
            obj = FullGame.makeMinerSitting();
            FullGame.GI.objs.push(obj);
            
        } else if (type == "SliderRed" || type == "SliderBlue" || type == "SliderGreen"){
            var color = FullGame.Til.RED;
            if (type == "SliderRed"){
                color = FullGame.Til.RED;
            } else if (type == "SliderBlue"){
                color = FullGame.Til.BLUE;
            } else if (type == "SliderGreen"){
                color = FullGame.Til.GREEN;
            }
            obj = FullGame.makeSlider(cx, cy, color);
            if (od.properties != undefined){
                if (od.properties.path != undefined)
                    obj.pathName = od.properties.path;
            }
            FullGame.GI.objs.push(obj);
            
        } else if (type == "Portal"){
            var portalTo = "";
            var mapTo = "";
            var goRight = true;
            if (od.properties != undefined){
                if (od.properties.portalTo != undefined)
                    portalTo = od.properties.portalTo;
                if (od.properties.mapTo != undefined)
                    mapTo = od.properties.mapTo;
                if (od.properties.right != undefined)
                    goRight = (od.properties.right == "right");
            }
            obj = FullGame.makePortal(cx, cy, od.name, portalTo, mapTo);
            FullGame.GI.objs.push(obj);
            FullGame.GI.portals.push(obj);
            
            if (mapTo == FullGame.Vars.lastMap){
                //this is the Portal player entered from, so set properties for player starting
                if (goRight)
                    FullGame.Vars.startBehavior = "walkRight";
                else
                    FullGame.Vars.startBehavior = "walkLeft";
                FullGame.Vars.startX = cx;
                FullGame.Vars.startY = cy;
            }
            
        } else if (type == "Exit"){
            if (od.properties == undefined){
                console.log("WARNING: need to have properties when making an Exit object in Tiled");
                continue;
            }
            var noSensor = false;
            if (od.properties.noSensor != undefined) noSensor = (od.properties.noSensor == "true");
            var mapTo = "";
            if (od.properties.mapTo != undefined) mapTo = od.properties.mapTo;
            if (!noSensor && mapTo == ""){
                console.log("WARNING: In Tiled object Exit need to define 'mapTo' or set 'noSensor' to true");
                continue;
            }
            var sY = y + height - 24;
            if (!noSensor){
                //make exit
                var plrBehavior = "none";
                if (x < FullGame.GI.tileWidth){
                    plrBehavior = "walkLeft";
                } else if (x+width > FullGame.GI.worldWidth - FullGame.GI.tileWidth){
                    plrBehavior = "walkRight";
                } else if (y < FullGame.GI.tileHeight){
                    var right = true;
                    if (od.properties.right != undefined)
                        right = !(od.properties.right == "false");
                    var springJump = false;
                    if (od.properties.springJump != undefined)
                        springJump = (od.properties.springJump == "true");
                    if (right){
                        if (springJump){
                            plrBehavior = "springJumpRight";
                        } else {
                            plrBehavior = "jumpRight";
                        }
                    } else {
                        if (springJump){
                            plrBehavior = "springJumpLeft";
                        } else {
                            plrBehavior = "jumpLeft";
                        }
                    }
                } else if (y+height > FullGame.GI.worldHeight - FullGame.GI.tileHeight){
                    plrBehavior = "fall";
                } else {
                    plrBehavior = "none";
                }
                
                var exit = FullGame.makeExit(x, y, width, height, plrBehavior, mapTo);
                FullGame.GI.miscObjs.push(exit);
                
            }
            
            if (mapTo == FullGame.Vars.lastMap){
                //this is the Exit player entered from, so set properties for player starting
                if (x < FullGame.GI.tileWidth){
                    FullGame.Vars.startBehavior = "walkRight";
                    FullGame.Vars.startX = x +10;
                    FullGame.Vars.startY = sY -10;
                } else if (x+width > FullGame.GI.worldWidth - FullGame.GI.tileWidth){
                    FullGame.Vars.startBehavior = "walkLeft";
                    FullGame.Vars.startX = x + width -10;
                    FullGame.Vars.startY = sY -10;
                } else if (y < FullGame.GI.tileHeight){
                    FullGame.Vars.startBehavior = "fall";
                    FullGame.Vars.startX = x + width/2;
                    FullGame.Vars.startY = sY-height/2;
                } else if (y+height > FullGame.GI.worldHeight - FullGame.GI.tileHeight){
                    var right = true;
                    if (od.properties != undefined && od.properties.right != undefined)
                        right = !(od.properties.right == "false");
                    var springJump = false;
                    if (od.properties != undefined && od.properties.springJump != undefined)
                        springJump = (od.properties.springJump == "true");
                    if (right){
                        if (springJump){
                            FullGame.Vars.startBehavior = "springJumpRight";
                        } else {
                            FullGame.Vars.startBehavior = "jumpRight";
                        }
                    } else {
                        if (springJump){
                            FullGame.Vars.startBehavior = "springJumpLeft";
                        } else {
                            FullGame.Vars.startBehavior = "jumpLeft";
                        }
                    }
                    FullGame.Vars.startX = x + width/2;
                    FullGame.Vars.startY = sY + 24;
                } else {
                    FullGame.Vars.startBehavior = "none";
                    FullGame.Vars.startX = x + width/2;
                    FullGame.Vars.startY = sY;
                }
            }
            
        } else if (type == "") {
            console.log("WARNING: Object in Tiled has no type");
        } else {
            console.log("WARNING: Object in Tiled with type " + type + " currently cannot be used");
        }
    }
    
};