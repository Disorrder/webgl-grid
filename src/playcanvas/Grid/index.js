import vs from "./shader.vert";
import fs from "./shader.frag";

export class Grid extends pc.Entity {
    constructor() {
        super(...arguments);
        this.addComponent("model", {type: "plane"});
        this.model.material = new GridMaterial();
        let size = this.size = 100;
        this.setLocalScale(size*2, size*2, size*2);
        
        let app = this._app;
        this.distanceVec = new pc.Vec3();
        this.camera = app.root.findByName("Camera");
    }
}


export class GridMaterial extends pc.Material {
    constructor() {
        super();

        this.blend = true;
        this.blendSrc = pc.gfx.BLENDMODE_SRC_ALPHA;
        this.blendDst = pc.gfx.BLENDMODE_ONE_MINUS_SRC_ALPHA;
    }
    
    updateShader(device) {
        let shader = this.constructor.createShader(device);
        this.setShader(shader);
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

