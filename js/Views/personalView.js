import * as User from "/js/Model/User.js";
import { characterColor, setWidth } from "/js/common.js";

const container = document.querySelector('#content');





//STATS DASHBOARD

const statTitles = [
    "COMPLETION TIME", 
    "QUICKEST ESCAPE", // This could be the fastest time in which a user has completed Cosmic Quest.
    "PLANETARY PRO", // This could represent the number of correctly answered questions about the solar system.
    /* "SOLAR SYSTEM MASTER", // Whether the user has completed everything in Cosmic Quest.
   "UNSTOPPABLE LEARNER", // This could represent the number of continuous days the user has played the game.
    "ASTRONOMY ACE", // This could represent the number of correct answers to questions specifically about stars, planets, moons etc.
    "ALIEN ENTHUSIAST", // This could represent the number of correct answers to questions specifically about extraterrestrial life or theories. */
];

let currentIndex = 0;

// Get the stats-dashboard image and add a mouse enter event tot change its src 
document.querySelector('.stats-dashboard').addEventListener('mouseenter', function() {
    document.querySelector('.stats-dashboard').src = "/assets/img/GUI/Stats hover.png";
});
// Now a mouse leave event to get the image to its original src
document.querySelector('.stats-dashboard').addEventListener('mouseleave', function() {
    document.querySelector('.stats-dashboard').src = "/assets/img/GUI/Stats.png";
});
document.querySelector('.stats-dashboard').addEventListener('click', function() {

    container.classList.remove('leaderboard-dashboard');
    container.classList.remove('settings-dashboard');
    container.classList.remove('trophy-dashboard');


    document.querySelector('.stats-dashboard').src = "/assets/img/GUI/Stats.png";
    container.classList.add('stats-dashboard');
    container.innerHTML = statsDashboardHtml;
    setWidth(55);
    document.querySelector('.arrow.right-arrow').addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % statTitles.length;
        console.log(currentIndex);
        document.querySelector('.subtitle').innerHTML = statTitles[currentIndex];
    });
    
    document.querySelector('.arrow.left-arrow').addEventListener('click', function() {
        currentIndex--;
        if (currentIndex < 0) currentIndex = statTitles.length - 1;
        document.querySelector('.subtitle').innerHTML = statTitles[currentIndex];
    });
  });
  

const statsDashboardHtml = `
<div class="title-banner-container pt-5">
  <div class="title">Stats</div>
</div>

<div class="subtitle-container">
  <img class="arrow left-arrow" src="/assets/img/Glass_Arrow_Small.png" alt="Left arrow">
  
  <div class="subtitle">${statTitles[currentIndex]}</div> 

  <img class="arrow right-arrow" src="/assets/img/Glass_Arrow_Small.png" alt="Right arrow">
</div>

<div id="stats-content">
  ROOM 1: 12 min<br>
  ROOM 2: 12 min<br>
  (time taken to finish each room)
</div>`;



//TROPHY DASHBOARD
// Get the trophy-dashboard image and add a mouse enter event tot change its src 

document.querySelector('.trophy-dashboard').addEventListener('mouseenter', function() {
    document.querySelector('.trophy-dashboard').src = "/assets/img/GUI/Trophy hover.png";
});
// Now a mouse leave event to get the image to its original src
document.querySelector('.trophy-dashboard').addEventListener('mouseleave', function() {
    document.querySelector('.trophy-dashboard').src = "/assets/img/GUI/Trophy.png";
});
document.querySelector('.trophy-dashboard').addEventListener('click', function() {

    container.classList.remove('stats-dashboard');
    container.classList.remove('leaderboard-dashboard');
    container.classList.remove('settings-dashboard');


    document.querySelector('.trophy-dashboard').src = "/assets/img/GUI/Trophy.png";

    container.classList.add('trophy-dashboard');
    trophiesDashboardHtml() 
    setWidth(95);
});

let currentPage = 0;
const trophiesPerPage = 2; // Number of trophies per page

const notEarnedImage = '/assets/img/GUI/Trophies/UI_Glass_Textfield_01a.png'
const trophies = [
  {
    name: 'Super Explorer',
    description: 'Visit all planets in the solar system',
    earned: false,
    trophyImage: '/assets/img/GUI/Trophies/icon707.png', 

  },
  {
    name: 'Super Explorer',
    description: 'Visit all planets in the solar system',
    earned: false,
    trophyImage: '/assets/img/GUI/Trophies/icon383.png', 

  },
  {
    name: 'Super Explorer',
    description: 'Visit all planets in the solar system',
    earned: false,
    trophyImage: '/assets/img/GUI/Trophies/icon232.png', 

  },
  {
    name: 'Super Explorer',
    description: 'Visit all planets in the solar system',
    earned: false,
    trophyImage: '/assets/img/GUI/Trophies/icon199.png', 

  },
  // ... more trophies
];


function trophiesDashboardHtml() {
    const start = currentPage * trophiesPerPage;
    const end = start + trophiesPerPage;
  
    const trophiesToDisplay = trophies.slice(start, end);

    let trophiesHtml = (`
    <div class="trophies-header">
        <div class="title-banner-container pt-5">
            <div class="title">TROPHIES</div>
        </div>
        <div class="trophies-pages"> 
            <img class="arrow left-arrow" src="/assets/img/Glass_Arrow_Small.png" alt="Left arrow">
                <span class="page-counter">PAGE 1</span>
            <img class="arrow right-arrow" src="/assets/img/Glass_Arrow_Small.png" alt="Right arrow">\
        </div>
    </div>
    `);
  
    for (const trophy of trophiesToDisplay) {
      trophiesHtml += `
      <div class="trophy-container">
        <div class="trophy-icons">
          <img class="trophy-image " src="${trophy.trophyImage}" alt="Trophy image">
          ${trophy.earned ? '' : `<img class="not-earned-image" src="${notEarnedImage}" alt="Not earned image">`}
        </div>
        <div class="trophy-info">
            <div class="trophy-name">${trophy.name}</div>
            <div class="trophy-description">${trophy.description}</div>
            <div class="trophy-earned">Earned: ${trophy.earned ? 'Yes' : 'No'}</div>
        </div>
      </div>`;
    }
  
    container.innerHTML = trophiesHtml;
    setWidth(95);  // Set the width after updating the HTML content

    // Update the page counter
    document.querySelector('.page-counter').textContent = `PAGE ${currentPage + 1}`;

    // Add event listeners to the navigation arrows
    document.querySelector('.left-arrow').addEventListener('click', function() {
      if (currentPage > 0) {
        currentPage--;
        trophiesDashboardHtml();
      }
    });

    document.querySelector('.right-arrow').addEventListener('click', function() {
      if (end < trophies.length) {
        currentPage++;
        trophiesDashboardHtml();
      }
    });
}


// SETTING DASHBOARD
// Get the setting-dashboard image and add a mouse enter event tot change its src 
document.querySelector('.settings-dashboard').addEventListener('mouseenter', function() {
    document.querySelector('.settings-dashboard').src = "/assets/img/GUI/Settings hover.png";
});
// Now a mouse leave event to get the image to its original src
document.querySelector('.settings-dashboard').addEventListener('mouseleave', function() {
    document.querySelector('.settings-dashboard').src = "/assets/img/GUI/Settings.png";
});
document.querySelector('.settings-dashboard').addEventListener('click', function() {

    container.classList.remove('stats-dashboard');
    container.classList.remove('leaderboard-dashboard');
    container.classList.remove('trophy-dashboard');


    document.querySelector('.settings-dashboard').src = "/assets/img/GUI/Settings.png";
    container.classList.add('settings-dashboard');
    settingsDashboardHtml();
    setWidth(95);
});

function settingsDashboardHtml() {
    container.innerHTML = (`
    <div class="title-banner-container pt-5">
      <div class="title">Settings</div>
    </div>

    <div class="settings-options">
        <div class="settings-container">
            <div class="subtitle">Sound</div>
            <div class="toggle-container">
                <img src="/assets/img/GUI/UI_Glass_Slider_01a.png" class="toggle-bar" alt="Toggle Bar">
                <img src="/assets/img/GUI/UI_Glass_Slider_Handle_01a.png" class="toggle-button" alt="Toggle Button">
            </div>
        </div>

        <div class="settings-container">
        <div class="subtitle">Sound fx</div>
            <div class="toggle-container">
            <img src="/assets/img/GUI/UI_Glass_Slider_01a.png" class="toggle-bar" alt="Toggle Bar">
            <img src="/assets/img/GUI/UI_Glass_Slider_Handle_01a.png" class="toggle-button" alt="Toggle Button">
            </div>
        </div>
      </div>
    `)

    // Get all toggle-button elements
    const toggleButtons = document.querySelectorAll('.toggle-button');
    const user = User.getAuthenticatedUser();

    // Store the user settings in an array in the same order as the toggle buttons
    const settingsArray = [user.settings.sound, user.settings.fxSound];

    // Loop through each button
    toggleButtons.forEach((button, index) => {
        // Set the button's initial position based on the corresponding user setting
        button.style.left = settingsArray[index] ? '10px' : '-10px';

        button.addEventListener('click', function() {
            // Use getComputedStyle to get the current left property
            const left = window.getComputedStyle(this).getPropertyValue('left');

            // If it's currently at -10px, set it to 10px. Otherwise, set it back to -10px
            const newState = left === '-10px' ? '10px' : '-10px';
            this.style.left = newState;

            // Update the corresponding user setting
            const settingName = index === 0 ? 'sound' : 'fxSound';
            const newValue = newState === '10px'; // true if it's currently at 10px, false if it's currently at -10

            user.settings[settingName] = newValue;
            User.updateUser(user);
        });
    });
}


//LEADERBOARD DASHBOARD
// Get the leaderboard-dashboard image and add a mouse enter event tot change its src 
document.querySelector('.leaderboard-dashboard').addEventListener('mouseenter', function() {
    document.querySelector('.leaderboard-dashboard').src = "/assets/img/GUI/Leaderboard hover.png";
});
// Now a mouse leave event to get the image to its original src
document.querySelector('.leaderboard-dashboard').addEventListener('mouseleave', function() {
    document.querySelector('.leaderboard-dashboard').src = "/assets/img/GUI/Leaderboard.png";
});
document.querySelector('.leaderboard-dashboard').addEventListener('click', function() {

    container.classList.remove('stats-dashboard');
    container.classList.remove('settings-dashboard');
    container.classList.remove('trophy-dashboard');


    document.querySelector('.leaderboard-dashboard').src = "/assets/img/GUI/Leaderboard.png";

    container.innerHTML = leaderboardDashboardHtml;
    
    container.classList.add('leaderboard-dashboard');
    setWidth(125);
});

let users = [
    {
      username: "paulo",
      email: "paulo@gmail.com",
      password: "paulo",
      characterColor: {
        src: "/assets/img/Characters/User/Salmon/Chara_Astronaut12_FullBody_Run_4Dir_6x4.png"
      },
      gameSessions: [
        {roomOnePoints: 30, roomTwoPoints: 40},
        {roomOnePoints: 50, roomTwoPoints: 60},
        {roomOnePoints: 70, roomTwoPoints: 80}
      ],
      settings: {
        sound: false, 
        fxSound: true, 
        subtitles: true
      }
    },
    {
      username: "john",
      email: "john@gmail.com",
      password: "john",
      characterColor: {
        src: "/assets/img/Characters/User/Salmon/Chara_Astronaut12_FullBody_Run_4Dir_6x4.png"
      },
      gameSessions: [
        {roomOnePoints: 10, roomTwoPoints: 20},
        {roomOnePoints: 30, roomTwoPoints: 40},
        {roomOnePoints: 50, roomTwoPoints: 60}
      ],
      settings: {
        sound: false, 
        fxSound: true, 
        subtitles: true
      }
    },
    {
      username: "mary",
      email: "mary@gmail.com",
      password: "mary",
      characterColor: {
        src: "/assets/img/Characters/User/Salmon/Chara_Astronaut12_FullBody_Run_4Dir_6x4.png"
      },
      gameSessions: [
        {roomOnePoints: 20, roomTwoPoints: 30},
        {roomOnePoints: 40, roomTwoPoints: 50},
        {roomOnePoints: 60, roomTwoPoints: 70}
      ],
      settings: {
        sound: false, 
        fxSound: true, 
        subtitles: true
      }
    }
  ];
  
  let moreUsers = [
    {
      username: "lisa",
      email: "lisa@gmail.com",
      password: "lisa",
      characterColor: {
        src: "/assets/img/Characters/User/Salmon/Chara_Astronaut12_FullBody_Run_4Dir_6x4.png"
      },
      gameSessions: [
        {roomOnePoints: 10, roomTwoPoints: 20, playedTime: 120},
        {roomOnePoints: 30, roomTwoPoints: 40, playedTime: 200},
        {roomOnePoints: 50, roomTwoPoints: 60, playedTime: 180}
      ],
      settings: {
        sound: false, 
        fxSound: true, 
        subtitles: true
      }
    },
    {
      username: "mike",
      email: "mike@gmail.com",
      password: "mike",
      characterColor: {
        src: "/assets/img/Characters/User/Salmon/Chara_Astronaut12_FullBody_Run_4Dir_6x4.png"
      },
      gameSessions: [
        {roomOnePoints: 50, roomTwoPoints: 60, playedTime: 190},
        {roomOnePoints: 70, roomTwoPoints: 80, playedTime: 210},
        {roomOnePoints: 90, roomTwoPoints: 100, playedTime: 300}
      ],
      settings: {
        sound: false, 
        fxSound: true, 
        subtitles: true
      }
    },
    {
      username: "jane",
      email: "jane@gmail.com",
      password: "jane",
      characterColor: {
        src: "/assets/img/Characters/User/Salmon/Chara_Astronaut12_FullBody_Run_4Dir_6x4.png"
      },
      gameSessions: [
        {roomOnePoints: 20, roomTwoPoints: 30, playedTime: 130},
        {roomOnePoints: 40, roomTwoPoints: 50, playedTime: 220},
        {roomOnePoints: 60, roomTwoPoints: 70, playedTime: 230}
      ],
      settings: {
        sound: false, 
        fxSound: true, 
        subtitles: true
      }
    }
  ];
  
  // Add moreUsers to the existing users array
  users = users.concat(moreUsers);
  
  // Save it to local storage
  localStorage.setItem('uzers', JSON.stringify(users));
  
  
// Retrieve users from local storage and parse them into a JavaScript object
users = JSON.parse(localStorage.getItem('uzers'));

// Initialize an empty object to hold each user's scores and play times
let userScores = {};

// Loop over each user
for (let user of users) {
  
  // Check if the user has any game sessions
  if (user.gameSessions && user.gameSessions.length > 0) {
    let totalScore = 0;
    let totalPlayedTime = 0;
    
    // For each game session, accumulate the scores and play times
    for (let session of user.gameSessions) {
      totalScore += session.roomOnePoints + session.roomTwoPoints;
      totalPlayedTime += session.playedTime;
    }

    // Calculate the average score. We divide by the total number of rooms (2 rooms per session)
    let averageScore = totalScore / (user.gameSessions.length * 2);

    // Store the user's average score and total play time in the userScores object
    userScores[user.username] = {
      averageScore: averageScore,
      totalPlayedTime: totalPlayedTime
    };
  }
}

// Convert the userScores object into an array and sort it
let sortedUsers = Object.entries(userScores).sort((a, b) => {
  // If the average scores are equal, sort by play time (less time comes first)
  if (b[1].averageScore === a[1].averageScore) {
    return a[1].totalPlayedTime - b[1].totalPlayedTime;
  }
  // Otherwise, sort by average score (higher score comes first)
  return b[1].averageScore - a[1].averageScore;
});

// Get the top 5 users
let topUsers = sortedUsers.slice(0, 5);

let leaderboardHtml = '';

// Check if there are any users in the leaderboard
if (topUsers.length === 0) {
  // If not, display a message encouraging exploration
  leaderboardHtml = '<div class="no-data-message">The Cosmic Quester might need some more exploring</div>';
} else {
  // If there are users, create the leaderboard HTML
  leaderboardHtml = topUsers.map((user, index) => `
    <div class="player-entry">
      ${index < 3 ? `<img class="medal" src="/assets/img/GUI/Leaderboard/${index+1}.png">` : ''}
      <span class="player-name">${user[0]}</span>
      <span class="player-score">${Math.round(user[1].averageScore)} points</span>
    </div>
  `).join('');
}

// Finally, construct the HTML for the leaderboard dashboard
const leaderboardDashboardHtml = `
<div class="title-banner-container pt-5">
  <div class="title">Leaderboard</div>
</div>

<div id="leaderboard-content">
  ${leaderboardHtml}
</div>`;



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
        container.classList.remove('stats-dashboard');
        container.classList.remove('leaderboard-dashboard');
        container.classList.remove('settings-dashboard');
        container.classList.remove('trophy-dashboard');
        changeContent()
        setWidth(25);
    
    });

    changeContent()
    //Put the alteration of the container innerHTML in a function
    
    function changeContent() {
  
    container.innerHTML = `<div class="title-banner-container dashboard pt-5">
    <div class="title">DASHBOARD</div>
    </div>

    <div class="character-container">
    <img class="arrow left-arrow" src="/assets/img/Glass_Arrow_Small.png" alt="Left arrow">
    <div class="user-character-container">
        <div class="user-character"><img class="user-character-img" src="${User.getAuthenticatedUser().characterColor.head}" alt="User img"></div>
    </div>

    <img class="arrow right-arrow" src="/assets/img/Glass_Arrow_Small.png" alt="Right arrow">
    </div>
    <form id="personal-form" action="">
    <div id="form-fields" class="form-group gap-1">
    <!--<label for="gameName">New Game Name</label>--> 
    <div class="input-container">
            <input type="text" id="username" class="form-control" placeholder="USERNAME" maxlength="20" required>
    </div>
    <div class="input-container">
    <input type="password" id="password" class="form-control" placeholder="PASSWORD" maxlength="15" required>
    </div>
    <div class="input-container">
    <input type="email" id="email" class="form-control" placeholder="EMAIL" maxlength="30" required>
    </div>
        <button type="submit" class="btn btn-primary"><img class="check-mark" src="/assets/img/UI_Glass_Checkmark_Large_01a.png" alt="Right arrow"></button>
    </div>

        <div class="form-group">
            <div id="error-message" class="alert alert-danger mt-3" style="display: none;"></div>
        </div>
    </div>
    </form>` 

    setWidth(45);

    const characterColorArray = Object.values(characterColor);
    let characterColorIndex = characterColorArray.findIndex(color => color.head === User.getAuthenticatedUser().characterColor.head);
    const userCharacterColor = document.querySelector(".user-character img");

    document.addEventListener('DOMContentLoaded', populateFormFields);
    document.querySelector('.arrow.right-arrow').addEventListener('click', handleRightArrowClick);
    document.querySelector('.arrow.left-arrow').addEventListener('click', handleLeftArrowClick);
    document.getElementById('personal-form').addEventListener('submit', handleFormSubmit);

    function populateFormFields() {
        const user = User.getAuthenticatedUser();
        if (user) {
            document.getElementById('username').value = user.username;
            document.getElementById('password').value = user.password;
            document.getElementById('email').value = user.email;
            userCharacterColor.src = characterColorArray[characterColorIndex].head;
        }
        updateUserCharacterColor();
    }

    function updateUserCharacterColor() {
        userCharacterColor.src = characterColorArray[characterColorIndex].head;
    }

    function handleRightArrowClick() {
        characterColorIndex = (characterColorIndex + 1) % characterColorArray.length;
        updateUserCharacterColor();
    }

    function handleLeftArrowClick() {
        characterColorIndex--;
        if (characterColorIndex < 0) characterColorIndex = characterColorArray.length - 1;
        updateUserCharacterColor();
    }

    function handleFormSubmit(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;
        const user = User.getAuthenticatedUser();
        const oldUsername = user.username;
        if (user) {
            user.username = username;
            user.password = password;
            user.email = email;
            user.characterColor = characterColorArray[characterColorIndex];
            User.updateUser(user, oldUsername)

            const messageDiv = document.getElementById('error-message');
            messageDiv.className = 'alert alert-success mt-3';
            messageDiv.innerHTML = 'Your information has been updated successfully.';
            messageDiv.style.display = 'block';

            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 1000);
        }
    }

    };





