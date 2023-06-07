export class RevealingText {
    constructor(config) {
        this.element = config.element;
        this.text = config.text;
        this.speed = config.speed || 30;

        this.timeout = null;
        this.isDone = false;
    }

    revealOneCharacter(list) {
        const next = list.splice(0, 1)[0];
        next.span.classList.add('revealed');

        if (list.length > 0) {
            this.timeout = setTimeout(() => {
                            this.revealOneCharacter(list);
                        }, next.delayAfter);
        } else {
            this.isDone = true;
    
        }
    }

    warpToDone() {
        clearTimeout(this.timeout);
        this.isDone = true;

        this.element.querySelectorAll('span').forEach(span => {
            span.classList.add('revealed');
        });
    }

    init() {
        let characters = []
        this.text.split('').forEach(char => {

            //Create each span, add to element in DOM
            let span = document.createElement('span');
            span.innerText = char;
            this.element.appendChild(span);

            //Add this span to our internal state Array
            characters.push({
                span,
                delayAfter: char === " " ? 0 : this.speed
            });
        });

        this.revealOneCharacter(characters);
    }


}