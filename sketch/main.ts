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

let width = 800;
let height = 800;

const SpawnPoint = new Point(width / 2, height - 100);
const pWidth = 10;

const SpawnTransform = new Transform(SpawnPoint, 90);

let binaryTree = new BinaryTree(5, 45);

var SystemStateDisplay = document.getElementById("SystemStateDisplay");
SystemStateDisplay.innerHTML = `State: ${binaryTree.state}`
document.getElementById("Button42").onclick = () => {
    binaryTree.Evolve();
    SystemStateDisplay.innerHTML = `State: ${binaryTree.state}`;
}

var p5Sketch = (_p: p5) => {
    let MainCursor = new Cursor(_p, SpawnTransform.Copy());

    _p.setup = () => {
        canvas = _p.createCanvas(width, height);
        canvas.style('border', '#000000');
        canvas.style('borderStyle', 'solid');
    };

    _p.draw = () => {
        if (continueRendering) {
            _p.background(225, 225, 255);

            _p.fill(255);
            _p.stroke(0);
            _p.strokeWeight(2);
            _p.line(MathHelper.randInt(0, width), MathHelper.randInt(0, height), MathHelper.randInt(0, width), MathHelper.randInt(0, height));

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