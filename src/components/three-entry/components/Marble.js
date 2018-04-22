import {
	IcosahedronGeometry,
	MeshStandardMaterial,
	TextureLoader,
	DoubleSide,
	NearestFilter,
	RepeatWrapping,
	Mesh,
	Raycaster,
	SphereGeometry,
	Texture,
	ShaderMaterial
} from 'three';
import { getRandomInt } from '../../utils';
import Vector from './Vector';
import alpha from './alpha.png';

import sadness from './assets/sad.png';
import joy from './assets/joy.png';
import anger from './assets/angry.png';
import fear from './assets/fear.png';
import disgust from './assets/disgust.jpg';

const mood = {
	sadness,
	joy,
	anger,
	fear,
	disgust
};

class Marble {

	constructor(scene, tweet) {
		const texture = new TextureLoader().load(mood[tweet.emotion]);
		const geometry = new SphereGeometry(5, 10, 10);
		const uniforms = {
			"texture": { type: "t", value: texture }
		};

		// material
		const material = new ShaderMaterial({
			uniforms: uniforms,
			vertexShader: document.getElementById('vertex_shader').textContent,
			fragmentShader: document.getElementById('fragment_shader').textContent
		});
		this.object = new Mesh(geometry, material);
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

	reflect(obj) {
		var normal = obj.normal();
		var _dot = Vector.dot(this.velocity, normal);
		normal.scale(2*_dot);
		var result = Vector.subtract(this.velocity, normal);
		this.velocity.x = result.x;
		this.velocity.y = result.y;
		this.velocity.z = result.z;
		this.velocity.scale(0.8);
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
				this.reflect(objects[0]);
				break;
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