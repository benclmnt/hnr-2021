import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as Material from './materials.js';
import state from './gameState.js';

export default class Virus {
    constructor() {
        this.angle = 0;
        this.status = 'ready';
        this.mesh = new THREE.Group();
        var bodyGeom = new THREE.SphereGeometry(2.5, 20, 20);
        this.body = new THREE.Mesh(bodyGeom, Material.PhongDarkGreen);

        var spikeGeom = new THREE.CylinderGeometry(0.5, 0.2, 3, 20);
        spikeGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 1, 0));

        var ballGeom = new THREE.SphereGeometry(0.7, 20, 20);
        ballGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 3, 0));

        for (var i = 0; i < 9; i += 2) {
            var row = i % 3;
            var col = Math.floor(i / 3);
            var ball = new THREE.Mesh(ballGeom, Material.PhongDarkGreen);
            var sb = new THREE.Mesh(spikeGeom, Material.PhongDarkGreen);
            sb.add(ball);
            sb.rotation.x =
                -Math.PI / 2 + (Math.PI / 12) * row - 0.5 + Math.random();
            sb.position.z = -2 + Math.random();
            sb.position.y = -2 + row;
            sb.position.x = -2 + col;
            this.body.add(sb);

            var sf = new THREE.Mesh(spikeGeom, Material.PhongDarkGreen);
            sf.add(ball);
            sf.rotation.x = -(
                -Math.PI / 2 +
                (Math.PI / 12) * row -
                0.5 +
                Math.random()
            );
            sf.position.z = 2 - Math.random();
            sf.position.y = -2 + row;
            sf.position.x = -2 + col;
            this.body.add(sf);

            var st = new THREE.Mesh(spikeGeom, Material.PhongDarkGreen);
            st.add(ball);
            st.position.y = 2 - Math.random();
            st.position.x = -2 + row;
            st.position.z = -2 + col;
            st.rotation.z =
                Math.PI / 6 - (Math.PI / 6) * row - 0.5 + Math.random();
            this.body.add(st);

            var sbt = new THREE.Mesh(spikeGeom, Material.PhongDarkGreen);
            sbt.add(ball);
            sbt.position.y = -2 + Math.random();
            sbt.position.x = -2 + row;
            sbt.position.z = -2 + col;
            sbt.rotation.z = -(
                Math.PI / 6 -
                (Math.PI / 6) * row -
                0.5 +
                Math.random()
            );
            this.body.add(sbt);

            var sr = new THREE.Mesh(spikeGeom, Material.PhongDarkGreen);
            sr.add(ball);
            sr.position.x = 2 - Math.random();
            sr.position.y = -2 + row;
            sr.position.z = -2 + col;
            sr.rotation.z =
                -Math.PI / 2 + (Math.PI / 12) * row - 0.5 + Math.random();
            this.body.add(sr);

            var sl = new THREE.Mesh(spikeGeom, Material.PhongDarkGreen);
            sl.add(ball);
            sl.position.x = -2 + Math.random();
            sl.position.y = -2 + row;
            sl.position.z = -2 + col;
            sl.rotation.z =
                Math.PI / 2 - (Math.PI / 12) * row - 0.5 + Math.random();
            this.body.add(sl);
        }

        this.mesh.add(this.body);

        this.mesh.traverse(function (object) {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
    }

    nod() {
        var _this = this;
        var speed = 0.1 + Math.random() * 0.5;
        var angle = -Math.PI / 4 + (Math.random() * Math.PI) / 2;
        TweenMax.to(this.body.rotation, speed, {
            y: angle,
            onComplete: function () {
                _this.nod();
            },
        });
    }
}
