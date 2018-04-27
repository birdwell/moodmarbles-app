import { PointLight } from 'three';

/**
 * Export a point lighting object
 */
export default (scene) => {
    // Construct light and set its position
    const light = new PointLight(0xffffff);
    light.position.set(-10, 15, 50);

    scene.add(light);

    const rad = 80;

    // unused
    function update(time) {
        const x = rad * Math.sin(time * 0.2);
        light.position.x = x;
    }

    return {
        update
    };
};

