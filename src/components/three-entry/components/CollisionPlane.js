import {
    BoxGeometry,
    MeshBasicMaterial,
    MeshPhongMaterial,
	BoxHelper,
	Mesh
} from 'three';

import Vector from './Vector';

class CollisionPlane {
    constructor(scene, width, height, depth) {
        const boxGeo = new BoxGeometry(width, height, depth);
        this.object = new Mesh(boxGeo, new MeshPhongMaterial({
            color: 0xFF0000
        }));
        this.object.position.y = -50;
        scene.add(this.object);

        this._n = this.calcNormal();
    }

    update() {

    }

    calcNormal() {
        return new Vector(0, 1, 0);
    }

    normal() {
        return this._n;
    }
}

export default CollisionPlane;