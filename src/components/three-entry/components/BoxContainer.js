import {
    BoxGeometry,
    MeshBasicMaterial,
	BoxHelper,
	Mesh
} from 'three';

export default scene => {
	const boxGeo = new BoxGeometry(100, 100, 100);
	const object = new Mesh(boxGeo, new MeshBasicMaterial(0x000000));
	const box = new BoxHelper(object, 0x000000);
	scene.add(box);

    function update(time) {
    }

    return {
        update
    };
};
