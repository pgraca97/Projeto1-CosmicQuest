import { characterColor, setWidth } from "/js/common.js";

(function () {

  // Inject dummy users if there are none in localStorage
  if (!localStorage.users) {
    const users = [
      {
        username: "paulo",
        email: "paulo@gmail.com",
        password: "paulo",
        characterColor: characterColor.Pink, 
        gameSessions: [],
        settings: {
          sound: false,
          fxSound: true
        },
        isAdmin: true,
        isBlocked:false,
      },
      {
        username: "ana",
        email: "ana@gmail.com",
        password: "ana",
        characterColor: characterColor.Black, 
        gameSessions: [],
        settings: {
          sound: true,
          fxSound: true
        },
        isAdmin: false,
        isBlocked:true,
      },
      {
        username: "jose",
        email: "jose@gmail.com",
        password: "jose",
        characterColor: characterColor.Yellow, 
        gameSessions: [],
        settings: {
          sound: true,
          fxSound: false
        },
        isAdmin: false,
        isBlocked:false,
      },
      {
        username: "maria",
        email: "maria@gmail.com",
        password: "maria",
        characterColor: characterColor.Orange, 
        gameSessions: [],
        settings: {
          sound: false,
          fxSound: false
        },
        isAdmin: false,
        isBlocked:false,
      }
    ];
    console.log("inject");
    localStorage.setItem("users", JSON.stringify(users));
  }
  console.log('inject done')
})();
