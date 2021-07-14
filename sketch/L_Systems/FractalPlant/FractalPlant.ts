/// <reference path="../../Miscellaneous/Math.ts" />
/// <reference path="../../Drawing/Geometry.ts" />

class FractalPlant extends L_System {
    Sections = {
        'X': new Section('X'),
        'F': new Section('F'),
        '+': new Section('+', undefined),
        '-': new Section('-', undefined),
        '[': new Section('[', undefined, -1),
        ']': new Section(']', undefined, -1)
    }
    dictionary: DicType = {
        'X': (s) => {
            this.Grow(s);
            if (this.StopGrow(s)) {
                return [s];
            }
            return Section.Decode('F+[[X]-X]-F[-FX]+X', this.Sections);
        },
        'F': (s) => {
            this.Grow(s);
            if (this.StopGrow(s)) {
                return [s];
            }
            return Section.Decode('FF', this.Sections, s.stage);
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
    static axiom = 'X';
    static thickness = 3;
    static direction = 90;

    step: NumberParam;
    angle: NumberParam;
    states: State[];

    constructor(step = new NumberParam(10, 0, 20), angle = new NumberParam(25, 0, 180)) {
        super((transform: Transform) => {
            transform.dir = FractalPlant.direction;
            this.$energyDecrease = 0;
        });
        this.state = this.axiom = Section.Decode(FractalPlant.axiom, this.Sections);
        this.step = step;
        this.angle = angle;
        this.states = new Array<State>();
        let actions: ActType = {
            'F': (cursor: Cursor, s: Section) => {
                cursor.DrawLine(this.step.v * s.progress(), FractalPlant.thickness);
            },
            '[': (cursor: Cursor) => {
                this.states.push(new State(cursor.loc.Copy()));
            },
            ']': (cursor: Cursor) => {
                cursor.loc.SetTo(this.states.pop().t);
            },
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