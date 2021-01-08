import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as Material from './materials.js';

export default class Hero {
    constructor() {
        this.status = "running";
        this.runningCycle = 0;
        this.mesh = new THREE.Group();
        this.body = new THREE.Group();
        this.mesh.add(this.body);

        let torsoGeom = new THREE.CubeGeometry(7, 7, 10, 1);

        this.torso = new THREE.Mesh(torsoGeom, Material.PhongBrown);
        this.torso.position.z = 0;
        this.torso.position.y = 7;
        this.torso.castShadow = true;
        this.body.add(this.torso);

        let pantsGeom = new THREE.CubeGeometry(9, 9, 5, 1);
        this.pants = new THREE.Mesh(pantsGeom, Material.PhongWhite);
        this.pants.position.z = -3;
        this.pants.position.y = 0;
        this.pants.castShadow = true;
        this.torso.add(this.pants);

        let tailGeom = new THREE.CubeGeometry(3, 3, 3, 1);
        tailGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -2));
        this.tail = new THREE.Mesh(tailGeom, Material.PhongLightBrown);
        this.tail.position.z = -4;
        this.tail.position.y = 5;
        this.tail.castShadow = true;
        this.torso.add(this.tail);

        this.torso.rotation.x = -Math.PI / 8;

        let headGeom = new THREE.CubeGeometry(10, 10, 13, 1);

        headGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 7.5));
        this.head = new THREE.Mesh(headGeom, Material.PhongBrown);
        this.head.position.z = 2;
        this.head.position.y = 11;
        this.head.castShadow = true;
        this.body.add(this.head);

        let cheekGeom = new THREE.CubeGeometry(1, 4, 4, 1);
        this.cheekR = new THREE.Mesh(cheekGeom, Material.PhongPink);
        this.cheekR.position.x = -5;
        this.cheekR.position.z = 7;
        this.cheekR.position.y = -2.5;
        this.cheekR.castShadow = true;
        this.head.add(this.cheekR);

        this.cheekL = this.cheekR.clone();
        this.cheekL.position.x = - this.cheekR.position.x;
        this.head.add(this.cheekL);


        let noseGeom = new THREE.CubeGeometry(6, 6, 3, 1);
        this.nose = new THREE.Mesh(noseGeom, Material.PhongLightBrown);
        this.nose.position.z = 13.5;
        this.nose.position.y = 2.6;
        this.nose.castShadow = true;
        this.head.add(this.nose);

        let mouthGeom = new THREE.CubeGeometry(4, 2, 4, 1);
        mouthGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 3));
        mouthGeom.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 12));
        this.mouth = new THREE.Mesh(mouthGeom, Material.PhongBrown);
        this.mouth.position.z = 8;
        this.mouth.position.y = -4;
        this.mouth.castShadow = true;
        this.head.add(this.mouth);


        let pawFGeom = new THREE.CubeGeometry(3, 3, 3, 1);
        this.pawFR = new THREE.Mesh(pawFGeom, Material.PhongLightBrown);
        this.pawFR.position.x = -2;
        this.pawFR.position.z = 6;
        this.pawFR.position.y = 1.5;
        this.pawFR.castShadow = true;
        this.body.add(this.pawFR);

        this.pawFL = this.pawFR.clone();
        this.pawFL.position.x = - this.pawFR.position.x;
        this.pawFL.castShadow = true;
        this.body.add(this.pawFL);

        let pawBGeom = new THREE.CubeGeometry(3, 3, 6, 1);
        this.pawBL = new THREE.Mesh(pawBGeom, Material.PhongLightBrown);
        this.pawBL.position.y = 1.5;
        this.pawBL.position.z = 0;
        this.pawBL.position.x = 5;
        this.pawBL.castShadow = true;
        this.body.add(this.pawBL);

        this.pawBR = this.pawBL.clone();
        this.pawBR.position.x = - this.pawBL.position.x;
        this.pawBR.castShadow = true;
        this.body.add(this.pawBR);

        let earGeom = new THREE.CubeGeometry(7, 18, 2, 1);
        earGeom.vertices[6].x += 2;
        earGeom.vertices[6].z += .5;

        earGeom.vertices[7].x += 2;
        earGeom.vertices[7].z -= .5;

        earGeom.vertices[2].x -= 2;
        earGeom.vertices[2].z -= .5;

        earGeom.vertices[3].x -= 2;
        earGeom.vertices[3].z += .5;
        earGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 9, 0));

        this.earL = new THREE.Mesh(earGeom, Material.PhongBrown);
        this.earL.position.x = 2;
        this.earL.position.z = 2.5;
        this.earL.position.y = 5;
        this.earL.rotation.z = -Math.PI / 12;
        this.earL.castShadow = true;
        this.head.add(this.earL);

        this.earR = this.earL.clone();
        this.earR.position.x = -this.earL.position.x;
        this.earR.rotation.z = -this.earL.rotation.z;
        this.earR.castShadow = true;
        this.head.add(this.earR);

        let eyeGeom = new THREE.CubeGeometry(2, 4, 4);

        this.eyeL = new THREE.Mesh(eyeGeom, Material.PhongWhite);
        this.eyeL.position.x = 5;
        this.eyeL.position.z = 5.5;
        this.eyeL.position.y = 2.9;
        this.eyeL.castShadow = true;
        this.head.add(this.eyeL);

        let irisGeom = new THREE.CubeGeometry(.6, 2, 2);

        this.iris = new THREE.Mesh(irisGeom, Material.PhongBlack);
        this.iris.position.x = 1.2;
        this.iris.position.y = 1;
        this.iris.position.z = 1;
        this.eyeL.add(this.iris);

        this.eyeR = this.eyeL.clone();
        this.eyeR.children[0].position.x = -this.iris.position.x;


        this.eyeR.position.x = -this.eyeL.position.x;
        this.head.add(this.eyeR);

        this.body.traverse(function (object) {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
    }

    run() {
        this.status = "running";

        let s = Math.min(speed, maxSpeed);

        this.runningCycle += delta * s * .7;
        this.runningCycle = this.runningCycle % (Math.PI * 2);
        let t = this.runningCycle;

        let amp = 4;
        let disp = .2;

        // BODY

        this.body.position.y = 6 + Math.sin(t - Math.PI / 2) * amp;
        this.body.rotation.x = .2 + Math.sin(t - Math.PI / 2) * amp * .1;

        this.torso.rotation.x = Math.sin(t - Math.PI / 2) * amp * .1;
        this.torso.position.y = 7 + Math.sin(t - Math.PI / 2) * amp * .5;

        // MOUTH
        this.mouth.rotation.x = Math.PI / 16 + Math.cos(t) * amp * .05;

        // HEAD
        this.head.position.z = 2 + Math.sin(t - Math.PI / 2) * amp * .5;
        this.head.position.y = 8 + Math.cos(t - Math.PI / 2) * amp * .7;
        this.head.rotation.x = -.2 + Math.sin(t + Math.PI) * amp * .1;

        // EARS
        this.earL.rotation.x = Math.cos(-Math.PI / 2 + t) * (amp * .2);
        this.earR.rotation.x = Math.cos(-Math.PI / 2 + .2 + t) * (amp * .3);

        // EYES
        this.eyeR.scale.y = this.eyeL.scale.y = .7 + Math.abs(Math.cos(-Math.PI / 4 + t * .5)) * .6;

        // TAIL
        this.tail.rotation.x = Math.cos(Math.PI / 2 + t) * amp * .3;

        // FRONT RIGHT PAW
        this.pawFR.position.y = 1.5 + Math.sin(t) * amp;
        this.pawFR.rotation.x = Math.cos(t) * Math.PI / 4;


        this.pawFR.position.z = 6 - Math.cos(t) * amp * 2;

        // FRONT LEFT PAW

        this.pawFL.position.y = 1.5 + Math.sin(disp + t) * amp;
        this.pawFL.rotation.x = Math.cos(t) * Math.PI / 4;


        this.pawFL.position.z = 6 - Math.cos(disp + t) * amp * 2;

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
        let totalSpeed = 10 / speed;
        let jumpHeight = 45;

        TweenMax.to(this.earL.rotation, totalSpeed, { x: "+=.3", ease: Back.easeOut });
        TweenMax.to(this.earR.rotation, totalSpeed, { x: "-=.3", ease: Back.easeOut });

        TweenMax.to(this.pawFL.rotation, totalSpeed, { x: "+=.7", ease: Back.easeOut });
        TweenMax.to(this.pawFR.rotation, totalSpeed, { x: "-=.7", ease: Back.easeOut });
        TweenMax.to(this.pawBL.rotation, totalSpeed, { x: "+=.7", ease: Back.easeOut });
        TweenMax.to(this.pawBR.rotation, totalSpeed, { x: "-=.7", ease: Back.easeOut });

        TweenMax.to(this.tail.rotation, totalSpeed, { x: "+=1", ease: Back.easeOut });

        TweenMax.to(this.mouth.rotation, totalSpeed, { x: .5, ease: Back.easeOut });

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

        // HEAD
        let tHeadRotY = -Math.PI / 6 + Math.random() * Math.PI / 3;
        TweenMax.to(this.head.rotation, sp, { y: tHeadRotY, ease: Power4.easeInOut, onComplete: function () { _this.nod() } });

        // EARS
        let tEarLRotX = Math.PI / 4 + Math.random() * Math.PI / 6;
        let tEarRRotX = Math.PI / 4 + Math.random() * Math.PI / 6;

        TweenMax.to(this.earL.rotation, sp, { x: tEarLRotX, ease: Power4.easeInOut });
        TweenMax.to(this.earR.rotation, sp, { x: tEarRRotX, ease: Power4.easeInOut });


        // PAWS BACK LEFT

        let tPawBLRot = Math.random() * Math.PI / 2;
        let tPawBLY = -4 + Math.random() * 8;

        TweenMax.to(this.pawBL.rotation, sp / 2, { x: tPawBLRot, ease: Power1.easeInOut, yoyo: true, repeat: 2 });
        TweenMax.to(this.pawBL.position, sp / 2, { y: tPawBLY, ease: Power1.easeInOut, yoyo: true, repeat: 2 });


        // PAWS BACK RIGHT

        let tPawBRRot = Math.random() * Math.PI / 2;
        let tPawBRY = -4 + Math.random() * 8;
        TweenMax.to(this.pawBR.rotation, sp / 2, { x: tPawBRRot, ease: Power1.easeInOut, yoyo: true, repeat: 2 });
        TweenMax.to(this.pawBR.position, sp / 2, { y: tPawBRY, ease: Power1.easeInOut, yoyo: true, repeat: 2 });

        // PAWS FRONT LEFT

        let tPawFLRot = Math.random() * Math.PI / 2;
        let tPawFLY = -4 + Math.random() * 8;

        TweenMax.to(this.pawFL.rotation, sp / 2, { x: tPawFLRot, ease: Power1.easeInOut, yoyo: true, repeat: 2 });

        TweenMax.to(this.pawFL.position, sp / 2, { y: tPawFLY, ease: Power1.easeInOut, yoyo: true, repeat: 2 });

        // PAWS FRONT RIGHT

        let tPawFRRot = Math.random() * Math.PI / 2;
        let tPawFRY = -4 + Math.random() * 8;

        TweenMax.to(this.pawFR.rotation, sp / 2, { x: tPawFRRot, ease: Power1.easeInOut, yoyo: true, repeat: 2 });

        TweenMax.to(this.pawFR.position, sp / 2, { y: tPawFRY, ease: Power1.easeInOut, yoyo: true, repeat: 2 });

        // MOUTH
        let tMouthRot = Math.random() * Math.PI / 8;
        TweenMax.to(this.mouth.rotation, sp, { x: tMouthRot, ease: Power1.easeInOut });
        // IRIS
        let tIrisY = -1 + Math.random() * 2;
        let tIrisZ = -1 + Math.random() * 2;
        let iris1 = this.iris;
        let iris2 = this.eyeR.children[0];
        TweenMax.to([iris1.position, iris2.position], sp, { y: tIrisY, z: tIrisZ, ease: Power1.easeInOut });

        //EYES
        if (Math.random() > .2) TweenMax.to([this.eyeR.scale, this.eyeL.scale], sp / 8, { y: 0, ease: Power1.easeInOut, yoyo: true, repeat: 1 });
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
