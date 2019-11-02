function ui(history, passed) {
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