var FullGame = {};

FullGame.Boot = function (game) {};

FullGame.Boot.prototype = {
    
    init: function () {
        //set game settings

        // only one mouse input
        this.input.maxPointers = 1;
        
        //Disabling pausing when game loses focus
        this.stage.disableVisibilityChange = true;
        
        //
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        
        //node-webkit stuff
        if (FullGame.Vars.desktopApp && FullGame.Vars.nw == null){
            FullGame.Vars.nw = require("nw.gui");
            FullGame.Vars.win = FullGame.Vars.nw.Window.get();
        }
    
        
    },

    preload: function () {
        
        //load assets for preloader
        this.load.image('preloaderBar', 'assets/img/preloader-bar.png');
    },

    create: function () {
        FullGame.Keys.init();
        //preloader assets loaded; start preloader
        this.state.start('Preloader');
        
    }

};