
/**@class */
class _app extends PIXI.Application {
    /** The title of the book. */
    constructor() {
        super({
            width: 1920, 
            height: 1080,                       
            antialias: true, 
            transparent: false,
            resolution: 1,
            sharedTicker:true,
            backgroundColor: 0x303030
            // powerPreference: SLI&CrossFire GPU, TODO: study me
          });
          this.nwjs = this.isNwjs() && this.initNwjs();
          //this.nwjs.win.showDevTools() //auto-start devTool chromium
          document.body.onresize = () => { this.scaleToWindow() };
    };

    isNwjs() {
      return typeof require === 'function' && typeof process === 'object';
    };

    initNwjs() {
        let dw = 800 - window.innerWidth;
        let dh = 600 - window.innerHeight;
        let gui = require('nw.gui');
        let win = gui.Window.get();
        //FIXME: TRY FOCUSING ON THE APP, bug with vscode and chromium dev tool !
        //win.show();
        win.focus();
        //win.restore();
        //win.appWindow.focus();
        window.moveBy(-dw / 2, -dh / 2);
        window.resizeBy(dw, dh);
        if (process.platform === 'darwin' && !win.menu) {
            var menubar = new gui.Menu({ type: 'menubar' });
            var option = { hideEdit: true, hideWindow: true };
            menubar.createMacBuiltin('Game', option);
            win.menu = menubar;
        };
        return {gui,win};
    };

    requestFullScreen() {
        var element = document.body;
        if (element.requestFullScreen) {
            element.requestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
        this._fullScreen = true;
    };

    cancelFullScreen() {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        this._fullScreen = false;
    };
    

    scaleToWindow() {
        const canvas = this.view;
        let scaleX, scaleY, scale, center;
        scaleX = window.innerWidth / canvas.offsetWidth;
        scaleY = window.innerHeight / canvas.offsetHeight;
        scale = Math.min(scaleX, scaleY);
        canvas.style.transformOrigin = "0 0";
        canvas.style.transform = "scale(" + scale + ")";
        if (canvas.offsetWidth > canvas.offsetHeight) {
          if (canvas.offsetWidth * scale < window.innerWidth) { center = "horizontally" } 
          else { center = "vertically" };
        } else {
            if (canvas.offsetHeight * scale < window.innerHeight) { center = "vertically" } 
            else { center = "horizontally"; };
        };
        let margin;
        if (center === "horizontally") {
          margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
          canvas.style .marginTop = 0 + "px";canvas.style .marginBottom = 0 + "px";
          canvas.style .marginLeft = margin + "px";canvas.style .marginRight = margin + "px";
        };
        if (center === "vertically") {
          margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
          canvas.style .marginTop = margin + "px";canvas.style .marginBottom = margin + "px";
          canvas.style .marginLeft = 0 + "px";canvas.style .marginRight = 0 + "px";
        };
        canvas.style.paddingLeft = 0 + "px";canvas.style.paddingRight = 0 + "px";
        canvas.style.paddingTop = 0 + "px";canvas.style.paddingBottom = 0 + "px";
        canvas.style.display = "-webkit-inline-box";
        return scale;
    }; 

    // Get a ratio for resize in a bounds
    getRatio(obj, w, h) {
        let r = Math.min(w / obj.width, h / obj.height);
        return r;
    };

    hitCheck(a, b){ // colision
        var ab = a._boundsRect;
        var bb = b._boundsRect;
        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
    };


}; //END CLASS

let $app = new _app(); // new PIXI.Application
//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild($app.view);



document.addEventListener('contextmenu', event => event.preventDefault()); // disable nwjs right click
document.addEventListener('keydown', (event) => {
    if(event.keyCode === 115){ // F4
        return $app._fullScreen && $app.cancelFullScreen() || $app.requestFullScreen();
    };
    if(event.keyCode === 116){ // F5 refresh
        document.location.reload(true);
    };


    //TODO: REMOVE ME , is for debug pixi-projections
    const fpX = $camera._fpX;
    const fpY = $camera._fpY;
    const fpf = $camera._fpF;

    if(event.keyCode === 37){ // arowLeft
        $camera.pivot.x-=20;
        //TweenLite.to($camera, 1, { _fpX: fpX-120, ease: Power4.easeOut });
        //$camera.updateFarPointFromTarget(fpX-120);
    }
    if(event.keyCode === 38){ // arrowUp
        $camera.pivot.y-=20;
        //TweenLite.to($camera, 1, { _fpY: fpY-120, ease: Power4.easeOut });
        //$camera.updateFarPointFromTarget(null,fpY-120);
    }
    if(event.keyCode === 39){ // arrowRight
        $camera.pivot.x+=20;
        //TweenLite.to($camera, 1, { _fpX: fpX+120, ease: Power4.easeOut });
        //$camera.updateFarPointFromTarget(fpX+120);
    }
    if(event.keyCode === 40){ // arrowDown
        $camera.pivot.y+=20;
        //TweenLite.to($camera, 1, { _fpY: fpY+120, ease: Power4.easeOut });
        //$camera.updateFarPointFromTarget(null,fpY+120);
    }
    if(event.keyCode === 107){ // pad+
        const acc =  TweenLite.getTweensOf($camera).length;
        TweenLite.to($camera, 1, { _fpF: fpf+0.01+(0.04*acc), ease: Power4.easeOut });
        //$camera.updateFarPointFromTarget(null,null,fpf+0.1);
    }
    if(event.keyCode === 109){ // pad-
        const acc =  TweenLite.getTweensOf($camera).length;
        TweenLite.to($camera, 1, { _fpF: fpf-0.01-(0.04*acc), ease: Power4.easeOut });
        //TweenLite.to($camera, 0.5, { _fpf: fpf-0.1, ease: Power4.easeOut });
        //$camera.updateFarPointFromTarget(null,null,fpf-0.1);
    }
    if(event.keyCode === 100 || event.keyCode === 102){ // numpad 4||6 (lock the X _fpX)
        event.keyCode===100 && ($camera._fpX+=20);
        event.keyCode === 102 && ($camera._fpX-=20);
        //$camera._fpXLock = !$camera._fpXLock;
        //$camera.redrawDebugScreen();
    }
    if(event.keyCode === 104 || event.keyCode === 98){ // numpad 8||2 (lock the Y _fpY)
        event.keyCode===104 && ($camera._fpY+=20);
        event.keyCode === 98 && ($camera._fpY-=20);
    }
    if(event.keyCode === 101){ // numpad 5 reverse lock _fpY,_fpX
        window.prompt("Copy this to $camera.cameraSetup", 
        `{_fpX:${$camera._fpX.toFixed(2)},_fpY:${$camera._fpY.toFixed(2)},_fpF:${$camera._fpF.toFixed(2)},_zoom:${$camera._zoom.toFixed(2)}}`
        );
    }
});


