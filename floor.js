import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
import * as Colors from './colors.js';

const floorRadius = 200;

function createFloor() {
    const floorShadow = new THREE.Mesh(
        new THREE.SphereGeometry(floorRadius, 50, 50),
        new THREE.MeshPhongMaterial({
            color: Colors.ground,
            specular: 0x000000,
            shininess: 1,
            transparent: true,
            opacity: 0.5,
        }),
    );

    floorShadow.receiveShadow = true;

    // floorGrass is a copy of floorShadow without opacity and transparency
    const floorGrass = new THREE.Mesh(
        new THREE.SphereGeometry(floorRadius - 0.5, 50, 50),
        new THREE.MeshBasicMaterial({ color: Colors.ground }),
    );

    floorGrass.receiveShadow = false;

    const floor = new THREE.Group();
    floor.position.y = -floorRadius;

    floor.add(floorShadow);
    floor.add(floorGrass);
    return floor;
}

export default createFloor();
