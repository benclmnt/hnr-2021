import * as THREE from 'https://unpkg.com/three/build/three.module.js';

let scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    globalLight, shadowLight, backLight,
    renderer,
    container;

let delta = 0;
let floorRadius = 200;
let cameraPosGame = 160;
let cameraPosGameOver = 260;
let monsterAcceleration = 0.004;
let malusClearColor = 0xb44b39;
let malusClearAlpha = 0;
let audio = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/264161/Antonio-Vivaldi-Summer_01.mp3');

let fieldGameOver, fieldDistance;

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function initScreenAnd3D() {
    const HEIGHT = window.innerHeight;
    const WIDTH = window.innerWidth;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xAAAAAA);
    scene.fog = new THREE.Fog(0xd6eae6, 160, 350);

    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 50;
    nearPlane = .1;
    farPlane = 2000;

    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.set(0, 30, cameraPosGame);
    camera.lookAt(new THREE.Vector3(0, 30, 0));

    container = document.getElementById('world');
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: container
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(malusClearColor, malusClearAlpha);

    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
}

function initUI() {
    fieldDistance = document.getElementById("distValue");
    fieldGameOver = document.getElementById("gameoverInst");
}

function render(time) {
    renderer.render(scene, camera);
}

function init(event) {
    initScreenAnd3D();
    initUI();
    render();
}

init();