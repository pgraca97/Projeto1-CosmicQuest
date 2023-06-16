export default class Quizz {
    // The constructor is called when a new instance of Challenge is created.
    // The type, choices, question and answer are passed in when the new Challenge is created.
    constructor(type, choices, question, answer) {
        this.type = type;  // The type of challenge: 'multiple choice', 'short answer', 'fill in the blanks', 'alphabet soup'
        this.question = question;  // The question text
        this.answer = answer;  // The correct answer
        this.isAnsweredCorrectly = null;  // Whether the challenge is answered correctly or not
        this.choices = choices;
        
        if (type == 'alphabet soup') {
            this.alphabetSoup = []; // Will hold the alphabet soup clicked letters 
        }
    }
}
