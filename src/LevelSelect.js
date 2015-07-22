FullGame.levelNames = [
    {name:"01 - First Level",
     startMap:"firstLevel", lastMap:"none", color:FullGame.Til.RED},
    {name:"02 - The Orb",
     startMap:"firstOrb", lastMap:"firstLevel", color:FullGame.Til.RED},
    {name:"03 - Bent",
     startMap:"redEyebot", lastMap:"firstOrb", color:FullGame.Til.RED},
    {name:"04 - Left Wall",
     startMap:"firstReflect", lastMap:"redEyebot", color:FullGame.Til.RED},
    {name:"05 - Caution",
     startMap:"firstMultReflect", lastMap:"firstReflect", color:FullGame.Til.RED},
    {name:"06 - Spring",
     startMap:"firstSpring", lastMap:"firstMultReflect", color:FullGame.Til.RED},
    {name:"07 - Glass",
     startMap:"firstGlass", lastMap:"firstSpring", color:FullGame.Til.RED},
    {name:"08 - Two Orbs",
     startMap:"firstMultOrb", lastMap:"firstGlass", color:FullGame.Til.RED},
    {name:"09 - Crumbling",
     startMap:"firstSand", lastMap:"firstMultOrb", color:FullGame.Til.RED},
    {name:"10 - Red Walled",
     startMap:"platforming1", lastMap:"firstSand", color:FullGame.Til.RED},
    {name:"S1 - ???",
     startMap:"secret1", lastMap:"platforming1", color:FullGame.Til.RED},
    {name:"11 - Laser on a Line",
     startMap:"firstMovingLasers", lastMap:"platforming1", color:FullGame.Til.RED},
    {name:"12 - Descent",
     startMap:"trapped", lastMap:"firstMovingLasers", color:FullGame.Til.RED},
    {name:"13 - Back Room",
     startMap:"trapped2", lastMap:"trapped", color:FullGame.Til.RED},
    {name:"14 - Perception",
     startMap:"trapped3", lastMap:"trapped2", color:FullGame.Til.RED},
    {name:"15 - Red Door",
     startMap:"reflectOffDoor", lastMap:"trapped3", color:FullGame.Til.RED},
    {name:"16 - Hazardous Oculroids",
     startMap:"blueEyebot", lastMap:"reflectOffDoor", color:FullGame.Til.RED},
    {name:"17 - Another Angle",
     startMap:"blueEyebot2", lastMap:"blueEyebot", color:FullGame.Til.RED},
    {name:"18 - Safe Corner",
     startMap:"revisit", lastMap:"blueEyebot2", color:FullGame.Til.RED},
    {name:"19 - Split Path",
     startMap:"split", lastMap:"revist", color:FullGame.Til.RED},
    {name:"20 - Roplates",
     startMap:"firstRoplate", lastMap:"split", color:FullGame.Til.RED},
    {name:"21 - Two Roplates",
     startMap:"roplate2", lastMap:"firstRoplate", color:FullGame.Til.RED},
    {name:"22 - Blue Oculroid",
     startMap:"useEyebot", lastMap:"roplate2", color:FullGame.Til.RED},
    {name:"23 - Counterattack",
     startMap:"destroyEyebot", lastMap:"useEyebot", color:FullGame.Til.RED},
    {name:"24 - First Rescue",
     startMap:"firstGem", lastMap:"split", color:FullGame.Til.BLUE},
    {name:"25 - Deep Blue",
     startMap:"hiddenOrb", lastMap:"firstGem", color:FullGame.Til.BLUE},
    {name:"26 - Clash of Colors",
     startMap:"redRoplate", lastMap:"hiddenOrb", color:FullGame.Til.BLUE},
    {name:"27 - Oculroid Force",
     startMap:"multEyebots", lastMap:"redRoplate", color:FullGame.Til.BLUE},
    {name:"28 - Sand Trek",
     startMap:"sandTrek", lastMap:"multEyebots", color:FullGame.Til.BLUE},
    {name:"29 - Surfaced",
     startMap:"useShooter", lastMap:"sandTrek", color:FullGame.Til.BLUE},
    {name:"30 - Star",
     startMap:"star", lastMap:"useShooter", color:FullGame.Til.BLUE},
    {name:"31 - vs. Anex",
     startMap:"arena", lastMap:"star", color:FullGame.Til.BLUE},
    {name:"32 - Landing Zone",
     startMap:"openArea", lastMap:"arena", color:FullGame.Til.BLUE},
    {name:"33 - Slider",
     startMap:"firstSlider", lastMap:"openArea", color:FullGame.Til.RED},
    {name:"34 - Elevation",
     startMap:"slider2", lastMap:"firstSlider", color:FullGame.Til.RED},
    {name:"35 - Time's Up",
     startMap:"sandTime", lastMap:"slider2", color:FullGame.Til.RED},
    {name:"36 - Portals",
     startMap:"firstPortal", lastMap:"sandTime", color:FullGame.Til.RED},
    {name:"37 - Slider City",
     startMap:"platforming2", lastMap:"firstPortal", color:FullGame.Til.RED},
    {name:"38 - Self Destruction",
     startMap:"portalEyebots", lastMap:"platforming2", color:FullGame.Til.RED},
    {name:"39 - Blue Start",
     startMap:"redStart", lastMap:"portalEyebots", color:FullGame.Til.GREEN},
    {name:"40 - Second Rescue",
     startMap:"tightReflect", lastMap:"redStart", color:FullGame.Til.GREEN},
    {name:"41 - vs. Midel",
     startMap:"arena2", lastMap:"tightReflect", color:FullGame.Til.RED},
    {name:"42 - Deep Descent",
     startMap:"deepDescent", lastMap:"arena2", color:FullGame.Til.RED},
    {name:"43 - Musgravite Depths",
     startMap:"keyRoom", lastMap:"deepDescent", color:FullGame.Til.RED},
    {name:"44 - Insignia",
     startMap:"twoGems", lastMap:"keyRoom", color:FullGame.Til.RED},
    {name:"45 - Blood Roplate",
     startMap:"roplateSpecial", lastMap:"twoGems", color:FullGame.Til.RED},
    {name:"46 - Portals and Musgravite",
     startMap:"gemPortals", lastMap:"roplateSpecial", color:FullGame.Til.RED},
    {name:"47 - Temporary Value",
     startMap:"useEyebot2", lastMap:"gemPortals", color:FullGame.Til.RED},
    {name:"48 - Dimension Blanc",
     startMap:"whiteArea", lastMap:"useEyebot2", color:FullGame.Til.RED},
    {name:"49 - Send to Limbo",
     startMap:"whiteArea2", lastMap:"whiteArea", color:FullGame.Til.RED},
    {name:"50 - Glass Houses",
     startMap:"whiteArea3", lastMap:"whiteArea2", color:FullGame.Til.RED},
    {name:"51 - Reality Transfer",
     startMap:"whiteAreaBuffer", lastMap:"whiteArea3", color:FullGame.Til.RED},
    {name:"52 - Reality Buffer",
     startMap:"beforeBoss", lastMap:"whiteArea2", color:FullGame.Til.RED},
    
    {name:"53 - vs. Griddo",
     startMap:"griddy1", lastMap:"beforeBoss", color:FullGame.Til.RED},
    {name:"54 - vs. Griddo Part 2",
     startMap:"griddy2", lastMap:"griddy1", color:FullGame.Til.RED},
    {name:"55 - vs. Griddo Part 3",
     startMap:"griddy3", lastMap:"griddy2", color:FullGame.Til.RED},
    
    
    
    
];

FullGame.makeLevelSelect = function(title, backFunction) {
    
    var ret = {};
    ret.title = title;
    ret.backFunction = backFunction;
    
    ret.levelDescs = [
        {txt:"01 - First Level",
         desc:"The first few levels are spent introducing the player to the game's basic mechanics.",
         startMap:"firstLevel", lastMap:"none", color:FullGame.Til.RED},
        {txt:"05 - Moving Lasers", desc:"",
         startMap:"firstMultReflect", lastMap:"firstReflect", color:FullGame.Til.RED},
        {txt:"08 - Multiple Orbs",
         desc:"For those condifent they'd understand how the game works without a tutorial.",
         startMap:"firstMultOrb", lastMap:"firstGlass", color:FullGame.Til.RED},
        {txt:"12 - Descent", desc:"",
         startMap:"trapped", lastMap:"firstMovingLasers", color:FullGame.Til.RED},
        {txt:"16 - Hazardus Oculroids", desc:"",
         startMap:"blueEyebot", lastMap:"reflectOffDoor", color:FullGame.Til.RED},
        {txt:"20 - Roplates", desc:"",
         startMap:"firstRoplate", lastMap:"split", color:FullGame.Til.RED},
        {txt:"24 - First Rescue", desc:"",
         startMap:"firstGem", lastMap:"split", color:FullGame.Til.BLUE},
        {txt:"28 - Sand Trek", desc:"",
         startMap:"sandTrek", lastMap:"multEyebots", color:FullGame.Til.BLUE},
        {txt:"31 - Boss Fight 1", desc:"",
         startMap:"arena", lastMap:"star", color:FullGame.Til.BLUE},
        {txt:"33 - Slide Platforms", desc:"",
         startMap:"firstSlider", lastMap:"openArea", color:FullGame.Til.RED},
        {txt:"36 - Portals", desc:"",
         startMap:"firstPortal", lastMap:"sandTime", color:FullGame.Til.RED},
        {txt:"40 - Second Rescue", desc:"",
         startMap:"tightReflect", lastMap:"redStart", color:FullGame.Til.GREEN},
        {txt:"43 - Gems", desc:"",
         startMap:"keyRoom", lastMap:"deepDescent", color:FullGame.Til.RED},
        {txt:"48 - Dimension Blanc", desc:"",
         startMap:"whiteArea", lastMap:"useEyebot2", color:FullGame.Til.RED},
        {txt:"52 - Reality Buffer", desc:"",
         startMap:"beforeBoss", lastMap:"whiteArea2", color:FullGame.Til.RED},
        {txt:"56 - Final Rescue", desc:"",
         startMap:"lastRescue", lastMap:"griddy3", color:FullGame.Til.RED},
        
        {txt:"60 - Landed Again", desc:"",
         startMap:"landedAgain", lastMap:"openArea", color:FullGame.Til.RED},
        
        {txt:"TEST - Final Boss", desc:"",
         startMap:"finalArena", lastMap:"beforeFinal", color:FullGame.Til.RED},
        
    ];
    ret.levels = [];
    
    ret.bg = null;
    ret.headerText = null;
    ret.backText = null;
    
    ret.clear = function() {
        if (this.bg != null){
            this.bg.destroy();
            this.bg = null;
        }
        if (this.headerText != null){
            this.headerText.destroy();
        }
        while(this.levels.length > 0){
            var lvl = this.levels.pop();
            lvl.text.destroy();
            if (lvl.textDesc != undefined){
                lvl.textDesc.destroy();
            }
        }
        if (this.backText != null){
            this.backText.destroy();
        }
    };
    
    ret.HIT_AREA = {x:-5, y:0, width:250, height:29};
    ret.NUM_ROWS = 12;
    ret.COLUMN_SPACING = 270;
    
    ret.create = function() {
        this.clear();
        
        this.bg = game.add.graphics(0, 0);
        this.bg.beginFill(0x000000, .95);
        this.bg.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this.bg.endFill();
        
        this.headerText = game.add.text(
            50,
            40,
            "Level Select\n\n" +
            "The following locations mark introductions of significant gameplay mechanics.\n" +
            "Choose a level to start your adventure there.\n",
            { font: "19px Verdana", fill: FullGame.Menus.UNSELECTED_COLOR });
        
        for (var i=0; i<this.levelDescs.length; i++){
            var desc = this.levelDescs[i];
            var row = i % this.NUM_ROWS;
            var col = Math.floor(i / this.NUM_ROWS);
            var lvl = {};
            lvl.text = game.add.text(
                this.headerText.x + col*this.COLUMN_SPACING,
                152 + row*29,
                desc.txt,
                { font: "20px Verdana", fill: FullGame.Menus.UNSELECTED_COLOR });
            /*lvl.textDesc = game.add.text(
                lvl.text.x + 30,
                lvl.text.y + 25,
                desc.desc,
                { font: "16px Verdana", fill: FullGame.Menus.UNSELECTED_COLOR });*/
            lvl.startMap = desc.startMap;
            lvl.lastMap = desc.lastMap;
            lvl.color = desc.color;
            
            this.levels.push(lvl);
        }
        
        this.backText = game.add.text(
            this.headerText.x,
            515,
            "BACK",
            { font: "24px Verdana", fill: FullGame.Menus.UNSELECTED_COLOR });
    };
    
    ret.textSelected = null;
    ret.prevTextSelected = null;
    ret.levelSelected = null;
    
    ret.update = function() {
        
        var dt = game.time.physicsElapsed;
        
        //cursor selecting other text
        var x = FullGame.Keys.mouseX;
        var y = FullGame.Keys.mouseY;
        this.textSelected = null;
        
        for (var i=0; i<this.levels.length+1; i++) {
            var lvl, txt;
            if (i == this.levels.length){
                lvl = null;
                txt = this.backText;
            } else {
                lvl = this.levels[i];
                txt = lvl.text;
            }
            if (!txt.visible) continue;
            if (txt == this.headerText) continue;
            if (txt.x+this.HIT_AREA.x <= x &&
                x <= txt.x+this.HIT_AREA.x+this.HIT_AREA.width &&
                txt.y+this.HIT_AREA.y <= y &&
                y <= txt.y+this.HIT_AREA.y+this.HIT_AREA.height){
                this.textSelected = txt;
                this.levelSelected = lvl;
            }
        }
        
        if (this.textSelected != this.prevTextSelected){
            if (this.prevTextSelected != null){
                this.prevTextSelected.clearColors();
                this.prevTextSelected.addColor(FullGame.Menus.UNSELECTED_COLOR, 0);
            }
            if (this.textSelected != null){
                this.textSelected.clearColors();
                this.textSelected.addColor(FullGame.Menus.SELECTED_COLOR, 0);
            }
            this.prevTextSelected = this.textSelected;
        }
        
        if (FullGame.Keys.lmbPressed && this.textSelected != null &&
            this.textSelected.visible){
            
            if (this.textSelected == this.backText){
                
                this.backFunction(this.title, false);
                this.clear();
                
            } else {
                
                var tempTime = FullGame.Vars.totalPlayTime;
                FullGame.Vars.fillDefaultValues();
                FullGame.Vars.totalPlayTime = tempTime;
                FullGame.Vars.startMap = this.levelSelected.startMap;
                FullGame.Vars.lastMap = this.levelSelected.lastMap;
                FullGame.Vars.playerLaserColor = this.levelSelected.color;
                this.backFunction(this.title, true);
                this.clear();
                
            }
            
        }
        
        
    };
    
    
    return ret;
    
};