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
        this.isAdmin = false; 
        this.isBlocked = false;
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
    if (user && user.isBlocked) {
        throw new Error('This account has been blocked');
    } else if (user) {
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

export function isAuthenticatedAdmin() {
    const currentUser = this.getAuthenticatedUser();
    return currentUser && currentUser.isAdmin;
  };

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

export function blockUser(username) {
    // Get the user
    let user = getUserFromLocalStorage(username);
    
    // Set isBlocked to true
    user.isBlocked = true;
    
    // Update the user
    updateUser(user);
    
    // If the blocked user is the currently logged in user, log them out and redirect to index.html
    if (isLoggedIn() && getAuthenticatedUser().username === username) {
      logout();
      window.location.href = 'index.html';
    }
  }
  
  export function deleteUser(username) {
    // Get the users array
    let users = JSON.parse(localStorage.getItem('users'));
  
    // Find the index of the user
    let index = users.findIndex(user => user.username === username);
    
    // Remove the user from the array
    users.splice(index, 1);
    
    // Update the users in local storage
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  export function unblockUser(username) {
    // Get the user
    let user = getUserFromLocalStorage(username);
    
    // Set isBlocked to false
    user.isBlocked = false;
    
    // Update the user
    updateUser(user);
  }
  