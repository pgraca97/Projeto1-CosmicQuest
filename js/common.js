

export function setWidth(extraWidth = 45) {
  const title = document.querySelector(".title");
const bannerContainer = document.querySelector(".title-banner-container");

// Get the width of the title
const titleWidth = title.getBoundingClientRect().height;

// Set the width of the banner container to match the title's width, plus some extra padding
const bannerWidth = titleWidth + extraWidth;  // adjust the added value to your needs
bannerContainer.style.width = `${bannerWidth}px`;
}

window.onload = function() {
    const starCount = 100;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        document.body.appendChild(star);
    }
  };

export const characterColor = {
  BiColor: {
      src: "/assets/img/Characters/User/BiColor/Chara_Astronaut01_FullBody_Run_4Dir_6x4.png",
      idleSrc: "/assets/img/Characters/User/BiColor/Chara_Astronaut01_FullBody_Idle_8Dir_1x8.png",
      head: "/assets/img/Characters/User/BiColor/BiColor.png",
  },
  Black: {
      src: "/assets/img/Characters/User/Black/Chara_Astronaut02_FullBody_Run_4Dir_6x4.png",
      idleSrc: "/assets/img/Characters/User/Black/Chara_Astronaut02_FullBody_Idle_8Dir_1x8.png",
      head: "/assets/img/Characters/User/Black/Black.png",
  },
  Blue: {
      src: "/assets/img/Characters/User/Blue/Chara_Astronaut03_FullBody_Run_4Dir_6x4.png",
      idleSrc: "/assets/img/Characters/User/Blue/Chara_Astronaut03_FullBody_Idle_8Dir_1x8.png",
      head: "/assets/img/Characters/User/Blue/Blue.png",
  },
  Brown: {
      src: "/assets/img/Characters/User/Brown/Chara_Astronaut04_FullBody_Run_4Dir_6x4.png",
      idleSrc: "/assets/img/Characters/User/Brown/Chara_Astronaut04_FullBody_Idle_8Dir_1x8.png",
      head: "/assets/img/Characters/User/Brown/Brown.png",
  },
  Green: {
      src: "/assets/img/Characters/User/Green/Chara_Astronaut05_FullBody_Run_4Dir_6x4.png",
      idleSrc: "/assets/img/Characters/User/Green/Chara_Astronaut05_FullBody_Idle_8Dir_1x8.png",
      head: "/assets/img/Characters/User/Green/Green.png",
  },
  Grey: {
      src: "/assets/img/Characters/User/Grey/Chara_Astronaut06_FullBody_Run_4Dir_6x4.png",
      idleSrc: "/assets/img/Characters/User/Grey/Chara_Astronaut06_FullBody_Idle_8Dir_1x8.png",
      head: "/assets/img/Characters/User/Grey/Grey.png",
  },
  Orange: {
      src: "/assets/img/Characters/User/Orange/Chara_Astronaut07_FullBody_Run_4Dir_6x4.png",
      idleSrc: "/assets/img/Characters/User/Orange/Chara_Astronaut07_FullBody_Idle_8Dir_1x8.png",
      head: "/assets/img/Characters/User/Orange/Orange.png",
  },
  Pink: {
      src: "/assets/img/Characters/User/Pink/Chara_Astronaut09_FullBody_Run_4Dir_6x4.png",
      idleSrc: "/assets/img/Characters/User/Pink/Chara_Astronaut09_FullBody_Idle_8Dir_1x8.png",
      head: "/assets/img/Characters/User/Pink/Pink.png",
  },
  Purple: {
      src: "/assets/img/Characters/User/Purple/Chara_Astronaut10_FullBody_Run_4Dir_6x4.png",
      idleSrc: "/assets/img/Characters/User/Purple/Chara_Astronaut10_FullBody_Idle_8Dir_1x8.png",
      head: "/assets/img/Characters/User/Purple/Purple.png",
  },
  Red: {
      src: "/assets/img/Characters/User/Red/Chara_Astronaut11_FullBody_Run_4Dir_6x4.png",
      idleSrc: "/assets/img/Characters/User/Red/Chara_Astronaut11_FullBody_Idle_8Dir_1x8.png",
      head: "/assets/img/Characters/User/Red/Red.png",
  },
  Salmon: {
      src: "/assets/img/Characters/User/Salmon/Chara_Astronaut12_FullBody_Run_4Dir_6x4.png",
      idleSrc: "/assets/img/Characters/User/Salmon/Chara_Astronaut12_FullBody_Idle_8Dir_1x8.png",
      head: "/assets/img/Characters/User/Salmon/Salmon.png",
  },
  Turquoise: {
      src: "/assets/img/Characters/User/Turquoise/Chara_Astronaut13_FullBody_Run_4Dir_6x4.png",
      idleSrc: "/assets/img/Characters/User/Turquoise/Chara_Astronaut13_FullBody_Idle_8Dir_1x8.png",
      head: "/assets/img/Characters/User/Turquoise/Turquoise.png",
  },
  White: {
      src: "/assets/img/Characters/User/White/Chara_Astronaut14_FullBody_Run_4Dir_6x4.png",
      idleSrc: "/assets/img/Characters/User/White/Chara_Astronaut14_FullBody_Idle_8Dir_1x8.png",
      head: "/assets/img/Characters/User/White/White.png",
  },
  Yellow: {
      src: "/assets/img/Characters/User/Yellow/Chara_Astronaut15_FullBody_Run_4Dir_6x4.png",
      idleSrc: "/assets/img/Characters/User/Yellow/Chara_Astronaut15_FullBody_Idle_8Dir_1x8.png",
      head: "/assets/img/Characters/User/Yellow/Yellow.png",
  }
};

export const utils = {
  withGrid (number) {
      return number * 16;
  },
  asGridCoord(x, y) {
      return `${x*16},${y*16}`
  },
  snapToGrid(coord) {
      return Math.round(coord / 16) * 16
  },
  nextPosition(initialX, initialY, direction) {
      let x = initialX;
      let y = initialY;
      const size = 16;
      if (direction === 'left') {
          x -= size;
      } else if (direction === 'right') {
          x += size;
      } else if (direction === 'up') {
          y -= size;
      } else if (direction === 'down') {
          y += size;
      }

      //console.log(`Next position: x=${x}, y=${y}`);
      
      return {x, y};
  },
  oppositeDirection(direction) {
      if (direction === 'left') { return 'right' }
      if (direction === 'right') { return 'left' }
      if (direction === 'up') { return 'down'; }
      return 'up';
  },


  wait(ms) {
      return new Promise(resolve => {setTimeout(() => {resolve()}, ms)});
  },

  randomFromArray(array) {
      return array[Math.floor(Math.random() * array.length)];
  },

  emitEvent(name, detail) {
      const event = new CustomEvent(name, {
          detail
      });
      document.dispatchEvent(event);
  }
}
