var continueRendering = true;
var continueRenderingCheckbox = document.getElementById("ContinueRendering");
continueRenderingCheckbox.checked = continueRendering;
continueRenderingCheckbox.onchange = function () {
    continueRendering = continueRenderingCheckbox.checked;
};
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var width = 900;
var height = 900;
var sketch = function (p) {
    p.setup = function () {
        canvas = p.createCanvas(width, height);
        canvas.style('border', '#000000');
        canvas.style('borderStyle', 'solid');
    };
    p.draw = function () {
        if (continueRendering) {
            p.background(225, 225, 255);
            p.fill(255);
            p.stroke(0);
            p.strokeWeight(2);
            p.line(randomInt(0, width), randomInt(0, height), randomInt(0, width), randomInt(0, height));
        }
    };
};
var canvas;
function main() {
    console.log("Creating canvas " + width + " x " + height);
    new p5(sketch);
}
main();
//# sourceMappingURL=build.js.map