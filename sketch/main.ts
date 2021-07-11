/// <reference path="Miscellaneous/Math.ts" />
/// <reference path="Drawing/Geometry.ts" />
/// <reference path="Drawing/Cursor.ts" />
/// <reference path="L_Systems/L_System.ts" />
/// <reference path="L_Systems/BinaryTree/BinaryTree.ts" />

var continueRendering = true;
var continueRenderingCheckbox = <HTMLInputElement>document.getElementById("ContinueRendering");
continueRenderingCheckbox.checked = continueRendering;
continueRenderingCheckbox.onchange = function () {
    continueRendering = continueRenderingCheckbox.checked;
}

let width = 1200;
let height = 1200;

const SpawnPoint = new Point(width / 2, height - 300);
const pWidth = 10;

const SpawnTransform = new Transform(SpawnPoint, 90);

var stepRange = (<HTMLInputElement>document.getElementById("StepRange"));
var angleRange = (<HTMLInputElement>document.getElementById("AngleRange"));

let binaryTree = new BinaryTree(+stepRange.value, +angleRange.value);

stepRange.onmousemove = stepRange.onchange = () => {
    binaryTree.step = +stepRange.value;
}

angleRange.onmousemove = angleRange.onchange = () => {
    binaryTree.angle = +angleRange.value;
}

var generation = 1;
var SystemStateDisplay = document.getElementById("SystemStateDisplay");
SystemStateDisplay.innerHTML = `State: ${binaryTree.state}`;
var button = document.getElementById("Button42");
button.onclick = () => {
    binaryTree.Evolve();
    SystemStateDisplay.innerHTML = `State: ${binaryTree.state}`;
    generation++;
    button.innerHTML = `Button ${generation}`;
}

var p5Sketch = (_p: p5) => {
    let MainCursor = new Cursor(_p, SpawnTransform.Copy());

    _p.setup = () => {
        canvas = _p.createCanvas(width, height);
        canvas.style('border', '#000000');
        canvas.style('borderStyle', 'solid');
        canvas.style('border-width', '3px');
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

let canvas: p5.Renderer;

function main() {
    console.log('MathHelper.randInt(100,200) :>> ', MathHelper.randInt(100, 200));
    console.log(`Creating canvas ${width} x ${height}`);
    new p5(p5Sketch);
}

main();