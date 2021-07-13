/// <reference path="../Drawing/Cursor.ts" />

class State {
    t: Transform;
    thickness: number;
    constructor(t: Transform, thick: number = 0) {
        this.t = t;
        this.thickness = thick;
    }
}

class Section {
    c: string;
    evolveLimit: number;
    stage = 0;

    constructor(c: string, evolveLimit = 100, stage = 0) {
        this.c = c;
        this.evolveLimit = evolveLimit;
        this.stage = stage;
    }

    static Decode(s: string, sections: Record<string, Section>) {
        let ss = new Array<Section>();
        for(let c of s) {
            let section = sections[c];
            if(section != undefined) {
                ss.push(section);
            }
        }
        return ss;
    }
}

type DicType = Record<string, (section: Section) => Array<Section>>;
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
    axiom: Array<Section>;
    state: Array<Section>;
    energy: number;
    direction: number;
    actions: ActType;
    seed: string;
    rand: () => number;
    reset: (transform: Transform) => void;
    constructor(axiom = Array<Section>(), reset: (transform: Transform) => void = () => { }, stage = -1) {
        this.state = this.axiom = axiom;
        this.energy = stage;
        this.reset = reset;
        this.Randomize();
    }

    Grow(s: Section) {
        if(this.energy > 0 && s.stage < s.evolveLimit) {
            let available = Math.min(this.energy, s.evolveLimit - s.stage);
            this.energy -= available;
            s.stage += available;
        }
    }

    StopGrow(s: Section) {
        return this.energy >= 0 && s.stage < s.evolveLimit;
    }

    Randomize() {
        this.seed = Math.random().toString();
        this.rand = MathHelper.intSeededGenerator(this.seed);
    }

    Evolve() {
        let newState = new Array<Section>();
        for (let section of this.state) {
            let newSection = this.dictionary[section.c];
            if (newSection != undefined) {
                newState.push(...newSection(section));
            } else {
                newState.push(section);
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
            let action = this.actions[c.c];
            if (action != undefined) {
                action(cursor);
            }
        }
    }

    FormatState() {
        let s = '';
        for(let section of this.state) {
            s += section.c;
        }
        return s;
    }
}