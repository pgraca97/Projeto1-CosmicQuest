import {utils} from "/js/Model/Utils.js";
import  OverworldEvent  from "/js/Model/OverworldEvent.js";
import gameController from './GameController.js';

// Defining the OverworldMap class
export default class OverworldMap {
    // The constructor takes in a configuration object
    constructor(config){
        this.overworld = null;
        // Game objects within the map
        this.gameObjects = config.gameObjects; 
        console.dir(this.gameObjects);
        // The spaces in the map that trigger cutscenes
        this.cutsceneSpaces = config.cutsceneSpaces || {};
        // Wall objects within the map
        this.walls = config.walls || {};

        // Lower image layer
        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc; 

        // Upper image layer
        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc; 

        // Flag to check if a cutscene is playing
        this.isCutscenePlaying = false;
    }

    // Draw the lower image layer
    drawLowerImage(ctx){
        ctx.drawImage(this.lowerImage , utils.withGrid(1), utils.withGrid(1));
    }

    // Draw the upper image layer
    drawUpperImage(ctx){
        ctx.drawImage(
            this.upperImage, utils.withGrid(10), utils.withGrid(10)
        );
    }

    // Check if a space is occupied by a wall
    isSpaceTaken(currentX, currentY, direction){
        const {x, y} = utils.nextPosition(currentX, currentY, direction);
        //console.log(this.walls)
        return this.walls[`${x},${y}`] || false;
    }

    // Mount game objects to the map
    mountObjects(){
        Object.keys(this.gameObjects).forEach(key => {
             let object = this.gameObjects[key];

            object.id = key;

            if (object.x === 96 || object.y === 80){
                return;
            }
            
            object.mount(this);
            console.log('Mounted');
        });    
    }

    // Start a cutscene
    async startCutscene(events){
        this.isCutscenePlaying = true;
        console.log(events);
        for (let event of events){
          
            const eventHandler = new OverworldEvent({
                event: event,
                map: this,
            })
          //  gameController.addGameEvent(eventHandler);
            await eventHandler.init();
            //console.dir(eventHandler);
            //console.log(eventHandler.event);
        }

        this.isCutscenePlaying = false;

        //Reset NPCs to do their idle behavior
        Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this));
    }

    // Check for cutscenes that get triggered by interaction
    checkForActionCutscene() {
        const playerCharacter = this.gameObjects["playerCharacter"];
        const nextCoords = utils.nextPosition(playerCharacter.x, playerCharacter.y, playerCharacter.direction);
        const match = Object.values(this.gameObjects).find(object => {
            return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
        });
        if (!this.isCutscenePlaying && match && match.talking.length) {
            this.startCutscene(match.talking[0].events)
        }
    }

    // Check for cutscenes that get triggered by stepping on a particular space
    checkForFootstepCutscene(){
        const playerCharacter = this.gameObjects["playerCharacter"];
        const match = this.cutsceneSpaces[`${playerCharacter.x},${playerCharacter.y}`];
        if (!this.isCutscenePlaying && match) {
            match.forEach(m => this.startCutscene(m.events)); //m represents each individual cutscene object in the match array
        }
    }

    addWall(x, y){
        this.walls[`${x},${y}`] = true;
    } 
    removeWall(x, y){
        delete this.walls[`${x},${y}`];
    }
    
    moveWall(wasX, wasY, direction){
        this.removeWall(wasX, wasY);
        const {x,y} = utils.nextPosition(wasX, wasY, direction);
        this.addWall(x, y);
    } 
}