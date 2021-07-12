/// <reference path="Miscellaneous/Math.ts" />
/// <reference path="Drawing/Geometry.ts" />
/// <reference path="Drawing/Cursor.ts" />
/// <reference path="L_Systems/L_System.ts" />
/// <reference path="L_Systems/BinaryTree/BinaryTree.ts" />
/// <reference path="UI.ts" />
/// <reference path="constants.ts" />

var continueRendering = false;
UIControl.InitRenderCheck();

var stepRange = (<HTMLInputElement>document.getElementById("StepRange"));
var angleRange = (<HTMLInputElement>document.getElementById("AngleRange"));

let binaryTree = new BinaryTree(+stepRange.value, +angleRange.value, 16, true, 35);

let evolveCounter = 0;
const evolveTrigger = 10;
function Update(UI = true, evolve = false) {
    if (!evolve) {
        evolveCounter = (evolveCounter + 1) % evolveTrigger;
    }
    if (evolveCounter == 0 || evolve) {
        binaryTree.EvolveTo(generation);
        binaryTree.step = +stepRange.value;
        binaryTree.angle = +angleRange.value;
        _Draw();
    }
    if (UI) {
        button.innerHTML = `Button ${generation}`;
        SystemStateDisplay.innerHTML = `State: ${binaryTree.state}`;
    }
}

stepRange.onchange = () => {
    Update();
}
stepRange.onmousemove = (e) => {
    if (e.buttons) {
        Update();
    }
}

angleRange.onchange = () => {
    Update();
}
angleRange.onmousemove = (e) => {
    if (e.buttons) {
        Update();
    }
}

var generation = 1;
var SystemStateDisplay = document.getElementById("SystemStateDisplay");
SystemStateDisplay.innerHTML = `State: ${binaryTree.state}`;
var button = document.getElementById("Button42");
button.onclick = () => {
    generation++;
    Update(undefined, true);
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
        let canvasElement = _p.createCanvas(width, height);
        canvasElement.style('border', '#000000');
        canvasElement.style('borderStyle', 'solid');
        canvasElement.style('border-width', '3px');
        UIControl.InitSpawnMoving(<HTMLElement>canvasElement.elt);
        _p.fill(255);
        _p.stroke(0);
        _p.strokeWeight(2);
    };

    _p.draw = () => {
        if (continueRendering) {
            Update(false);
        }
    };
};

let canvas: p5;

function main() {
    console.log('MathHelper.randInt(100,200) :>> ', MathHelper.randInt(100, 200));
    console.log(`Creating canvas ${width} x ${height}`);
    canvas = new p5(p5Sketch);
    MainCursor = new Cursor(canvas, SpawnTransform.Copy());
}

main();