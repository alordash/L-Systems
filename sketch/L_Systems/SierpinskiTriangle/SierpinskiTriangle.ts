/// <reference path="../../Miscellaneous/Math.ts" />
/// <reference path="../../Drawing/Geometry.ts" />

class SierpinskiTriangle extends L_System {
    dictionary: DicType = {
        'F': () => {
            return `F-G+F+G-F`;
        },
        'G': () => {
            return 'GG';
        }
    };
    static axiom = 'F-G-G';
    static thickness = 3;
    static direction = 90;

    step: NumberParam;
    angle: NumberParam;
    states: State[];

    constructor(step = new NumberParam(10, 0.01, 100), angle = new NumberParam(120, 0, 180)) {
        super(SierpinskiTriangle.axiom, (transform: Transform) => {
            transform.dir = SierpinskiTriangle.direction;
        });
        this.step = step;
        this.angle = angle;
        this.states = new Array<State>();
        const simpleDraw = (cursor: Cursor) => {
            cursor.DrawLine(this.step.v, SierpinskiTriangle.thickness);
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