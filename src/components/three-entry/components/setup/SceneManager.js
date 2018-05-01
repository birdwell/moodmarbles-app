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
        // Define gravity
        this.gravity = new Force("gravity", new Vector(0, -0.07, 0), true);
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

        this.didCalc = false;
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
        // const wallcpleft = new CollisionPlane(scene, 1, 100, 100);
        // wallcpleft.setNormal(new Vector(1, 0, 0));
        // wallcpleft.setY(0);
        // wallcpleft.setX(-50);
        // const wallcpRight = new CollisionPlane(scene, 1, 100, 100);
        // wallcpRight.setNormal(new Vector(-1, 0, 0));
        // wallcpRight.setY(0);
        // wallcpRight.setX(50);

        // collisions against the container
        this.collidables.push(cp);
        // this.collidables.push(wallcpleft);
        // this.collidables.push(wallcpRight);

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

    getCenter(objs) {
        var agg = new Vector(0, 0, 0);
        var aggMass = 0;
        objs.forEach( x=> {
            var pos = x.getPosition();
            pos.scale(x.getMass());
            aggMass += x.getMass();
            agg.add(pos);
        });
        agg.scale(1.0 / aggMass);
        //agg.scale(1.0 / objs.length);
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
            if(my_marb.length > 1) {
                my_marb.forEach( m => {
                    var f_vec = Vector.subtract(centers[k], m.getPosition());
                    if(!f_vec.isZero()) {
                        f_vec = f_vec.normalize();
                        f_vec.scale(1 / m.getMass());
                    }
                    f_vec.scale(-0.01);
                    var f = new Force("center", f_vec, false);
                    m.addForce(f);
                });
            } else {
                if(!my_marb[0].hasGravity()){
                    my_marb[0].addForce(this.gravity);
                    my_marb[0].unSettle();
                }
            }
        });
    }

    updateList (marbles, subjects) {
        var keys = Object.keys(marbles);
        keys.forEach( k => {
            var marbs = marbles[k];
            var del = [];
            var createNew = [];
            marbs.forEach( m1 => {
                var match = marbs.filter(m2 => {
                    if(m1 !== m2 && del.indexOf(m2) < 0) {
                        var diff = Vector.subtract(m1.getPosition(), m2.getPosition()).getMagnitude();
                        if(diff <= 10) {
                            return true;
                        }
                    }
                    return false;
                });
                var aggM = 0;
                match.forEach(m => {
                    del.push(m);
                    aggM += m.assocTweet().magnitude;
                });
                if(match.length > 0){
                    var assocTweet = m1.assocTweet();
                    assocTweet.magnitude += aggM;
                    var newMarble = new Marble(this.scene, assocTweet);
                    newMarble.settle();
                    var pos = m1.getPosition();
                    pos.add(new Vector(0, 5, 0));
                    newMarble.setPosition(pos);
                    createNew.push(newMarble);
                    del.push(m1);
                }
            });
            del.forEach(d => {
                var idx = subjects.indexOf(d);
                subjects.splice(idx, 1);
                var s_idx = marbs.indexOf(d);
                marbs.splice(s_idx, 1);
                this.scene.remove(d.marble);
            });
            createNew.forEach(m => {
                subjects.push(m);
                marbs.push(m);
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
            this.updateList(marbles, this.sceneSubjects);
            var centers = this.centerOfMass(marbles) 
            this.applyForces(centers, marbles);
            this.didCalc = true; 
        }
        this.renderer.render(this.scene, this.camera);
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
