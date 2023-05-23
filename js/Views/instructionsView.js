window.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector(".title");
    const bannerContainer = document.querySelector(".title-banner-container");
    
    // Get the width of the title
    const titleWidth = title.getBoundingClientRect().width;

    // Set the width of the banner container to match the title's width, plus some extra padding
    const bannerWidth = titleWidth + 35;  // adjust the added value to your needs
    bannerContainer.style.width = `${bannerWidth}px`;
});

const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
const subtitle = document.querySelector('.subtitle');
const instructionsContainer = document.querySelector('.instructions-container');
const instructionsData = [
    {
        title: 'GAMEPLAY BASICS',
        content: `The game consists of 2 Rooms: Room 1 focuses on the Inner Planets, and Room 2 on the Outer Planets.<br>
Complete challenges in each room to progress to the next one.<br>
Discover and unlock bonus challenges within each room for additional rewards and opportunities to learn more about the Solar System.`,
        image: '/path/to/image1.png',
    },    
    {
        title: 'COSMIC QUEST',
        content: 'This is the explanation of Cosmic Quest...',
        image: '/path/to/image2.png',
    },
    {
        title: 'OTHER INSTRUCTIONS',
        content: 'These are the other instructions...',
        image: '/path/to/image3.png',
    },
    // Add more as needed
];

let currentIndex = 0;
function updateSubtitle() {
    const instruction = instructionsData[currentIndex];

    // Update the subtitle, content, and image
    subtitle.textContent = instruction.title;
    instructionsContainer.innerHTML = instruction.content;
    // If you have an img element for the image:
    // instructionImageElement.src = instruction.image;

    // Update arrow visibility
    if (currentIndex === 0) {
        // Only show the right arrow
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'block';
    } else if (currentIndex === instructionsData.length - 1) {
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
    if (currentIndex > instructionsData.length - 1) {
        currentIndex = instructionsData.length - 1; // Prevent the index from going past the end of the array
    }
    updateSubtitle();
});

// Initial update
updateSubtitle();
