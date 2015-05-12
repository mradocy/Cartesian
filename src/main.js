

//creates the Game object
var SCREEN_WIDTH = 1024;
var SCREEN_HEIGHT = 576;
var DOMElement = 'game';
/* param 1: width of game in pixels
 * param 2: height of game in pixels
 * param 3: the renderer to use.  Phaser.AUTO will auto-detect Phaser.WEBGL, Phaser.CANVAS, or Phaser.HEADLESS
 * param 4: the DOM element into which the game's canvas will be injected
 * param 5: the default state object, consisting of functions preload, create, update, and render
 * param 6: use transparent canvas or not (bool)
 * param 7: use anti-aliasing (default is true)
 * param 8: physics configuration obect to pass to the Physics world on creation */
var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, /*Phaser.AUTO*/Phaser.CANVAS, DOMElement, null, false, true);

game.state.add('Preloader', FullGame.Preloader);

//Lists all the rooms in the game IN ORDER
var rooms = [
    "firstLevel",
    "firstOrb",
    "redEyebot",
    "firstReflect",
    "firstMultReflect", //5
    "firstSpring",
    "firstGlass",
    "firstMultOrb",
    "firstSand",
    //"numbers", //not using
    "platforming1", //10
    "secret1",
    "firstMovingLasers", //11
    "trapped",
    "trapped2",
    "trapped3",
    "reflectOffDoor",
    "blueEyebot",
    "blueEyebot2",
    "revisit",
    "split", //19
    "firstRoplate",
    "roplate2",
    "useEyebot",
    "destroyEyebot",
    "firstGem", //24
    "hiddenOrb",
    "redRoplate",
    "multEyebots",
    "sandTrek",
    "useShooter", //29
    "star",
    "arena",
    "openArea", //32 <- Need to still make space ship
    "firstSlider",
    "slider2",
    "sandTime",
    "firstPortal",
    "platforming2",
    
    //"suits", //not using (secret level?)
    
    "portalEyebots", //38
    "redStart", //39
    
    "tightReflect",
    "arena2", //41
    "deepDescent",
    "keyRoom",
    "twoGems",
    "roplateSpecial",
    "gemPortals", //46
    "useEyebot2",
    
    "whiteArea",
    "whiteArea2"
];

//add a state for each level
for (var i=0; i<rooms.length; i++){
    game.state.add(rooms[i], FullGame.Game);
}
game.state.add('testmap', FullGame.Game);
game.state.add("tempLast", FullGame.Game);

//add other states
game.state.add("Title", FullGame.Title);
game.state.add("Intro", FullGame.Intro);

// start the Boot state.
game.state.add('Boot', FullGame.Boot, true);
