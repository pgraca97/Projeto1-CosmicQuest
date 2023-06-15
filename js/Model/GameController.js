class GameController {
    constructor() {
        this.isGameOver = false;
        this.gameEvents = [];
        console.log(this.gameEvents)
    }

    addGameEvent(event) {
        this.gameEvents.push(event);
    }

    gameOver() {
        this.isGameOver = true;
        this.pauseGame();
    }

    restartGame() {
        this.isGameOver = false;
        this.resetGame();
        this.resumeGame();
        console.log('Restarted game')
    }

    pauseGame() {
        for (let event of this.gameEvents) {
            if (event.pause) {
                event.pause();
            }
        }
    }

    resumeGame() {
        for (let event of this.gameEvents) {
            if (event.resume) {
                event.resume();
                console.dir(event);
            }
        }
    }

    resetGame() {
        // Your reset game logic here, such as resetting all game entities to their initial state
    }

}

let gameController = new GameController();
export default gameController;