import { TextMessage } from "/js/Model/TextMessage.js";
import { utils } from "/js/Model/Utils.js";
import { SceneTransition } from "/js/Model/SceneTransition.js";
import { Challenge } from "/js/Model/Challenge/Challenge.js";

export class OverworldEvent {
    constructor({ map, event }) {
        this.map = map;
        this.event = event;
    }

    idle(resolve){
        const who = this.map.gameObjects[ this.event.who ];
        who.startBehavior({
            map: this.map
        }, {
            type: "idle",
            direction: this.event.direction,
            time: this.event.time,
        })

        // Set up a handler to complete when correct person is done walking, then resolve the promise

const completeHandler = event => {
    //console.log('PersonIdleComplete event triggered', event.detail.whoId, this.event.who);
    if (event.detail.whoId === this.event.who) {
       // console.log('Resolving idle promise');
        document.removeEventListener("PersonIdleComplete", completeHandler);
        resolve();
    }
    }
        document.addEventListener("PersonIdleComplete", completeHandler);
};

    run(resolve){
        const who = this.map.gameObjects[ this.event.who ];
        who.startBehavior({
            map: this.map
        }, {
            type: "run",
            direction: this.event.direction,
            retry: true,
        })

        // Set up a handler to complete when correct person is done walking, then resolve the promise
        const completeHandler = event => {
 //console.log('PersonRunningComplete event triggered', event.detail.whoId, this.event.who);
            if (event.detail.whoId === this.event.who) {
 //console.log('Resolving running promise');
                document.removeEventListener("PersonRunningComplete", completeHandler);
                resolve();
            }};

        document.addEventListener("PersonRunningComplete", completeHandler);
    };

textMessage(resolve){

    if(this.event.faceHero) {
        const object = this.map.gameObjects[ this.event.faceHero ];
        object.direction = utils.oppositeDirection(this.map.gameObjects["character"].direction);
    }
        const message = new TextMessage({
         text: this.event.text,
         onComplete: () => resolve()
    });
    message.init( document.querySelector(".room-container"));
};

changeMap (resolve) {

    const sceneTransition = new SceneTransition();
    sceneTransition.init( document.querySelector(".room-container"), () => {
        this.map.overworld.startMap( window.OverworldMaps[this.event.map] );
        resolve();

        sceneTransition.fadeOut();
    });


};

battle(resolve){
    const planet = new Challenge({
        onComplete: () => {
            resolve()
        }
    });
    planet.init( document.querySelector(".room-container"));
};


    init(){
        return new Promise(resolve => {
            this[this.event.type](resolve);
        });
        
    }
}