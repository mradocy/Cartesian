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
    playerLaserColorOnLevelStart:0,
    playerLaserTypeOnLevelStart:0,
    sfxMuted:false,
    musicMuted:false,
    messagesSaid:[],
    totalPlayTime:0, //includes deaths, does not include pausing.  note: Game has a timeSinceLevelStart property
    totalDeaths:0,
    totalDamages:0,
    levelsVisited:[],
    secret1Obtained:false,
    secret2Obtained:false,
    secret3Obtained:false,
    showTimer:false,
    screenshotMode:false,
    
    // desktop app stuff
    desktopApp:false, //set to true when using node-webkit
    nw:null, //reference to node-webkit things
    win:null, //reference to the window
    demo:false  //set to true when running in demo mode
    //call FullGame.Vars.win.close(); to close window
};

FullGame.Vars.fillDefaultValues = function() {
    FullGame.Vars.startMap = "firstLevel";
    FullGame.Vars.lastMap = "none";
    FullGame.Vars.playerLaserColor = FullGame.Til.RED;
    FullGame.Vars.playerLaserType = FullGame.Til.LASER_NORMAL;
    FullGame.Vars.playerLaserColorOnLevelStart = FullGame.Til.RED;
    FullGame.Vars.playerLaserTypeOnLevelStart = FullGame.Til.LASER_NORMAL;
    FullGame.Vars.messagesSaid.splice(0, FullGame.Vars.messagesSaid.length);
    FullGame.Vars.totalPlayTime = 0;
    FullGame.Vars.totalDeaths = 0;
    FullGame.Vars.totalDamages = 0;
    FullGame.Vars.levelsVisited.splice(0, FullGame.Vars.levelsVisited.length);
    FullGame.Vars.levelsVisited.push("firstLevel");
    FullGame.Vars.secret1Obtained = false;
    FullGame.Vars.secret2Obtained = false;
    FullGame.Vars.secret3Obtained = false;
    FullGame.Vars.showTimer = false;
};

FullGame.Vars.saveData = function() {
    
    var lStorage;
    //as a desktop app, stored in appdata/local
    if (typeof(Storage) == "undefined"){
        console.log("Local storage not supported");
        return;
    }
    var lStorageStr = localStorage.getItem("storage");
    if (lStorageStr == null){
        lStorage = {};
    } else {
        lStorage = JSON.parse(lStorageStr);
    }
    
    lStorage.created = "true";
    lStorage.startMap = FullGame.Vars.startMap;
    lStorage.startX = String(FullGame.Vars.startX);
    lStorage.startY = String(FullGame.Vars.startY);
    lStorage.startBehavior = FullGame.Vars.startBehavior;
    lStorage.lastMap = FullGame.Vars.lastMap;
    lStorage.playerLaserColor = String(FullGame.Vars.playerLaserColor);
    lStorage.playerLaserType = String(FullGame.Vars.playerLaserType);
    if (FullGame.Vars.sfxMuted) lStorage.sfxMuted = "true";
    else lStorage.sfxMuted = "false";
    if (FullGame.Vars.musicMuted) lStorage.musicMuted = "true";
    else lStorage.musicMuted = "false";
    lStorage.messagesSaid = FullGame.Vars.messagesSaid.join();
    lStorage.totalPlayTime = String(FullGame.Vars.totalPlayTime);
    lStorage.totalDeaths = String(FullGame.Vars.totalDeaths);
    lStorage.totalDamages = String(FullGame.Vars.totalDamages);
    lStorage.levelsVisited = FullGame.Vars.levelsVisited.join();
    if (FullGame.Vars.secret1Obtained) lStorage.secret1Obtained = "true";
    else lStorage.secret1Obtained = "false";
    if (FullGame.Vars.secret2Obtained) lStorage.secret2Obtained = "true";
    else lStorage.secret2Obtained = "false";
    if (FullGame.Vars.secret3Obtained) lStorage.secret3Obtained = "true";
    else lStorage.secret3Obtained = "false";
    if (FullGame.Vars.showTimer) lStorage.showTimer = "true";
    else lStorage.showTimer = "false";
    
    //web way
    localStorage.setItem("storage", JSON.stringify(lStorage));
    
};

FullGame.Vars.loadData = function() {
    
    var lStorage;
    //as a desktop app, stored in appdata/local
    if (typeof(Storage) == "undefined"){
        console.log("Local storage not supported");
        return;
    }
    var lStorageStr = localStorage.getItem("storage");
    if (lStorageStr == null){
        lStorage = {};
    } else {
        lStorage = JSON.parse(lStorageStr);
    }
    
    if (lStorage.levelsVisited == undefined){ //so old save files won't crash the game
        lStorage.levelsVisited = [];
    }
    if (lStorage.secret1Obtained == undefined){
        lStorage.secret1Obtained = "false";
        lStorage.secret2Obtained = "false";
        lStorage.secret3Obtained = "false";
    }
    if (lStorage.created == undefined || lStorage.created != "true"){ 
        FullGame.Vars.fillDefaultValues();
        return;
    }
    FullGame.Vars.saveCreated = true;
    FullGame.Vars.startMap = lStorage.startMap;
    FullGame.Vars.startX = Number(lStorage.startX);
    FullGame.Vars.startY = Number(lStorage.startY);
    FullGame.Vars.startBehavior = lStorage.startBehavior;
    FullGame.Vars.lastMap = lStorage.lastMap;
    FullGame.Vars.playerLaserColor = Number(lStorage.playerLaserColor);
    FullGame.Vars.playerLaserType = Number(lStorage.playerLaserType);
    FullGame.Vars.sfxMuted = (lStorage.sfxMuted == "true");
    FullGame.Vars.musicMuted = (lStorage.musicMuted == "true");
    FullGame.Vars.messagesSaid = lStorage.messagesSaid.split(",");
    FullGame.Vars.totalPlayTime = Number(lStorage.totalPlayTime);
    FullGame.Vars.totalDeaths = Number(lStorage.totalDeaths);
    FullGame.Vars.totalDamages = Number(lStorage.totalDamages);
    FullGame.Vars.levelsVisited = lStorage.levelsVisited.split(",");
    FullGame.Vars.secret1Obtained = (lStorage.secret1Obtained == "true");
    FullGame.Vars.secret2Obtained = (lStorage.secret2Obtained == "true");
    FullGame.Vars.secret3Obtained = (lStorage.secret3Obtained == "true");
    FullGame.Vars.showTimer = (lStorage.showTimer == "true");
    
};


FullGame.getCurrentLevelSelectName = function() {
    var map = FullGame.Vars.startMap;
    var power = (FullGame.Vars.playerLaserType == FullGame.Til.LASER_THICK);
    while (true){
        for (var i=0; i<FullGame.levelNames.length; i++){
            var obj = FullGame.levelNames[i];
            if (obj.startMap == map && obj.power == power){
                return obj.name;
            }
        }
        if (power){
            power = false;
        } else {
            break;
        }
    }
    return "";
};


FullGame.playSFX = function(key, volume, loop) {
    if (FullGame.Vars.sfxMuted)
        return;
    game.sound.play(key, volume, loop);
};

FullGame.currentMusicPlaying = "";
FullGame.currentMusicSound = null;
FullGame.currentMusicFadingOut = false;

FullGame.stopMusic = function() {
    if (FullGame.currentMusicPlaying == "")
        return;
    FullGame.currentMusicSound.stop();
    FullGame.currentMusicPlaying = "";
    FullGame.currentMusicSound = null;
    FullGame.currentMusicFadingOut = false;
};

FullGame.fadeOutMusic = function(duration) {
    if (FullGame.currentMusicPlaying == "")
        return;
    FullGame.currentMusicSound.fadeOut(duration*1000);
    FullGame.currentMusicFadingOut = true;
};

/* music always loops.
   if a key exists that is "intro_musicKey", then that song is played first once,
   and then the musicKey song starts immediately after */
FullGame.playMusic = function(musicKey, fadeDuration) {
    if (FullGame.Vars.musicMuted)
        return;
    
    FullGame.stopMusic();
    if (!game.cache.checkSoundKey(musicKey))
        return;
    
    var introMusicKey = "";
    if (game.cache.checkSoundKey("intro_" + musicKey)){
        introMusicKey = "intro_" + musicKey;
    }
    
    if (introMusicKey == ""){
        FullGame.currentMusicPlaying = musicKey;
        FullGame.currentMusicSound = game.sound.play(FullGame.currentMusicPlaying, 1, true);
    } else {
        FullGame.currentMusicPlaying = introMusicKey;
        FullGame.currentMusicSound = game.sound.play(introMusicKey);
        FullGame.currentMusicSound.onStop.add(function() {
            if (FullGame.currentMusicPlaying != ""){
                FullGame.currentMusicSound.onStop.removeAll();
                FullGame.currentMusicPlaying = FullGame.currentMusicPlaying.substring(6);
                FullGame.currentMusicSound = game.sound.play(FullGame.currentMusicPlaying, 1, true);
            }
        });
    }
    
    if (fadeDuration > 0){
        FullGame.currentMusicSound.fadeIn(fadeDuration*1000, (introMusicKey == ""));
    }
    FullGame.currentMusicFadingOut = false;
    
};