import  LearningEnvironment  from "/js/Model/learningEnvironment.js";
import OverworldEvent from "/js/Model/OverworldEvent.js";
import  KeyPressListener  from '/js/Model/KeyPressListener.js';
import {utils} from "/js/Model/Utils.js";
import {Person} from "/js/Model/Person.js";
import * as Quizz from "/js/Model/Quizz.js"
import * as PlanetSet from "/js/Model/PlanetSet.js";

let cosmicQuest
let currentRoom
// Listen for the pageshow event to resume the countdown
window.addEventListener('pageshow', function() {
    // Check if the current page is 'rooms.html'
    if (window.location.href.includes('rooms.html')) {
        console.log('Page is rooms.html');
        // Resume the countdown if time remains
        if (window.EscapeRooms.timeLimit.remaining > 0) {
            startCountdown();
        }
    }
});

// Listen for the pagehide event to pause the countdown
window.addEventListener('pagehide', function() {
    // Stop the countdown
    clearInterval(window.EscapeRooms.timeLimit.intervalId);
});

const initialize = () => {
    cosmicQuest = new LearningEnvironment({
        element: document.querySelector(".room-container"),
      });
      cosmicQuest.init();
      currentRoom = cosmicQuest.map.overworld.currentRoom;
      console.dir(cosmicQuest);
      console.dir(cosmicQuest.map.overworld.currentRoom);
      console.log(currentRoom);
      console.log('Initialized cosmicQuest')
         // Check if game has started before
    if (window.EscapeRooms.timeLimit.startTime) {
        // Calculate remaining time
        const elapsed = Math.floor((new Date().getTime() - window.EscapeRooms.timeLimit.startTime) / 1000);
        window.EscapeRooms.timeLimit.remaining = window.EscapeRooms.timeLimit.total - elapsed;
        console.log('Has started before');
    } else {
        // Set the start time if it's the first time
        window.EscapeRooms.timeLimit.startTime = new Date().getTime();
        console.log('First time');
    }

    // Store the timeLimit object in localStorage
    localStorage.setItem('timeLimit', JSON.stringify(window.EscapeRooms.timeLimit));
}

PlanetSet.initializeLocalStorage();

//Get the  main containers of Cosmic Quest
const frameContainer = document.querySelector(".frame-container");
const roomContainer = document.querySelector(".room-container");

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
        progressBar: localStorage.getItem('RoomOneProgress') || 0,
        // Game objects are dynamic entities in the room, like characters, NPCS etc.
        gameObjects: {
            // playerCharacter is the main character controlled by the player
            playerCharacter: new Person ({
                isPlayerControlled: true, // isPlayerControlled property is used to define whether this character is controlled by the player or not
                x: utils.withGrid(7), // The x, y properties determine the starting position of the character in the room
                y: utils.withGrid(6),
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
                x: utils.withGrid(8),
                y: utils.withGrid(8),
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
                        { type: "changeMap", map: "RoomTwo" },
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
        },        
        // initialCutscene is an array of events that plays at the start of the game in each room.
        initialCutscene: [
            { who: "playerCharacter", type: "run", direction: "down" }, 
            { who: "playerCharacter", type: "run", direction: "down" },
            { who: "playerCharacter", type: "idle", direction: "right" },
            { type: 'textMessage', text: "Greetings, traveler! I am C.u.b.i!", faceHero: "CUBI" },
            { who: "playerCharacter", type: "idle", direction: "left" }, 
            { who: "playerCharacter", type: "run", direction: "left" },
        ]
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
        progressBar: { current: 0, total: 100 },
        gameObjects: {
            playerCharacter: new Person ({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(3),
                cutWidth: 32,  
                cutHeight: 32, 
                imgWidth: 32,  
                imgHeight: 32,
                shadowOffset: 2.4
            }),
            CUBI: new Person ({
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
        },
        initialCutscene: [
            { who: "playerCharacter", type: "idle", direction: "down" },
            { type: 'textMessage', text: "Greetings, traveler! I am C.u.b.i!"},
        ],
    },
    timeLimit: JSON.parse(localStorage.getItem('timeLimit')) || { 
        total: 60 * 30, // Total time limit for the game, for example 30 minutes
        remaining: 60 * 30, // Remaining time, initialize to total time limit
        startTime: null, // Will hold the time when the game starts
    }
}

initialize();

// Function to start the countdown
function startCountdown() {
    
    // Update the countdown display
    const countdownDisplay = document.createElement('div');
    countdownDisplay.classList.add('countdown-display');
    const roomsContainer = document.querySelector('.rooms');
    roomsContainer.appendChild(countdownDisplay);

    // Start the countdown interval
    window.EscapeRooms.timeLimit.intervalId = setInterval(function() {
        // Decrement the remaining time
        window.EscapeRooms.timeLimit.remaining--;

        // Check if the countdown has finished
        if (window.EscapeRooms.timeLimit.remaining <= 0) {

        // Handle the end of the game
        handleEndOfGame();

        }
        // Update the countdown display
        countdownDisplay.innerText = formatTime(window.EscapeRooms.timeLimit.remaining);
    }, 1000);  // Update every second

}
//startCountdown()
// Function to format a time in seconds into a MM:SS string
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
// Function to handle the end of the game
function handleEndOfGame() {
    // Do whatever you need to do when the game ends
    clearInterval(window.EscapeRooms.timeLimit.intervalId);
    window.EscapeRooms.timeLimit.remaining = 60 * 30;
    window.EscapeRooms.timeLimit.startTime = null;
        // Store the updated timeLimit object back to localStorage
        localStorage.setItem('timeLimit', JSON.stringify(window.EscapeRooms.timeLimit));
        const timeLimit = JSON.parse(localStorage.getItem('timeLimit'));
        console.log(timeLimit);
}

function createHUD() {
    const authenticatedUser = {
        username: 'Grupo13',
        characterColor: '/assets/img/Characters/User/BiColor/BiColor.png'
    }
    const hudContainer = document.createElement('div');
    hudContainer.classList.add('hudContainer');

    // Create profileContainer
    const profileContainer = document.createElement('div');
    profileContainer.classList.add('profileContainer');
    
    // Create img for profile pic based on characterColor
    const profilePic = document.createElement('img');
    profilePic.src = authenticatedUser.characterColor; // Assuming this path, adjust it to your needs
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
    
    //Create progressBarRectangle
    const progressBarRectangle = document.createElement('div');
    progressBarRectangle.innerHTML = (`
    <img src="/assets/img/GUI/ProgressBar.png" class="progressBar">
    <svg viewBox="0 0 26 3" class="FillBar-container">
        <rect x=0 y=1 width="${EscapeRooms.RoomOne.progressBar}%" height=5.4 fill="#ff9ccd" />
        <rect x=0 y=0 width="${EscapeRooms.RoomOne.progressBar}%" height=2 fill="#ffd5e9" />
    </svg>
    `)
    progressBarRectangle.classList.add('progressBarRectangle');
    progressBarContainer.appendChild(progressBarRectangle);

    const progressCounterContainer = document.createElement('div');
    progressCounterContainer.classList.add('progressCounterContainer');
    progressCounterContainer.innerText = (`${EscapeRooms.RoomOne.progressBar}% completed of Room One`);

    // Create coinCounterContainer
    const coinCounterContainer = document.createElement('div');
    coinCounterContainer.classList.add('coinCounterContainer');
    
    // Create coinCounterNumber
    const coinCounterNumber = document.createElement('span');
    coinCounterNumber.innerText = 0; // Replace 0 with authenticatedUser.coins when the logic is ready
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
    displayEducationalContent(eventData)
});

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
        // If the document becomes hidden (user switches tabs, minimizes browser, etc.), store the video time
        if (document.visibilityState === 'hidden') {
            // pause the video
            videoElement.pause();
            storeVideoTime();
        } else if (document.visibilityState === 'visible') {
            // resume the video
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

function createButtons(currentRoom = null) {
    const celestialBodies = [];

    // Get celestial bodies from all rooms if currentRoom isn't provided, or from the current room otherwise
    if (currentRoom === null) {
        celestialBodies.push(...window.EscapeRooms.RoomOne.celestialBodies);
        celestialBodies.push(...window.EscapeRooms.RoomTwo.celestialBodies);
    } else {
        celestialBodies.push(...window.EscapeRooms[currentRoom].celestialBodies);
    }
    console.log(celestialBodies);
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
        await newOverworldEvent.init();
        onComplete();
    });

    confirmationBox.querySelector('.cancelButton').addEventListener('click', async () => {
        confirmationBox.remove();
        const newOverworldEvent = new OverworldEvent({ map: cosmicQuest.map, event: event.onCancel });
        await newOverworldEvent.init();
        onComplete();
    });
}

console.log(JSON.parse(localStorage.getItem('Mars')),
JSON.parse(localStorage.getItem('Venus')),
JSON.parse(localStorage.getItem('Earth')),
JSON.parse(localStorage.getItem('Mercury')),);

// The 'mainTrivia' event fires when a new trivia needs to be displayed in the UI
document.addEventListener("mainTrivia", function(e) {
    const eventData = e.detail;

    const currentRoomChallenge = window.EscapeRooms[currentRoom][eventData.event.type];

    createTriviaElements(currentRoomChallenge);
});

//Function to give the educational content
const giveEducationalContent = (currentPlanetSet) => {
    //Check if all the challenges have been correctly answered
    const planetSet = getPlanetSet(currentPlanetSet);
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
            fetch(`/assets/txt/Mercury/Mercury.txt`)
            .then(response => response.text())
            .then(data => {
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

function createTriviaElements(eventData) {
    //Create the container that will hold the trivia
    const triviaContainer = document.createElement('div');
    triviaContainer.classList.add('triviaContainer');

    // Container that will hold the questions + buttons for the questions types
    const quizzContainer = document.createElement('div');
    quizzContainer.classList.add('quizzContainer');

    const buttonContainer = createButtons(currentRoom); 

    // Get all buttons within the container
    const buttons = buttonContainer.querySelectorAll('button');

    // Iterate through each button and add the event listener
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const planetSet = eventData.find(set => set.planet === this.dataset.planet);
            displayQuestions(planetSet);  // pass quizzContainer as argument
            console.log(planetSet);
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
    triviaContainer.appendChild(quizzContainer);
    triviaContainer.appendChild(iconContainer);
    triviaContainer.appendChild(buttonContainer);
    quizzContainer.appendChild(questionContainer);
    quizzContainer.appendChild(quizzTypeButtonsContainer);

    /*eventData.forEach(planetSet => {
        const button = document.createElement('button');
        button.classList.add('triviaButton');
        button.innerText = planetSet.planet;
        button.dataset.planet = planetSet.planet;  // Store the planet name in the button for later reference
        button.addEventListener('click', function() {
            const planetSet = eventData.find(set => set.planet === this.dataset.planet);
            displayQuestions(planetSet);  // pass quizzContainer as argument
            console.log(planetSet)
        });        
        buttonContainer.appendChild(button);
    });*/

    //Variables to hold needed values
    let total = 0;    // Total of questions on the celestialBodies
    let correctAnswers = 0; // Total of correct answers
    let currentQuestionIndex = 0;     // Current question index
    let currentQuestion; // Current question being displayed
    let currentAnswerField; // Current answer field being displayed
    let currentPlanetSet; // Current planet set being displayed

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
        currentPlanetSet = planetSet.planet;
        console.log(currentPlanetSet);
        // Create a button for each type of question
        const questionTypes = Object.keys(planetSet.challenges);
        questionTypes.forEach(questionType => {
            const button = document.createElement('button');
            button.innerText = questionType;
            button.dataset.questionType = questionType;
            button.addEventListener('click', function() {
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
            icon.addEventListener('click', () => displayQuestion(index));
            iconContainer.appendChild(icon);
            return icon;
        });
        
        console.log(icons);
        iconContainer.appendChild(submitButton);

        // Function to create an input field for the answer
        const createAnswerField = (question) => {
            let answerField;
            console.log(question);
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
                if (JSON.stringify(question.answer) === JSON.stringify(playerAnswer)) {
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
            PlanetSet.updateLocalStorage(currentPlanetSet, question);
            countCorrectAnswers();
            // To update the icon
            if (question.isAnsweredCorrectly) {
                icons[index].src = iconPaths.correctIconSrc;
            } else {
                icons[index].src = iconPaths.incorrectIconSrc;
            }

        };

        // Function to update the progress bar accordingly to the correct answers
        const updateProgressBar = (correctAnswers, total) => {
            // Calculate progress percentage
            console.log(`Current: ${correctAnswers}`);
            console.log(`Total: ${total}`);
            console.log(`Progress: ${correctAnswers}/${total}`);
            let progressPercentage = (correctAnswers / total) * 100;

            // Update the progress bar from the current Room and also update it in the local storage
            EscapeRooms.RoomOne.progressBar = progressPercentage;
            localStorage.setItem('RoomOneProgress', progressPercentage);
            console.log(` Progress Percentage: ${EscapeRooms.RoomOne.progressBar}%`);

            // Apply new width to SVG rect
            const rects = document.querySelectorAll('.FillBar-container rect');
            rects.forEach(rect => {
                rect.setAttribute("width", EscapeRooms.RoomOne.progressBar + "%");
            });

            // Update progressCounterContainer text
            const progressCounterContainer = document.querySelector('.progressCounterContainer');
            progressCounterContainer.innerText = `${EscapeRooms.RoomOne.progressBar.toFixed(2)}% completed of Room One`; 
        }

        // Function to display a question
        const displayQuestion = (index) => {
            questionContainer.innerHTML = '';  // Clear the container
            currentQuestion = questions[index];
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
                    const answer = Array.from(questionElement.children)
                    .map(child => child.innerText)
                    .join('');
                    checkAnswer(currentQuestion, answer, index);
                }


                updateProgressBar(correctAnswers,total);
                // Give educational content if all challenges were answered correctly
                giveEducationalContent(currentPlanetSet);
            };
            submitButton.addEventListener('click', submitButtonEventListener);
        

            if (currentQuestion.type === 'fill in the blanks') {
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

                            // Check if the inserted choiceSpan is not followed by a punctuation, if so, add a space
                            if (!choiceSpan.nextSibling.innerText.match(/^[\.,;!\?]/)) {
                                choiceSpan.innerText = choiceSpan.innerText.trim() + ' ';
                            }
                        } else {
                            // Check if the nextSibling is a word and not a punctuation, if so, add a space
                            if (targetSpan.nextSibling && !targetSpan.nextSibling.innerText.match(/^[\.,;!\?]/)) {
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

// Listen for the 'changeMap' event. This event is fired when the user 
// changes the map in the cutsceneSpaces instance. The event contains the
// information about the new map and what should happen after the transition.
document.addEventListener('changeMap', (e) => {
    // Extract the new map and completion callback from the event data
    const eventData = e.detail;
    const newMap = eventData.event.map;

    // Update the current room to reflect the new map
    currentRoom = newMap;
    // Also update the currentRoom in localStorage
    localStorage.setItem('currentRoom', currentRoom);

    // Initiate the scene transition
    sceneTransition(eventData);
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

document.getElementById('assist-tokens').addEventListener('click', function() {
    // If there's a text message, exit the function
    if (textMessagePresent()) {
        return;
    }

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