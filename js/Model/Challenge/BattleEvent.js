import { TextMessage } from '/js/Model/TextMessage.js'

import { SubmissionMenu } from '/js/Model/Challenge/SubmissionMenu.js'

import { utils } from '/js/Model/Utils.js'


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
            if (action.targetType === "friendly") {
                who = caster;
            }

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

            target.pizzaElement.classList.remove("battle-damage-blink");
            resolve();
        }

        submissionMenu(resolve) {
            const menu = new SubmissionMenu({
                caster: this.event.caster,
                enemy: this.event.enemy,
                onComplete: submission => {
                    resolve(submission);
                }
            });
            menu.init( this.battle.element);
        }

        animation(resolve) {
            const actionFunction = BattleAnimations[this.event.animation];
            actionFunction(this.event, resolve);
        }

        init(resolve) {
            this[this.event.type](resolve);
        }
}