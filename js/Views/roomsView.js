import * as User from "/js/Model/User.js";
import * as GameSession from "/js/Model/GameSession.js";
import { Overworld } from "/js/Model/overWorld.js";

(() => {
    const room1 = new Overworld ({
        element: document.querySelector(".room-container"),
    });
    room1.init();
})();


/*
// Retrieve the authenticated user and their current game sessions
const user = User.getAuthenticatedUser();
const gameSessions = user.gameSessions;

const currentGameSession = sessionStorage.getItem("currentGameSession");

if (currentGameSession.new) {
    //  create room from scratch
} else if (currentGameSession.progress === 20 && currentGameSession.room === 1) {
    // render room 1 at 20%
}*/
