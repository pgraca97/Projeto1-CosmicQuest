
import { characterColor } from "/js/common.js";


// Global variable that will hold the user list
let users = localStorage.getItem('users')? JSON.parse(localStorage.getItem('users')) : [];


export default class User {
    constructor(username, email, password, characterColor, settings = {sound: true, fxSound: true}) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.characterColor = characterColor; // E.g. 'blue', 'red', etc.
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
    users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    return users;
}

// Adds a new user
export function addUser( username, email, password, characterColor) {
    const existingUser = users.some(user => user.username === username);
    if (existingUser) {
        throw new Error(`User with the username ${username} already exists`);
    } else {
        const newUser = new User(username, email, password, characterColor);
        users.push(newUser);
        // Save the entire users array to local storage
        localStorage.setItem('users', JSON.stringify(users));
    }
}


// Log in function
export function login(username, password) {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = storedUsers.find(user => user.username === username && user.password === password);
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

// Function to get a user from local storage
export function getUserFromLocalStorage(username) {
    const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    const user = users.find(user => user.username === username);
    return user ? user : null;
}

export function updateUser( updatedUser, oldUsername = null) {
    // Update the user in the users array

    let userIndex 
    if (oldUsername) {
        userIndex = users.findIndex(user => user.username === oldUsername);
    } else {
        userIndex = users.findIndex(user => user.username === updatedUser.username);
    };

    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
    } else {
        throw new Error(`User ${updatedUser.username} not found`);
    }

    // Update the user in session storage if it's the currently logged in user
    if (getAuthenticatedUser() && getAuthenticatedUser().username === updatedUser.username || oldUsername ) {
        console.log('Updating user in session')
        sessionStorage.setItem('loggedUser', JSON.stringify(updatedUser));
    }

    // Update the user in local storage
    localStorage.setItem('users', JSON.stringify(users));
}


export function updateGameSession(username, gameSession) {
    // Get the stored users
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Find the index of the user to update
    const userIndex = users.findIndex(user => user.username === username);

    if (userIndex === -1) {
        throw Error('User not found');
    }

    // Find the index of the game session to update
    const gameSessionIndex = users[userIndex].gameSessions.findIndex(session => session.gameName === gameSession.gameName);

    if (gameSessionIndex === -1) {
        throw Error('Game session not found');
    }

    // Update the game session
    users[userIndex].gameSessions[gameSessionIndex] = gameSession;
    console.log(users[userIndex]);
    // Update the user with updateUser
    updateUser(users[userIndex]);
}

