/*
/// <reference path="../../Miscellaneous/Math.ts" />
/// <reference path="../../Drawing/Geometry.ts" />

class FractalPlant extends L_System {
    dictionary: DicType = {
        'X': () => {
            return 'F+[[X]-X]-F[-FX]+X';
        },
        'F': () => {
            return `FF`;
        }
    };
    static axiom = 'X';
    static thickness = 3;
    static direction = 90;

    step: NumberParam;
    angle: NumberParam;
    states: State[];

    constructor(step = new NumberParam(10, 0, 20), angle = new NumberParam(25, 0, 180)) {
        super(FractalPlant.axiom, (transform: Transform) => {
            transform.dir = FractalPlant.direction;
        });
        this.step = step;
        this.angle = angle;
        this.states = new Array<State>();
        const simpleDraw = (cursor: Cursor) => {
            cursor.DrawLine(this.step.v, FractalPlant.thickness);
        }
        let actions: ActType = {
            'F': simpleDraw,
            '[': (cursor: Cursor) => {
                this.states.push(new State(cursor.loc.Copy()));
            },
            ']': (cursor: Cursor) => {
                cursor.loc.SetTo(this.states.pop().t);
            },
            '+': (cursor: Cursor) => {
                cursor.loc.dir += this.angle.v;
            },
            '-': (cursor: Cursor) => {
                cursor.loc.dir -= this.angle.v;
            }
        }
        this.actions = actions;
    }
}
*/