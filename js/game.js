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


        this.pole_speed = 2;
        this.pole_width = 50;
        this.pole_height = 250;

        let poleMargin = this.spawnRate * this.pole_speed; 
        for (let i = width; i >= 700 + poleMargin; i -= poleMargin) {
            this.poles.push(new Pole(this.pole_height, this.pole_width, this.pole_speed, i));
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
            this.poles.push(new Pole(this.pole_height, this.pole_width, this.pole_speed));
            this.spawnCounter = 0;
        }

        //update poles  
        for (let i = 0; i < this.poles.length; i++) {
            this.poles[i].update();
            if (!this.poles[i].passed && this.poles[i].x + this.poles[i].width < this.pop.birds[0].pos.x - this.pop.birds[0].r) {
                this.poles[i].passed = true;
                this.pop.pass();
                this.passed++;
                if (this.passed % 5 == 0) {
                    this.spawnRate *= 0.95;
                    this.pole_speed *= 1.15;
                }
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