import {
    TextureLoader,
    Mesh,
    Raycaster,
    SphereGeometry,
    ShaderMaterial
} from 'three';
import { getRandomInt, variance } from '../../../utils';
import { Vector } from '../physics';

import sadness from '../assets/sad.png';
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

export default (scene, tweet) => {
    const texture = new TextureLoader().load(mood[tweet.emotion]);
    const radius = tweet.magnitude * 10;
    const geometry = new SphereGeometry(radius, 10, 10);
    const uniforms = { texture: { type: 't', value: texture } };

    // material
    const material = new ShaderMaterial({
        uniforms,
        vertexShader: document.getElementById('vertex_shader').textContent,
        fragmentShader: document.getElementById('fragment_shader').textContent
    });

    const marble = new Mesh(geometry, material);
    const position = new Vector(
        getRandomInt(-50, 50),
        200,
        getRandomInt(-50, 50)
    );
    const velocity = new Vector(0, 0, 0);
    const past_positions = [];
    const mass = tweet.magnitude;
    const forces = [];
    const isMarble = true;

    marble.position.x = position.x;
    marble.position.y = position.y;
    marble.position.z = position.z;

    scene.add(marble);

    function addForce(force) {
        forces.push(force);
    }

    function adjustPosition() {
        marble.position.x += velocity.x;
        marble.position.y += velocity.y;
        marble.position.z += velocity.z;
    }

    function reflect(obj) {
        const normal = obj.normal();
        const _dot = Vector.dot(velocity, normal);
        normal.scale(2 * _dot);
        const result = Vector.subtract(velocity, normal);

        velocity.x = result.x;
        velocity.y = result.y;
        velocity.z = result.z;
        velocity.scale(0.8);
    }

    function getCollisions(objects) {
        const _objs = [];
        objects.forEach((x) => {
            _objs.push(x.object);
        });
        for (
            let vertexIndex = 0;
            vertexIndex < marble.geometry.vertices.length;
            vertexIndex += 1
        ) {
            const o_p = marble.position.clone();
            const _v = marble.geometry.vertices[vertexIndex].clone();
            const g_v = _v.applyMatrix4(marble.matrix);
            const d_v = g_v.sub(marble.position);

            const ray = new Raycaster(o_p, d_v.clone().normalize());
            const results = ray.intersectObjects(_objs);
            if (results.length > 0 && results[0].distance < d_v.length()) {
                reflect(objects[0]);
                break;
            }
        }
    }

    function getPosition() {
        return new Vector(
            marble.position.x,
            marble.position.y,
            marble.position.z
        );
    }

    function setPosition(newPos) {
        marble.position.x = newPos.x;
        marble.position.y = newPos.y;
        marble.position.x = newPos.z;
    }

    function update(elapsedTime, collidables) {
        const aggregate = new Vector(0, 0, 0);
        forces.forEach((x) => {
            aggregate.x += x.x;
            aggregate.y += x.y;
            aggregate.z += x.z;
        });
        aggregate.scale(mass);
        velocity.add(aggregate);
        past_positions.push(Math.abs(getPosition().getMagnitude()));
        if (past_positions.length > 60) {
            past_positions.shift();
        }
        const change = variance(past_positions);
        if (change < 0.15 && past_positions.length === 60) {
            velocity.becomeZero();
        }
        getCollisions(collidables);
        adjustPosition();
    }

    return {
        update,
        marble,
        isMarble,
        addForce,
        reflect,
        adjustPosition,
        getCollisions,
        getPosition,
        setPosition
    };
};
