import {utils} from "/js/Model/Utils.js";

export default class Sprite {
    constructor(config) {

        // Set up the Image for the running animation
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }
        
        // if an idleSrc is provided, use it, otherwise use the same as the running sprite sheet

        if (config.idleSrc) {
            this.idleImage = new Image();
            this.idleImage.src = config.idleSrc;
            this.idleImage.onload = () => {
                this.idleLoaded = true;
            }
        } else {
            this.idleImage = this.image;
            this.idleLoaded = true;
        }

        // Set up the image for the idle animation
        this.cutWidth = config.cutWidth
        this.cutHeight = config.cutHeight 
        this.imgWidth = config.imgWidth || this.image.width;
        this.imgHeight = config.imgHeight || this.image.height;


        // Shadow
        this.shadow = new Image();
        this.useShadow = true // config.useShadow || false;
        if (this.useShadow) {
            this.shadow.src = config.shadowSrc || '/assets/img/Characters/shadow.png';
        }
        this.shadow.onload = () => {
                    this.shadowLoaded = true;
        } // Add a flag to check if the shadow is loaded


        
        this.shadowOffsets = config.shadowOffsets || {
            "idle-down": [ [0, 0] ],
            "idle-right": [ [0, 0] ],
            "idle-up": [ [0, -2] ],
            "idle-left": [ [0, 0] ],
            "run-down": [ [0, 0], [0, 0.3], [0, 0.3], [0, 0], [0, 0.3], [0, 0.3] ],
            "run-right": [ [0, 0], [0.7, 0], [0.7, 0], [0, 0], [0.7, 0], [0.7, 0] ],
            "run-up": [ [0, 0], [0, -1.7], [0, -1.7], [0, 0], [0, -1.7], [0, -1.7] ],
            "run-left": [ [0, 0], [-0.7, 0], [-0.7, 0], [0, 0], [-0.7, 0], [-0.7, 0] ],
        };


        // Configure Animation & Initial State
        this.animations = config.animations || {
            // x on the left, y on the right
            "idle-down": [ [0, 0] ],
            "idle-right": [ [0, 2] ],
            "idle-up": [ [0, 4] ],
            "idle-left": [ [0, 6] ],
            "run-down": [ [0, 0], [1, 0], [2,0], [3,0], [4,0], [5,0] ],
            "run-right": [ [0, 1], [1, 1], [2,1], [3,1], [4,1], [5,1], ],
            "run-up": [ [0, 2], [1, 2], [2,2], [3,2], [4,2], [5,2] ],
            "run-left": [ [0, 3], [1, 3], [2,3], [3,3], [4,3], [5,3]],
        }
        this.currentAnimation = "run-left" //config.currentAnimation || 'idle-down';
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 8; // decrease to 16 to allow the person to walk faster
        this.animationFrameProgress = this.animationFrameLimit; 
        //Reference to the GameObject
        this.gameObject = config.gameObject;

        this.isRobot = config.isRobot || false;
    }

    // get method to be in charge to figure out which animationm we're on and which animation frame we're one
    get frame(){
        let frame = this.animations[this.currentAnimation][this.currentAnimationFrame];
        
        if (!this.isLoaded || !this.idleLoaded) {
            return null;
        }
    
// If there is an idle image and the current animation starts with 'idle', then return the frame and the idle image


        if ( this.idleImage != this.image && this.currentAnimation.startsWith('idle')) {
            return { frame, img: this.idleImage };
        } else {
            return { frame, img: this.image };
        }
    }
    
    //
    setAnimation(key) {
        // Is this animation changing?
        if (this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }


    updateAnimationProgress() {
        //Downtick the current frame we're on
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress--;
            return;
        }
    
        //Reset the counter
        this.animationFrameProgress = this.animationFrameLimit - 1 ;
        this.currentAnimationFrame++;
    
        // Check if we've exceeded the frame limit
        if (this.animations[this.currentAnimation][this.currentAnimationFrame] === undefined) {
            this.currentAnimationFrame = 0;
        }
    }
    
    

    draw(ctx) { 
         let x, y;
         
        const isRobot = this.isRobot;
        if (isRobot === true) {
            x = this.gameObject.x 
            y = this.gameObject.y  
        } else {
             x = this.gameObject.x -8  
             y = this.gameObject.y -16 
        }
    
        const shadowWidth = 32;
        const shadowHeight = 32;
        
        const shadowOffset = this.shadowOffsets[this.currentAnimation][this.currentAnimationFrame];
        const shadowX = x + (this.imgWidth - shadowWidth) / 2 + shadowOffset[0];
        const shadowY = y + (this.imgHeight - shadowHeight) + this.gameObject.shadowOffset + shadowOffset[1];


        const frameData = this.frame;
        if (!frameData) {
            return;
        }
        
        const {img, frame} = frameData;

        const [frameX, frameY] = frame;

        this.shadowLoaded && ctx.drawImage(this.shadow, shadowX, shadowY, shadowWidth, shadowHeight)
    
        this.isLoaded && this.idleLoaded && ctx.drawImage(img, frameX * this.imgWidth, frameY * this.imgHeight, this.cutWidth, this.cutHeight, x , y, this.imgWidth, this.imgHeight);

        this.updateAnimationProgress();
     
    }
    
    
}