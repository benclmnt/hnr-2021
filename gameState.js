class GameState {
    constructor() {
        this._delta = 0;
        this._level = 1;
        this._distance = 0;
        this._speed = 5;
        this._gameStatus = 'beginning';
        this._floorRotation = 0;
        this._monsterPos = 0.65;
        this._monsterPosTarget = 0.65;
        this._collisionBonus = 20;
        this._collisionObstacle = 10;10
        // only getter
        this._maxSpeed = 48;
    }

    get maxSpeed() {
        return this._maxSpeed;
    }

    set delta(val) {
        this._delta = val;
    }
    get delta() {
        return this._delta;
    }

    set collisionBonus(val) {
        this._collisionBonus = val;
    }
    get collisionBonus() {
        return this._collisionBonus;
    }

    set collisionObstacle(val) {
        this._collisionObstacle = val;
    }
    get collisionObstacle() {
        return this._collisionObstacle;
    }

    set level(val) {
        this._level = val;
    }
    get level() {
        return this._level;
    }

    set distance(val) {
        this._distance = val;
    }
    get distance() {
        return this._distance;
    }

    set speed(val) {
        this._speed = val;
    }
    get speed() {
        return this._speed;
    }

    set gameStatus(val) {
        this._gameStatus = val;
    }
    get gameStatus() {
        return this._gameStatus;
    }

    set floorRotation(val) {
        this._floorRotation = val;
    }
    get floorRotation() {
        return this._floorRotation;
    }

    set monsterPos(val) {
        this._monsterPos = val;
    }
    get monsterPos() {
        return this._monsterPos;
    }

    set monsterPosTarget(val) {
        this._monsterPosTarget = val;
    }
    get monsterPosTarget() {
        return this._monsterPosTarget;
    }

    reset() {
        this._delta = 0;
        this._level = 1;
        this._distance = 0;
        this._speed = 5;
        this._gameStatus = 'play';
        this._floorRotation = 0;
        this._monsterPos = 0.65;
        this._monsterPosTarget = 0.65;
    }
}

const state = new GameState();
export default state;
