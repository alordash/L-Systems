/// <reference path="../Drawing/Cursor.ts" />

type DicType = Record<string, () => string>;
type ActType = Record<string, (cursor: Cursor) => void>;
abstract class L_System {
    static propertyMark = '_';

    dictionary: DicType;
    axiom: string;
    state: string;
    direction: number;
    actions: ActType;
    reset: (transform: Transform) => void;
    constructor(axiom: string = '', reset: (transform: Transform) => void = () => { }) {
        this.state = this.axiom = axiom;
        this.reset = reset;
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
    constructor(t: Transform, thick: number) {
        this.t = t;
        this.thickness = thick;
    }
}