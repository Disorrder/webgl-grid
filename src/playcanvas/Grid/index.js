import vs from "./shader.vert";
import fs from "./shader.frag";

export class Grid extends pc.Entity {
    constructor() {
        super(...arguments);
        this.addComponent("model", {type: "plane"});
        this.model.material = new GridMaterial();
        let size = 10;
        this.model.material.divisions = size*2;
        this.setLocalScale(size, size, size);
        
        let app = this._app;
        this.distanceVec = new pc.Vec3();
        this.camera = app.root.findByName("Camera");

        app.on("update", this.update.bind(this));
        app.graphicsDevice.on('resizecanvas', this.resize.bind(this));
    }

    update(dt) {
        this.updateMaterial();
    }
    
    updateMaterial() {
        this.distanceVec.sub2(this.camera.getPosition(), this.getPosition());
        this.model.material.distance = this.distanceVec.length();
    }

    resize() {
        let {width, height} = this._app.graphicsDevice.clientRect;
        this.model.material.resolution.set(width, height);
        this.model.material.updateUniforms();
        console.log(this.model.material.resolution);
    }
}


export class GridMaterial extends pc.Material {
    constructor() {
        super();

        this.blend = true;
        this.blendSrc = pc.gfx.BLENDMODE_SRC_ALPHA;
        this.blendDst = pc.gfx.BLENDMODE_ONE_MINUS_SRC_ALPHA;

        this.divisions = 10;
        this.color = new pc.Color(1, 0, 0, 0.3);
        this.resolution = new pc.Vec2();
    }
    
    updateShader(device) {
        let shader = this.constructor.createShader(device);
        this.setShader(shader);
    }

    updateUniforms() {
        this.clearParameters();
        this.setParameter("uDivisions", this.divisions);
        this.setParameter("uColor", this.color.data);
        this.setParameter("resolution", this.resolution.data);        
    }


    static createShader(device) {
        if (this.shader) return this.shader;
        return this.shader = new pc.Shader(device, {
            vshader: vs,
            fshader: fs,
            attributes: {
                vertex_position: pc.SEMANTIC_POSITION,
                vertex_texCoord0: pc.SEMANTIC_TEXCOORD0,
            },
        })
    }
}

