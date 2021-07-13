/// <reference path="../Drawing/Cursor.ts" />

type DicType = Record<string, () => string>;
type ActType = Record<string, (cursor: Cursor) => void>;

class NumberParam {
    _v: number;
    min: number;
    max: number;

    constructor(v: number, min = v - 30, max = v + 30) {
        this._v = v; this.min = min; this.max = max;
    }


    public get v(): number {
        return this._v;
    }

    public set v(v: number) {
        this._v = v;
        if (this._v < this.min)
            this._v = this.min;
        else if (this._v > this.max)
            this._v = this.max;
    }
}

abstract class L_System {
    static propertyMark = '_';
    static minMark = '_min';
    static maxMark = '_max';

    dictionary: DicType;
    axiom: string;
    state: string;
    direction: number;
    actions: ActType;
    seed: string;
    rand: () => number;
    reset: (transform: Transform) => void;
    constructor(axiom: string = '', reset: (transform: Transform) => void = () => { }) {
        this.state = this.axiom = axiom;
        this.reset = reset;
        this.Randomize();
    }

    Randomize() {
        this.seed = Math.random().toString();
        this.rand = MathHelper.intSeededGenerator(this.seed);
    }

    Evolve() {
        let newState = '';
        for (let c of this.state) {
            if (this.dictionary[c] != undefined) {
                newState += this.dictionary[c]();
            } else {
                newState += c;
            }
        }
        this.state = newState;
    }

    EvolveTo(n: number, transform: Transform) {
        this.reset(transform);
        this.state = this.axiom;
        for (let i = 1; i < n; i++) {
            this.Evolve();
        }
    }

    View(cursor: Cursor) {
        for (let c of this.state) {
            if (this.actions[c] != undefined) {
                this.actions[c](cursor);
            }
        }
    }
}

class State {
    t: Transform;
    thickness: number;
    constructor(t: Transform, thick: number = 0) {
        this.t = t;
        this.thickness = thick;
    }
}