import * as THREE from 'three';

import { SceneSubject, BoxContainer, Marble } from '../scene-subjects';
import { Vector, CollisionPlane, Force } from '../physics';

import GeneralLights from './GeneralLights';
import OrbitControls from 'three-orbitcontrols';

export default class SceneManager {

    constructor(canvas, config) {
        this.clock = new THREE.Clock();
        this.origin = new THREE.Vector3(0, 0, 0);
        this.mouse = new THREE.Vector2();
        this.state = config;
        this.canvas = canvas;
        this.gravity = new Force("gravity", new Vector(0, -0.1, 0), true);
        this.collidables = [];
        this.screenDimensions = {
            width: canvas.width,
            height: canvas.height
        };

        this.scene = this.buildScene();
        this.renderer = this.buildRender(this.screenDimensions);
        this.camera = this.buildCamera(this.screenDimensions);
        this.sceneSubjects = this.createSceneSubjects(this.scene);
        this.controls = new OrbitControls(this.camera, canvas);

        this.scene.add(this.camera);
        this.controls.minDistance = 10;
        this.controls.maxDistance = 200;
    }

    /**
     * Building Methods
     */

    buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#FFF');

        return scene;
    }

    buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({
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

    buildCamera({ width, height }) {
        const aspectRatio = width / height;
        const fieldOfView = 60;

        const camera = new THREE.PerspectiveCamera(
            fieldOfView,
            aspectRatio,
        );

        camera.position.z = 200;
        return camera;
    }

    createSceneSubjects = (scene) => {
        const sceneSubjects = [
            new GeneralLights(scene),
            new SceneSubject(scene),
            new BoxContainer(scene, 100, 100, 100)
        ];
        const cp = new CollisionPlane(scene, 100, 1, 100);

        // collisions against the container
        this.collidables.push(cp);

        this.state.tweets.forEach(tweet => {
            let marble = new Marble(scene, tweet);
            marble.addForce(this.gravity);
            sceneSubjects.push(marble);
        });

        return sceneSubjects;
    }

    // -------------------------------

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
        this.renderer.render(this.scene, this.camera);
    }

    updateTweets = (tweets) => {
        this.state = {...this.state, tweets};
        const oldSubjects = this.sceneSubjects.filter(x => {
            if (x.isMarble) this.scene.remove(x.marble);
            return !x.isMarble;
        });
        const newSubjects = [ ...oldSubjects ];

        tweets.forEach(tweet => {
            let marble = new Marble(this.scene, tweet);
            marble.addForce(this.gravity);
            newSubjects.push(marble);
        });

        this.sceneSubjects = newSubjects;
    }

    onWindowResize = () => {
        const { width, height } = this.canvas;

        this.screenDimensions.width = width;
        this.screenDimensions.height = height;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    onMouseMove = (x, y) => {
        this.mouse.set(x,y);
    }

    cleanup = () => {
        this.controls.dispose();
    }
};
