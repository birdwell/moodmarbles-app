import * as THREE from 'three';

export default scene => {
    const group = new THREE.Group();

    // group.add();
    scene.add(group);

    function update(time, collidables) {	
    }

    return {
        update
    };
};
