import {
	IcosahedronGeometry,
	MeshStandardMaterial,
	TextureLoader,
	DoubleSide,
	NearestFilter,
	RepeatWrapping,
	Mesh,
	Raycaster
} from 'three';
import { getRandomInt } from '../../utils';
import Vector from './Vector';
import alpha from './alpha.png';

const mood = {
	sadness: 0xf1c40f,
	joy: 0x3498db,
	anger: 0xe74c3c
};

class Marble {

	constructor(scene, tweet) {
		const sphereGeometry = new IcosahedronGeometry(3, 2);
		const material = new MeshStandardMaterial({
			color: mood[tweet.emotion],
			emissiveMap: new TextureLoader().load(alpha),
			transparent: true,
			side: DoubleSide,
			alphaTest: 0.1
		});

		let alphaMap = new TextureLoader().load(alpha);
		material.alphaMap = alphaMap;
		material.alphaMap.magFilter = NearestFilter;
		material.alphaMap.wrapT = RepeatWrapping;
		material.alphaMap.repeat.y = 1;

		this.object = new Mesh(sphereGeometry, material);

		// Initial Position
		const position = new Vector(getRandomInt(-50, 50), 0, getRandomInt(-50, 50));
		this.object.position.x = position.x;
		this.object.position.y = position.y;
		this.object.position.z = position.z;

		this.velocity = new Vector(0, 0, 0);

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

	adjustPosition() {
		this.object.position.x += this.velocity.x;
		this.object.position.y += this.velocity.y;
		this.object.position.z += this.velocity.z;
	}

	getCollisions(objects) {
		var _objs = []
		objects.forEach( x=> {
			_objs.push(x.object);
		});
		for (var vertexIndex = 0; vertexIndex < this.object.geometry.vertices.length; vertexIndex++) {
			var o_p = this.object.position.clone();
			var _v = this.object.geometry.vertices[vertexIndex].clone();
			var g_v = _v.applyMatrix4(this.object.matrix);
			var d_v = g_v.sub(this.object.position);

			var ray = new Raycaster(o_p, d_v.clone().normalize());
			var results = ray.intersectObjects(_objs);
			if(results.length > 0 && results[0].distance < d_v.length()) {
			}
		}
	}

	update(elapsedTime, collidables) {
		var aggregate = new Vector(0,0,0);
		this.forces.forEach(x => {
			aggregate.x += x.x;
			aggregate.y += x.y;
			aggregate.z += x.z;
		});
		aggregate.scale(this.mass);
		this.velocity.add(aggregate);
		this.getCollisions(collidables);
		this.adjustPosition();
		this.object.material.alphaMap.offset.y = elapsedTime * 0.15;

	}

	getPosition() {
		return new Vector(this.object.position.x, this.object.position.y, this.object.position.z);
	}

	setPosition(newPos) {
		this.object.position.x = newPos.x;
		this.object.position.y = newPos.y;
		this.object.position.x = newPos.z;
	}
}

export default Marble;