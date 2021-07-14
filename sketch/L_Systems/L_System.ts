/// <reference path="Section.ts" />
/// <reference path="../Drawing/Cursor.ts" />

class State {
    t: Transform;
    thickness: number;
    constructor(t: Transform, thick: number = 0) {
        this.t = t;
        this.thickness = thick;
    }
}

type DicType = Record<string, (section: Section) => Array<Section>>;
type ActType = Record<string, (cursor: Cursor, s: Section) => void>;

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
    static ignoreMark = '$';

    dictionary: DicType;
    axiom: Array<Section>;
    state: Array<Section>;
    $energy: number;
    $energyDecrease = 0;
    direction: number;
    actions: ActType;
    seed: string;
    rand: () => number;
    reset: (transform: Transform) => void;
    constructor(reset: (transform: Transform) => void = () => { }, stage = -1) {
        this.$energy = stage;
        this.$energyDecrease = 0;
        this.reset = reset;
        this.Randomize();
    }

    Grow(s: Section) {
        if (this.$energy < 0) {
            s.stage = s.evolveLimit;
        } else if (s.stage < s.evolveLimit && this.$energy > this.$energyDecrease) {
            s.stage = Math.min(this.$energy - this.$energyDecrease, s.evolveLimit);
        }
    }

    StopGrow(s: Section) {
        return s.stage < s.evolveLimit;
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
        this.$energyDecrease += Section.evolveLimit;
    }

    EvolveTo(generation: number, transform: Transform) {
        this.reset(transform);
        this.state = this.axiom;
        for (let i = 1; i < generation; i++) {
            this.Evolve();
        }
    }

    View(cursor: Cursor) {
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

    CountMaxEnergy(generation: number) {
        return (generation - 1) * Section.evolveLimit;
    }
}