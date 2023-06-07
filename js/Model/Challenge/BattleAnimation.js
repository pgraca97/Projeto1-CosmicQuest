import { utils } from '/js/Model/Utils.js'

window.BattleAnimations = {
    async spin(event, onComplete) {
        const element = event.caster.pizzaElement;
        const animationClassName = event.caster.team === "player"? "battle-spin-right" : "battle-spin-left";
        element.classList.add(animationClassName);

        //Remove class when animation is fully complete
        element.addEventListener("animationend", () => {
            element.classList.remove(animationClassName);
        }, { once: true });

        //Continue battle cycle right around when the pizzas collide
        await utils.wait(100);
        onComplete();
    },

    async glob(event, onComplete) {
        const {caster} = event;
        let div = document.createElement("div");
        div.classList.add("glob-orb");
        div.classList.add(caster.team === "player"? "battle-glob-right" : "battle-glob-left");

        div.innerHTML = (`
            <svg viewbox="0 0 32 32" width="32" height="32">
                <circle cx="16" cy="16" r="16" fill="${event.color}" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></circle>
            </svg>
        `);

        //Remove class when animation is fully complete
        div.addEventListener("animationend", () => {
            div.remove();
        });

        document.querySelector(".Challenge").appendChild(div);

        await utils.wait(820);
        onComplete();
    }
}