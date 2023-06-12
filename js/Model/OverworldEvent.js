import { utils } from "/js/Model/Utils.js";
import { SceneTransition } from "/js/Model/SceneTransition.js";
import { Challenge } from "/js/Model/Challenge/Challenge.js";

// The OverworldEvent class defines how different types of events are handled in the app.
export default class OverworldEvent {
    constructor({ map, event }) {
        // map: The current map
        // event: The current event happening
        this.map = map;
        this.event = event;
        
    }

    // The idle function handles the idle event.
    // The object starts an idle behavior and when it's done, the Promise is resolved.
    idle(resolve){
        const who = this.map.gameObjects[ this.event.who ];
        who.startBehavior({
            map: this.map
        }, {
            type: "idle",
            direction: this.event.direction,
            time: this.event.time,
        });

        // Event listener for when the object's idle behavior is done.
        const completeHandler = event => {
            if (event.detail.whoId === this.event.who) {
                document.removeEventListener("PersonIdleComplete", completeHandler);
                resolve(); // Promise resolved here
            }
        };

        document.addEventListener("PersonIdleComplete", completeHandler);
    };

    // The run function handles the run event.
    // The object starts a run behavior and when it's done, the Promise is resolved.
    run(resolve){
        const who = this.map.gameObjects[ this.event.who ];
        who.startBehavior({
            map: this.map
        }, {
            type: "run",
            direction: this.event.direction,
            retry: true,
        });

        // Event listener for when the object's run behavior is done.
        const completeHandler = event => {
            if (event.detail.whoId === this.event.who) {
                document.removeEventListener("PersonRunningComplete", completeHandler);
                resolve(); // Promise resolved here
            }
        };

        document.addEventListener("PersonRunningComplete", completeHandler);
    };

    // The textMessage method handles the textMessage event.
    // It creates a new text message and when the message is done, the Promise is resolved.
    textMessage(resolve) {
        if(this.event.faceHero) {
            const object = this.map.gameObjects[ this.event.faceHero ];
            object.direction = utils.oppositeDirection(this.map.gameObjects["playerCharacter"].direction);
        }

        utils.emitEvent('textMessage', {
            text: this.event.text,
            onComplete: resolve // Promise resolved here
        });
    };


    // The changeMap method handles the changeMap event.
    // It creates a new scene transition, starts the new map, and when the transition is done, the Promise is resolved.
    changeMap (resolve) {
        const sceneTransition = new SceneTransition();
        sceneTransition.init( document.querySelector(".room-container"), () => {
            this.map.overworld.startMap( window.EscapeRooms[this.event.map] );
            resolve(); // Promise resolved here
            sceneTransition.fadeOut();
        });
    };

    // The confirmation method handles the confirmation event.
    // It creates a confirmation box and when a choice is made, the Promise is resolved.
    confirmation(resolve) {
        console.log(this.map)
        utils.emitEvent('confirmation', {
            event: this.event,
            onComplete: resolve // Promise resolved here
        });
    }

    // The mainTrivia method handles the battle event.
    // It starts a new battle and when the battle is done, the Promise is resolved.
    mainTrivia(resolve){
        console.dir(this.event)
        console.log(EscapeRooms.RoomOne);  // Add this line
        console.log(this.event.type);      // And this line
        utils.emitEvent('mainTrivia', {
            event: EscapeRooms.RoomOne[this.event.type],
            onComplete: resolve // Promise resolved here
        });
    };
    

    // The init method initializes the event by calling the appropriate method based on the event type.
    // It returns a Promise which is resolved when the method is done.
    init(){
        return new Promise(resolve => {
            this[this.event.type](resolve); 
        }); 
    }
}
