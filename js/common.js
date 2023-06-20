

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

/*

// create an engine
var engine = Matter.Engine.create();
engine.world.gravity.y = 0;

// array of asteroid images
var asteroidImages = [
  '/assets/img/Asteroids/Asteroid1.png',
  // add more asteroid image paths
];

// create a list to store the asteroids
var asteroids = [];

// create asteroids
asteroidImages.forEach(function(image) {
  var xPos = Math.random() * window.innerWidth;
  var yPos = Math.random() * window.innerHeight;
  var asteroid = Matter.Bodies.circle(xPos, yPos, 50, {
    render: {
      sprite: {
        texture: image,
        xScale: 1.0,
        yScale: 1.0
      }
    }
  });
  asteroids.push(asteroid);
  Matter.World.add(engine.world, asteroid);
});

// add walls
var offset = 5;
Matter.World.add(engine.world, [
  Matter.Bodies.rectangle(window.innerWidth / 2, -offset, window.innerWidth + 2 * offset, 50, { 
    isStatic: true,
    render: {
      fillStyle: '#0d0c13'
    }
  }),
  Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + offset, window.innerWidth + 2 * offset, 50, { 
    isStatic: true,
    render: {
      fillStyle: '#0d0c13'
    }
  }),
  Matter.Bodies.rectangle(window.innerWidth + offset, window.innerHeight / 2, 50, window.innerHeight + 2 * offset, { 
    isStatic: true,
    render: {
      fillStyle: '#0d0c13'
    }
  }),
  Matter.Bodies.rectangle(-offset, window.innerHeight / 2, 50, window.innerHeight + 2 * offset, { 
    isStatic: true,
    render: {
      fillStyle: '#0d0c13'
    }
  })
]);


// run the engine
var runner = Matter.Runner.create();
Matter.Runner.run(runner, engine);

// add an event listener for the afterUpdate event
Matter.Events.on(engine, 'afterUpdate', function() {
  asteroids.forEach(function(asteroid) {
    var forceMagnitude = Matter.Common.random(0.05, 0.1);
    var forceDirection = Matter.Vector.create(Math.random() * 2 - 1, Math.random() * 2 - 1);
    var force = Matter.Vector.mult(forceDirection, forceMagnitude);
    Matter.Body.applyForce(asteroid, asteroid.position, force);
  });
});

// run the renderer
var render = Matter.Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    background: '#0d0c13',
    wireframes: false
  }
});
Matter.Render.run(render); */

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
