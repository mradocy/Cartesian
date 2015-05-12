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
        /*{txt:"36 - Portals", desc:"",
         startMap:"firstPortal", lastMap:"sandTime", color:FullGame.Til.RED},*/
        {txt:"40 - Second Rescue", desc:"",
         startMap:"tightReflect", lastMap:"redStart", color:FullGame.Til.GREEN},
        {txt:"43 - Gems", desc:"",
         startMap:"keyRoom", lastMap:"deepDescent", color:FullGame.Til.RED},
        
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
    
    ret.HIT_AREA = {x:-5, y:0, width:300, height:29};
    
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
            var lvl = {};
            lvl.text = game.add.text(
                this.headerText.x,
                152 + i*29,
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