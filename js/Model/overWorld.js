import { OverworldMap } from "/js/Model/OverworldMap.js";
import { DirectionInput } from "/js/Model/DirectionInput.js";
import  KeyPressListener  from '/js/Model/KeyPressListener.js';

export class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector('.room-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.map = null;
    }

    startGameLoop() {
        const step = () => {

            // Clear Canvas before drawing again
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            //Establish the camera person
            //const cameraPerson = this.map.gameObjects.character;

            //Update all objects
            Object.values(this.map.gameObjects).forEach(obj => {
                obj.update({
                    arrow : this.directionInput.direction,
                    map: this.map,
                })
            });


            //Draw Lower Layer
            this.map.drawLowerImage(this.ctx); //, cameraPerson = undefined

            //Draw Game Objects
            Object.values(this.map.gameObjects).sort((a,b) => {
                return a.y - b.y;
            }).forEach(obj => {
                obj.sprite.draw(this.ctx); //, cameraPerson = undefined
            });

            //Draw Upper Layer
            this.map.drawUpperImage(this.ctx); //, cameraPerson = undefined

            requestAnimationFrame(() => {
                step();
            });
        }
        step();
    }

    bindActionInput() {
        new KeyPressListener("Enter", () => {
            // Is there a person here to talk to?
            this.map.checkForActionCutscene();
        });
    }
   
    bindCharacterPositionCheck(){
        document.addEventListener('PersonRunningComplete', e => {
            if (e.detail.whoId === 'character') {
                
                //Hero's position has changed
                this.map.checkForFootstepCutscene();
            }
    })
    }

    startMap (mapConfig) {
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;
        this.map.mountObjects();
    }
    init() {
        this.startMap(window.OverworldMaps.Room1);
        //console.log(this.map.walls);

        this.bindActionInput();
        this.bindCharacterPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();
     
        this.startGameLoop();

      /* this.map.startCutscene([
         //{type: "battle", enemyId: "beth"}
            //{ type: 'changeMap', map: 'Room1'}
            {who: "character", type: "run", direction: "down"}, {who: "character", type: "run", direction: "down"},
            {who: "character", type: "idle", direction: "right"}, 
            {who: "npcA", type: "run", direction: "left"}, 
            { type: 'textMessage', text: "Greetings, traveler! I am C.u.b.i, your guide in Cosmic Quest. Dr. Sarah has entrusted me with providing you with valuable information and assistance as you progress through the 'Inner Planets Exploration Lab.' In this room, you'll be learning about and testing your knowledge on the inner planets of our solar system: Mercury, Venus, Earth, and Mars. Feel free to explore the room and gather knowledge about these celestial bodies. Whenever you feel ready to take on the Inner Planets Challenge, come back to me, and we'll begin." }
            ,{who: "character", type: "idle", direction: "left"}, {who: "character", type: "run", direction: "left"}, 
        ])*/
}
}