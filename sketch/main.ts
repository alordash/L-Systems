var continueRendering = true;
var continueRenderingCheckbox = <HTMLInputElement>document.getElementById("ContinueRendering");
continueRenderingCheckbox.checked = continueRendering;
continueRenderingCheckbox.onchange = function () {
    continueRendering = continueRenderingCheckbox.checked;
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let width = 900;
let height = 900;

var sketch = (p: p5) => {
    p.setup = () => {
        canvas = p.createCanvas(width, height);
        canvas.style('border', '#000000');
        canvas.style('borderStyle', 'solid');
    };

    p.draw = () => {
        if (continueRendering) {
            p.background(225, 225, 255);

            p.fill(255);
            p.stroke(0);
            p.strokeWeight(2);
            p.line(randomInt(0, width), randomInt(0, height), randomInt(0, width), randomInt(0, height));
        }
    };
};

let canvas: p5.Renderer;

function main() {
    console.log(`Creating canvas ${width} x ${height}`);
    new p5(sketch);
}

main();