/// <reference path="../Drawing/Cursor.ts" />

type DicType = Record<string, string>;
type ActType = Record<string, (cursor: Cursor) => void>;
class L_System {
    dictionary: DicType;
    axiom: string;
    state: string;
    actions: ActType;
    constructor(dictionary: DicType, axiom: string) {
        this.dictionary = dictionary;
        this.state = this.axiom = axiom;
    }

    Evolve() {
        let newState = '';
        for (let c of this.state) {
            if (this.dictionary[c] != undefined) {
                newState += this.dictionary[c];
            } else {
                newState += c;
            }
        }
        this.state = newState;
    }

    View(cursor: Cursor) {
        for (let c of this.state) {
            if (this.actions[c] != undefined) {
                this.actions[c](cursor);
            }
        }
    }
}