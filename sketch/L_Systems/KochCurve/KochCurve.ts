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

    step: number;
    angle: number;
    states: State[];

    constructor(step: number = 10, angle: number = 90) {
        super(KochCurve.axiom, (transform: Transform) => {
            transform.dir = KochCurve.direction;
        });
        this.step = step;
        this.angle = angle;
        this.states = new Array<State>();
        const simpleDraw = (cursor: Cursor) => {
            cursor.DrawLine(this.step, KochCurve.thickness);
        }
        let actions: ActType = {
            'F': simpleDraw,
            '+': (cursor: Cursor) => {
                cursor.loc.dir += this.angle;
            },
            '-': (cursor: Cursor) => {
                cursor.loc.dir -= this.angle;
            }
        }
        this.actions = actions;
    }
}