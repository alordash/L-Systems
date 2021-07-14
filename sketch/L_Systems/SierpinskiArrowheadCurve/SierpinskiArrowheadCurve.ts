/// <reference path="../../Miscellaneous/Math.ts" />
/// <reference path="../../Drawing/Geometry.ts" />

class SierpinskiArrowheadCurve extends L_System {
    Sections = {
        'A': new Section('A'),
        'B': new Section('B'),
        '+': new Section('+', undefined),
        '-': new Section('-', undefined)
    }
    dictionary: DicType = {
        'A': (s) => {
            this.Grow(s);
            if (this.StopGrow(s)) {
                return [s];
            }
            let v = s.stage;
            return Section.Decode('B-A-B', this.Sections, undefined, [v, 0, v, 0, v]);
        },
        'B': (s) => {
            this.Grow(s);
            if (this.StopGrow(s)) {
                return [s];
            }
            let v = s.stage;
            return Section.Decode('A+B+A', this.Sections, undefined, [v, 0, v, 0, v]);
        },
        '+': (s) => {
            this.Grow(s);
            return [s];
        },
        '-': (s) => {
            this.Grow(s);
            return [s];
        }
    };
    static axiom = 'A';
    static thickness = 3;
    static direction = 60;

    step: NumberParam;
    angle: NumberParam;

    constructor(step = new NumberParam(10, 0.01, 20), angle = new NumberParam(60, 0, 180)) {
        super((transform: Transform) => {
            transform.dir = SierpinskiArrowheadCurve.direction;
            this.$energyDecrease = 0;
        });
        this.state = this.axiom = Section.Decode(SierpinskiArrowheadCurve.axiom, this.Sections);
        this.step = step;
        this.angle = angle;
        const simpleDraw = (cursor: Cursor, s: Section) => {
            cursor.DrawLine(this.step.v, SierpinskiArrowheadCurve.thickness);
        }
        let actions: ActType = {
            'A': simpleDraw,
            'B': simpleDraw,
            '+': (cursor: Cursor, s: Section) => {
                cursor.loc.dir += this.angle.v * s.progress();
            },
            '-': (cursor: Cursor, s: Section) => {
                cursor.loc.dir -= this.angle.v * s.progress();
            }
        }
        this.actions = actions;
    }
}