import Quizz from "/js/Model/Quizz.js"

class PlanetSet {
    // The constructor is called when a new instance of ChallengeSet is created.
    // The planet is passed in when the new ChallengeSet is created.
    constructor(planet, icon) {
        this.planet = planet;  // The planet that this set of challenges is about
        this.icon = icon || null; // The icon associated with this planet
        // Initialize the challenges as an object where the keys are the challenge types and the values are empty arrays.
        this.challenges = {
            'multiple choice': [],
            'short answer': [],
            'fill in the blanks': []
        };
        this.educationalContent = {};  // The educational content associated with the planet
    }

    // This method is used to add a challenge to the appropriate type category in this ChallengeSet.
    addChallenge(quizz) {
        const existingChallenges = this.challenges[quizz.type];
        if (!existingChallenges.some(existingChallenge => existingChallenge.question === quizz.question)) {
            existingChallenges.push(quizz);
        } else {
            console.log(`Skipping duplicate question: ${quizz.question}`);
        }
    }


    // This method is used to add educational content to this PlanetSet.
    addEducationalContent(content) {
        this.educationalContent = content;
    }

    // This method is used to set an icon for this PlanetSet.
    setIcon(icon) {
        this.icon = icon;
    }

    // This method is used to retrieve the icon for this PlanetSet.
    getIcon() {
        return this.icon;
    }

}

// Function to initialize localStorage with default PlanetSet and Challenge data
export function initializeLocalStorage() {
    // Planets list
    console.log('Initializing Local Storage');
    const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

    // Loop through the planets
    for (const planet of planets) {
        // Check if there is a PlanetSet in localStorage for this planet
        if (!localStorage.getItem(planet)) {
            // If not, create a default PlanetSet and Challenge for this planet
            let planetSet = generatePlanetSetsForRoom(
                planet, 
                new Quizz('multiple choice', ['Option 1', 'Option 2', 'Option 3'], `Default question for ${planet}?`, 'Option 1'),
                new Quizz('short answer', null, 'Short Answer1?', 'Answer'), 
                new Quizz('fill in the blanks', ['Drag 1', 'Drag 2', 'Drag 3'], 'Question, Drag 2.', 'Question, Drag 2 Drag 1.'),
            );
            console.log(`Created default PlanetSet for ${planet}`);
            localStorage.setItem(planet, JSON.stringify(planetSet));
            console.log(`Stored default PlanetSet for ${planet}`);
        }
    }
}

// Function to create or update a PlanetSet for a given planet with arbitrary number of quizzes
export function generatePlanetSetsForRoom(planet, ...quizzes) {
    let planetSet;

    // Check if there's already a PlanetSet in localStorage for this planet
    let storedPlanetSet = localStorage.getItem(planet);
    if (storedPlanetSet) {
        // If there is, retrieve it and convert it back to an object
        planetSet = JSON.parse(storedPlanetSet);
    } else {
        // If there isn't, create a new PlanetSet
        planetSet = new PlanetSet(planet);
    }

    quizzes.forEach(quizz => {
        if (planetSet.challenges[quizz.type].length >= 5) {
            throw new Error(`There are already 5 challenges of type '${challenge.type}' in the PlanetSet for ${planet}. Please remove some challenges before adding new ones.`);
        }
        planetSet.addChallenge(quizz)
    });
   
    // Store the updated PlanetSet back to localStorage
    localStorage.setItem(planet, JSON.stringify(planetSet));

    return planetSet;
}

export const updateLocalStorage = (planetSet, question) => {
    // Get the PlanetSet from localStorage
    const storedPlanetSet = JSON.parse(localStorage.getItem(planetSet.planet));
    
    // Find the question in the stored PlanetSet and update its isAnsweredCorrectly property
    const challengeType = question.type;
    storedPlanetSet.challenges[challengeType].find(storedQuestion => storedQuestion.question === question.question).isAnsweredCorrectly = question.isAnsweredCorrectly;
    
    // Save the updated PlanetSet back to localStorage
    localStorage.setItem(planetSet.planet, JSON.stringify(storedPlanetSet));
};