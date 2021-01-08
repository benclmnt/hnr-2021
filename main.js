import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { shadowLight } from './lights.js';
import floor from './floor.js';
import Hero from './hero.js';
import { initGameState, gameLimit } from './gameState.js';
import trunc from './trunc.js';
import fir from './fir.js';

let scene, camera, clock, renderer;

let delta = 0;
let floorRadius = 200;
let monsterAcceleration = 0.004;
let malusClearColor = 0xb44b39;
let malusClearAlpha = 0;

// scene background
let sceneBackgroundColor = 0xAAAAAA;

// camera variables
const nearPlane = 1;
const farPlane = 2000;
const fov = 50; // field of view
let cameraPosGame = 160;

// characters
let hero;

let fieldGameOver, fieldDistance;

// game status
let {
    speed,
    gameStatus } = initGameState;
let { maxSpeed } = gameLimit;
let levelUpdateFreq = 3000; // 3s

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

    clock = new THREE.Clock();
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

function loop() {
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

// game
function updateLevel() {
    if (speed >= maxSpeed) return;
    level++;
    speed += 2;
}

function resetGameDefault() {
    if (!hero) {
        throw Error("Hero not found!!");
    }

    scene.add(hero.mesh);
    hero.mesh.position.set(0, 0, 0);
    hero.mesh.rotation.y = Math.PI / 2;

    speed = initGameState.speed;
    gameStatus = initGameState.gameStatus;


    hero.status = "running";
    hero.nod();

    // audio.play();
    updateLevel();

}

// listeners utilities


var firs = new THREE.Group();

function createFirs() {

    var nTrees = 100;
    for (var i = 0; i < nTrees; i++) {
        var phi = i * (Math.PI * 2) / nTrees;
        var theta = Math.PI / 2;
        //theta += .25 + Math.random()*.3; 
        theta += (Math.random() > .05) ? .25 + Math.random() * .3 : - .35 - Math.random() * .1;

        var fir = new tree();
        fir.mesh.position.x = Math.sin(theta) * Math.cos(phi) * floorRadius;
        fir.mesh.position.y = Math.sin(theta) * Math.sin(phi) * (floorRadius - 10);
        fir.mesh.position.z = Math.cos(theta) * floorRadius;

        var vec = fir.mesh.position.clone();
        var axis = new THREE.Vector3(0, 1, 0);
        fir.mesh.quaternion.setFromUnitVectors(axis, vec.clone().normalize());
        floor.add(fir.mesh);
    }
}

function handleWindowResize() {
    const HEIGHT = window.innerHeight;
    const WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

// main function

function init() {
    initScreenAnd3D();
    initUI();
    createLights();
    createFloor();
    createHero();
    createFirs();
    initUI();
    resetGameDefault();
    loop();
}

class tree {
    constructor() {
        this.mesh = new THREE.Object3D();
        this.trunc = new trunc();
        this.mesh.add(this.trunc.mesh);
    }
}

init();