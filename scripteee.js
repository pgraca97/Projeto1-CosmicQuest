
        //Multiple choice function
/*
  // Define your questions, options, and answers
  const questions = [
    {
      question: "Which layer of Saturn's atmosphere contains ammonia ice crystals?",
      options: ["Troposphere", "Stratosphere", "Thermosphere"],
      answer: "B"
    },
    // Add more questions here
  ];
  
  let currentQuestion = 0;
  let score = 0;
  
  // Function to display the current question and options
  function displayQuestion() {
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const submitButton = document.getElementById("submit-btn");
  
    questionElement.textContent = questions[currentQuestion].question;
    optionsElement.innerHTML = "";
  
    questions[currentQuestion].options.forEach((option, i) => {
      const li = document.createElement("li");
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "option";
      input.value = option;
  
      label.appendChild(input);
      label.appendChild(document.createTextNode(option));
  
      li.appendChild(label);
      optionsElement.appendChild(li);
    });
  
    submitButton.addEventListener("click", checkAnswer);
  }
  
  // Function to check the selected answer and display the correct answer
  function checkAnswer() {
    const selectedOption = document.querySelector("input[name='option']:checked");
    if (selectedOption) {
      const userAnswer = selectedOption.value;
      const correctAnswer = questions[currentQuestion].answer;
  
      if (userAnswer === correctAnswer) {
        score++;
      }
  
      // Display the correct answer
      const options = document.querySelectorAll("input[name='option']");
      options.forEach(option => {
        option.disabled = true;
        if (option.value === correctAnswer) {
          option.parentNode.classList.add("correct");
        }
      });
  
      // Move to the next question after a brief delay
      setTimeout(nextQuestion, 1500);
    }
  }
  
  // Function to move to the next question
  function nextQuestion() {
    const options = document.querySelectorAll("input[name='option']");
    options.forEach(option => {
      option.disabled = false;
      option.parentNode.classList.remove("correct");
      option.checked = false;
    });
  
    currentQuestion++;
  
    if (currentQuestion < questions.length) {
      displayQuestion();
    } else {
      // All questions have been answered, display the final score or any other desired action
      alert(`Quiz completed! Your score: ${score}/${questions.length}`);
    }
  }
  
  displayQuestion(); // Call the function to display the initial question
  
  */


    //Short answer function
    /*
  document.getElementById("question-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get the user's answer and trim any leading/trailing whitespace
    const userAnswer = document.getElementById("answer").value.trim();

    // Define the correct answer and the validation key
    const correctAnswer = "Paris";
    const validationKey = "paris";

    // Check if the user's answer matches the correct answer and the validation key (ignoring case sensitivity)
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase() && userAnswer.toLowerCase().includes(validationKey)) {
        alert("Correct answer!");
    } else {
        alert("Incorrect answer. Please try again.");
    }

    // Reset the form
    this.reset();
});
  */

let draggedElement = null;

function dragStart(event) {
  draggedElement = event.target;
  event.dataTransfer.setData("text/plain", event.target.textContent);
}

function allowDrop(event) {
  event.preventDefault();
  const dropzone = event.target;
  dropzone.classList.add("dropzone-highlight");
}

function removeHighlight(event) {
  const dropzones = document.querySelectorAll(".blank");
  dropzones.forEach(dropzone => dropzone.classList.remove("dropzone-highlight"));
}

function drop(event) {
  event.preventDefault();
  const dropzone = event.target;

  if (dropzone.classList.contains("blank")) {
    dropzone.textContent = draggedElement.textContent;
    draggedElement.textContent = "";
    draggedElement.style.display = "none";
    draggedElement.classList.remove("fade-out");
    draggedElement.draggable = false;
  }
}

function checkAnswer() {
  const blank1 = document.getElementById("blank1");
  const blank2 = document.getElementById("blank2");
  const blank3 = document.getElementById("blank3");
  const option = document.querySelector(".option");

  const answer1 = "Mercury's orbital period around the Sun is";
  const answer2 = "approximately";
  const answer3 = "Earth days.";

  if (
    blank1.textContent === answer1 &&
    blank2.textContent === answer2 &&
    blank3.textContent === answer3
  ) {
    alert("Correct answer!");
  } else {
    alert("Incorrect answer. Please try again.");
  }
}

function removeOptionFromBlank(event) {
  const blank = event.target;
  blank.textContent = "";
  const option = document.querySelector(".option");
  option.style.display = "block";
  option.classList.add("fade-in");
  option.draggable = true;
}

document.addEventListener("click", removeHighlight);

const blanks = document.querySelectorAll(".blank");
blanks.forEach(blank => {
  blank.addEventListener("click", removeOptionFromBlank);
});

