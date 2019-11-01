let poles;
let spawnRate;
let spawnCounter;
let pop;
let slider;
let passed;

let pole_speed;
let pole_width;
let pole_height;

let history = [];

function initWorld() {
    poles = [new Pole(pole_height, pole_width, pole_speed)];
    spawnRate = 180;
    spawnCounter = 0;
    passed = 0;


    pole_speed = 2;
    pole_width = 50;
    pole_height = 180;

}

function setup() {
    createCanvas(windowWidth, windowHeight);
    initWorld();

    pop = new Population(30, 0.1);

    slider = createSlider(1, 100, 1);
    slider.position(100, height - 30);

    poles.push(new Pole(pole_height, pole_width, pole_speed));

}


function draw() {

    background(50);

    for (let i = 0; i < slider.value(); i++) {

        //evolve pop if finished
        if (!pop.isAlive()) {
            addToHistory();
            pop.evolve();
            initWorld();
        }

        spawnCounter++;

        //update pop
        pop.update(poles);

        //summon poles
        if (spawnCounter >= spawnRate) {
            poles.push(new Pole(pole_height, pole_width, pole_speed));
            spawnCounter = 0;
        }

        //update poles  
        for (let i = 0; i < poles.length; i++) {
            poles[i].update();
            if (poles[i].passed == false && poles[i].x + poles[i].width < pop.birds[0].pos.x - pop.birds[0].r) {
                poles[i].passed = true;
                pop.pass();
                passed++;
                if (passed % 5 == 0) {
                    spawnRate *= 0.95;
                    pole_speed *= 1.15;
                }
            }
        }

        //delete unnecesery poles
        for (let i = poles.length - 1; i >= 0; i--) {
            if (poles[i].x + poles[i].width <= 0) poles.splice(i, 1);
        }
    }

    pop.show();

    //show poles
    for (let i = 0; i < poles.length; i++) {
        poles[i].show();
    }

    ui();
}

function addToHistory() {
    let gen = {
        generation: pop.generation,
        bestScore: pop.best().score,
        avgScore: pop.avgScore()
    }
    history.push(gen);
}