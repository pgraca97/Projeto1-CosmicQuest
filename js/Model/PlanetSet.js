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
            let planetSet
            switch(planet) {
                case 'Mercury': {
                  let educationalContent = {
                    video: `/assets/video/Mercury/Mercury 101 _ National Geographic.mp4`,
                    subtitles: `/assets/video/Mercury/Mercury.vtt`
                  };
                  let quizzes = getMercuryQuizzes();
                  planetSet = generatePlanetSetsForRoom(planet, educationalContent, ...quizzes);
                  localStorage.setItem(planet, JSON.stringify(planetSet));
                  break;
                }
                case 'Venus': {
                  let educationalContent = {
                    video: `/assets/video/Venus/Venus 101 _ National Geographic.mp4`,
                    subtitles: `/assets/video/Venus/Venus.vtt`
                  };
                  let quizzes = getVenusQuizzes();
                  planetSet = generatePlanetSetsForRoom(planet, educationalContent, ...quizzes);
                  localStorage.setItem(planet, JSON.stringify(planetSet));
                  break;
                }
                case 'Earth': {
                  let educationalContent = {
                    video: `/assets/video/Earth/Earth 101 _ National Geographic.mp4`,
                    subtitles: `/assets/video/Earth/Earth.vtt`
                  };
                  let quizzes = getEarthQuizzes();
                  planetSet = generatePlanetSetsForRoom(planet, educationalContent, ...quizzes);
                  localStorage.setItem(planet, JSON.stringify(planetSet));
                  break;
                }
                case 'Mars': {
                  let educationalContent = {
                    video: `/assets/video/Mars/Mars 101 _ National Geographic.mp4`,
                    subtitles: `/assets/video/Mars/Mars.vtt`
                  };
                  let quizzes = getMarsQuizzes();
                  planetSet = generatePlanetSetsForRoom(planet, educationalContent, ...quizzes);
                  localStorage.setItem(planet, JSON.stringify(planetSet));
                  break;
                }
                case 'Jupiter': {
                  let educationalContent = {
                    video: `/assets/video/Jupiter/Jupiter 101 _ National Geographic.mp4`,
                    subtitles: `/assets/video/Jupiter/Jupiter.vtt`
                  };
                  let quizzes = getJupiterQuizzes();
                   planetSet = generatePlanetSetsForRoom(planet, educationalContent, ...quizzes);
                  localStorage.setItem(planet, JSON.stringify(planetSet));
                  break;
                }
                case 'Saturn': {
                  let educationalContent = {
                    video: `/assets/video/Saturn/Saturn 101 _ National Geographic.mp4`,
                    subtitles: `/assets/video/Saturn/Saturn.vtt`
                  };
                  let quizzes = getSaturnQuizzes();
                   planetSet = generatePlanetSetsForRoom(planet, educationalContent, ...quizzes);
                  localStorage.setItem(planet, JSON.stringify(planetSet));
                  break;
                }
                case 'Uranus': {
                  let educationalContent = {
                    video: `/assets/video/Uranus/Uranus 101 _ National Geographic.mp4`,
                    subtitles: `/assets/video/Uranus/Uranus.vtt`
                  };
                  let quizzes = getUranusQuizzes();
                   planetSet = generatePlanetSetsForRoom(planet, educationalContent, ...quizzes);
                  localStorage.setItem(planet, JSON.stringify(planetSet));
                  break;
                }
                case 'Neptune': {
                  let educationalContent = {
                    video: `/assets/video/Neptune/Neptune 101 _ National Geographic.mp4`,
                    subtitles: `/assets/video/Neptune/Neptune.vtt`
                  };
                  let quizzes = getNeptuneQuizzes();
                   planetSet = generatePlanetSetsForRoom(planet, educationalContent, ...quizzes);
                  localStorage.setItem(planet, JSON.stringify(planetSet));
                  break;
                }
                default: {
                  let educationalContent = {
                    video: `/assets/videos/${planet}.mp4`,
                    subtitles: `This is a dummy narration for ${planet}.`
                  };
                  break;
                }
              }
              
        }
    }
    
    // Additional trivia
    for (const trivia of additionalTrivia) {
        if (!localStorage.getItem(trivia)) {
            // Create a default educational content for the planet
            let educationalContent;

            switch(trivia) {
                case 'Sun': {
                    educationalContent = {
                        video: `/assets/video/Sun/Sun 101 _ National Geographic.mp4`,
                        subtitles: `/assets/video/Sun/Sun.vtt`
                    };
                    let quizzes = getSunQuizzes();
                     planetSet = generatePlanetSetsForRoom(trivia, educationalContent, ...quizzes);
                    localStorage.setItem(trivia, JSON.stringify(planetSet));
                    break;
                }
                case 'Meteor Showers': {
                    educationalContent = {
                        video: `/assets/video/Meteor Showers/Meteor Showers 101 _ National Geographic.mp4`,
                        subtitles: `/assets/video/Meteor Showers/Meteor Showers.vtt`
                    };
                    let quizzes = getMeteorQuizzes();
                     planetSet = generatePlanetSetsForRoom(trivia, educationalContent, ...quizzes);
                    localStorage.setItem(trivia, JSON.stringify(planetSet));
                    break;
                }
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

function getMercuryQuizzes() {
    return [
        new Quizz('multiple choice', ['Nitrogen', 'Methane', 'Sodium'], `Which of the following is a primary component of Mercury's thin atmosphere?`, 'Sodium', ['Hint 1', 'Hint 2']),
        new Quizz('multiple choice', ['Iron', 'Sulfur', 'Aluminum'], `Which of the following elements is NOT found in Mercury's core?`, 'Aluminum', ['Hint 3', 'Hint 4']),
        new Quizz('short answer', null, 'What is the name of the spacecraft that provided the first global topographic model of Mercury?', 'MESSENGER', ['Hint 1', 'Hint 2']),
        new Quizz('short answer', null, "Which gas is NOT found in Mercury's thin atmosphere?", 'Argon', ['Hint 1', 'Hint 2']), 
        new Quizz('fill in the blanks', ['88', '365', '694'], "Mercury's orbital period around the Sun is approximately Earth days.", "Earth's axial tilt is approximately 23.5 degrees.", ['Hint 1', 'Hint 2']),
        new Quizz('fill in the blanks', ['Sodium', 'Helium', 'Oxygen'], "The main component of Mercury's thin atmosphere is.", "The main component of Mercury's thin atmosphere is Sodium.", ['Hint 1', 'Hint 2'])
    ];
}

function getVenusQuizzes() {
    return [
        new Quizz('multiple choice', ['116', '225', '365'], `How many Earth days does it take for Venus to complete one orbit around the Sun?`, 'Sodium', ['Hint 1', 'Hint 2']),
        new Quizz('multiple choice', ['Volcanoes', 'Lava flows', 'Oceans'], `Which of the following features is NOT commonly found on Venus's surface?`, 'Oceans', ['Hint 3', 'Hint 4']),
        new Quizz('short answer', null, 'What is the term used to describe the runaway greenhouse effect on Venus?', 'Venusian hothouse', ['Hint 1', 'Hint 2']),
        new Quizz('short answer', null, "What is the main component of Venus's thick cloud layers?", 'Sulfuric acid', ['Hint 1', 'Hint 2']), 
        new Quizz('fill in the blanks', ['96.5', '3.5', '6.4'], "Venus's atmosphere is composed of about % carbon dioxide and % nitrogen.", "Venus's atmosphere is composed of about 96.5% carbon dioxide and 3.5% nitrogen.", ['Hint 1', 'Hint 2']),
        new Quizz('fill in the blanks', ['Sodium', 'Helium', 'Oxygen'], "The main component of Mercury's thin atmosphere is.", "The main component of Mercury's thin atmosphere is Sodium.", ['Hint 1', 'Hint 2'])
    ];
}

function getEarthQuizzes() {
    return [
        new Quizz('multiple choice', ['Troposphere', 'Stratosphere', 'Mesosphere'], `Which of the following atmospheric layers contains the ozone layer?`, 'Stratosphere', ['Hint 1', 'Hint 2']),
        new Quizz('multiple choice', ['Mesosphere', 'Thermosphere', 'Exosphere'], `In which atmospheric layer do auroras occur?`, 'Thermosphere', ['Hint 3', 'Hint 4']),
        new Quizz('short answer', null, "What is the most abundant element in Earth's atmosphere?", 'Nitrogen', ['Hint 1', 'Hint 2']),
        new Quizz('short answer', null, "What is the approximate length of Earth's orbital period in days?", '365', ['Hint 1', 'Hint 2']), 
        new Quizz('fill in the blanks', ['150', '66', '123'], "Earth's mean distance from the Sun is approximately million kilometers.", "Earth's mean distance from the Sun is approximately 150 million kilometers.", ['Hint 1', 'Hint 2']),
        new Quizz('fill in the blanks', ['Oxygen', 'Helium', 'Silicon'], "The most abundant elements in Earth's crust are and.", "The most abundant elements in Earth's crust are Oxygen and Silicon.", ['Hint 1', 'Hint 2'])
    ];
}

function getMarsQuizzes() {
    return [
        new Quizz('multiple choice', ['Vast canyon system', 'Volcanic plateau', 'Massive oceans'], `Which of the following features is NOT found on Mars?`, 'Massive oceans', ['Hint 1', 'Hint 2']),
        new Quizz('multiple choice', ['January 2021', 'February 2021', 'March 2021'], `The NASA rover Perseverance landed on Mars in which month and year?`, 'February 2021', ['Hint 3', 'Hint 4']),
        new Quizz('short answer', null, "What is the name of Mars' largest canyon system?", 'Valles Marineris', ['Hint 1', 'Hint 2']),
        new Quizz('short answer', null, "Which of the following Mars rovers discovered evidence of past water on the Martian surface?", 'Opportunity', ['Hint 1', 'Hint 2']), 
        new Quizz('fill in the blanks', ['Explosive', 'Red', 'Strange'], "Mars is often called the Planet due to its reddish appearance.", "Mars is often called the Red Planet due to its reddish appearance.", ['Hint 1', 'Hint 2']),
        new Quizz('fill in the blanks', ['Olympus Mons', 'Tharsis', 'Corona'], "The largest volcano in the solar system, located on Mars, is called.", "The largest volcano in the solar system, located on Mars, is called Olympus Mons.", ['Hint 1', 'Hint 2'])
    ];
}

function getSunQuizzes() {
    return [
        new Quizz('alphabet soup', null, `What element makes up most of the Sun's mass?`, 'Hydrogen', ['Hint 1', 'Hint 2']),
        new Quizz('alphabet soup', null, `Name the outermost layer of the Sun`, 'Corona', ['Hint 1', 'Hint 2']),
        new Quizz('alphabet soup', null, `Which planet is closest to the Sun?`, 'Mercury', ['Hint 1', 'Hint 2']),
        new Quizz('alphabet soup', null, `What phenomenon occurs when the Sun's corona interacts with Earth's atmosphere?`, 'Auroras', ['Hint 1', 'Hint 2']),

    ];
}


function getJupiterQuizzes() {
    return [
        new Quizz('multiple choice', ['White and red', 'White and brown', 'White and blue'], `What are the primary colors of Jupiter's cloud bands?`, 'White and brown', ['Hint 1', 'Hint 2']),
        new Quizz('multiple choice', ['Rocky', 'Icy', 'Metallic'], `Which of these best describes Jupiter's core?`, 'Metallic', ['Hint 3', 'Hint 4']),
        new Quizz('short answer', null, "What is the primary factor contributing to Jupiter's strong magnetic field?", 'Fast rotation', ['Hint 1', 'Hint 2']),
        new Quizz('short answer', null, "Which spacecraft discovered Jupiter's ring system?", 'Voyager 1', ['Hint 1', 'Hint 2']), 
        new Quizz('fill in the blanks', ['20', '2', '8'], "Jupiter's magnetic field is approximately times stronger than Earth's.", "Jupiter's magnetic field is approximately 20 times stronger than Earth's.", ['Hint 1', 'Hint 2']),
    ];
}

function getSaturnQuizzes() {
    return [
        new Quizz('multiple choice', ['3 degrees', '27 degrees', '45 degrees'], `What is the approximate axial tilt of Saturn?`, '27 degrees', ['Hint 1', 'Hint 2']),
        new Quizz('multiple choice', ['10.7 hours', '24 hours', '32 hours'], `What is the approximate length of Saturn's day in Earth hours?`, '10.7 hours', ['Hint 3', 'Hint 4']),
        new Quizz('short answer', null, "What is the term used to describe the shape of Saturn?", 'Oblate spheroid', ['Hint 1', 'Hint 2']),
        new Quizz('short answer', null, "What is the primary component of Saturn's rings?", 'Ice', ['Hint 1', 'Hint 2']), 
        new Quizz('fill in the blanks', ['second', 'first', 'fourth'], "Saturn is the largest planet in our solar system.", "Saturn is the second largest planet in our solar system.", ['Hint 1', 'Hint 2']),
        new Quizz('fill in the blanks', ['Cassini', 'Tharsis', 'Corona'], "The largest gap in Saturn's rings is called the Division.", "The largest gap in Saturn's rings is called the Cassini Division.", ['Hint 1', 'Hint 2'])
    ];
}

function getUranusQuizzes() {
    return [
        new Quizz('multiple choice', ['29.5 years', '84 years', '165 years'], `How many Earth years it takes for Uranus to complete one orbit around the Sun?`, '84 years', ['Hint 1', 'Hint 2']),
        new Quizz('short answer', null, "What is the most abundant element in Uranus's atmosphere?", 'Hydrogen', ['Hint 1', 'Hint 2']),
        new Quizz('short answer', null, "What is responsible for the blue-green color of Uranus?", 'Methane', ['Hint 1', 'Hint 2']), 
        new Quizz('fill in the blanks', ['17.2', '34', '12'], "The approximate length of Uranus's day in Earth hours is.", "The approximate length of Uranus's day in Earth hours is 17.2.", ['Hint 1', 'Hint 2']),
    ];
}

function getNeptuneQuizzes() {
    return [
        new Quizz('multiple choice', ['Water ice', 'Methane', '45 degrees'], `Which of the following is responsible for the blue color of Neptune?`, 'Methane', ['Hint 1', 'Hint 2']),
        new Quizz('short answer', null, "What is the name of the largest storm observed in Neptune's atmosphere?", 'Great Dark Spot', ['Hint 1', 'Hint 2']),
        new Quizz('short answer', null, "What is the term used to describe the extreme wind speeds observed in Neptune's atmosphere?", 'Jet streams', ['Hint 1', 'Hint 2']), 
        new Quizz('fill in the blanks', ['second', 'third', 'fourth'], "Neptune is the largest planet in our solar system.", "Neptune is the fourth largest planet in our solar system.", ['Hint 1', 'Hint 2']),
    ];
}

function getMeteorQuizzes() {
    return [
        new Quizz('alphabet soup', null, `The largest asteroid in the solar system.`, 'Ceres', ['Hint 1', 'Hint 2']),
        new Quizz('alphabet soup', null, `Rocky and metallic objects primarily found between Mars and Jupiter`, 'Asteroids', ['Hint 1', 'Hint 2']),
        new Quizz('alphabet soup', null, `A comet's glowing head, composed of dust and gas.`, 'Coma', ['Hint 1', 'Hint 2']),
        new Quizz('alphabet soup', null, `The center of a comet, made of ice and dust.`, 'Nucleus', ['Hint 1', 'Hint 2'])

    ];
}