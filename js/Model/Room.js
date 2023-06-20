

export default class Room {
    constructor(config) {
        this.lowerSrc = config.lowerSrc;
        this.upperSrc = config.upperSrc;
        this.celestialBodies = config.celestialBodies;
        this.bonusCelestialBodies = config.bonusCelestialBodies;
        this.gameObjects = config.gameObjects;
        this.walls = config.walls;
        this.cutsceneSpaces = config.cutsceneSpaces;
        this.initialCutscene = config.initialCutscene;

    }
};

