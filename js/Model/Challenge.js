class Challenge {
    // The constructor is called when a new instance of Challenge is created.
    // The type, choices, question and answer are passed in when the new Challenge is created.
    constructor(planet = null ,type, choices = null, question, answer) {
        this.planet = planet;  // The planet that this set of challenges is about
        this.type = type;  // The type of challenge: 'multiple choice', 'short answer', 'fill in the blanks'
        this.choices = choices;  // The choices for the challenge (null for 'short answer' type)
        this.question = question;  // The question text
        this.answer = answer;  // The correct answer
        this.isAnsweredCorrectly = false;  // Whether the challenge is answered correctly or not
    }

    // This method is used to answer the challenge and check if the answer is correct.
    answerQuestion(playerAnswer) {
        if (this.type ==='multiple choice') {
            if (this.answer === playerAnswer) {
                // If the player's answer is correct, set isAnsweredCorrectly to true
                this.isAnsweredCorrectly = true;
            }
        } else if (this.type ==='short answer') {
            //...
        } else if (this.type === 'fill in the blanks') {
            //...
        }

    }

    // This method is used to group the challenges by planet and by type.
    groupChallengesByPlanetAndByType() {
        // Create an object for the planet and then inside of that object, create an object for each type of challenge.

        let planet = this.planet;  // The planet that this set of challenges is about
        planet = {
            'multiple choice': [],
            'short answer': [],
            'fill in the blanks': []
        }
    }
}

class ChallengeSet {
    // The constructor is called when a new instance of ChallengeSet is created.
    // The planet is passed in when the new ChallengeSet is created.
    constructor(planet) {
        this.planet = planet;  // The planet that this set of challenges is about
        // Initialize the challenges as an object where the keys are the challenge types and the values are empty arrays.
        this.challenges = {
            'multiple choice': [],
            'short answer': [],
            'fill in the blanks': []
        };
    }


    // This method is used to add a challenge to the appropriate type category in this ChallengeSet.
    addChallenge(type, challenge) {
        this.challenges[type].push(challenge);
    }

    static generateChallengeSetsForRoom() {
        // Create ChallengeSet instances for the planets in Room 1
        let marsChallengeSet = new ChallengeSet('Mars');
        marsChallengeSet.addChallenge('multiple choice', new Challenge('multiple choice', ['Option 1', 'Option 2', 'Option 3'], 'Question 1?', 'Option 1'));
        // ... Add the rest of the challenges for Mars ...

        // localStorage.setItem('marsChallengeSet', JSON.stringify(marsChallengeSet));
        
        let venusChallengeSet = new ChallengeSet('Venus');
        // ... Add challenges for Venus ...

        // Do the same for the other planets in Room 1

        return [marsChallengeSet, venusChallengeSet /*, other ChallengeSets for Room 1 */];
    }

}


let marsChallengeSet = new ChallengeSet('Mars');  // Create a new ChallengeSet for Mars
// Add a multiple choice challenge to the Mars ChallengeSet
marsChallengeSet.addChallenge('multiple choice', new Challenge('multiple choice', ['Option 1', 'Option 2', 'Option 3'], 'Question 1?', 'Option 1'));
// Add a short answer challenge to the Mars ChallengeSet
marsChallengeSet.addChallenge('short answer', new Challenge('short answer', null, 'Question 2?', 'Answer 2'));
// And so on for the other planets and challenge types...

/*

*/