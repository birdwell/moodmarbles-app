import {
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    TextureLoader
} from 'three';
import twitter from './twitter.svg';
import Vector from './Vector';

class CollisionPlane {
    constructor(scene, width, height, depth) {
        const boxGeo = new BoxGeometry(width, height, depth);
        this.object = new Mesh(
            boxGeo, 
            new MeshBasicMaterial({ 
                map: new TextureLoader().load(twitter)
            })
        );
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