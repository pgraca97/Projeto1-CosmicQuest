import * as User from "/js/Model/User.js";
import { characterColor } from "/js/common.js";

function landingPageView() {
  const navbar = document.querySelector('.navbar');
  const btnGroupTop = document.querySelector('.btn-group');
  const btnGroup = document.querySelector('.btn-group-vertical');
  
  // Create the initial navbar HTML
  let nav = `<div class="collapse navbar-collapse" id="navbarSupportedContent">`;

  User.initUsers();
  console.log(localStorage.getItem("users"));
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

    if(User.isAuthenticatedAdmin()){
      btnGroupTopContent += `
        <button type="button" class="btn btn-primary rounded-0" id="admin-btn">
          <!--<img class="btn-image" src="assets/img/Buttons/Top Buttons/ADMIN.png" alt="ADMIN" />
          <img class="btn-image-hover" src="assets/img/Buttons/Top Buttons/ADMIN-hover.png" alt="ADMIN-hover" />-->
          BACKOFFICE
        </button>
      `;
    }

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
      <button type="button" class="btn me-auto m-2" id="login-btn">
        <img class="btn-image" src="assets/img/Buttons/logIn.png" alt="log-in">
        <img class="btn-image-hover" src="assets/img/Buttons/logIn-hover.png" alt="log-in-hover">
      </button>
      
      <button type="button" class="btn ms-auto m-2" id="sign-up-btn">
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


// Hold onto the timeoutID
let clearMsgTimeoutId;

// Select the login button and add a click event listener
document.querySelector("#login-btn")?.addEventListener("click", () => {

  document.querySelector(".btn-group-vertical").style.top = null;
  document.querySelector(".btn-group-vertical").style.marginBottom = null;

  clearTimeout(clearMsgTimeoutId);

  // Update the inner HTML of the btnGroup
  btnGroup.innerHTML = `
    <form id="personal-form" action="">
      <div id="form-fields" class="form-group gap-1">
        <div class="input-container">
          <input type="email" id="email" class="form-control" placeholder="EMAIL OR USERNAME" maxlength="30" />
        </div>
        <div class="password-container">
          <div class="input-container">
            <input type="password" id="password" class="form-control" placeholder="PASSWORD" maxlength="15" />
          </div>
          <button type="button" id="toggle-password" class="toggle-password">show</button>
        </div>
        <div class="btn-container">
          <button id="submit-button" type="submit" class="btn btn-primary">LOG IN</button>
        </div>
      </div>
      <div class="msgLogin"></div>
    </form>
  `;

  // Select elements
  const submitButton = document.querySelector(".btn-container");
  const msgLogin = document.querySelector(".msgLogin");
  const passwordInput = document.getElementById("password");
  const togglePasswordButton = document.getElementById("toggle-password");
  
  // Handle show/hide password button click
  togglePasswordButton.addEventListener('click', () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePasswordButton.textContent = "hide";
    } else {
      passwordInput.type = "password";
      togglePasswordButton.textContent = "show";
    }
  });
  
  // Update the background image of the submitButton
  submitButton.style.backgroundImage = "url('/assets/img/GUI/UI_Glass_Button_Medium_Lock_01a3.png')";

  // Handle submit button click
  submitButton.addEventListener('click', (event) => {
    event.preventDefault();

    const emailOrUsername = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    // Client-side validation
    if (!emailOrUsername.trim() || !password.trim()) {
      msgLogin.classList.remove("success");
      msgLogin.classList.add("error");
      msgLogin.innerText = "Please fill in all fields.";
      if (msgLogin.innerText) {
        document.querySelector(".btn-group-vertical").style.marginBottom = "8.5rem";
      }
      
      // Clear the error message and reset margin after 2 seconds
      clearMsgTimeoutId = setTimeout(() => {
        console.log('timeout');
        msgLogin.innerText = "";
        document.querySelector(".btn-group-vertical").style.marginBottom = null;
      }, 4000);
      return;
    }

    try {
      // Attempt to log in the user
      User.login(emailOrUsername, password);

      // If login is successful, display success message and update margin
      msgLogin.classList.remove("error");
      msgLogin.classList.add("success");
      msgLogin.innerText = "User logged in with success!";
      if (msgLogin.innerText) {
        document.querySelector(".btn-group-vertical").style.marginBottom = "8.5rem";
      }

      // Clear the success message and reset margin after 2 seconds
      clearMsgTimeoutId = setTimeout(() => {
        msgLogin.innerText = "";
        document.querySelector(".btn-group-vertical").style.marginBottom = null;
      }, 2000);

      // Reload the page after 1 second
      setTimeout(() => {
        location.reload();
      }, 1000);

    } catch (e) {
      // If login fails, display error message and update margin
      msgLogin.classList.remove("success");
      msgLogin.classList.add("error");
      msgLogin.innerText = e.message;
      if (msgLogin.innerText) {
        document.querySelector(".btn-group-vertical").style.marginBottom = "8.5rem";
      }

      // Clear the error message and reset margin after 2 seconds
      clearMsgTimeoutId = setTimeout(() => {
        msgLogin.innerText = "";
        document.querySelector(".btn-group-vertical").style.marginBottom = null;
      }, 2000);
    }
  });

  // Handle submit button mousedown
  submitButton.addEventListener('mousedown', () => {
    submitButton.style.backgroundImage = "url('/assets/img/GUI/UI_Glass_Button_Medium_Press_01a3.png')";
    submitButton.style.transform = 'translateY(1px)';  // move button down slightly
  });

  // Handle submit button mouseup
  submitButton.addEventListener('mouseup', () => {
    submitButton.style.backgroundImage = "url('/assets/img/GUI/UI_Glass_Button_Medium_Release_01a3.png')";
    submitButton.style.transform = 'translateY(0)';  // move button back to original position
    setTimeout(() => {
      submitButton.style.backgroundImage = "url('/assets/img/GUI/UI_Glass_Button_Medium_Lock_01a3.png')";
    }, 100); // delay the switch back to the locked state so the release state can be seen
  });

  // Handle submit button mouseout
  submitButton.addEventListener('mouseout', () => {
    // reset button state when mouse leaves button
    submitButton.style.backgroundImage = "url('/assets/img/GUI/UI_Glass_Button_Medium_Lock_01a3.png')";
    submitButton.style.transform = 'translateY(0)';  // move button back to original position
  });

  // Update the classes of the btnGroup
  btnGroup.classList.remove("main-buttons");
  btnGroup.classList.remove("sign-up-form");
  btnGroup.classList.add("login-form");
});


// Handle sign up button click 
document.querySelector("#sign-up-btn")?.addEventListener("click", () => {
  // Reset the top and marginBottom of the btn-group-vertical
  document.querySelector(".btn-group-vertical").style.top = null;
  document.querySelector(".btn-group-vertical").style.marginBottom = null;

  // Clear previous error or success messages
  clearTimeout(clearMsgTimeoutId);

  // Update the inner HTML of the button group
  btnGroup.innerHTML = `
    <!-- Content Container -->
    <div class="content-container">
      <form id="personal-form" action="">
        <!-- Character Container -->
        <div class="character-container">
          <img class="arrow left-arrow" src="/assets/img/Glass_Arrow_Small.png" alt="Left arrow">
          <div class="user-character-container">
            <div class="user-character"><img class="user-character-img" src="" alt="User img"></div>
          </div>
          <img class="arrow right-arrow" src="/assets/img/Glass_Arrow_Small.png" alt="Right arrow">
        </div>
        <!-- Form Fields -->
        <div id="form-fields" class="form-group gap-1">
          <div class="input-container">
            <input type="text" id="username" class="form-control" placeholder="USERNAME" maxlength="20" required>
          </div>
          <div class="password-container">
            <div class="input-container">
              <input type="password" id="password" class="form-control" placeholder="PASSWORD" maxlength="15" />
            </div>
            <button type="button" id="toggle-password" class="sign-up">show</button>
          </div>
          <div class="input-container">
            <input type="password" id="password2" class="form-control" placeholder="CONFIRM PASSWORD" maxlength="15" required>
          </div>
          <div class="input-container">
            <input type="email" id="email" class="form-control" placeholder="EMAIL" maxlength="30" required>
          </div>
        </div>
      </form>
    </div>
    <!-- Button Container -->
    <div class="btn-container">
      <button id="submit-button" type="submit" class="btn btn-primary">SIGN UP</button>
    </div>
    <!-- Message Container -->
    <div id="msgRegister"></div>
  `;

  // Get DOM references for later use
  const submitButton = document.querySelector(".btn-container");
  const userCharacterColor = document.querySelector(".user-character img");
  const passwordInput = document.getElementById("password");
  const password2Input = document.getElementById("password2");
  const togglePasswordButton = document.getElementById("toggle-password");
  const msgRegister = document.getElementById("msgRegister");
  
  // Handle show/hide password button click
  togglePasswordButton.addEventListener('click', () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      password2Input.type = "text";
      togglePasswordButton.textContent = "hide";
    } else {
      passwordInput.type = "password";
      password2Input.type = "password";
      togglePasswordButton.textContent = "show";
    }
  });

  // Character color handling
  const characterColorArray = Object.values(characterColor);
  let currentColorKey = 0;

  function updateUserCharacterColor() {
    userCharacterColor.src = characterColorArray[currentColorKey].head;
  }

  updateUserCharacterColor();
  submitButton.style.backgroundImage = "url('/assets/img/GUI/UI_Glass_Button_Medium_Lock_01a3.png')";

  // Event handlers for the arrows
  document.querySelector('.arrow.right-arrow').addEventListener('click', function() {
    currentColorKey = (currentColorKey + 1) % characterColorArray.length;
    updateUserCharacterColor();
  });

  document.querySelector('.arrow.left-arrow').addEventListener('click', function() {
    currentColorKey = (currentColorKey - 1 + characterColorArray.length) % characterColorArray.length;
    updateUserCharacterColor();
  });

// Handle form submission
submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  try {
    const registerUsername = document.getElementById("username");
    const registerPassword = document.getElementById("password");
    const registerPassword2 = document.getElementById("password2");
    const email = document.getElementById("email");
    
    // Username validation
    if (registerUsername.value.length < 4 || registerUsername.value.length > 20) {
      throw Error("Username should be between 4 and 20 characters long");
    }
    
    if (!/^[\w.-]+$/.test(registerUsername.value)) {
      throw Error("Username can only contain letters, numbers, and ._-");
    }
    
    // Password validation
    if (registerPassword.value.length < 8 || registerPassword.value.length > 16) {
      throw Error("Password should be between 8 and 16 characters long");
    }
    
    if (!/[A-Za-z]/.test(registerPassword.value) || !/\d/.test(registerPassword.value) || !/[\W_]/.test(registerPassword.value)) {
      throw Error("Password should contain at least one letter, one number, and one special character");
    }

    if (/\s/.test(registerPassword.value)) {
      throw Error("Password should not contain spaces");
    }
    
    if (registerPassword.value !== registerPassword2.value) {
      throw Error("Password and Confirm Password are not equal");
    }

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(email.value)) {
      throw Error("Invalid email format");
    }
    
    const selectedColor = characterColorArray[currentColorKey];
    User.addUser(registerUsername.value, email.value, registerPassword.value, selectedColor);


    msgRegister.classList.remove("error");
    msgRegister.classList.add("success");
    msgRegister.innerText = "Sign up successful!";
    if (msgRegister.innerText) {
      document.querySelector(".btn-group-vertical").style.top="55%";
    }

    clearMsgTimeoutId = setTimeout(() => {
      msgRegister.innerText = "";
      document.querySelector(".btn-group-vertical").style.top = null;
    }, 2000);
    
     setTimeout(() => {
       location.reload();
    }, 1000);
    } catch (e) {
      msgRegister.classList.remove("success");
      msgRegister.classList.add("error");
      msgRegister.innerText = e.message;
      if (msgRegister.innerText) {
        document.querySelector(".btn-group-vertical").style.top="55%";
      }

      clearMsgTimeoutId = setTimeout(() => {
        msgRegister.innerText = "";
        document.querySelector(".btn-group-vertical").style.top = null;
      }, 2000);
    }
  });

  // Button press effects
  submitButton.addEventListener('mousedown', () => {
    submitButton.style.backgroundImage = "url('/assets/img/GUI/UI_Glass_Button_Medium_Press_01a3.png')";
    submitButton.style.transform = 'translateY(1px)';
  });

  submitButton.addEventListener('mouseup', () => {
    submitButton.style.backgroundImage = "url('/assets/img/GUI/UI_Glass_Button_Medium_Release_01a3.png')";
    submitButton.style.transform = 'translateY(0)';
    setTimeout(() => {
      submitButton.style.backgroundImage = "url('/assets/img/GUI/UI_Glass_Button_Medium_Lock_01a3.png')";
    }, 100);
  });

  submitButton.addEventListener('mouseout', () => {
    submitButton.style.backgroundImage = "url('/assets/img/GUI/UI_Glass_Button_Medium_Lock_01a3.png')";
    submitButton.style.transform = 'translateY(0)';
  });

  // Update class list for the button group
  btnGroup.classList.remove("main-buttons");
  btnGroup.classList.remove("login-form");
  btnGroup.classList.add("sign-up-form");
});

document.querySelector("#admin-btn")?.addEventListener("click", () => {
  location.href = "../html/backoffice.html";
});

  document.querySelector("#instructions-btn")?.addEventListener("click", () => {
    location.href = "./html/instructions.html";
});

document.querySelector("#new-game-btn")?.addEventListener("click", () => {
  location.href = "../html/new game.html";
});

document.querySelector("#continue-btn")?.addEventListener("click", () => {
  location.href = "../html/continue.html";
});

document.querySelector("#personal-btn")?.addEventListener("click", () => {
  location.href = "../html/personal.html";
});

document.querySelector("#exit-btn")?.addEventListener("click", () => {
  User.logout();
  location.reload();
});
}

landingPageView();



