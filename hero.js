import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as Material from './materials.js';
import state from './gameState.js';

export default class Hero {
    constructor() {
        this.status = "running";
        this.runningCycle = 0;
        this.mesh = new THREE.Group();
        this.body = new THREE.Group();
        this.mesh.add(this.body);

        let torsoGeom = new THREE.CylinderGeometry(5, 5, 11, 20, 1);

        let backpackGeom = new THREE.CubeGeometry(5, 7, 3, 1);
        this.backpack = new THREE.Mesh(backpackGeom, Material.PhongWhite);
        this.backpack.position.z = -6;
        this.backpack.position.y = 7;
        this.backpack.rotation.x = - Math.PI / 16
        this.backpack.castShadow = true;
        this.body.add(this.backpack);

        let topGeom = new THREE.SphereGeometry(5,20,20);

        this.torso = new THREE.Mesh(torsoGeom, Material.PhongBrown);
        this.torso.position.z = 0;
        this.torso.position.y = 8;
        this.torso.castShadow = true;
        this.body.add(this.torso);
        this.top = new THREE.Mesh(topGeom, Material.PhongBrown);
        this.top.position.z = 0;
        this.top.position.y = 5;
        this.top.castShadow = true;
        this.torso.add(this.top);

        let maskGeom = new THREE.CylinderGeometry(4, 4, 4, 20, 1);
        this.mask = new THREE.Mesh(maskGeom, Material.PhongWhite);
        this.torso.add(this.mask);
        maskGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 4, 2));

        this.torso.rotation.x = -Math.PI / 16;

        let headGeom = new THREE.CubeGeometry(10, 10, 13, 1);

        let fistGeom = new THREE.SphereGeometry(1.5,20,20);
        this.fistR = new THREE.Mesh(fistGeom, Material.PhongPink);
        this.fistR.position.x = 0;
        this.fistR.position.z = 0;
        this.fistR.position.y = -2.5;

        let handGeom = new THREE.CylinderGeometry(1.2, 1.5, 5, 20, 1);
        this.handR = new THREE.Mesh(handGeom, Material.PhongPink);
        this.handR.position.x = -5;
        this.handR.position.z = -1;
        this.handR.position.y = 8;
        this.handR.rotation.x = -Math.PI /16;
        this.handR.add(this.fistR);
        this.body.add(this.handR);

        this.handL = this.handR.clone();
        this.handL.position.x = - this.handR.position.x;
        this.body.add(this.handL);

        let pawBGeom = new THREE.CylinderGeometry(1.5, 1.3, 5, 20, 1);
        this.pawBL = new THREE.Mesh(pawBGeom, Material.PhongLightBrown);
        this.pawBL.position.y = 1;
        this.pawBL.position.z = 1;
        this.pawBL.position.x = 3;
        this.pawBL.castShadow = true;
        this.body.add(this.pawBL);

        this.pawBR = this.pawBL.clone();
        this.pawBR.position.x = - this.pawBL.position.x;
        this.pawBR.castShadow = true;
        this.body.add(this.pawBR);

        this.body.traverse(function (object) {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
    }

    run() {
        this.status = "running";

        let s = Math.min(state.speed, state.maxSpeed);

        this.runningCycle += state.delta * s * .7;
        this.runningCycle = this.runningCycle % (Math.PI * 2);
        let t = this.runningCycle;

        let amp = 4;
        let disp = .2;

        // BODY

        this.body.position.y = 6 + Math.sin(t - Math.PI / 2) * amp;
        this.body.rotation.x = .2 + Math.sin(t - Math.PI / 2) * amp * .1;

        this.torso.rotation.x = Math.sin(t - Math.PI / 2) * amp * .1;
        this.torso.position.y = 7 + Math.sin(t - Math.PI / 2) * amp * .5;

        // BACK RIGHT PAW
        this.pawBR.position.y = 1.5 + Math.sin(Math.PI + t) * amp;
        this.pawBR.rotation.x = Math.cos(t + Math.PI * 1.5) * Math.PI / 3;


        this.pawBR.position.z = - Math.cos(Math.PI + t) * amp;

        // BACK LEFT PAW
        this.pawBL.position.y = 1.5 + Math.sin(Math.PI + t) * amp;
        this.pawBL.rotation.x = Math.cos(t + Math.PI * 1.5) * Math.PI / 3;


        this.pawBL.position.z = - Math.cos(Math.PI + t) * amp;
    }

    jump() {
        if (this.status == "jumping") return;
        this.status = "jumping";
        let _this = this;
        let totalSpeed = 10 / state.speed;
        let jumpHeight = 45;

        TweenMax.to(this.pawBL.rotation, totalSpeed, { x: "+=.7", ease: Back.easeOut });
        TweenMax.to(this.pawBR.rotation, totalSpeed, { x: "-=.7", ease: Back.easeOut });

        TweenMax.to(this.mesh.position, totalSpeed / 2, { y: jumpHeight, ease: Power2.easeOut });
        TweenMax.to(this.mesh.position, totalSpeed / 2, {
            y: 0, ease: Power4.easeIn, delay: totalSpeed / 2, onComplete: function () {
                //t = 0;
                _this.status = "running";
            }
        });
    }

    nod() {
        let _this = this;
        let sp = .5 + Math.random();

        // BODY
        let tBodyRot = -(Math.PI / 4 + Math.random() * Math.PI / 6) / 2;
        TweenMax.to(this.body.rotation, sp, { y: tBodyRot, ease: Power4.easeInOut, onComplete: function () { _this.nod() }});

        // HAND LEFT
        let tHandLRot = -(Math.PI / 4 + Math.random() * Math.PI / 6);
        TweenMax.to(this.handL.rotation, sp, { x: tHandLRot, ease: Power4.easeInOut});

        // HAND RIGHT
        let tHandRRot = -(Math.PI / 4 + Math.random() * Math.PI / 6);
        TweenMax.to(this.handR.rotation, sp, { x: tHandRRot, ease: Power4.easeInOut});


        // PAWS BACK LEFT

        let tPawBLRot = Math.random() * Math.PI / 8;
        TweenMax.to(this.pawBL.rotation, sp / 2, { x: tPawBLRot, ease: Power1.easeInOut, yoyo: true, repeat: 2 });


        // PAWS BACK RIGHT

        let tPawBRRot = Math.random() * Math.PI / 8;
        TweenMax.to(this.pawBR.rotation, sp / 2, { x: tPawBRRot, ease: Power1.easeInOut, yoyo: true, repeat: 2 });

        }

    hang() {
        let _this = this;
        let sp = 1;
        let ease = Power4.easeOut;

        TweenMax.killTweensOf(this.eyeL.scale);
        TweenMax.killTweensOf(this.eyeR.scale);

        this.body.rotation.x = 0;
        this.torso.rotation.x = 0;
        this.body.position.y = 0;
        this.torso.position.y = 7;

        TweenMax.to(this.mesh.rotation, sp, { y: 0, ease: ease });
        TweenMax.to(this.mesh.position, sp, { y: -7, z: 6, ease: ease });
        TweenMax.to(this.head.rotation, sp, { x: Math.PI / 6, ease: ease, onComplete: function () { _this.nod(); } });

        TweenMax.to(this.earL.rotation, sp, { x: Math.PI / 3, ease: ease });
        TweenMax.to(this.earR.rotation, sp, { x: Math.PI / 3, ease: ease });

        TweenMax.to(this.pawFL.position, sp, { y: -1, z: 3, ease: ease });
        TweenMax.to(this.pawFR.position, sp, { y: -1, z: 3, ease: ease });
        TweenMax.to(this.pawBL.position, sp, { y: -2, z: -3, ease: ease });
        TweenMax.to(this.pawBR.position, sp, { y: -2, z: -3, ease: ease });

        TweenMax.to(this.eyeL.scale, sp, { y: 1, ease: ease });
        TweenMax.to(this.eyeR.scale, sp, { y: 1, ease: ease });
    }
}
