import * as User from "/js/Model/User.js";
import * as GameSession from "/js/Model/GameSession.js";
import { Overworld } from "/js/Model/overWorld.js";
import OverworldEvent from "/js/Model/OverworldEvent.js";

(() => {
    const room1 = new Overworld ({
        element: document.querySelector(".room-container"),
    });
    room1.init();
})();

document.addEventListener('confirmation', (event) => {
    const confirmationBox = document.createElement('div');
    confirmationBox.classList.add('confirmationBox');
    confirmationBox.innerHTML = `
        <p>${event.detail.text}</p>
        <button class="confirmButton">Yes</button>
        <button class="cancelButton">No</button>
    `;
    document.querySelector(".room-container").appendChild(confirmationBox);

    confirmationBox.querySelector('.confirmButton').addEventListener('click', async () => {
        confirmationBox.remove();
        const choiceMadeEvent = new CustomEvent("ChoiceMade", { detail: { choice: 'confirm' }});
        document.dispatchEvent(choiceMadeEvent);
    });

    confirmationBox.querySelector('.cancelButton').addEventListener('click', async () => {
        confirmationBox.remove();
        const choiceMadeEvent = new CustomEvent("ChoiceMade", { detail: { choice: 'cancel' }});
        document.dispatchEvent(choiceMadeEvent);
    });
});
