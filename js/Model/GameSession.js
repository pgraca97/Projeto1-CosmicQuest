export default class GameSession {
    constructor(gameName, difficulty) {
        this.gameName = gameName;
        this.difficulty = difficulty;
        this.roomOneProgress = 0;
        this.roomTwoProgress = 0;
        this.roomOnePoints = 0;  // initialize roomOnePoints
        this.roomTwoPoints = 0;  // initialize roomTwoPoints
        this.currentRoom = null;
        this.celestialBodies = initializeCelestialBodies(true);
        this.timeLimit = GameSession.calculateTimeLimit(difficulty);
        this.coins = 0; //intialize coins
        this.tokenQuantities =  { 'Hints': 0, 'Time manipulation': 0, 'Power-ups': 0 };
        this.playedTime = 0; //intialize time
    }


    static calculateTimeLimit(difficulty) {
        let minutes;
        switch (difficulty) {
            case 'Stellar Novice':
                minutes = 1;
                break;
            case 'Cosmic Explorer':
                minutes = 20;
                break;
            case 'Galactic Master':
                minutes = 15;
                break;
            default:
                throw new Error(`Unexpected difficulty level: ${difficulty}`);
        }

        return {
            total: 60 * minutes,
            remaining: 60 * minutes,
            startTime: null
        };
    }
}


export function updateGameSessionState(gameSession) {
    // Update progress
    gameSession.roomOneProgress = window.EscapeRooms.RoomOne.progressBar;
    gameSession.roomTwoProgress = window.EscapeRooms.RoomTwo.progressBar;
    // Calculate points
    gameSession.roomOnePoints = calculatePoints(gameSession.roomOneProgress, gameSession.timeLimit.total, gameSession.playedTime, gameSession.roomOnePoints);
    gameSession.roomTwoPoints = calculatePoints(gameSession.roomTwoProgress, gameSession.timeLimit.total, gameSession.playedTime, gameSession.roomTwoPoints);
    // Update current room
    gameSession.currentRoom = localStorage.getItem('currentRoom');
    // Update celestial bodies
    gameSession.celestialBodies = initializeCelestialBodies(false);
    // Update remaining time
    gameSession.timeLimit.remaining = window.EscapeRooms.timeLimit.remaining;
    gameSession.playedTime += gameSession.timeLimit.total - gameSession.timeLimit.remaining;
    console.log(gameSession);
}

// Function to calculate points based on progress and time
export function calculatePoints(progress, totalTime, playedTime, roomPoints) {
    let remainingTime = totalTime - playedTime;
    const halfTime = totalTime / 2;

    // If the player has not completed the room, points are awarded based on the progress made
    if (progress < 100) {
        if (progress >= 75) {
            roomPoints += 7.5;
        } else if (progress >= 50) {
            roomPoints += 5;
        } else if (progress >= 25) {
            roomPoints += 2.5;
        }
    } else {
        // If the player has completed the room, points are calculated based on the remaining time
        roomPoints += remainingTime;
        if (playedTime <= halfTime) {
            roomPoints *= 2;  // double the points if completed within half the total time
        } 
    }
    return roomPoints;
}

function     initializeCelestialBodies(newSession) {
    // If playedTime is 0, it's a new game session, so initialize celestial bodies from original data.
          // Otherwise, it's a resumed game session, so load celestial bodies from localStorage.
          const celestialBodiesNames = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Sun', 'Meteor Showers'];
          let celestialBodies = [];
          if (newSession) {
            console.log('Initializing celestial bodies from original data');
  
      for (let name of celestialBodiesNames) {
          let celestialBody = JSON.parse(localStorage.getItem(name));
  
          let newCelestialBody = {
              planet: celestialBody.planet,
              notes: '',
              researchTerminal: {
                  General: '',
                  Geography: '',
                  Atmosphere: '',
                  Climate: '',
                  Moons: '',
                  History: '',
                  Discovery: '',
                  Mythology: '',
                  Missions: ''
              },
              challenges: {}
          };
  
          for (let challengeType in celestialBody.challenges) {
              newCelestialBody.challenges[challengeType] = celestialBody.challenges[challengeType].map(challenge => ({
                  isAnsweredCorrectly: null
              }));
          }
  
          celestialBodies.push(newCelestialBody);
      }
  
          } else {
            console.log('Initializing celestial bodies from localStorage');
              for (let name of celestialBodiesNames) {
                  let celestialBody = JSON.parse(localStorage.getItem(name));
          
                  let newCelestialBody = {
                      planet: celestialBody.planet,
                      notes: celestialBody.notes,
                      researchTerminal: celestialBody.researchTerminal,
                      challenges: {}
                  };
          
                  for (let challengeType in celestialBody.challenges) {
                      newCelestialBody.challenges[challengeType] = celestialBody.challenges[challengeType].map(challenge => ({
                          isAnsweredCorrectly: challenge.isAnsweredCorrectly
                      }));
                  }
          
                  celestialBodies.push(newCelestialBody);
              }
          }
          
      return celestialBodies;
      }

      export function restartGameSession(gameSession) {
        console.log('Restarting game session');
        console.log(window.EscapeRooms.timeLimit)
        gameSession.roomOneProgress = 0;
        window.EscapeRooms.RoomOne.progressBar = gameSession.roomOneProgress;
        gameSession.roomTwoProgress = 0;
        window.EscapeRooms.RoomTwo.progressBar = gameSession.roomTwoProgress;
        gameSession.roomOnePoints = 0;  
        gameSession.roomTwoPoints = 0;  
        gameSession.currentRoom = null;
        gameSession.celestialBodies = initializeCelestialBodies(true);
        gameSession.timeLimit = GameSession.calculateTimeLimit(gameSession.difficulty);
        window.EscapeRooms.timeLimit = gameSession.timeLimit;  // Update timeLimit on window.EscapeRooms
        console.log(gameSession.timeLimit);
        console.log(gameSession.celestialBodies);
    
        gameSession.coins = 0; // reset coins
        gameSession.tokenQuantities =  { 'Hints': 0, 'Time manipulation': 0, 'Power-ups': 0 };
        gameSession.playedTime = 0; // reset played time
        console.log(gameSession);
    }
    