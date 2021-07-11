var MathHelper = (function () {
    function MathHelper() {
    }
    MathHelper.randInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    return MathHelper;
}());
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
    return Cursor;
}());
var L_System = (function () {
    function L_System(dictionary, axiom) {
        this.dictionary = dictionary;
        this.state = this.axiom = axiom;
    }
    L_System.prototype.Evolve = function () {
        var newState = '';
        for (var _i = 0, _a = this.state; _i < _a.length; _i++) {
            var c = _a[_i];
            if (this.dictionary[c] != undefined) {
                newState += this.dictionary[c];
            }
            else {
                newState += c;
            }
        }
        this.state = newState;
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
    function BinaryTree(step, angle) {
        var _this = _super.call(this, BinaryTree.dictionary, BinaryTree.axiom) || this;
        _this.step = step;
        _this.angle = angle;
        _this.locations = new Array();
        var simpleDraw = function (cursor) {
            cursor.DrawLine(_this.step);
        };
        var actions = {
            '0': simpleDraw,
            '1': simpleDraw,
            '2': simpleDraw,
            '[': function (cursor) {
                _this.locations.push(cursor.loc.Copy());
                cursor.loc.dir += _this.angle;
            },
            ']': function (cursor) {
                cursor.loc.SetTo(_this.locations.pop());
                cursor.loc.dir -= _this.angle;
            }
        };
        _this.actions = actions;
        return _this;
    }
    BinaryTree.dictionary = { '1': '11', '0': '1[0]0' };
    BinaryTree.axiom = '0';
    return BinaryTree;
}(L_System));
var continueRendering = true;
var continueRenderingCheckbox = document.getElementById("ContinueRendering");
continueRenderingCheckbox.checked = continueRendering;
continueRenderingCheckbox.onchange = function () {
    continueRendering = continueRenderingCheckbox.checked;
};
var width = 800;
var height = 800;
var SpawnPoint = new Point(width / 2, height - 100);
var pWidth = 10;
var SpawnTransform = new Transform(SpawnPoint, 90);
var binaryTree = new BinaryTree(5, 45);
var SystemStateDisplay = document.getElementById("SystemStateDisplay");
SystemStateDisplay.innerHTML = "State: " + binaryTree.state;
document.getElementById("Button42").onclick = function () {
    binaryTree.Evolve();
    SystemStateDisplay.innerHTML = "State: " + binaryTree.state;
};
var p5Sketch = function (_p) {
    var MainCursor = new Cursor(_p, SpawnTransform.Copy());
    _p.setup = function () {
        canvas = _p.createCanvas(width, height);
        canvas.style('border', '#000000');
        canvas.style('borderStyle', 'solid');
    };
    _p.draw = function () {
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
var canvas;
function main() {
    console.log('MathHelper.randInt(100,200) :>> ', MathHelper.randInt(100, 200));
    console.log("Creating canvas " + width + " x " + height);
    new p5(p5Sketch);
}
main();
//# sourceMappingURL=build.js.map