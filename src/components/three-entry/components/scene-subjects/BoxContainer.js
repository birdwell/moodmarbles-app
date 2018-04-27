import {
    BoxGeometry,
    MeshBasicMaterial,
	BoxHelper,
	Mesh
} from 'three';

import { Vector } from '../physics';

/** 
 * Represents the container for the marbles
*/
class BoxContainer {
    constructor(scene, width, height, depth) {
        // Construct the geometry
        const boxGeo = new BoxGeometry(width, height, depth);
        this.object = new Mesh(boxGeo, new MeshBasicMaterial(0x000000));
        const box = new BoxHelper(this.object, 0x000000);
        scene.add(box);

        // Set the normal
        this._n = this.calcNormal();
    }

    // unused
    update() {

    }

    calcNormal() {
        // var vertices = this.object.geometry.vertices;
        // var corn1Vec = new Vector(vertices[3].x, vertices[3].y, vertices[3].z);
        // var corn2Vec = new Vector(vertices[7].x, vertices[7].y, vertices[7].z);
        // var corn3Vec =  new Vector(vertices[2].x, vertices[2].y, vertices[2].z);
        // var bma = Vector.subtract(corn2Vec, corn1Vec);
        // var cma = Vector.subtract(corn3Vec, corn1Vec);
        // var _cross = math.cross(bma.asArray(), cma.asArray());
        // return _cross;

        // THe normal for the conatiner is constant
        return new Vector(0, 1, 0);
    }

    // Get the normal
    normal() {
        return this._n;
    }
}

export default BoxContainer;
