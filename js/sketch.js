let game;
let slider;
let pop;

function setup() {
    createCanvas(windowWidth, windowHeight);

    pop = new Population(30, 0.1);
    game = new Game(pop);
    
    slider = createSlider(1, 100, 1);
    slider.position(100, height - 30);
}


function draw() {

    background(50);

    for (let i = 0; i < slider.value(); i++) {
        game.update();
    }

    game.draw();
}