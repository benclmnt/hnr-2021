import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as Material from './materials.js';
import { shadowLight } from './lights.js';
import floor from './floor.js';

let scene, camera, renderer, backLight;

let delta = 0;
let monsterAcceleration = 0.004;
let malusClearColor = 0xb44b39;
let malusClearAlpha = 0;
let audio = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/264161/Antonio-Vivaldi-Summer_01.mp3');

// scene background
let sceneBackgroundColor = 0xAAAAAA;

// camera variables
const nearPlane = 1;
const farPlane = 2000;
const fov = 50; // field of view
let cameraPosGame = 160;
let cameraPosGameOver = 260;

let fieldGameOver, fieldDistance;

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function initScreenAnd3D() {
    const HEIGHT = window.innerHeight;
    const WIDTH = window.innerWidth;

    // set global scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(sceneBackgroundColor);
    scene.fog = new THREE.Fog(0xd6eae6, 160, 350);

    // set global camera
    camera = new THREE.PerspectiveCamera(
        fov,
        WIDTH / HEIGHT,
        nearPlane,
        farPlane
    );
    camera.position.set(0, 30, cameraPosGame);
    camera.lookAt(new THREE.Vector3(0, 30, 0));

    const canvas = document.getElementById('world');

    // set global renderer
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(malusClearColor, malusClearAlpha);
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    // event listeners
    window.addEventListener('resize', handleWindowResize);
}

function createLights() {
    const globalLight = new THREE.AmbientLight(0xffffff, .9);
    scene.add(globalLight);
    scene.add(shadowLight);
}

function createFloor() {
    scene.add(floor);
}

function initUI() {
    fieldDistance = document.getElementById("distValue");
    fieldGameOver = document.getElementById("gameoverInst");
}

function render(time) {
    renderer.render(scene, camera);
}

// utilities
function handleWindowResize(camera) {
    const HEIGHT = window.innerHeight;
    const WIDTH = window.innerWidth;
    console.log(HEIGHT, WIDTH);
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    // camera.updateProjectionMatrix();
}

function init(event) {
    initScreenAnd3D();
    initUI();
    createLights();
    createFloor();
    initUI();
    render();
}

init();