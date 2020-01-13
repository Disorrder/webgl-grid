import "./style.styl";

class Application extends pc.Application {
    constructor() {
        super(...arguments);
        this.start();

        this.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        this.setCanvasResolution(pc.RESOLUTION_AUTO);
        
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
}

import {Grid} from "./Grid";

let app = new Application(document.getElementById('canvas'), {});
require("./lib");

let camera = new pc.Entity('Camera');
camera.addComponent('camera', {
    clearColor: new pc.Color(0.1, 0.1, 0.1)
});
camera.setPosition(0, 2, 3);
camera.lookAt(app.root.getPosition());
camera.addComponent("script");
camera.script.create("orbitCamera", {

});
camera.script.create("mouseInput", {

});
camera.script.create("touchInput", {

});
app.root.addChild(camera);

let light = new pc.Entity('light');
light.addComponent('light');
light.setEulerAngles(45, 0, 0);
app.root.addChild(light);

let cube = new pc.Entity('cube');
cube.addComponent('model', {type: 'box'});
app.root.addChild(cube);

let grid = new Grid("Grid");
app.root.addChild(grid);

console.log(grid);

