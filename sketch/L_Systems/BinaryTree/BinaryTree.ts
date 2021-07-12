/// <reference path="../../Miscellaneous/Math.ts" />
/// <reference path="../../Drawing/Geometry.ts" />

class BinaryTree extends L_System {
    dictionary: DicType = {
        '0': () => {
            let s = `1[-20]+20`;
            if (this.random && MathHelper.randInt(0, 100) < this.splitChance.v) {
                s = `1[10]10`;
            } else if (!this.random) {
                s = `1[20]20`;
            }
            return s;
        },
        '1': () => {
            return `21`;
        },
        '2': () => {
            return '2';
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
        super(BinaryTree.axiom, (transform: Transform) => {
            this.#thick = this.thickness.v;
            transform.dir = BinaryTree.direction;
        });
        this.step = step;
        this._angle = angle;
        this.#thick = (this.thickness = thickness).v;
        this.#anglePart = BinaryTree.dif + (angle.v / 3);
        this.random = random;
        this.splitChance = splitChance;
        this.states = new Array<State>();
        const simpleDraw = (cursor: Cursor) => {
            if (!this.random || MathHelper.randInt(0, 10) > 2) {
                cursor.DrawLine(this.CalcStep(), this.#thick);
            }
        }
        let actions: ActType = {
            '0': (cursor: Cursor) => {
                cursor.DrawLine(this.CalcStep() * 0.75, Math.max(7.5, this.#thick * 1.2), cursor.p5.color(BinaryTree.leafColors[MathHelper.randInt(0, BinaryTree.leafColors.length - 1)]));
            },
            '1': simpleDraw,
            '2': simpleDraw,
            '[': (cursor: Cursor) => {
                this.#thick *= 0.75;
                this.states.push(new State(cursor.loc.Copy(), this.#thick));
                cursor.loc.dir += this.CalcAngle();
            },
            ']': (cursor: Cursor) => {
                let state = this.states.pop();
                this.#thick = state.thickness;
                cursor.loc.SetTo(state.t);
                cursor.loc.dir -= this.CalcAngle();
            },
            '+': (cursor: Cursor) => {
                cursor.loc.dir += this.CalcAngle();
            },
            '-': (cursor: Cursor) => {
                cursor.loc.dir -= this.CalcAngle();
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

    CalcStep() {
        return this.random ? MathHelper.randomize(this.step.v) : this.step.v;
    }

    CalcAngle() {
        return this._angle.v + (this.random ? MathHelper.randInt(0, this.#anglePart) : 0);
    }
}