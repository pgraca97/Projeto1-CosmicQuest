import * as User from "/js/Model/User.js";
import { characterColor, setWidth } from "/js/common.js";

const contentContainer = document.getElementById('content');

document.getElementById('btn-users').addEventListener('click', function() {
    contentContainer.innerHTML = '';
    contentContainer.classList.add('users-container');

    const treatingUsers = document.createElement('div');
    treatingUsers.classList.add('treating-users');

    contentContainer.appendChild(treatingUsers);
    // Create containers for unblocked and blocked users
    const unblockedContainer = document.createElement('div');
    unblockedContainer.classList.add('unblocked-container');
    const blockedContainer = document.createElement('div');
    blockedContainer.classList.add('blocked-container');

    const users = JSON.parse(localStorage.getItem('users'));
    
    users.forEach(user => {
      if(!user.isAdmin) {
        let userHtml;
        if (user.isBlocked) {
          userHtml = `
          <div class="blocked-user-container">
            <p>${user.username} (Blocked)</p>
            <button class="btn-unblock">Unblock</button>
          </div>`;
          blockedContainer.insertAdjacentHTML('beforeend', userHtml);
        } else {
          userHtml = `
          <div class="user-container">
            <p>${user.username}</p>
            <button class="btn-delete">Delete</button>
            <button class="btn-block">Block</button>
          </div>`;
          unblockedContainer.insertAdjacentHTML('beforeend', userHtml);
        }
      }
    });

    // Append unblocked and blocked containers to usersContainer
    treatingUsers.appendChild(unblockedContainer);
    treatingUsers.appendChild(blockedContainer);


      // Adding event listener for delete, block and unblock buttons
      document.querySelectorAll('.btn-delete').forEach((btn, index) => {
        btn.addEventListener('click', function() {
          User.deleteUser(users[index].username);
          btn.parentNode.remove();
        });
      });
      
      document.querySelectorAll('.btn-block').forEach((btn, index) => {
        btn.addEventListener('click', function() {
          User.blockUser(users[index].username);
        });
      });
      
      document.querySelectorAll('.btn-unblock').forEach((btn, index) => {
        btn.addEventListener('click', function() {
          User.unblockUser(users[index].username);
        });
      });

      const addUserBtn = document.createElement('div');
      addUserBtn.classList.add('add-user-btn');
      addUserBtn.textContent = 'Add User';
      addUserBtn.innerHTML = `<button type="button" class="btn ms-auto m-2" id="sign-up-btn" data-bs-toggle="modal" data-bs-target="#signupModal">Add User</button>`;
      contentContainer.appendChild(addUserBtn);
    });      



    document.getElementById('sign-up-form').addEventListener('submit', function(event) {
        event.preventDefault();
      
        const username = document.getElementById('txtUsernameRegister').value;
        const password = document.getElementById('txtPasswordRegister').value;
        const confirmPassword = document.getElementById('txtPasswordRegister2').value;
        const email = document.getElementById('txtEmailRegister').value;
        
        if (password !== confirmPassword) {
          // Display error message
          document.getElementById('msgRegister').textContent = 'Passwords do not match';
          return;
        }
        
        const newUser = new User(username, email, password, characterColor.BiColor);
        User.addUser(newUser);
        // Clear the form fields
        document.getElementById('sign-up-form').reset();
        // Display success message
        document.getElementById('msgRegister').textContent = 'User successfully registered';
      });
      

      function     initializeCelestialBodies(newSession) {
        // If playedTime is 0, it's a new game session, so initialize celestial bodies from original data.
              // Otherwise, it's a resumed game session, so load celestial bodies from localStorage.
              const celestialBodiesNames = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Sun', 'Meteor Showers'];
              let celestialBodies = [];
             
                console.log('Initializing celestial bodies from localStorage');
                  for (let name of celestialBodiesNames) {
                      let celestialBody = JSON.parse(localStorage.getItem(name));
              
                      let newCelestialBody = {
                          planet: celestialBody.planet,
                          //notes: celestialBody.notes,
                          researchTerminal: celestialBody.researchTerminal,
                          challenges: {}
                      };
              
                      for (let challengeType in celestialBody.challenges) {
                          newCelestialBody.challenges[challengeType] = celestialBody.challenges[challengeType].map(challenge => ({
                              question: challenge.question,
                              answer: challenge.answer,
                              choices: challenge.choices,
                              correctChoice: challenge.correctChoice,
                              hints: challenge.hints
                          }));
                      }
              
                      celestialBodies.push(newCelestialBody);
                  }
                  return celestialBodies
              }
              
              const celestialBodies = initializeCelestialBodies(false); // false indicates it's not a new session
              console.log(celestialBodies);

              document.getElementById('btn-challenges').addEventListener('click', function() {
                contentContainer.classList.add('challenges-container');
                contentContainer.innerHTML = '';

    const celestialBodiesButtonsContainer = document.createElement('div');
    celestialBodiesButtonsContainer.classList.add('celestial-bodies-buttons-container');
    contentContainer.appendChild(celestialBodiesButtonsContainer);

    const celestialBodyContainer = document.createElement('div');
    celestialBodyContainer.classList.add('celestial-body-container');
    contentContainer.insertBefore(celestialBodyContainer, celestialBodiesButtonsContainer);

    const challengeDetailsContainer = document.createElement('div');
    challengeDetailsContainer.classList.add('challenge-details-container');
    celestialBodyContainer.appendChild(challengeDetailsContainer);


    const challengeButtonsContainer = document.createElement('div');
    challengeButtonsContainer.classList.add('challenge-buttons-container');
    celestialBodyContainer.appendChild(challengeButtonsContainer);



    let currentPlanet = null; // Variable to store the current planet
    let currentChallengeIndex = 0; // Variable to keep track of the current challenge being displayed
                let currentChallengeType = 'multiple choice'; // Variable to keep track of the current challenge being displayed

    celestialBodies.forEach(celestialBody => {
        let celestialBodyButton = document.createElement('button');
        celestialBodyButton.innerText = celestialBody.planet;
        celestialBodyButton.addEventListener('click', function() {
            challengeDetailsContainer.innerHTML = ''; // Clear the container to prepare for the new content
            challengeButtonsContainer.innerHTML = ''; 
          
            addButtons ();
            currentPlanet = celestialBody;

            displayChallengeDetails('multiple choice', 0, currentPlanet);
            Object.keys(celestialBody.challenges).forEach(challengeType => {
                const button = document.createElement('button');
                button.innerText = challengeType;
                button.dataset.challengeType = challengeType;
                button.addEventListener('click', function() {
                    challengeType = this.dataset.challengeType;
                    currentChallengeType = this.dataset.challengeType
                    currentChallengeIndex = 0; // Reset to the first challenge
                    displayChallengeDetails(challengeType, currentChallengeIndex, currentPlanet); // Function to display challenge details
                    console.log(challengeType);
console.log(currentChallengeType);
                });
                challengeButtonsContainer.appendChild(button);
            });
        });

        celestialBodiesButtonsContainer.appendChild(celestialBodyButton);
        
    });

function addButtons () {
    const adminChallenges = document.createElement('div');
    adminChallenges.classList.add('admin-challenges');

    const addChallengeButton = document.createElement('button');
    addChallengeButton.classList.add('add-challenge');
    addChallengeButton.innerText = 'Add Challenge';
// Add Challenge button event listener
addChallengeButton.addEventListener('click', function() {
    displayChallengeDetails(currentChallengeType, 'new', currentPlanet); // 'new' to indicate a new challenge is being added
    currentChallengeIndex = currentPlanet.challenges[currentChallengeType].length; // Point to the new challenge
});



        const deleteChallengeButton = document.createElement('button');
        deleteChallengeButton.classList.add('delete-challenge');
        deleteChallengeButton.innerText = 'Delete Challenge';
       // Delete Challenge button event listener
       deleteChallengeButton.addEventListener('click', function() {
        if (currentPlanet.challenges[currentChallengeType].length === 1) {
            alert("Can't delete the only challenge of this type!");
        } else {
            // Delete the challenge
            const celestialBody = JSON.parse(localStorage.getItem(currentPlanet.planet));

            celestialBody.challenges[currentChallengeType].splice(currentChallengeIndex, 1);
            localStorage.setItem(currentPlanet.planet, JSON.stringify(celestialBody));
    
            // Check if currentChallengeIndex is now out of bounds, if so, decrease it by 1
            if (currentChallengeIndex >= celestialBody.challenges[currentChallengeType].length) {
                currentChallengeIndex--;
            }
    
            // Display the next challenge (or the last one if it was the last challenge that was deleted)
            displayChallengeDetails(currentChallengeType, currentChallengeIndex, currentPlanet);
        }
    });
    
        adminChallenges.appendChild(addChallengeButton);
        adminChallenges.appendChild(deleteChallengeButton);

        challengeButtonsContainer.appendChild(adminChallenges);

    };

    // Function to display challenge details
    function displayChallengeDetails(challengeType, challengeIndex, planet) {
        challengeDetailsContainer.innerHTML = ''; // Clear previous challenge details

    
        let challenge = null;
        if (challengeIndex !== 'new') { // If not a new challenge, fetch the existing challenge
            challenge = planet.challenges[challengeType][challengeIndex];
        }
        else { // If new challenge, create an empty challenge
            challenge = {
                question: '',
                answer: '',
                hints: ['', ''],
                choices: ['', '', '']
            };
        }
    
 // Question field
 const questionDiv = document.createElement('div');
 questionDiv.classList.add('challenge-question');
 const questionLabel = document.createElement('label');
 questionLabel.innerText = 'Question: ';
 questionDiv.appendChild(questionLabel);
 let questionField = document.createElement('input');
 questionField.type = 'text';
 questionField.value = challenge.question;
 questionDiv.appendChild(questionField);
 challengeDetailsContainer.appendChild(questionDiv);

 // Answer field
 const answerDiv = document.createElement('div');
 answerDiv.classList.add('challenge-answer');
 const answerLabel = document.createElement('label');
 answerLabel.innerText = 'Answer: ';
 answerDiv.appendChild(answerLabel);
 let answerField = document.createElement('input');
 answerField.type = 'text';
 answerField.value = challenge.answer;
 answerDiv.appendChild(answerField);
 challengeDetailsContainer.appendChild(answerDiv);

 // Hints field
 const hintsDiv = document.createElement('div');
 hintsDiv.classList.add('challenge-hints');
 const hintsLabel = document.createElement('label');
 hintsLabel.innerText = 'Hints: ';
 hintsDiv.appendChild(hintsLabel);
 let hintsFieldOne = document.createElement('input');
 hintsFieldOne.type = 'text';
 hintsFieldOne.value = challenge.hints[0];

 let hintsFieldTwo = document.createElement('input');
 hintsFieldTwo.type = 'text';
 hintsFieldTwo.value = challenge.hints[1];

 hintsDiv.appendChild(hintsFieldOne);
 hintsDiv.appendChild(hintsFieldTwo);
 challengeDetailsContainer.appendChild(hintsDiv);

 let choicesFieldOne, choicesFieldTwo, choicesFieldThree;
 // Choices field for 'multiple choice' and 'fill in the blanks' challenges
 if (challengeType === 'multiple choice' || challengeType === 'fill in the blanks') {
    const choiceDiv = document.createElement('div');
    choiceDiv.classList.add('challenge-choices');
    const choiceLabel = document.createElement('label');
    choiceLabel.innerText = 'Choices: ';
    choiceDiv.appendChild(choiceLabel);

     choicesFieldOne = document.createElement('input');
     choicesFieldOne.type = 'text';
     choicesFieldOne.value = challenge.choices[0];
     choiceDiv.appendChild(choicesFieldOne);

     choicesFieldTwo = document.createElement('input');
     choicesFieldTwo.type = 'text';
     choicesFieldTwo.value = challenge.choices[1];
     choiceDiv.appendChild(choicesFieldTwo);

     choicesFieldThree = document.createElement('input');
     choicesFieldThree.type = 'text';
     choicesFieldThree.value = challenge.choices[2];
     choiceDiv.appendChild(choicesFieldThree);

     challengeDetailsContainer.appendChild(choiceDiv);
 }

// Update button
let updateButton = document.createElement('button');
if (challengeIndex !== 'new') {
    updateButton.innerText = 'Update';
} else {
    updateButton.innerText = 'Add'; // If it's a new challenge, change the button text to 'Add'
}
updateButton.addEventListener('click', function() {
    challenge.question = questionField.value;
    challenge.answer = answerField.value;

    // Assign the hints and choices from the individual input fields
    challenge.hints = [hintsFieldOne.value, hintsFieldTwo.value];

    if (challengeType === 'multiple choice' || challengeType === 'fill in the blanks') {
        challenge.choices = [choicesFieldOne.value, choicesFieldTwo.value, choicesFieldThree.value];
    }

    // Retrieve the current celestial bodies from the local storage
    const celestialBody = JSON.parse(localStorage.getItem(currentPlanet.planet));

    // If it's a new challenge, add it to the planet's challenges and update in the local storage
    if (challengeIndex === 'new') {
        
        celestialBody.challenges[challengeType].push(challenge); // Add the new challenge
        localStorage.setItem(currentPlanet.planet, JSON.stringify(celestialBody));
    }



    // Update the celestial body
    celestialBody.challenges[challengeType][challengeIndex] = challenge;

    // Save it back to local storage
    localStorage.setItem(currentPlanet.planet, JSON.stringify(celestialBody));
    console.log(localStorage.getItem(currentPlanet.planet));
});
challengeDetailsContainer.appendChild(updateButton);


let prevButton = document.createElement('button');
prevButton.innerText = 'Previous';
prevButton.addEventListener('click', function() {
    if (currentChallengeIndex > 0) {
        currentChallengeIndex--;
        displayChallengeDetails(challengeType, currentChallengeIndex, currentPlanet);
    } else if (currentChallengeIndex === 0) {
        currentChallengeIndex = currentPlanet.challenges[challengeType].length - 1;
        displayChallengeDetails(challengeType, currentChallengeIndex, currentPlanet);
    }
});
challengeDetailsContainer.appendChild(prevButton);

let nextButton = document.createElement('button');
nextButton.innerText = 'Next';
nextButton.addEventListener('click', function() {
    if (currentChallengeIndex < currentPlanet.challenges[challengeType].length - 1) {
        currentChallengeIndex++;
        displayChallengeDetails(challengeType, currentChallengeIndex, currentPlanet);
    } else if (currentChallengeIndex === currentPlanet.challenges[challengeType].length - 1) { 
        currentChallengeIndex = 0;
        displayChallengeDetails(challengeType, currentChallengeIndex, currentPlanet);
    }
});
challengeDetailsContainer.appendChild(nextButton);
}
});

            
            
            function displayQuestions(planetSet) {
                // Clear previous question type buttons
                quizzTypeButtonsContainer.innerHTML = '';
                currentPlanet = planetSet.planet;
                console.log(currentPlanet);
                // Create a button for each type of question
                
                const questionTypes = Object.keys(planetSet.challenges);
         
                challengeType = questionTypes[0];
                console.log(challengeType);
                questionTypes.forEach(questionType => {
                    const button = document.createElement('button');
                    button.innerText = questionType;
                    button.dataset.questionType = questionType;
                    button.addEventListener('click', function() {
        
                        challengeType = this.dataset.questionType;
                        currentQuestionIndex = 0;
                        displayQuestionType(this.dataset.questionType, planetSet);
        
                    });
                    quizzTypeButtonsContainer.appendChild(button);
                });
            
                // By default, display the first type of questions
                if (questionTypes.length > 0) {
                    displayQuestionType(questionTypes[0], planetSet);
                }
            }
            
