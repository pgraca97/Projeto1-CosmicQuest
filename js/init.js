initdata();

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


function initdata() {

  // Inject dummy users if there are none in localStorage
  if (!localStorage.users) {
    const users = [
      {
        username: "user1",
        password: "pass1",
      },
      {
        username: "user2",
        password: "pass2",
      },
    ];
    console.log("inject");
    localStorage.setItem("users", JSON.stringify(users));
  }
}
// create an engine
var engine = Matter.Engine.create();
engine.world.gravity.y = 0;

// array of asteroid images
var asteroidImages = [
  'assets/img/Asteroids/Asteroid1.png',
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
Matter.Render.run(render);