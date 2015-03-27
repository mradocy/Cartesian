FullGame.Vars = {
    saveCreated:false,
    startMap:"",
    startX:0,
    startY:0,
    /* Possible startBehaviors:
     * "none", "walkLeft", "walkRight", "fall", "jumpLeft", "jumpRight", "superJumpLeft", "superJumpRight"
     * - Will be determined by Entrance object in Tiled
     */
    startBehavior:"",
    lastMap:"", //the last map visited
    playerLaserColor:0,
    playerLaserType:0,
    sfxMuted:false,
    musicMuted:false,
    messagesSaid:[],
    totalPlayTime:0, //includes deaths, does not include pausing.  note: Game has a timeSinceLevelStart property
    totalDeaths:0,
    totalDamages:0,
    showTimer:false
};

FullGame.Vars.fillDefaultValues = function() {
    //FullGame.Vars.startMap = "firstLevel"; //first level
    FullGame.Vars.startMap = "openArea"; //last level made
    //FullGame.Vars.startMap = "useShooter"; //work on this too
    //FullGame.Vars.startMap = "blueEyebot";
    //startX, startY, startBehavior are set through a Entrance object in Tiled
    //FullGame.Vars.lastMap = "none"; //first level
    FullGame.Vars.lastMap = "arena"; //last level made
    //FullGame.Vars.lastMap = "sandTrek"; //work on this too
    //FullGame.Vars.lastMap = "reflectOffDoor";
    FullGame.Vars.playerLaserColor = FullGame.Til.RED;
    //FullGame.Vars.playerLaserColor = FullGame.Til.BLUE;
    FullGame.Vars.playerLaserType = FullGame.Til.LASER_NORMAL;
    FullGame.Vars.messagesSaid.splice(0, FullGame.Vars.messagesSaid.length);
    FullGame.Vars.totalPlayTime = 0;
    FullGame.Vars.totalDeaths = 0;
    FullGame.Vars.totalDamages = 0;
    FullGame.Vars.showTimer = false;
    
    //test start at later level
    if (FullGame.Keys.downHeld){
        FullGame.Vars.startMap = "useShooter";
        FullGame.Vars.lastMap = "sandTrek";
        FullGame.Vars.playerLaserColor = FullGame.Til.BLUE;
    }
};

FullGame.Vars.saveData = function() {
    if (typeof(Storage) == "undefined"){
        console.log("Local storage not supported");
        return;
    }
    localStorage.created = "true";
    localStorage.startMap = FullGame.Vars.startMap;
    localStorage.startX = String(FullGame.Vars.startX);
    localStorage.startY = String(FullGame.Vars.startY);
    localStorage.startBehavior = FullGame.Vars.startBehavior;
    localStorage.lastMap = FullGame.Vars.lastMap;
    localStorage.playerLaserColor = String(FullGame.Vars.playerLaserColor);
    localStorage.playerLaserType = String(FullGame.Vars.playerLaserType);
    if (FullGame.Vars.sfxMuted) localStorage.sfxMuted = "true";
    else localStorage.sfxMuted = "false";
    if (FullGame.Vars.musicMuted) localStorage.musicMuted = "true";
    else localStorage.musicMuted = "false";
    localStorage.messagesSaid = FullGame.Vars.messagesSaid.join();
    localStorage.totalPlayTime = String(FullGame.Vars.totalPlayTime);
    localStorage.totalDeaths = String(FullGame.Vars.totalDeaths);
    localStorage.totalDamages = String(FullGame.Vars.totalDamages);
    if (FullGame.Vars.showTimer) localStorage.showTimer = "true";
    else localStorage.showTimer = "false";
    
};

FullGame.Vars.loadData = function() {
    if (typeof(Storage) == "undefined"){
        console.log("Local storage not supported");
        return;
    }
    if (localStorage.created == undefined || localStorage.created != "true"){
        FullGame.Vars.fillDefaultValues();
        return;
    }
    FullGame.Vars.saveCreated = true;
    FullGame.Vars.startMap = localStorage.startMap;
    FullGame.Vars.startX = Number(localStorage.startX);
    FullGame.Vars.startY = Number(localStorage.startY);
    FullGame.Vars.startBehavior = localStorage.startBehavior;
    FullGame.Vars.lastMap = localStorage.lastMap;
    FullGame.Vars.playerLaserColor = Number(localStorage.playerLaserColor);
    FullGame.Vars.playerLaserType = Number(localStorage.playerLaserType);
    FullGame.Vars.sfxMuted = (localStorage.sfxMuted == "true");
    FullGame.Vars.musicMuted = (localStorage.musicMuted == "true");
    FullGame.Vars.messagesSaid = localStorage.messagesSaid.split(",");
    FullGame.Vars.totalPlayTime = Number(localStorage.totalPlayTime);
    FullGame.Vars.totalDeaths = Number(localStorage.totalDeaths);
    FullGame.Vars.totalDamages = Number(localStorage.totalDamages);
    FullGame.Vars.showTimer = (localStorage.showTimer == "true");
    
};



FullGame.playSFX = function(key, volume, loop) {
    if (FullGame.Vars.sfxMuted)
        return;
    game.sound.play(key, volume, loop);
};

