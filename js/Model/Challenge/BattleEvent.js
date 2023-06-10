import { TextMessage } from '/js/Model/TextMessage.js'

import { SubmissionMenu } from '/js/Model/Challenge/SubmissionMenu.js'

import ReplacementMenu from '/js/Model/Challenge/ReplacementMenu.js';

import { utils } from '/js/Model/Utils.js'
import Team from "./Planets.js";
import { Challenge } from './Challenge.js';

export class BattleEvent {
    constructor(event, battle) {
            this.event = event;
           this.battle = battle;
        }

        textMessage(resolve) {

            const text = this.event.text
            .replace("{CASTER}", this.event.caster?.name)
            .replace("{TARGET}", this.event.target?.name)
            .replace("{ACTION}", this.event.action?.name)

            const message = new TextMessage({
                text,
                onComplete: () => {
                    resolve();
                }
            });

            message.init( this.battle.element);
        }

        async stateChange(resolve) {
            const {caster, target, damage, recover, status, action} = this.event;
            let who = this.event.onCaster? caster : target;


            if (damage) {
                //modify the target to have less HP
                target.update({
                    hp: target.hp - damage
                })

                //start blinking the target
                target.pizzaElement.classList.add("battle-damage-blink");
            }

            if (recover) {

                let newHP = who.hp + recover;
                if (newHP > who.maxHp) {
                    newHP = who.maxHp;
                }
                who.update({
                    hp: newHP
                })
            }

            if(status) {
                who.update({
                    status: {...status}
                })
            }

            if (status === null) {
                who.update({
                    status: null
                })
            }

            //Wait a little bit
            //stop blinking the target
            await utils.wait(600);

            //Update Team components
            this.battle.playerTeam.update();
            this.battle.enemyTeam.update();

            target.pizzaElement.classList.remove("battle-damage-blink");
            resolve();
        }

        submissionMenu(resolve) {

            const { caster } = this.event
            const menu = new SubmissionMenu({
                caster: this.event.caster,
                enemy: this.event.enemy,
                items: this.battle.items,
                replacements: Object.values(this.battle.combatants).filter(c => {
                    return c.id !== caster.id && c.team === caster.team && c.hp > 0;
                }),
                onComplete: submission => {
                    resolve(submission);
                }
            });
            menu.init( this.battle.element);
        }

        replacementMenu(resolve) {
            const menu = new ReplacementMenu({
                replacements: Object.values(this.battle.combatants).filter(c => {
                    return c.team === this.event.team && c.hp > 0;
                    }),
                onComplete: replacement => {
                    resolve(replacement);
                },
            });
            menu.init(this.battle.element);
        }

        async replace(resolve) {
            const {replacement} = this.event;

            //Clear out the old combatant
            
            const previousCombatant = this.battle.combatants[this.battle.activeCombatants[replacement.team]];
            this.battle.activeCombatants[replacement.team] = null;
            previousCombatant.update();
            await utils.wait(500);

            //In with the new!
            this.battle.activeCombatants[replacement.team] = replacement.id;
            replacement.update();
            await utils.wait(500);

                        //Update Team components
            this.battle.playerTeam.update();
            this.battle.enemyTeam.update();

            resolve();
        }

        giveXp(resolve) {
            let amount = this.event.xp;
            const {combatant} = this.event;
            const step = () => {
                if (amount > 0) {
                    amount --;
                    combatant.xp ++;

                    //Check if we've hit level up point
                    if (combatant.xp === combatant.maxXp) {
                        combatant.xp = 0;
                        combatant.maxXp = 100;
                        combatant.level ++;
                    }

                    combatant.update();
                    requestAnimationFrame(step);
                    return;
                }
                resolve();
            }
            requestAnimationFrame(step)
        }

        animation(resolve) {
            const actionFunction = BattleAnimations[this.event.animation];
            actionFunction(this.event, resolve);
        }

        init(resolve) {
            this[this.event.type](resolve);
        }
}