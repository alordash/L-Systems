/// <reference path="Miscellaneous/Math.ts" />
/// <reference path="Drawing/Geometry.ts" />
/// <reference path="Drawing/Cursor.ts" />
/// <reference path="L_Systems/L_System.ts" />
/// <reference path="L_Systems/BinaryTree/BinaryTree.ts" />
/// <reference path="UI.ts" />
/// <reference path="constants.ts" />

var continueRendering = false;
UIControl.InitRenderCheck();

let lSystem: L_System = new BinaryTree();

UIControl.CreateParametersPanel(lSystem);
UIControl.CreateOptions();

let evolveCounter = 0;
let evolveTrigger = 5;
function Update(UI = true, evolve = false, draw = false) {
    if (!evolve) {
        evolveCounter = (evolveCounter + 1) % evolveTrigger;
    }
    if ((evolveCounter == 0 || evolve) && !draw) {
        lSystem.EvolveTo(generation);
        _Draw();
    }
    if (draw) {
        lSystem.reset();
        _Draw();
    }
    if (UI) {
        button.innerHTML = `Button ${generation}`;
        SystemStateDisplay.innerHTML = `State: ${lSystem.state}`;
    }
}

var generation = 1;
var SystemStateDisplay = document.getElementById("SystemStateDisplay");
SystemStateDisplay.innerHTML = `State: ${lSystem.state}`;
var button = document.getElementById("Button42");
button.onclick = () => {
    generation++;
    Update(undefined, true);
}

let MainCursor: Cursor;

function _Draw() {
    canvas.background(225, 225, 255);

    canvas.ellipse(SpawnPoint.x, SpawnPoint.y, pWidth);

    lSystem.View(MainCursor);
    MainCursor.loc.SetTo(SpawnTransform);
}

var p5Sketch = (_p: p5) => {

    _p.setup = () => {
        let canvasElement = _p.createCanvas(width, height);
        canvasElement.style('border', '#000000');
        canvasElement.style('borderStyle', 'solid');
        canvasElement.style('border-width', '3px');
        let element = <HTMLElement>canvasElement.elt;
        document.getElementById('Editor').appendChild(element);
        UIControl.InitSpawnMoving(element);
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