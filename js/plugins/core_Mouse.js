/*:
// PLUGIN □────────────────────────────────□MOUSE INTERACTIVITY□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc MOUSE ENGINE
* V.0.1a
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
Controle tous ce qui est associer a la sourits, interaction avec player et camera engine
Initialise avantr le loader , seulement pendant la sceneBOOT
*/

// ┌-----------------------------------------------------------------------------┐
// GLOBAL $mouse CLASS: _mouse
//└------------------------------------------------------------------------------┘

//Graphics._renderer.plugins.interaction
//document.getElementById("GameCanvas").style.cursor = "none";

class _mouse extends PIXI.Container {
    constructor() {
        super();
        this.spine = null;
        this.screenX = 1920;
        this.screenY = 1080;
        this.interaction = null;//Graphics._renderer.plugins.interaction;
        this.light =  this.light_mouse =  new PIXI.lights.PointLight(0xffffff,0.8); 
        this.light.lightHeight = 0.03;
        this.light.falloff[0] = 1;

        this.mPos = new PIXI.Point(0,0); // mouse position value // this.interaction.mouse.global.x
        this.ease = 0.35;
    };
  };

//$mouse.sprite
$mouse = new _mouse();
console.log1('$mouse. ', $mouse);

//┌-----------------------------------------------------------------------------┐
// INITIALISE ONCE METHOD
// initialise mouse setup
//└-----------------------------------------------------------------------------┘
//$mouse.initialize()
_mouse.prototype.initialize = function() {
    this.interaction = Graphics._renderer.plugins.interaction;
    document.getElementById("GameCanvas").style.cursor = "none"; // hide win cursor
    this.interaction.cursorStyles.default = "none";
    this.interaction.cursorStyles.pointer = "none"
    this.addChild(this.light); // add light
    this.create_Sprites();
};


//create the sprite spine mouse and default animations
_mouse.prototype.create_Sprites = function() {
    const mouse = $Loader.Data2.gloves ? new PIXI.spine.Spine($Loader.Data2.gloves.spineData): void 0;
    if (!mouse) { return this.spine = new PIXI.Sprite() };

    mouse.skeleton.setSkinByName("point");
    mouse.state.setAnimation(0, 'idle', true);
    mouse.pivot.set(5,5);

    // global listener
    this.hitArea = []; // prevent sprite mouse interaction,
    /*this.interactive = true;
    this.on('mousemove', function(event) {
        // TODO: VOIR PIXI , POIR INTERACTION, le console debugage affiche pas , mais il ce peut que acced direct marche
        this.position.set(event.data.global.x, event.data.global.y);
        console.log('event.data.global.x: ', event.data.global.x);
    });*/
    // reference
    this.addChild(mouse);
    this.spine = mouse;


    document.addEventListener('mousemove', this.mouseMove.bind(this));

    
    // Tikers for easing the mouse
    const mouseTick = new PIXI.ticker.Ticker().add((delta) => {
        this.x += (this.mPos.x - this.x) * this.ease;
        this.y += (this.mPos.y - this.y) * this.ease;
    });
    //Game_Player.prototype.updateScroll = function(){}//disable scoll character in editor mode
    mouseTick.start();
    this.startTrail();
 };
 _mouse.prototype.mouseMove = function(e) {

     this.mPos.x = this.interaction.mouse.global.x;
     this.mPos.y = this.interaction.mouse.global.y;

 }
//┌-----------------------------------------------------------------------------┐
// MOUSE TRAIL
// 
//└-----------------------------------------------------------------------------┘
_mouse.prototype.startTrail = function(e) {
    var trailTexture = PIXI.Texture.fromImage('editor/trail.png')
    var historyX = []; var historyY = [];
    var historySize = 30;//historySize determines how long the trail will be.
    var ropeSize = 200; //ropeSize determines how smooth the trail will be.
    var points = [];
    //Create history array.
    for( var i = 0; i < historySize; i++){
        historyX.push(0); historyY.push(0);
    }
    //Create rope points.
    for(var i = 0; i < ropeSize; i++){points.push(new PIXI.Point(0,0))};
    //Create the rope
    var rope = new PIXI.mesh.Rope(trailTexture, points);
    rope._filters = [ new PIXI.filters.BlurFilter (3, 2)];
    rope.alpha = 0.6;
    this.mouseTrails = rope;

    const trailTiker = PIXI.ticker.shared.add((delta) => {
        historyX.pop();
        historyX.unshift(this.x);
        historyY.pop();
        historyY.unshift(this.y);
        for( var i = 0; i < ropeSize; i++){
            var p = points[i];
            var ix = cubicInterpolation( historyX, i / ropeSize * historySize);
            var iy = cubicInterpolation( historyY, i / ropeSize * historySize);
            p.x = ix; p.y = iy;
        }
    });
    function clipInput(k, arr){
        if (k < 0){k = 0;}
        if (k > arr.length - 1){  k = arr.length - 1;}
        return arr[k];
    };
    function getTangent(k, factor, array){return factor * (clipInput(k + 1, array) - clipInput(k - 1,array)) / 2;}
    function cubicInterpolation(array, t, tangentFactor){
        if (tangentFactor == null) tangentFactor = 1;
        var k = Math.floor(t);
        var m = [getTangent(k, tangentFactor, array), getTangent(k + 1, tangentFactor, array)];
        var p = [clipInput(k,array), clipInput(k+1,array)];
        t -= k;
        var t2 = t * t;
        var t3 = t * t2;
        return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + ( -2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
    };

}

//┌-----------------------------------------------------------------------------┐
// HACK RMMV GRAFIC LISTENER
// because removed video canvas, and f4 screen scale
//└-----------------------------------------------------------------------------┘

Graphics._setupEventHandlers = function() {
    window.addEventListener('resize', this._onWindowResize.bind(this));
    document.addEventListener('keydown', this._onKeyDown.bind(this)); // F4
    //document.addEventListener('keydown', this._onTouchEnd.bind(this));
   // document.addEventListener('mousedown', this._onTouchEnd.bind(this));
   // document.addEventListener('touchend', this._onTouchEnd.bind(this));
};