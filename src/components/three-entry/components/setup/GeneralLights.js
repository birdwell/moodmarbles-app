import { PointLight } from 'three';

export default (scene) => {
    const light = new PointLight(0xffffff);
    light.position.set(-10, 15, 50);

    scene.add(light);

    const rad = 80;

    function update(time) {
        const x = rad * Math.sin(time * 0.2);
        light.position.x = x;
    }

    return {
        update
    };
};

