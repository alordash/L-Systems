/// <reference path="../../Miscellaneous/Math.ts" />
/// <reference path="../../Drawing/Geometry.ts" />

class BinaryTree extends L_System {
    Sections: Record<string, Section>;
    InitSections() {
        this.Sections = {
            '0': new Section('0', (s) => {
                s.values.push(this.RandStep() * 0.75);
            }),
            '1': new Section('1', (s) => {
                s.values.push(MathHelper.randIntSeeded(0, 10, this.rand));
                s.values.push(this.RandStep());
            }),
            '2': new Section('2', (s) => {
                s.values.push(MathHelper.randIntSeeded(0, 10, this.rand));
                s.values.push(this.RandStep());
            }),
            '+': new Section('+', (s) => {
                s.values.push(this.RandAngle());
            }),
            '-': new Section('-', (s) => {
                s.values.push(this.RandAngle());
            }),
            '[': new Section('[', (s) => {
                s.values.push(this.RandAngle());
            }),
            ']': new Section(']', (s) => {
                s.values.push(this.RandAngle());
            })
        }
    }
    dictionary: DicType = {
        '0': (s) => {
            this.Grow(s);
            if (this.StopGrow(s)) {
                return [s];
            }
            let ss = Section.Decode('1[-20]+20', this.Sections, undefined, [0, 0, 0, 0, 0, 0, 0, s.stage]);
            if (this.random && MathHelper.randIntSeeded(0, 100, this.rand) < this.splitChance.v) {
                ss = Section.Decode('1[10]10', this.Sections, s.stage);
            } else if (!this.random) {
                ss = Section.Decode('1[20]20', this.Sections, s.stage);
            }
            return ss;
        },
        '1': (s) => {
            this.Grow(s);
            if (this.StopGrow(s)) {
                return [s];
            }
            return Section.Decode('21', this.Sections, s.stage);
        },
        '2': (s) => {
            this.Grow(s);
            return [s];
        },
        '+': (s) => {
            this.Grow(s);
            return [s];
        },
        '-': (s) => {
            this.Grow(s);
            return [s];
        },
        '[': (s) => {
            this.Grow(s);
            return [s];
        },
        ']': (s) => {
            this.Grow(s);
            return [s];
        }
    };
    static axiom = '2220';
    static dif = 3;
    static direction = 90;
    static leafColors = [
        [0, 102, 0],
        [100, 200, 30],
        [50, 135, 10],
        [120, 120, 0]
    ];

    step: NumberParam;
    private _angle: NumberParam;
    thickness: NumberParam;
    random: boolean;
    splitChance: NumberParam;
    states: State[];

    #thick: number;
    #anglePart: number;

    constructor(step = new NumberParam(10, 0, 50), angle = new NumberParam(23, 0, 90), thickness = new NumberParam(16, 1, 40), random: boolean = true, splitChance = new NumberParam(23, 0, 100)) {
        super((transform: Transform) => {
            this.#thick = this.thickness.v;
            transform.dir = BinaryTree.direction;
            this.rand = MathHelper.intSeededGenerator(this.seed);
            this.states = new Array<State>();
            this.$energyDecrease = 0;
        });
        this.step = step;
        this._angle = angle;
        this.#thick = (this.thickness = thickness).v;
        this.#anglePart = BinaryTree.dif + (angle.v / 3);
        this.random = random;
        this.splitChance = splitChance;
        this.states = new Array<State>();
        this.InitSections();
        this.state = this.axiom = Section.Decode(BinaryTree.axiom, this.Sections);
        const simpleDraw = (cursor: Cursor, s: Section) => {
            if (!this.random || s.values[0] > 2) {
                cursor.DrawLine(this.CalcStep(s.values[1]) * s.progress(), this.#thick);
            }
        }
        let actions: ActType = {
            '0': (cursor: Cursor, s: Section) => {
                cursor.DrawLine(this.CalcStep(s.values[0]), Math.max(7.5, this.#thick * 1.2), cursor.p5.color(BinaryTree.leafColors[MathHelper.randIntSeeded(0, BinaryTree.leafColors.length - 1, this.rand)]));
            },
            '1': simpleDraw,
            '2': simpleDraw,
            '[': (cursor: Cursor, s: Section) => {
                this.#thick *= 0.75;
                this.states.push(new State(cursor.loc.Copy(), this.#thick));
                cursor.loc.dir += this.CalcAngle(s.values[0]) * s.progress();
            },
            ']': (cursor: Cursor, s: Section) => {
                let state = this.states.pop();
                this.#thick = state.thickness;
                cursor.loc.SetTo(state.t);
                cursor.loc.dir -= this.CalcAngle(s.values[0]) * s.progress();
            },
            '+': (cursor: Cursor, s: Section) => {
                cursor.loc.dir += this.CalcAngle(s.values[0]) * s.progress();
            },
            '-': (cursor: Cursor, s: Section) => {
                cursor.loc.dir -= this.CalcAngle(s.values[0]) * s.progress();
            }
        }
        this.actions = actions;
    }

    public set angle(v: number) {
        this._angle.v = v;
        this.#anglePart = BinaryTree.dif + (v / 3);
    }

    public get angle(): number {
        return this._angle.v;
    }

    RandStep() {
        return this.random ? MathHelper.randomizeSeeded(1, 0.3, this.rand) : 1;
    }

    RandAngle() {
        return this.random ? MathHelper.randIntSeeded(0, 1, this.rand) : 0;
    }

    CalcStep(v: number) {
        return v * this.step.v;
    }

    CalcAngle(v: number) {
        return this._angle.v + v * this.#anglePart;
    }
}