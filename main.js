import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { shadowLight } from './lights.js';
import floor from './floor.js';
import Hero from './hero.js';
import state from './gameState.js';

let scene, camera, clock, renderer;

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

// game status
let levelInterval; // increase level interval
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

    clock = new THREE.Clock();

    initListeners();
    initUI();
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

function loop() {
    state.delta = clock.getDelta();
    updateFloorRotation();

    if (state.gameStatus == "play") {
        if (hero.status == "running") {
            hero.run();
        }

        updateDistance();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

/**
 * GAME functions
 */

function updateLevel() {
    if (state.speed >= state.maxSpeed) return;
    state.level++;
    state.speed += 2;
}

function updateDistance() {
    state.distance += state.delta * state.speed;
    fieldDistance.innerHTML = Math.floor(state.distance / 2);
}

function updateFloorRotation() {
    state.floorRotation = (state.floorRotation + state.delta * .03 * state.speed) % (Math.PI * 2);
    floor.rotation.z = state.floorRotation;
}

function resetGameDefault() {
    if (!hero) {
        throw Error("Hero not found!!");
    }

    scene.add(hero.mesh);
    hero.mesh.position.set(0, 0, 0);
    hero.mesh.rotation.y = Math.PI / 2;

    state.reset();

    hero.status = "running";
    console.log("hero", hero);
    hero.nod();

    // audio.play();
    updateLevel();
    levelInterval = setInterval(updateLevel, levelUpdateFreq);

}

// main function

function init(event) {
    initScreenAnd3D();
    createLights();
    createFloor();
    createHero();
    resetGameDefault();
    loop();
}

init();


/**
 * UI Utilities
 */

function initUI() {
    fieldDistance = document.getElementById("distValue");
    fieldGameOver = document.getElementById("gameoverInst");
}

function initListeners() {
    window.addEventListener('resize', handleWindowResize);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener("touchend", handleMouseDown);
    document.addEventListener("keydown", function(event) {
        if (event.key === 'Escape'){
           // Esc key was pressed
            handleEscape();
        }
    });
    const closeModalButtons = document.querySelectorAll('[data-close-button]')
    const overlay = document.getElementById('overlay')

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal')
            closeModal(modal)
            handleEscape()
        })
    })

}

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
    if (state.gameStatus == "paused") {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            closeModal(modal)
        })
        state.gameStatus = "play"
        clock.start()
        loop()
    } else if (state.gameStatus == "play") {
        const modal = document.querySelector('#modal')
        state.gameStatus = "paused"
        openModal(modal)
    }
}

function handleWindowResize() {
    const HEIGHT = window.innerHeight;
    const WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

function handleMouseDown(event) {
    if (state.gameStatus == "play") {
        hero.jump();
    } else if (state.gameStatus == "readyToReplay") {
        replay();
    }
}