import * as THREE from 'three';
import SceneSubject from './SceneSubject';
import BoxContainer from './BoxContainer';
import GeneralLights from './GeneralLights';
import OrbitControls from 'three-orbitcontrols';
import Marble from './Marble';
import tweets from './data/coffee.json';
import Vector from './Vector';
import CollisionPlane from './CollisionPlane';

const gravity = new Vector(0, -0.2, 0);

var collidables = []

export default canvas => {
    const clock = new THREE.Clock();
    const origin = new THREE.Vector3(0, 0, 0);
    const mouse = new THREE.Vector2();

    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    };

    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions);
    const sceneSubjects = createSceneSubjects(scene);
    const controls = new OrbitControls(camera);

    function buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#FFF');

        return scene;
    }

    function buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        return renderer;
    }

    function buildCamera({ width, height }) {
        const aspectRatio = width / height;
        const fieldOfView = 60;

        const camera = new THREE.PerspectiveCamera(
            fieldOfView,
            aspectRatio,
        );

        camera.position.z = 200;
        scene.add(camera);

        return camera;
    }

    function createSceneSubjects(scene) {
        const sceneSubjects = [
            new GeneralLights(scene),
            new SceneSubject(scene),
            new BoxContainer(scene, 100, 100, 100)
        ];
        const cp = new CollisionPlane(scene, 100, 1, 100);
        // collisions against the container
        collidables.push(cp);

        tweets.forEach(tweet => {
            let marble = new Marble(scene, tweet);
            marble.addForce(gravity);
            sceneSubjects.push(marble);
        });

        return sceneSubjects;
    }

    function update() {
        const elapsedTime = clock.getElapsedTime();

        for (let i = 0; i < sceneSubjects.length; i++)
        {
            //if(sceneSubjects[i].isMarble && sceneSubjects[i].getPosition().y >= -50)
            //{
                sceneSubjects[i].update(elapsedTime, collidables);
            //}
        }
            

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        const { width, height } = canvas;

        screenDimensions.width = width;
        screenDimensions.height = height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }

    function onMouseMove(x, y) {
        mouse.x = x;
        mouse.y = y;
    }

    return {
        update,
        onWindowResize,
        onMouseMove
    };
};
