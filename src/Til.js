//Til is constants for tiles
FullGame.Til = {};

//type emumeration
FullGame.Til.NO_COL = 0; //tile with no collision (like a background tile)
FullGame.Til.NORMAL = 1; //normal tile.  Has collision, sides can be different colors.  Can be destroyed by thick laser
FullGame.Til.GLASS = 2; //glass tile that lets lasers go through
FullGame.Til.SAND = 3; //tile that crumbles if laser points at it enough
FullGame.Til.INDESTRUCTABLE = 4; //tile that can't be destroyed by thick laser

//color enumeration
FullGame.Til.BLACK = 0;
FullGame.Til.WHITE = 1;
FullGame.Til.RED = 2;
FullGame.Til.GREEN = 3;
FullGame.Til.BLUE = 4;
FullGame.Til.PURPLE = 5;

//laser type enumeration
FullGame.Til.LASER_NORMAL = 0;
FullGame.Til.LASER_TRANSPARENT = 1;
FullGame.Til.LASER_THICK = 2;
FullGame.Til.LASER_FADEOUT = 3;

FullGame.Til.TILE_DESTROY_DURATION = .15; //amount of time tile needs to be pressured before it's destroyed

FullGame.Til.propToString = function(type, topColor, rightColor, bottomColor, leftColor) {
     return String.fromCharCode(type+65) +
        String.fromCharCode(topColor+65) +
        String.fromCharCode(rightColor+65) +
        String.fromCharCode(bottomColor+65) +
        String.fromCharCode(leftColor+65);
};

FullGame.Til.tileType = function(tileString) {
    if (tileString == "") return FullGame.Til.NO_COL;
    return tileString.charCodeAt(0)-65;
};
FullGame.Til.tileTopColor = function(tileString) {
    if (tileString == "") return FullGame.Til.BLACK;
    return tileString.charCodeAt(1)-65;
};
FullGame.Til.tileRightColor = function(tileString) {
    if (tileString == "") return FullGame.Til.BLACK;
    return tileString.charCodeAt(2)-65;
};
FullGame.Til.tileBottomColor = function(tileString) {
    if (tileString == "") return FullGame.Til.BLACK;
    return tileString.charCodeAt(3)-65;
};
FullGame.Til.tileLeftColor = function(tileString) {
    if (tileString == "") return FullGame.Til.BLACK;
    return tileString.charCodeAt(4)-65;
};

//basically just calls Til.tileType()
FullGame.Til.tileHasCollision = function(tileString, thickLaser) {
    var type = FullGame.Til.tileType(tileString);
    switch (type){
    case FullGame.Til.NO_COL:
    case FullGame.Til.GLASS:
    default:
        return false;
    case FullGame.Til.SAND: //note: if fired by thick laser it will go through sand as if it didn't collide
        //return !thickLaser; //mechanic not working
    case FullGame.Til.NORMAL:
    case FullGame.Til.INDESTRUCTABLE:
        return true;
    }
};

FullGame.Til.willReflect = function(laserColor, wallColor) {
    if (laserColor == wallColor) return true;
    if (wallColor == FullGame.Til.WHITE && laserColor != FullGame.Til.BLACK) return true;
    return false;
};




