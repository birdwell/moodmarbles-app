import { Clock, Vector3, Vector2, Scene, Color, WebGLRenderer, PerspectiveCamera } from 'three';
import OrbitControls from 'three-orbitcontrols';

import { SceneSubject, BoxContainer, Marble } from '../scene-subjects';
import { Vector, CollisionPlane, Force } from '../physics';

import GeneralLights from './GeneralLights';

/** 
 * Manage the components of the scene
 * and the render/update
*/
export default class SceneManager {
    constructor(canvas, config) {
        // Track ellapsed time
        this.clock = new Clock();
        this.origin = new Vector3(0, 0, 0);
        this.mouse = new Vector2();
        this.state = config;
        this.canvas = canvas;
<<<<<<< HEAD
        this.gravity = new Force("gravity", new Vector(0, -0.1, 0), true);
=======
        // Define gravity as 1/10th 
        this.gravity = new Vector(0, -0.1, 0);
        // Keep a list of items that can be run into
>>>>>>> 7dacf02a5416715662478d23624ac04d0fccaa09
        this.collidables = [];
        // Define screen dimensions
        this.screenDimensions = {
            width: canvas.width,
            height: canvas.height
        };

        // Construct the components of the scene
        // including the controls for rotation of the container
        this.scene = this.buildScene();
        this.renderer = this.buildRender(this.screenDimensions);
        this.camera = this.buildCamera(this.screenDimensions);
        this.sceneSubjects = this.createSceneSubjects(this.scene);
        this.controls = new OrbitControls(this.camera, canvas);

        // Add teh camera and set position
        this.scene.add(this.camera);
        this.controls.minDistance = 10;
        this.controls.maxDistance = 200;
    }

    /**
     * Build the scene
     */
    buildScene() {
        // Construct scene and set backgroun to white
        const scene = new Scene();
        scene.background = new Color('#FFF');

        return scene;
    }

    /**
     * Construct the Three.js renderer
     */
    buildRender({ width, height }) {
        const renderer = new WebGLRenderer({
            canvas: this.canvas,
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

    /**
     * Construct the camera as perspective camera
     */
    buildCamera({ width, height }) {
        const aspectRatio = width / height;
        const fieldOfView = 60;

        const camera = new PerspectiveCamera(
            fieldOfView,
            aspectRatio,
        );

        camera.position.z = 200;
        return camera;
    }

    /**
     * Construct the items in the scene
     */
    createSceneSubjects = (scene) => {
        const sceneSubjects = [
            // lighting
            new GeneralLights(scene),
            new SceneSubject(scene),
            // Container
            new BoxContainer(scene, 100, 100, 100)
        ];

        // Floor of container
        const cp = new CollisionPlane(scene, 100, 1, 100);

        // collisions against the container
        this.collidables.push(cp);

        // Construct marble for each tweet and 
        // add gravity to it
        this.state.tweets.forEach((tweet) => {
            const marble = new Marble(scene, tweet);
            marble.addForce(this.gravity);
            sceneSubjects.push(marble);
        });

        return sceneSubjects;
    }

    // -------------------------------

<<<<<<< HEAD
    getCenter(objs) {
        var agg = new Vector(0, 0, 0);
        var aggMass = 0;
        objs.forEach( x=> {
            var pos = x.getPosition();
            //pos.scale(x.getMass());
            aggMass += x.getMass();
            agg.add(pos);
        });
        //agg.scale(1.0 / aggMass);
        agg.scale(1.0 / objs.length);
        return agg;
    }

    centerOfMass(marbles) {
        var centers = {}
        const keys = Object.keys(marbles);
        for(var i = 0; i < keys.length; i++) {
            centers[keys[i]] = this.getCenter(marbles[keys[i]]);
        }
        return centers;
    }

    applyForces (centers, marbles) {
        var keys = Object.keys(centers);
        keys.forEach( k => {
            var my_marb = marbles[k];
            my_marb.forEach( m => {
                var f_vec = Vector.subtract(centers[k].normalize(), m.getPosition().normalize());
                f_vec.scale(-0.01);
                var f = new Force("center", f_vec, false);
                m.addForce(f);
            });
        });
    }

    update = () => {
        const elapsedTime = this.clock.getElapsedTime();
        var marbles = {};
        var m_list = [];
        this.sceneSubjects.forEach(subject => {
            subject.update(elapsedTime, this.collidables);
            if(subject.isMarble) {
                if(!(subject.assocTweet().emotion in marbles)) marbles[subject.assocTweet().emotion] = []
                marbles[subject.assocTweet().emotion].push(subject);
                m_list.push(subject);
            }
        });
        if(m_list.every(m => (m.getSettled())))
        {
            var centers = this.centerOfMass(marbles) 
            this.applyForces(centers, marbles);
        }
=======
    // Update each scene subject
    update = () => {
        const elapsedTime = this.clock.getElapsedTime();
        this.sceneSubjects.forEach(subject => subject.update(elapsedTime, this.collidables));
>>>>>>> 7dacf02a5416715662478d23624ac04d0fccaa09
        this.renderer.render(this.scene, this.camera);
    }

    // Update each tweet object
    updateTweets = (tweets) => {
<<<<<<< HEAD
        this.state = {...this.state, tweets};
        const oldSubjects = this.sceneSubjects.filter(x => {
=======
        this.state = { ...this.state, tweets };
        // Clib non visible tweets
        const oldSubjects = this.sceneSubjects.filter((x) => {
>>>>>>> 7dacf02a5416715662478d23624ac04d0fccaa09
            if (x.isMarble) this.scene.remove(x.marble);
            return !x.isMarble;
        });
        const newSubjects = [...oldSubjects];

        // construct necessary new marbles
        tweets.forEach((tweet) => {
            const marble = new Marble(this.scene, tweet);
            marble.addForce(this.gravity);
            newSubjects.push(marble);
        });

        this.sceneSubjects = newSubjects;
    }

    /**
     * Update scene on window resize
     */
    onWindowResize = () => {
        const { width, height } = this.canvas;

        this.screenDimensions.width = width;
        this.screenDimensions.height = height;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    onMouseMove = (x, y) => {
        this.mouse.set(x, y);
    }

    cleanup = () => {
        this.controls.dispose();
    }
}
