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

/**
 * Export object representing a marble
 */
export default (scene, tweet) => {
    // Load the appropriate mood texture
    const texture = new TextureLoader().load(mood[tweet.emotion]);
    // Set the radius relative to the magnitiude of emotion
    const radius = tweet.magnitude * 10;

    // Create the geometry and mesh
    const geometry = new SphereGeometry(radius, 10, 10);
    const uniforms = { texture: { type: 't', value: texture } };

    // material
    const material = new ShaderMaterial({
        uniforms,
        vertexShader: document.getElementById('vertex_shader').textContent,
        fragmentShader: document.getElementById('fragment_shader').textContent
    });

    const marble = new Mesh(geometry, material);

    // Set random position
    const position = new Vector(
        getRandomInt(-50, 50),
        200,
        getRandomInt(-50, 50)
    );

    // Start velocity at 0
    const velocity = new Vector(0, 0, 0);

    // Various items associated with marble physics
    const past_positions = [];
    const mass = tweet.magnitude;
    const forces = [];

    // Mark this object as a marble
    const isMarble = true;

    // Set position
    marble.position.x = position.x;
    marble.position.y = position.y;
    marble.position.z = position.z;

    scene.add(marble);

    // Apply a force to this marble
    function addForce(force) {
        forces.push(force);
    }

    // Adjust the position of the marble
    function adjustPosition() {
        marble.position.x += velocity.x;
        marble.position.y += velocity.y;
        marble.position.z += velocity.z;
    }

    // Use reflection equation to 
    // find the reflective velocity off of 
    // a given object
    function reflect(obj) {
        const normal = obj.normal();
        const _dot = Vector.dot(velocity, normal);
        normal.scale(2 * _dot);
        const result = Vector.subtract(velocity, normal);

        velocity.x = result.x;
        velocity.y = result.y;
        velocity.z = result.z;
        // To simulate losing energy, lessen
        // the magnitude of the velocity
        velocity.scale(0.8);
    }

    // Use ray tracing to find any potential 
    // collisions
    function getCollisions(objects) {
        // Get the base objects
        const _objs = [];
        objects.forEach((x) => {
            _objs.push(x.object);
        });
        // For every vertex in this geometry
        for (
            let vertexIndex = 0;
            vertexIndex < marble.geometry.vertices.length;
            vertexIndex += 1
        ) {
            // Use the Three.js ray caster to find potential collisions.
            // There is a problem here. When the object is moving too fast
            // it doesn't always work, but we couldn't find a better solution
            const o_p = marble.position.clone();
            const _v = marble.geometry.vertices[vertexIndex].clone();
            const g_v = _v.applyMatrix4(marble.matrix);
            const d_v = g_v.sub(marble.position);

            const ray = new Raycaster(o_p, d_v.clone().normalize());
            const results = ray.intersectObjects(_objs);
            // If collision found, reflect off the object
            if (results.length > 0 && results[0].distance < d_v.length()) {
                reflect(objects[0]);
                break;
            }
        }
    }

    // Get the position
    function getPosition() {
        return new Vector(
            marble.position.x,
            marble.position.y,
            marble.position.z
        );
    }

    // Set the position
    function setPosition(newPos) {
        marble.position.x = newPos.x;
        marble.position.y = newPos.y;
        marble.position.x = newPos.z;
    }

    // Update the marble
    function update(elapsedTime, collidables) {
        // Calculate the aggregated forces on 
        // the marble
        const aggregate = new Vector(0, 0, 0);
        forces.forEach((x) => {
            aggregate.x += x.x;
            aggregate.y += x.y;
            aggregate.z += x.z;
        });
        // Scale them to the mass (F = ma)
        aggregate.scale(mass);
        // Change the velocity with teh force
        velocity.add(aggregate);
        // Track pas positions
        past_positions.push(Math.abs(getPosition().getMagnitude()));
        if (past_positions.length > 60) {
            past_positions.shift();
        }
        // If the position doesn't vary enough in the past
        // second, settle the marble
        const change = variance(past_positions);
        if (change < 0.15 && past_positions.length === 60) {
            velocity.becomeZero();
        }
        // Find any collisions and later the position
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
