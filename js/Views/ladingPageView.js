import * as User from "/js/Model/User.js";

// Function to display a message in a specific modal
function displayMessage(modal, message, type) {
  const divMessage = document.getElementById(modal);
  divMessage.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
  setTimeout(() => {
    divMessage.innerHTML = "";
  }, 2000);
}

function landingPageView() {
  const navbar = document.querySelector('.navbar');
  const btnGroupTop = document.querySelector('.btn-group');
  const btnGroup = document.querySelector('.btn-group-vertical');
  
  // Create the initial navbar HTML
  let nav = `<div class="collapse navbar-collapse" id="navbarSupportedContent">`;

  User.initUsers();

  if (User.isLoggedIn()) {
    // Add welcome message for authenticated users
    nav += `
      <div id="marquee" class="mx-auto text-center text-uppercase">
        <span class="text-primary" id="welcome-msg">
          Welcome  Back, ${User.getAuthenticatedUser().username}
        </span>
      </div>
    `;

    let btnGroupTopContent = `
      <button type="button" class="btn btn-primary rounded-0" id="home-btn">
        <img class="btn-image" src="assets/img/Buttons/Top Buttons/HOME.png" alt="HOME" />
        <img class="btn-image-hover" src="assets/img/Buttons/Top Buttons/HOME-hover.png" alt="HOME-hover" />
      </button>
      <button type="button" class="btn btn-primary rounded-0" id="rooms-btn">
        <img class="btn-image" src="assets/img/Buttons/Top Buttons/ROOMS.png" alt="ROOMS" />
        <img class="btn-image-hover" src="assets/img/Buttons/Top Buttons/ROOMS-hover.png" alt="ROOMS-hover" />
      </button>
      <button type="button" class="btn btn-primary rounded-0" id="alerts-btn">
        <img class="btn-image" src="assets/img/Buttons/Top Buttons/ALERTS.png" alt="ALERTS" />
        <img class="btn-image-hover" src="assets/img/Buttons/Top Buttons/ALERTS-hover.png" alt="ALERTS-hover" />
      </button>
      <span class="alerts-counter">(*)</span>
    `;

    let btnGroupContent = `
      <button type="button" class="btn btn-primary rounded-0" id="new-game-btn">
        <img class="btn-image" src="assets/img/Buttons/Main Buttons/NEW GAME.png" alt="NEW GAME" />
        <img class="btn-image-hover" src="assets/img/Buttons/Main Buttons/NEW GAME-hover.png" alt="NEW GAME-hover" />
      </button>
      <button type="button" class="btn btn-primary rounded-0" id="continue-btn">
        <img class="btn-image" src="assets/img/Buttons/Main Buttons/CONTINUE.png" alt="CONTINUE" />
        <img class="btn-image-hover" src="assets/img/Buttons/Main Buttons/CONTINUE-hover.png" alt="CONTINUE-hover" />
      </button>
      <button type="button" class="btn btn-primary rounded-0" id="personal-btn">
        <img class="btn-image" src="assets/img/Buttons/Main Buttons/PERSONAL.png" alt="PERSONAL" />
        <img class="btn-image-hover" src="assets/img/Buttons/Main Buttons/PERSONAL-hover.png" alt="PERSONAL-hover" />
      </button>
      <button type="button" class="btn btn-primary rounded-0" id="instructions-btn">
        <img class="btn-image" src="assets/img/Buttons/Main Buttons/INSTRUCTIONS.png" alt="INSTRUCTIONS" />
        <img class="btn-image-hover" src="assets/img/Buttons/Main Buttons/INSTRUCTIONS-hover.png" alt="INSTRUCTIONS-hover" />
      </button>
      <button type="button" class="btn btn-primary rounded-0" id="exit-btn">
        <img class="btn-image" src="assets/img/Buttons/Main Buttons/EXIT.png" alt="EXIT" />
        <img class="btn-image-hover" src="assets/img/Buttons/Main Buttons/EXIT-hover.png" alt="EXIT-hover" />
      </button>
    `;

    // Update navbar's HTML for authenticated users
    btnGroupTop.innerHTML = btnGroupTopContent;
    btnGroup.innerHTML = btnGroupContent;
    navbar.innerHTML = nav;
  } else {
    // If user is not logged in, add login and sign up buttons
    nav += `
      <button type="button" class="btn me-auto m-2" id="login-btn" data-bs-toggle="modal" data-bs-target="#loginModal">
        <img class="btn-image" src="assets/img/Buttons/logIn.png" alt="log-in">
        <img class="btn-image-hover" src="assets/img/Buttons/logIn-hover.png" alt="log-in-hover">
      </button>
      
      <button typoe="button" class="btn ms-auto m-2" id="sign-up-btn" data-bs-toggle="modal" data-bs-target="#signupModal">
        <img class="btn-image" src="assets/img/Buttons/signUp.png" alt="sign-up">
        <img class="btn-image-hover" src="assets/img/Buttons/signUp-hover.png" alt="sign-up-hover">
      </button>
    `;

    nav += `</div>`;

    navbar.innerHTML = nav;
  }

  const exitButton = document.querySelector("#exit-btn");
  if (exitButton) {
    exitButton.addEventListener("click", () => {
      User.logout();
      location.reload();
    });
  }

  document.querySelector("#login-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      User.login(
        document.getElementById("txtUsername").value,
        document.getElementById("txtPassword").value
      );
      displayMessage("msgLogin", "User logged in with success!", "success");
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (e) {
      displayMessage("msgLogin", e.message, "danger");
    }
  });

  document.querySelector("#sign-up-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const registerUsername = document.getElementById("txtUsernameRegister");
    const registerPassword = document.getElementById("txtPasswordRegister");
    const registerPassword2 = document.getElementById("txtPasswordRegister2");
    try {
      if (registerPassword.value !== registerPassword2.value) {
        throw Error("Password and Confirm Password are not equal");
      }
      User.addUser(undefined, registerUsername.value, undefined, registerPassword.value, undefined);
      displayMessage("msgRegister", "User registered with success!", "success");
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (e) {
      displayMessage("msgRegister", e.message, "danger");
    }
  });
  // Display the register modal when the page loads
  document.addEventListener("DOMContentLoaded", function() {
    var registerModal = document.getElementById("signupModal");
    var bsModal = new bootstrap.Modal(registerModal);
    bsModal.show();
  });
}

landingPageView();
