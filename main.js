import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { shadowLight } from './lights.js';
import floor from './floor.js';
import BonusParticles from './bonusParticles.js';
import Hero from './hero.js';
import Vaccine from './vaccine.js';
import Monster from './monster.js';
import Virus from './virus.js';
import Tower from './tower.js';
import state from './gameState.js';

const STORAGE_HS = 'hs';
const browserPrefixes = ['moz', 'ms', 'o', 'webkit'];
const gameOverMsg = 'Game Over';
const homepageMsg = 'Welcome back, Roco!';

let scene, camera, clock, renderer;

const audio = new Audio(
    'https://raw.githubusercontent.com/kevnw/coro-jump/master/escape.mp3',
);
let monsterAcceleration = 0.004;
var malusClearColor = 0x8b0000;
let malusClearAlpha = 0;

// scene vars
let sceneBackgroundColor = 0xf54040;
let floorRadius = 200;
let initFogNear = 160;
const outFogNear = 80;

// camera vars
const nearPlane = 1;
const farPlane = 2000;
const fov = 50; // field of view
const cameraPosGame = 160;
const cameraPosGameOver = 260;

// characters
let hero, monster, vaccine, obstacle, bonusParticles;

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
    scene.fog = new THREE.Fog(0xaaaaaa, initFogNear, 350);

    // set global camera
    camera = new THREE.PerspectiveCamera(
        fov,
        WIDTH / HEIGHT,
        nearPlane,
        farPlane,
    );
    camera.position.set(0, 30, cameraPosGame);
    camera.lookAt(new THREE.Vector3(0, 30, 0));

    // set global renderer
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: document.getElementById('world'),
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

function createBuilding() {
    const nBuildings = 100;
    for (let i = 0; i < nBuildings; i++) {
        const phi = (i * (Math.PI * 2)) / nBuildings;
        let theta = Math.PI / 2;
        //theta += .25 + Math.random()*.3;
        theta +=
            Math.random() > 0.05
                ? 0.25 + Math.random() * 0.3
                : -0.35 - Math.random() * 0.1;

        const building = new Building();
        building.mesh.position.x =
            Math.sin(theta) * Math.cos(phi) * floorRadius;
        building.mesh.position.y =
            Math.sin(theta) * Math.sin(phi) * (floorRadius - 10);
        building.mesh.position.z = Math.cos(theta) * floorRadius;

        const vec = building.mesh.position.clone();
        const axis = new THREE.Vector3(0, 1, 0);
        building.mesh.quaternion.setFromUnitVectors(
            axis,
            vec.clone().normalize(),
        );
        floor.add(building.mesh);
    }
}

class Building {
    constructor() {
        this.mesh = new THREE.Object3D();
        this.tower = new Tower();
        this.mesh.add(this.tower.mesh);
    }
}

function createBonusParticles() {
    bonusParticles = new BonusParticles();
    bonusParticles.mesh.visible = false;
    scene.add(bonusParticles.mesh);
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
        checkCollision();
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
    if (state.gameStatus != 'paused') {
        if (state.speed >= state.maxSpeed) return;
        state.level++;
        state.speed += 2;
    }
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
    vaccine.mesh.rotation.z =
        Math.PI / 2 - (state.floorRotation + vaccine.angle);
    vaccine.mesh.position.y =
        -floorRadius +
        Math.sin(state.floorRotation + vaccine.angle) * (floorRadius + 50);
    vaccine.mesh.position.x =
        Math.cos(state.floorRotation + vaccine.angle) * (floorRadius + 50);
}

function updateMonsterPosition() {
    monster.run();
    state.monsterPosTarget -= state.delta * monsterAcceleration;
    state.monsterPos +=
        (state.monsterPosTarget - state.monsterPos) * state.delta;
    if (state.monsterPos < 0.56) {
        gameOver();
    }

    const angle = Math.PI * state.monsterPos;
    monster.mesh.position.y =
        -floorRadius + Math.sin(angle) * (floorRadius + 12);
    monster.mesh.position.x = Math.cos(angle) * (floorRadius + 15);
    monster.mesh.rotation.z = -Math.PI / 2 + angle;
}

function updateObstaclePosition() {
    if (obstacle.status == 'flying') return;

    // TODO fix this,
    if (state.floorRotation + obstacle.angle > 2.5) {
        obstacle.angle = -state.floorRotation + Math.random() * 0.3;
        obstacle.body.rotation.y = Math.random() * Math.PI * 2;
    }

    obstacle.mesh.rotation.z =
        state.floorRotation + obstacle.angle - Math.PI / 2;
    obstacle.mesh.position.y =
        -floorRadius +
        Math.sin(state.floorRotation + obstacle.angle) * (floorRadius + 3);
    obstacle.mesh.position.x =
        Math.cos(state.floorRotation + obstacle.angle) * (floorRadius + 3);
}

function checkCollision() {
    const db = hero.mesh.position.clone().sub(vaccine.mesh.position.clone());
    const dm = hero.mesh.position.clone().sub(obstacle.mesh.position.clone());

    if (db.length() < state.collisionBonus) {
        getBonus();
    }

    if (dm.length() < state.collisionObstacle && obstacle.status != 'flying') {
        getMalus();
    }
}

function getBonus() {
    bonusParticles.mesh.position.copy(vaccine.mesh.position);
    bonusParticles.mesh.visible = true;
    bonusParticles.explode();
    vaccine.angle += Math.PI / 2;
    //speed*=.95;
    state.monsterPosTarget += 0.025;
}

function getMalus() {
    obstacle.status = 'flying';
    const tx =
        Math.random() > 0.5 ? -20 - Math.random() * 10 : 20 + Math.random() * 5;
    gsap.to(obstacle.mesh.position, 4, {
        x: tx,
        y: Math.random() * 50,
        z: 350,
        ease: Power4.easeOut,
    });
    gsap.to(obstacle.mesh.rotation, 4, {
        x: Math.PI * 3,
        z: Math.PI * 3,
        y: Math.PI * 6,
        ease: Power4.easeOut,
        onComplete: function () {
            obstacle.status = 'ready';
            obstacle.body.rotation.y = Math.random() * Math.PI * 2;
            obstacle.angle = -state.floorRotation - Math.random() * 0.4;

            obstacle.angle = obstacle.angle % (Math.PI * 2);
            obstacle.mesh.rotation.x = 0;
            obstacle.mesh.rotation.y = 0;
            obstacle.mesh.rotation.z = 0;
            obstacle.mesh.position.z = 0;
        },
    });
    //
    state.monsterPosTarget -= 0.04;
    gsap.from(this, 0.5, {
        malusClearAlpha: 0.5,
        onUpdate: function () {
            renderer.setClearColor(malusClearColor, malusClearAlpha);
        },
    });
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

    audio.play();
    clock.start();
    updateLevel();
    levelInterval = setInterval(updateLevel, levelUpdateFreq);
}

function replay() {
    state.gameStatus = 'preparingToReplay';
    scene.fog.near = initFogNear;

    fieldGameOver.className = '';

    gsap.killTweensOf(monster.pawFL.position);
    gsap.killTweensOf(monster.pawFR.position);
    gsap.killTweensOf(monster.pawBL.position);
    gsap.killTweensOf(monster.pawBR.position);

    gsap.killTweensOf(monster.pawFL.rotation);
    gsap.killTweensOf(monster.pawFR.rotation);
    gsap.killTweensOf(monster.pawBL.rotation);
    gsap.killTweensOf(monster.pawBR.rotation);

    gsap.killTweensOf(monster.tail.rotation);
    gsap.killTweensOf(monster.head.rotation);
    gsap.killTweensOf(monster.eyeL.scale);
    gsap.killTweensOf(monster.eyeR.scale);

    monster.tail.rotation.y = 0;

    gsap.to(camera.position, 3, {
        z: cameraPosGame,
        x: 0,
        y: 30,
        ease: Power4.easeInOut,
    });
    gsap.to(monster.torso.rotation, 2, { x: 0, ease: Power4.easeInOut });
    gsap.to(monster.torso.position, 2, { y: 0, ease: Power4.easeInOut });
    gsap.to(monster.pawFL.rotation, 2, { x: 0, ease: Power4.easeInOut });
    gsap.to(monster.pawFR.rotation, 2, { x: 0, ease: Power4.easeInOut });
    gsap.to(monster.mouth.rotation, 2, { x: 0.5, ease: Power4.easeInOut });

    gsap.to(monster.head.rotation, 2, {
        y: 0,
        x: -0.3,
        ease: Power4.easeInOut,
    });

    gsap.to(hero.mesh.position, 2, { x: 20, ease: Power4.easeInOut });
    gsap.to(monster.mouth.rotation, 2, { x: 0.2, ease: Power4.easeInOut });
    gsap.to(monster.mouth.rotation, 1, {
        x: 0.4,
        ease: Power4.easeIn,
        delay: 1,
        onComplete: function () {
            resetGameDefault();
        },
    });
}

function gameOver() {
    fieldGameOver.className = 'show';
    fieldGameOver.querySelector('#banner').innerHTML = gameOverMsg;

    state.gameStatus = 'gameOver';
    state.floorRotation = 0; // TODO: check if this is working?
    updateHighScore(Number(fieldDistance.innerHTML));

    scene.fog.near = outFogNear;
    monster.sit();
    hero.hang();
    monster.heroHolder.add(hero.mesh);
    gsap.to(this, 1, { speed: 0 });
    gsap.to(camera.position, 3, { z: cameraPosGameOver, y: 60, x: -30 });
    vaccine.mesh.visible = true;
    obstacle.mesh.visible = true;
    clearInterval(levelInterval);
}

// main function

function init() {
    initScreenAnd3D();
    createLights();
    createFloor();
    createMonster();
    createHero();
    createBonusParticles();
    createVaccine();
    createBuilding();
    createObstacle();
    if (state.gameStatus != 'beginning') {
        resetGameDefault();
    } else {
        homePage();
    }
    loop();
}

init();

/**
 * UI Utilities
 */

function initUI() {
    fieldDistance = document.getElementById('distValue');
    fieldGameOver = document.getElementById('gameoverInst');
    initHSTable();
    console.log("Welcome to CORO JUMP! Nice to meet you here :)")
}

function initListeners() {
    window.addEventListener('resize', handleWindowResize);
    audio.addEventListener('ended', () => {
        console.log('Music just ended. Replaying...');
        audio.play();
    }); // replay on audio end.
    // handle on lose / gain focus
    document.addEventListener(
        getVisibilityEvent(getBrowserPrefix()),
        handleVisibilityChange,
    );
    // document.addEventListener('click', handleMouseDown);
    // document.addEventListener('touchend', handleMouseDown);
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            // Esc key was pressed
            handleEscape();
        }

        if (event.key === ' ') {
            // spacebar
            handleMouseDown(event);
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
            closeModal(modal);
            clearInterval(levelInterval);
            resetGameDefault();
            loop();
        });
    });

    quitGameButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
            clearInterval(levelInterval);
            resetGameDefault(); // game status will set to play here. Not what we want
            homePage(); // game status will be set to beginning here. No worries :)
            loop();
        });
    });

    document.querySelector('.speaker').addEventListener('click', function (e) {
        if (this.classList.contains('mute')) {
            audio.muted = false;
            this.classList.remove('mute');
        } else {
            audio.muted = true;
            this.classList.add('mute');
        }
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
        audio.play();
        clock.start(); // stop clock to reset delta
        loop();
    } else if (state.gameStatus == 'play') {
        const modal = document.querySelector('#modal');
        state.gameStatus = 'paused';
        audio.pause();
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
    fieldGameOver.className = 'show';
    fieldDistance.textContent = '000';
    fieldGameOver.querySelector('#banner').innerHTML = homepageMsg;

    state._gameStatus = 'beginning';

    monster.sit();
    hero.hang();
    monster.heroHolder.add(hero.mesh);
    gsap.to(window, 1, { speed: 0 });
    gsap.to(camera.position, 3, { z: cameraPosGameOver, y: 60, x: -30 });
    vaccine.mesh.visible = true;
    obstacle.mesh.visible = true;
    clearInterval(levelInterval);
}

// HIGH SCORE UTILS
function initHSTable() {
    if (!window.localStorage.getItem(STORAGE_HS)) {
        window.localStorage.setItem(STORAGE_HS, JSON.stringify([]));
    }

    const highscores = JSON.parse(window.localStorage.getItem(STORAGE_HS));
    const table = fieldGameOver.querySelector('#highscore');
    table.innerHTML = `
        <thead>
            <th style="width: 200px;">Date, Time</th>
            <th style="width: 100px;">Score</th>
        </thead>
    `; // yeah it's a hardcode here and there :p
    highscores.forEach(({ score, date }) => {
        let tr = document.createElement('tr');
        tr.innerHTML = `<td>${new Date(
            date,
        ).toLocaleString()}</td><td>${score}</td>`;
        table.appendChild(tr);
    });
}

function updateHighScore(score) {
    let highscores = JSON.parse(window.localStorage.getItem(STORAGE_HS));
    const obj = { score, date: new Date() };
    highscores.push(obj);
    highscores.sort((a, b) => b.score - a.score); // sort descending
    if (highscores.length > 5) {
        highscores = highscores.slice(0, 5); // take top 5
    }
    window.localStorage.setItem(STORAGE_HS, JSON.stringify(highscores));
    initHSTable();
}

/**
 * Handle on focus out
 */

// get the correct attribute name
function getHiddenPropertyName(prefix) {
    return prefix ? prefix + 'Hidden' : 'hidden';
}

// get the correct event name
function getVisibilityEvent(prefix) {
    return (prefix ? prefix : '') + 'visibilitychange';
}

// get current browser vendor prefix
function getBrowserPrefix() {
    for (let i = 0; i < browserPrefixes.length; i++) {
        if (getHiddenPropertyName(browserPrefixes[i]) in document) {
            // return vendor prefix
            return browserPrefixes[i];
        }
    }

    // no vendor prefix needed
    return null;
}

function handleVisibilityChange() {
    if (document[getHiddenPropertyName(getBrowserPrefix())]) {
        // the page is hidden
        if (state.gameStatus === 'play') {
            handleEscape();
        }
    } else {
        // the page is visible
    }
}
