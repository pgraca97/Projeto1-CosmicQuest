import * as User from "/js/Model/User.js";
import GameSession from "/js/Model/GameSession.js";


import * as PlanetSet from "/js/Model/PlanetSet.js";

// Get the modal
const modal = document.getElementById("exitModal");
console.log(modal);
// Get the button that opens the modal
const btn = document.getElementById("home-btn");
console.log(btn);
// Get the elements that close the modal
const confirmExit = document.getElementById("btnYes");
const cancelExit = document.getElementById("btnNo");

const modelText = document.querySelector('#modalText');
// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
    modelText.innerText = 'Exiting to the home page...';
}

// When the user clicks on "Yes", redirect to index.html
confirmExit.onclick = function() {
    window.location.href = "/index.html";
}

// When the user clicks on "No", close the modal
cancelExit.onclick = function() {
    modal.style.display = "none";
}



/*
window.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector(".title");
    const bannerContainer = document.querySelector(".title-banner-container");
    
    // Get the width of the title
    const titleWidth = title.getBoundingClientRect().width;

    // Set the width of the banner container to match the title's width, plus some extra padding
    const bannerWidth = titleWidth + 35;  // adjust the added value to my needs
    bannerContainer.style.width = `${bannerWidth}px`;
});*/

const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
const subtitle = document.querySelector('.subtitle');
const difficultyLevels = ['Stellar Novice', 'Cosmic Explorer', 'Galactic Master'];

let currentIndex = 0;
function updateSubtitle() {
    const difficulty = difficultyLevels[currentIndex];

    // Update the subtitle, content, and image
    subtitle.textContent = difficulty;

    // If you have an img element for the image:
    // instructionImageElement.src = instruction.image;

    // Update arrow visibility
    if (currentIndex === 0) {
        // Only show the right arrow
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'block';
    } else if (currentIndex === difficultyLevels.length - 1) {
        // Only show the left arrow
        leftArrow.style.display = 'block';
        rightArrow.style.display = 'none';
    } else {
        // Show both arrows
        leftArrow.style.display = 'block';
        rightArrow.style.display = 'block';
    }
}

leftArrow.addEventListener('click', () => {
    console.log('left arrow clicked');
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = 0; // Prevent the index from going negative
    }
    updateSubtitle();
});

rightArrow.addEventListener('click', () => {
    console.log('right arrow clicked');
    currentIndex++;
    if (currentIndex > difficultyLevels.length - 1) {
        currentIndex = difficultyLevels.length - 1; // Prevent the index from going past the end of the array
    }
    updateSubtitle();
});

// Initial update
updateSubtitle();

const addGameSession = (gameSession, userSessionStorage) => {
    const existingGame = userSessionStorage.gameSessions.some(game => game.gameName === gameSession.gameName);
    if (existingGame) {
        throw new Error(`Game with the name ${gameSession.gameName} already exists`);
    } else {
        // If the length of the game sessions array is less than 3, add a new game session, if it's 3 don't add a new gameSession
        if (userSessionStorage.gameSessions.length < 3) {
            userSessionStorage.gameSessions.push(gameSession);
            // Save the gameName as the active game session
            localStorage.setItem('activeGameSession', gameSession.gameName);
            localStorage.setItem('currentRoom', 'RoomOne');
        } else {
            throw new Error('You have reached the maximum number of game sessions. Please delete an existing game before starting a new one.');
        }        
    }
}


document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
 User.initUsers();
    // Get the values from the form
    const gameName = document.querySelector('#gameName').value;
    const difficulty = difficultyLevels[currentIndex];


    // Get the currently logged in user
    const userSessionStorage = User.getAuthenticatedUser();
    const userLocalStorage = User.getUserFromLocalStorage(userSessionStorage.username);
    console.log(userSessionStorage);
    console.log(userLocalStorage);


        // Create a new game session
        PlanetSet.initializeLocalStorage();
        let gameSession = new GameSession(gameName, difficulty);

        addGameSession(gameSession, userSessionStorage );
        console.log(gameSession);
        // Add the new game session to the user's saved games


        User.updateUser(userSessionStorage);

        // If the game was added successfully, clear any existing error message
        document.querySelector('#error-message').style.display = 'none';
        // Locate the user to the rooms html after 1 second
        setTimeout(() => {
            location.href = '../html/rooms.html';
        }, 3000);
    /*} catch (error) {
        // If an error was thrown, display it in the error message div
        const errorMessage = document.querySelector('#error-message');
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    }*/
});

