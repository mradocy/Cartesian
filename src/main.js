

//creates the Game object
var SCREEN_WIDTH = 1024;//840; 1280
var SCREEN_HEIGHT = 576;//480; 720
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
    "firstMultReflect",
    "firstSpring",
    "firstGlass",
    "firstMultOrb",
    "firstSand",
    "numbers",
    "platforming1",
    "secret1",
    "firstMovingLasers",
    "trapped",
    "trapped2",
    "trapped3",
    "reflectOffDoor",
    "blueEyebot",
    "blueEyebot2",
    "revisit",
    "split",
    "firstRoplate",
    "roplate2",
    "useEyebot",
    "destroyEyebot",
    "hiddenOrb",
    "redRoplate",
    "multEyebots",
    "sandTrek",
    
    "arena"
];

//add a state for each level
for (var i=0; i<rooms.length; i++){
    game.state.add(rooms[i], FullGame.Game);
}
game.state.add('testmap', FullGame.Game);
game.state.add("tempLast", FullGame.Game);

//add title state
game.state.add("Title", FullGame.Title);

// start the Boot state.
game.state.add('Boot', FullGame.Boot, true);
