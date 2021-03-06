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
let width = 3000;
let height = 830;
let SpawnPoint = new Point(575, 800);
const pWidth = 10;
let SpawnTransform = new Transform(SpawnPoint, 90);
var generation = 0;
class Section {
    constructor(c, init = () => { }, evolveLimit = Section.evolveLimit, stage = 0, values = undefined) {
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
    static Decode(s, sections, stage = 0, stageValues = []) {
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
        for (let i in stageValues) {
            if (ss[i] != undefined) {
                ss[i].stage = stageValues[i];
            }
        }
        return ss;
    }
    progress() {
        return this.stage / this.evolveLimit;
    }
}
Section.evolveLimit = 100;
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
        this.$energyDecrease = 0;
        this.$energy = stage;
        this.$energyDecrease = 0;
        this.reset = reset;
        this.Randomize();
    }
    Grow(s) {
        if (this.$energy < 0) {
            s.stage = s.evolveLimit;
        }
        else if (s.stage < s.evolveLimit && this.$energy > this.$energyDecrease) {
            s.stage = Math.min(this.$energy - this.$energyDecrease, s.evolveLimit);
        }
    }
    StopGrow(s) {
        return s.stage < s.evolveLimit;
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
        this.$energyDecrease += Section.evolveLimit;
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
    CountMaxEnergy(generation) {
        return (generation - 1) * Section.evolveLimit;
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
            this.$energyDecrease = 0;
        });
        this.dictionary = {
            '0': (s) => {
                this.Grow(s);
                if (this.StopGrow(s)) {
                    return [s];
                }
                let ss = Section.Decode('1[-20]+20', this.Sections, undefined, [0, 0, 0, 0, 0, 0, 0, s.stage]);
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
            },
            '+': (s) => {
                this.Grow(s);
                return [s];
            },
            '-': (s) => {
                this.Grow(s);
                return [s];
            },
            '[': (s) => {
                this.Grow(s);
                return [s];
            },
            ']': (s) => {
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
                cursor.loc.dir += this.CalcAngle(s.values[0]) * s.progress();
            },
            ']': (cursor, s) => {
                let state = this.states.pop();
                __classPrivateFieldSet(this, _BinaryTree_thick, state.thickness, "f");
                cursor.loc.SetTo(state.t);
                cursor.loc.dir -= this.CalcAngle(s.values[0]) * s.progress();
            },
            '+': (cursor, s) => {
                cursor.loc.dir += this.CalcAngle(s.values[0]) * s.progress();
            },
            '-': (cursor, s) => {
                cursor.loc.dir -= this.CalcAngle(s.values[0]) * s.progress();
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
class KochCurve extends L_System {
    constructor(step = new NumberParam(10, 0.01, 40), angle = new NumberParam(90, 0, 180)) {
        super((transform) => {
            transform.dir = KochCurve.direction;
            this.$energyDecrease = 0;
        });
        this.Sections = {
            'F': new Section('F'),
            '+': new Section('+', undefined, -1),
            '-': new Section('-', undefined, -1)
        };
        this.dictionary = {
            'F': (s) => {
                this.Grow(s);
                if (this.StopGrow(s)) {
                    return [s];
                }
                return Section.Decode('F+F-F-F+F', this.Sections, s.stage);
            }
        };
        this.state = this.axiom = Section.Decode(KochCurve.axiom, this.Sections);
        this.step = step;
        this.angle = angle;
        let actions = {
            'F': (cursor, s) => {
                cursor.DrawLine(this.step.v * s.progress(), KochCurve.thickness);
            },
            '+': (cursor) => {
                cursor.loc.dir += this.angle.v;
            },
            '-': (cursor) => {
                cursor.loc.dir -= this.angle.v;
            }
        };
        this.actions = actions;
    }
}
KochCurve.axiom = 'F';
KochCurve.thickness = 3;
KochCurve.direction = 0;
class SierpinskiTriangle extends L_System {
    constructor(step = new NumberParam(10, 0.01, 50), angle = new NumberParam(120, 0, 180)) {
        super((transform) => {
            transform.dir = SierpinskiTriangle.direction;
            this.$energyDecrease = 0;
        });
        this.Sections = {
            'F': new Section('F'),
            'G': new Section('G'),
            '+': new Section('+', undefined, -1),
            '-': new Section('-', undefined, -1)
        };
        this.dictionary = {
            'F': (s) => {
                this.Grow(s);
                if (this.StopGrow(s)) {
                    return [s];
                }
                return Section.Decode('F-G+F+G-F', this.Sections, s.stage);
            },
            'G': (s) => {
                this.Grow(s);
                if (this.StopGrow(s)) {
                    return [s];
                }
                return Section.Decode('GG', this.Sections, s.stage);
            }
        };
        this.state = this.axiom = Section.Decode(SierpinskiTriangle.axiom, this.Sections);
        this.step = step;
        this.angle = angle;
        const simpleDraw = (cursor, s) => {
            cursor.DrawLine(this.step.v * s.progress(), SierpinskiTriangle.thickness);
        };
        let actions = {
            'F': simpleDraw,
            'G': simpleDraw,
            '+': (cursor) => {
                cursor.loc.dir += -this.angle.v;
            },
            '-': (cursor) => {
                cursor.loc.dir -= -this.angle.v;
            }
        };
        this.actions = actions;
    }
}
SierpinskiTriangle.axiom = 'F-G-G';
SierpinskiTriangle.thickness = 3;
SierpinskiTriangle.direction = 0;
class SierpinskiArrowheadCurve extends L_System {
    constructor(step = new NumberParam(10, 0.01, 20), angle = new NumberParam(60, 0, 180)) {
        super((transform) => {
            transform.dir = SierpinskiArrowheadCurve.direction;
            this.$energyDecrease = 0;
        });
        this.Sections = {
            'A': new Section('A'),
            'B': new Section('B'),
            '+': new Section('+', undefined),
            '-': new Section('-', undefined)
        };
        this.dictionary = {
            'A': (s) => {
                this.Grow(s);
                if (this.StopGrow(s)) {
                    return [s];
                }
                let v = s.stage;
                return Section.Decode('B-A-B', this.Sections, undefined, [v, 0, v, 0, v]);
            },
            'B': (s) => {
                this.Grow(s);
                if (this.StopGrow(s)) {
                    return [s];
                }
                let v = s.stage;
                return Section.Decode('A+B+A', this.Sections, undefined, [v, 0, v, 0, v]);
            },
            '+': (s) => {
                this.Grow(s);
                return [s];
            },
            '-': (s) => {
                this.Grow(s);
                return [s];
            }
        };
        this.state = this.axiom = Section.Decode(SierpinskiArrowheadCurve.axiom, this.Sections);
        this.step = step;
        this.angle = angle;
        const simpleDraw = (cursor, s) => {
            cursor.DrawLine(this.step.v, SierpinskiArrowheadCurve.thickness);
        };
        let actions = {
            'A': simpleDraw,
            'B': simpleDraw,
            '+': (cursor, s) => {
                cursor.loc.dir += this.angle.v * s.progress();
            },
            '-': (cursor, s) => {
                cursor.loc.dir -= this.angle.v * s.progress();
            }
        };
        this.actions = actions;
    }
}
SierpinskiArrowheadCurve.axiom = 'A';
SierpinskiArrowheadCurve.thickness = 3;
SierpinskiArrowheadCurve.direction = 0;
class DragonCurve extends L_System {
    constructor(step = new NumberParam(10, 0.01, 30), angle = new NumberParam(90, 0, 180)) {
        super((transform) => {
            transform.dir = DragonCurve.direction;
            this.$energyDecrease = 0;
        });
        this.Sections = {
            'F': new Section('F'),
            'G': new Section('G'),
            '+': new Section('+', undefined),
            '-': new Section('-', undefined)
        };
        this.dictionary = {
            'F': (s) => {
                this.Grow(s);
                if (this.StopGrow(s)) {
                    return [s];
                }
                let v = s.stage;
                return Section.Decode('F+G', this.Sections, undefined, [v, 0, v]);
            },
            'G': (s) => {
                this.Grow(s);
                if (this.StopGrow(s)) {
                    return [s];
                }
                let v = s.stage;
                return Section.Decode('F-G', this.Sections, undefined, [v, 0, v]);
            },
            '+': (s) => {
                this.Grow(s);
                return [s];
            },
            '-': (s) => {
                this.Grow(s);
                return [s];
            }
        };
        this.state = this.axiom = Section.Decode(DragonCurve.axiom, this.Sections);
        this.step = step;
        this.angle = angle;
        const simpleDraw = (cursor, s) => {
            cursor.DrawLine(this.step.v, DragonCurve.thickness);
        };
        let actions = {
            'F': simpleDraw,
            'G': simpleDraw,
            '+': (cursor, s) => {
                cursor.loc.dir += this.angle.v * s.progress();
            },
            '-': (cursor, s) => {
                cursor.loc.dir -= this.angle.v * s.progress();
            }
        };
        this.actions = actions;
    }
}
DragonCurve.axiom = 'F';
DragonCurve.thickness = 3;
DragonCurve.direction = 180;
class FractalPlant extends L_System {
    constructor(step = new NumberParam(10, 0, 20), angle = new NumberParam(25, 0, 180)) {
        super((transform) => {
            transform.dir = FractalPlant.direction;
            this.$energyDecrease = 0;
        });
        this.Sections = {
            'X': new Section('X'),
            'F': new Section('F'),
            '+': new Section('+', undefined),
            '-': new Section('-', undefined),
            '[': new Section('[', undefined, -1),
            ']': new Section(']', undefined, -1)
        };
        this.dictionary = {
            'X': (s) => {
                this.Grow(s);
                if (this.StopGrow(s)) {
                    return [s];
                }
                return Section.Decode('F+[[X]-X]-F[-FX]+X', this.Sections);
            },
            'F': (s) => {
                this.Grow(s);
                if (this.StopGrow(s)) {
                    return [s];
                }
                return Section.Decode('FF', this.Sections, s.stage);
            },
            '+': (s) => {
                this.Grow(s);
                return [s];
            },
            '-': (s) => {
                this.Grow(s);
                return [s];
            }
        };
        this.state = this.axiom = Section.Decode(FractalPlant.axiom, this.Sections);
        this.step = step;
        this.angle = angle;
        this.states = new Array();
        let actions = {
            'F': (cursor, s) => {
                cursor.DrawLine(this.step.v * s.progress(), FractalPlant.thickness);
            },
            '[': (cursor) => {
                this.states.push(new State(cursor.loc.Copy()));
            },
            ']': (cursor) => {
                cursor.loc.SetTo(this.states.pop().t);
            },
            '+': (cursor, s) => {
                cursor.loc.dir += this.angle.v * s.progress();
            },
            '-': (cursor, s) => {
                cursor.loc.dir -= this.angle.v * s.progress();
            }
        };
        this.actions = actions;
    }
}
FractalPlant.axiom = 'X';
FractalPlant.thickness = 3;
FractalPlant.direction = 90;
const L_Systems_List = [
    BinaryTree,
    KochCurve,
    SierpinskiTriangle,
    SierpinskiArrowheadCurve,
    DragonCurve,
    FractalPlant
];
let playTimer;
let playing = false;
let playStep = 50;
let time = 6;
let fps = 100;
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
    static CreateNumberParameter(system, key) {
        if (key[0] == L_System.ignoreMark) {
            return;
        }
        let isProperty = key[0] == L_System.propertyMark;
        if (isProperty) {
            key = key.substring(1);
        }
        let value = system[key];
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
        range.value = `${isProperty ? system[key] : system[key].v}`;
        range.onchange = () => {
            if (isProperty) {
                system[key] = +range.value;
            }
            else {
                system[key].v = +range.value;
            }
            Update(undefined, true);
        };
        range.onmousemove = (e) => {
            if (e.buttons) {
                if (isProperty) {
                    system[key] = +range.value;
                }
                else {
                    system[key].v = +range.value;
                }
                Update();
            }
        };
        params.appendChild(range);
    }
    static CreateBooleanParameter(system, key) {
        if (key[0] == L_System.ignoreMark) {
            return;
        }
        const params = document.getElementById('Params');
        params.appendChild(document.createElement('br'));
        params.appendChild(document.createTextNode(key));
        let checkbox = document.createElement("input");
        checkbox.id = UIControl.RangeFormat(key);
        checkbox.type = 'checkbox';
        checkbox.checked = system[key];
        checkbox.onchange = () => {
            system[key] = checkbox.checked;
            Update(undefined, true);
        };
        params.appendChild(checkbox);
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
            else if (typeof value == 'boolean') {
                UIControl.CreateBooleanParameter(system, key);
            }
        }
    }
    static UpdateEnergyRange(energyRange) {
        let energy = lSystem.CountMaxEnergy(generation) + 1;
        energyRange.min = Section.evolveLimit.toString();
        energyRange.max = energy.toString();
        energyRange.step = (energy / 100).toString();
    }
    static InitTimeRange() {
        let timeCheckbox = document.getElementById('TimeCheckbox');
        let energyDiv = document.getElementById('energydiv');
        let energyRange = document.getElementById('energyrange');
        UIControl.UpdateEnergyRange(energyRange);
        timeCheckbox.onchange = () => {
            energyDiv.style.visibility = timeCheckbox.checked ? '' : 'hidden';
            lSystem.$energy = timeCheckbox.checked ? +energyRange.value : -1;
            Update(undefined, true);
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
                energyRange.step = (playStep = +energyRange.max / (fps * time)).toString();
                playTimer = setInterval(() => {
                    let maxVal = +energyRange.max;
                    let v = +energyRange.value + playStep;
                    if (v > maxVal || v < Section.evolveLimit) {
                        v -= 2 * playStep;
                        playStep *= -1;
                    }
                    energyRange.value = v.toString();
                    lSystem.$energy = v;
                    Update();
                }, 1000 / fps);
            }
            else {
                playButton.style.backgroundColor = "#32d01b";
                playButton.textContent = "Play";
                clearInterval(playTimer);
            }
        };
    }
    static Init() {
        UIControl.InitRandomizeButton();
        UIControl.CreateParametersPanel(lSystem);
        UIControl.CreateOptions();
        UIControl.InitTimeRange();
    }
}
UIControl.paramsFiller = `<b>Parameters</b><br />`;
let lSystem = new BinaryTree();
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
        UIControl.UpdateEnergyRange(document.getElementById('energyrange'));
    }
}
var SystemStateDisplay = document.getElementById("SystemStateDisplay");
SystemStateDisplay.innerHTML = `State: ${lSystem.FormatState()}`;
var GenerationUp = document.getElementById("GenerationUp");
GenerationUp.onclick = () => {
    generation++;
    Update(undefined, true, undefined, undefined, true);
    let playButton = document.getElementById('PlayButton');
    playButton.onclick(undefined);
    playButton.onclick(undefined);
};
var GenerationDown = document.getElementById("GenerationDown");
GenerationDown.onclick = () => {
    generation--;
    Update(undefined, true, undefined, undefined, true);
    let playButton = document.getElementById('PlayButton');
    playButton.onclick(undefined);
    playButton.onclick(undefined);
};
let MainCursor;
function _Draw() {
    canvas.background(225, 225, 255);
    canvas.ellipse(SpawnPoint.x, SpawnPoint.y, pWidth);
    lSystem.reset(SpawnTransform);
    MainCursor.loc.SetTo(SpawnTransform);
    lSystem.View(MainCursor);
}
var p5Sketch = (_p) => {
    _p.setup = () => {
        let canvasElement = _p.createCanvas(width, height);
        canvasElement.style('border', '#000000')
            .style('borderStyle', 'solid')
            .style('border-width', '3px')
            .style('position', 'absolute')
            .style('left', '304px')
            .style('top', '108px');
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