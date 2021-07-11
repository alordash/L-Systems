/// <reference path="../../Drawing/Geometry.ts" />

class BinaryTree extends L_System {
    static dictionary: DicType = { '1': '12', '0': '1[0]0' };
    static axiom = '0';

    step: number;
    angle: number;
    locations: Transform[];

    constructor(step: number, angle: number) {
        super(BinaryTree.dictionary, BinaryTree.axiom);
        this.step = step;
        this.angle = angle;
        this.locations = new Array<Transform>();
        const simpleDraw = (cursor: Cursor) => {
            cursor.DrawLine(this.step);
        }
        let actions: ActType = {
            '0': simpleDraw,
            '1': simpleDraw,
            '2': simpleDraw,
            '[': (cursor: Cursor) => {
                this.locations.push(cursor.loc.Copy());
                cursor.loc.dir += this.angle;
            },
            ']': (cursor: Cursor) => {
                cursor.loc.SetTo(this.locations.pop());
                cursor.loc.dir -= this.angle;
            }
        }
        this.actions = actions;
    }
}