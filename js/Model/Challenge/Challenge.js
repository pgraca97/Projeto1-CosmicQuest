import { Question } from "./Questions.js";
import { TurnCycle } from "./TurnCycle.js";
import { BattleEvent } from "./BattleEvent.js";

export class Challenge {
    constructor () {
        this.combatants = {
            "player": new Question({
                ...Pizzas.s001, 
                team: "player", 
                hp: 20,
                maxHp: 50,
                xp: 75,
                maxXp: 100,
                level: 1,
                status: null
            }, this),
            "enemy1": new Question({
                ...Pizzas.v001, 
                team: "enemy", 
                hp: 10,
                maxHp: 50,
                xp: 20,
                maxXp: 100,
                level: 1,
                status: null
            }, this),
            "enemy2": new Question({
                ...Pizzas.f001, 
                team: "enemy", 
                hp: 30,
                maxHp: 50,
                xp: 30,
                maxXp: 100,
                level: 1,
                status: null
            }, this),
        };
        this.activeCombatants = {
            player: "player",
            enemy: "enemy1",
        }
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('Challenge');
        this.element.innerHTML = (`
        <div class="Challenge_planetOne">
        <img src="${'/assets/images/characters/people/hero.png'}" alt="Hero">
            
        </div>
        <div class="Challenge_planetTwo">
        <img src="${'/assets/images/characters/people/erio.png'}" alt="Enemy">
        </div>
        `)
    }

    init (container) {
        this.createElement();
        container.appendChild(this.element);

        Object.keys(this.combatants).forEach(key => {
            let combatant = this.combatants[key];
            combatant.id = key;
            combatant.init(this.element);
        });

        this.turnCycle = new TurnCycle({
            battle: this,
            onNewEvent: event => {
                return new Promise(resolve => {
                    const battleEvent = new BattleEvent(event, this);
                    battleEvent.init(resolve);
                });
            }
        });
        this.turnCycle.init();
    }
}