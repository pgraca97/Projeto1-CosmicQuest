import  GameObject  from "./GameObject.js";
import { utils } from "/js/common.js";

export class Person extends GameObject {
    constructor(config) {
        super(config);
        this.movingProgressRemaining = 0;
        this.isStanding = false;
        this.currentEventResolve = null;
        this.isPlayerControlled = config.isPlayerControlled || false;
        this.directionUpdate = {
            "up": ["y", -1],
            "down": ["y", 1],
            "left": ["x", -1],
            "right": ["x", 1],
        }
    }

    update(state) {
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
            if(this.movingProgressRemaining === 0) {
                this.isMoving = false; // set isMoving to false after a move has completed
            }
        } else { 
    
            //More cases for starting to walk will come here
            //
            //
    
            //Case: we're keyboard ready (it's okay for the player to be providing input) and have an arrow key pressed
            // we dont want to allow users to change directions until they're moving to that cell
            if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
                //move to this direction
                this.startBehavior(state, {
                    type: "run",
                    direction: state.arrow,
                });
            }
            this.updateSprite(state);
        }
    }
    
    startBehavior (state, behavior) {

        this.isMoving = true; // set isMoving to true when a move starts

        // Set the direction of the character to whatever behavior has
        this.direction = behavior.direction;
        if (behavior.type === "run") {
            //Stop here if space is not free
            if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
    
                behavior.retry && setTimeout (() => {
                    this.startBehavior(state, behavior);
                    console.log(`Trying to move again`)
                }, 50);
    
                return;
            }
            // console.log(state.map.isSpaceTaken(this.x, this.y, this.direction));
    
            // Ready to move
            state.map.moveWall(this.x, this.y, this.direction); // setting a wall in our future position (purpose reserving a place for the player); the wall is moving with the player
            this.movingProgressRemaining = 16;
            this.updateSprite(state);

            // Keep a reference to the resolve function of the current event
            this.currentEventResolve = behavior.onComplete;
            
        } // fire a run/walk command from a character without it coming specifically from the arrow keys
    
        if(behavior.type === "idle"){
            this.isStanding = true;
            setTimeout(() => {
                utils.emitEvent("PersonIdleComplete", {
                    whoId: this.id,
                });
            this.isStanding = false;
            }, behavior.time);
        }
    }
    
    updatePosition() {
            const [property, change] = this.directionUpdate[this.direction];
            this[property] += change;
            this.movingProgressRemaining -= 1;

            if (this.movingProgressRemaining === 0) {
                // We finish moving!
                 utils.emitEvent("PersonRunningComplete", {
                    whoId: this.id,
                });
        
            } 

    }

    updateSprite(){

        
        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation("run-"+this.direction);
            return;
        }
        this.sprite.setAnimation("idle-"+this.direction)

    }
}