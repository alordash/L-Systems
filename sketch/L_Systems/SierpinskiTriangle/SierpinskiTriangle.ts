
/// <reference path="../../Miscellaneous/Math.ts" />
/// <reference path="../../Drawing/Geometry.ts" />

class SierpinskiTriangle extends L_System {
    Sections = {
        'F': new Section('F'),
        'G': new Section('G'),
        '+': new Section('+', undefined, -1),
        '-': new Section('-', undefined, -1)
    }
    dictionary: DicType = {
        'F': (s) => {
            this.Grow(s);
            if(this.StopGrow(s)) {
                return [s];
            }
            return Section.Decode('F-G+F+G-F', this.Sections, s.stage);
        },
        'G': (s) => {
            this.Grow(s);
            if(this.StopGrow(s)) {
                return [s];
            }
            return Section.Decode('GG', this.Sections, s.stage);
        }
    };
    static axiom = 'F-G-G';
    static thickness = 3;
    static direction = 0;

    step: NumberParam;
    angle: NumberParam;
    states: State[];

    constructor(step = new NumberParam(10, 0.01, 30), angle = new NumberParam(120, 0, 180)) {
        super((transform: Transform) => {
            transform.dir = SierpinskiTriangle.direction;
            this.$energyDecrease = 0;
        });
        this.state = this.axiom = Section.Decode(SierpinskiTriangle.axiom, this.Sections);
        this.step = step;
        this.angle = angle;
        this.states = new Array<State>();
        const simpleDraw = (cursor: Cursor, s: Section) => {
            cursor.DrawLine(this.step.v * s.progress(), SierpinskiTriangle.thickness);
        }
        let actions: ActType = {
            'F': simpleDraw,
            'G': simpleDraw,
            '+': (cursor: Cursor) => {
                cursor.loc.dir += -this.angle.v;
            },
            '-': (cursor: Cursor) => {
                cursor.loc.dir -= -this.angle.v;
            }
        }
        this.actions = actions;
    }
}
