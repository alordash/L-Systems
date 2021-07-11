/// <reference path="Geometry.ts" />
class Cursor {
    p5: p5;
    loc: Transform;
    constructor(p5: p5, loc: Transform) {
        this.p5 = p5;
        this.loc = loc;
    }

    DrawLine(length: number, strokeWeight: number = 1, color: p5.Color = this.p5.color(0, 0, 0)) {
        let x = this.loc.pos.x;
        let y = this.loc.pos.y;
        let rad = this.loc.dir * Math.PI / 180;
        let xNew = x + length * Math.cos(rad);
        let yNew = y - length * Math.sin(rad);

        this.p5.strokeWeight(strokeWeight);
        this.p5.stroke(color);
        this.p5.line(x, y, xNew, yNew);
        
        this.loc.pos = new Point(xNew, yNew);
    }

    Turn(angle: number) {
        this.loc.dir += angle;
    }
}