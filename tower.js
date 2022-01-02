import {
    PhongBlack,
    PhongBrown,
    PhongWhite,
    PhongYellow,
    PhongGreen,
    PhongSkin,
} from './materials.js';

import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';

export default class Tower {
    constructor() {
        const towerHeight = 35 + Math.random() * 100;
        const topRadius = 15 + Math.random() * 5;
        const bottomRadius = 20 + Math.random() * 5;
        const mats = [
            PhongBlack,
            PhongBrown,
            PhongWhite,
            PhongGreen,
            PhongYellow,
            PhongSkin,
        ];
        const matTower = PhongBlack; //mats[Math.floor(Math.random()*mats.length)];

        const geom = new THREE.CubeGeometry(
            bottomRadius,
            towerHeight,
            topRadius,
        );
        geom.applyMatrix4(
            new THREE.Matrix4().makeTranslation(0, towerHeight / 2, 0),
        );

        this.mesh = new THREE.Mesh(geom, matTower);

        for (let i = 0; i < 8; i++) {
            if (i != 0 && i != 5) continue;
            const v = geom.vertices[i];

            geom.computeVertexNormals();

            // WINDOW

            if (1 > 0.5) {
                const size = 4 + Math.random() * 2;
                const windowGeometry = new THREE.CubeGeometry(
                    size,
                    size,
                    size,
                    1,
                );
                for (let j = 0; j < 3; j++) {
                    if (Math.random() > 0.5) {
                        const matWindow =
                            mats[Math.floor(Math.random() * mats.length)];
                        const window = new THREE.Mesh(
                            windowGeometry,
                            matWindow,
                        );
                        if (i === 0) {
                            window.position.x = v.x - 7;
                        } else {
                            window.position.x = v.x + 7;
                        }
                        window.position.y = v.y - 7;
                        window.position.z = v.z - 2;
                        window.position.y -= j * (size + 2);
                        this.mesh.add(window);
                    }
                }
            }

            this.mesh.castShadow = true;
        }
    }
}
