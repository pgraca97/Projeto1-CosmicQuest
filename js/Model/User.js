// JavaScript ES6 style of exporting and importing modules

// Global variable that will hold the user list
let users;

export class User {
    constructor(name, username, email, password, characterColor, savedGames, settings, trophies, stats) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.characterColor = characterColor;
        /*
        this.savedGames = savedGames || [];
        this.settings = settings || {sound: true, fxSound: true, subtitles: true};
        this.trophies = trophies || [];
        this.stats = stats || {completedRooms: 0, accuracy: 0, points: 0};
        */
    }
    //(other methods like addSavedGame(), updateSettings() etc)
}

// Initializes the user list
export function initUsers() {
    // Load the users from localStorage or start with an empty array
    users = localStorage.users ? JSON.parse(localStorage.users) : [];
}

// Adds a new user
export function addUser(name, username, email, password, characterColor) {
    // Check if a user with the same username already exists
    const existingUser = users.some(user => user.username === username);
    if (existingUser) {
        // Throw an error if the user already exists
        throw new Error(`User with the username ${username} already exists`);
    } else {
        // Add the new user to the users list
        users.push(new User(name, username, email, password, characterColor));
        // Save the users list to localStorage
        localStorage.users = JSON.stringify(users);
    }
}

// Log in function
export function login(username, password) {
    // Search for the user with the given username and password
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        sessionStorage.setItem('loggedUser', JSON.stringify(user));
        return true; // Signal that the login was successful
    } else {
        // Throw an error if the login is invalid
        throw new Error('Invalid login');
    }
}

// Log out function
export function logout() {
    // Remove the authenticated user from the session storage
    sessionStorage.removeItem('loggedUser');
}

// Function to check if a user is logged in
export function isLoggedIn() {
    return !!sessionStorage.getItem('loggedUser'); // !! is used to convert a value to a boolean. If the value exists and is truthy, it returns true. If the value does not exist or is falsy, it returns false.
}

// Function to get the authenticated user
export function getAuthenticatedUser() {
    // Return the authenticated user from the session storage, if it exists
    return JSON.parse(sessionStorage.getItem('loggedUser'));
}
