import  LearningEnvironment  from "/js/Model/learningEnvironment.js";
import OverworldEvent from "/js/Model/OverworldEvent.js";
import  KeyPressListener  from '/js/Model/KeyPressListener.js';
import {utils} from "/js/Model/Utils.js";
import {Person} from "/js/Model/Person.js";
import * as Quizz from "/js/Model/Quizz.js"
import * as PlanetSet from "/js/Model/PlanetSet.js";

let cosmicQuest

const initialize = () => {
    cosmicQuest = new LearningEnvironment({
        element: document.querySelector(".room-container"),
      });
      cosmicQuest.init();
      console.log('Initialized cosmicQuest')
}

PlanetSet.initializeLocalStorage();

//Get the main container of Cosmic Quest
const roomContainer = document.querySelector(".room-container");

// We use the window object to create a global object called "EscapeRooms". 
// This object will hold all the data related to different rooms of our game.
window.EscapeRooms = {
    RoomOne: {
        // Source of lower and upper layers of the room background
        lowerSrc: '/assets/img/Room 1/Room 111.png',
        upperSrc: '/assets/img/Room 1/DemoUpper.png', // This would be used if in any case we need a 'roof' on the scene
        // Challenges of the room
       mainTrivia: [
            JSON.parse(localStorage.getItem('Mars')),
            JSON.parse(localStorage.getItem('Venus')),
            JSON.parse(localStorage.getItem('Earth')),
            JSON.parse(localStorage.getItem('Mercury')),
        ],
        progressBar: { current: 0, total: 100 },
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
                                onConfirm: { type: "mainTrivia" },
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
            [utils.asGridCoord(7,13)]: [
                {
                    events: [
                        { type: "changeMap", map: "RoomTwo" },
                    ]
                },
            ]
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
        challenges: [
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
    timeLimit: { 
        total: 60 * 30, // Total time limit for the game, for example 30 minutes
        remaining: 60 * 30, // Remaining time, initialize to total time limit
        startTime: null, // Will hold the time when the game starts
        endTime: null // Will hold the time when the game ends
    }
}

initialize();

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

/*try {
    let planetSet = PlanetSet.generatePlanetSetsForRoom(
        'Mars', 
        new Quizz('multiple choice', ['Option 1', 'Option 2', 'Option 3'], 'Question 1?', 'Option 1'), 
 
    );
} catch (error) {
    console.log(`Caught an error: ${error.message}`);
}*/


// The 'mainTrivia' event fires when a new trivia needs to be displayed in the UI
document.addEventListener("mainTrivia", function(e) {
    const eventData = e.detail;
    console.log(e.detail);
    //Create the container that will hold the trivia
    const triviaContainer = document.createElement('div');
    triviaContainer.classList.add('triviaContainer');

    // Buttons that hold the questions for each planet
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('buttonContainer');

    // Container that will hold the questions + buttons for the questions types
    const quizzContainer = document.createElement('div');
    quizzContainer.classList.add('quizzContainer');

    //Add the triviaContainer to the roomContainer and the buttonContainer to the triviaContainer
    roomContainer.appendChild(triviaContainer);
    triviaContainer.appendChild(quizzContainer);
    triviaContainer.appendChild(buttonContainer);
    
    console.log(`About to create the buttons for ${eventData.event}`);
    eventData.event.forEach(planetSet => {
        console.dir(planetSet)
        createButton(planetSet, buttonContainer, quizzContainer);  // pass quizzContainer as argument
    });

});

function createButton(planetSet, buttonContainer, quizzContainer) {

    const button = document.createElement('button');
    button.classList.add('triviaButton');
    button.innerText = planetSet.planet;
    button.dataset.planet = planetSet.planet;  // Store the planet name in the button for later reference
    button.addEventListener('click', function() {
        displayQuestions(this.dataset.planet, quizzContainer);  // pass quizzContainer as argument
    });
    buttonContainer.appendChild(button);
}

function displayQuestions(planetName, quizzContainer) {
    // Retrieve the PlanetSet for this planet from localStorage
    const planetSet = JSON.parse(localStorage.getItem(planetName));

    // clear out the previous questions
    quizzContainer.innerHTML = '';

    // Create a container for the questions
    const questionContainer = document.createElement('div');
    questionContainer.classList.add('questionContainer');

    // Create a container for the question type buttons
    const quizzTypeButtonsContainer = document.createElement('div');
    quizzTypeButtonsContainer.classList.add('quizzTypeButtonsContainer');
    
    quizzContainer.appendChild(questionContainer);
    quizzContainer.appendChild(quizzTypeButtonsContainer);

    // Create a button for each type of question
    const questionTypes = Object.keys(planetSet.challenges);
    questionTypes.forEach(questionType => {
        const button = document.createElement('button');
        button.innerText = questionType;
        button.dataset.questionType = questionType;
        button.addEventListener('click', function() {
            displayQuestionType(this.dataset.questionType, planetSet, questionContainer);
        });
        quizzTypeButtonsContainer.appendChild(button);
    });

    // By default, display the first type of questions
    if (questionTypes.length > 0) {
        displayQuestionType(questionTypes[0], planetSet, questionContainer);
    }
}

function displayQuestionType(questionType, planetSet, questionContainer) {
    // Clear the question container
    questionContainer.innerHTML = '';

    const questions = planetSet.challenges[questionType];

    // Current question index
    let currentQuestionIndex = 0;

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
    function makeDraggable(element) {
        element.draggable = true;
        element.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', e.target.innerText);
        });
    }

    //Function to check the correct answer
    const checkAnswer = (question, playerAnswer) => {
    
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
            }
        } else if (question.type === 'fill in the blanks') {
            if (JSON.stringify(question.answer) === JSON.stringify(playerAnswer)) {
                question.isAnsweredCorrectly = true;
                alert('Correct!');
            }
        }
    };

    // Function to display a question
    const displayQuestion = (index) => {
        questionContainer.innerHTML = '';  // Clear the container
        const question = questions[index];

        // Display the question
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        questionElement.style.minHeight = '50px'; // Set a minimum height
        questionElement.style.border = '1px solid #000'; // Set a border for visibility

        questionContainer.appendChild(questionElement);

        // Display the answer field
        const answerField = createAnswerField(question);
        questionContainer.appendChild(answerField);
        

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
                const choiceElement = Array.from(answerField.children).find(el => el.innerText === choice);
                if (choiceElement) {
                    answerField.removeChild(choiceElement);
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
                    answerField.appendChild(choiceElement);
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
        const tokens = question.question.match(tokenRegex);
        console.log(tokens);
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
        
        

        /*
        // Parse the question text into individual spans
        // Trim whitespace from the question string before splitting into words
        const words = question.question.trim().split('');

        words.forEach(word => {
            const wordSpan = document.createElement('span');
            wordSpan.innerText = word + ' ';  // Add a space after each word for readability
            questionElement.appendChild(wordSpan);

            // Set up the word span
            setupSpan(wordSpan);
        });*/


        // Create the submit button
        const submitButton = document.createElement('button');
        submitButton.innerText = 'Submit';
        submitButton.addEventListener('click', () => {
            if (question.type === 'multiple choice') {
                checkAnswer(question, answerField.value);
            } else if (question.type === 'short answer') {
                checkAnswer(question, answerField.value);
            } else if (question.type === 'fill in the blanks') {
                const answer = Array.from(questionElement.children)
                .map(child => child.innerText)
                .join('');
                console.log(answer);
                console.log(Array.from(questionElement.children));
                checkAnswer(question, answer);
            }            
        });
        questionContainer.appendChild(submitButton);

        // Display the 'previous' button if there is a previous question
        if (index > 0) {
            const prevButton = document.createElement('button');
            prevButton.innerText = 'Previous';
            prevButton.addEventListener('click', () => displayQuestion(index - 1));  // Decrement the current index on click
            questionContainer.appendChild(prevButton);
        }

        // Display the 'next' button if there is a next question
        if (index < questions.length - 1) {
            const nextButton = document.createElement('button');
            nextButton.innerText = 'Next';
            nextButton.addEventListener('click', () => displayQuestion(index + 1));  // Increment the current index on click
            questionContainer.appendChild(nextButton);
        }
    }

    // Display the first question
    displayQuestion(currentQuestionIndex);
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