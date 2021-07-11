/// <reference path="Miscellaneous/Math.ts" />
/// <reference path="Drawing/Geometry.ts" />
/// <reference path="Drawing/Cursor.ts" />
/// <reference path="L_Systems/L_System.ts" />
/// <reference path="L_Systems/BinaryTree/BinaryTree.ts" />

var continueRendering = false;
var continueRenderingCheckbox = <HTMLInputElement>document.getElementById("ContinueRendering");
continueRenderingCheckbox.checked = continueRendering;
continueRenderingCheckbox.onchange = function () {
    continueRendering = continueRenderingCheckbox.checked;
}

let width = 1200;
let height = 1200;

const SpawnPoint = new Point(width / 2, height - 100);
const pWidth = 10;

const SpawnTransform = new Transform(SpawnPoint, 90);

var stepRange = (<HTMLInputElement>document.getElementById("StepRange"));
var angleRange = (<HTMLInputElement>document.getElementById("AngleRange"));

let binaryTree = new BinaryTree(+stepRange.value, +angleRange.value, 16, true, 35);

function Update() {
    binaryTree.EvolveTo(generation);
    binaryTree.step = +stepRange.value;
    binaryTree.angle = +angleRange.value;
    button.innerHTML = `Button ${generation}`;
    SystemStateDisplay.innerHTML = `State: ${binaryTree.state}`;
    _Draw();
}

stepRange.onchange = () => {
    Update();
}
stepRange.onmousemove = (e) => {
    if(e.buttons) {
        Update();
    }
}

angleRange.onchange = () => {
    Update();
}
angleRange.onmousemove = (e) => {
    if(e.buttons) {
        Update();
    }
}

var generation = 1;
var SystemStateDisplay = document.getElementById("SystemStateDisplay");
SystemStateDisplay.innerHTML = `State: ${binaryTree.state}`;
var button = document.getElementById("Button42");
button.onclick = () => {
    generation++;
    Update();
}

let MainCursor: Cursor;

function _Draw() {
    canvas.background(225, 225, 255);

    canvas.ellipse(SpawnPoint.x, SpawnPoint.y, pWidth);

    binaryTree.View(MainCursor);
    MainCursor.loc.SetTo(SpawnTransform);
}

var p5Sketch = (_p: p5) => {

    _p.setup = () => {
        canvasElement = _p.createCanvas(width, height);
        canvasElement.style('border', '#000000');
        canvasElement.style('borderStyle', 'solid');
        canvasElement.style('border-width', '3px');
        _p.fill(255);
        _p.stroke(0);
        _p.strokeWeight(2);
    };

    _p.draw = () => {
        if (continueRendering) {
            _p.background(225, 225, 255);

            _p.ellipse(SpawnPoint.x, SpawnPoint.y, pWidth);

            binaryTree.View(MainCursor);
            MainCursor.loc.SetTo(SpawnTransform);
        }
    };
};

let canvasElement: p5.Renderer;
let canvas: p5;

function main() {
    console.log('MathHelper.randInt(100,200) :>> ', MathHelper.randInt(100, 200));
    console.log(`Creating canvas ${width} x ${height}`);
    canvas = new p5(p5Sketch);
    MainCursor = new Cursor(canvas, SpawnTransform.Copy());
}

main();