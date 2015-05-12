FullGame.Game = function (game) {
    
    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
    
    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)
    
    
};

FullGame.GI = null; //game instance

FullGame.Game.prototype = {
    
    tileMap:null, //TileMap of the current map, from Tiled
    mapJSON:null, //JSON object with properties used to make the map, form Tiled
    tileWidth:0,
    tileHeight:0,
    worldWidth:0,
    worldHeight:0,
    bgGroup:null,
    backTileGroup:null,
    objGroup:null,
    laserGroup:null,
    tileGroup:null,
    frontGroup:null,
    objs:[], //array of all the objects to be looped through
    player:null, //the player
    orbs:[], //array of orbs in the level
    eyebots:[], //array of eyebots in the level
    gems:[], //array of gems in the level
    portals:[], //array of portals in the level
    miscObjs:[], //array of objects that don't get update() called by Phaser (so we call their update() instead)
    bgMusic:"",
    pauseObj:null, //object for pauseUpdate() to be called during the pause update phase
    tileLayer:null, //TilemapLayer for tileGroup, used for collision
    backTileLayer:null, //TilemapLayer for backTileGroup, NOT used for collision
    tileCols:[], //2D array of strings (convert with FullGame.Til) representing the tiles
    laserG:null, //graphics object used to render the lasers
    tilesPressuredThisFrame:[], //add coordinates in string format of tiles that are getting pressured (will break soon)
    destroyTileCounters:{}, //map of string->number, where key is coordinates of a sand tile, and number is time since it's been hit by a laser
    hudGroup:null, //group to display HUD elements (like the reticle)
    timeSinceLevelStart:0.0,
    
    preload: function () {
        FullGame.GI = this;
        //making tilemap from the already loaded JSON file
        var mapKey = game.state.current;
        game.load.tilemap(mapKey, null, game.cache.getJSON(mapKey), Phaser.Tilemap.TILED_JSON);
    },
    
    create: function () {
        /* map will be created from the bottom up.
         * 0. bgGroup - Group of images with parallax implementation; does not follow camera conventionally
         * 1. backTileGroup - Group that contains the backTile TilemapLayer
         * 2. objGroup - Group of objects with collision, including the Player, orbs, switches, etc.
         *      - player
         *      - objs []
         * 3. laserGroup - Group that contains the Graphics for the lasers, and for laser particle effects
         *      - laserG
         * 4. tileGroup - Group that contains the main TilemapLayer, and animations for tiles breaking, etc.
         *      - map
         * 5. frontGroup - Group that contains misc. objects in the front with no collision
         * X. HUD - the HUD.  This should be added to the Stage anyway
         *      - reticle
        */
        
        this.bgGroup = game.add.group(undefined, "bgGroup", false, false);
        this.backTileGroup = game.add.group(undefined, "backTileGroup", false, false);
        this.objGroup = game.add.group(undefined, "objGroup", false);
        this.laserGroup = game.add.group(undefined, "laserGroup", false, false);
        this.tileGroup = game.add.group(undefined, "tileGroup", false);
        this.frontGroup = game.add.group(undefined, "frontGroup", false, false);
        
        // getting the map
        var mapKey = game.state.current; //name of current state is which map to load
        this.tileMap = game.add.tilemap(mapKey); // the Loader key given in game.load.tilemap
        this.mapJSON = game.cache.getJSON(mapKey);
        this.tileWidth = this.mapJSON.tilewidth;
        this.tileHeight = this.mapJSON.tileheight;
        this.worldWidth = this.mapJSON.width*this.tileWidth;
        this.worldHeight = this.mapJSON.height*this.tileHeight;
        this.tilesPressuredThisFrame = [];
        this.destroyTileCounters = {};
        
        
        // background music
        var music = "";
        if (this.mapJSON.properties != undefined){
            var props = this.mapJSON.properties;
            if (props.music != undefined){
                music = props.music;
            }
        }
        this.bgMusic = music;
        if (!FullGame.Vars.musicMuted){
            if (this.bgMusic == ""){
                FullGame.stopMusic();
            } else if (FullGame.currentMusicPlaying == "" ||
                FullGame.currentMusicPlaying != this.bgMusic ||
                FullGame.currentMusicFadingOut){
                FullGame.playMusic(this.bgMusic, FullGame.HUD.BLACK_SCREEN_FADE_DURATION);
            }
        }
        
        // adding background images
        this.bgGroup.parallaxX = 1;
        this.bgGroup.parallaxY = 1;
        if (this.mapJSON.properties != undefined){
            var props = this.mapJSON.properties;
            var bg;
            if (props.bg != undefined){
                
                //add space back-background for some bgs
                if (props.bg == "bg_top"){
                    FullGame.addSpaceBackground();
                } else if (props.bg == "bg1"){
                    FullGame.addSandParticles();
                } else if (props.bg == "bg_white"){
                    FullGame.addWhiteThings();
                }
                
                if (props.bgParallaxX == undefined) this.bgGroup.parallaxX = 1;
                else this.bgGroup.parallaxX = Number(props.bgParallaxX);
                if (props.bgParallaxY == undefined) this.bgGroup.parallaxY = 1;
                else this.bgGroup.parallaxY = Number(props.bgParallaxY);
                
                if (FullGame.Vars.screenshotMode){
                    this.bgGroup.parallaxX = 1;
                    this.bgGroup.parallaxY = 1;
                }
                
                //get enough images to tile the background
                for (var w=0; w < this.worldWidth; w += bg.width){
                    for (var h=0; h < this.worldHeight; h += bg.height){
                        bg = game.add.image(w, h, props.bg, 0, this.bgGroup);
                        bg.x = w - (bg.width * Math.ceil(this.worldWidth / bg.width) - this.worldWidth) / 2;
                        bg.y = h - (bg.height * Math.ceil(this.worldHeight / bg.height) - this.worldHeight) / 2;
                        bg.startX = bg.x;
                        bg.startY = bg.y;
                    }
                }
            }
        }
        
        // adding tileset images
        for (var i=0; i<this.mapJSON.tilesets.length; i++){
            var imgPath = this.mapJSON.tilesets[i].image;
            var index = Math.max(imgPath.lastIndexOf("/")+1, imgPath.lastIndexOf("\\")+1);
            var extIndex = imgPath.lastIndexOf(".");
            var imgName = imgPath.substring(index, extIndex);
            /* param 1: the tileset name as specified in the Tiled map
             * param 2: key of the Phaser.Cache image used for this tileset */
            this.tileMap.addTilesetImage(imgName, imgName);
        }
        
        // Creates layers from the layers specified in Tiled.
        for (i=0; i<this.mapJSON.layers.length; i++){
            var layerName = this.mapJSON.layers[i].name;
            var layerType = this.mapJSON.layers[i].type;
            if (layerName == "backTile"){
                if (layerType == "tilelayer"){
                    this.backTileLayer = this.tileMap.createLayer(layerName, undefined, undefined, this.backTileGroup);
                    if (game.device.safari || game.device.mobileSafari){
                        this.backTileLayer.enableScrollData = false;
                    }
                } else {
                    console.log("ERROR: Tiled layer '" + layerName + "' should be of type tilelayer");
                }
            } else if (layerName == "obj"){
                if (layerType == "objectgroup"){
                    FullGame.parseObjectsInTiledObjectgroup(this.mapJSON.layers[i], this.objGroup);
                } else {
                    console.log("ERROR: Tiled layer '" + layerName + "' should be of type objectgroup");
                }
            } else if (layerName == "tile"){
                if (layerType == "tilelayer"){
                    this.tileLayer = this.tileMap.createLayer(layerName, undefined, undefined, this.tileGroup);
                    if (game.device.safari || game.device.mobileSafari){
                        this.tileLayer.enableScrollData = false;
                    }
                } else {
                    console.log("ERROR: Tiled layer '" + layerName + "' should be of type tilelayer");
                }
            } else if (layerName == "front"){
                if (layerType == "objectgroup"){
                    FullGame.parseObjectsInTiledObjectgroup(this.mapJSON.layers[i], this.frontGroup);
                } else {
                    console.log("ERROR: Tiled layer '" + layerName + "' should be of type objectgroup");
                }
            } else {
                console.log("ERROR: Tiled layer cannot have name '" + layerName + "'.  The only accepted layers are, in order from back to front: 'backTile' (optional), 'obj', 'tile', 'front' (optional)");
            }
        }
        this.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.camera.bounds = null; //allows better camera movement
        
        
        // collision
        this.tileCols = [];
        for (i=0; i<this.mapJSON.width; i++){
            var col = [];
            for (var j=0; j<this.mapJSON.height; j++){
                col.push('');
            }
            this.tileCols.push(col);
        }
        var setCollisionIndexes = []; //temp array for indexes of tiles with collision
        for (i=0; i<this.mapJSON.layers.length; i++){
            if (this.mapJSON.layers[i].name != "tile") continue;
            var gid = 0;
            var id = 0;
            var ts; //tileset
            var tp;
            var type = FullGame.Til.NO_COL;
            var topColor = FullGame.Til.BLACK;
            var rightColor = FullGame.Til.BLACK;
            var bottomColor = FullGame.Til.BLACK;
            var leftColor = FullGame.Til.BLACK;
            for (var n=0; n<this.mapJSON.layers[i].data.length; n++){
                gid = this.mapJSON.layers[i].data[n];
                if (gid == 0) continue; //no collision for no tile
                //get info about tile with that gid
                var j = this.mapJSON.tilesets.length-1;
                for ( ; j>=0; j--){
                    if (this.mapJSON.tilesets[j].firstgid > gid)
                        continue; //wrong tileset
                    else break;
                }
                ts = this.mapJSON.tilesets[j];
                id = gid - ts.firstgid;
                if (ts.properties.allType == undefined) type = FullGame.Til.NO_COL;
                else type = parseInt(ts.properties.allType);
                if (ts.properties.allColor == undefined) topColor = FullGame.Til.BLACK;
                else topColor = parseInt(ts.properties.allColor);
                rightColor = topColor;
                bottomColor = topColor;
                leftColor = topColor;
                if (ts.properties.allTopColor != undefined) topColor = parseInt(ts.properties.allTopColor);
                if (ts.properties.allRightColor != undefined) rightColor = parseInt(ts.properties.allRightColor);
                if (ts.properties.allBottomColor != undefined) bottomColor = parseInt(ts.properties.allBottomColor);
                if (ts.properties.allLeftColor != undefined) leftColor = parseInt(ts.properties.allLeftColor);
                if (ts.tileproperties != undefined){
                    tp = ts.tileproperties;
                    if (tp[""+id] != undefined){
                        tp = tp[""+id];
                        if (tp.type != undefined) type = parseInt(tp.type);
                        if (tp.color != undefined) {
                            topColor = parseInt(tp.color);
                            rightColor = topColor;
                            bottomColor = topColor;
                            leftColor = topColor;
                        }
                        if (tp.topColor != undefined) topColor = parseInt(tp.topColor);
                        if (tp.rightColor != undefined) rightColor = parseInt(tp.rightColor);
                        if (tp.bottomColor != undefined) bottomColor = parseInt(tp.bottomColor);
                        if (tp.leftColor != undefined) leftColor = parseInt(tp.leftColor);
                    }
                }
                
                this.tileCols[n % this.mapJSON.width][Math.floor(n / this.mapJSON.width)] =
                    FullGame.Til.propToString(type, topColor, rightColor, bottomColor, leftColor);
                
                if (type != FullGame.Til.NO_COL){
                    setCollisionIndexes.push(gid);
                }
            }
        }
        /* param1: index
         * param2: collides (true or false)
         * param3: the layer to operate on
         * param4: (bool) recalculate tile faces after the update */
        this.tileMap.setCollision(setCollisionIndexes, true, "tile", true);
        this.physics.arcade.TILE_BIAS = 50;//100;
        game.physics.arcade.OVERLAP_BIAS = 15; //original value is 4
        //this.tileLayer.debug = true;
        
        // images from tilesets
        for (i=0; i<this.mapJSON.tilesets.length; i++){
            var ts = this.mapJSON.tilesets[i];
            
            var imgPath = this.mapJSON.tilesets[i].image;
            var index = Math.max(imgPath.lastIndexOf("/")+1, imgPath.lastIndexOf("\\")+1);
            var extIndex = imgPath.lastIndexOf(".");
            var imgName = imgPath.substring(index, extIndex);
            /* param 1: the tileset name as specified in the Tiled map
             * param 2: key of the Phaser.Cache image used for this tileset */
            this.tileMap.addTilesetImage(imgName, imgName);
        }
        
        game.stage.backgroundColor = '#787878';
        
        
        //making player
        this.player = FullGame.makePlayer(game);
        this.objs.push(this.player);
        
        //making lasers
        this.laserG = FullGame.Lasers.makeGraphics();
        
        //making hud
        this.hudGroup = FullGame.HUD.makeGroup();
        
    },
    
    update: function() {
        FullGame.Keys.refresh();
        
        var dt = game.time.physicsElapsed;
        FullGame.Vars.totalPlayTime += dt;
        this.timeSinceLevelStart += dt;
        
        if (this.timeSinceLevelStart-dt < FullGame.Messages.LEVEL_START_MESSAGE_DELAY &&
            this.timeSinceLevelStart >= FullGame.Messages.LEVEL_START_MESSAGE_DELAY &&
            !FullGame.HUD.blackScreen.visible){
            FullGame.Messages.onLevelStart();
        }
        if (this.timeSinceLevelStart-dt < FullGame.Messages.PUZZLE_STUCK_DURATION &&
            this.timeSinceLevelStart >= FullGame.Messages.PUZZLE_STUCK_DURATION){
            FullGame.Messages.onPlayerStuck();
        }
        
        
        
        for (var i=0; i<this.objs.length; i++){
            var obj = this.objs[i];
            //obj.update() is called by phaser already
            
        }
        //miscObjs are not part of Phaser, so otherwise they wouldn't get a chance to have update() called
        for (i=0; i<this.miscObjs.length; i++){
            var obj = this.miscObjs[i];
            if (obj.update != undefined)
                obj.update();
        }
        
        
        this.game.physics.arcade.collide(this.objGroup, this.objGroup);
        
        this.game.physics.arcade.collide(this.player, this.tileLayer);
        
        for (var i=0; i<this.objs.length; i++){
            if (this.objs[i].afterCollision != undefined)
                this.objs[i].afterCollision();
        }
        
        FullGame.HUD.update();
        
        FullGame.Lasers.updateGraphics();
        
        //update tiles being destroyed by lasers
        for (i=0; i<this.tilesPressuredThisFrame.length; i++){
            var coords = this.tilesPressuredThisFrame[i];
            if (this.destroyTileCounters[coords] == undefined){
                this.destroyTileCounters[coords] = .0001;
            }
        }
        var playSandCrumbleSFX = false;
        for (var key in this.destroyTileCounters) {
            this.destroyTileCounters[key] += dt;
            if (this.destroyTileCounters[key] >= FullGame.Til.TILE_DESTROY_DURATION){
                //time for tile to be destroyed
                var x = 0;
                var y = 0;
                var index = key.indexOf(",");
                x = Number(key.substring(0, index));
                y = Number(key.substring(index+1));
                var tileStr = this.tileCols[x][y];
                if (tileStr != ""){
                    this.removeTile(x, y);
                    if (FullGame.Til.tileType(tileStr) == FullGame.Til.SAND){
                        //sand destroy effect
                        var ef = game.add.sprite((x+.5)*this.tileWidth, (y+.5)*this.tileHeight, "sand_crumble", undefined, FullGame.GI.objGroup);
                        ef.animations.add("destroy", [1, 2, 3, 4, 5], 30, false);
                        ef.animations.play("destroy");
                        ef.anchor.setTo(.5, .5); //sprite is centered
                        ef.rotation = Math.floor(Math.random()*4)*Math.PI/2; //random rotation for variety
                        ef.lifespan = 1000* 5 / 30;
                        playSandCrumbleSFX = true;
                    }
                }
                
            }
        }
        if (playSandCrumbleSFX) FullGame.playSFX("sand_crumble");
        this.tilesPressuredThisFrame.splice(0, this.tilesPressuredThisFrame.length);
        
        //update bg parallax
        //in the middle, positions will be the same
        var cx = this.camera.x + SCREEN_WIDTH/2;
        var cy = this.camera.y + SCREEN_HEIGHT/2;
        for (i=0; i<this.bgGroup.children.length; i++){
            var bg = this.bgGroup.children[i];
            if (bg.startX == undefined) continue;
            var px = this.bgGroup.parallaxX;
            var py = this.bgGroup.parallaxY;
            if (bg.customParallaxX != undefined)
                px = bg.customParallaxX;
            if (bg.customParallaxY != undefined)
                py = bg.customParallaxY;
            bg.x = bg.startX + (1 - px) * (cx - this.worldWidth/2);
            bg.y = bg.startY + (1 - py) * (cy - this.worldHeight/2);
        }
        
        if (this.recreatePlayerAtFrameEnd){
            this.recreatePlayer();
            this.recreatePlayerAtFrameEnd = false;
        }
        
    },
    
    paused: function() {
        //called when the game is paused
    },
    pauseUpdate: function() {
        //called while the game is paused (in place of update)
        FullGame.Keys.refresh();
        
        if (this.pauseObj != null && this.pauseObj.pauseUpdate != undefined){
            this.pauseObj.pauseUpdate();
        }
    },
    
    render: function() {
        //called after displaying everything
    },
    
    shutdown: function () {
        //destroy stuff
        FullGame.Lasers.destroy();
        FullGame.HUD.destroy();
        if (this.backTileLayer != null){
            this.backTileLayer.destroy(true);
            this.backTileLayer = null;
        }
        FullGame.AlienPath.clear();
        this.tileLayer.destroy(true);
        this.tileLayer = null;
        this.tileMap.destroy();
        this.tileMap = null;
        this.mapJSON = null;
        this.player = null;
        this.bgMusic = "";
        this.objs.splice(0, this.objs.length);
        this.orbs.splice(0, this.orbs.length);
        this.eyebots.splice(0, this.eyebots.length);
        this.gems.splice(0, this.gems.length);
        this.portals.splice(0, this.portals.length);
        this.miscObjs.splice(0, this.miscObjs.length);
        this.tileCols.splice(0, this.tileCols.length); this.tileCols = null;
        this.pauseObj = null;
        this.laserG = null;
        this.tilesPressuredThisFrame = null;
        this.destroyTileCounters = null;
        this.hudGroup.destroy(true); this.hudGroup = null;
        this.frontGroup.destroy(true); this.frontGroup = null;
        this.tileGroup.destroy(true); this.tileGroup = null;
        this.laserGroup.destroy(true); this.laserGroup = null;
        this.objGroup.destroy(true); this.objGroup = null;
        this.backTileGroup.destroy(true); this.backTileGroup = null;
        this.bgGroup.destroy(true); this.bgGroup = null;
        this.timeSinceLevelStart = 0;
        
    },
    
    //restarts the level
    restart: function() {
        this.state.restart();
        //this.state.start(game.state.current);
    },
    
    newLevel: function(mapName) {
        FullGame.Vars.lastMap = game.state.current;
        FullGame.Vars.startMap = mapName;
        FullGame.Vars.saveData();
        this.state.start(mapName);
        
        if (mapName == "tempLast"){
            FullGame.Vars.showTimer = true;
        }
    },
    
    recreatePlayerAtFrameEnd:false,
    //it's better to just set FullGame.GI.recreatePlayerAtFrameEnd to true than calling this
    recreatePlayer: function() {
        var propsSet = false;
        var x, y, vx, vy, cHO, cVO, cXWSF, cYWSF;
        if (this.player != null){
            x = this.player.x;
            y = this.player.y;
            vx = this.player.body.velocity.x;
            vy = this.player.body.velocity.y;
            cHO = this.player.cameraHorizOffset;
            cVO = this.player.cameraVertOffset;
            cXWSF = this.player.cameraXWhenStartedFiring;
            cYWSF = this.player.cameraYWhenStartedFiring;
            propsSet = true;
            if (this.player.laserNormalSound.isPlaying)
                this.player.laserNormalSound.stop();
            var i = this.objs.indexOf(this.player);
            this.objs.splice(i, 1);
            this.player.destroy();
            this.player = null;
        }
        
        this.player = FullGame.makePlayer(game);
        this.objs.push(this.player);
        if (propsSet){
            this.player.x = x;
            this.player.y = y;
            this.player.body.velocity.x = vx;
            this.player.body.velocity.y = vy;
            
            this.player.cameraHorizOffset = cHO;
            this.player.cameraVertOffset = cVO;
            this.player.cameraXWhenStartedFiring = cXWSF;
            this.player.cameraYWhenStartedFiring = cYWSF;
            //player was already added, so it should not be locked in a behavior
            this.player.setBehavior("none");
        }
        
    },
    
    //removes a tile while updating tileCols, etc.
    removeTile: function(x, y) {
        this.tileMap.removeTile(x, y, this.tileLayer);
        this.tileCols[x][y] = "";
    }


};