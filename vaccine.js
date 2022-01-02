import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
import * as Material from './materials.js';
import state from './gameState.js';

export default class Vaccine {
    constructor() {
        this.angle = 0;
        this.mesh = new THREE.Group();

        const bodyGeom = new THREE.CylinderGeometry(2, 2, 8, 9, 1);
        this.body = new THREE.Mesh(bodyGeom, Material.PhongBlue);

        const sharpGeom = new THREE.CylinderGeometry(2, 0.2, 3, 9, 1);
        this.sharp = new THREE.Mesh(sharpGeom, Material.PhongBlue);
        sharpGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -5, 0));

        const coverGeom = new THREE.CylinderGeometry(2, 2, 0.5, 9, 1);
        this.cover = new THREE.Mesh(coverGeom, Material.PhongWhite);
        coverGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 8, 0));

        const coverBottomGeom = new THREE.CylinderGeometry(3, 3, 0.5, 9, 1);
        this.coverBottom = new THREE.Mesh(coverBottomGeom, Material.PhongWhite);
        coverBottomGeom.applyMatrix4(
            new THREE.Matrix4().makeTranslation(0, 4, 0),
        );

        const needleGeom = new THREE.CylinderGeometry(0.2, 0.2, 4, 9, 1);
        this.needle = new THREE.Mesh(needleGeom, Material.PhongWhite);
        needleGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -8, 0));

        const topGeom = new THREE.CylinderGeometry(0.7, 0.7, 3, 9, 1);
        topGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 6, 0));
        this.top = new THREE.Mesh(topGeom, Material.PhongWhite);

        this.mesh.add(this.body);
        this.mesh.add(this.top);
        this.mesh.add(this.sharp);
        this.mesh.add(this.cover);
        this.mesh.add(this.coverBottom);
        this.mesh.add(this.needle);

        this.body.traverse(function (object) {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
    }
}
