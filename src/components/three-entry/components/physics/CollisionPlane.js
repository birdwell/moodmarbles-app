import {
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    TextureLoader
} from 'three';
import twitter from './twitter.svg';
import Vector from './Vector';

/** 
 * Defines a plane with which an object
 * can collide. Used as the floor of the container
*/
class CollisionPlane {
    constructor(scene, width, height, depth) {
        // Construct the geometry and mesh
        const boxGeo = new BoxGeometry(width, height, depth);
        this.object = new Mesh(
            boxGeo, 
            new MeshBasicMaterial({ 
                map: new TextureLoader().load(twitter)
            })
        );

        // Set the position
        this.object.position.y = -50;
        
        scene.add(this.object);

        // Set the normal
        this._n = this.calcNormal();
    }

    // unused
    update() {

    }

    // The normal is constant
    calcNormal() {
        return new Vector(0, 1, 0);
    }

    // Get the normal
    normal() {
        return this._n;
    }

    setNormal(v) {
        this._n = v;
    }

    setY(y) {
        this.object.position.y = y;
    }

    setX(x) {
        this.object.position.x = x;
    }
}

export default CollisionPlane;