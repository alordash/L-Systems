/*
/// <reference path="../../Miscellaneous/Math.ts" />
/// <reference path="../../Drawing/Geometry.ts" />

class SierpinskiArrowheadCurve extends L_System {
    dictionary: DicType = {
        'A': () => {
            return `B-A-B`;
        },
        'B': () => {
            return 'A+B+A';
        }
    };
    static axiom = 'A';
    static thickness = 3;
    static direction = 60;

    step: NumberParam;
    angle: NumberParam;
    states: State[];

    constructor(step = new NumberParam(10, 0.01, 20), angle = new NumberParam(60, 0, 180)) {
        super(SierpinskiArrowheadCurve.axiom, (transform: Transform) => {
            transform.dir = SierpinskiArrowheadCurve.direction;
        });
        this.step = step;
        this.angle = angle;
        this.states = new Array<State>();
        const simpleDraw = (cursor: Cursor) => {
            cursor.DrawLine(this.step.v, SierpinskiArrowheadCurve.thickness);
        }
        let actions: ActType = {
            'A': simpleDraw,
            'B': simpleDraw,
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