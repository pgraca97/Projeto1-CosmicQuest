import {Sprite} from "/js/Model/Sprite.js";
import  OverworldEvent  from "/js/Model/OverworldEvent.js";

export class GameObject {
    constructor(config) {

        this.id = null; // unique ID
        // state to determined if the object is mounted or not  
        this.isMounted = false;

        this.x = config.x || 0;
        this.y = config.y || 0;
        this.shadowOffset = config.shadowOffset || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite ({
            gameObject: this,
            src: config.src || "/assets/img/Characters/User/Pink/Chara_Astronaut09_FullBody_Run_4Dir_6x4.png",
            idleSrc: config.idleSrc || undefined,
            cutWidth: config.cutWidth || 32,
            cutHeight: config.cutHeight || 32,
            imgWidth: config.imgWidth || 32,
            imgHeight: config.imgHeight || 32,
            animations: config.animations,
            isRobot: config.isRobot,
        });

        this.behaviorLoop = config.behaviorLoop || [];
       
        this.behaviorLoopIndex = 0;

        this.talking = config.talking || [];
    }

    mount (map) {

        this.isMounted = true;
        map.addWall(this.x, this.y);

        //If we have a beahvior, kick off after a short delay
        setTimeout(() => {
            this.doBehaviorEvent(map);
        }, 2000);
    }

    update () {
        
    }

    async doBehaviorEvent (map) {
        // Don't do anything if there is a more important scene or there are not any events to execute
        if  (map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding ) {
            return;
        }
        // We are starting the behavior loop
        //this.isBehaviorLoopRunning = true;

        // Setting up our event with relevant information
        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
        eventConfig.who = this.id;
       
        // Create an event instance out of our next event config
        const eventHandler = new OverworldEvent({ map, event: eventConfig});

        await eventHandler.init();

        //Setting the next event to be executed
        this.behaviorLoopIndex++;
        if (this.behaviorLoopIndex === this.behaviorLoop.length) {
            this.behaviorLoopIndex = 0;
        }


        // At the end of the function, we stop the behavior loop
       // this.isBehaviorLoopRunning = false;

        // Do it again
        this.doBehaviorEvent(map);

    }
}
