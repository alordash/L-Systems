var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.Copy = function () {
        return new Point(this.x, this.y);
    };
    return Point;
}());
var Transform = (function () {
    function Transform(pos, dir) {
        this.pos = pos;
        this.dir = dir;
    }
    Transform.prototype.Copy = function () {
        return new Transform(this.pos.Copy(), this.dir);
    };
    Transform.prototype.SetTo = function (t) {
        this.pos.x = t.pos.x;
        this.pos.y = t.pos.y;
        this.dir = t.dir;
    };
    return Transform;
}());
var width = 1200;
var height = 1200;
var SpawnPoint = new Point(width / 2, height - 100);
var pWidth = 10;
var SpawnTransform = new Transform(SpawnPoint, 90);
var UIControl = (function () {
    function UIControl() {
    }
    UIControl.InitRenderCheck = function () {
        var continueRenderingCheckbox = document.getElementById("ContinueRendering");
        continueRenderingCheckbox.checked = continueRendering;
        continueRenderingCheckbox.onchange = function () {
            continueRendering = continueRenderingCheckbox.checked;
        };
    };
    UIControl.InitSpawnMoving = function (canvas) {
        canvas.onmousemove = function (e) {
            if (e.buttons) {
                SpawnPoint = new Point(e.offsetX, e.offsetY);
                SpawnTransform.pos = SpawnPoint;
                Update();
            }
        };
        canvas.onclick = function () {
            Update(undefined, true);
        };
    };
    return UIControl;
}());
var MathHelper = (function () {
    function MathHelper() {
    }
    MathHelper.randInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    MathHelper.randomize = function (n) {
        return n * this.randInt(0.7, 1.3);
    };
    return MathHelper;
}());
var Cursor = (function () {
    function Cursor(p5, loc) {
        this.p5 = p5;
        this.loc = loc;
    }
    Cursor.prototype.DrawLine = function (length, strokeWeight, color) {
        if (strokeWeight === void 0) { strokeWeight = 1; }
        if (color === void 0) { color = this.p5.color(0, 0, 0); }
        var x = this.loc.pos.x;
        var y = this.loc.pos.y;
        var rad = this.loc.dir * Math.PI / 180;
        var xNew = x + length * Math.cos(rad);
        var yNew = y - length * Math.sin(rad);
        this.p5.strokeWeight(strokeWeight);
        this.p5.stroke(color);
        this.p5.line(x, y, xNew, yNew);
        this.loc.pos = new Point(xNew, yNew);
    };
    Cursor.prototype.Turn = function (angle) {
        this.loc.dir += angle;
    };
    return Cursor;
}());
var L_System = (function () {
    function L_System(axiom, reset) {
        if (reset === void 0) { reset = function () { }; }
        this.state = this.axiom = axiom;
        this.reset = reset;
    }
    L_System.prototype.Evolve = function () {
        var newState = '';
        for (var _i = 0, _a = this.state; _i < _a.length; _i++) {
            var c = _a[_i];
            if (this.dictionary[c] != undefined) {
                newState += this.dictionary[c]();
            }
            else {
                newState += c;
            }
        }
        this.state = newState;
    };
    L_System.prototype.EvolveTo = function (n) {
        this.reset();
        this.state = this.axiom;
        for (var i = 1; i < n; i++) {
            this.Evolve();
        }
    };
    L_System.prototype.View = function (cursor) {
        for (var _i = 0, _a = this.state; _i < _a.length; _i++) {
            var c = _a[_i];
            if (this.actions[c] != undefined) {
                this.actions[c](cursor);
            }
        }
    };
    return L_System;
}());
var State = (function () {
    function State(t, thick) {
        this.t = t;
        this.thickness = thick;
    }
    return State;
}());
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BinaryTree = (function (_super) {
    __extends(BinaryTree, _super);
    function BinaryTree(step, angle, thickness, random, splitChance) {
        if (thickness === void 0) { thickness = 16; }
        if (random === void 0) { random = false; }
        if (splitChance === void 0) { splitChance = 50; }
        var _this = _super.call(this, BinaryTree.axiom, function () { _this.thickness = thickness; }) || this;
        _this.dictionary = {
            '0': function () {
                var s = "1[-20]+20";
                if (_this.random && MathHelper.randInt(0, 100) < _this.splitChance) {
                    s = "1[10]10";
                }
                else if (!_this.random) {
                    s = "1[20]20";
                }
                return s;
            },
            '1': function () {
                return "21";
            },
            '2': function () {
                return '2';
            }
        };
        _this.step = step;
        _this._angle = angle;
        _this.thickness = thickness;
        _this.anglePart = BinaryTree.dif + (angle / 3);
        _this.random = random;
        _this.splitChance = splitChance;
        _this.states = new Array();
        var simpleDraw = function (cursor) {
            if (!_this.random || MathHelper.randInt(0, 10) > 2) {
                cursor.DrawLine(_this.CalcStep(), _this.thickness);
            }
        };
        var actions = {
            '0': function (cursor) {
                cursor.DrawLine(_this.CalcStep() * 0.75, 7.5, cursor.p5.color(BinaryTree.leafColors[MathHelper.randInt(0, BinaryTree.leafColors.length - 1)]));
            },
            '1': simpleDraw,
            '2': simpleDraw,
            '[': function (cursor) {
                _this.thickness *= 0.75;
                _this.states.push(new State(cursor.loc.Copy(), _this.thickness));
                cursor.loc.dir += _this.CalcAngle();
            },
            ']': function (cursor) {
                var state = _this.states.pop();
                _this.thickness = state.thickness;
                cursor.loc.SetTo(state.t);
                cursor.loc.dir -= _this.CalcAngle();
            },
            '+': function (cursor) {
                cursor.loc.dir += _this.CalcAngle();
            },
            '-': function (cursor) {
                cursor.loc.dir -= _this.CalcAngle();
            }
        };
        _this.actions = actions;
        return _this;
    }
    Object.defineProperty(BinaryTree.prototype, "angle", {
        get: function () {
            return this._angle;
        },
        set: function (v) {
            this._angle = v;
            this.anglePart = BinaryTree.dif + (v / 3);
        },
        enumerable: false,
        configurable: true
    });
    BinaryTree.prototype.CalcStep = function () {
        return this.random ? MathHelper.randomize(this.step) : this.step;
    };
    BinaryTree.prototype.CalcAngle = function () {
        return this._angle + (this.random ? MathHelper.randInt(0, this.anglePart) : 0);
    };
    BinaryTree.axiom = '2220';
    BinaryTree.dif = 3;
    BinaryTree.leafColors = [
        [0, 102, 0],
        [100, 200, 30],
        [50, 135, 10],
        [120, 120, 0]
    ];
    return BinaryTree;
}(L_System));
var continueRendering = false;
UIControl.InitRenderCheck();
var stepRange = document.getElementById("StepRange");
var angleRange = document.getElementById("AngleRange");
var binaryTree = new BinaryTree(+stepRange.value, +angleRange.value, 16, true, 35);
var evolveCounter = 0;
var evolveTrigger = 10;
function Update(UI, evolve) {
    if (UI === void 0) { UI = true; }
    if (evolve === void 0) { evolve = false; }
    evolveCounter = (evolveCounter + 1) % evolveTrigger;
    if (evolveCounter == 0 || evolve) {
        binaryTree.EvolveTo(generation);
        binaryTree.step = +stepRange.value;
        binaryTree.angle = +angleRange.value;
        _Draw();
    }
    if (UI) {
        button.innerHTML = "Button " + generation;
        SystemStateDisplay.innerHTML = "State: " + binaryTree.state;
    }
}
stepRange.onchange = function () {
    Update();
};
stepRange.onmousemove = function (e) {
    if (e.buttons) {
        Update();
    }
};
angleRange.onchange = function () {
    Update();
};
angleRange.onmousemove = function (e) {
    if (e.buttons) {
        Update();
    }
};
var generation = 1;
var SystemStateDisplay = document.getElementById("SystemStateDisplay");
SystemStateDisplay.innerHTML = "State: " + binaryTree.state;
var button = document.getElementById("Button42");
button.onclick = function () {
    generation++;
    Update(undefined, true);
};
var MainCursor;
function _Draw() {
    canvas.background(225, 225, 255);
    canvas.ellipse(SpawnPoint.x, SpawnPoint.y, pWidth);
    binaryTree.View(MainCursor);
    MainCursor.loc.SetTo(SpawnTransform);
}
var p5Sketch = function (_p) {
    _p.setup = function () {
        var canvasElement = _p.createCanvas(width, height);
        canvasElement.style('border', '#000000');
        canvasElement.style('borderStyle', 'solid');
        canvasElement.style('border-width', '3px');
        UIControl.InitSpawnMoving(canvasElement.elt);
        _p.fill(255);
        _p.stroke(0);
        _p.strokeWeight(2);
    };
    _p.draw = function () {
        if (continueRendering) {
            Update(false);
        }
    };
};
var canvas;
function main() {
    console.log('MathHelper.randInt(100,200) :>> ', MathHelper.randInt(100, 200));
    console.log("Creating canvas " + width + " x " + height);
    canvas = new p5(p5Sketch);
    MainCursor = new Cursor(canvas, SpawnTransform.Copy());
}
main();
//# sourceMappingURL=build.js.map