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
    createCanvas(1600, 680);
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

function ui() {
    let uiWidth = 400;

    //bg
    fill(0, 200);
    rect(0, 0, uiWidth, height);

    //top
    textAlign(LEFT, TOP);
    fill(255);
    textSize(25);
    text("generation " + pop.generation, 10, 10);
    textAlign(RIGHT, TOP);
    text("score - " + passed, uiWidth - 10, 10);

    //avg graph
    let avgArr = history.slice(0).map((v) => v.avgScore, );
    graph(avgArr, 20, 100, uiWidth - 20, 290, "Avrage Score");

    //best graph
    let bestArr = history.slice(0).map((v) => v.bestScore);
    graph(bestArr, 20, 390, uiWidth - 20, 580, "Best Score");

    //bottom
    textAlign(LEFT, BOTTOM);
    textSize(20);
    text("speed:", 10, height - 10);
}

function graph(arr, x1, y1, x2, y2, title = "graph") {

    let widthG = x2 - x1;
    let heightG = y2 - y1;

    //column width
    let cWidth = 60;
    if (cWidth * arr.length > widthG) cWidth = widthG / arr.length;

    //calculate best
    let best = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > best) best = arr[i];
    }

    //title
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(title, x1, y1 - 40, widthG, 30);

    //text size
    let textS = cWidth / 3 < 10 ? 10 : cWidth / 3;

    stroke(0);
    textSize(textS);
    textAlign(CENTER, CENTER);
    for (let i = 0; i < arr.length; i++) {

        let y = -arr[i] * 20 + 4;
        if (best * 20 + 4 > heightG) y = arr[i] / best * -heightG;

        strokeWeight(1);

        //if hover
        if (mouseX > x1 + cWidth * i && mouseX < x1 + cWidth * (i + 1) && mouseY > y1 && mouseY < y2) {
            fill(100, 200, 50);
            rect(x1 + cWidth * i, y2, cWidth, y);
        } else {
            fill(255);
            rect(x1 + cWidth * i, y2, cWidth, y);
        }

        fill(255);
        textSize(textS);
        textAlign(CENTER, CENTER);
        if (i % floor(arr.length / 10 + 1) == 0) text(i + 1, x1 + cWidth * i, y2, cWidth, textS + 20);
    }

}