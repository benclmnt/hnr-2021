import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as Material from './materials.js';
import { shadowLight } from './lights.js';
import floor from './floor.js';
import Hero from './hero.js';

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

// characters
let hero, monster;

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
    window.addEventListener('resize', handleWindowResize, false);
    document.addEventListener("keydown", function(event) {
        if (event.key === 'Escape'){
           // Esc key was pressed
           handleEscape();
       }
    });
}
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal')
      closeModal(modal)
      handleEscape()
    })
})

function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}
  
function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}

function handleEscape() {
    if (gameStatus == "paused") {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            closeModal(modal)
        })
        gameStatus = "play"
        clock.start()
        loop()
    } else if (gameStatus == "play") {
        const modal = document.querySelector('#modal')
        gameStatus = "paused"
        openModal(modal)
    }
}

function createLights() {
    const globalLight = new THREE.AmbientLight(0xffffff, .9);
    scene.add(globalLight);
    scene.add(shadowLight);
}

function createFloor() {
    scene.add(floor);
}

function createHero() {
    hero = new Hero();
    hero.mesh.rotation.y = Math.PI / 2;
    scene.add(hero.mesh);
    hero.nod();
}

function initUI() {
    fieldDistance = document.getElementById("distValue");
    fieldGameOver = document.getElementById("gameoverInst");
}

// utilities

function handleWindowResize() {
    const HEIGHT = window.innerHeight;
    const WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

function loop() {
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

function init(event) {
    initScreenAnd3D();
    initUI();
    createLights();
    createFloor();
    createHero();
    initUI();
    loop();
}

init();