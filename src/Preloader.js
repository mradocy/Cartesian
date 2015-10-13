FullGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;
    
	this.ready = false;
};

FullGame.Preloader.prototype = {

	preload: function () {

		// add assets loaded in Boot.js
		//this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite(256, 280, 'preloaderBar');
        
        // preloader sprite that automatically crops according to how many files have loaded
		this.load.setPreloadSprite(this.preloadBar);
        
		/////////////////////////////
        // LOADING ALL GAME ASSETS //
        /////////////////////////////
        
        //loading game text
        game.load.text('text', 'assets/text.txt');
        
        
        //load tilemaps (in JSON format)
        for (var i=0; i<rooms.length; i++){
            var rm = rooms[i];
            game.load.json(rm, "assets/tilemaps/" + rm + ".json");
        }
        game.load.json('testmap', 'assets/tilemaps/testmap.json');
        game.load.json('tempLast', 'assets/tilemaps/tempLast.json');
        
        //Loading the images containing the tiles (simply loading images)
        //Make sure image name is exactly the same as the file name, without the extension
        /* param 1: unique string to identify the image
         * param 2: relative url of the image */
        game.load.image('black_tiles', 'assets/tilemaps/tiles/black_tiles.png');
        game.load.image('white_tiles', 'assets/tilemaps/tiles/white_tiles.png');
        game.load.image('mixed_tiles', 'assets/tilemaps/tiles/mixed_tiles.png');
        
        game.load.image('black_tiles_extra', 'assets/tilemaps/tiles/black_tiles_extra.png');
        game.load.image('glow_purple', 'assets/tilemaps/tiles/glow_purple_transp.png');
        game.load.image('glow_white', 'assets/tilemaps/tiles/glow_white_transp.png');
        game.load.image('glow_red', 'assets/tilemaps/tiles/glow_red_transp.png');
        game.load.image('glow_blue', 'assets/tilemaps/tiles/glow_blue_transp.png');
        game.load.image('glow_green', 'assets/tilemaps/tiles/glow_green_transp.png');
        
        game.load.image('red_tiles', 'assets/tilemaps/tiles/red_tiles.png');
        game.load.image('red_black_tiles', 'assets/tilemaps/tiles/red_black_tiles.png');
        game.load.image('blue_tiles', 'assets/tilemaps/tiles/blue_tiles.png');
        game.load.image('blue_black_tiles', 'assets/tilemaps/tiles/blue_black_tiles.png');
        game.load.image('green_tiles', 'assets/tilemaps/tiles/green_tiles.png');
        game.load.image('green_black_tiles', 'assets/tilemaps/tiles/green_black_tiles.png');
        game.load.image('glass_tiles', 'assets/tilemaps/tiles/glass_tiles.png');
        game.load.image('black_indestructable', 'assets/tilemaps/tiles/black_indestructable.png');
        game.load.image('sand_tiles', 'assets/tilemaps/tiles/sand_tiles.png');
        game.load.image('novis_editor', 'assets/tilemaps/tiles/novis.png'); //switched with invisible tile
        game.load.image('red_indestructable', 'assets/tilemaps/tiles/red_indestructable.png');
        
        game.load.image('shadow_black', 'assets/tilemaps/tiles/shadow_black.png');
        
        game.load.script('filterX', 'src/BlurX.js');
        game.load.script('filterY', 'src/BlurY.js');
        
        
        //loading backgrounds
        game.load.image('space1', 'assets/img/bgs/space1.png');
        game.load.image('space_no_bg', 'assets/img/bgs/space_no_bg.png');
        game.load.image('title_fg', 'assets/img/bgs/title_fg.png');
        game.load.image('title_logo_red', 'assets/img/bgs/title_logo_red.png');
        game.load.image('title_logo_blue', 'assets/img/bgs/title_logo_blue.png');
        game.load.image('title_logo_green', 'assets/img/bgs/title_logo_green.png');
        game.load.image('title_logo_white', 'assets/img/bgs/title_logo_white.png');
        game.load.image('title_logo_black', 'assets/img/bgs/title_logo_black.png');
        game.load.image('title_logo_demo', 'assets/img/bgs/title_logo_demo.png');
        game.load.image('dust_red1', 'assets/img/bgs/dust_red1.png');
        game.load.image('dust_red2', 'assets/img/bgs/dust_red2.png');
        game.load.image('dust_blue1', 'assets/img/bgs/dust_blue1.png');
        game.load.image('dust_blue2', 'assets/img/bgs/dust_blue2.png');
        game.load.image('dust_green1', 'assets/img/bgs/dust_green1.png');
        game.load.image('dust_green2', 'assets/img/bgs/dust_green2.png');
        game.load.image('bg1', 'assets/img/bgs/bg1.png');
        game.load.spritesheet("sand_parts", 'assets/img/bgs/particles/sand_parts.png', 16, 16, 5);
        game.load.image('bg2', 'assets/img/bgs/bg2.jpg');
        game.load.image('bg3', 'assets/img/bgs/bg3.jpg');
        //game.load.image('bg4', 'assets/img/bgs/bg4.jpg');
        game.load.image('bg4', 'assets/img/bgs/bg4.png');
        game.load.image('bg5', 'assets/img/bgs/bg5.png');
        
        game.load.image('bg4_red', 'assets/img/bgs/bg4_red.jpg');
        game.load.image('bg4_toRed', 'assets/img/bgs/bg4_toRed.jpg');
        
        game.load.image('bg_tall', 'assets/img/bgs/bg_tall.jpg');
        game.load.image('bg_to3', 'assets/img/bgs/bg_to3.jpg');
        game.load.image('bg_to4', 'assets/img/bgs/bg_to4.jpg');
        game.load.image('bg_to4_2', 'assets/img/bgs/bg_to4_2.jpg');
        game.load.image('bg_top', 'assets/img/bgs/bg_top.png');
        game.load.image('controls', 'assets/img/bgs/controls.png');
        game.load.image('intro_bg', 'assets/img/bgs/intro_bg.jpg');
        game.load.image('intro_fg', 'assets/img/bgs/intro_fg.png');
        game.load.image('intro_lighting', 'assets/img/bgs/intro_lighting.png');
        game.load.image('endscene_lighting', 'assets/img/bgs/endscene_lighting.png');
        game.load.image('credits_bg', 'assets/img/bgs/credits_bg.png');
        game.load.image('bg_white', 'assets/img/bgs/bg_white.png');
        game.load.spritesheet("white_thing", 'assets/img/bgs/particles/white_thing.png', 78, 78, 1);
        game.load.image("ship_ex_1", 'assets/img/bgs/particles/ship_ex_1.png');
        game.load.image("ship_ex_2", 'assets/img/bgs/particles/ship_ex_2.png');
        game.load.image('credits_logo', 'assets/img/bgs/credits_logo.png');
        
        game.load.image('bg_tempLast', 'assets/img/bgs/bg_tempLast.png');
        
        game.load.spritesheet("laserburn_red", 'assets/img/bgs/particles/laserburn_red.png', 8, 16, 4);
        game.load.spritesheet("laserburn_blue", 'assets/img/bgs/particles/laserburn_blue.png', 8, 16, 4);
        game.load.spritesheet("laserburn_green", 'assets/img/bgs/particles/laserburn_green.png', 8, 16, 4);
        game.load.spritesheet("laserburn_black", 'assets/img/bgs/particles/laserburn_black.png', 8, 16, 4);
        game.load.spritesheet("laserburn_white", 'assets/img/bgs/particles/laserburn_white.png', 8, 16, 4);
        game.load.spritesheet("laserburn_power", 'assets/img/bgs/particles/laserburn_power.png', 8, 16, 4);
        game.load.spritesheet("laserburn_power_blue", 'assets/img/bgs/particles/laserburn_power_blue.png', 8, 16, 4);
        game.load.spritesheet("laserburn_power_green", 'assets/img/bgs/particles/laserburn_power_green.png', 8, 16, 4);
        game.load.spritesheet("laserburn_power_purple", 'assets/img/bgs/particles/laserburn_power_purple.png', 8, 16, 4);
        
        
        //loading background music
        game.load.audio('begin_red', ['assets/music/begin_red.ogg', 'assets/music/begin_red.mp3'], true);
        game.load.audio('level_blue', ['assets/music/level_blue.ogg', 'assets/music/level_blue.mp3'], true);
        game.load.audio('boss1', ['assets/music/boss1.ogg', 'assets/music/boss1.mp3'], true);
        game.load.audio('level_green', ['assets/music/level_green.ogg', 'assets/music/level_green.mp3'], true);
        game.load.audio('level_white', ['assets/music/level_white.ogg', 'assets/music/level_white.mp3'], true);
        game.load.audio('title', ['assets/music/title.ogg', 'assets/music/title.mp3'], true);
        game.load.audio('boss2', ['assets/music/boss2.ogg', 'assets/music/boss2.mp3'], true);
        
        
        //loading audio
        game.load.audio('step', ['assets/sfx/step.ogg', 'assets/sfx/step.mp3'], true);
        game.load.audio('jump', ['assets/sfx/jump.ogg', 'assets/sfx/jump.mp3'], true);
        game.load.audio('spring_bounce', ['assets/sfx/spring_bounce.ogg', 'assets/sfx/spring_bounce.mp3'], true);
        game.load.audio('laser_normal', ['assets/sfx/laser_normal.ogg', 'assets/sfx/laser_normal.mp3'], true);
        game.load.audio('laser_alien', ['assets/sfx/laser_alien.ogg', 'assets/sfx/laser_alien.mp3'], true);
        game.load.audio('laser_transp_alien', ['assets/sfx/laser_transp_alien.ogg', 'assets/sfx/laser_transp_alien.mp3'], true);
        game.load.audio('laser_thick', ['assets/sfx/laser_thick.ogg', 'assets/sfx/laser_thick.mp3'], true);
        game.load.audio('laser_thick_alien', ['assets/sfx/laser_thick_alien.ogg', 'assets/sfx/laser_thick_alien.mp3'], true);
        game.load.audio('damage', ['assets/sfx/damage.ogg', 'assets/sfx/damage.mp3'], true);
        game.load.audio('death', ['assets/sfx/death.ogg', 'assets/sfx/death.mp3'], true);
        game.load.audio('puzzle_solved', ['assets/sfx/puzzle_solved.ogg', 'assets/sfx/puzzle_solved.mp3'], true);
        game.load.audio('door_open', ['assets/sfx/door_open.ogg', 'assets/sfx/door_open.mp3'], true);
        game.load.audio('sand_crumble', ['assets/sfx/sand_crumble.ogg', 'assets/sfx/sand_crumble.mp3'], true);
        game.load.audio('tile_crumble', ['assets/sfx/tile_crumble.ogg', 'assets/sfx/tile_crumble.mp3'], true);
        game.load.audio('colorchip', ['assets/sfx/colorchip.ogg', 'assets/sfx/colorchip.mp3'], true);
        game.load.audio('powerchip', ['assets/sfx/powerchip.ogg', 'assets/sfx/powerchip.mp3'], true);
        game.load.audio('msg_on', ['assets/sfx/msg_on.ogg', 'assets/sfx/msg_on.mp3'], true);
        game.load.audio('msg_off', ['assets/sfx/msg_off.ogg', 'assets/sfx/msg_off.mp3'], true);
        game.load.audio('msg_advance', ['assets/sfx/msg_advance.ogg', 'assets/sfx/msg_advance.mp3'], true);
        game.load.audio('eyebot_death', ['assets/sfx/eyebot_death.ogg', 'assets/sfx/eyebot_death.mp3'], true);
        game.load.audio('damage_flesh', ['assets/sfx/damage_flesh.ogg', 'assets/sfx/damage_flesh.mp3'], true);
        game.load.audio('alien_damage', ['assets/sfx/alien_damage.ogg', 'assets/sfx/alien_damage.mp3'], true);
        game.load.audio('alien_death', ['assets/sfx/alien_death.ogg', 'assets/sfx/alien_death.mp3'], true);
        game.load.audio('teleport', ['assets/sfx/teleport.ogg', 'assets/sfx/teleport.mp3'], true);
        game.load.audio('hair_snap', ['assets/sfx/hair_snap.ogg', 'assets/sfx/hair_snap.mp3'], true);
        game.load.audio('midel_swing', ['assets/sfx/midel_swing.ogg', 'assets/sfx/midel_swing.mp3'], true);
        game.load.audio('midel_damage', ['assets/sfx/midel_damage.ogg', 'assets/sfx/midel_damage.mp3'], true);
        game.load.audio('midel_death', ['assets/sfx/midel_death.ogg', 'assets/sfx/midel_death.mp3'], true);
        game.load.audio('griddy_poof', ['assets/sfx/griddy_poof.ogg', 'assets/sfx/griddy_poof.mp3'], true);
        game.load.audio('griddy_damage', ['assets/sfx/griddy_damage.ogg', 'assets/sfx/griddy_damage.mp3'], true);
        game.load.audio('griddy_death', ['assets/sfx/griddy_death.ogg', 'assets/sfx/griddy_death.mp3'], true);
        game.load.audio('final_damage', ['assets/sfx/final_damage.ogg', 'assets/sfx/final_damage.mp3'], true);
        game.load.audio('final_death', ['assets/sfx/final_death.ogg', 'assets/sfx/final_death.mp3'], true);
        game.load.audio('final_explode', ['assets/sfx/final_explode.ogg', 'assets/sfx/final_explode.mp3'], true);
        game.load.audio('spaceship_takeoff', ['assets/sfx/spaceship_takeoff.ogg', 'assets/sfx/spaceship_takeoff.mp3'], true);
        game.load.audio('spaceship_land', ['assets/sfx/spaceship_land.ogg', 'assets/sfx/spaceship_land.mp3'], true);
        
        game.load.audio('boop1', ['assets/sfx/boop1.ogg', 'assets/sfx/boop1.mp3'], true);
        game.load.audio('boop2', ['assets/sfx/boop2.ogg', 'assets/sfx/boop2.mp3'], true);
        game.load.audio('boop3', ['assets/sfx/boop3.ogg', 'assets/sfx/boop3.mp3'], true);
        
        //loading other images
        game.load.spritesheet("player_red", 'assets/img/player_red_sheet.png', 128, 128, 28);
        game.load.spritesheet("player_blue", 'assets/img/player_blue_sheet.png', 128, 128, 28);
        game.load.spritesheet("player_green", 'assets/img/player_green_sheet.png', 128, 128, 28);
        game.load.image('power_player', 'assets/img/power_player.png');
        game.load.image('player_red_death_particle', 'assets/img/player_red_death_particle.png');
        game.load.image('player_blue_death_particle', 'assets/img/player_blue_death_particle.png');
        game.load.image('player_green_death_particle', 'assets/img/player_green_death_particle.png');
        game.load.image('reticle_red', 'assets/img/reticle_red.png');
        game.load.image('reticle_blue', 'assets/img/reticle_blue.png');
        game.load.image('reticle_green', 'assets/img/reticle_green.png');
        game.load.image('reticle_power', 'assets/img/reticle_power.png');
        game.load.image('orb_red', 'assets/img/orb_red.png');
        game.load.image('orb_red_glow', 'assets/img/orb_red_glow.png');
        game.load.image('orb_blue', 'assets/img/orb_blue.png');
        game.load.image('orb_blue_glow', 'assets/img/orb_blue_glow.png');
        game.load.image('orb_green', 'assets/img/orb_green.png');
        game.load.image('orb_green_glow', 'assets/img/orb_green_glow.png');
        game.load.image('orb_black', 'assets/img/orb_black.png');
        game.load.image('orb_black_glow', 'assets/img/orb_black_glow.png');
        game.load.image('door_red_1', 'assets/img/door_red_1.png');
        game.load.image('door_red_2', 'assets/img/door_red_2.png');
        game.load.image('door_blue_1', 'assets/img/door_blue_1.png');
        game.load.image('door_blue_2', 'assets/img/door_blue_2.png');
        game.load.image('door_green_1', 'assets/img/door_green_1.png');
        game.load.image('door_green_2', 'assets/img/door_green_2.png');
        game.load.image('door_black_1', 'assets/img/door_black_1.png');
        game.load.image('door_black_2', 'assets/img/door_black_2.png');
        game.load.image('low_health_fg', 'assets/img/low_health_fg.png');
        game.load.image('shooter_red', 'assets/img/shooter_red.png');
        game.load.image('shooter_blue', 'assets/img/shooter_blue.png');
        game.load.image('shooter_green', 'assets/img/shooter_green.png');
        game.load.image('shooter_black', 'assets/img/shooter_black.png');
        game.load.image('shooter_purple', 'assets/img/shooter_purple.png');
        game.load.spritesheet("spring", 'assets/img/spring_sheet.png', 128, 80, 14);
        game.load.image('mobile_shooter_path', 'assets/img/mobile_shooter_path.png');
        game.load.image('mobile_shooter_red', 'assets/img/mobile_shooter_red.png');
        game.load.image('mobile_shooter_blue', 'assets/img/mobile_shooter_blue.png');
        game.load.image('mobile_shooter_green', 'assets/img/mobile_shooter_green.png');
        game.load.image('mobile_shooter_black', 'assets/img/mobile_shooter_black.png');
        game.load.image('eyebot_red', 'assets/img/eyebot_red.png');
        game.load.image('eyebot_blue', 'assets/img/eyebot_blue.png');
        game.load.image('eyebot_green', 'assets/img/eyebot_green.png');
        game.load.spritesheet("sand_crumble", 'assets/img/sand_crumble.png', 64, 64, 6);
        game.load.spritesheet("black_crumble", 'assets/img/black_crumble.png', 64, 64, 6);
        game.load.spritesheet("white_crumble", 'assets/img/white_crumble.png', 64, 64, 6);
        game.load.spritesheet("mixed_crumble", 'assets/img/mixed_crumble.png', 64, 64, 6);
        game.load.image("roplate_red", 'assets/img/roplate_red.png');
        game.load.image("roplate_blue", 'assets/img/roplate_blue.png');
        game.load.image("roplate_green", 'assets/img/roplate_green.png');
        game.load.image("roplate_red_all", 'assets/img/roplate_red_all.png');
        game.load.image("roplate_blue_all", 'assets/img/roplate_blue_all.png');
        game.load.image("roplate_green_all", 'assets/img/roplate_green_all.png');
        game.load.spritesheet("colorchip_blue", 'assets/img/colorchip_blue.png', 32, 32, 20);
        game.load.spritesheet("colorchip_red", 'assets/img/colorchip_red.png', 32, 32, 20);
        game.load.spritesheet("colorchip_green", 'assets/img/colorchip_green.png', 32, 32, 20);
        game.load.spritesheet("powerchip_blue", 'assets/img/powerchip_blue.png', 32, 32, 20);
        game.load.spritesheet("powerchip_red", 'assets/img/powerchip_red.png', 32, 32, 20);
        game.load.image("small_star", 'assets/img/small_star.png');
        game.load.image("medium_star", 'assets/img/medium_star.png');
        game.load.image("artifact", 'assets/img/artifact.png');
        game.load.spritesheet("spaceship", 'assets/img/spaceship.png', 184, 311, 2);
        game.load.image("spaceship_damaged", 'assets/img/spaceship_damaged.png');
        game.load.image("spaceship_repaired", 'assets/img/spaceship_repaired.png');
        game.load.spritesheet("alien_red", 'assets/img/alien_red.png', 82, 143, 4);
        game.load.spritesheet("alien_hand_red", 'assets/img/alien_hand_red.png', 47, 34, 2);
        game.load.spritesheet("alien_eyes_red", 'assets/img/alien_eyes_red.png', 25, 21, 6);
        game.load.spritesheet("alien_eyes_red", 'assets/img/alien_eyes_red.png', 25, 21, 6);
        game.load.spritesheet("alien_smoke_red", 'assets/img/alien_smoke_red.png', 16, 16, 8);
        game.load.spritesheet("alien_smoke_white", 'assets/img/alien_smoke_white.png', 16, 16, 8);
        game.load.spritesheet("alien_smoke_purple", 'assets/img/alien_smoke_purple.png', 16, 16, 8);
        game.load.spritesheet("msg_advance_icon", 'assets/img/msg_advance_icon.png', 22, 20, 2);
        game.load.image("slider_red", 'assets/img/slider_red.png');
        game.load.image("slider_blue", 'assets/img/slider_blue.png');
        game.load.image("slider_green", 'assets/img/slider_green.png');
        game.load.spritesheet("portal", 'assets/img/portal.png', 90, 90, 9);
        game.load.image("gem_red", 'assets/img/gem_red.png');
        game.load.image("gem_blue", 'assets/img/gem_blue.png');
        game.load.image("gem_green", 'assets/img/gem_green.png');
        game.load.spritesheet("miner_sitting", 'assets/img/miner_sitting.png', 78, 78, 6);
        game.load.spritesheet("miner_scared", 'assets/img/miner_scared.png', 50, 58, 5);
        game.load.spritesheet("miner_standing", 'assets/img/miner_standing.png', 50, 82, 5);
        game.load.image("betashark", 'assets/img/betashark.png');
        
        game.load.spritesheet("midel_body", 'assets/img/midel_body.png', 128, 256, 4);
        game.load.spritesheet("midel_body_broken", 'assets/img/midel_body_broken.png', 128, 256, 4);
        game.load.spritesheet("midel_hand", 'assets/img/midel_hand.png', 47, 34, 2);
        game.load.spritesheet("midel_body", 'assets/img/midel_body.png', 128, 256, 1);
        game.load.spritesheet("midel_sword", 'assets/img/midel_sword.png', 71, 158, 6);
        game.load.spritesheet("midel_eyes", 'assets/img/midel_eyes.png', 51, 38, 1);
        game.load.spritesheet("midel_blood", 'assets/img/midel_blood.png', 26, 52, 7);
        
        game.load.image("griddy", 'assets/img/griddy.png');
        game.load.image("griddy_l1", 'assets/img/griddy_l1.png');
        game.load.image("griddy_l2", 'assets/img/griddy_l2.png');
        game.load.spritesheet("griddy_damage", 'assets/img/griddy_damage.png', 96, 96, 2);
        game.load.spritesheet("blackFlame", 'assets/img/blackFlame.png', 48, 48, 2);
        game.load.image("purple_smoke", 'assets/img/purple_smoke.png');
        game.load.spritesheet("griddy_damage", 'assets/img/griddy_damage.png', 96, 96, 2);
        
        game.load.spritesheet("final_boss", 'assets/img/final_boss.png', 720, 720, 3);
        game.load.spritesheet("final_hair", 'assets/img/final_hair.png', 720, 330, 2);
        game.load.image("final_eye", 'assets/img/final_eye.png');
        game.load.image("final_eye_glow", 'assets/img/final_eye_glow.png');
        game.load.spritesheet("final_eye_morph", 'assets/img/final_eye_morph.png', 70, 70, 5);
        game.load.image("final_blocker", 'assets/img/final_blocker.png');
        game.load.spritesheet("final_claw", 'assets/img/final_claw.png', 214, 164, 2);
        game.load.spritesheet("final_smoke", 'assets/img/final_smoke.png', 212, 212, 6);
        game.load.spritesheet("final_claw_smoke", 'assets/img/final_claw_smoke.png', 53, 53, 6);
        
        
        game.load.spritesheet("gem_pickup_red", 'assets/img/gem_pickup_red.png', 28, 28, 20);
        
        
        
        

	},

	create: function () {
        
        //not starting the game yet; wait until music is decoded
        
		this.preloadBar.cropEnabled = false; //since loading is done, no need for preload bar
        
        game.input.keyboard.onDownCallback = toggleFullscreen;
        
        //give text file to Messages
        FullGame.Messages.textFile = game.cache.getText("text");
        
    },

	update: function () {
        
        var musicDecoded = this.cache.isSoundDecoded('title') && this.cache.isSoundDecoded('colorchip');
        if (musicDecoded && !this.ready) {
			this.ready = true;
            FullGame.rooms = rooms;
            FullGame.Vars.fillDefaultValues();
            
            this.state.start("Title");
		}
        
	}

};

var toggleFullscreen = function() {
    if (game.input.keyboard.lastKey.keyCode == Phaser.Keyboard.F10) {
        toggleFullscreenF();
    }
}

var toggleFullscreenF = function() {
    if (game.scale.isFullScreen){
        if (game.scale.fullScreenScaleMode == Phaser.ScaleManager.SHOW_ALL){
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;
        } else {
            game.scale.stopFullScreen();
        }
    } else {
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.startFullScreen(true); //parameter is anti-aliasing
    }
}