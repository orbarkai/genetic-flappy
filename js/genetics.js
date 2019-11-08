class Population {

    constructor(size, mr) {
        this.birds = new Array(size).fill(0).map(() => new Bird());
        this.mr = mr;
        this.generation = 1;
        this.bestEver = this.best();
        this.size = size;
    }

    show() {
        for (let bird of this.birds) {
            bird.show();
        }
    }

    update(poles) {
        for (let bird of this.birds) {
            bird.update(poles);
        }
    }

    isAlive() {
        for (let bird of this.birds) {
            if (bird.alive) return true;
        }
        return false;
    }

    calcFitness() {
        let total = 0;
        for (let bird of this.birds) {
            total += bird.score;
        }

        total /= this.birds.length;

        for (let bird of this.birds) {
            bird.fitness = bird.score / total;
        }
    }

    evolve() {
        this.generation++;

        //calc fitness
        this.calcFitness();

        //assign best to bestEver?
        if (this.best().score > this.bestEver.score) this.bestEver = this.best();

        //init mating pool (selection)
        let pool = [];
        for (let i = 0; i < this.birds.length; i++) {
            let count = this.birds[i].fitness * 100;
            for (let j = 0; j < count; j++) {
                pool.push(i);
            }
        }

        //init new pop
        let newPop = [];

        //crossover and mutation
        for (let i = 0; i < this.birds.length; i++) {
            let dad = this.birds[random(pool)].clone();
            let mom = this.birds[random(pool)].clone();
            let child = dad.crossOver(mom);
            child.mutate(this.mr);
            newPop.push(child);
        }

        //dispose last gen
        for (let bird of this.birds) bird.brain.dispose();

        //assign new pop
        this.birds = newPop;
    }

    best() {
        let best = this.birds[0];
        for (let bird of this.birds) {
            if (bird.score > best.score) best = bird;
        }
        return best;
    }

    pass() {
        for (let bird of this.birds) {
            if (bird.alive) {
                bird.passed++;
            }
        }
    }

    avgPassed() {
        let avg = 0;
        for (let bird of this.birds) avg += bird.passed;
        return avg / this.size;
    }

    avgScore() {
        let avg = 0;
        for (let bird of this.birds) avg += bird.score;
        return avg / this.size;
    }

}