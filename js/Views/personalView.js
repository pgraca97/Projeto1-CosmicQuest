import * as User from "/js/Model/User.js";
import { characterColor } from "/js/common.js";

const container = document.querySelector('#content');
console.log(container);

let clickedButton = 'dashboard';
let viewing = 'DASHBOARD';

// PERSONAL DASHBOARD
//Get the personal-dashboard image and add a mouse enter event tot change its src 
document.querySelector('.personal-dashboard').addEventListener('mouseenter', function() {
    document.querySelector('.personal-dashboard').src = "/assets/img/GUI/Personal Dashboard hover.png";
});
// Now a mouse leave event to get the image to its original src
document.querySelector('.personal-dashboard').addEventListener('mouseleave', function() {
        document.querySelector('.personal-dashboard').src = "/assets/img/GUI/Personal Dashboard.png";
});
//Click event to set the clickedButton to stats
document.querySelector('.personal-dashboard').addEventListener('click', function() {
    changeContent('dashboard', 'DASHBOARD')
    const title = document.querySelector(".title");
    const bannerContainer = document.querySelector(".title-banner-container");
    
    // Get the width of the title
    const titleWidth = title.getBoundingClientRect().height;
  
    // Set the width of the banner container to match the title's width, plus some extra padding
    const bannerWidth = titleWidth + 45;  // adjust the added value to your needs
    bannerContainer.style.width = `${bannerWidth}px`;
});


//STATS DASHBOARD
// Get the stats-dashboard image and add a mouse enter event tot change its src 
document.querySelector('.stats-dashboard').addEventListener('mouseenter', function() {
    document.querySelector('.stats-dashboard').src = "/assets/img/GUI/Stats hover.png";
});
// Now a mouse leave event to get the image to its original src
document.querySelector('.stats-dashboard').addEventListener('mouseleave', function() {
    document.querySelector('.stats-dashboard').src = "/assets/img/GUI/Stats.png";
});
//Click event to set the clickedButton to stats
document.querySelector('.stats-dashboard').addEventListener('click', function() {
    changeContent('stats', 'STATS')
});


//TROPHY DASHBOARD
// Get the trophy-dashboard image and add a mouse enter event tot change its src 

document.querySelector('.trophy-dashboard').addEventListener('mouseenter', function() {
    document.querySelector('.trophy-dashboard').src = "/assets/img/GUI/Trophy hover.png";
});
// Now a mouse leave event to get the image to its original src
document.querySelector('.trophy-dashboard').addEventListener('mouseleave', function() {
    document.querySelector('.trophy-dashboard').src = "/assets/img/GUI/Trophy.png";
});


// SETTING DASHBOARD
// Get the setting-dashboard image and add a mouse enter event tot change its src 
document.querySelector('.settings-dashboard').addEventListener('mouseenter', function() {
    document.querySelector('.settings-dashboard').src = "/assets/img/GUI/Settings hover.png";
});
// Now a mouse leave event to get the image to its original src
document.querySelector('.settings-dashboard').addEventListener('mouseleave', function() {
    document.querySelector('.settings-dashboard').src = "/assets/img/GUI/Settings.png";
});

//LEADERBOARD DASHBOARD
// Get the leaderboard-dashboard image and add a mouse enter event tot change its src 
document.querySelector('.leaderboard-dashboard').addEventListener('mouseenter', function() {
    document.querySelector('.leaderboard-dashboard').src = "/assets/img/GUI/Leaderboard hover.png";
});
// Now a mouse leave event to get the image to its original src
document.querySelector('.leaderboard-dashboard').addEventListener('mouseleave', function() {
    document.querySelector('.leaderboard-dashboard').src = "/assets/img/GUI/Leaderboard.png";
});

//Put the alteration of the container innerHTML in a function

function changeContent(clickedButton, viewing) {
container.innerHTML = '';
container.innerHTML += `<div class="title-banner-container ${clickedButton} pt-5">
<div class="title">${viewing}</div>
</div>

<div class="character-container">
<img class="arrow left-arrow" src="/assets/img/Glass_Arrow_Small.png" alt="Left arrow">
<div class="user-character-container">
    <div class="user-character"><img class="user-character-img" src="" alt="User img"></div>
</div>

<img class="arrow right-arrow" src="/assets/img/Glass_Arrow_Small.png" alt="Right arrow">
</div>
<form id="personal-form" action="">
<div id="form-fields" class="form-group gap-1">
   <!--<label for="gameName">New Game Name</label>--> 
   <!--<div class="username-container">--> 
        <input type="text" id="username" class="form-control" placeholder="USERNAME" maxlength="20" required>
   <!-- </div>--> 

   <input type="password" id="password" class="form-control" placeholder="PASSWORD" maxlength="15" required>
   <input type="email" id="email" class="form-control" placeholder="EMAIL" maxlength="30" required>
   
    <button type="submit" class="btn btn-primary"><img class="check-mark" src="/assets/img/UI_Glass_Checkmark_Large_01a.png" alt="Right arrow"></button>
</div>

    <div class="form-group">
        <div id="error-message" class="alert alert-danger mt-3" style="display: none;"></div>
    </div>
</div>
</form>` 
};

changeContent(clickedButton, viewing);


// Function to populate form fields
function populateFormFields() {
    const user = User.getAuthenticatedUser();
    if (user) {
        document.getElementById('username').value = user.username;
        document.getElementById('password').value = user.password;
        document.getElementById('email').value = user.email;
        userCharacterColor.src = user.characterColor;
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', populateFormFields);


//Find the index of the user.characterColor in the characterColor array

const characterColorIndex = characterColor.indexOf(User.getAuthenticatedUser().characterColor);
console.log( User.getAuthenticatedUser().characterColor);
console.log(characterColorIndex);

let currentCharacterColorIndex = characterColorIndex;

const userCharacterColor = document.querySelector(".user-character img");

console.log(userCharacterColor);

// Function to update the user character color image
function updateUserCharacterColor() {
    userCharacterColor.src = characterColor[currentCharacterColorIndex];
}


// Update the image for the first time
updateUserCharacterColor();

// Handle the arrow clicks
document.querySelector('.arrow.right-arrow').addEventListener('click', function() {
    // Increase the counter
    currentCharacterColorIndex++;

    // If the counter exceeds the last index of the array, reset it to 0
    if (currentCharacterColorIndex > characterColor.length - 1) {
        currentCharacterColorIndex = 0;
    }

    // Update the image
    updateUserCharacterColor();
});

document.querySelector('.arrow.left-arrow').addEventListener('click', function() {
    // Decrease the counter
    currentCharacterColorIndex--;

    // If the counter becomes less than 0, set it to the last index of the array
    if (currentCharacterColorIndex < 0) {
        currentCharacterColorIndex = characterColor.length - 1;
    }

    // Update the image
    updateUserCharacterColor();
});


// Add event listener to the form
document.getElementById('personal-form').addEventListener('submit', function(event) {
    // Prevent the form from submitting normally
    event.preventDefault();
    
    // Get the form data
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const userCharacterColor = document.querySelector(".user-character img").src;

    // Get the authenticated user
    const user = User.getAuthenticatedUser();
    console.log(user);
    // Update the user's data
    if (user) {
        user.username = username;
        user.password = password;
        user.email = email;
        user.characterColor = userCharacterColor;
        sessionStorage.setItem('loggedUser', JSON.stringify(user));

        console.log(user);
        // Update the user in the users array
        //User.updateUser(user);
        
        // Get the message div
        const messageDiv = document.getElementById('error-message');
        
        // Update its class name and content
        messageDiv.className = 'alert alert-success mt-3';
        messageDiv.innerHTML = 'Your information has been updated successfully.';
        
        // Show the message
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 1000);
    }
});

