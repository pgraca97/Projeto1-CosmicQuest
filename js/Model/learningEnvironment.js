// Import necessary dependencies
import  OverworldMap  from "/js/Model/OverworldMap.js";
import { DirectionInput } from "/js/Model/DirectionInput.js";
import KeyPressListener from '/js/Model/KeyPressListener.js';
import gameController from './GameController.js';
import { utils } from "/js/Model/Utils.js";
// The LearningEnvironment class is the central part of our application.
// It controls the setup and rendering of the game environment.
export default class LearningEnvironment {
    // Constructor takes a config object
    constructor(config) {
        // The HTML element that will contain the game canvas
        this.element = config.element;

        // The actual game canvas where everything is drawn
        this.canvas = this.element.querySelector('.room-canvas');

        // The 2D rendering context for the canvas, used to draw on the canvas
        this.ctx = this.canvas.getContext('2d');

        // A reference to the OverworldMap, initialized to null
        this.map = null;
    }

// The game loop, where all the magic happens
startGameLoop() {
    // A single step in the game loop
    const step = () => {
        // Check if the game is over
        if (gameController.isGameOver) {
            console.log("Game Over");
            gameController.pauseGame();
            // Stop scheduling further animation frames
            return;
        }

        //Establish the camera person
        const cameraPerson = this.map.gameObjects.playerCharacter;
        const npcPerson = this.map.gameObjects.CUBI;

        // Store the player's position
       localStorage.setItem('playerX', utils.snapToGrid(cameraPerson.x));
        localStorage.setItem('playerY', utils.snapToGrid(cameraPerson.y));
        
        // Store the NPC's position
        localStorage.setItem('npcX', utils.snapToGrid(npcPerson.x));
        localStorage.setItem('npcY', utils.snapToGrid(npcPerson.y));

        // Clear the canvas before drawing again
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update all game objects
        Object.values(this.map.gameObjects).forEach(obj => {
            obj.update({
                arrow: this.directionInput.direction,
                map: this.map,
            })
        });

        // Draw lower layer of the map
        this.map.drawLowerImage(this.ctx);

        // Draw game objects
        Object.values(this.map.gameObjects).sort((a, b) => {
            return a.y - b.y;
        }).forEach(obj => {
            
            obj.sprite.draw(this.ctx);
        });

        // Draw upper layer of the map
        this.map.drawUpperImage(this.ctx);

        // Request the next animation frame, passing the step function to be called on next repaint
        requestAnimationFrame(() => {
            step();
        });

        //console.log(gameController.isGameOver);
    }

    // Start the game loop
    step();
}

    // This method is responsible for handling key press events
    bindActionInput() {
        // Listen for the 'Enter' key press
        new KeyPressListener("Enter", () => {
            // If 'Enter' is pressed, check if there's an action cutscene to start
            this.map.checkForActionCutscene();
        });
    }

    // This method binds an event listener to check the character's position
    bindCharacterPositionCheck() {
        document.addEventListener('PersonRunningComplete', e => {
            // If the event detail indicates that the character moved
            if (e.detail.whoId === 'playerCharacter') {
                // The character's position has changed
                this.map.checkForFootstepCutscene();
            }
            
        })
    }

    // This method sets up the OverworldMap
    startMap(mapConfig) {
        // Create a new OverworldMap with the given configuration
        this.map = new OverworldMap(mapConfig);
    
        // Associate this LearningEnvironment with the map
        this.map.overworld = this;
    
        // Mount the game objects on the map
        this.map.mountObjects();
    
        // Start the initial cutscene for the room, if it has one
        if (mapConfig.initialCutscene) {
            this.map.startCutscene(mapConfig.initialCutscene);
        };

         // Save the room's key (i.e., its name) to currentRoom
        this.currentRoom = Object.keys(window.EscapeRooms).find(key => window.EscapeRooms[key] === mapConfig);
        localStorage.setItem('currentRoom', 'RoomOne'); //CHANGE THIS LINE!!!
        console.log(this.currentRoom);
    }
    

    // Initialize the LearningEnvironment
    init() {
        // Get the current room from localStorage
        const currentRoom = localStorage.getItem('currentRoom') || 'RoomOne';

        // Start the map using the current room's configuration
        this.startMap(window.EscapeRooms[currentRoom]);

        // Bind the action input to listen for 'Enter' key press
        this.bindActionInput();

        // Bind the character position check
        this.bindCharacterPositionCheck();

        // Create a new DirectionInput instance and initialize it
        this.directionInput = new DirectionInput();
        this.directionInput.init();

        // Start the game loop
        this.startGameLoop();

    }
}
