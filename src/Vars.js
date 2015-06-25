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
    sfxMuted:false,
    musicMuted:false,
    messagesSaid:[],
    totalPlayTime:0, //includes deaths, does not include pausing.  note: Game has a timeSinceLevelStart property
    totalDeaths:0,
    totalDamages:0,
    showTimer:false,
    screenshotMode:false,
    
    // desktop app stuff
    desktopApp:true, //set to true when using node-webkit
    nw:null, //reference to node-webkit things
    win:null //reference to the window
    //call FullGame.Vars.win.close(); to close window
};

FullGame.Vars.fillDefaultValues = function() {
    FullGame.Vars.startMap = "firstLevel"; //first level
    //FullGame.Vars.startMap = "openArea"; //last level made
    //FullGame.Vars.startMap = "suits"; //work on this too
    //FullGame.Vars.startMap = "blueEyebot";
    //startX, startY, startBehavior are set through a Entrance object in Tiled
    FullGame.Vars.lastMap = "none"; //first level
    //FullGame.Vars.lastMap = "arena"; //last level made
    //FullGame.Vars.lastMap = "platforming2"; //work on this too
    //FullGame.Vars.lastMap = "reflectOffDoor";
    FullGame.Vars.playerLaserColor = FullGame.Til.RED;
    //FullGame.Vars.playerLaserColor = FullGame.Til.BLUE;
    FullGame.Vars.playerLaserType = FullGame.Til.LASER_NORMAL;
    FullGame.Vars.playerLaserColorOnLevelStart = FullGame.Til.RED;
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


FullGame.getCurrentLevelSelectName = function() {
    var map = FullGame.Vars.startMap;
    for (var i=0; i<FullGame.levelNames.length; i++){
        var obj = FullGame.levelNames[i];
        if (obj.startMap == map){
            return obj.name;
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
    FullGame.currentMusicSound.fadeOut(duration);
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
        FullGame.currentMusicSound.fadeIn(fadeDuration, (introMusicKey == ""));
    }
    FullGame.currentMusicFadingOut = false;
    
};