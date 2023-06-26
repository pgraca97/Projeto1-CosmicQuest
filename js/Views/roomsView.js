import  LearningEnvironment  from "/js/Model/learningEnvironment.js";
import OverworldEvent from "/js/Model/OverworldEvent.js";
import  KeyPressListener  from '/js/Model/KeyPressListener.js';
import { utils } from "/js/common.js";
import {Person} from "/js/Model/Person.js";
import * as PlanetSet from "/js/Model/PlanetSet.js";
import gameController from '/js/Model/GameController.js';
import * as User from "/js/Model/User.js";
import { updateGameSessionState, restartGameSession } from "/js/Model/GameSession.js";

let cosmicQuest
let currentRoom

// Get the modal
const modal = document.getElementById("exitModal");

// Get the button that opens the modal
const btn = document.getElementById("home-btn");

// Get the elements that close the modal
const confirmExit = document.getElementById("confirmExit");
const cancelExit = document.getElementById("cancelExit");

// When the user clicks the button, open the modal
btn.onclick = function() {
    console.log("Home button clicked");
    modal.style.display = "block";
}

// When the user clicks on "Yes", redirect to index.html
confirmExit.onclick = function() {
    window.location.href = "/index.html";
}

// When the user clicks on "No", close the modal
cancelExit.onclick = function() {
    modal.style.display = "none";
}


function updateCelestialBodiesInLocalStorage(gameSession) {
    for (let gameSessionCelestialBody of gameSession.celestialBodies) {
        let localStorageCelestialBody = JSON.parse(localStorage.getItem(gameSessionCelestialBody.planet));

        // Update notes
        localStorageCelestialBody.notes = gameSessionCelestialBody.notes;
        // Update research terminal
        localStorageCelestialBody.researchTerminal = gameSessionCelestialBody.researchTerminal;

        // Update isAnsweredCorrectly and isTokenUsed in challenges
        for (let challengeType in localStorageCelestialBody.challenges) {
            for (let i = 0; i < localStorageCelestialBody.challenges[challengeType].length; i++) {
                localStorageCelestialBody.challenges[challengeType][i].isAnsweredCorrectly = gameSessionCelestialBody.challenges[challengeType][i].isAnsweredCorrectly;
                localStorageCelestialBody.challenges[challengeType][i].isTokenUsed = gameSessionCelestialBody.challenges[challengeType][i].isTokenUsed;
            }
        }


        // Update the celestial body data in localStorage
        localStorage.setItem(gameSessionCelestialBody.planet, JSON.stringify(localStorageCelestialBody));
    }
}


// Get the currently playing game session
const authenticatedUser = User.getAuthenticatedUser();
const activeGameName = localStorage.getItem('activeGameSession');
const gameSession = authenticatedUser.gameSessions.find(gameSession => gameSession.gameName == activeGameName);

document.addEventListener("DOMContentLoaded", function() {
    checkForGameEnd();
    updateCelestialBodiesInLocalStorage(gameSession);
});

document.addEventListener("visibilitychange", function() {
    if (window.location.pathname.endsWith('rooms.html')) {
        updateCelestialBodiesInLocalStorage(gameSession)
        
        if (document.visibilityState === 'hidden') {
            console.log("User navigated away");
            console.log("User navigated away");
            // Update the game session with the current state of the game
            updateGameSessionState(gameSession);

            console.log(gameSession)

            // Update the game session in local storage
            User.updateGameSession(authenticatedUser.username, gameSession);
        } else if (document.visibilityState === 'visible') {
            console.log("User returned");
        }
    }
});





const initialize = () => {
    cosmicQuest = new LearningEnvironment({
        element: document.querySelector(".room-container"),
      });
      cosmicQuest.init();
      currentRoom = cosmicQuest.map.overworld.currentRoom;

}


//Get the  main containers of Cosmic Quest
const roomsContainer = document.querySelector('.rooms');
const frameContainer = document.querySelector(".frame-container");
const roomContainer = document.querySelector(".room-container");

let storedDirection = localStorage.getItem('playerDirection');

// Get CUBI's stored properties
let storedCUBIBehaviorLoopIndex = localStorage.getItem('CUBI_behaviorLoopIndex');
const storedIndex = Number(storedCUBIBehaviorLoopIndex)

const storedCUBIDirection = localStorage.getItem('CUBI_direction');
let storedCUBIMovingProgressRemaining = Number(localStorage.getItem('CUBI_movingProgressRemaining'));

// We use the window object to create a global object called "EscapeRooms". 
// This object will hold all the data related to different rooms of our game.
window.EscapeRooms = {
    RoomOne: {
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
        progressBar:  gameSession ? gameSession.roomOneProgress : 0,
        // Game objects are dynamic entities in the room, like characters, NPCS etc.
        gameObjects: {
            // playerCharacter is the main character controlled by the player
            playerCharacter: new Person ({
                isPlayerControlled: true, // isPlayerControlled property is used to define whether this character is controlled by the player or not
                // The x, y properties determine the starting position of the character in the room
                x:  utils.withGrid(7), //localStorage.getItem('playerX') ? utils.withGrid(Number(localStorage.getItem('playerX'))/16) : utils.withGrid(7),
                y: utils.withGrid(7),// localStorage.getItem('playerY') ? utils.withGrid(Number(localStorage.getItem('playerY'))/16) : utils.withGrid(6),
                // Set the direction of the player character to playerDirection if it exists if not set it to 'down'
               // direction: storedDirection ? storedDirection : 'down',
                src: authenticatedUser.characterColor['src'],  // src and idleSrc properties are the source of the character's spritesheet images for running and idle state respectively
                idleSrc: authenticatedUser.characterColor['idleSrc'], 
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
        /*initialCutscene: [

            { type: 'textMessage', text: "Greetings, traveler! I am C.u.b.i!", faceHero: "CUBI" },

        ]*/
    },
    // RoomTwo holds all the data for the second room of Cosmic Quest
    // Similar structure to RoomOne
    RoomTwo: {
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
        progressBar: gameSession ? gameSession.roomTwoProgress : 0,
        gameObjects: {
            // playerCharacter is the main character controlled by the player
            playerCharacter: new Person ({
                isPlayerControlled: true, // isPlayerControlled property is used to define whether this character is controlled by the player or not
                // The x, y properties determine the starting position of the character in the room
                x:  utils.withGrid(7),//localStorage.getItem('playerX') ? utils.withGrid(Number(localStorage.getItem('playerX'))/16) : utils.withGrid(7),
                y: utils.withGrid(6), //localStorage.getItem('playerY') ? utils.withGrid(Number(localStorage.getItem('playerY'))/16) : utils.withGrid(6),
                // Set the direction of the player character to playerDirection if it exists if not set it to 'down'
               // direction: storedDirection ? storedDirection : 'down',
                src: authenticatedUser.characterColor['src'],  // src and idleSrc properties are the source of the character's spritesheet images for running and idle state respectively
                idleSrc: authenticatedUser.characterColor['idleSrc'], 
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
       /* initialCutscene: [
            { who: "playerCharacter", type: "run", direction: "up" },
            { type: 'textMessage', text: "Greetings, traveler! I am C.u.b.i!"},
        ],*/
    },
    timeLimit: gameSession.timeLimit,
}

initialize();

startCountdown();
console.log(gameSession.timeLimit);
console.log(window.EscapeRooms.timeLimit)
/*/ Listen for the pageshow event to resume the countdown
window.addEventListener('pageshow', function() {
    // Check if the current page is 'rooms.html'
    if (window.location.href.includes('rooms.html')) {
       
       
        if (window.EscapeRooms.timeLimit.remaining > 0) {
            startCountdown();

        }
    }
});




// Listen for the pagehide event to pause the countdown
window.addEventListener('pagehide', function() {
    // Stop the countdown
    clearInterval(window.EscapeRooms.timeLimit.intervalId);
});*/


if (currentRoom === 'RoomTwo') {
    console.log(currentRoom);
    roomContainer.classList.add('room-two');
};

let playerCharacter = window.EscapeRooms[currentRoom].gameObjects.playerCharacter;
let CUBI = window.EscapeRooms[currentRoom].gameObjects.CUBI;

// Create the countdown display once
const countdownDisplay = document.createElement('div');
countdownDisplay.classList.add('countdown-display');

roomsContainer.appendChild(countdownDisplay);

// Function to start the countdown
function startCountdown(interval = 1000) {
    // If there's an existing interval, clear it
    if (window.EscapeRooms.timeLimit.intervalId) {
        clearInterval(window.EscapeRooms.timeLimit.intervalId);
    }

console.log(window.EscapeRooms.timeLimit)
    // Start the countdown interval
    window.EscapeRooms.timeLimit.intervalId = setInterval(function() {
        // Decrement the remaining time
        window.EscapeRooms.timeLimit.remaining--;
        // Check if the countdown has finished
        if (window.EscapeRooms.timeLimit.remaining <= 0) {
            // If the player or CUBI is currently moving, delay ending the game until they have finished

            if (playerCharacter.isMoving || CUBI.movingProgressRemaining > 0) {
                console.log("Either Player or CUBI is moving, delaying end of game");
                const movementDuration = 400; // Adjust this based on the duration of your movement
                setTimeout(() => {
                    gameController.gameOver();
                    handleEndOfGame();
                }, movementDuration);
            } else {
                console.log("Neither Player nor CUBI is moving, ending game");
                // If neither the player nor CUBI are moving, end the game immediately
                gameController.gameOver();
                handleEndOfGame();
            }


            // Stop the countdown
            clearInterval(window.EscapeRooms.timeLimit.intervalId);
        }
        
                
        // Update the countdown display
        countdownDisplay.innerText = formatTime(window.EscapeRooms.timeLimit.remaining);
        }, interval);  // Update every second
}

// Function to format a time in seconds into a MM:SS string
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Function to handle the end of the game
function handleEndOfGame() {
    // Get the modal
    const modal = document.getElementById("modalContainer");

    // Get the buttons
    const btnYes = document.getElementById("btnYes");
    const btnNo = document.getElementById("btnNo");

    // Get the modal text
    const modalText = document.getElementById("modalText");
    modalText.innerHTML = "Explorer, your time has ended. Do you wish to restart your learning journey?";

    // Make the modal visible
    modal.style.display = "block";

    // Store the player character's direction
    localStorage.setItem('playerDirection', playerCharacter.direction);

    // Store CUBI's properties


    localStorage.setItem('CUBI_behaviorLoopIndex', CUBI.behaviorLoopIndex);
    localStorage.setItem('CUBI_direction', CUBI.direction);
    localStorage.setItem('CUBI_movingProgressRemaining', CUBI.movingProgressRemaining);

    // Set value in LocalStorage indicating that game has ended
    localStorage.setItem('gameEnded', 'true');

    // When the user clicks on "Yes", restart the game
    btnYes.onclick = function() {
        modal.style.display = "none";
        // Remove gameEnded from LocalStorage
        localStorage.removeItem('gameEnded');
        // Code to reset the game here
       
        resetGame();
    }

    // When the user clicks on "No", redirect to index.html
    btnNo.onclick = function() {
        modal.style.display = "none";


        // Remove gameEnded from LocalStorage
        localStorage.removeItem('gameEnded');
        window.location.href = "/index.html";
    }
}

function resetGame() {
    gameController.restartGame();
    const celestialBodies = getRoomsCelestialBodies(currentRoom);

    // Iterate over each celestial body
    celestialBodies.forEach(body => {
        // Reset notes and research terminal
        body.notes = "";
        Object.keys(body.researchTerminal).forEach(key => {
            body.researchTerminal[key] = "";
        });

        // Iterate over each type of challenge
        Object.keys(body.challenges).forEach(challengeType => {
            // Reset 'isAnsweredCorrectly' for each challenge
            body.challenges[challengeType].forEach(challenge => {
                challenge.isAnsweredCorrectly = null;
                if (challenge.isTokenUsed) {
                    challenge.isTokenUsed = null;
                }
            });
        });

        // Update in the localStorage
        localStorage.setItem(body.planet, JSON.stringify(body));
    });

    let bonusCelestialBodies = getRoomsCelestialBodies(currentRoom, bonusTrivia);

    for (let body of bonusCelestialBodies) {
        console.log(body)
        for (let challengeCategory in body.challenges) {
            for (let challenge of body.challenges[challengeCategory]) {
                challenge.isAnsweredCorrectly = null;
                delete challenge.isTokenUsed;
            }
        }
        
        for (let key in body.researchTerminal) {
            body.researchTerminal[key] = "";
        }
    
        body.notes = "";
            // Save the reset celestial bodies back to storage
    localStorage.setItem(body.planet, JSON.stringify(body));
    }
    

    
    // Get the player's direction from localStorage
    const playerDirection = localStorage.getItem('playerDirection');

    // Set the player character's direction
    if (playerDirection) {
        playerCharacter.direction = playerDirection;
    }

    restartGameSession(gameSession);
    console.log(gameSession)
   updateGameSessionState(gameSession);
   console.log(gameSession)
    // Update the game session in local storage
    User.updateGameSession(authenticatedUser.username, gameSession);
    console.log(gameSession)

    // Refresh the page
    localStorage.setItem('currentRoom', 'RoomOne');
    location.reload();
    gameController.restartGame();
}

function checkForGameEnd() {
    if (localStorage.getItem('gameEnded') === 'true') {
        handleEndOfGame();
        gameController.gameOver();
    }
}

function toTitleCase(str) {
    return str.replace(/([A-Z])/g, ' $1').trim();
}
// Separate function to create progress bar and progress text
function createProgressInfo() {
    // Create progress bar
    const progressBarRectangle = document.createElement('div');
    progressBarRectangle.innerHTML = (`
        <img src="/assets/img/GUI/ProgressBar.png" class="progressBar">
        <svg viewBox="0 0 26 3" class="FillBar-container ${currentRoom}">
            <rect class="rect1" x=0 y=1 width="${EscapeRooms[currentRoom].progressBar}%" height=5.4 />
            <rect class="rect2" x=0 y=0 width="${EscapeRooms[currentRoom].progressBar}%" height=2 />
        </svg>
    `);
    progressBarRectangle.classList.add('progressBarRectangle');

    // Create progress text
    const progressCounterContainer = document.createElement('div');
    progressCounterContainer.classList.add('progressCounterContainer');
    progressCounterContainer.innerText = `${EscapeRooms[currentRoom].progressBar}% completed of ${toTitleCase(currentRoom)}`;

    return { progressBarRectangle, progressCounterContainer };
}
function createHUD() {
    
 /*   const authenticatedUser = {
        username: 'Grupo13',
        characterColor: '/assets/img/Characters/User/BiColor/BiColor.png'
    }*/
    const hudContainer = document.createElement('div');
    hudContainer.classList.add('hudContainer');

    // Create profileContainer
    const profileContainer = document.createElement('div');
    profileContainer.classList.add('profileContainer');
    
    // Create img for profile pic based on characterColor
    const profilePic = document.createElement('img');
    profilePic.src = authenticatedUser.characterColor['head']; // Assuming this path, adjust it to your needs
    //profilePic.style.width = '50px';
    profilePic.classList.add('profilePic');
    profileContainer.appendChild(profilePic);
    
    // Create span for username
    const usernameSpan = document.createElement('span');
    usernameSpan.innerText = authenticatedUser.username;
    usernameSpan.classList.add('username');
    profileContainer.appendChild(usernameSpan);

    // Add profileContainer to the hudContainer
    hudContainer.appendChild(profileContainer);

    // Create progressBarContainer
    const progressBarContainer = document.createElement('div');
    progressBarContainer.classList.add('progressBarContainer');
    
    // Create progress bar and progress text
    const { progressBarRectangle, progressCounterContainer } = createProgressInfo();
    progressBarContainer.appendChild(progressBarRectangle);
    progressBarContainer.appendChild(progressCounterContainer);


    // Create coinCounterContainer
    const coinCounterContainer = document.createElement('div');
    coinCounterContainer.classList.add('coinCounterContainer');
    
    // Create coinCounterNumber
    const coinCounterNumber = document.createElement('span');
    coinCounterNumber.innerText = gameSession.coins // Replace 0 with authenticatedUser.coins when the logic is ready
    coinCounterNumber.classList.add('coinCounterNumber');
    coinCounterContainer.appendChild(coinCounterNumber);
    
    // Create coinCounterIcon
    const coinCounterIcon = document.createElement('img');
    coinCounterIcon.src = '/assets/img/GUI/Coin.png'; // Assuming this path, adjust it to your needs
    coinCounterIcon.classList.add('coinCounterIcon');
    coinCounterContainer.appendChild(coinCounterIcon);
    
    const progressContainer = document.createElement('div');
    progressContainer.classList.add('progressContainer');
    progressContainer.appendChild(progressBarContainer);
    progressBarContainer.appendChild(progressCounterContainer);
    progressContainer.appendChild(coinCounterContainer);
    // Add coinCounterContainer to the hudContainer
    hudContainer.appendChild(progressContainer);

    // Return the hudContainer to be appended to the roomContainer or wherever you want to display it
    return hudContainer;
}

// Update function
function updateHUD() {
    // Get the existing progress bar
    const existingProgressBar = document.querySelector('.progressBarRectangle');
    
    // Get the existing progress text
    const existingProgressText = document.querySelector('.progressCounterContainer');

    // Create a new progress bar and progress text with the updated progress
    const { progressBarRectangle, progressCounterContainer } = createProgressInfo();

    // Replace the old progress bar with the new one
    existingProgressBar.replaceWith(progressBarRectangle);

    // Replace the old progress text with the new one
    existingProgressText.replaceWith(progressCounterContainer);
}


// Usage:
const hud = createHUD();
frameContainer.appendChild(hud);


/*  Event listeners for UI updates and interactivity */

// The 'textMessage' event fires when a new text message needs to be displayed in the UI
document.addEventListener("textMessage", function(e) {
    const { text, onComplete } = e.detail;
    // Calls function to create and display a new text message
    createAndDisplayTextMessage(text, onComplete);
});

// The createAndDisplayTextMessage function takes the message text and a callback function 'onComplete'.
// It creates a new div with class 'TextMessage' and inserts it into the document.
// After the message is revealed, it removes itself and calls 'onComplete'.
function createAndDisplayTextMessage(text, onComplete) {
    const container = document.querySelector(".room-container");

    const element = document.createElement('div');
    element.classList.add('TextMessage');

    element.innerHTML = (`
        <p class="TextMessage_p"></p>
        <button class="TextMessage_button">Next</button>
    `);

    const revealingText = createRevealingText(element.querySelector('.TextMessage_p'), text);

    const finishMessage = () => {
        if (revealingText.isDone()){
            element.remove();
            onComplete();
            actionListener.unbind();
        } else {
            revealingText.warpToDone();
        }
    };

    element.querySelector('button').addEventListener('click', finishMessage);
    const actionListener = new KeyPressListener("Enter", finishMessage);

    container.appendChild(element);
}

// The createRevealingText function reveals a text message one character at a time.
// It wraps each character in a span and adds the 'revealed' class to each span in sequence.
// It also provides functions to skip to the end of the reveal and to check if the reveal has finished.
function createRevealingText(element, text, speed = 30) {
    let timeout = null;
    let isDone = false;

    function revealOneCharacter(list) {
        const next = list.splice(0, 1)[0];
        next.span.classList.add('revealed');

        if (list.length > 0) {
            timeout = setTimeout(() => {
                revealOneCharacter(list);
            }, next.delayAfter);
        } else {
            isDone = true;
        }
    }

    function warpToDone() {
        clearTimeout(timeout);
        isDone = true;

        element.querySelectorAll('span').forEach(span => {
            span.classList.add('revealed');
        });
    }

    let characters = [];
    text.split('').forEach(char => {
        let span = document.createElement('span');
        span.innerText = char;
        element.appendChild(span);

        characters.push({
            span,
            delayAfter: char === " " ? 0 : speed
        });
    });

    revealOneCharacter(characters);

    return {
        warpToDone,
        isDone: () => isDone,
    };
}

// The 'celestialBodies' event fires when a new celestial body's educational content needs to be displayed
document.addEventListener("celestialBodies", function(e) {
    const eventData = e.detail;

    if (getRoomsCelestialBodies(currentRoom).some(name => name.planet === eventData.event.planet)) {displayEducationalContent(eventData)}
    else {displayChallengeContent(eventData); console.log(eventData.event)}
});

// Global variables
let mainTrivia = true;
let bonusTrivia

let planetSet;
let currentPlanet;  // These should be dynamically set based on the current game state
let challengeType;  // These should be dynamically set based on the current game state
let currentQuestionIndex = 0;
let currentQuestion;
let displayQuestion;

// Store the icons paths in an object for later reference
const iconPaths = {
    correctIconSrc: '/assets/img/GUI/CorrectIcon.png',
    incorrectIconSrc: '/assets/img/GUI/IncorrectIcon.png',
    unansweredIconSrc: '/assets/img/GUI/UnansweredIcon.png',
};

const sortAlphabetSoup = (challenge) => {
    challenge.alphabetSoup.sort((a, b) => {
        let valueA, valueB;
        // Define the sorting values depending on the answerOrganization
        switch (challenge.answerOrganization) {
            case 'horizontal':
                valueA = a.colIndex;
                valueB = b.colIndex;
                break;
            case 'vertical':
                valueA = a.rowIndex;
                valueB = b.rowIndex;
                break;
            case 'diagonalTopBottomLeftRight':
            case 'diagonalTopBottomRightLeft':
            case 'diagonalBottomTopRightLeft':
            case 'diagonalBottomTopLeftRight':
                valueA = (challenge.answerOrganization.startsWith('diagonalBottomTop') ? 1000 - a.rowIndex : a.rowIndex) * 1000 +
                         (challenge.answerOrganization.endsWith('RightLeft') ? 1000 - a.colIndex : a.colIndex);
                valueB = (challenge.answerOrganization.startsWith('diagonalBottomTop') ? 1000 - b.rowIndex : b.rowIndex) * 1000 +
                         (challenge.answerOrganization.endsWith('RightLeft') ? 1000 - b.colIndex : b.colIndex);
                break;
            default:
                valueA = a.rowIndex;
                valueB = b.rowIndex;
        }
        // Define the sorting order depending on the isReversed attribute
        return challenge.isReversed ? valueB - valueA : valueA - valueB;
    });
};

const checkCorrectAnswer = (planet, challenge) => {
        // Call the sorting function
        
       console.log(planet);
       console.log(challenge);
        sortAlphabetSoup(challenge);

        // Check if the selected answer is correct by comparing the sorted letters with the correct answer
        let selectedAnswer = challenge.alphabetSoup.map(cell => cell.letter).join('');
        let answerWithoutSpaces = challenge.answer.replace(/\s/g, '').toUpperCase();
        console.log(`The selected answer is: ${selectedAnswer} and the correct answer is: ${answerWithoutSpaces}`);
        if (selectedAnswer === answerWithoutSpaces) {
            console.log('Correct answer!');
            challenge.isAnsweredCorrectly = true;
        } else {
            console.log('Incorrect answer.');
            challenge.isAnsweredCorrectly = false;

        }
        PlanetSet.updateLocalStorage(planet.planet, challenge);


        const index = planet.challenges['alphabet soup'].indexOf(challenge);
        const iconContainer = document.querySelector('.iconContainer');
            // Select the corresponding img
        const correspondingIcon = iconContainer.children[index];

        // Update the src attribute
        if (challenge.isAnsweredCorrectly) {
            correspondingIcon.src = iconPaths.correctIconSrc;
        } else {
            correspondingIcon.src = iconPaths.incorrectIconSrc;
        }

};

let selectedLettersDiv
function updateSelectedLettersDiv(challenge) {
    // First sort the alphabetSoup
    sortAlphabetSoup(challenge);

    selectedLettersDiv  = document.querySelector('.selected-letters-container');

    // Create a string with all the selected letters, separated by a space
    const selectedLetters = challenge.alphabetSoup.map(cell => cell.letter).join(' ');



    selectedLettersDiv.innerText = selectedLetters;
}

let mainDiv
function startBonusTriviaCountdown(difficulty, countdownDisplay, currentChallenge, planet, challenges, icons, currentIndex, resolve) {
    let timeLimit;

    if (Number(currentChallenge.timeLimit) === 0) {
        switch (difficulty) {
            case 'easy':
                timeLimit = 120;
                break;
            case 'medium':
                timeLimit = 60;
                break;
            case 'hard':
                timeLimit = 10;
                break;
            default:
                timeLimit = 300;
                break;
        }
    } else {
        timeLimit = Number(currentChallenge.timeLimit);
    }

    // Start the countdown interval
    const intervalId = setInterval(() => {
        timeLimit--;

           // Check if the countdown has finished
    // Check if the countdown has finished
    if (timeLimit <= 0) {
        // Handle the end of bonus trivia here
        clearInterval(intervalId);
        checkCorrectAnswer(planet, currentChallenge); 

        // Disable the icon and mark as incorrect
        const icon = icons[currentIndex];
        icon.classList.add('disabled');

        // Find the next challenge that hasn't been answered
        const nextUnansweredIndex = challenges.findIndex(challenge => challenge.isAnsweredCorrectly === null);

        if (nextUnansweredIndex !== -1) {
            const nextIcon = icons[nextUnansweredIndex];
            nextIcon.click();  // trigger a click event on the next icon
        } else if (challenges.every(challenge => challenge.isAnsweredCorrectly !== null)) {
            // If there is no next unanswered challenge, and all challenges have been answered
            setTimeout(() => {
            mainDiv.remove();  // remove the main div
            const coinsEarned = calculateCoins(challenges, 'hard');  // replace 'hard' with the actual difficulty
            alert(`You earned ${coinsEarned} coins!`);
            resolve();  // resolve the promise
            }, 1000);
        }
    }

        // Update the countdown display and the challenge object
        countdownDisplay.innerText = formatTime(timeLimit);
        currentChallenge.timeLimit = timeLimit;
    }, 1000);

    return intervalId;  // returning intervalId instead of timeLimit
}

function displayChallengeContent(eventData) {
    bonusTrivia = true;
    currentPlanet = eventData.event.planet;
    challengeType = 'alphabet soup';

    planetSet = getPlanetSet(eventData.event.planet);
    const resolve = eventData.onComplete

    mainDiv = document.createElement('div');
    mainDiv.classList.add('challenge-container');

    const iconContainer = document.createElement('div');
    iconContainer.classList.add('iconContainer');

    const countdownDisplay = document.createElement('div');
    countdownDisplay.classList.add('countdown-display-bonus-trivia');
    mainDiv.appendChild(countdownDisplay);

    const questionDiv = document.createElement('div');
    questionDiv.classList.add('challenge-question');
    const selectedLettersDiv = document.createElement('div');
    selectedLettersDiv.classList.add('selected-letters-container');
    mainDiv.appendChild(questionDiv);

    let grid;
    let countdownResult;
    const icons = [];  // Save the icons to use them later
    let challengesArray = [];

    for (let challengeType in planetSet.challenges) {
        const challenges = planetSet.challenges[challengeType];
        challengesArray = challengesArray.concat(challenges);
        challenges.forEach((challenge, index) => {
            const questionText = challenge.question;

            const icon = document.createElement('img');
            icon.style.width = (32/1.8) + 'px';
            icon.style.height = (32/1.8) + 'px';
            icon.src = challenge.isAnsweredCorrectly ? 
                iconPaths.correctIconSrc : 
                (challenge.isAnsweredCorrectly === false ? 
                    iconPaths.incorrectIconSrc : 
                    iconPaths.unansweredIconSrc);

            icons.push(icon);

            icon.addEventListener('click', () => {

                    // Clear the alphabetSoup array of the previous question
                if (currentQuestion) {
                    currentQuestion.alphabetSoup = [];
                }

                currentQuestion = challenge;
                currentQuestionIndex = index;
                console.log(currentQuestionIndex);
                // Prevent click if the icon is "disabled"
                if (icon.classList.contains('disabled')) {
                    return;
                }
                questionDiv.innerText = questionText;
                grid.remove();  // remove the previous grid
                selectedLettersDiv.innerText = '';
                grid = createAlphabetSoupGrid(11, 13, currentQuestion.answer, challenge);

                mainDiv.insertBefore(grid, iconContainer);

                    console.log(countdownResult)
    
                    clearInterval(countdownResult);
          
                

             
                countdownDisplay.innerText = '';
                countdownResult = startBonusTriviaCountdown('easy', countdownDisplay, currentQuestion, planetSet, challengesArray, icons, index, resolve);

            });

            iconContainer.appendChild(icon);

            if(index === 0) {
                questionDiv.innerText = questionText;
               // grid.style.display = "block";
               currentQuestion = challenge;
               currentQuestionIndex = index;

            }
            challenge.timeLimit = null;
        });
    }
 

    // Start the countdown for the first challenge outside the loop
    countdownResult = startBonusTriviaCountdown('easy', countdownDisplay, currentQuestion, planetSet, challengesArray, icons, 0, resolve);
    console.log(countdownResult);
 
    currentQuestion.timeLimit = 0;

 
    //grids.forEach(grid => mainDiv.appendChild(grid));
    grid = createAlphabetSoupGrid(11, 13, currentQuestion.answer, currentQuestion);
    mainDiv.appendChild(grid);
    mainDiv.appendChild(iconContainer);

    const submitButton = document.createElement('button');
    submitButton.innerText = "Submit";
    submitButton.addEventListener('click', () => {
        checkCorrectAnswer(planetSet, currentQuestion); 
        currentQuestion.alphabetSoup = [];
    
        // Clear the interval when the submit button is clicked
        if (currentQuestion && currentQuestion.intervalId) {
            clearInterval(currentQuestion.intervalId);
            currentQuestion.intervalId = null;
        }
    
        // Get the index of the current challenge
        const currentIndex = challengesArray.indexOf(currentQuestion);
    
        // Disable the icon and mark it as answered
        const icon = icons[currentIndex];
        icon.classList.add('disabled');
    
        // Find the next challenge that hasn't been answered
        const nextUnansweredIndex = challengesArray.findIndex(challenge => challenge.isAnsweredCorrectly === null);
    
        if (nextUnansweredIndex !== -1) {
            const nextIcon = icons[nextUnansweredIndex];
            nextIcon.click();  // trigger a click event on the next icon
            selectedLettersDiv.innerText = '';
        } else if (challengesArray.every(challenge => challenge.isAnsweredCorrectly !== null)) {
            // If there is no next unanswered challenge, and all challenges have been answered
            mainDiv.remove();  // remove the main div
            const coinsEarned = calculateCoins(challengesArray, 'easy');  // replace 'easy' with the actual difficulty
            alert(`You earned ${coinsEarned} coins!`);
            hud.querySelector('.coinCounterNumber').innerText = gameSession.coins;
            resolve(); // resolve the promise
            bonusTrivia = false;
            clearInterval(countdownResult);
        }
    });
    
    // Set the text of the div to the selected letters
    mainDiv.appendChild(selectedLettersDiv);
    mainDiv.appendChild(submitButton);
    roomContainer.appendChild(mainDiv);
}

function calculateCoins(challenges, difficulty) {
    const baseScore = {
        'easy': 1,
        'medium': 2,
        'hard': 3
    };

    let totalCoins = 0;

    challenges.forEach(challenge => {
        if(challenge.isAnsweredCorrectly) {
            // Increase the total number of coins according to the time remaining and difficulty
            totalCoins += baseScore[difficulty] * (challenge.timeLimit || 0);
        }
    });
    gameSession.coins += totalCoins; // increment the coins in the game session
     // Save the game state every time the progress changes
     updateGameSessionState(gameSession);
     User.updateGameSession(authenticatedUser.username, gameSession);
    return totalCoins;
}

let answerCells = [];
function createAlphabetSoupGrid(rows, cols, answer, currentChallenge) {
    
    // Create a multidimensional array (grid) and fill it with random letters
    let grid = Array.from({ length: rows }, () => 
        Array.from({ length: cols }, () => getRandomLetter())
    );

    const maxRows = 11;
    const maxCols = 17;
    
    // Filter the wordList and only include words that fit in the grid and aren't the answer
    let filteredWordList = wordList.filter(word => word.length <= rows && word.length <= cols && word !== answer);

    // Randomly select a few words from the filteredWordList and add them to an array
    let wordArray = filteredWordList.sort(() => 0.5 - Math.random()).slice(0, 2);

    // Add the answer to the end of the array
    wordArray.push(answer);


    let placementOption;
    let isReversed = false;

    // Go through the array and try to place each word in the grid
    wordArray.forEach(word => {
    // Convert the word to an array of uppercase letters and remove spaces
    let answerArray = word.toUpperCase().replace(/\s/g, '').split('');
    let answerLength = answerArray.length;
    let minGridDimension = answerLength;

    // Check if rows or cols exceed the maximum
    if (rows > maxRows || cols > maxCols) {
        alert(`At least one of the grid's dimensions should be ${maxRows}x${maxCols}. Please adjust the grid size.`);
        return;
    }
    // Check if rows and cols are less than the minimum required
    if (rows < minGridDimension && cols < minGridDimension) {
        alert(`At least one of the grid's dimensions should be ${minGridDimension}. Please adjust the grid size.`);
        return;
    }

    if (word === answer) {
        // Decide randomly if the answer will be inserted normally or reversed
        if (Math.random() < 0.5) {
            console.log('Reversed');
            answerArray = answerArray.reverse();
            isReversed = true;
        }
    }

    
    // Check if answer length is more than the grid dimensions
    if (answerLength > grid.length && answerLength > grid[0].length) {
        alert("Answer is longer than both grid dimensions. Please adjust the answer or grid size.");
        return;
    }
    


    if (answerLength > grid.length) { // can only be placed horizontally
        placementOption = "horizontal";
        console.log('Horizontal');
    } else if (answerLength > grid[0].length) { // can only be placed vertically
        console.log('Vertical');
        placementOption = "vertical";
    } else if (grid.length >= answerLength && grid[0].length >= answerLength) { // can be placed horizontally, vertically, or diagonally
        console.log('All options');
        let randomOption = Math.random();
        if (randomOption < 0.33) {
            placementOption = "horizontal";
        } else if (randomOption < 0.66) {
            placementOption = "vertical";
        } else {
            placementOption = "diagonal";
        }
    } else { // can be placed either horizontally or vertically
        console.log('Both');
        let randomOption = Math.random();
        if (randomOption < 0.5) {
            placementOption = "horizontal";
        } else {
            placementOption = "vertical";
        }
    }
    placementOption = "horizontal";
    if (placementOption === "horizontal") {
        console.log('Horizontal');
        let randomRowIndex = Math.floor(Math.random() * grid.length);
        let maxStartColumnIndex = grid[0].length - answerLength;
    
        // Check if maxStartColumnIndex is negative
        if (maxStartColumnIndex <= -1) {
            alert(`Cannot place answer ${answer} horizontally. Please adjust the answer or grid size.`);
            return;
        }
        let randomColumnIndex = Math.floor(Math.random() * (maxStartColumnIndex + 1));

        // Replace the grid cells with the answer letters
        for (let i = 0; i < answerLength; i++) {
            grid[randomRowIndex][randomColumnIndex + i] = answerArray[i];
        }

        // Check if the current word is the answer
        if (word === answer) {
            
            answerCells = [];
            // Add each cell to answerCells
            for (let i = 0; i < answerLength; i++) {
                answerCells.push([randomRowIndex, randomColumnIndex + i]);
            }
        }

    } else if (placementOption === "vertical") {
        console.log('Vertical');
        let randomColumnIndex = Math.floor(Math.random() * grid[0].length);
        let maxStartRowIndex = grid.length - answerLength;
    
        // Check if maxStartRowIndex is negative
        if (maxStartRowIndex <= -1) {
            alert(`Cannot place answer ${answer}, ${answerArray.join('')} vertically. Because it has a ${answerArray.length} Please adjust the answer or grid size.`);
            return;
        }
    
        let randomRowIndex = Math.floor(Math.random() * (maxStartRowIndex + 1));
    
        console.log('Grid dimensions:', grid.length, 'x', grid[0].length);
        console.log('Random row:', randomRowIndex, ', Random column:', randomColumnIndex);
        console.log('Answer length:', answerLength);
    
        for (let i = 0; i < answerLength; i++) {
            console.log('Setting grid[', randomRowIndex + i, '][', randomColumnIndex, '] to', answerArray[i]);
            grid[randomRowIndex + i][randomColumnIndex] = answerArray[i];
        }

        // Check if the current word is the answer
        if (word === answer) {
            // Add each cell to answerCells
            for (let i = 0; i < answerLength; i++) {
                answerCells.push([randomRowIndex + i, randomColumnIndex]);
            }
        }

    } else if (placementOption === "diagonal") {
        console.log('Diagonal');
        // Calculate the maximum possible start indices for the row and column
        let maxStartRowIndex = grid.length - answerLength; // Maximum start row index
        let maxStartColumnIndex = grid[0].length - answerLength; // Maximum start column index
    
        // Generate a random number from 0 to 3 to determine the diagonal direction
        let randomDirection = Math.floor(Math.random() * 4);
    
        switch(randomDirection) {
            case 0:  // Diagonal from top to bottom, left to right
                let randomStartRowIndex0 = Math.floor(Math.random() * (maxStartRowIndex + 1));
                let randomStartColumnIndex0 = Math.floor(Math.random() * (maxStartColumnIndex + 1));
                for (let i = 0; i < answerLength; i++) {
                    grid[randomStartRowIndex0 + i][randomStartColumnIndex0 + i] = answerArray[i];
                }

                // Check if the current word is the answer
                if (word === answer) {
                    // Add each cell to answerCells
                    for (let i = 0; i < answerLength; i++) {
                        answerCells.push([randomStartRowIndex0 + i, randomStartColumnIndex0 + i]);
                    }
                }

                placementOption = 'diagonalTopBottomLeftRight';
                break;
            case 1:  // Diagonal from bottom to top, right to left
                let randomStartRowIndex1 = Math.floor(Math.random() * (maxStartRowIndex + 1)) + answerLength - 1;
                let randomStartColumnIndex1 = Math.floor(Math.random() * (maxStartColumnIndex + 1)) + answerLength - 1;
                for (let i = 0; i < answerLength; i++) {
                    grid[randomStartRowIndex1 - i][randomStartColumnIndex1 - i] = answerArray[i];
                }

                // Check if the current word is the answer
                if (word === answer) {
                    // Add each cell to answerCells
                    for (let i = 0; i < answerLength; i++) {
                        answerCells.push([randomStartRowIndex1 - i][randomStartColumnIndex1 - i]);
                    }
                }

                placementOption = 'diagonalBottomTopRightLeft';
                break;
            case 2:  // Diagonal from top to bottom, right to left
                let randomStartRowIndex2 = Math.floor(Math.random() * (maxStartRowIndex + 1));
                let randomStartColumnIndex2 = Math.floor(Math.random() * (maxStartColumnIndex + 1)) + answerLength - 1;
                for (let i = 0; i < answerLength; i++) {
                    grid[randomStartRowIndex2 + i][randomStartColumnIndex2 - i] = answerArray[i];
                }

                // Check if the current word is the answer
                if (word === answer) {
                    // Add each cell to answerCells
                    for (let i = 0; i < answerLength; i++) {
                        answerCells.push([randomStartRowIndex2 + i][randomStartColumnIndex2 - i]);
                    }
                }

                                
                placementOption = 'diagonalTopBottomRightLeft';
                break;
            case 3:  // Diagonal from bottom to top, left to right
                let randomStartRowIndex3 = Math.floor(Math.random() * (maxStartRowIndex + 1)) + answerLength - 1;
                let randomStartColumnIndex3 = Math.floor(Math.random() * (maxStartColumnIndex + 1));
                for (let i = 0; i < answerLength; i++) {
                    grid[randomStartRowIndex3 - i][randomStartColumnIndex3 + i] = answerArray[i];
                }

                // Check if the current word is the answer
                if (word === answer) {
                    // Add each cell to answerCells
                    for (let i = 0; i < answerLength; i++) {
                        answerCells.push([randomStartRowIndex2 + i][randomStartColumnIndex2 - i]);
                    }
                }
                
                placementOption = 'diagonalBottomTopLeftRight';
                break;
            default:
                break;
        }
    }
});
    // Create a table and fill it with the data from the grid
    const table = document.createElement('table');
    table.classList.add('alphabet-soup-grid');

    grid.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        
        row.forEach((letter, colIndex) => {
            const td = document.createElement('td');
            td.innerText = letter;
            td.addEventListener('click', function() {
                if (td.classList.contains('selected')) {
                    // Cell is already selected, so we'll deselect it
                    td.classList.remove('selected');
                
                    // Find the index of the corresponding item in alphabetSoup
                    const index = currentChallenge.alphabetSoup.findIndex(item => item.letter === letter && item.rowIndex === rowIndex && item.colIndex === colIndex);
                
                    if (index > -1) {
                        // Remove the item from alphabetSoup
                        currentChallenge.alphabetSoup.splice(index, 1);
                    }
                } else {
                    // Cell is not selected, so we'll select it
                    td.classList.add('selected');
                
                    if (isReversed) {
                        currentChallenge.isReversed = true;
                    }
                    console.log(currentChallenge);
                    currentChallenge.answerOrganization = placementOption;
                    currentChallenge.alphabetSoup.push({letter: letter, rowIndex: rowIndex, colIndex: colIndex});
                }
                // Update the selected letters div every time a td is clicked
                updateSelectedLettersDiv(currentChallenge);
            });
            tr.appendChild(td);
        });
        
        table.appendChild(tr);
    });
    

    return table;
}

function getRandomLetter() {

    // Generates a random uppercase letter
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

const wordList = [
    "MERCURY",
    "VENUS",
    "EARTH",
    "MARS",
    "JUPITER",
    "SATURN",
    "URANUS",
    "NEPTUNE",
    "PLUTO",
    "SUN",
    "MOON",
    "SOLAR",
    "GALAXY",
    "ORBIT",
    "COMET",
    "ASTEROID",
    "METEOR",
    "TELESCOPE",
    "ROCKET",
    "SPACESHIP",
    "PLANET",
    "STAR",
    "SATELLITE",
    "ALIEN",
    "EXPLORATION",
    "CRATER",
    "ECLIPSE",
    "GRAVITY",
    "SPACEWALK",
    "MISSION",
  ];
  
  const getTokenQuantitiesFromStorage = () => {
    const storedQuantities = gameSession.tokenQuantities;
    return storedQuantities ? storedQuantities : { 'Hints': 0, 'Time manipulation': 0, 'Power-ups': 0 };
};

const saveTokenQuantitiesToStorage = (tokenQuantities) => {
    gameSession.tokenQuantities;
            // Update celestial bodies in the local storage
            updateCelestialBodiesInLocalStorage(gameSession);
        
            // Update the game session in local storage
            User.updateGameSession(authenticatedUser.username, gameSession);
};


const updateTokenQuantitiesOnPage = () => {
    const storedQuantities = getTokenQuantitiesFromStorage();

    // Token names and corresponding element class names
    const tokenElements = {
        'Hints': 'helps-quantity',
        'Time manipulation': 'reduce-time-quantity',
        'Power-ups': 'power-ups-quantity'
    };

    // Update quantities on page
    let totalTokens = 0; // keep track of total tokens
    for (let tokenName in tokenElements) {
        const quantity = storedQuantities[tokenName];
        totalTokens += quantity; // increment total tokens
        const elementClassName = tokenElements[tokenName];

        const element = document.querySelector(`.${elementClassName}`);
        if (quantity) {
            element.innerText = quantity;
        } else {
            element.innerText = '';
        }
    }
    
    // Update total tokens in "assist-tokens-quantity"
    const totalElement = document.querySelector('.assist-tokens-quantity');
    if (totalTokens > 0) {
    totalElement.innerText = totalTokens;
    } else {
        totalElement.innerText = '';
    }
};


// Call this function when page loads
document.addEventListener('DOMContentLoaded', updateTokenQuantitiesOnPage);

  document.addEventListener('shopKeeper', (eventData) => {

    const resolve = eventData.detail.onComplete
 
    const shopContainer = document.createElement('div');
    shopContainer.classList.add('shop-container');

    const closeIcon = document.createElement('img');
    closeIcon.src = '/assets/img/GUI/UI_Glass_Cross_Medium_01a.png';
    closeIcon.classList.add('close-icon');

    closeIcon.addEventListener('click', () => {
        shopContainer.remove();
        resolve();
    });

    shopContainer.appendChild(closeIcon);

    const shopTitle = document.createElement('h2');
    shopTitle.innerText = "Intergalactic Shop";
    shopContainer.appendChild(shopTitle);

    const shopKeeper = document.createElement('div');
    shopKeeper.classList.add('shop-keeper');
    shopContainer.appendChild(shopKeeper);

    let total = 0;
    const tokens = [
        {name: 'Hints', description: 'Provides guidance for challenges', price: 5, iconName: 'helps'},
        {name: 'Time manipulation', description: 'Slows down time', price: 10, iconName: 'reduce-time'},
        {name: 'Power-ups', description: 'Boosts your gameplay', price: 15, iconName: 'power-ups'}
    ];

    let tokenQuantities = getTokenQuantitiesFromStorage();

    // Create a div to hold the tokens
    const tokenContainerDiv = document.createElement('div');
    shopKeeper.appendChild(tokenContainerDiv);

    // Create a div to hold a 'receipt'
    const receiptContainer = document.createElement('div');
    receiptContainer.classList.add('receipt-container');
    receiptContainer.innerHTML = `<h3>Receipt</h3>`;
    shopKeeper.appendChild(receiptContainer);

    // Create a div for the total
    const totalDiv = document.createElement('div');
    totalDiv.id = 'receipt-total';
    totalDiv.classList.add('receipt-total');
    receiptContainer.appendChild(totalDiv);

    const receiptElements = {};

    const updateTotal = () => {
        totalDiv.innerText = `Total: ${total} coins`;
    }

    const resetReceiptAndQuantities = () => {
        for(let tokenName in receiptElements) {
            receiptElements[tokenName].innerHTML = '';
           
        }
        total = 0;
        updateTotal();
        const quantityContainers = tokenContainerDiv.querySelectorAll('.quantity-container');
        quantityContainers.forEach(quantityContainer => {
            quantityContainer.innerText = '0';
        });
        totalDiv.innerText = '';
    }

    tokens.forEach(token => {
        const tokenContainer = document.createElement('div');
        tokenContainer.classList.add('token-container');

        const tokenName = document.createElement('p');
        tokenName.innerText = token.name;
        tokenContainer.appendChild(tokenName);

        const tokenDescription = document.createElement('p');
        tokenDescription.innerText = token.description;
        tokenContainer.appendChild(tokenDescription);

        const tokenPrice = document.createElement('p');
        tokenPrice.innerText = `Price: ${token.price} coins`;
        tokenContainer.appendChild(tokenPrice);

        // Create a div to hold the quantity
        const quantityContainer = document.createElement('div');
        quantityContainer.classList.add('quantity-container');
        quantityContainer.innerText = '0';
        tokenContainer.appendChild(quantityContainer);

        const tokenReceipt = document.createElement('div');
        tokenReceipt.id = `token-receipt-${token.name}`;
        tokenReceipt.classList.add('token-receipt');
        receiptContainer.insertBefore(tokenReceipt, totalDiv);

        // Store the reference to this element
        receiptElements[token.name] = tokenReceipt;

        const buyButton = document.createElement('button');
        buyButton.innerText = '+';
        buyButton.addEventListener('click', () => {
            // Check if the user has enough coins
            if (total + Number(token.price) > gameSession.coins) {
                alert('You do not have enough coins to buy more.');
                buyButton.disabled = true;
            } else {
                quantityContainer.innerText = parseInt(quantityContainer.innerText) + 1;
                total += Number(token.price);
        
                // Increase the quantity of this token
                tokenQuantities[token.name]++;
        
                // Update the corresponding receipt element
                receiptElements[token.name].innerHTML = `${token.name}: ${Number(quantityContainer.innerText) * Number(token.price)} coins`;
        
                // Update total
                updateTotal();
            }
        });
        
        tokenContainer.insertBefore(buyButton, quantityContainer);

        const sellButton = document.createElement('button');
        sellButton.innerText = '-';
        sellButton.addEventListener('click', () => {
            if (parseInt(quantityContainer.innerText) == 0) {
                return;
            }
            quantityContainer.innerText = parseInt(quantityContainer.innerText) - 1;
            total -= Number(token.price);

            // Decrease the quantity of this token
            tokenQuantities[token.name]--;
  

            // Update the corresponding receipt element
            if (Number(quantityContainer.innerText) * Number(token.price) == 0) {
                receiptElements[token.name].innerHTML = '';
                updateTotal();
                totalDiv.innerText = '';
                return;
            };
            receiptElements[token.name].innerHTML = `${token.name}: ${Number(quantityContainer.innerText) * Number(token.price)} coins`;

            // Update total
            updateTotal();
        });
        tokenContainer.appendChild(sellButton);

        tokenContainerDiv.appendChild(tokenContainer);
    });

    const buyAllButton = document.createElement('button');
    buyAllButton.innerText = 'Buy';
    buyAllButton.addEventListener('click', () => {
        // Calculate total price and check if user has enough coins
        if (total == 0 ) {
            alert ('You dont have anything to buy.');
        
        } else if (total <= gameSession.coins) {

            updateGameSessionState(gameSession);
            User.updateGameSession(authenticatedUser.username, gameSession);
            alert(`You bought all tokens. You now have ${gameSession.coins} coins left.`);
            
            // Get current quantities from storage
            let currentQuantities = getTokenQuantitiesFromStorage();
            // Add bought quantities to current quantities
            for (let tokenName in tokenQuantities) {
                currentQuantities[tokenName] += tokenQuantities[tokenName];
            }
            // Save updated quantities to storage
            saveTokenQuantitiesToStorage(currentQuantities);
            // Update quantities displayed on the page
            updateTokenQuantitiesOnPage();
            gameSession.coins = gameSession.coins - total;
            updateGameSessionState(gameSession);
            User.updateGameSession(authenticatedUser.username, gameSession);
            // Reset total and update it
            resetReceiptAndQuantities();
            hud.querySelector('.coinCounterNumber').innerText = gameSession.coins;
            shopContainer.remove();
            resolve();
    
        }
    });
    
    receiptContainer.appendChild(buyAllButton);

    roomContainer.appendChild(shopContainer);
});

let isTokenActive = false;

// Reduce time button click event
document.querySelector('#reduce-time').addEventListener('click', function() {
    if (isTokenActive) {
        alert('You can only use one Time Manipulation token at a time!');
        return;
    }

    let reduceTimeQuantity = parseInt(document.querySelector('.reduce-time-quantity').innerText, 10);
    if (isNaN(reduceTimeQuantity) || reduceTimeQuantity === 0) {
        alert('No Time Manipulation tokens left!');
        return;
    }

    let tokenQuantities = getTokenQuantitiesFromStorage();
    if (tokenQuantities['Time manipulation'] > 0) {
        // Decrease token quantity
        tokenQuantities['Time manipulation']--;
        // Save the new quantities to storage
        saveTokenQuantitiesToStorage(tokenQuantities);
        // Update quantities displayed on the page
        updateTokenQuantitiesOnPage();
    } else {
        alert('No Time Manipulation tokens left!');
        return;
    }
    
    // Update the countdown's interval
    startCountdown(5000); // slow down the countdown
    isTokenActive = true; // Token is active
    setTimeout(() => {
        startCountdown();
        isTokenActive = false; // Token is no longer active
    }, 10000); // after 10s, return the countdown to its normal pace
});



// Add a flag for tracking if a hint is currently being displayed
let isHintInProgress = false;



document.querySelector('#helps').addEventListener('click', async function() {
    if (isHintInProgress) {
        alert('Wait for the current hint to finish!');
        return;
    }

    if (!mainTrivia) {
        alert('You can only use the hints in the main trivia!');
        return;
    }
    let helpQuantity = parseInt(document.querySelector('.helps-quantity').innerText, 10);
    if (isNaN(helpQuantity) || helpQuantity === 0) {
        alert('No help tokens left!');
        return;
    }

    // Load the planet data from local storage
    planetSet = getPlanetSet(currentPlanet);


    currentQuestion = planetSet.challenges[challengeType][currentQuestionIndex];
    console.log(currentPlanet);
    console.log(planetSet);
    console.log(challengeType);
    console.log(currentQuestionIndex);
    console.log(currentQuestion);
    if (!currentPlanet) {
        alert('No data found for the current planet!');
        return;
    }

    if (!currentQuestion) {
        alert('No challenge data found for the current planet!');
        return;
    }

    if (currentQuestion.isTokenUsed) {
        alert('Token already used for this challenge!');
        return;
    }

    // Get a random hint from the current challenge
    let hintsArray = currentQuestion.hints;  // Combine all hints arrays into one
    let hintIndex = Math.floor(Math.random() * hintsArray.length);
    let hintMessage = hintsArray[hintIndex];

    // Create a new OverworldEvent with the helpMessage
    let helpEvent = { type: 'textMessage', text: hintMessage };
    const newOverworldEvent = new OverworldEvent({ map: cosmicQuest.map, event: helpEvent });

    gameController.addGameEvent(newOverworldEvent);
    isHintInProgress = true;  // Set the flag to true when the hint starts
    await newOverworldEvent.init();

    isHintInProgress = false; // Set the flag back to false when the hint ends

    // Set the flag back to false when the hint ends
    isHintInProgress = false;

    let tokenQuantities = getTokenQuantitiesFromStorage();
    if (tokenQuantities['Hints'] > 0) {
        // Decrease token quantity
        tokenQuantities['Hints']--;
        // Save the new quantities to storage
        saveTokenQuantitiesToStorage(tokenQuantities);
        // Update quantities displayed on the page
        updateTokenQuantitiesOnPage();

        currentQuestion.isTokenUsed = true;

        localStorage.setItem(currentPlanet, JSON.stringify(planetSet));
    } else {
        alert('No Time Manipulation tokens left!');
        return;
    }

});


document.getElementById('power-ups').addEventListener('click', function() {
    if (!mainTrivia && !bonusTrivia) {
        alert ('You can only use powerups on the trivias!');
        return;
    } 

    if (isHintInProgress) {
        alert('Wait for the current hint to finish!');
        return;
    }

    let powerUpsQuantity = parseInt(document.querySelector('.power-ups-quantity').innerText);
    if (isNaN(powerUpsQuantity) || powerUpsQuantity === 0) {
        alert('No power-ups left!');
        return;
    }
 
    planetSet = getPlanetSet(currentPlanet);
   
    currentQuestion = planetSet.challenges[challengeType][currentQuestionIndex];

    console.log(currentPlanet);
    console.log(planetSet);
    console.log(challengeType);
    console.log(currentQuestionIndex);
    console.log(currentQuestion);
    
    if (currentQuestion.isTokenUsed) {
        alert('Token already used for this challenge!');
        return;
    }
    
    let tokenQuantities = getTokenQuantitiesFromStorage();
    if (tokenQuantities['Power-ups'] > 0) {
        // Decrease token quantity
        tokenQuantities['Power-ups']--;
        // Save the new quantities to storage
        saveTokenQuantitiesToStorage(tokenQuantities);
        // Update quantities displayed on the page
        updateTokenQuantitiesOnPage();
    
        // Set token used flag to true
        currentQuestion.isTokenUsed = true;
        localStorage.setItem(currentPlanet, JSON.stringify(planetSet));
    } else {
        alert('No Power-ups left!');
        return;
    }
    


    // Create a new OverworldEvent with the helpMessage
    let powerUpEvent = { type: 'powerUp', currentPlanet, challengeType, currentQuestion };
    
    const newOverworldEvent = new OverworldEvent({ map: cosmicQuest.map, event: powerUpEvent });
    gameController.addGameEvent(newOverworldEvent);
    isHintInProgress = true;  // Set the flag to true when the hint starts
    newOverworldEvent.init();
});


document.addEventListener('powerUp', function(eventData) {
    currentQuestion = eventData.detail.event.currentQuestion;
    currentPlanet = eventData.detail.event.currentPlanet;
    challengeType = eventData.detail.event.challengeType;
    const onComplete = eventData.detail.onComplete; // get the onComplete function
    

    if (challengeType === 'multiple choice') {
        handleMultipleChoicePowerUp(currentPlanet, onComplete);
    } else if (challengeType === 'short answer') {
        handleShortAnswerPowerUp(currentQuestion,currentPlanet);
    } else if (challengeType === 'fill in the blanks') {
        handleFillInTheBlanksPowerUp(currentQuestion,currentPlanet,onComplete);
    } else if (challengeType === 'alphabet soup') {
        handleAlphabetSoupPowerUp(currentQuestion, currentPlanet);
    };


    isHintInProgress = false; // Set the flag back to false after the event handling is done
});

function handleMultipleChoicePowerUp(currentPlanet, onComplete) {

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * currentQuestion.choices.length);
    } while (currentQuestion.choices[randomIndex] === currentQuestion.answer)
    // Remove the randomly chosen incorrect option from the challenge
    currentQuestion.choices.splice(randomIndex, 1);
            // Set token used flag to true
            currentQuestion.isTokenUsed = true;
    // Update the challenge in the localStorage
    localStorage.setItem(currentPlanet, JSON.stringify(planetSet));
   
    // Re-display the current question with updated choices
    displayQuestion(currentQuestionIndex, currentQuestion);

    // resolve the promise
    onComplete();
} 

// Handle short answer power-up
function handleShortAnswerPowerUp(currentQuestion, currentPlanet) {
    let wordCount = currentQuestion.answer.split(' ').length;
    alert(`The answer contains ${wordCount} word(s).`);
    currentQuestion.isTokenUsed = true;
 
    // Update the challenge in the localStorage
    localStorage.setItem(currentPlanet, JSON.stringify(planetSet));
}

// Handle fill in the blanks power-up
function handleFillInTheBlanksPowerUp(currentQuestion, currentPlanet, onComplete) {

    console.log(currentQuestion);

    // Use the custom function to split the question and answer
    let questionArray = splitString(currentQuestion.question);
    let answerArray = splitString(currentQuestion.answer);

    let correctChoicePosition;

    for (let i = 0; i < answerArray.length; i++) {
        if (questionArray[i] !== answerArray[i]) {
            correctChoicePosition = i;
            break;
        }
    }

    // Adjust for 0-based indexing
    correctChoicePosition += 1;

    // Get the corresponding span elements
    let beforeSpan = document.querySelector(`.question span:nth-child(${correctChoicePosition-1})`);
    let afterSpan = document.querySelector(`.question span:nth-child(${correctChoicePosition})`);

    // Add padding to hint the correct position
    beforeSpan.style.paddingRight = "10px";
    afterSpan.style.paddingLeft = "10px";

    // Remove the hint after 5 seconds
    setTimeout(() => {
        beforeSpan.style.paddingRight = "0";
        afterSpan.style.paddingLeft = "0";
    }, 5000);

            // Set token used flag to true
            currentQuestion.isTokenUsed = true;
            
    // Update the challenge in the localStorage
    localStorage.setItem(currentPlanet, JSON.stringify(planetSet));

    // Resolve the promise
    onComplete();
}


function splitString(str) {
    // This regex splits by space but keeps together words that contain apostrophes and decimal numbers
    let arr = str.match(/[\w.'’]+|[.,;!?]/g);
    // Then we split 'degrees.' into 'degrees' and '.' by filtering through the array
    arr = arr.reduce((acc, el) => {
        if (!el.includes('.5') && el.endsWith('.')) {
            let splitEl = el.slice(0, el.length - 1);
            acc.push(splitEl);
            acc.push('.');
        } else {
            acc.push(el);
        }
        return acc;
    }, []);
    return arr;
}



// Add this function in your script
function handleAlphabetSoupPowerUp(currentQuestion) {


// Randomly select 2 or 3 cells from the answer
let cellsToClick = answerCells.sort(() => 0.5 - Math.random()).slice(0, 2);


// Trigger a click event on these cells
cellsToClick.forEach(cell => {
    let td = document.querySelector(`tr:nth-child(${cell[0] + 1}) td:nth-child(${cell[1] + 1})`);
    td.click();
});

            // Set token used flag to true
            currentQuestion.isTokenUsed = true;

// Update the challenge in the localStorage
localStorage.setItem(currentPlanet, JSON.stringify(planetSet));
}




//Get the current planet set from local storage
const getPlanetSet = eventPlanet => JSON.parse(localStorage.getItem(eventPlanet));

let selectedButton = 'Mercury';

function displayEducationalContent(eventData) {
    const eventPlanet = eventData.event.planet;
    selectedButton = eventData.event.planet;
    const planetSet = getPlanetSet(eventPlanet); 

    const educationalContent = planetSet.educationalContent;
    const onComplete = eventData.onComplete;

    const contentContainer = createNoteArea();
    contentContainer.classList.remove('NoVideo');

    const notes = contentContainer.querySelector('.Notes');
    notes.value = planetSet.notes;  // Set the notes to be displayed

    const buttonContainer = contentContainer.querySelector('.buttonContainer');
    contentContainer.removeChild(buttonContainer);

    const closeButton = contentContainer.querySelector('.CloseButton');

    // Create the video container and append the video to it
    const videoContainer = document.createElement('div');
    videoContainer.classList.add('VideoContainer');

    // Create a title div and add it to the video container
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('VideoTitle');
    titleDiv.innerText = eventPlanet;  // Set the title to be the planet's name
    videoContainer.appendChild(titleDiv);

    const videoElement = document.createElement('video');
    videoElement.autoplay = true; // Enables autoplay
    videoElement.controls = true; // Shows controls
    videoElement.loop = true; // Loops the video
    //videoElement.muted = true; // Mutes the video
    //videoElement.poster = '/path/to/poster.jpg'; // Sets the poster image
    videoElement.preload = 'auto'; // Preloads the video
    videoElement.src = educationalContent.video; // Sets the video source
    videoElement.width = 280; // Sets the width
    videoElement.height = 140; // Sets the height

    // Create the track element for subtitles and append it to the video
    const trackElement = document.createElement('track');
    trackElement.kind = 'subtitles';
    trackElement.src = educationalContent.subtitles;  // assuming subtitles is the URL to the .vtt file
    trackElement.srclang = 'en';
    trackElement.label = 'English';
    trackElement.default = true; // This line is necessary to make the subtitles appear by default
    videoElement.appendChild(trackElement);

    videoContainer.appendChild(videoElement);
    contentContainer.insertBefore(videoContainer, notes);
    roomContainer.appendChild(contentContainer);

    // This function stores the current video time
    const storeVideoTime = () => { localStorage.setItem(`currentTime for ${eventPlanet} video`, videoElement.currentTime); };
    
    // Event listener for 'pause' event
    videoElement.addEventListener('pause', storeVideoTime);

    // Event listener for 'play' event
    videoElement.addEventListener('play', () => {
        // Retrieve the stored time from localStorage and set it as the current time
        // If no time is stored, it defaults to 0 (beginning of video)
        let storedTime = localStorage.getItem(`currentTime for ${eventPlanet} video`);
        videoElement.currentTime = storedTime ? parseFloat(storedTime) : 0;
    });

    // When the video ends, remove its container
    videoElement.addEventListener('ended', () => {
        // Remove the stored time from localStorage when the video ends
        localStorage.removeItem(`currentTime for ${eventPlanet} video`);
        videoContainer.remove();
        contentContainer.appendChild(buttonContainer);
        contentContainer.classList.add('NoVideo');
        onComplete();
    });

    // Event listener for window unload event
    window.addEventListener('beforeunload', () => { console.log('Event fired'); storeVideoTime(); });

    // Event listener for document visibility change event
    document.addEventListener('visibilitychange', function() {
        console.log('fired');
        let educationContainer = document.querySelector('.EducationalContent');

        // If the document becomes hidden (user switches tabs, minimizes browser, etc.), store the video time
        if (document.visibilityState === 'hidden') {
            // pause the video
            videoElement.pause();
            storeVideoTime();
        } else if (document.visibilityState === 'visible' && educationContainer && !educationContainer.classList.contains('NoVideo')) {
            // resume the video
            console.log('resuming video');
            videoElement.play();
        }
    });


    notes.addEventListener('change', function() {
        // Get the updated note from the text area
        const updatedNote = notes.value;

        // Update the note in the PlanetSet
        planetSet.notes = updatedNote;
        console.log(`The planet's ${planetSet.planet}'s notes have been updated to ${planetSet.notes}`);
        // Update the PlanetSet in local storage
        localStorage.setItem(eventPlanet, JSON.stringify(planetSet));
    });

    closeButton.addEventListener('click', function() {
        // pause the video
        videoElement.pause();
        storeVideoTime();
        
        contentContainer.remove();
        onComplete();
    });
}

function getRoomsCelestialBodies(currentRoom = null, bonusTrivia = null) {
    // Get celestial bodies from all rooms
    const celestialBodies = [];

    // Determine which celestial bodies to get based on the parameters
    switch (currentRoom) {
        case null:
            // If no room is specified, get celestial bodies from all rooms
            celestialBodies.push(...window.EscapeRooms.RoomOne.celestialBodies);
            celestialBodies.push(...window.EscapeRooms.RoomTwo.celestialBodies);
            break;
        default:
            // If a room is specified, get celestial bodies from that room
            celestialBodies.push(...window.EscapeRooms[currentRoom].celestialBodies);
            
            if (bonusTrivia !== null) {
                // If bonusTrivia is specified, get bonus celestial bodies from that room
                celestialBodies.push(...window.EscapeRooms[currentRoom].bonusCelestialBodies);
            }
    }

    return celestialBodies;
}


function createButtons(currentRoom = null) {
    const celestialBodies = getRoomsCelestialBodies(currentRoom)

    // Buttons that hold the questions for each planet
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('buttonContainer');
    buttonContainer.style.display = 'flex';
    // Create a button for each celestial body
    celestialBodies.forEach(celestialBody => {
        const button = document.createElement('button');
        button.innerText = celestialBody.planet;
        button.dataset.planet = celestialBody.planet;  // Store the planet name in the button for later reference
        buttonContainer.appendChild(button);
    });
    return buttonContainer;
}

function createNoteArea() {
    console.log(getPlanetSet(selectedButton).planet);
    // Adding the event listeners to the buttons
    const buttonContainer = createButtons();  // createButtons() should return the div containing the buttons
    const buttons = buttonContainer.querySelectorAll('button');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            selectedButton = this.dataset.planet;
            textArea.value = getPlanetSet(selectedButton).notes;  // Use the stored note, or an empty string
        });
    });

    // Create the close button
    const closeButton = document.createElement('img');
    closeButton.src = '/assets/img/GUI/UI_Glass_Cross_Medium_01a.png';  // Add your actual path to the close button image
    closeButton.classList.add('CloseButton');


    // Create the main container for the educational content
    const contentContainer = document.createElement('div');
    contentContainer.classList.add('EducationalContent', 'NoVideo');  // add 'NoVideo' class initially

    // Create the text area for notes
    const textArea = document.createElement('textarea');
    textArea.classList.add('Notes');
    textArea.value = getPlanetSet(selectedButton).notes //planetSet.notes || '';  // Use the stored note, or an empty string if no note is stored

    // Append everything to the main container
    contentContainer.appendChild(closeButton);
    contentContainer.appendChild(textArea);
    contentContainer.appendChild(buttonContainer);
    roomContainer.appendChild(contentContainer);

    textArea.addEventListener('change', function() {
        // Get the updated note from the text area
        const updatedNote = textArea.value;
    
        // Get the current planet set from local storage
        let planetSet = getPlanetSet(selectedButton);
    
        // Update the note in the PlanetSet
        planetSet.notes = updatedNote;
    
        // Update the PlanetSet in local storage
        localStorage.setItem(selectedButton, JSON.stringify(planetSet));
    });
    closeButton.addEventListener('click', function() {
        contentContainer.remove();
    });
    return contentContainer;
}

// The 'confirmation' event fires when a new confirmation needs to be displayed in the UI
document.addEventListener("confirmation", function(e) {
    const event = e.detail;
    console.log(e.detail);
    createConfirmationBox(event);
});

// The createConfirmationBox function creates a confirmation box with "Yes" and "No" options
// based on the event and callback function 'onComplete' passed to it.
// It creates a new div with class 'confirmationBox' and inserts it into the document.
// When a choice is made (either "Yes" or "No"), it triggers an OverworldEvent and calls 'onComplete'.
function createConfirmationBox({ event, onComplete }) {
    const confirmationBox = document.createElement('div');
    confirmationBox.classList.add('confirmationBox');
    confirmationBox.innerHTML = `
        <p>${event.text}</p>
        <button class="confirmButton">Yes</button>
        <button class="cancelButton">No</button>
    `;
    document.querySelector(".room-container").appendChild(confirmationBox);

    confirmationBox.querySelector('.confirmButton').addEventListener('click', async () => {
        confirmationBox.remove();
        const newOverworldEvent = new OverworldEvent({ map: cosmicQuest.map, event: event.onConfirm });
        gameController.addGameEvent(newOverworldEvent);
        await newOverworldEvent.init();
        // Also resolve the 'run' event from CUBI's behavior loop
        if (CUBI.currentEventResolve) {
            CUBI.currentEventResolve();
            CUBI.currentEventResolve = null;
        }
        onComplete();
    });
    

    confirmationBox.querySelector('.cancelButton').addEventListener('click', async () => {
        confirmationBox.remove();
        const newOverworldEvent = new OverworldEvent({ map: cosmicQuest.map, event: event.onCancel });
        gameController.addGameEvent(newOverworldEvent);
        await newOverworldEvent.init();
        onComplete();
    });
}


// The 'mainTrivia' event fires when a new trivia needs to be displayed in the UI
document.addEventListener("mainTrivia", function(e) {
    const eventData = e.detail;
    const onComplete = eventData.onComplete;

    const currentRoomChallenge = window.EscapeRooms[currentRoom][eventData.event.type];

    createTriviaElements(currentRoomChallenge, onComplete);
});

//Function to give the educational content
const giveEducationalContent = (currentPlanet) => {
    //Check if all the challenges have been correctly answered
    const planetSet = getPlanetSet(currentPlanet);
    let allChallengesCorrect = true;
    Object.values(planetSet.challenges).forEach(challengeArray => {
        challengeArray.forEach(challenge => {
            if (challenge.isAnsweredCorrectly !== true) {
                allChallengesCorrect = false;
            }
        });
    });
    if (allChallengesCorrect) {
        alert('All challenges were answered correctly');
        //If all challenges were answered correctly, populate the planet's Research Terminal
        for (let category in planetSet.researchTerminal) {
            //fetch(`path/to/${planetSet.planet}/${category}.txt`)
            fetch(`/assets/txt/${planetSet.planet}/${category}.txt`)
            //fetch(`/assets/txt/Mercury/Mercury.txt`) //Fetch (request) the resource for each txt fvile for the Research Terminal
            .then(response => response.text()) //Turn the response (returned value from the fetch) into a string
            .then(data => { //then do this with the data obtained
                planetSet.researchTerminal[category] = data;
                console.dir(planetSet)
                // Save to localStorage
                localStorage.setItem(planetSet.planet, JSON.stringify(planetSet));
                // Get the research terminal from local storage
                // let researchTerminal = JSON.parse(localStorage.getItem('researchTerminal'));
            });
        }
    }
      
    //If not all challenges were answered correctly, return null or undefined
    return
};

function createTriviaElements(eventData, onComplete) {
    mainTrivia = true;

    

    //Create the container that will hold the trivia
    const triviaContainer = document.createElement('div');
    triviaContainer.classList.add('triviaContainer');

    
    const closeIcon = document.createElement('img');
    closeIcon.src = '/assets/img/GUI/UI_Glass_Cross_Medium_01a.png';
    closeIcon.classList.add('close-icon');

    closeIcon.addEventListener('click', () => {
        triviaContainer.remove();
        if (CUBI.currentEventResolve) {
            CUBI.currentEventResolve();
            CUBI.currentEventResolve = null;
        }
        onComplete();
    });
    

    // Container that will hold the questions + buttons for the questions types
    const quizzContainer = document.createElement('div');
    quizzContainer.classList.add('quizzContainer');

    const buttonContainer = createButtons(currentRoom); 

    // Get all buttons within the container
    const buttons = buttonContainer.querySelectorAll('button');

    // Iterate through each button and add the event listener
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            planetSet = eventData.find(set => set.planet === this.dataset.planet);
           
            console.log(planetSet);
            currentQuestionIndex = 0;
       
            displayQuestions(planetSet);  // pass quizzContainer as argument
            
        });
    });

    
    // Create the iconContainer and add it to the questionContainer
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('iconContainer');

    // Store the icons paths in an object for later reference
    const iconPaths = {
        correctIconSrc: '/assets/img/GUI/CorrectIcon.png',
        incorrectIconSrc: '/assets/img/GUI/IncorrectIcon.png',
        unansweredIconSrc: '/assets/img/GUI/UnansweredIcon.png',
    };

    // Create a container for the questions
    const questionContainer = document.createElement('div');
    questionContainer.classList.add('questionContainer');

    // Create a container for the question type buttons
    const quizzTypeButtonsContainer = document.createElement('div');
    quizzTypeButtonsContainer.classList.add('quizzTypeButtonsContainer');
    // Create the submit button
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Submit';
    let submitButtonEventListener = () => {
        if (currentQuestion.type === 'multiple choice') {
            checkAnswer(currentQuestion, currentAnswerField.value, currentQuestionIndex);
        } else if (currentQuestion.type === 'short answer') {
            checkAnswer(currentQuestion, currentAnswerField.value, currentQuestionIndex);
        } else if (currentQuestion.type === 'fill in the blanks') {
            const answer = Array.from(questionContainer.children)
            .map(child => child.innerText)
            .join('');
            checkAnswer(currentQuestion, answer, currentQuestionIndex);
        }
    };
    submitButton.addEventListener('click', submitButtonEventListener);
    
    //Add the triviaContainer to the roomContainer and the buttonContainer to the triviaContainer
    roomContainer.appendChild(triviaContainer);
    triviaContainer.appendChild(closeIcon);
    triviaContainer.appendChild(quizzContainer);
    triviaContainer.appendChild(iconContainer);
    triviaContainer.appendChild(buttonContainer);
    quizzContainer.appendChild(questionContainer);
    quizzContainer.appendChild(quizzTypeButtonsContainer);

    //Variables to hold needed values
    let total = 0;    // Total of questions on the celestialBodies
    let correctAnswers = 0; // Total of correct answers
       // Current question index
    
    let currentAnswerField; // Current answer field being displayed


    const countTotalQuestions = () => {
        // Loop through each planet's challenges
        eventData.forEach(planet => {
            // Loop through each challenge type and add to total
            Object.values(planet.challenges).forEach(challengeArray => {
                total += challengeArray.length;
            });
        });
        console.log(`Total Questions: ${total}`);
    }

    const countCorrectAnswers = () => {
        // Loop through each planet's challenges
        correctAnswers = 0;
        eventData.forEach(planet => {
            // Loop through each challenge type
            Object.values(planet.challenges).forEach(challengeArray => {
                // For each challenge, increment correctAnswers if isAnsweredCorrectly is true
                challengeArray.forEach(challenge => {
                    if (challenge.isAnsweredCorrectly === true) {
                        correctAnswers++;
                    } 
                });
            });
        });
        console.log(`Correct Answers: ${correctAnswers}`);
        
    };
    countTotalQuestions();
    countCorrectAnswers();
  
    //Display the questions of the first planet in eventData
    displayQuestions(eventData[0]);

    function displayQuestions(planetSet) {
        // Clear previous question type buttons
        quizzTypeButtonsContainer.innerHTML = '';
        currentPlanet = planetSet.planet;
        console.log(currentPlanet);
        // Create a button for each type of question
        
        const questionTypes = Object.keys(planetSet.challenges);
 
        challengeType = questionTypes[0];
        console.log(challengeType);
        questionTypes.forEach(questionType => {
            const button = document.createElement('button');
            button.innerText = questionType;
            button.dataset.questionType = questionType;
            button.addEventListener('click', function() {

                challengeType = this.dataset.questionType;
                currentQuestionIndex = 0;
                displayQuestionType(this.dataset.questionType, planetSet);

            });
            quizzTypeButtonsContainer.appendChild(button);
        });
    
        // By default, display the first type of questions
        if (questionTypes.length > 0) {
            displayQuestionType(questionTypes[0], planetSet);
        }
    }
    
    function displayQuestionType(questionType, planetSet) {
        // Clear the question container
        questionContainer.innerHTML = '';

        // Clear the icon container
        iconContainer.innerHTML = '';

        const questions = planetSet.challenges[questionType];
        console.dir(questions);
        // Create an array of icons, one for each question, and add them to the iconContainer
        const icons = questions.map((question, index) => {
            console.log(`Question ${index}: ${question.question}`);
            const icon = document.createElement('img');
        
            if(question.isAnsweredCorrectly === true) {
                icon.src = iconPaths.correctIconSrc; // replace with the path to your correct icon
            } else if (question.isAnsweredCorrectly === false) {
                icon.src = iconPaths.incorrectIconSrc;
            } else {
                icon.src = iconPaths.unansweredIconSrc;
            }
        
            icon.style.width = (32/1.8) + 'px';
            icon.style.height = (32/1.8) + 'px';
            icon.addEventListener('click', () => {
                displayQuestion(index); 

                currentQuestionIndex = index

            });
            iconContainer.appendChild(icon);
            return icon;
        });
        

        iconContainer.appendChild(submitButton);

        // Function to create an input field for the answer
        const createAnswerField = (question) => {
            let answerField;
            
            if (questionType === 'multiple choice') {
                answerField = document.createElement('select');
                question.choices.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.innerText = option;
                    answerField.appendChild(optionElement);
                });
            } else if (questionType === 'short answer') {
                answerField = document.createElement('input');
                answerField.type = 'text';
            } else if (question.type === 'fill in the blanks') {
                answerField = document.createElement('div');
                answerField.classList.add('answerField');
                // In your function where you create the divs for the choices:
                question.choices.forEach(choice => {
                    const choiceElement = document.createElement('div');
                    choiceElement.innerText = choice;
                    makeDraggable(choiceElement);
                    answerField.appendChild(choiceElement);
                });
            }
            return answerField;
        }

        // Function to make choices draggable
        const makeDraggable = (element) => {
            element.draggable = true;
            element.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', e.target.innerText);
            });
        }

        //Function to check the correct answer
        const checkAnswer = (question, playerAnswer, index) => {
            
            if (question.type ==='multiple choice') {
                if (question.answer === playerAnswer) {
                    question.isAnsweredCorrectly = true;
                    alert('Correct!');
                } else {
                    question.isAnsweredCorrectly = false;
                    alert('Wrong!');
                }
            } else if (question.type ==='short answer') {
                if (question.answer.toLowerCase() === playerAnswer.toLowerCase()) {
                    question.isAnsweredCorrectly = true;
                    alert('Correct!');
                }else {
                    question.isAnsweredCorrectly = false;
                    alert('Wrong!');
                }
            } else if (question.type === 'fill in the blanks') {
                console.log(JSON.stringify(question.answer));
                console.log(JSON.stringify(playerAnswer));
                if (JSON.stringify(question.answer) === JSON.stringify(playerAnswer)) {
                    console.log(JSON.stringify(question.answer));
                    console.log(JSON.stringify(playerAnswer));
                    question.isAnsweredCorrectly = true;
                    alert('Correct!');
                }else {
                    question.isAnsweredCorrectly = false;
                    alert('Wrong!');
                }
            }

            // Update localStorage immediately after updating isAnsweredCorrectly
            console.log(` Question ${index}: ${question}`);
            console.dir(question);
            PlanetSet.updateLocalStorage(currentPlanet, question);
            countCorrectAnswers();
            // To update the icon
            if (question.isAnsweredCorrectly) {
                icons[index].src = iconPaths.correctIconSrc;
            } else {
                icons[index].src = iconPaths.incorrectIconSrc;
            }
            // Check if all questions have been answered correctly
            if (correctAnswers === total) {
                // All questions answered correctly
                mainTrivia = false;
            }
        };

        // Function to update the progress bar accordingly to the correct answers
        const updateProgressBar = (correctAnswers, total) => {
            // Calculate progress percentage
            console.log(`Current: ${correctAnswers}`);
            console.log(`Total: ${total}`);
            console.log(`Progress: ${correctAnswers}/${total}`);
            let progressPercentage = (correctAnswers / total) * 100;

            // Update the progress bar from the current Room and also update it in the gameSession
            EscapeRooms[currentRoom].progressBar = progressPercentage;
            gameSession[`${currentRoom}Progress`] = progressPercentage;  // Assuming roomOneProgress is the right field in gameSession
console.log(gameSession[`${currentRoom}Progress`])
            console.log(gameSession),
            console.log(` Progress Percentage: ${EscapeRooms[currentRoom].progressBar}%`);

            // Apply new width to SVG rect
            const rects = document.querySelectorAll('.FillBar-container rect');
            rects.forEach(rect => {
                rect.setAttribute("width", EscapeRooms[currentRoom].progressBar + "%");
            });

            // Update progressCounterContainer text
            const progressCounterContainer = document.querySelector('.progressCounterContainer');
            progressCounterContainer.innerText = `${EscapeRooms[currentRoom].progressBar.toFixed(2)}% completed of Room One`; 

             // Save the game state every time the progress changes
            updateGameSessionState(gameSession);
            User.updateGameSession(authenticatedUser.username, gameSession);
            console.log(gameSession);
        }

        // Function to display a question
        displayQuestion = (index, atualizedQuestion = null) => {
            questionContainer.innerHTML = '';  // Clear the container
            if (!atualizedQuestion) {currentQuestion = questions[index];
 console.log(index);}
            else {currentQuestion = atualizedQuestion; console.log('entered'); console.log(currentQuestion);};
            
            console.log(currentQuestion);
            // Display the question
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            //questionElement.style.minHeight = '50px'; // Set a minimum height
            //questionElement.style.border = '1px solid #000'; // Set a border for visibility

            questionContainer.appendChild(questionElement);

            // Display the answer field
            currentAnswerField = createAnswerField(currentQuestion);
            questionContainer.appendChild(currentAnswerField);

            // Update the button event listener
            submitButton.removeEventListener('click', submitButtonEventListener);
            submitButtonEventListener = () => {
                if (currentQuestion.type === 'multiple choice') {
                    checkAnswer(currentQuestion, currentAnswerField.value, index);
                    console.dir(currentQuestion);
                } else if (currentQuestion.type === 'short answer') {
                    checkAnswer(currentQuestion, currentAnswerField.value, index);
                } else if (currentQuestion.type === 'fill in the blanks') {
                    let playerAnswer = Array.from(questionElement.children).map(span => span.innerText).join(" ").trim().replace(/\s+/g, " ");
                    // Remove the space before punctuation marks
                    playerAnswer = playerAnswer.replace(/ \./g, ".");
                    checkAnswer(currentQuestion, playerAnswer, index);
                }


                updateProgressBar(correctAnswers,total);
                // Give educational content if all challenges were answered correctly
                giveEducationalContent(currentPlanet);
            };
            submitButton.addEventListener('click', submitButtonEventListener);
        

            if (challengeType === 'fill in the blanks') {
                // Define a function to calculate the target span and side
                function calculateTarget(e) {
                    // Get the relative mouse position inside the questionElement
                    const rect = questionElement.getBoundingClientRect();
                    const x = e.clientX;
                    const y = e.clientY;

                    let closestSpan = null;
                    let closestDistance = Infinity;  // Start with a very large initial distance

                    const spans = Array.from(questionElement.children);
                    const spansAreas = spans.map(span => ({spanArea: span.getBoundingClientRect(), spanText: span.innerText, span: span}));

                    spansAreas.forEach(spanArea => {
                        // Calculate the distance between the center of the span and the mouse position
                        const spanCenterX = spanArea.spanArea.left + spanArea.spanArea.width / 2;
                        const distance = x - spanCenterX;

                        // If this distance (in absolute value) is closer than the closest distance so far,
                        // update the closest span and distance
                        if (Math.abs(distance) < Math.abs(closestDistance)) {
                            closestSpan = spanArea;
                            closestDistance = distance;
                        }
                    });

                    // Determine the side
                    const side = closestDistance < 0 ? 'left' : 'right';

                    return {targetSpan: closestSpan.span, targetSide: side};
                }

                // Define a function to set up a span
                function setupSpan(span) {
                    let currentSpan = null; // keep track of current span to avoid unnecessary style updates
                    let currentSide = null; // keep track of current side to avoid unnecessary style updates

                    // Set up dragover event listener
                    span.addEventListener('dragover', e => {
                        e.preventDefault();
                        const {targetSpan, targetSide} = calculateTarget(e);
                        
                        // Add padding to the targetSpan
                        if (targetSpan) {
                            // Update style when targetSpan or targetSide has changed
                            if (targetSpan !== currentSpan || targetSide !== currentSide) {
                                // Reset style of previous target span
                                if (currentSpan) {
                                    currentSpan.style.paddingLeft = '';
                                    currentSpan.style.paddingRight = '';
                                }

                                currentSpan = targetSpan;
                                currentSide = targetSide;

                                if (targetSide === 'left') {
                                    targetSpan.style.paddingRight = '0';
                                    targetSpan.style.paddingLeft = '10px';
                                } else {
                                    targetSpan.style.paddingLeft = '0';
                                    targetSpan.style.paddingRight = '10px';
                                }
                            }
                        }
                    });

                    // Set up dragleave event listener
                    span.addEventListener('dragleave', (e) => {
                        console.log('dragleave');
                        if (span === currentSpan) {
                            span.style.paddingLeft = '';
                            span.style.paddingRight = '';
                            currentSpan = null;
                            currentSide = null;
                        }
                    });

                    // Set up drop event listener
                    span.addEventListener('drop', e => {
                        e.preventDefault();
                        const {targetSpan, targetSide} = calculateTarget(e);
                        
                        // Reset the padding
                        if (targetSpan) {
                            targetSpan.style.paddingLeft = '';
                            targetSpan.style.paddingRight = '';
                            currentSpan = null;
                            currentSide = null;
                        }
                        const choice = e.dataTransfer.getData('text/plain'); // Retrieve the choice text

                        // Remove the choice from the answerField
                        const choiceElement = Array.from(currentAnswerField.children).find(el => el.innerText === choice);
                        if (choiceElement) {
                            currentAnswerField.removeChild(choiceElement);
                        }

                        // Create a new span for the choice
                        const choiceSpan = document.createElement('span');
                        choiceSpan.innerText = choice;  // No spaces added here

                        // Set up the new choice span
                        setupSpan(choiceSpan);

                        choiceSpan.onclick = () => {
                            // Remove the span from the questionElement
                            questionElement.removeChild(choiceSpan);

                            // Add the choice back to the answerField
                            const choiceElement = document.createElement('div');
                            choiceElement.innerText = choice;
                            makeDraggable(choiceElement);
                            currentAnswerField.appendChild(choiceElement);
                        };

                        // Insert the choice before or after the closest span
                        if (targetSide === 'left') {
                            // Check if the previousSibling is a word and not a punctuation, if so, add a space
                            if (targetSpan.previousSibling && !targetSpan.previousSibling.innerText.match(/[\.,;!\?]$/)) {
                                choiceSpan.innerText = ' ' + choiceSpan.innerText.trim();
                            }

                            questionElement.insertBefore(choiceSpan, targetSpan);

                            // Check if the inserted choiceSpan is not followed by a punctuation or number, if so, add a space
                            if (!choiceSpan.nextSibling.innerText.match(/^[\.,;!\?]/) && isNaN(parseInt(choiceSpan.nextSibling.innerText))) {
                                choiceSpan.innerText = choiceSpan.innerText.trim() + ' ';
                            }
                        } else {
                            // Check if the nextSibling is a word and not a punctuation, if so, add a space
                            if (targetSpan.nextSibling && !targetSpan.nextSibling.innerText.match(/^[\.,;!\?]/) && isNaN(parseInt(targetSpan.nextSibling.innerText))) {
                                choiceSpan.innerText = choiceSpan.innerText.trim() + ' ';
                            }

                            if (targetSpan.nextSibling) {
                                questionElement.insertBefore(choiceSpan, targetSpan.nextSibling);
                            } else {
                                questionElement.appendChild(choiceSpan);
                            }

                            // Check if the inserted choiceSpan is not preceded by a punctuation, if so, add a space
                            if (!choiceSpan.previousSibling.innerText.match(/[\.,;!\?]$/)) {
                                choiceSpan.innerText = ' ' + choiceSpan.innerText.trim();
                            }
                        }

                    });
                }

                // Match either a word (sequence of one or more non-space, non-punctuation characters)
                // or a single punctuation character.
                const tokenRegex = /(\b[^\s\.,;!\?]+\b|[\.,;!\?])/g;
                const tokens = currentQuestion.question.match(tokenRegex);

                tokens.forEach((token, i) => {
                    const tokenSpan = document.createElement('span');
                    if (token.match(/^[\.,;!\?]/)) { 
                        // If token is the last one in the tokens array, do not add a space
                        if (i === tokens.length - 1) {
                            tokenSpan.innerText = token;
                        } else {
                            tokenSpan.innerText = token + ' ';
                        }
                    } else {
                        if (i === 0) {
                            tokenSpan.innerText = token;
                        } else {
                            tokenSpan.innerText = ' ' + token;
                        }
                    }
                    questionElement.appendChild(tokenSpan);
                        
                    // Set up the word span
                    setupSpan(tokenSpan);
                });
            } else {
                questionElement.innerText = currentQuestion.question;
            }

        }
        // Display the first question
        displayQuestion(currentQuestionIndex);
    }

}

const observer = new MutationObserver(() => {
    const triviaContainer = document.querySelector('.triviaContainer');
    const bonusTriviaContainer = document.querySelector('.challenge-container');
    if (!triviaContainer) {
        // Trivia container does not exist
        mainTrivia = false;

    }
    if (!bonusTriviaContainer) {
        // Challenge container does not exist
        bonusTrivia = false;

    }

});

// Start observing
observer.observe(document.body, { childList: true, subtree: true });


// Listen for the 'changeMap' event. This event is fired when the user 
// changes the map in the cutsceneSpaces instance. The event contains the
// information about the new map and what should happen after the transition.
document.addEventListener('changeMap', (e) => {
    // Extract the new map and completion callback from the event data
    const eventData = e.detail;
    const newMap = eventData.event.map;

    
    if (window.EscapeRooms.RoomOne.progressBar === 0) { 
        console.log(eventData)
        console.log(eventData.event.notAllowed)
    
        const newOverworldEvent = new OverworldEvent({ map: cosmicQuest.map, event: eventData.event.notAllowed });

        console.log(eventData.event.notAllowedEvent)
        //gameController.addGameEvent(newOverworldEvent);
        console.log(newOverworldEvent)
        console.log('event created')
   
        gameController.addGameEvent(newOverworldEvent);
    
        newOverworldEvent.init();
        eventData.onComplete();
        return; 
    };
    
    // Update the current room to reflect the new map
    currentRoom = newMap;
    // Also update the currentRoom in localStorage
    localStorage.setItem('currentRoom', currentRoom);

    // Initiate the scene transition
    sceneTransition(eventData);
    // After changing the room, update the HUD.
    updateHUD();

});

// The sceneTransition function creates a transition effect between maps.
// It fades the current map out, starts the new map, and then fades back in.
function sceneTransition(eventData) {
    // Create a new div element for the transition effect
    const scene = document.createElement('div');
    scene.classList.add('SceneTransition');

    // Define the fade-out animation
    const fadeout = () => {
        scene.classList.add('fade-out');
        scene.addEventListener('animationend', () => {
            scene.remove(); // Remove the transition effect when it's done
        }, {once: true});
    };

    // Add the transition effect to the container
    roomContainer.appendChild(scene);

    // Start the new map when the transition effect is done
    scene.addEventListener('animationend', () => {
        // Use the cosmicQuest object to start the new map
        cosmicQuest.startMap(window.EscapeRooms[eventData.event.map]);

        // Call the completion callback passed in the event data
        eventData.onComplete();

        // Start the fade-out animation
        fadeout();
    }, {once: true});
};

const textMessagePresent = () => document.querySelector('.TextMessage') !== null; // This will return true if a text message element exists, false otherwise

let iconsVisible = false;


document.querySelector('.assist-tokens-icon').addEventListener('click', function() {

    // If there's a text message, exit the function
    if (textMessagePresent()) {
        return;
        console.log('clicked')
    }
    console.log('clicked')
    const otherIcons = ['power-ups', 'reduce-time', 'helps'];

    if (!iconsVisible) { // if icons are not visible, show them
        otherIcons.forEach((iconId, index) => {
            setTimeout(() => {
                document.getElementById(iconId).classList.remove('hidden');
            }, 300 * (index + 1)); // Delay each icon's appearance by 300ms
        });
        iconsVisible = true;
    } else { // if icons are visible, hide them
        otherIcons.forEach((iconId, index) => {
            setTimeout(() => {
                document.getElementById(iconId).classList.add('hidden');
            }, 300 * (index + 1)); // Delay each icon's disappearance by 300ms
        });
        iconsVisible = false;
    }
});

document.querySelector('.CosmicDiary').addEventListener('click', function() {
    // If there's a text message, exit the function
    if (textMessagePresent()) {
        return;
    }

    let contentContainer = document.querySelector('.EducationalContent');
    const notes = document.querySelector('.Notes');
    const buttonContainer = document.querySelector('.buttonContainer');

    if (!contentContainer) {
        contentContainer = createNoteArea();  // you would need to track the current planet
    } else {
        contentContainer.remove();
    }
});

// Event listener for the 'click' event on the Research Terminal button
let currentIndex = { value : 0}

// This function handles the click event for the 'ResearchTerminal' element
document.querySelector('.ResearchTerminal').addEventListener('click', function() {
    handleResearchTerminalClick();
});

// This function handles the click event for the 'ResearchTerminal' element
// This function handles the click event for the 'ResearchTerminal' element
function handleResearchTerminalClick() {
    // If there's a text message, exit the function
    if (textMessagePresent()) {
        return;
    }

    let researchTerminalContainer = document.querySelector('.ResearchTerminalContainer');

    // If the Research Terminal does not contain the class hidden then add it
    if (researchTerminalContainer) {
        researchTerminalContainer.remove();
    } else {
        researchTerminalContainer = createResearchTerminalContainer();
        console.log(researchTerminalContainer);
        // Add the Research Terminal to the roomContainer
        roomContainer.appendChild(researchTerminalContainer);

        let planetSet = getPlanetSet('Mercury');
        console.log(`Here the planetSet is ${planetSet}`);

        const researchTerminal = researchTerminalContainer.querySelector('.ResearchTerminalContent');

        const buttonContainer = researchTerminalContainer.querySelector('.buttonContainer');
        const terminalContent = researchTerminalContainer.querySelector('.TerminalContent');

        let keysResearchTerminal = Object.keys(planetSet.researchTerminal);
        console.log(keysResearchTerminal);

        // Get all buttons within the container
        const buttons = buttonContainer.querySelectorAll('button');

        // Iterate through each button and add the event listener
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const planetName = this.dataset.planet;
                console.log(planetName)
                planetSet = getPlanetSet(planetName);
                console.log(`Button was clicked and the planetSet is ${planetSet.planet}`);
                console.dir(planetSet);
                console.log(planetSet.planet);
                console.log(planetSet.researchTerminal);

                populateResearchTerminal(researchTerminal, planetSet, keysResearchTerminal[0]);

                handleThemeChange(terminalContent, keysResearchTerminal, planetSet, researchTerminal);
            });
        });

        populateResearchTerminal(researchTerminal, planetSet, keysResearchTerminal[0]);

        handleThemeChange(terminalContent, keysResearchTerminal, planetSet, researchTerminal);
    }
}

// This function creates the Research Terminal container along with its child elements
function createResearchTerminalContainer() {
    const researchTerminalContainer = document.createElement('div');
    researchTerminalContainer.classList.add('ResearchTerminalContainer');
    
    const researchTerminal = document.createElement('div');
    researchTerminal.classList.add('ResearchTerminalContent');

    const buttonContainer = createButtons();
    const terminalContent = document.createElement('div');
    terminalContent.classList.add('TerminalContent');
    
    researchTerminalContainer.appendChild(terminalContent);
    researchTerminalContainer.appendChild(researchTerminal);
    researchTerminalContainer.appendChild(buttonContainer);

    return researchTerminalContainer;
}

// This function populates the Research Terminal with content
function populateResearchTerminal(researchTerminal, planetSet, theme) {
    researchTerminal.innerText = '';
    const planetSetContent = planetSet.researchTerminal[theme];
    researchTerminal.innerText = planetSetContent;
}

// This function handles the theme change when the left or right arrow is clicked
function handleThemeChange(terminalContent, keysResearchTerminal, planetSet, researchTerminal) {
    let themeContainer = terminalContent.querySelector('.themeContainer');

    if (!themeContainer) {
        // If themeContainer doesn't exist, create it
        themeContainer = document.createElement('div');
        themeContainer.classList.add('themeContainer');

        terminalContent.appendChild(themeContainer);
        terminalContent.appendChild(researchTerminal);
    }

    // Update the themeContainer's inner HTML
    themeContainer.innerHTML = (`<img class="arrow left-arrow" src="/assets/img/Glass_Arrow_Small.png" alt="Left arrow">
    <div class="themeTitle">${keysResearchTerminal[0]}</div>
    <img class="arrow right-arrow" src="/assets/img/Glass_Arrow_Small.png" alt="Right arrow">`);

    const leftArrow = themeContainer.querySelector('.left-arrow');
    const rightArrow = themeContainer.querySelector('.right-arrow');
    const themeTitle = themeContainer.querySelector('.themeTitle');

    leftArrow.addEventListener('click', () => {
        handleArrowClick(keysResearchTerminal, 'left', themeTitle, currentIndex);
        populateResearchTerminal(researchTerminal, planetSet, themeTitle.innerText);
    });

    rightArrow.addEventListener('click', () => {
        handleArrowClick(keysResearchTerminal, 'right', themeTitle, currentIndex);
        populateResearchTerminal(researchTerminal, planetSet, themeTitle.innerText);
    });
}

// This function handles the click event for the left or right arrow
function handleArrowClick(keysResearchTerminal, direction, themeTitle, currentIndex) {
    let updateIndex
    if (direction === 'left') {
        console.log('left arrow clicked');
        updateIndex = currentIndex.value <= 0 ? keysResearchTerminal.length - 1 : currentIndex.value -= 1;
    } else {  // direction === 'right'
        console.log('right arrow clicked');
        updateIndex = currentIndex.value >= keysResearchTerminal.length - 1 ? 0 : currentIndex.value += 1;
    }
    themeTitle.innerText = keysResearchTerminal[updateIndex];
    currentIndex.value = updateIndex;
}


/*
// Function to start the game
function startGame() {
    // Get the current timestamp and store it as the start time
    const startTime = new Date().getTime();
    window.EscapeRooms.timeLimit.startTime = startTime;

    // Store the start time in localStorage
    localStorage.setItem('startTime', startTime);
}

// Function to load the game
function loadGame() {
    // Retrieve the start time from localStorage
    const startTime = parseInt(localStorage.getItem('startTime'));

    // Calculate how much time has passed since the start time
    const elapsed = new Date().getTime() - startTime;

    // Subtract the elapsed time from the total time limit to get the remaining time
    const remaining = window.EscapeRooms.timeLimit.total - elapsed;

    // Store the remaining time
    window.EscapeRooms.timeLimit.remaining = remaining;
}

*/


    
/* LOGIC FOR DRAG AND DROP 
questionElement.addEventListener('click', (e) => {
    // Get the relative mouse position inside the questionElement
    let closestSpan = null;
    let closestDistance = Infinity;  // Start with a very large initial distance
    const x = e.clientX;
    const y = e.clientY;

    const spans = Array.from(questionElement.children);
    const spansAreas = spans.map(span => ({spanArea: span.getBoundingClientRect(), spanText: span.innerText}));
    console.dir(spansAreas);

    spansAreas.forEach(spanArea => {
        // Calculate the distance between the center of the span and the mouse position
        const spanCenterX = spanArea.spanArea.left + spanArea.spanArea.width / 2;

        // We only need the horizontal distance for this case
        const distance = x - spanCenterX;

        // If this distance (in absolute value) is closer than the closest distance so far,
        // update the closest span and distance
        if (Math.abs(distance) < Math.abs(closestDistance)) {
            closestSpan = spanArea;
            closestDistance = distance;
        }
    });

    console.log(`Mouse x is ${x} and mouse y is ${y}`);
    console.log(`Closest span is ${closestSpan.spanText} at a distance of ${closestDistance}`);
    
    if (closestDistance < 0) {
        console.log(`The choice will be inserted before ${closestSpan.spanText}`);
    } else {
        console.log(`The choice will be inserted after ${closestSpan.spanText}`);
    }
});

*/


    /*
    // Set up drag and drop with Dragula
    const drake = dragula([answerField, questionElement]);

    drake.on('drop', function (el, target, source, sibling) {
        console.log(el)
        const elText = el.innerText;
        console.log(elText)
        // You don't need to manually manage the removal or addition of the element
    });*/