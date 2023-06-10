import KeyPressListener from "./KeyPressListener.js";

export default class KeyboardMenu {
    constructor() {
        this.options = []; // set by updater method
        this.up = null;
        this.down = null;
        this.prevFocus = null;
    }

    setOptions(options) {
        this.options = options;
        this.element.innerHTML = this.options.map((option, index) => {
            const disabledAttribute = option.disabled? 'disabled' : '';

            return (`
                <div class="option">
                    <button ${disabledAttribute} data-button="${index}" data-description="${option.description}">
                        ${option.label}
                    </button>
                    <span class="right">${option.right ? option.right() : ''}</span>
                </div>
                `);
        }).join('');

        this.element.querySelectorAll('button').forEach((button) => {

            button.addEventListener('click', () => {
                const chosenOption = this.options[ Number(button.dataset.button) ];
                chosenOption.handler();
            });
            button.addEventListener('mouseenter', (event) => {
                button.focus();
            });
            button.addEventListener("focus", (event) => {
                this.prevFocus = button;
                this.descriptionElementText.innerText = button.dataset.description;
            });
        });

        setTimeout(() => {
            this.element.querySelector("button[data-button]:not([disabled])").focus();
        }, 10);

    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('KeyboardMenu');

        //Description box element
        this.descriptionElement = document.createElement('div');
        this.descriptionElement.classList.add('DescriptionBox');
        this.descriptionElement.innerHTML = (`<p>I will provide information!</p>`)
        this.descriptionElementText = this.descriptionElement.querySelector('p');
    }

    end() {

        // Remove menu element and description element
        this.element.remove();
        this.descriptionElement.remove();
        //Clean up the bindings
        this.up.unbind();
        this.down.unbind();
    }

    init(container) {
        this.createElement();
        container.appendChild(this.descriptionElement);
        container.appendChild(this.element);
    

        this.up = new KeyPressListener("ArrowUp", () => {
            //Find the current focused element and focus the next or the previous element
            const currentFocusedElement = Number(this.prevFocus.getAttribute('data-button'));
            // Start at the end of the array and work its way up
            const previousFocusedElement = Array.from(this.element.querySelectorAll('button[data-button]')).reverse().find(el => {
                return el.dataset.button < currentFocusedElement &&!el.disabled;
            })
            previousFocusedElement?.focus();
        });
        this.down = new KeyPressListener("ArrowDown", () => {
            const currentFocusedElement = Number(this.prevFocus.getAttribute('data-button'));
            const nextFocusedElement = Array.from(this.element.querySelectorAll('button[data-button]')).find(el => {
                return el.dataset.button > currentFocusedElement && !el.disabled;
            })
            nextFocusedElement?.focus();
        });
    }
    
}