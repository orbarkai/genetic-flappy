class Game {

    constructor (pop) {
        this.pop = pop;
        this.speed = 1;
        this.history = [];

        this.initWorld();
    }

    initWorld() {
        this.poles = [];
        this.spawnRate = 180;
        this.spawnCounter = 0;
        this.passed = 0;

        let poleMargin = this.spawnRate * Pole.speed; 
        for (let i = width; i >= 600 + poleMargin; i -= poleMargin) {
            this.poles.push(new Pole(i));
        }
        
    }

    update() {
        //evolve pop if finished
        if (!this.pop.isAlive()) {
            this.addToHistory();
            if (this.pop.evolve());
            this.initWorld();
        }

        this.spawnCounter++;

        //update pop
        this.pop.update(this.poles.sort((a, b) => a.x - b.x));

        //summon poles
        if (this.spawnCounter >= this.spawnRate) {
            this.poles.push(new Pole());
            this.spawnCounter = 0;
        }

        //update poles  
        for (let i = 0; i < this.poles.length; i++) {
            this.poles[i].update();
            if (!this.poles[i].passed && this.poles[i].x + this.poles[i].width < this.pop.birds[0].pos.x - this.pop.birds[0].r) {
                this.poles[i].passed = true;
                this.pop.pass();
                this.passed++;
            }
        }

        //delete unnecesery poles
        for (let i = this.poles.length - 1; i >= 0; i--) {
            if (this.poles[i].x + this.poles[i].width <= 0) this.poles.splice(i, 1);
        }
    }

    draw() {
        this.pop.show();

        //show poles
        for (let i = 0; i < this.poles.length; i++) {
            this.poles[i].show();
        }

        ui(this.history, this.passed);
    }

    addToHistory() {
        let gen = {
            generation: this.pop.generation,
            bestScore: this.pop.best().score,
            avgScore: this.pop.avgScore()
        }
        this.history.push(gen);
    }

}