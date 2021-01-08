import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as Material from './materials.js';
import state from './gameState.js';

export default class Vaccine {
    constructor() {
        this.angle = 0;
        this.mesh = new THREE.Group();
        
        var bodyGeom = new THREE.CylinderGeometry(2, 2, 8, 9, 1);
        this.body = new THREE.Mesh(bodyGeom, Material.PhongWhite);

        var sharpGeom = new THREE.CylinderGeometry(2, .2, 3, 9, 1);
        this.sharp = new THREE.Mesh(sharpGeom, Material.PhongWhite);
        sharpGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, -5, 0));

        var coverGeom = new THREE.CylinderGeometry(2, 2, .5, 9, 1);
        this.cover = new THREE.Mesh(coverGeom, Material.PhongWhite);
        coverGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 8, 0));

        var coverBottomGeom = new THREE.CylinderGeometry(3, 3, .5, 9, 1);
        this.coverBottom = new THREE.Mesh(coverBottomGeom, Material.PhongWhite);
        coverBottomGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 4, 0));

        var needleGeom = new THREE.CylinderGeometry(.2, .2, 4, 9, 1);
        this.needle = new THREE.Mesh(needleGeom, Material.PhongWhite);
        needleGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, -8, 0));

        var topGeom = new THREE.CylinderGeometry(.7, .7, 3, 9, 1);
        topGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 6, 0));
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