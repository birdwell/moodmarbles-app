import {
	TextureLoader,
	Mesh,
	Raycaster,
	SphereGeometry,
	ShaderMaterial
} from 'three';
import { getRandomInt } from '../../../utils';
import { Vector } from '../physics';
import { variance } from '../../../utils';

import sadness from '../assets/sad.svg';
import joy from '../assets/joy.png';
import anger from '../assets/angry.png';
import fear from '../assets/fear.png';
import disgust from '../assets/disgust.jpg';

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
		const radius = tweet.magnitude * 10;
		const geometry = new SphereGeometry(radius, 10, 10);
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
		const position = new Vector(getRandomInt(-50, 50), 200, getRandomInt(-50, 50));
		this.object.position.x = position.x;
		this.object.position.y = position.y;
		this.object.position.z = position.z;

		this.velocity = new Vector(0, 0, 0);
		this.past_positions = [];

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
		const normal = obj.normal();
		const _dot = Vector.dot(this.velocity, normal);
		normal.scale(2*_dot);
		const result = Vector.subtract(this.velocity, normal);

		this.velocity.x = result.x;
		this.velocity.y = result.y;
		this.velocity.z = result.z;
		this.velocity.scale(0.8);
	}

	getCollisions(objects) {
		const _objs = []
		objects.forEach( x=> {
			_objs.push(x.object);
		});
		for (let vertexIndex = 0; vertexIndex < this.object.geometry.vertices.length; vertexIndex++) {
			const o_p = this.object.position.clone();
			const _v = this.object.geometry.vertices[vertexIndex].clone();
			const g_v = _v.applyMatrix4(this.object.matrix);
			const d_v = g_v.sub(this.object.position);

			const ray = new Raycaster(o_p, d_v.clone().normalize());
			const results = ray.intersectObjects(_objs);
			if(results.length > 0 && results[0].distance < d_v.length()) {
				this.reflect(objects[0]);
				break;
			}
		}
	}

	update(elapsedTime, collidables) {
		const aggregate = new Vector(0,0,0);
		this.forces.forEach(x => {
			aggregate.x += x.x;
			aggregate.y += x.y;
			aggregate.z += x.z;
		});
		aggregate.scale(this.mass);
		this.velocity.add(aggregate);
		this.past_positions.push(Math.abs(this.getPosition().getMagnitude()));
		if(this.past_positions.length > 60) {
			this.past_positions.shift();
		}
		var change = variance(this.past_positions);
		if(change < 0.15 && this.past_positions.length == 60) {
			this.velocity.becomeZero();
		}
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