import Quizz from "/js/Model/Quizz.js"

class PlanetSet {
    // The constructor is called when a new instance of ChallengeSet is created.
    // The planet is passed in when the new ChallengeSet is created.
    constructor(planet, icon, challengeTypes = []) {
        this.planet = planet;  // The planet that this set of challenges is about
        this.icon = icon || null; // The icon associated with this planet
        this.notes = ""; // To keep the notes associated with each planet (Cosmic Diary)
        this.researchTerminal = {
            General: '',
            Geography: '',
            Atmosphere: '',
            Climate: '',
            Moons: '',
            History: '',
            Discovery: '',
            Mythology: '',
            Missions: ''
        };
        
        // Initialize the challenges as an object where the keys are the challenge types and the values are empty arrays.
        this.challenges = {};
        challengeTypes.forEach(type => {
            this.challenges[type] = [];
        });
        
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
    const additionalTrivia = ['Sun', 'Meteor Showers']; //, 'Inner Planets Moons', 'Outer Planets Moons'

    // Loop through the planets
    for (const planet of planets) {
        // Check if there is a PlanetSet in localStorage for this planet
        if (!localStorage.getItem(planet)) {
            // Create a default educational content for the planet
            let educationalContent;

            switch(planet) {
                case 'Mercury':
                    educationalContent = {
                        video: `/assets/video/Mercury/Mercury 101 _ National Geographic.mp4`,
                        subtitles: `/assets/video/Mercury/Mercury.vtt`
                    };
                    break;
                case 'Venus':
                    educationalContent = {
                        video: `/assets/video/Venus/Venus 101 _ National Geographic.mp4`,
                        subtitles: `/assets/video/Venus/Venus.vtt`
                    };
                    break;
                case 'Earth':
                    educationalContent = {
                        video: `/assets/video/Earth/Earth 101 _ National Geographic.mp4`,
                        subtitles: `/assets/video/Earth/Earth.vtt`
                    };
                    break;
                case 'Mars':
                    educationalContent = {
                        video: `/assets/video/Mars/Mars 101 _ National Geographic.mp4`,
                        subtitles: `/assets/video/Mars/Mars.vtt` 
                    };
                    break;
                case 'Jupiter':
                    educationalContent = {
                        video: `/assets/video/Jupiter/Jupiter 101 _ National Geographic.mp4`,
                        subtitles: `/assets/video/Jupiter/Jupiter.vtt`
                    };
                    break;
                case 'Saturn':
                    educationalContent = {
                        video: `/assets/video/Saturn/Saturn 101 _ National Geographic.mp4`,
                        subtitles: `/assets/video/Saturn/Saturn.vtt`
                    };
                    break;
                case 'Uranus':
                    educationalContent = {
                        video: `/assets/video/Uranus/Uranus 101 _ National Geographic.mp4`,
                        subtitles: `/assets/video/Uranus/Uranus.vtt`
                    };
                    break;
                case 'Neptune':
                    educationalContent = {
                        video: `/assets/video/Neptune/Neptune 101 _ National Geographic.mp4`,
                        subtitles: `/assets/video/Neptune/Neptune.vtt`
                    };
                    break;
                default:
                    educationalContent = {
                        video: `/assets/videos/${planet}.mp4`,
                        subtitles: `This is a dummy narration for ${planet}.`
                    };
                    break;
            }

            // Update the creation of Quizz instances to include hints
            let planetSet = generatePlanetSetsForRoom(
                planet,
                educationalContent,
                new Quizz('multiple choice', ['Option 1', 'Option 2', 'Option 3'], `Default question for ${planet}?`, 'Option 1', ['Hint 1', 'Hint 2']),
                new Quizz('multiple choice', ['Option 4', 'Option 5', 'Option 6'], `Default question 2 for ${planet}?`, 'Option 4', ['Hint 3', 'Hint 4']),
                new Quizz('short answer', null, 'Short Answer1?', 'Answer', ['Hint 1', 'Hint 2']), 
                new Quizz('fill in the blanks', ['Drag 1', 'Drag 2', 'Drag 3'], 'Question, Drag 2.', 'Question, Drag 2 Drag 1.', ['Hint 1', 'Hint 2']),
            );
            console.log(`Created default PlanetSet for ${planet}`);
            localStorage.setItem(planet, JSON.stringify(planetSet));
            console.log(`Stored default PlanetSet for ${planet}`);
        }
    }
    
    // Additional trivia
    for (const trivia of additionalTrivia) {
        if (!localStorage.getItem(trivia)) {
            // Create a default educational content for the planet
            let educationalContent;

            switch(trivia) {
                case 'Sun':
                    educationalContent = {
                        video: `/assets/video/Sun/Sun 101 _ National Geographic.mp4`,
                        subtitles: `/assets/video/Sun/Sun.vtt`
                    };
                    break;
                case 'Meteor Showers':
                    educationalContent = {
                        video: `/assets/video/Meteor Showers/Meteor Showers 101 _ National Geographic.mp4`,
                        subtitles: `/assets/video/Meteor Showers/Meteor Showers.vtt`
                    };
                    break;
                default:
                    educationalContent = {
                        video: `/assets/videos/${trivia}.mp4`,
                        subtitles: `This is a dummy narration for ${trivia}.`
                    };
                    break;
            }
            // Create a default PlanetSet and Challenge for this trivia
            let planetSet = generatePlanetSetsForRoom(
                trivia,
                educationalContent,
                new Quizz('alphabet soup', null, `What element makes up most of the Sun's mass?`, 'Hydrogen', ['Hint 1', 'Hint 2']),
                new Quizz('alphabet soup', null, `What is the process that generates the Sun's energy?`, 'Nuclear fusion', ['Hint 1', 'Hint 2']),
                new Quizz('alphabet soup', null, `Name the outermost layer of the Sun`, 'Corona', ['Hint 1', 'Hint 2'])
            );
        

            localStorage.setItem(trivia, JSON.stringify(planetSet));

        }
    }
}



// Function to create or update a PlanetSet for a given planet with arbitrary number of quizzes
export function generatePlanetSetsForRoom(planet, educationalContent, ...quizzes) {
    let planetSet;

    // Check if there's already a PlanetSet in localStorage for this planet
    let storedPlanetSet = localStorage.getItem(planet);
    if (storedPlanetSet) {
        // If there is, retrieve it and convert it back to an object
        planetSet = JSON.parse(storedPlanetSet);
    } else {
        // Get unique types from quizzes
        let uniqueTypes = [...new Set(quizzes.map(quizz => quizz.type))]; // Remove duplicates (Set is a built-in JavaScript object that stores unique values of any type.)
        // The spread operator is used to convert the Set back to an array

        // Create a new PlanetSet with unique types
        planetSet = new PlanetSet(planet, null, uniqueTypes);
    }

    quizzes.forEach(quizz => {
        if (planetSet.challenges[quizz.type].length >= 5) {
            throw new Error(`There are already 5 challenges of type '${quizz.type}' in the PlanetSet for ${planet}. Please remove some challenges before adding new ones.`);
        }
        planetSet.addChallenge(quizz)
    });

    // Add the educational content
    planetSet.addEducationalContent(educationalContent);
   
    // Store the updated PlanetSet back to localStorage
    localStorage.setItem(planet, JSON.stringify(planetSet));

    return planetSet;
}


export const updateLocalStorage = (planetSet, question) => {
    // Get the PlanetSet from localStorage
    const storedPlanetSet = JSON.parse(localStorage.getItem(planetSet));
    
    // Find the question in the stored PlanetSet and update its isAnsweredCorrectly property
    const challengeType = question.type;
    storedPlanetSet.challenges[challengeType].find(storedQuestion => storedQuestion.question === question.question).isAnsweredCorrectly = question.isAnsweredCorrectly;
    
    // Save the updated PlanetSet back to localStorage
    localStorage.setItem(planetSet, JSON.stringify(storedPlanetSet));
};