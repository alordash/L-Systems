var continueRendering = true;
var continueRenderingCheckbox = <HTMLInputElement>document.getElementById("ContinueRendering");
continueRenderingCheckbox.checked = continueRendering;
continueRenderingCheckbox.onchange = function () {
    continueRendering = continueRenderingCheckbox.checked;
}

var canvas: HTMLCanvasElement;
width = 900;
height = 900;

function setup() {
    console.log(`Creating canvas ${width} x ${height}`);
    createCanvas(width, height);
    canvas = <HTMLCanvasElement>document.getElementById("defaultCanvas0");
    canvas.style.border = "#000000";
    canvas.style.borderStyle = "solid";
}

function draw() {
    if (continueRendering) {
        background(225, 225, 255);

        fill(255);
        stroke(0);
        strokeWeight(2);
    }
}