/*
/// <reference path="../../Miscellaneous/Math.ts" />
/// <reference path="../../Drawing/Geometry.ts" />

class DragonCurve extends L_System {
    dictionary: DicType = {
        'F': () => {
            return `F+G`;
        },
        'G': () => {
            return 'F-G';
        }
    };
    static axiom = 'F';
    static thickness = 3;
    static direction = 180;

    step: NumberParam;
    angle: NumberParam;
    states: State[];

    constructor(step = new NumberParam(10, 0.01, 30), angle = new NumberParam(90, 0, 180)) {
        super(DragonCurve.axiom, (transform: Transform) => {
            transform.dir = DragonCurve.direction;
        });
        this.step = step;
        this.angle = angle;
        this.states = new Array<State>();
        const simpleDraw = (cursor: Cursor) => {
            cursor.DrawLine(this.step.v, DragonCurve.thickness);
        }
        let actions: ActType = {
            'F': simpleDraw,
            'G': simpleDraw,
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