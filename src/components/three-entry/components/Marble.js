import {
	SphereGeometry,
	MeshPhongMaterial,
	Mesh
} from 'three';
import { getRandomInt } from '../../utils';

const mood = {
	sadness: 0xf1c40f,
	joy: 0x3498db,
	anger: 0xe74c3c
};

export default (scene, tweet) => {
	const sphereGeometry = new SphereGeometry(2, 10, 10);
	const phongMaterial = new MeshPhongMaterial({
		color: mood[tweet.emotion]
	});
	const marble = new Mesh(sphereGeometry, phongMaterial);

	// Initial Position
	marble.position.x = getRandomInt(-50, 50);
	marble.position.y = 0;
	marble.position.z = getRandomInt(-50, 50);

	scene.add(marble);

    function update(time) {	
    }

    return {
        update
    };
};
