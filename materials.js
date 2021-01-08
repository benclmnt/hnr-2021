// Materials
import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as Colors from './colors.js';

export let PhongBlack = new THREE.MeshPhongMaterial({
    color: 0x100707,
    flatShading: true,
});

export let PhongBrown = new THREE.MeshPhongMaterial({
    color: 0xb44b39,
    shininess: 0,
    flatShading: true,
});

export let PhongGreen = new THREE.MeshPhongMaterial({
    color: Colors.green,
    shininess: 0,
    flatShading: true,
});

export let PhongPink = new THREE.MeshPhongMaterial({
    color: 0xdc5f45, //0xb43b29,//0xff5b49,
    shininess: 0,
    flatShading: true,
});

export let PhongLightBrown = new THREE.MeshPhongMaterial({
    color: 0xe07a57,
    flatShading: true,
});

export let PhongWhite = new THREE.MeshPhongMaterial({
    color: 0xa49789,
    flatShading: true,
});

export let PhongSkin = new THREE.MeshPhongMaterial({
    color: 0xff9ea5,
    flatShading: true,
});

export let PhongDarkGreen = new THREE.MeshPhongMaterial({
    color: 0x336600,
    flatShading: true,
});
