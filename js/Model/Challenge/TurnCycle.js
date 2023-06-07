export class TurnCycle {
    constructor({ battle, onNewEvent }) {
            this.battle = battle;
            this.onNewEvent = onNewEvent;
            this.currentTeam = "player"; //or "enemy"
        }

        async turn() {
            const casterId = this.battle.activeCombatants[this.currentTeam];
            console.log(`Caster ID is ${casterId}`);
            const caster = this.battle.combatants[casterId];
            console.log(`Caster is ${caster}`);
            const enemyId = this.battle.activeCombatants[caster.team === "player"? "enemy" : "player"];
            console.log(`Enemy is ${enemyId}`);
            const enemy = this.battle.combatants[enemyId];

            const submission = await this.onNewEvent({
                type: "submissionMenu",
                caster,
                enemy
            });



            const resultingEvents = caster.getReplacedEvents(submission.action.success);

            for (let i = 0; i < resultingEvents.length; i++) {
                const event = {
                    ...resultingEvents[i],
                    submission,
                    action: submission.action,
                    caster,
                    target: submission.target,
                }
                await this.onNewEvent(event);
            }

            // Check for post events
            // Do things AFTER the original turn submissions have been processed
            const postEvents = caster.getPostEvents();
            for (let i = 0; i < postEvents.length; i++) {
                const event = {
                    ...postEvents[i],
                    submission,
                    action: submission.action,
                    caster,
                    target: submission.target,
                }
                await this.onNewEvent(event);
            }


            //Check for status expires
            const expiredEvent = caster.decrementStatus();
            if (expiredEvent) {
                await this.onNewEvent(expiredEvent);
            }

            this.currentTeam = this.currentTeam === "player"? "enemy" : "player";
            this.turn();
        }

        async init() {
            await this.onNewEvent({
                type: "textMessage",
                text: "Welcome to the battle!"
            });

            //Start the first turn!
            this.turn();
        }
}