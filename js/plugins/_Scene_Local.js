/*:
// PLUGIN □────────────────────────────────□ Scene_Local □─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Scene_Local
* V.1.0
* License:© M.I.T

└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
NOTE AND HELP:
    this.CAGE_MOUSE.name = "CAGE_MOUSE";
    this.CAGE_MAP.name = "CAGE_MAP";
    this.CAGE_GUI.name = "CAGE_GUI";
*/

function Scene_Local(loaderSets,callBackScene,firstTime) {
    this.initialize.apply(this, arguments);
}

Scene_Local.prototype = Object.create(Scene_Base.prototype);
Scene_Local.prototype.constructor = Scene_Local;

Scene_Local.prototype.initialize = function(loaderSets,callBackScene,firstTime) {
    Scene_Base.prototype.initialize.call(this,"Scene_Local_data"); // pass loaderset for setup Scene ambiant
    this.mX = 0;
    this.mY = 0;
    this.currentHoverFlag = null; // when mouse are hover a flag
    this.waitReady = 30; // stabiliser
};

Scene_Local.prototype.create = function() {
    const bgName = $Loader.loaderSet.Scene_Local_data.SCENE.BackGround || false;
    this.createBackground(bgName); //TODO: METTRE DANS BASE SCENE
    this.create_ObjFromJson(); //TODO: METTRE DANS BASE SCENE

    this.setupFlags();
    this.setupAvatarLocal();
    this.createTitleTexte();
};

// create Objs from json
Scene_Local.prototype.create_ObjFromJson = function() { //TODO: METTRE DANS BASE SCENE
    $Objs.createFromList($Loader.loaderSet.Scene_Local_data.OBJS);
    $Objs.list_master.length && this.CAGE_MAP.addChild(...$Objs.list_master);
    $Objs.list_master.forEach(cage => { cage.getBounds() }); //TODO: BOUND MAP zoom pivot ... 
};


// allow pass a sting reference data, or a full Data //TODO: METTRE DANS BASE SCENE
Scene_Local.prototype.createBackground = function(bgName) {
    if(this.Background){
        this.CAGE_MAP.removeChild(this.Background);
    };
    const cage = new PIXI.Container();
    if(bgName){
        const data = typeof bgName === 'string' && $Loader.Data2[bgName] || bgName;
        //const data = _data || $Loader.reg._misc._bg.backgroud; // bg
        const sprite_d = new PIXI.Sprite(data.textures);
        const sprite_n = new PIXI.Sprite(data.textures_n);
        // asign group display
        sprite_d.parentGroup = PIXI.lights.diffuseGroup;
        sprite_n.parentGroup = PIXI.lights.normalGroup;
        cage.parentGroup = $displayGroup.group[0];
        cage.addChild(sprite_d, sprite_n);
    };

    cage.name = typeof bgName === 'string' &&  bgName || bgName && bgName.name || false;
    // parenting
    this.CAGE_MAP.addChildAt(cage,0); // at 0 ?
    // reference
    this.Background = cage;
};

//get flags, and setup
Scene_Local.prototype.setupFlags = function() {
    function asignText(id){
        switch (id) { // return code langue + translate
            case "ara": return ["ara","العربية "]; break;
            case "en-us": return ["en-us","English"]; break;
            case "fr-ca": return ["fr-ca","Français"]; break;
            case "ger": return ["ger","Deutsch"]; break;
            case "ru": return ["rus","русский язык"]; break;
            case "ch": return ["chi","中国语文"]; break;
            case "jp": return ["jpn","日本語"]; break;
            case "sp": return ["spa","Español"]; break;
        };
    };
    const style = new PIXI.TextStyle({
        dropShadow: true,
        dropShadowAlpha: 0.2,
        dropShadowAngle: 0,
        dropShadowBlur: 18,
        dropShadowColor: "white",
        dropShadowDistance: 0,
        fill: "white",
        fontFamily: "\"Arial Black\", Gadget, sans-serif",
        fontSize: 18,
        letterSpacing: 1,
        lineJoin: "round",
        padding: 12,
        strokeThickness: 8
    });
    const flags = $Objs.getsByID('flags');
    flags.forEach(flag => {
        const text_language = asignText(flag.TexName);
        const txt = new PIXI.Text(text_language, style);
        txt.anchor.set(0.5,0)
        flag.addChild(txt);
        flag.loop = false;
        flag.text_language = text_language;
    });
    this.Flags = flags;
   
};

Scene_Local.prototype.createTitleTexte = function() {
    //TODO: PREND TEXY DANS $CORETEXT, creer un class text animations, gerer les local text
    // delete me , just pour example
    const style = new PIXI.TextStyle({
        dropShadow: true,
        dropShadowAlpha: 0.2,
        dropShadowAngle: 0,
        dropShadowBlur: 18,
        dropShadowColor: "white",
        dropShadowDistance: 0,
        fill: "white",
        fontFamily: "\"Arial Black\", Gadget, sans-serif",
        fontSize: 18,
        letterSpacing: 1,
        lineJoin: "round",
        padding: 12,
        strokeThickness: 8
    });
    // title traduit
    const txt = new PIXI.Text(`PLEASE SELECT YOUR LANGUAGE`, style); 
    txt.pivot.x = txt.width/2;
    txt.x = SceneManager._boxWidth/2;
    txt.y = SceneManager._boxHeight/5*3;
    this.CAGE_MAP.addChild(txt);
    this.titleSelect = txt;
};

Scene_Local.prototype.setupAvatarLocal = function() {
    const avatar = $Objs.getsByName("Hero1_Big");
    if(avatar){
        avatar.scale.set(2,2);
        avatar.Sprites.d.state.setAnimation(0, 'idle', true);
        avatar.Sprites.d.state.setAnimation(2, 'hair_idle1', true);
        avatar.Sprites.d.stateData.defaultMix = 0.2;
        //reference
        this.avatar1 = avatar;
    };
};

Scene_Local.prototype.isReady = function() {
    // check scene stabilisator // TODO:
    Graphics.render(this); // force spike lag
    this.waitReady--;
   return !this.waitReady;
};

// start Loader
Scene_Local.prototype.start = function() {
   
};

Scene_Local.prototype.update = function() {
    if(!this.busy){
        const mX = $mouse.x, mY = $mouse.y;
        this.update_Light(mX,mY);
        this.update_Flags(mX,mY);
    };
};



// scene mouse update
Scene_Local.prototype.update_Light = function(mX,mY) {
    this.light_sunScreen.x =  mX, this.light_sunScreen.y = mY;
};

// scene mouse update
Scene_Local.prototype.update_Flags = function(mX,mY) {
    this.Flags;
    let valueIn;
    for (let i = 0, l = this.Flags.length; i < l; i++) {
        const flag = this.Flags[i];
        if(flag._boundsRect.contains(mX, mY)){
            if(flag.TexName === (this.__inFlag && this.__inFlag.TexName) ){ return };
            // if flag was selected , play reverse   
            if(this.__inFlag){
                this.__inFlag.animationSpeed = -2;
                this.__inFlag.play();
            };
            flag.animationSpeed = 1;
            flag.play();
            this.__inFlag = flag;
            // avatar //TODO: CREER UNE CLASS SPINE CONTAINER
            this.avatar1.Sprites.d.skeleton.setSkinByName(flag.text_language[0]);
            this.avatar1.Sprites.d.skeleton.setSlotsToSetupPose();
            this.avatar1.Sprites.d.state.setAnimation(1, flag.text_language[0], true)
            break;
        };
    };
};

// onMouseDown for this scene
Scene_Local.prototype.onMouseDown = function(event) {

};

// onMouseup for this scene
Scene_Local.prototype.onMouseup = function(event) {
    if(this.__inFlag){
        this.event1(this.__inFlag);
    }
   /* const selected = this.currentHoverFlag;
   if(this.currentHoverFlag && selected._boundsRect.contains(this.mX, this.mY) ){
        this.event1(selected);
   }
*/
};

// flag selected, close scene with animation //TODO:    
// problem detuit texture , mais les atlas reste.
Scene_Local.prototype.event1 = function(flag) {
    console.log('flag: ', flag);
    this.busy = true;
    SceneManager.goto(Scene_Loader,"Scene_Title_data",Scene_Title);
};
