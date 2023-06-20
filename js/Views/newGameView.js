import * as User from "/js/Model/User.js";
import GameSession from "/js/Model/GameSession.js";
import Room from "/js/Model/Room.js";
import {utils} from "/js/Model/Utils.js";
import {Person} from "/js/Model/Person.js";
import * as PlanetSet from "/js/Model/PlanetSet.js";

let RoomOneCreation = {
    // Source of lower and upper layers of the room background
    lowerSrc: '/assets/img/Room 1/Room 111.png',
    upperSrc: '/assets/img/Room 1/DemoUpper.png', // This would be used if in any case we need a 'roof' on the scene
    // Challenges of the room
   celestialBodies: [
        JSON.parse(localStorage.getItem('Mercury')),
        JSON.parse(localStorage.getItem('Venus')),
        JSON.parse(localStorage.getItem('Earth')),
        JSON.parse(localStorage.getItem('Mars')),
    ],
    bonusCelestialBodies: [JSON.parse(localStorage.getItem('Sun'))],
    progressBar: localStorage.getItem('RoomOneProgress') || 0,
    // Game objects are dynamic entities in the room, like characters, NPCS etc.
    gameObjects: {
        // playerCharacter is the main character controlled by the player
        playerCharacter: new Person ({
            isPlayerControlled: true, // isPlayerControlled property is used to define whether this character is controlled by the player or not
            // The x, y properties determine the starting position of the character in the room
            x:  utils.withGrid(7), //localStorage.getItem('playerX') ? utils.withGrid(Number(localStorage.getItem('playerX'))/16) : utils.withGrid(7),
            y: utils.withGrid(7),// localStorage.getItem('playerY') ? utils.withGrid(Number(localStorage.getItem('playerY'))/16) : utils.withGrid(6),
            // Set the direction of the player character to playerDirection if it exists if not set it to 'down'
            direction: 'down',
            src:"/assets/img/Characters/User/Pink/Chara_Astronaut09_FullBody_Run_4Dir_6x4.png",  // src and idleSrc properties are the source of the character's spritesheet images for running and idle state respectively
            idleSrc: "/assets/img/Characters/User/Pink/Chara_Astronaut09_FullBody_Idle_8Dir_1x8.png",
            cutWidth: 32,  // cutWidth and cutHeight properties are used to define the size of the character's image from the spritesheet
            cutHeight: 32, 
            imgWidth: 32,  // imgWidth and imgHeight properties are used to define the display size of the character's image
            imgHeight: 32,
            shadowOffset: 2.4, // shadowOffset property is used to define the offset for the character's shadow
        }),
        // Other game objects can be defined in a similar manner
        vase: new Person({
            x: utils.withGrid(6.5),
            y: utils.withGrid(6),
            idleSrc: '/assets/img/Room 1/Vase.png',
            cutWidth: 16,  
            cutHeight: 16, 
            imgWidth: 16,
            imgHeight: 16
        }),
        CUBI: new Person ({
            
          
            x: utils.withGrid(7), //localStorage.getItem('npcX') ? utils.withGrid(Number(localStorage.getItem('npcX'))/16) : utils.withGrid(7),
            y: utils.withGrid(9), //localStorage.getItem('npcY') ? utils.withGrid(Number(localStorage.getItem('npcY'))/16) : utils.withGrid(9),
            //direction: storedCUBIDirection? storedCUBIDirection : 'down',
            src: '/assets/img/CleanBot.png',
            idleSrc: undefined,
            cutWidth: 16,  
            cutHeight: 16, 
            imgWidth: 16,  
            imgHeight: 16,
            shadowOffset: 2.4,
            animations: {  
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
                {type: "idle", direction: "left", time: 2000},
                {type: "run", direction: "left"},
                {type: "idle", direction: "up", time: 2000},
                {type: "run", direction: "up"},
                {type: "idle", direction: "up", time: 1000},
                {type: "idle", direction: "right", time: 2000},
                {type: "run", direction: "right"},
                {type: "idle", direction: "down", time: 2000},
                {type: "run", direction: "down"},
            ],
           // behaviorLoopIndex: storedIndex || 0 ,
            //movingProgressRemaining: storedCUBIMovingProgressRemaining > 0? storedCUBIBehaviorLoopIndex : 0,
            talking: [
                {
                    events: [
                        { 
                            type: "textMessage", 
                            text: "Delighted to see you again, my astute explorer! The inner planets hold wonders beyond imagination. Are you prepared to tackle the challenge that lies ahead?", 
                            faceHero: "CUBI"
                        },
                        { 
                            type: "confirmation", 
                            text: "Start Main Challenge?", 
                            onConfirm: { type: "celestialBodies", initiate: "mainTrivia"},
                            onCancel: { type: "textMessage", text: "Adios!" }
                        },
                    ]
                }
            ]
        }),
    },
    // Walls represent the obstacles in the room that the characters can't pass through
    // They are represented by a dictionary, where the keys are grid coordinates of the wall's location and the values are boolean indicating the presence of a wall
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
    // Cutscene spaces are special areas in the room where a cutscene plays when the player character enters
    // They are represented by a dictionary, where the keys are grid coordinates of the cutscene's location and the values are an array of events for the cutscene
    cutsceneSpaces: {
        // Coordinate (7,13) triggers a change to RoomTwo
        [utils.asGridCoord(7,13)]: [
            {
                events: [
                    { 
                        type: "changeMap", map: "RoomTwo",
                        notAllowed: { type: "textMessage", text: "You can't go there!" },
                
                },
                ]
            },
        ],

        // Coordinate (11, 5) triggers the bonus Trivia challenge
        [utils.asGridCoord(11, 5)]: [
            { events:  [
                { type: 'textMessage', text: "You've unlocked access to the Sun Challenge, a special bonus task dedicated to our solar system's central star. In this challenge, you'll meet SolarProbe, a small robot designed to test your knowledge of the Sun and its many fascinating features. By entering the compartment, you accept the challenge, and the door will remain locked until you successfully complete it. Good luck!"},
                { type: "celestialBodies", planet: 'Sun' },
                ] 
            },
        ],
    
        // Coordinate (6,5) triggers educational content for Venus
        [utils.asGridCoord(6,5)]: [
            {
                events: [
                    { type: "celestialBodies", planet: 'Venus' },
                ]
            },
        ],
    
        // Coordinate (2,11) triggers educational content for Mars
        [utils.asGridCoord(2,11)]: [
            {
                events: [
                    { type: "celestialBodies", planet: 'Mars' },
                ]
            },
        ],
    
        // Coordinate (10,11) triggers educational content for Mercury
        [utils.asGridCoord(10,11)]: [
            {
                events: [
                    { type: "celestialBodies", planet: 'Mercury' },
                ]
            },
        ],
    
        // Coordinate (13,7) triggers educational content for Earth
        [utils.asGridCoord(13,7)]: [
            {
                events: [
                    { type: "celestialBodies", planet: 'Earth' },
                ]
            },
        ],
        [utils.asGridCoord(2,6)]: [
            {
                events: [
                    { 
                        type: 'textMessage', 
                        text: "Welcome, traveler! At the intergalactic shop, we offer a variety of items that can help you on your journey. Here's a rundown of what you can find: \n\n" + 
                              "1. **Assist Tokens**: These can provide you hints, manipulate time or provide power-ups to boost your gameplay. \n\n" +
                              "   a. **Hints**: Need a nudge in the right direction? Our hints can guide you through the toughest challenges. \n\n" +
                              "   b. **Time manipulation**: Feel the pressure of time? This allows you to slow down the pace, giving you the precious moments you need. \n\n" +
                              "   c. **Power-ups**: For when you need that extra edge, our power-ups can reveal parts of an answer or eliminate wrong options, helping you get to the right answer quicker.\n\n" + 
                              "Choose wisely and they can make your journey a lot smoother. Good luck, adventurer!"
                    },
                    { type: "shopKeeper" },
                ]
            },
        ],
        [utils.asGridCoord(3,6)]: [
            {
                events: [
                    { 
                        type: 'textMessage', 
                        text: "Welcome, traveler! At the intergalactic shop, we offer a variety of items that can help you on your journey. Here's a rundown of what you can find: \n\n" + 
                              "1. **Assist Tokens**: These can provide you hints, manipulate time or provide power-ups to boost your gameplay. \n\n" +
                              "   a. **Hints**: Need a nudge in the right direction? Our hints can guide you through the toughest challenges. \n\n" +
                              "   b. **Time manipulation**: Feel the pressure of time? This allows you to slow down the pace, giving you the precious moments you need. \n\n" +
                              "   c. **Power-ups**: For when you need that extra edge, our power-ups can reveal parts of an answer or eliminate wrong options, helping you get to the right answer quicker.\n\n" + 
                              "Choose wisely and they can make your journey a lot smoother. Good luck, adventurer!"
                    },
                    { type: "shopKeeper" },
                ]
            },
        ],
        [utils.asGridCoord(4,6)]: [
            {
                events: [
                    { 
                        type: 'textMessage', 
                        text: "Welcome, traveler! At the intergalactic shop, we offer a variety of items that can help you on your journey. Here's a rundown of what you can find: \n\n" + 
                              "1. **Assist Tokens**: These can provide you hints, manipulate time or provide power-ups to boost your gameplay. \n\n" +
                              "   a. **Hints**: Need a nudge in the right direction? Our hints can guide you through the toughest challenges. \n\n" +
                              "   b. **Time manipulation**: Feel the pressure of time? This allows you to slow down the pace, giving you the precious moments you need. \n\n" +
                              "   c. **Power-ups**: For when you need that extra edge, our power-ups can reveal parts of an answer or eliminate wrong options, helping you get to the right answer quicker.\n\n" + 
                              "Choose wisely and they can make your journey a lot smoother. Good luck, adventurer!"
                    },
                    { type: "shopKeeper" },
                ]
            },
        ],
    },        
    // initialCutscene is an array of events that plays at the start of the game in each room.
    initialCutscene: [

        { type: 'textMessage', text: "Greetings, traveler! I am C.u.b.i!", faceHero: "CUBI" },

    ]
}

let RoomOne = new Room(RoomOneCreation);

let RoomTwoCreation =  {
    lowerSrc: '/assets/img/Room 2/Room 2.png',
    upperSrc: '/assets/img/Room 2/DiningRoomUpper.png',
    // Challenges of the room
    celestialBodies: [
        JSON.parse(localStorage.getItem('Jupiter')),
        JSON.parse(localStorage.getItem('Saturn')),
        JSON.parse(localStorage.getItem('Uranus')),
        JSON.parse(localStorage.getItem('Neptune')),
    ],
    bonusCelestialBodies: [JSON.parse(localStorage.getItem('Meteor Showers'))],
    progressBar: localStorage.getItem('RoomTwoProgress') || 100,
    gameObjects: {
        // playerCharacter is the main character controlled by the player
        playerCharacter: new Person ({
            isPlayerControlled: true, // isPlayerControlled property is used to define whether this character is controlled by the player or not
            // The x, y properties determine the starting position of the character in the room
            x:  utils.withGrid(7),//localStorage.getItem('playerX') ? utils.withGrid(Number(localStorage.getItem('playerX'))/16) : utils.withGrid(7),
            y: utils.withGrid(6), //localStorage.getItem('playerY') ? utils.withGrid(Number(localStorage.getItem('playerY'))/16) : utils.withGrid(6),
            // Set the direction of the player character to playerDirection if it exists if not set it to 'down'
            direction:  'down',
            src:"/assets/img/Characters/User/Pink/Chara_Astronaut09_FullBody_Run_4Dir_6x4.png",  // src and idleSrc properties are the source of the character's spritesheet images for running and idle state respectively
            idleSrc: "/assets/img/Characters/User/Pink/Chara_Astronaut09_FullBody_Idle_8Dir_1x8.png",
            cutWidth: 32,  // cutWidth and cutHeight properties are used to define the size of the character's image from the spritesheet
            cutHeight: 32, 
            imgWidth: 32,  // imgWidth and imgHeight properties are used to define the display size of the character's image
            imgHeight: 32,
            shadowOffset: 2.4, // shadowOffset property is used to define the offset for the character's shadow
        }),
        // Other game objects can be defined in a similar manner
        pillar: new Person({
            x: utils.withGrid(8.5),
            y: utils.withGrid(6.2),
            idleSrc: '/assets/img/Room 2/pillar.png',
            cutWidth: 16,  
            cutHeight: 16, 
            imgWidth: 16,
            imgHeight: 16
        }),

        CUBI: new Person ({
            x: utils.withGrid(7), //localStorage.getItem('npcX') ? utils.withGrid(Number(localStorage.getItem('npcX'))/16) : utils.withGrid(7),
            y: utils.withGrid(9), //localStorage.getItem('npcY') ? utils.withGrid(Number(localStorage.getItem('npcY'))/16) : utils.withGrid(9),
            //direction: storedCUBIDirection? storedCUBIDirection : 'down',
            src: '/assets/img/CleanBot.png',
            idleSrc: undefined,
            cutWidth: 16,  
            cutHeight: 16, 
            imgWidth: 16,  
            imgHeight: 16,
            shadowOffset: 2.4,
            animations: {  
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
                {type: "idle", direction: "left", time: 2000},
                {type: "run", direction: "left"},
                {type: "idle", direction: "up", time: 2000},
                {type: "run", direction: "up"},
                {type: "idle", direction: "up", time: 1000},
                {type: "idle", direction: "right", time: 2000},
                {type: "run", direction: "right"},
                {type: "idle", direction: "down", time: 2000},
                {type: "run", direction: "down"},
            ],
           // behaviorLoopIndex: storedIndex || 0 ,
            //movingProgressRemaining: storedCUBIMovingProgressRemaining > 0? storedCUBIBehaviorLoopIndex : 0,
            talking: [
                {
                    events: [
                        { 
                            type: "textMessage", 
                            text: "Delighted to see you again, my astute explorer! The inner planets hold wonders beyond imagination. Are you prepared to tackle the challenge that lies ahead?", 
                            faceHero: "CUBI"
                        },
                        { 
                            type: "confirmation", 
                            text: "Start Main Challenge?", 
                            onConfirm: { type: "celestialBodies", initiate: "mainTrivia"},
                            onCancel: { type: "textMessage", text: "Adios!" }
                        },
                    ]
                }
            ]
        }),
    },
    walls: {
        [utils.asGridCoord(1,6)]: true,
        [utils.asGridCoord(2,7)]: true,
        [utils.asGridCoord(2,8)]: true,
        [utils.asGridCoord(1,8)]: true,
        [utils.asGridCoord(2,10)]: true,
        [utils.asGridCoord(3,10)]: true,
        [utils.asGridCoord(3,11)]: true,
        [utils.asGridCoord(3,12)]: true,
        [utils.asGridCoord(4,13)]: true,
        [utils.asGridCoord(5,13)]: true,
        [utils.asGridCoord(6,13)]: true,
        [utils.asGridCoord(2,5)]: true,
        [utils.asGridCoord(1,9)]: true,
        [utils.asGridCoord(7,14)]: true,
        [utils.asGridCoord(8,14)]: true,
        [utils.asGridCoord(8,13)]: true,
        [utils.asGridCoord(9,13)]: true,
        [utils.asGridCoord(10,13)]: true,
        [utils.asGridCoord(11,13)]: true,
        [utils.asGridCoord(12,13)]: true,
        [utils.asGridCoord(13,13)]: true,
        [utils.asGridCoord(11,12)]: true,
        [utils.asGridCoord(12,12)]: true,
        [utils.asGridCoord(13,12)]: true,
        [utils.asGridCoord(14,11)]: true,
        [utils.asGridCoord(13,10)]: true,
        [utils.asGridCoord(12,9)]: true,
        [utils.asGridCoord(13,8)]: true,
        [utils.asGridCoord(13,7)]: true,
        [utils.asGridCoord(13,6)]: true,
        [utils.asGridCoord(13,5)]: true,
        [utils.asGridCoord(13,4)]: true,
        [utils.asGridCoord(12,4)]: true,
        [utils.asGridCoord(11,4)]: true,
        [utils.asGridCoord(10,4)]: true,
        [utils.asGridCoord(9,4)]: true,
        [utils.asGridCoord(7,4)]: true,
        [utils.asGridCoord(8,4)]:true,
        [utils.asGridCoord(6,5)]:true,
        [utils.asGridCoord(8,6)]:true,
        [utils.asGridCoord(5,5)]:true,
        [utils.asGridCoord(4,5)]:true,
        [utils.asGridCoord(3,5)]:true,
    },
    // Cutscene spaces are special areas in the room where a cutscene plays when the player character enters
    // They are represented by a dictionary, where the keys are grid coordinates of the cutscene's location and the values are an array of events for the cutscene
   cutsceneSpaces: {
        // Coordinate (7,13) triggers a change to RoomTwo
        [utils.asGridCoord(7,13)]: [
            {
                events: [
                    { 
                        type: "changeMap", map: "RoomOne",
                        notAllowed: { type: "textMessage", text: "You can't go there!" },
                
                },
                ]
            },
        ],

        // Coordinate (11, 5) triggers the bonus Trivia challenge
        [utils.asGridCoord(4, 12)]: [
            { events:  [
                { type: 'textMessage', text: "You've unlocked access to the Sun Challenge, a special bonus task dedicated to our solar system's central star. In this challenge, you'll meet SolarProbe, a small robot designed to test your knowledge of the Sun and its many fascinating features. By entering the compartment, you accept the challenge, and the door will remain locked until you successfully complete it. Good luck!"},
                { type: "celestialBodies", planet: 'Meteor Showers' },
                ] 
            },
        ],
    
        // Coordinate (6,5) triggers educational content for Venus
        [utils.asGridCoord(12,6)]: [
            {
                events: [
                    { type: "celestialBodies", planet: 'Jupiter' },
                ]
            },
        ],
    
        // Coordinate (2,11) triggers educational content for Mars
        [utils.asGridCoord(8,10)]: [
            {
                events: [
                    { type: "celestialBodies", planet: 'Saturn' },
                ]
            },
        ],
    
        // Coordinate (10,11) triggers educational content for Mercury
        [utils.asGridCoord(2,9)]: [
            {
                events: [
                    { type: "celestialBodies", planet: 'Neptune' },
                ]
            },
        ],
    
        // Coordinate (13,7) triggers educational content for Earth
        [utils.asGridCoord(12,11)]: [
            {
                events: [
                    { type: "celestialBodies", planet: 'Uranus' },
                ]
            },
        ],
        [utils.asGridCoord(4,6)]: [
            {
                events: [
                    { 
                        type: 'textMessage', 
                        text: "Welcome, traveler! At the intergalactic shop, we offer a variety of items that can help you on your journey. Here's a rundown of what you can find: \n\n" + 
                              "1. **Assist Tokens**: These can provide you hints, manipulate time or provide power-ups to boost your gameplay. \n\n" +
                              "   a. **Hints**: Need a nudge in the right direction? Our hints can guide you through the toughest challenges. \n\n" +
                              "   b. **Time manipulation**: Feel the pressure of time? This allows you to slow down the pace, giving you the precious moments you need. \n\n" +
                              "   c. **Power-ups**: For when you need that extra edge, our power-ups can reveal parts of an answer or eliminate wrong options, helping you get to the right answer quicker.\n\n" + 
                              "Choose wisely and they can make your journey a lot smoother. Good luck, adventurer!"
                    },
                    { type: "shopKeeper" },
                ]
            },
        ],

        
    },        
    initialCutscene: [
        { who: "playerCharacter", type: "run", direction: "up" },
        { type: 'textMessage', text: "Greetings, traveler! I am C.u.b.i!"},
    ],
}

let RoomTwo = new Room(RoomTwoCreation)

/*
window.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector(".title");
    const bannerContainer = document.querySelector(".title-banner-container");
    
    // Get the width of the title
    const titleWidth = title.getBoundingClientRect().width;

    // Set the width of the banner container to match the title's width, plus some extra padding
    const bannerWidth = titleWidth + 35;  // adjust the added value to my needs
    bannerContainer.style.width = `${bannerWidth}px`;
});*/

const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
const subtitle = document.querySelector('.subtitle');
const difficultyLevels = ['Stellar Novice', 'Cosmic Explorer', 'Galactic Master'];

let currentIndex = 0;
function updateSubtitle() {
    const difficulty = difficultyLevels[currentIndex];

    // Update the subtitle, content, and image
    subtitle.textContent = difficulty;

    // If you have an img element for the image:
    // instructionImageElement.src = instruction.image;

    // Update arrow visibility
    if (currentIndex === 0) {
        // Only show the right arrow
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'block';
    } else if (currentIndex === difficultyLevels.length - 1) {
        // Only show the left arrow
        leftArrow.style.display = 'block';
        rightArrow.style.display = 'none';
    } else {
        // Show both arrows
        leftArrow.style.display = 'block';
        rightArrow.style.display = 'block';
    }
}

leftArrow.addEventListener('click', () => {
    console.log('left arrow clicked');
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = 0; // Prevent the index from going negative
    }
    updateSubtitle();
});

rightArrow.addEventListener('click', () => {
    console.log('right arrow clicked');
    currentIndex++;
    if (currentIndex > difficultyLevels.length - 1) {
        currentIndex = difficultyLevels.length - 1; // Prevent the index from going past the end of the array
    }
    updateSubtitle();
});

// Initial update
updateSubtitle();

const addGameSession = (gameSession, userSessionStorage) => {
    const existingGame = userSessionStorage.gameSessions.some(game => game.gameName === gameSession.gameName);
    if (existingGame) {
        throw new Error(`Game with the name ${gameSession.gameName} already exists`);
    } else {
        // If the length of the game sessions array is less than 3, add a new game session, if it's 3 don't add a new gameSession
        if (userSessionStorage.gameSessions.length < 3) {
            userSessionStorage.gameSessions.push(gameSession);
            // Save the gameName as the active game session
            localStorage.setItem('activeGameSession', gameSession.gameName);
        } else {
            throw new Error('You have reached the maximum number of game sessions. Please delete an existing game before starting a new one.');
        }        
    }
}


document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
User.initUsers();
    // Get the values from the form
    const gameName = document.querySelector('#gameName').value;
    const difficulty = difficultyLevels[currentIndex];


    // Get the currently logged in user
    const userSessionStorage = User.getAuthenticatedUser();
    const userLocalStorage = User.getUserFromLocalStorage(userSessionStorage.username);
    console.log(userSessionStorage);
    console.log(userLocalStorage);


        // Create a new game session
        let gameSession = new GameSession(gameName, difficulty);

        addGameSession(gameSession, userSessionStorage );
        // Add the rooms to the game session
       // gameSession.addRoom('RoomOne', RoomOne);
       // gameSession.addRoom('RoomTwo', RoomTwo);
        console.log(gameSession);
        // Add the new game session to the user's saved games


        User.updateUser(userSessionStorage);

        // If the game was added successfully, clear any existing error message
        document.querySelector('#error-message').style.display = 'none';
        // Locate the user to the rooms html after 1 second
        setTimeout(() => {
            location.href = '../html/rooms.html';
        }, 3000);
    /*catch (error) {
        // If an error was thrown, display it in the error message div
        const errorMessage = document.querySelector('#error-message');
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    }*/
});

PlanetSet.initializeLocalStorage();