import * as User from "/js/Model/User.js";

window.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector(".title");
    const bannerContainer = document.querySelector(".title-banner-container");
    
    // Get the width of the title
    const titleWidth = title.getBoundingClientRect().width;

    // Set the width of the banner container to match the title's width, plus some extra padding
    const bannerWidth = titleWidth + 35;  // adjust the added value to my needs
    bannerContainer.style.width = `${bannerWidth}px`;
});

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
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = 0; // Prevent the index from going negative
    }
    updateSubtitle();
});

rightArrow.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex > difficultyLevels.length - 1) {
        currentIndex = difficultyLevels.length - 1; // Prevent the index from going past the end of the array
    }
    updateSubtitle();
});

// Initial update
updateSubtitle();


document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    User.initGameSessions();
    // Get the values from the form

    const gameName = document.querySelector('#gameName').value;
    const difficulty = difficultyLevels[currentIndex];
    
    // Get the currently logged in user
    const userSessionStorage = User.getAuthenticatedUser();
   // Get the user in the local storage 
    const userLocalStorage = User.updateUser(userSessionStorage.username)

    try {
        // Add the new game to the user's saved games
        userSessionStorage.addGameSession(gameName, difficulty);
        userLocalStorage.addGameSession(gameName, difficulty);


        // If the game was added successfully, clear any existing error message
        document.querySelector('#error-message').style.display = 'none';
    } catch (error) {
        // If an error was thrown, display it in the error message div
        const errorMessage = document.querySelector('#error-message');
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    }
});

