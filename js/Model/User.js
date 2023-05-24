import * as GameSession from "/js/Model/GameSession.js";

// Global variable that will hold the user list
let users = [];


export class User {
    constructor(name, username, email, password, characterColor, savedGames = [], settings = {sound: true, fxSound: true, subtitles: true}) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.characterColor = characterColor; // E.g. 'blue', 'red', etc.
        this.characterPng = this.setCharacterPng(characterColor); // Set the corresponding PNG based on the chosen color
        this.gameSessions = []; // Each game session is a GameSession object
        this.settings = settings;
        this.trophies = [
            {
                name: 'NOVICE ASTRONAUT',
                description: 'Complete Room 1',
                isEarned: false,
                earnedImage: 'path/to/earned/image.png',
                notEarnedImage: 'path/to/not/earned/image.png'
            },
            {
                name: 'ACCURACY ACE',
                description: 'Solve both rooms with 100% accuracy',
                isEarned: false,
                earnedImage: 'path/to/earned/image.png',
                notEarnedImage: 'path/to/not/earned/image.png'
            }
            // Add as many trophies as you need
        ];
    }

    // Initialize the new game sessions
    initGameSessions() {
    // Load the games from localStorage or start with an empty array
    User.gameSessions = localStorage.gameSessions? JSON.parse(localStorage.gameSessions) : [];
}

// Adds a new game session
    addGameSession(gameName, difficulty) {
    const existingGame = User.gameSessions.some(game => game.gameName === gameId);
    if (existingGame) {
        throw new Error(`Game with the id ${gameName} already exists`);
    } else {
        // If the length of the game sessions array is less than 3, add a new game session, if it's 3 don't add a new gameSession
        if (User.gameSessions.length < 3) {
            User.gameSessions.push(new GameSession(gameName, difficulty)); //???
            localStorage.gameSessions = JSON.stringify(User.gameSessions);
        } else {
            throw new Error('You have reached the maximum number of game sessions. Please delete an existing game before starting a new one.');
        }        
    }
}
    
    //Method to render the game sessions and present them in the CONTINUE container
    renderGameSessions() {
        const gameSessionsContainer = document.getElementById('game-sessions-container');
        gameSessionsContainer.innerHTML = '';
        User.gameSessions.forEach(gameSession => {
            const gameSessionContainer = document.createElement('div');
            gameSessionContainer.classList.add('game-session-container');
            gameSessionContainer.innerHTML = `
                <div class="game-session-name">${gameSession.gameName}</div>
                <div class="game-session-difficulty">${gameSession.difficulty}</div>
            `;
            gameSessionsContainer.appendChild(gameSessionContainer);
        });
    }

    /*
    updateGameSession(gameId, updatedGameSession) {
        const gameIndex = this.gameSessions.findIndex(game => game.gameId === gameId);
        
        if (gameIndex === -1) {
            throw new Error('The game does not exist.');
        }

        this.gameSessions[gameIndex] = updatedGameSession;
    }*/
    
    setCharacterPng(color) {
        // Object that maps color names to PNG paths
        const pngColors = {
            blue: 'path/to/blue.png',
            red: 'path/to/red.png',
            // Add as many colors as you have
        };
        
        return pngColors[color];
    }
    
    // Method to earn a trophy
    earnTrophy(trophyName) {
        const trophy = this.trophies.find(trophy => trophy.name === trophyName);
        if (trophy) {
            trophy.isEarned = true;
        }
    }

    // Method to check if a trophy is earned
    isTrophyEarned(trophyName) {
        const trophy = this.trophies.find(trophy => trophy.name === trophyName);
        return trophy ? trophy.isEarned : false;
    }
}

// Standalone functions related to the User class

// Initializes the user list
export function initUsers() {
    // Load the users from localStorage or start with an empty array
    users = localStorage.users ? JSON.parse(localStorage.users) : [];
}

// Adds a new user
export function addUser(name, username, email, password, characterColor) {
    const existingUser = users.some(user => user.username === username);
    if (existingUser) {
        throw new Error(`User with the username ${username} already exists`);
    } else {
        users.push(new User(name, username, email, password, characterColor));
        localStorage.users = JSON.stringify(users);
    }
}

// Log in function
export function login(username, password) {
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        sessionStorage.setItem('loggedUser', JSON.stringify(user));
        return true; // Signal that the login was successful
    } else {
        throw new Error('Invalid login');
    }
}

// Log out function
export function logout() {
    sessionStorage.removeItem('loggedUser');
}

// Function to check if a user is logged in
export function isLoggedIn() {
    return !!sessionStorage.getItem('loggedUser'); //!! is used to convert a vlue to a boolean. If the value exists and is truthy, it returns true. If the value does not exist or is falsy, it returns false.
}

// Function to get the authenticated user
export function getAuthenticatedUser() {
    return JSON.parse(sessionStorage.getItem('loggedUser'));
}

/*
export function updateUserInSessionStorage(updatedUser) {
    sessionStorage.setItem('loggedUser', JSON.stringify(updatedUser));
}
*/


export function updateUser(updatedUser) {
    const userToUpdate = users.find(user => user.username === updatedUser);
    console.log(userToUpdate);
    return userToUpdate
    // Replace the user at the found index with the updated user
    //users[userIndex] = updatedUser;

    console.log(userToUpdate);
    // Update the users in local storage
    //localStorage.users = JSON.stringify(users);
}


