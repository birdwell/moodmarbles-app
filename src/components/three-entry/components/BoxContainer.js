import {
    BoxGeometry,
    MeshBasicMaterial,
	BoxHelper,
	Mesh
} from 'three';

class BoxContainer {

    constructor(scene) {
        const boxGeo = new BoxGeometry(100, 100, 100);
        this.object = new Mesh(boxGeo, new MeshBasicMaterial(0x000000));
        const box = new BoxHelper(this.object, 0x000000);
        scene.add(box);
    }

    update() {

    }
}

export default BoxContainer;