import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { shadowLight } from './lights.js';
import floor from './floor.js';
import Hero from './hero.js';
import Vaccine from './vaccine.js';
import Monster from './monster.js';
import Virus from './virus.js';
import Trunc from './trunc.js';
import state from './gameState.js';

let scene, camera, clock, renderer;

var audio = new Audio('https://drive.google.com/file/d/13dP8QP50JFN1L9WLDgODzmvjMf9er933/view');
let monsterAcceleration = 0.004;
let malusClearColor = 0xb44b39;
let malusClearAlpha = 0;

// scene background
let sceneBackgroundColor = 0xaaaaaa;
let floorRadius = 200;

// camera variables
const nearPlane = 1;
const farPlane = 2000;
const fov = 50; // field of view
let cameraPosGameOver = 160;

// characters
let hero, monster, vaccine, obstacle;

let fieldGameOver, fieldHomePage, fieldDistance;

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
        farPlane,
    );
    camera.position.set(0, 30, cameraPosGameOver);
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

// CREATE COMPONENTS

function createLights() {
    const globalLight = new THREE.AmbientLight(0xffffff, 0.9);
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

function createVaccine() {
    vaccine = new Vaccine();
    scene.add(vaccine.mesh);
}

function createMonster() {
    monster = new Monster();
    monster.mesh.position.z = 20;
    //monster.mesh.scale.set(1.2,1.2,1.2);
    scene.add(monster.mesh);
    updateMonsterPosition();
}

function createObstacle() {
    obstacle = new Virus();
    obstacle.body.rotation.y = -Math.PI / 2;
    obstacle.mesh.scale.set(1.1, 1.1, 1.1);
    obstacle.mesh.position.y = floorRadius + 4;
    obstacle.nod();
    scene.add(obstacle.mesh);
}

function loop() {
    state.delta = clock.getDelta();
    updateFloorRotation();

    if (state.gameStatus == 'play') {
        if (hero.status == 'running') {
            hero.run();
        }
        updateDistance();
        updateVaccinePosition();
        updateMonsterPosition();
        updateObstaclePosition();
    }

    renderer.render(scene, camera);

    if (state.gameStatus != 'paused') {
        requestAnimationFrame(loop);
    }
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
    state.floorRotation =
        (state.floorRotation + state.delta * 0.03 * state.speed) %
        (Math.PI * 2);
    floor.rotation.z = state.floorRotation;
}

function updateVaccinePosition() {
    vaccine.mesh.rotation.y += state.delta * 6;
    vaccine.mesh.rotation.z = Math.PI / 2 - (state.floorRotation + vaccine.angle);
    vaccine.mesh.position.y = -floorRadius + Math.sin(state.floorRotation + vaccine.angle) * (floorRadius + 50);
    vaccine.mesh.position.x = Math.cos(state.floorRotation + vaccine.angle) * (floorRadius + 50);
}

function updateMonsterPosition() {
    monster.run();
    state.monsterPosTarget -= state.delta * monsterAcceleration;
    state.monsterPos += (state.monsterPosTarget - state.monsterPos) * state.delta;
    if (state.monsterPos < .56) {
        gameOver();
    }

    var angle = Math.PI * state.monsterPos;
    monster.mesh.position.y = - floorRadius + Math.sin(angle) * (floorRadius + 12);
    monster.mesh.position.x = Math.cos(angle) * (floorRadius + 15);
    monster.mesh.rotation.z = -Math.PI / 2 + angle;
}

function updateObstaclePosition() {
    if (obstacle.status == "flying") return;

    // TODO fix this,
    if (state.floorRotation + obstacle.angle > 2.5) {
        obstacle.angle = -state.floorRotation + Math.random() * .3;
        obstacle.body.rotation.y = Math.random() * Math.PI * 2;
    }

    obstacle.mesh.rotation.z = state.floorRotation + obstacle.angle - Math.PI / 2;
    obstacle.mesh.position.y = -floorRadius + Math.sin(state.floorRotation + obstacle.angle) * (floorRadius + 3);
    obstacle.mesh.position.x = Math.cos(state.floorRotation + obstacle.angle) * (floorRadius + 3);

}

function resetGameDefault() {
    if (!hero) {
        throw Error('Hero not found!!');
    }

    scene.add(hero.mesh);
    hero.mesh.position.set(0, 0, 0);
    hero.mesh.rotation.y = Math.PI / 2;

    state.reset();

    hero.status = 'running';
    hero.nod();

    // audio.play();
    updateLevel();
    levelInterval = setInterval(updateLevel, levelUpdateFreq);
}


// TREE

var firs = new THREE.Group();

function createFirs() {
    var nTrees = 100;
    for (var i = 0; i < nTrees; i++) {
        var phi = (i * (Math.PI * 2)) / nTrees;
        var theta = Math.PI / 2;
        //theta += .25 + Math.random()*.3;
        theta +=
            Math.random() > 0.05
                ? 0.25 + Math.random() * 0.3
                : -0.35 - Math.random() * 0.1;

        var fir = new Tree();
        fir.mesh.position.x = Math.sin(theta) * Math.cos(phi) * floorRadius;
        fir.mesh.position.y =
            Math.sin(theta) * Math.sin(phi) * (floorRadius - 10);
        fir.mesh.position.z = Math.cos(theta) * floorRadius;

        var vec = fir.mesh.position.clone();
        var axis = new THREE.Vector3(0, 1, 0);
        fir.mesh.quaternion.setFromUnitVectors(axis, vec.clone().normalize());
        floor.add(fir.mesh);
    }
}

class Tree {
    constructor() {
        this.mesh = new THREE.Object3D();
        this.trunc = new Trunc();
        this.mesh.add(this.trunc.mesh);
    }
}

// main function

function init() {
    initScreenAnd3D();
    createLights();
    createFloor();
    createMonster();
    createHero();
    createVaccine();
    createFirs();
    createObstacle();
    resetGameDefault();
    loop();
}

init();

/**
 * UI Utilities
 */

function initUI() {
    fieldDistance = document.getElementById('distValue');
    fieldGameOver = document.getElementById('gameoverInst');
    fieldHomePage = document.getElementById('homePage');
}

function initListeners() {
    window.addEventListener('resize', handleWindowResize);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('touchend', handleMouseDown);
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            // Esc key was pressed
            handleEscape();
        }
    });
    const closeModalButtons = document.querySelectorAll('[data-close-button]');
    const restartGameButtons = document.querySelectorAll(
        '[data-restart-button]',
    );
    const quitGameButtons = document.querySelectorAll('[data-quit-button]');
    const overlay = document.getElementById('overlay');

    closeModalButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
            handleEscape();
        });
    });

    restartGameButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            console.log('reset button pressed');
            closeModal(modal);
            clearInterval(levelInterval);
            resetGameDefault();
            clock.start();
            loop();
        });
    });

    quitGameButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
            clearInterval(levelInterval);
            resetGameDefault();
            clock.start();
            loop();
            homePage();
        });
    });
}

function openModal(modal) {
    if (modal == null) return;
    modal.classList.add('active');
    overlay.classList.add('active');
}

function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

function handleEscape() {
    if (state.gameStatus == 'paused') {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach((modal) => {
            closeModal(modal);
        });
        state.gameStatus = 'play';
        clock.start();
        loop();
    } else if (state.gameStatus == 'play') {
        const modal = document.querySelector('#modal');
        state.gameStatus = 'paused';
        openModal(modal);
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
    if (state.gameStatus == 'play') {
        hero.jump();
    } else if (state.gameStatus == 'readyToReplay') {
        replay();
    }
}

function homePage() {
    fieldHomePage.className = 'show';
    state.gameStatus = 'homePage';
    monster.sit();
    hero.hang();
    monster.heroHolder.add(hero.mesh);
    TweenMax.to(this, 1, { speed: 0 });
    TweenMax.to(camera.position, 3, { z: cameraPosGameOver, y: 60, x: -30 });
    vaccine.mesh.visible = false;
    obstacle.mesh.visible = false;
    clearInterval(levelInterval);
}

function gameOver() {
    fieldGameOver.className = "show";
    state.gameStatus = "gameOver";
    monster.sit();
    hero.hang();
    monster.heroHolder.add(hero.mesh);
    TweenMax.to(this, 1, { speed: 0 });
    TweenMax.to(camera.position, 3, { z: cameraPosGameOver, y: 60, x: -30 });
    vaccine.mesh.visible = false;
    // obstacle.mesh.visible = false;
    clearInterval(levelInterval);
}
