export default class fir {
    constructor() {
        var height = 200;
        var truncGeom = new THREE.CylinderGeometry(2, 2, height, 6, 1);
        truncGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, height / 2, 0));
        this.mesh = new THREE.Mesh(truncGeom, greenMat);
        this.mesh.castShadow = true;
    }
}