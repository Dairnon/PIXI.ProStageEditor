
PIXI.ContainerAnimations = (function () {
    class ContainerAnimations extends PIXI.Container {
        constructor() {
            super();
        };
        get animationSpeed() { return this.Sprites.d.animationSpeed };
        set animationSpeed(value) { this.Sprites.d.animationSpeed = value };
        get loop() { return this.Sprites.d.loop };
        set loop(value) { this.Sprites.d.loop = value };
        get playing() { return this.Sprites.d.playing };
        set playing(value) { this.Sprites.d.playing = value };
        get currentFrame() { return this.Sprites.d.currentFrame };
        set currentFrame(value) { this.Sprites.d.currentFrame = value };
        get totalFrames() { return this.Sprites.d.totalFrames };
        set totalFrames(value) { this.Sprites.d.totalFrames = value };

    };
    
    ContainerAnimations.prototype.addNormal = function(tex_n) {
        const sprite_n = new PIXI.Sprite(tex_n[this.currentFrame || 0]);
        this.Sprites.d.sprite_n = sprite_n;
        this.updateTextureDN.call(this.Sprites.d, tex_n); // replace update
        return sprite_n;
    };

    // replace update with a special updater for Diffuse with Normal (call) // HACK FOR TEXTURES NORMAL DIFFUSE
    ContainerAnimations.prototype.updateTextureDN = function(tex_n) {
        this.updateTexture = function updateTexture() {
            this._texture = this._textures[this.currentFrame];// update diffuse textures
            this.cachedTint = 0xFFFFFF;
            this._textureID = -1;

            this.sprite_n._texture = tex_n[this.currentFrame];// update normal textures
            this.sprite_n._textureID = -1;
            
            if (this.onFrameChange) {
                this.onFrameChange(this.currentFrame);
            };
        };
    };

    ContainerAnimations.prototype.play = function(frame) {
       if(isFinite(frame)){
            this.Sprites.d.gotoAndPlay(0);
       }else{
            this.Sprites.d.play();
       };
    };



//END
return ContainerAnimations;
})();








