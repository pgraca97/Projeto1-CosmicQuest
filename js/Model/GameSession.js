// In GameSession class, add a timeLimit property
class GameSession {
    constructor(gameName, difficulty) {
        this.gameName = gameName;
        this.difficulty = difficulty;
        this.rooms = Room.createRooms();
        this.progress = {}; // Progress will track which challenges have been completed
        this.gameId = new Date().getTime(); // Unique ID for this game session, using the current timestamp for simplicity
        this.timeLimit = this.setTimeLimit(difficulty); // Time limit for the session
    }

    // Method to set the time limit based on difficulty
    setTimeLimit(difficulty) {
        switch(difficulty) {
            case 'Stellar Novice':
                return 120;
            case 'Cosmic Explorer':
                return 90;
            case 'Galactic Master':
                return 60;
            default:
                return 120;
        }
    }

    // ... More methods here to manage the game session
}



// Function to generate the list of rooms 
function generateRooms() {
    const room1 = new Room(1, createPlanetChallenges());
    const room2 = new Room(2, createPlanetChallenges());
    return [room1, room2];
}

/*

{
    room1: {
        mars: [true, false, true],  // Each boolean represents whether a challenge has been completed
        venus: [false, true]
    },
    room2: {
        jupiter: [false, false],
        saturn: [true]
    }
    // And so on for all rooms and planets
}

*/
