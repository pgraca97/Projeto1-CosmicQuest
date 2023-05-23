class Challenge {
    // The constructor is called when a new instance of Challenge is created
    constructor(room, planet, type, question, answer) {
        this.room = room; // The room number where the challenge is located
        this.planet = planet; // The specific planet that this challenge is about
        this.type = type; // The type of challenge: 'multiple choice', 'fill in the blanks', 'short answer', 'long answer'
        this.choices = choices; // Potential answers for multiple-choice questions
        this.question = question; // The question that the player has to answer
        this.answer = answer; // The correct answer to the question
        this.isAnsweredCorrectly = false; // Whether the player has answered the question correctly. It starts as false and changes to true when the player gets it right.
    }
     // A method to answer the question and check if it's correct
     answerQuestion(playerAnswer) {
        // If the player's answer matches the correct answer
        if (this.answer === playerAnswer) {
            // Then the question has been answered correctly
            this.isAnsweredCorrectly = true;
        }
    }
}


// Multiple choice question
let challenge1 = new Challenge(
    1, 
    'Mars',
    'multiple choice',
    'Which of the following is the tallest volcano in the solar system, located on Mars?',
    ['Olympus Mons', 'Mount Everest', 'Kilimanjaro'],
    'Olympus Mons'
);

// The player answers the question
challenge1.answerQuestion('Olympus Mons'); // This would set isAnsweredCorrectly to true


let shortAnswerChallenge = new Challenge(
    1, 
    'Mars',
    'short answer',
    'What is the name of the tallest volcano in the solar system, located on Mars?',
    null, // No choices necessary for short answer questions
    'Olympus Mons'
);

// The player answers the question
shortAnswerChallenge.answerQuestion('Olympus Mons'); // This would set isAnsweredCorrectly to true

// FALTA FILL IN THE BLANKS e LONG ANSWER

/* ?????????????
// Long answer
let challenge4 = new Challenge(
    1, // Room number
    'Mars', // Planet
    'long answer', // Type of question
    'Explain why Mars has seasons.', // Question
    'Mars has a tilted axis, just like Earth. This means as Mars orbits the Sun, different parts of the planet receive different amounts of sunlight, creating seasons.' // Answer
);*/
