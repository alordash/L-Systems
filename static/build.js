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
let width = 2000;
let height = 1200;
let SpawnPoint = new Point(width / 2, height - 100);
const pWidth = 10;
let SpawnTransform = new Transform(SpawnPoint, 90);
var generation = 0;
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
class State {
    constructor(t, thick = 0) {
        this.t = t;
        this.thickness = thick;
    }
}
class Section {
    constructor(c, init = () => { }, evolveLimit = 100, stage = 0, values = undefined) {
        this.stage = 0;
        this.c = c;
        this.evolveLimit = evolveLimit;
        this.stage = stage;
        this.init = init;
        if (values != undefined) {
            this.values = values;
        }
        else {
            this.values = new Array();
            this.init(this);
        }
    }
    Copy() {
        return new Section(this.c, this.init, this.evolveLimit, this.stage);
    }
    static Decode(s, sections, stage = 0) {
        let ss = new Array();
        for (let c of s) {
            let section = sections[c];
            if (section != undefined) {
                let newSection = section.Copy();
                newSection.init(newSection);
                ss.push(newSection);
            }
        }
        if (ss.length) {
            ss[0].stage = stage;
        }
        return ss;
    }
    progress() {
        return this.stage / this.evolveLimit;
    }
}
class NumberParam {
    constructor(v, min = v - 30, max = v + 30) {
        this._v = v;
        this.min = min;
        this.max = max;
    }
    get v() {
        return this._v;
    }
    set v(v) {
        this._v = v;
        if (this._v < this.min)
            this._v = this.min;
        else if (this._v > this.max)
            this._v = this.max;
    }
}
class L_System {
    constructor(reset = () => { }, stage = -1) {
        this.$energy = stage;
        this.reset = reset;
        this.Randomize();
    }
    Grow(s) {
        if (this.$energy > 0 && s.stage < s.evolveLimit) {
            let available = Math.min(this.$energy, s.evolveLimit - s.stage);
            this.$energy -= available;
            s.stage += available;
        }
        else if (this.$energy < 0) {
            s.stage = s.evolveLimit;
        }
    }
    StopGrow(s) {
        return this.$energy >= 0 && s.stage < s.evolveLimit;
    }
    Randomize() {
        this.seed = Math.random().toString();
        this.rand = MathHelper.intSeededGenerator(this.seed);
    }
    Evolve() {
        let newState = new Array();
        for (let section of this.state) {
            let newSection = this.dictionary[section.c];
            if (newSection != undefined) {
                newState.push(...newSection(section));
            }
            else {
                newState.push(section);
            }
        }
        this.state = newState;
    }
    EvolveTo(generation, transform) {
        this.reset(transform);
        this.state = this.axiom;
        for (let i = 1; i < generation; i++) {
            this.Evolve();
        }
    }
    View(cursor) {
        for (let c of this.state) {
            let action = this.actions[c.c];
            if (action != undefined) {
                action(cursor, c);
            }
        }
    }
    FormatState() {
        let s = '';
        for (let section of this.state) {
            s += section.c;
        }
        return s;
    }
    CountMaxEnergy(generation, transform) {
        this.$energy = -1;
        this.EvolveTo(generation, transform);
        let n = 0;
        for (let section of this.state) {
            n += section.stage;
        }
        return n;
    }
}
L_System.propertyMark = '_';
L_System.minMark = '_min';
L_System.maxMark = '_max';
L_System.ignoreMark = '$';
class MathHelper {
    static map(value, min, max) {
        return Math.floor(value * (max - min + 1)) + min;
    }
    static randInt(min, max) {
        return MathHelper.map(Math.random(), min, max);
    }
    static randomize(n, percentage = 0.3) {
        return n * MathHelper.randInt(1 - percentage, 1 + percentage);
    }
    static intSeededGenerator(seed = '') {
        let x = 0;
        let y = 0;
        let z = 0;
        let w = 0;
        let count = 0;
        function next() {
            const t = x ^ (x << 11);
            x = y;
            y = z;
            z = w;
            w ^= ((w >>> 19) ^ t ^ (t >>> 8)) >>> 0;
            count++;
            return w / 0x100000000 + 0.5;
        }
        for (var k = 0; k < seed.length + 64; k++) {
            x ^= seed.charCodeAt(k) | 0;
            next();
        }
        return next;
    }
    static randIntSeeded(min, max, generator) {
        return MathHelper.map(generator(), min, max);
    }
    static randomizeSeeded(n, percentage = 0.3, generator) {
        return n * MathHelper.randIntSeeded(1 - percentage, 1 + percentage, generator);
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
    constructor(step = new NumberParam(10, 0, 50), angle = new NumberParam(23, 0, 90), thickness = new NumberParam(16, 1, 40), random = true, splitChance = new NumberParam(23, 0, 100)) {
        super((transform) => {
            __classPrivateFieldSet(this, _BinaryTree_thick, this.thickness.v, "f");
            transform.dir = BinaryTree.direction;
            this.rand = MathHelper.intSeededGenerator(this.seed);
            this.states = new Array();
        });
        this.dictionary = {
            '0': (s) => {
                this.Grow(s);
                if (this.StopGrow(s)) {
                    return [s];
                }
                let ss = Section.Decode('1[-20]+20', this.Sections, s.stage);
                if (this.random && MathHelper.randIntSeeded(0, 100, this.rand) < this.splitChance.v) {
                    ss = Section.Decode('1[10]10', this.Sections, s.stage);
                }
                else if (!this.random) {
                    ss = Section.Decode('1[20]20', this.Sections, s.stage);
                }
                return ss;
            },
            '1': (s) => {
                this.Grow(s);
                if (this.StopGrow(s)) {
                    return [s];
                }
                return Section.Decode('21', this.Sections, s.stage);
            },
            '2': (s) => {
                this.Grow(s);
                return [s];
            }
        };
        _BinaryTree_thick.set(this, void 0);
        _BinaryTree_anglePart.set(this, void 0);
        this.step = step;
        this._angle = angle;
        __classPrivateFieldSet(this, _BinaryTree_thick, (this.thickness = thickness).v, "f");
        __classPrivateFieldSet(this, _BinaryTree_anglePart, BinaryTree.dif + (angle.v / 3), "f");
        this.random = random;
        this.splitChance = splitChance;
        this.states = new Array();
        this.InitSections();
        this.state = this.axiom = Section.Decode(BinaryTree.axiom, this.Sections);
        const simpleDraw = (cursor, s) => {
            if (!this.random || s.values[0] > 2) {
                cursor.DrawLine(this.CalcStep(s.values[1]) * s.progress(), __classPrivateFieldGet(this, _BinaryTree_thick, "f"));
            }
        };
        let actions = {
            '0': (cursor, s) => {
                cursor.DrawLine(this.CalcStep(s.values[0]), Math.max(7.5, __classPrivateFieldGet(this, _BinaryTree_thick, "f") * 1.2), cursor.p5.color(BinaryTree.leafColors[MathHelper.randIntSeeded(0, BinaryTree.leafColors.length - 1, this.rand)]));
            },
            '1': simpleDraw,
            '2': simpleDraw,
            '[': (cursor, s) => {
                __classPrivateFieldSet(this, _BinaryTree_thick, __classPrivateFieldGet(this, _BinaryTree_thick, "f") * 0.75, "f");
                this.states.push(new State(cursor.loc.Copy(), __classPrivateFieldGet(this, _BinaryTree_thick, "f")));
                cursor.loc.dir += this.CalcAngle(s.values[0]);
            },
            ']': (cursor, s) => {
                let state = this.states.pop();
                __classPrivateFieldSet(this, _BinaryTree_thick, state.thickness, "f");
                cursor.loc.SetTo(state.t);
                cursor.loc.dir -= this.CalcAngle(s.values[0]);
            },
            '+': (cursor, s) => {
                cursor.loc.dir += this.CalcAngle(s.values[0]);
            },
            '-': (cursor, s) => {
                cursor.loc.dir -= this.CalcAngle(s.values[0]);
            }
        };
        this.actions = actions;
    }
    InitSections() {
        this.Sections = {
            '0': new Section('0', (s) => {
                s.values.push(this.RandStep() * 0.75);
            }),
            '1': new Section('1', (s) => {
                s.values.push(MathHelper.randIntSeeded(0, 10, this.rand));
                s.values.push(this.RandStep());
            }),
            '2': new Section('2', (s) => {
                s.values.push(MathHelper.randIntSeeded(0, 10, this.rand));
                s.values.push(this.RandStep());
            }),
            '+': new Section('+', (s) => {
                s.values.push(this.RandAngle());
            }),
            '-': new Section('-', (s) => {
                s.values.push(this.RandAngle());
            }),
            '[': new Section('[', (s) => {
                s.values.push(this.RandAngle());
            }),
            ']': new Section(']', (s) => {
                s.values.push(this.RandAngle());
            })
        };
    }
    set angle(v) {
        this._angle.v = v;
        __classPrivateFieldSet(this, _BinaryTree_anglePart, BinaryTree.dif + (v / 3), "f");
    }
    get angle() {
        return this._angle.v;
    }
    RandStep() {
        return this.random ? MathHelper.randomizeSeeded(1, 0.3, this.rand) : 1;
    }
    RandAngle() {
        return this.random ? MathHelper.randIntSeeded(0, 1, this.rand) : 0;
    }
    CalcStep(v) {
        return v * this.step.v;
    }
    CalcAngle(v) {
        return this._angle.v + v * __classPrivateFieldGet(this, _BinaryTree_anglePart, "f");
    }
}
_BinaryTree_thick = new WeakMap(), _BinaryTree_anglePart = new WeakMap();
BinaryTree.axiom = '2220';
BinaryTree.dif = 3;
BinaryTree.direction = 90;
BinaryTree.leafColors = [
    [0, 102, 0],
    [100, 200, 30],
    [50, 135, 10],
    [120, 120, 0]
];
const L_Systems_List = [
    BinaryTree,
];
let playTimer;
let playing = false;
let playStep = 50;
class UIControl {
    static InitSpawnMoving(canvas) {
        canvas.onmousemove = (e) => {
            if (e.buttons) {
                SpawnPoint = new Point(e.offsetX, e.offsetY);
                SpawnTransform.pos = SpawnPoint;
                Update(undefined, undefined, true);
            }
        };
    }
    static InitRandomizeButton() {
        document.getElementById("Randomize").onclick = () => {
            Update(undefined, true, undefined, true);
        };
    }
    static CreateOptions() {
        let list = document.createElement('select');
        list.className = 'options';
        for (let system of L_Systems_List) {
            let option = document.createElement('option');
            option.innerHTML = system.name;
            list.appendChild(option);
        }
        list.onchange = () => {
            let system = L_Systems_List.find((x) => { return x.name == list.value; });
            console.log('system.name :>> ', system.name);
            lSystem = new system();
            lSystem.reset(SpawnTransform);
            UIControl.CreateParametersPanel(lSystem);
            Update(true, true);
            _Draw();
        };
        let editor = document.getElementById('Editor');
        document.body.insertBefore(list, editor);
    }
    static RangeFormat(key) {
        return `${key}range`;
    }
    static CreateNumberParameter(obj, key) {
        if (key[0] == L_System.ignoreMark) {
            return;
        }
        let isProperty = key[0] == L_System.propertyMark;
        if (isProperty) {
            key = key.substring(1);
        }
        let value = obj[key];
        const params = document.getElementById('Params');
        params.appendChild(document.createElement('br'));
        params.appendChild(document.createTextNode(key));
        let range = document.createElement("input");
        range.id = UIControl.RangeFormat(key);
        range.type = 'range';
        range.className = 'rangeParam';
        range.min = `${value.min}`;
        range.max = `${value.max}`;
        range.step = '0.1';
        range.value = `${isProperty ? obj[key] : obj[key].v}`;
        range.onchange = () => {
            if (isProperty) {
                obj[key] = +range.value;
            }
            else {
                obj[key].v = +range.value;
            }
            Update(undefined, true);
        };
        range.onmousemove = (e) => {
            if (e.buttons) {
                if (isProperty) {
                    obj[key] = +range.value;
                }
                else {
                    obj[key].v = +range.value;
                }
                Update();
            }
        };
        params.appendChild(range);
    }
    static CreateParametersPanel(system) {
        let ranges = Array.from(document.getElementById('Params').childNodes.values()).filter(x => {
            return x.className == 'rangeParam';
        });
        for (let range of ranges) {
            range.remove();
        }
        document.getElementById('Params').innerHTML = `<b>Parameters</b>`;
        for (let [key, value] of Object.entries(system)) {
            if (value instanceof NumberParam) {
                UIControl.CreateNumberParameter(system, key);
            }
        }
    }
    static UpdateEnergyRange(energyRange) {
        let energy = lSystem.CountMaxEnergy(generation, SpawnTransform);
        energyRange.max = energy.toString();
        energyRange.step = (energy / 100).toString();
    }
    static InitTimeRange(lSystem) {
        let timeCheckbox = document.getElementById('TimeCheckbox');
        let energyDiv = document.getElementById('energydiv');
        let energyRange = document.getElementById('energyrange');
        UIControl.UpdateEnergyRange(energyRange);
        timeCheckbox.onchange = () => {
            energyDiv.style.visibility = timeCheckbox.checked ? '' : 'hidden';
            lSystem.$energy = timeCheckbox.checked ? lSystem.$energy : 0;
        };
        energyRange.onchange = () => {
            lSystem.$energy = +energyRange.value;
            Update(undefined, true);
        };
        energyRange.onmousemove = (e) => {
            if (e.buttons) {
                lSystem.$energy = +energyRange.value;
                Update();
            }
        };
        let playButton = document.getElementById('PlayButton');
        playButton.onclick = () => {
            playing = !playing;
            if (playing) {
                playButton.style.backgroundColor = "#d0451b";
                playButton.textContent = "Stop";
                energyRange.step = (playStep = +energyRange.max / 1000).toString();
                playTimer = setInterval(() => {
                    let maxVal = +energyRange.max;
                    let v = +energyRange.value + playStep;
                    if (v > maxVal || v < 0) {
                        v -= 2 * playStep;
                        playStep *= -1;
                    }
                    energyRange.value = v.toString();
                    lSystem.$energy = v;
                    Update();
                }, 10);
            }
            else {
                playButton.style.backgroundColor = "#32d01b";
                playButton.textContent = "Play";
                clearInterval(playTimer);
            }
        };
    }
    static Init(lSystem) {
        UIControl.InitRandomizeButton();
        UIControl.CreateParametersPanel(lSystem);
        UIControl.CreateOptions();
        UIControl.InitTimeRange(lSystem);
    }
}
UIControl.paramsFiller = `<b>Parameters</b><br />`;
let lSystem = new BinaryTree();
UIControl.Init(lSystem);
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
        UIControl.UpdateEnergyRange(document.getElementById('energyrange'));
    }
}
var SystemStateDisplay = document.getElementById("SystemStateDisplay");
SystemStateDisplay.innerHTML = `State: ${lSystem.FormatState()}`;
var GenerationUp = document.getElementById("GenerationUp");
GenerationUp.onclick = () => {
    generation++;
    Update(undefined, true, undefined, undefined, true);
};
var GenerationDown = document.getElementById("GenerationDown");
GenerationDown.onclick = () => {
    generation--;
    Update(undefined, true, undefined, undefined, true);
};
let MainCursor;
function _Draw() {
    canvas.background(225, 225, 255);
    canvas.ellipse(SpawnPoint.x, SpawnPoint.y, pWidth);
    lSystem.reset(SpawnTransform);
    lSystem.View(MainCursor);
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
};
let canvas;
function main() {
    let v = MathHelper.intSeededGenerator(`seed`)();
    console.log(`Creating canvas ${width} x ${height}`);
    canvas = new p5(p5Sketch);
    MainCursor = new Cursor(canvas, SpawnTransform.Copy());
}
main();
//# sourceMappingURL=build.js.map