/// <reference path="../../Miscellaneous/Math.ts" />
/// <reference path="../../Drawing/Geometry.ts" />

class BinaryTree extends L_System {
    dictionary: DicType = {
        '0': () => {
            let s = `1[-20]+20`;
            if (this.random && MathHelper.randInt(0, 100) < this.splitChance) {
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
    static leafColors = [
        [0, 102, 0],
        [100, 200, 30],
        [50, 135, 10],
        [120, 120, 0]
    ];

    step: number;
    private _angle: number;
    thickness: number;
    #thick: number;
    random: boolean;
    splitChance: number;
    states: State[];

    #anglePart: number;

    constructor(step: number, angle: number, thickness: number = 16, random: boolean = false, splitChance: number = 50) {
        super(BinaryTree.axiom, () => { this.#thick = this.thickness; });
        this.step = step;
        this._angle = angle;
        this.#thick = this.thickness = thickness;
        this.#anglePart = BinaryTree.dif + (angle / 3);
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
        this._angle = v;
        this.#anglePart = BinaryTree.dif + (v / 3);
    }

    public get angle(): number {
        return this._angle;
    }

    CalcStep() {
        return this.random ? MathHelper.randomize(this.step) : this.step;
    }

    CalcAngle() {
        return this._angle + (this.random ? MathHelper.randInt(0, this.#anglePart) : 0);
    }
}