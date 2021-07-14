/// <reference path="../../Miscellaneous/Math.ts" />
/// <reference path="../../Drawing/Geometry.ts" />

class KochCurve extends L_System {
    Sections = {
        'F': new Section('F'),
        '+': new Section('+', undefined, -1),
        '-': new Section('-', undefined, -1)
    }
    dictionary: DicType = {
        'F': (s) => {
            this.Grow(s);
            if (this.StopGrow(s)) {
                return [s];
            }
            return Section.Decode('F+F-F-F+F', this.Sections, s.stage);
        }
    };
    static axiom = 'F';
    static thickness = 3;
    static direction = 0;

    step: NumberParam;
    angle: NumberParam;
    states: State[];

    constructor(step = new NumberParam(10, 0.01, 40), angle = new NumberParam(90, 0, 180)) {
        super((transform: Transform) => {
            transform.dir = KochCurve.direction;
            this.$energyDecrease = 0;
        });
        this.state = this.axiom = Section.Decode(KochCurve.axiom, this.Sections);
        this.step = step;
        this.angle = angle;
        this.states = new Array<State>();
        let actions: ActType = {
            'F': (cursor: Cursor, s: Section) => {
                cursor.DrawLine(this.step.v * s.progress(), KochCurve.thickness);
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
