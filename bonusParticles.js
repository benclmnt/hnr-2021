import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as Material from './materials.js';
import state from './gameState.js';

export default class BonusParticles {
    constructor() {
        this.mesh = new THREE.Group();
        var bigParticleGeom = new THREE.CubeGeometry(10, 10, 10, 1);
        var smallParticleGeom = new THREE.CubeGeometry(5, 5, 5, 1);
        this.parts = [];
        for (var i = 0; i < 10; i++) {
            var partPink = new THREE.Mesh(bigParticleGeom, Material.PhongPink);
            var partGreen = new THREE.Mesh(
                smallParticleGeom,
                Material.PhongGreen,
            );
            partGreen.scale.set(0.5, 0.5, 0.5);
            this.parts.push(partPink);
            this.parts.push(partGreen);
            this.mesh.add(partPink);
            this.mesh.add(partGreen);
        }
    }

    explode() {
        var _this = this;
        var explosionSpeed = 0.5;
        for (var i = 0; i < this.parts.length; i++) {
            var tx = -50 + Math.random() * 100;
            var ty = -50 + Math.random() * 100;
            var tz = -50 + Math.random() * 100;
            var p = this.parts[i];
            p.position.set(0, 0, 0);
            p.scale.set(1, 1, 1);
            p.visible = true;
            var s = explosionSpeed + Math.random() * 0.5;
            TweenMax.to(p.position, s, {
                x: tx,
                y: ty,
                z: tz,
                ease: Power4.easeOut,
            });
            TweenMax.to(p.scale, s, {
                x: 0.01,
                y: 0.01,
                z: 0.01,
                ease: Power4.easeOut,
                onComplete: this.removeParticle,
                onCompleteParams: [p],
            });
        }
    }

    removeParticle(p) {
        p.visible = false;
    }
}
