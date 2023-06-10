import KeyboardMenu from "../KeyboardMenu.js";

export class SubmissionMenu {
    constructor({ caster, enemy, onComplete, items, replacements }) {
        this.caster = caster;
        this.enemy = enemy;
        this.replacements = replacements;
        this.onComplete = onComplete;

        console.log(this.replacements);

        let quantityMap = {};
        items.forEach(item => {
            if (item.team === caster.team) {

                let existing = quantityMap[item.actionId];
                if (existing) {
                    existing.quantity ++;
                } else {
                    quantityMap[item.actionId] = {
                        actionId: item.actionId,
                        quantity: 1,
                        instanceId : item.instanceId,
                    };
                }
            }
        });
        this.items = Object.values(quantityMap);
    }

    getPages() {

        const goBackOption = {
            label: 'Back',
            description: 'Go back to the main menu',
            handler: () => {
                this.keyboardMenu.setOptions(this.getPages().root);
            }
        }
        return {
            root: [
                {
                    label: 'Attack',
                    description: 'Choose an attack to perform',
                    handler: () => {
                        // Do something when chosen...
                        this.keyboardMenu.setOptions(this.getPages().attacks);
                    }
                },
                {
                    label: 'Items',
                    description: 'Choose an item',
               
                    handler: () => {
                        // Go to items page...
                        this.keyboardMenu.setOptions(this.getPages().items);
                    }
                },
                {
                    label: 'Swap',
                    description: 'Swap items',
                    handler: () => {
                        // Do something when chosen...
                        this.keyboardMenu.setOptions(this.getPages().replacements);
                    }
                }
            ],
            attacks : [
                ...this.caster.actions  // an array of strings, transform those strings into the action in the format needed
                .map (key => {
                    const action = Actions[key];
                    return {
                        label: action.name,
                        description: action.description,
                        handler: () => {
                            // Do something when chosen...
                            this.menuSubmit(action);
                        }
                    }
                }),
                goBackOption
            ],
            items : [
                ...this.items  // an array of strings, transform those strings into the action in the format needed
                .map (item => {
                    const action = Actions[item.actionId];
                    return {
                        label: action.name,
                        description: action.description,
                        right: () => { return 'x'+ item.quantity },
                        handler: () => {
                            // Do something when chosen...
                            this.menuSubmit(action, item.instanceId);
                        }
                    }
                }),
                goBackOption
            ],
            replacements : [
                ...this.replacements.map(replacement => {
                    return {
                        label: replacement.name,
                        description: replacement.description,
                        handler: () => {
                            // Do something when chosen...
                            this.menuSubmitReplacement(replacement);
                        }
                    }
                }),
                goBackOption
            ],
        }
    }

    menuSubmitReplacement(replacement) {
        this.keyboardMenu?.end();
        this.onComplete({
            replacement
        });
        
    };

    menuSubmit(action, instanceId = null) {

        this.keyboardMenu?.end();

        this.onComplete({
            action,
            target: action.targetType === "friendly" ? this.caster : this.enemy,
            instanceId
        });
    }

    decide() {
        //TODO: Enemies should randomly decide what to do
        this.menuSubmit(Actions [this.caster.actions[0]]);
    }

    showMenu(container) {
        this.keyboardMenu = new KeyboardMenu();
        this.keyboardMenu.init(container);
        this.keyboardMenu.setOptions(this.getPages().root);
    }

    init(container) {
        // If is player controlled show menu
        if (this.caster.isPlayerControlled) {
            this.showMenu(container);
        } else {
        this.decide();
        }
    }

}