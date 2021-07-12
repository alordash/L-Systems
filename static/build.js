class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    Copy() {
        return new Point(this.x, this.y);
    }
}
class Transform {
    constructor(pos, dir) {
        this.pos = pos;
        this.dir = dir;
    }
    Copy() {
        return new Transform(this.pos.Copy(), this.dir);
    }
    SetTo(t) {
        this.pos.x = t.pos.x;
        this.pos.y = t.pos.y;
        this.dir = t.dir;
    }
}
let width = 1200;
let height = 1200;
let SpawnPoint = new Point(width / 2, height - 100);
const pWidth = 10;
let SpawnTransform = new Transform(SpawnPoint, 90);
class UIControl {
    static InitRenderCheck() {
        var continueRenderingCheckbox = document.getElementById("ContinueRendering");
        continueRenderingCheckbox.checked = continueRendering;
        continueRenderingCheckbox.onchange = function () {
            continueRendering = continueRenderingCheckbox.checked;
        };
    }
    static InitSpawnMoving(canvas) {
        canvas.onmousemove = (e) => {
            if (e.buttons) {
                SpawnPoint = new Point(e.offsetX, e.offsetY);
                SpawnTransform.pos = SpawnPoint;
                Update(undefined, undefined, true);
            }
        };
        canvas.onmousedown = () => {
            Update(undefined, true);
        };
    }
    static RangeFormat(key) {
        return `${key}range`;
    }
    static CreateNumberParameter(obj, key) {
        if (key[0] == L_System.propertyMark) {
            key = key.substring(1);
        }
        const params = document.getElementById('Params');
        params.appendChild(document.createElement('br'));
        params.appendChild(document.createTextNode(key));
        let range = document.createElement("input");
        range.id = UIControl.RangeFormat(key);
        range.type = 'range';
        range.min = '0';
        range.className = 'rangeParam';
        range.max = '40';
        range.step = 'any';
        range.value = `${obj[key]}`;
        range.onchange = () => {
            console.log(`For ${key}`);
            obj[key] = +range.value;
            Update(undefined, true);
        };
        range.onmousemove = (e) => {
            if (e.buttons) {
                obj[key] = +range.value;
                Update();
            }
        };
        params.appendChild(range);
    }
    static CreateParametersPanel(system) {
        console.log('system :>> ', system);
        for (let [key, value] of Object.entries(system)) {
            console.log('key, value, type :>> ', key, value, typeof value);
            if (typeof value == 'number') {
                UIControl.CreateNumberParameter(system, key);
            }
        }
    }
}
UIControl.paramsFiller = `<b>Parameters</b><br />`;
class MathHelper {
    static randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static randomize(n) {
        return n * this.randInt(0.7, 1.3);
    }
}
class Cursor {
    constructor(p5, loc) {
        this.p5 = p5;
        this.loc = loc;
    }
    DrawLine(length, strokeWeight = 1, color = this.p5.color(0, 0, 0)) {
        let x = this.loc.pos.x;
        let y = this.loc.pos.y;
        let rad = this.loc.dir * Math.PI / 180;
        let xNew = x + length * Math.cos(rad);
        let yNew = y - length * Math.sin(rad);
        this.p5.strokeWeight(strokeWeight);
        this.p5.stroke(color);
        this.p5.line(x, y, xNew, yNew);
        this.loc.pos = new Point(xNew, yNew);
    }
    Turn(angle) {
        this.loc.dir += angle;
    }
}
class L_System {
    constructor(axiom, reset = () => { }) {
        this.state = this.axiom = axiom;
        this.reset = reset;
    }
    Evolve() {
        let newState = '';
        for (let c of this.state) {
            if (this.dictionary[c] != undefined) {
                newState += this.dictionary[c]();
            }
            else {
                newState += c;
            }
        }
        this.state = newState;
    }
    EvolveTo(n) {
        this.reset();
        this.state = this.axiom;
        for (let i = 1; i < n; i++) {
            this.Evolve();
        }
    }
    View(cursor) {
        for (let c of this.state) {
            if (this.actions[c] != undefined) {
                this.actions[c](cursor);
            }
        }
    }
}
L_System.propertyMark = '_';
class State {
    constructor(t, thick) {
        this.t = t;
        this.thickness = thick;
    }
}
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BinaryTree_thick, _BinaryTree_anglePart;
class BinaryTree extends L_System {
    constructor(step = 10, angle = 16, thickness = 16, random = true, splitChance = 23) {
        super(BinaryTree.axiom, () => { __classPrivateFieldSet(this, _BinaryTree_thick, this.thickness, "f"); });
        this.dictionary = {
            '0': () => {
                let s = `1[-20]+20`;
                if (this.random && MathHelper.randInt(0, 100) < this.splitChance) {
                    s = `1[10]10`;
                }
                else if (!this.random) {
                    s = `1[20]20`;
                }
                return s;
            },
            '1': () => {
                return `21`;
            },
            '2': () => {
                return '2';
            }
        };
        _BinaryTree_thick.set(this, void 0);
        _BinaryTree_anglePart.set(this, void 0);
        this.step = step;
        this._angle = angle;
        __classPrivateFieldSet(this, _BinaryTree_thick, this.thickness = thickness, "f");
        __classPrivateFieldSet(this, _BinaryTree_anglePart, BinaryTree.dif + (angle / 3), "f");
        this.random = random;
        this.splitChance = splitChance;
        this.states = new Array();
        const simpleDraw = (cursor) => {
            if (!this.random || MathHelper.randInt(0, 10) > 2) {
                cursor.DrawLine(this.CalcStep(), __classPrivateFieldGet(this, _BinaryTree_thick, "f"));
            }
        };
        let actions = {
            '0': (cursor) => {
                cursor.DrawLine(this.CalcStep() * 0.75, Math.max(7.5, __classPrivateFieldGet(this, _BinaryTree_thick, "f") * 1.2), cursor.p5.color(BinaryTree.leafColors[MathHelper.randInt(0, BinaryTree.leafColors.length - 1)]));
            },
            '1': simpleDraw,
            '2': simpleDraw,
            '[': (cursor) => {
                __classPrivateFieldSet(this, _BinaryTree_thick, __classPrivateFieldGet(this, _BinaryTree_thick, "f") * 0.75, "f");
                this.states.push(new State(cursor.loc.Copy(), __classPrivateFieldGet(this, _BinaryTree_thick, "f")));
                cursor.loc.dir += this.CalcAngle();
            },
            ']': (cursor) => {
                let state = this.states.pop();
                __classPrivateFieldSet(this, _BinaryTree_thick, state.thickness, "f");
                cursor.loc.SetTo(state.t);
                cursor.loc.dir -= this.CalcAngle();
            },
            '+': (cursor) => {
                cursor.loc.dir += this.CalcAngle();
            },
            '-': (cursor) => {
                cursor.loc.dir -= this.CalcAngle();
            }
        };
        this.actions = actions;
    }
    set angle(v) {
        this._angle = v;
        __classPrivateFieldSet(this, _BinaryTree_anglePart, BinaryTree.dif + (v / 3), "f");
    }
    get angle() {
        return this._angle;
    }
    CalcStep() {
        return this.random ? MathHelper.randomize(this.step) : this.step;
    }
    CalcAngle() {
        return this._angle + (this.random ? MathHelper.randInt(0, __classPrivateFieldGet(this, _BinaryTree_anglePart, "f")) : 0);
    }
}
_BinaryTree_thick = new WeakMap(), _BinaryTree_anglePart = new WeakMap();
BinaryTree.axiom = '2220';
BinaryTree.dif = 3;
BinaryTree.leafColors = [
    [0, 102, 0],
    [100, 200, 30],
    [50, 135, 10],
    [120, 120, 0]
];
var continueRendering = false;
UIControl.InitRenderCheck();
let binaryTree = new BinaryTree();
UIControl.CreateParametersPanel(binaryTree);
let evolveCounter = 0;
let evolveTrigger = 5;
function Update(UI = true, evolve = false, draw = false) {
    if (!evolve) {
        evolveCounter = (evolveCounter + 1) % evolveTrigger;
    }
    if ((evolveCounter == 0 || evolve) && !draw) {
        binaryTree.EvolveTo(generation);
        _Draw();
    }
    if (draw) {
        binaryTree.reset();
        _Draw();
    }
    if (UI) {
        button.innerHTML = `Button ${generation}`;
        SystemStateDisplay.innerHTML = `State: ${binaryTree.state}`;
    }
}
var generation = 1;
var SystemStateDisplay = document.getElementById("SystemStateDisplay");
SystemStateDisplay.innerHTML = `State: ${binaryTree.state}`;
var button = document.getElementById("Button42");
button.onclick = () => {
    generation++;
    Update(undefined, true);
};
let MainCursor;
function _Draw() {
    canvas.background(225, 225, 255);
    canvas.ellipse(SpawnPoint.x, SpawnPoint.y, pWidth);
    binaryTree.View(MainCursor);
    MainCursor.loc.SetTo(SpawnTransform);
}
var p5Sketch = (_p) => {
    _p.setup = () => {
        let canvasElement = _p.createCanvas(width, height);
        canvasElement.style('border', '#000000');
        canvasElement.style('borderStyle', 'solid');
        canvasElement.style('border-width', '3px');
        let element = canvasElement.elt;
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
let canvas;
function main() {
    console.log('MathHelper.randInt(100,200) :>> ', MathHelper.randInt(100, 200));
    console.log(`Creating canvas ${width} x ${height}`);
    canvas = new p5(p5Sketch);
    MainCursor = new Cursor(canvas, SpawnTransform.Copy());
}
main();
//# sourceMappingURL=build.js.map