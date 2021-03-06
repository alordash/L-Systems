/// <reference path="Miscellaneous/Math.ts" />
/// <reference path="Drawing/Geometry.ts" />
/// <reference path="Drawing/Cursor.ts" />
/// <reference path="L_Systems/L_System.ts" />
/// <reference path="L_Systems/BinaryTree/BinaryTree.ts" />
/// <reference path="UI.ts" />
/// <reference path="constants.ts" />

let lSystem: L_System = new BinaryTree();

UIControl.Init();

let evolveCounter = 0;
let evolveTrigger = 5;
function Update(UI = true, evolve = false, draw = false, randomize = false, countEnergy = false) {
    if (randomize) {
        lSystem.Randomize();
    }
    if (!evolve) {
        evolveCounter = (evolveCounter + 1) % evolveTrigger;
    }
    if ((evolveCounter == 0 || evolve) && !draw) {
        lSystem.EvolveTo(generation, SpawnTransform);
        _Draw();
    }
    if (draw) {
        _Draw();
    }
    if (UI) {
        GenerationUp.innerHTML = `Up: ${generation}`;
        SystemStateDisplay.innerHTML = `State: ${lSystem.FormatState()}`;
    }
    if (countEnergy) {
        UIControl.UpdateEnergyRange(<HTMLInputElement>document.getElementById('energyrange'));
    }
}

var SystemStateDisplay = document.getElementById("SystemStateDisplay");
SystemStateDisplay.innerHTML = `State: ${lSystem.FormatState()}`;
var GenerationUp = document.getElementById("GenerationUp");
GenerationUp.onclick = () => {
    generation++;
    Update(undefined, true, undefined, undefined, true);
    let playButton = <HTMLInputElement>document.getElementById('PlayButton');
    playButton.onclick(undefined); playButton.onclick(undefined);
}
var GenerationDown = document.getElementById("GenerationDown");
GenerationDown.onclick = () => {
    generation--;
    Update(undefined, true, undefined, undefined, true);
    let playButton = <HTMLInputElement>document.getElementById('PlayButton');
    playButton.onclick(undefined); playButton.onclick(undefined);
}

let MainCursor: Cursor;

function _Draw() {
    canvas.background(225, 225, 255);

    canvas.ellipse(SpawnPoint.x, SpawnPoint.y, pWidth);

    lSystem.reset(SpawnTransform);
    MainCursor.loc.SetTo(SpawnTransform);
    lSystem.View(MainCursor);
}

var p5Sketch = (_p: p5) => {

    _p.setup = () => {
        let canvasElement = _p.createCanvas(width, height);
        canvasElement.style('border', '#000000')
            .style('borderStyle', 'solid')
            .style('border-width', '3px')
            .style('position', 'absolute')
            .style('left', '304px')
            .style('top', '108px');
        let element = <HTMLElement>canvasElement.elt;
        document.getElementById('Editor').appendChild(element);
        UIControl.InitSpawnMoving(element);
        _p.fill(255);
        _p.stroke(0);
        _p.strokeWeight(2);
    };
};

let canvas: p5;

function main() {
    let v = MathHelper.intSeededGenerator(`seed`)();
    console.log(`Creating canvas ${width} x ${height}`);
    canvas = new p5(p5Sketch);
    MainCursor = new Cursor(canvas, SpawnTransform.Copy());
}

main();