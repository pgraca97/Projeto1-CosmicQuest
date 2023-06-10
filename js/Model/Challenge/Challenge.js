import { Question } from "./Questions.js";
import { TurnCycle } from "./TurnCycle.js";
import { BattleEvent } from "./BattleEvent.js";
import Team from "./Planets.js";

export class Challenge {
    constructor ({ enemy, onComplete }) {

        this.enemy = enemy;
        this.onComplete = onComplete;
     
        this.combatants = {
            /*
            "player": new Question({
                ...Pizzas.s001, 
                team: "player", 
                hp: 20,
                maxHp: 50,
                xp: 95,
                maxXp: 100,
                level: 1,
                status: null,
                isPlayerControlled: true,
            }, this),
            "player2": new Question({
                ...Pizzas.s002, 
                team: "player", 
                hp: 20,
                maxHp: 50,
                xp: 75,
                maxXp: 100,
                level: 1,
                status: null,
                isPlayerControlled: true,
            }, this),
            "enemy1": new Question({
                ...Pizzas.v001, 
                team: "enemy", 
                hp: 1,
                maxHp: 50,
                xp: 20,
                maxXp: 100,
                level: 1,
                status: null
            }, this),
            "enemy2": new Question({
                ...Pizzas.f001, 
                team: "enemy", 
                hp: 1,
                maxHp: 50,
                xp: 30,
                maxXp: 100,
                level: 1,
                status: null
            }, this),
            */
        };

        this.activeCombatants = {
            player: null, //"player",
            enemy: null //"enemy1",
        }

        //Dynamically add the player team
        window.playerState.lineup.forEach(id => {
            this.addCombatant(id, "player", window.playerState.pizzas[id]);
        });

        //Now the enemy team

        Object.keys(this.enemy.pizzas).forEach(key => {
            this.addCombatant("e_"+key, "enemy", this.enemy.pizzas[key]);
        });


        //Start empty
        this.items = []

        // Add in player items
        window.playerState.items.forEach(item => {
            this.items.push({
                ...item,
                team: "player"
            })
        });
        this.usedInstanceIds = {};
    }

    addCombatant(id, team, config) {

        this.combatants[id] = new Question({
            ...Pizzas[config.pizzaId],
            ...config,
            team,
            isPlayerControlled: team === "player",
        }, this);

        //Populate first active pizza
        this.activeCombatants[team] =this.activeCombatants[team] || id;
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('Challenge');
        this.element.innerHTML = (`
        <div class="Challenge_planetOne">
        <img src="${'/assets/images/characters/people/hero.png'}" alt="Hero">
            
        </div>
        <div class="Challenge_planetTwo">
        <img src="${this.enemy.src}" alt="${this.enemy.name}">
        </div>
        `)
    }

    init (container) {
        this.createElement();
        container.appendChild(this.element);

        this.playerTeam = new Team("player", "Player");
        this.enemyTeam = new Team("enemy", "Bully");

        Object.keys(this.combatants).forEach(key => {
            let combatant = this.combatants[key];
            combatant.id = key;
            combatant.init(this.element);

            //Add to correct Team
            if (combatant.team === "player") {
                this.playerTeam.combatants.push(combatant);
            } else if (combatant.team === "enemy") {
                this.enemyTeam.combatants.push(combatant);
            }

        });

        this.playerTeam.init(this.element);
        this.enemyTeam.init(this.element);

        this.turnCycle = new TurnCycle({
            battle: this,
            onNewEvent: event => {
                return new Promise(resolve => {
                    const battleEvent = new BattleEvent(event, this);
                    battleEvent.init(resolve);
                });
            },
            onWinner: winner => {

                if (winner === "player") {
                    const playerState = window.playerState;
                    Object.keys(playerState.pizzas).forEach(id => {
                        const playerStatePizza = playerState.pizzas[id];
                        const combatant = this.combatants[id];
                        if (combatant) {
                            playerStatePizza.hp = combatant.hp;
                            playerStatePizza.xp = combatant.xp;
                            playerStatePizza.maxXp = combatant.maxXp;
                            playerStatePizza.level = combatant.level;

                        }
                });

                //Get rid of player used items
                playerState.items = playerState.items.filter(item => {
                    return !this.usedInstanceIds[item.instanceId];
                });
            }
                this.element.remove();
                this.onComplete();
            }
        });
        this.turnCycle.init();
    }
}