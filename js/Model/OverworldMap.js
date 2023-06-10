import {GameObject} from "/js/Model/GameObject.js";
import {utils} from "/js/Model/Utils.js";
import {Person} from "/js/Model/Person.js";
import  OverworldEvent  from "/js/Model/OverworldEvent.js";

export class OverworldMap {
    constructor(config){
        this.overworld = null;
        this.gameObjects = config.gameObjects; 
        this.cutsceneSpaces = config.cutsceneSpaces || {};
        this.walls = config.walls || {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc; 


        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc; 

        this.isCutscenePlaying = false;
    }
    drawLowerImage(ctx){ //, cameraPerson = undefined
        ctx.drawImage(this.lowerImage , utils.withGrid(1), utils.withGrid(1));
    }
    drawUpperImage(ctx){ //, cameraPerson = undefined
        ctx.drawImage(
            this.upperImage, utils.withGrid(10), utils.withGrid(10)
           // utils.withGrid(16.5) - cameraPerson.x,
            // utils.withGrid(16.5) - cameraPerson.y
        );
    }

    isSpaceTaken(currentX, currentY, direction){
        const {x, y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false; // if there's a wall there it returns true and if not it returns false
    }

    mountObjects(){
        Object.keys(this.gameObjects).forEach(key => {
             let object = this.gameObjects[key];

            object.id = key;

            // TODO: determine if this object should be mounted or not (has this action happened or not?)
            if (object.x === 80 || object.y === 64){
                return;
            }
            
            object.mount(this);
            console.dir(this);  // changed this line
        });    
    } // start calling mount on every game object in the map


    async startCutscene(events){
    this.isCutscenePlaying = true;

    for (let i = 0; i < events.length; i++){
        const eventHandler = new OverworldEvent({
            event: events[i],
            map: this,
        })
        
        await eventHandler.init();
        console.dir(eventHandler);
        console.log(eventHandler.event.type);
    }

    this.isCutscenePlaying = false;

    //Reset NPCs to do their idle behavior
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this));
    }

    checkForActionCutscene() {
        const character = this.gameObjects["character"];
        const nextCoords = utils.nextPosition(character.x, character.y, character.direction);
        const match = Object.values(this.gameObjects).find(object => {
            return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
        });
        if (!this.isCutscenePlaying && match && match.talking.length) {
            this.startCutscene(match.talking[0].events)
        }
    }

    checkForFootstepCutscene(){
        const character = this.gameObjects["character"];
        const match = this.cutsceneSpaces[`${character.x},${character.y}`];
        if (!this.isCutscenePlaying && match ) {
                    this.startCutscene(match[0].events)
        }
    }


    addWall(x, y){
        this.walls[`${x},${y}`] = true;
    } // for when a game object is added to the map

    removeWall(x, y){
        delete this.walls[`${x},${y}`];
    } // if they exit the map it will remove the wall from the map
    
    moveWall(wasX, wasY, direction){
        this.removeWall(wasX, wasY);
        const {x,y} = utils.nextPosition(wasX, wasY, direction);
        this.addWall(x, y);
    } // for when a game object moves in the map
}

window.OverworldMaps = {
    Room1: {
        lowerSrc: '/assets/img/Room 1/Room 111.png',
        upperSrc: '/assets/img/Room 1/DemoUpper.png',
        gameObjects: {

            character: new Person ({
                isPlayerControlled: true,
                x: utils.withGrid(7),
                y: utils.withGrid(6),
                src:"/assets/img/Characters/User/Pink/Chara_Astronaut09_FullBody_Run_4Dir_6x4.png",
                idleSrc: "/assets/img/Characters/User/Pink/Chara_Astronaut09_FullBody_Idle_8Dir_1x8.png",
                cutWidth: 32,  
                cutHeight: 32, 
                imgWidth: 32,  
                imgHeight: 32,
                shadowOffset: 2.4,
            }),
            vase: new Person({
                x: utils.withGrid(6.5),
                y: utils.withGrid(6),
                idleSrc: '/assets/img/Room 1/Vase.png',
                cutWidth: 16,  
                cutHeight: 16, 
                imgWidth: 16,
                imgHeight: 16,
                shadowOffset: 2.4
            }),
            npcA: new Person ({
                //isPlayerControlled : true,
                x: utils.withGrid(8),
                y: utils.withGrid(8),
                src: '/assets/img/CleanBot.png',
                idleSrc: undefined,
                cutWidth: 16,  
                cutHeight: 16, 
                imgWidth: 16,  
                imgHeight: 16,
                shadowOffset: 2.4,
                animations: {  // These are hypothetical coordinates, adjust as per your sprite sheet layout
                    "idle-down": [ [0, 0] ],
                    "idle-right": [ [0, 2] ],
                    "idle-up": [ [0, 3] ],
                    "idle-left": [ [0, 1] ],
                    "run-down": [ [1, 0], [2, 0]],
                    "run-right": [ [1, 2], [2, 2] ],
                    "run-up": [ [1, 3], [2, 3]],
                    "run-left": [ [1, 1], [2, 1] ],
                    
                },
                isRobot : true,
                behaviorLoop: [
                    {type: "run", direction: "left"},
                    {type: "idle", direction: "up", time: 2000},
                    {type: "run", direction: "up"},
                    {type: "idle", direction: "up", time: 1000},
                    {type: "idle", direction: "right", time: 2000},
                    {type: "run", direction: "right"},
                    {type: "run", direction: "down"},
                ], 
                talking: [
                    {
                        events: [
                            { 
                                type: "textMessage", 
                                text: "Delighted to see you again, my astute explorer! The inner planets hold wonders beyond imagination. Are you prepared to tackle the challenge that lies ahead?", 
                                faceHero: "npcA"
                            },
                            { 
                                type: "confirmation", 
                                text: "Start Main Challenge?", 
                                onConfirm: { type: "battle", enemyId: "beth" },
                                onCancel: { type: "textMessage", text: "Adios!" }
                            },
                            /*{ who: "character", type: "run", direction: "down" }, 
                            { who: "character", type: "run", direction: "left" },*/
                        ]
                    }
                ]
            }),

            /*npcB: new Person ({
                x: utils.withGrid(9),
                y: utils.withGrid(6),
                idleSrc: '/assets/img/people/npc4.png',
                cutWidth: 32,  
                cutHeight: 32, 
                imgWidth: 32,  
                imgHeight: 32,
                behaviorLoop: [
                    {type: "idle", direction: "left", time: 800},
                    {type: "idle", direction: "up", time: 800},
                    {type: "idle", direction: "right", time: 1200},
                ]
            }),*/
        },
        walls: {
            [utils.asGridCoord(1,6)]: true,
            [utils.asGridCoord(1,7)]: true,
            [utils.asGridCoord(1,8)]: true,
            [utils.asGridCoord(1,11)]: true,
            [utils.asGridCoord(2,5)]: true,
            [utils.asGridCoord(2,9)]: true,
            [utils.asGridCoord(2,10)]: true,
            [utils.asGridCoord(2,12)]: true,
            [utils.asGridCoord(3,5)]: true,
            [utils.asGridCoord(3,12)]: true,
            [utils.asGridCoord(4,5)]: true,
            [utils.asGridCoord(4,13)]: true,
            [utils.asGridCoord(5,4)]: true,
            [utils.asGridCoord(5,13)]: true,
            [utils.asGridCoord(6,4)]: true,
            [utils.asGridCoord(6,6)]: true,
            [utils.asGridCoord(6,13)]: true,
            [utils.asGridCoord(7,4)]: true,
            [utils.asGridCoord(7,14)]: true,
            [utils.asGridCoord(8,4)]: true,
            [utils.asGridCoord(8,5)]: true,
            [utils.asGridCoord(8,6)]: true,
            [utils.asGridCoord(8,13)]: true,
            [utils.asGridCoord(9,4)]: true,
            [utils.asGridCoord(9,5)]: true,
            [utils.asGridCoord(9,6)]: true,
            [utils.asGridCoord(9,13)]: true,
            [utils.asGridCoord(10,4)]: true,
            [utils.asGridCoord(10,13)]: true,
            [utils.asGridCoord(11,4)]: true,
            [utils.asGridCoord(11,13)]: true,
            [utils.asGridCoord(12,4)]: true,
            [utils.asGridCoord(12,12)]: true,
            [utils.asGridCoord(13,4)]: true,
            [utils.asGridCoord(13,12)]: true,
            [utils.asGridCoord(14,5)]: true,
            [utils.asGridCoord(14,6)]:true,
            [utils.asGridCoord(14,7)]:true,
            [utils.asGridCoord(14,8)]:true,
            [utils.asGridCoord(14,9)]:true,
            [utils.asGridCoord(14,10)]:true,
            [utils.asGridCoord(14,11)]:true,
        },
        
        cutsceneSpaces: {
            [utils.asGridCoord(7,13)]: [
                /*{
                    events: [
                        { who: "npcA", type: "run", direction: "down" },
                        { who: "npcA", type: "run", direction: "left" },
                        { who: "npcA", type: "run", direction: "left" },
                        { who: "npcA", type: "idle", direction: "down" },
                        { type: "textMessage", text: "First you need to complete the main challenge!!!"},
                        { who: "npcA", type: "idle", direction: "right" },
                        { who: "npcA", type: "run", direction: "right" },
                        { who: "npcA", type: "run", direction: "right" },
                        { who: "character", type: "run", direction: "up" },
                        { who: "character", type: "run", direction: "left" },
                        { who: "character", type: "run", direction: "left" },
                        { who: "character", type: "idle", direction: "up" },
                    ]
                }*/
                {
                    events: [
                        { type: "changeMap", map: "Room2" },
                    ]
                },
            ]
        }
        

    },
    Room2: {
        lowerSrc: '/assets/img/Room 2/Room 2.png',
        upperSrc: '/assets/img/Room 2/DiningRoomUpper.png',
        gameObjects: {
            character: new Person ({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(3),
                cutWidth: 32,  
                cutHeight: 32, 
                imgWidth: 32,  
                imgHeight: 32,
                shadowOffset: 2.4
            }),
            npc: new Person ({
                x: utils.withGrid(6),
                y: utils.withGrid(8),
                src: '/assets/img/Characters/NPC.png',
                cutWidth: 48,  
                cutHeight: 32, 
                imgWidth: 48,  
                imgHeight: 32,
                talking: [
                    {
                        events: [
                            { type : "textMessage", text: "You've made it dumbass", faceHero: "npcA"},
                        ]
                    }
                ]
            }),
        }
    }
}
