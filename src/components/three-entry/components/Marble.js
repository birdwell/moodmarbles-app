import {
	SphereGeometry,
	MeshPhongMaterial,
	Mesh
} from 'three';
import { getRandomInt } from '../../utils';
import Vector from './Vector';

const mood = {
	sadness: 0xf1c40f,
	joy: 0x3498db,
	anger: 0xe74c3c
};

class Marble {

	constructor(scene, tweet) {
		const sphereGeometry = new SphereGeometry(2, 10, 10);
		const phongMaterial = new MeshPhongMaterial({
			color: mood[tweet.emotion]
		});
		this.object = new Mesh(sphereGeometry, phongMaterial);

		// Initial Position
		const position = new Vector(getRandomInt(-50, 50), 0, getRandomInt(-50, 50));
		this.object.position.x = position.x;
		this.object.position.y = position.y;
		this.object.position.z = position.z;

		// Give object a mass
		this.mass = tweet.magnitude;

		// Initialize forces
		this.forces = []

		this.isMarble = true;

		scene.add(this.object);
	}

	addForce (force) {
		this.forces.push(force);
	}

	adjustPosition(delta) {
		delta.scale(this.mass);
		this.object.position.x += delta.x;
		this.object.position.y += delta.y;
		this.object.position.z += delta.z;
	}

	update() {
		var aggregate = new Vector(0,0,0);
		this.forces.forEach(x => {
			aggregate.x += x.x;
			aggregate.y += x.y;
			aggregate.z += x.z;
		});
		this.adjustPosition(aggregate);
	}

	getPosition() {
		return new Vector(this.object.position.x, this.object.position.y, this.object.position.z);
	}
}

export default Marble;