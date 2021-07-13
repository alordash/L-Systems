/// <reference path="../../Miscellaneous/Math.ts" />
/// <reference path="../../Drawing/Geometry.ts" />

class KochCurve extends L_System {
    dictionary: DicType = {
        'F': () => {
            return `F+F-F-F+F`;
        }
    };
    static axiom = 'F';
    static thickness = 3;
    static direction = 0;

    step: NumberParam;
    angle: NumberParam;
    states: State[];

    constructor(step = new NumberParam(10, 0.01, 20), angle = new NumberParam(90, 0, 180)) {
        super(KochCurve.axiom, (transform: Transform) => {
            transform.dir = KochCurve.direction;
        });
        this.step = step;
        this.angle = angle;
        this.states = new Array<State>();
        const simpleDraw = (cursor: Cursor) => {
            cursor.DrawLine(this.step.v, KochCurve.thickness);
        }
        let actions: ActType = {
            'F': simpleDraw,
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