export default class Quizz {
    constructor(type, choices, question, answer, hints = []) {
        this.type = type;
        this.question = question;
        this.answer = answer;
        
        this.isAnsweredCorrectly = null;
        this.choices = choices;
        this.hints = hints;  // Save the hints array
        if (type == 'alphabet soup') {
            this.alphabetSoup = [];
        } else if (type == 'fill in the blanks') {
            this.correctChoice = choices[0];
        };
    }
}
