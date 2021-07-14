/// <reference path="../../Miscellaneous/Math.ts" />
/// <reference path="../../Drawing/Geometry.ts" />

class DragonCurve extends L_System {
    Sections = {
        'F': new Section('F'),
        'G': new Section('G'),
        '+': new Section('+', undefined),
        '-': new Section('-', undefined)
    }
    dictionary: DicType = {
        'F': (s) => {
            this.Grow(s);
            if (this.StopGrow(s)) {
                return [s];
            }
            let v = s.stage;
            return Section.Decode('F+G', this.Sections, undefined, [v, 0, v]);
        },
        'G': (s) => {
            this.Grow(s);
            if (this.StopGrow(s)) {
                return [s];
            }
            let v = s.stage;
            return Section.Decode('F-G', this.Sections, undefined, [v, 0, v]);
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
    static axiom = 'F';
    static thickness = 3;
    static direction = 180;

    step: NumberParam;
    angle: NumberParam;

    constructor(step = new NumberParam(10, 0.01, 30), angle = new NumberParam(90, 0, 180)) {
        super((transform: Transform) => {
            transform.dir = DragonCurve.direction;
            this.$energyDecrease = 0;
        });
        this.state = this.axiom = Section.Decode(DragonCurve.axiom, this.Sections);
        this.step = step;
        this.angle = angle;
        const simpleDraw = (cursor: Cursor, s: Section) => {
            cursor.DrawLine(this.step.v, DragonCurve.thickness);
        }
        let actions: ActType = {
            'F': simpleDraw,
            'G': simpleDraw,
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