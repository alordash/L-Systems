/// <reference path="../../Miscellaneous/Math.ts" />
/// <reference path="../../Drawing/Geometry.ts" />

class BinaryTree extends L_System {
    static dictionary: DicType = { '1': '12', '0': '1[0]0' };
    static axiom = '0';

    step: number;
    angle: number;
    random: boolean;
    locations: Transform[];

    constructor(step: number, angle: number, random: boolean) {
        super(BinaryTree.dictionary, BinaryTree.axiom);
        this.step = step;
        this.angle = angle;
        this.random = random;
        this.locations = new Array<Transform>();
        const simpleDraw = (cursor: Cursor) => {
            let step = this.step;
            if(this.random) {
                step = MathHelper.randomize(step);
            }
            cursor.DrawLine(step);
        }
        let actions: ActType = {
            '0': simpleDraw,
            '1': simpleDraw,
            '2': simpleDraw,
            '[': (cursor: Cursor) => {
                this.locations.push(cursor.loc.Copy());
                let angle = this.angle;
                if(this.random) {
                    angle = MathHelper.randomize(angle);
                }
                cursor.loc.dir += angle;
            },
            ']': (cursor: Cursor) => {
                cursor.loc.SetTo(this.locations.pop());
                let angle = this.angle;
                if(this.random) {
                    angle = MathHelper.randomize(angle);
                }
                cursor.loc.dir -= angle;
            }
        }
        this.actions = actions;
    }
}