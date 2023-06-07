export class SubmissionMenu {
    constructor({ caster, enemy, onComplete }) {
        this.caster = caster;
        this.enemy = enemy;
        this.onComplete = onComplete;
    }

    decide() {
        this.onComplete({
            action: Actions[ this.caster.actions[0]],
            target: this.enemy,
        })
    }

    init(container) {
        this.decide();
    }

}