// Materials
import * as THREE from 'https://unpkg.com/three/build/three.module.js';

export let blackMat = new THREE.MeshPhongMaterial({
    color: 0x100707,
    flatShading: true,
});

export let brownMat = new THREE.MeshPhongMaterial({
    color: 0xb44b39,
    shininess: 0,
    flatShading: true,
});

export let greenMat = new THREE.MeshPhongMaterial({
    color: 0x7abf8e,
    shininess: 0,
    flatShading: true,
});

export let pinkMat = new THREE.MeshPhongMaterial({
    color: 0xdc5f45,//0xb43b29,//0xff5b49,
    shininess: 0,
    flatShading: true,
});

export let lightBrownMat = new THREE.MeshPhongMaterial({
    color: 0xe07a57,
    flatShading: true,
});

export let whiteMat = new THREE.MeshPhongMaterial({
    color: 0xa49789,
    flatShading: true,
});

export let skinMat = new THREE.MeshPhongMaterial({
    color: 0xff9ea5,
    flatShading: true,
});
