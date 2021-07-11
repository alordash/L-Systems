class Point {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    Copy(): Point {
        return new Point(this.x, this.y);
    }
}

class Transform {
    public pos: Point;
    public dir: number;
    constructor(pos: Point, dir: number) {
        this.pos = pos;
        this.dir = dir;
    }

    Copy(): Transform {
        return new Transform(this.pos.Copy(), this.dir);
    }

    SetTo(t: Transform) {
        this.pos.x = t.pos.x;
        this.pos.y = t.pos.y;
        this.dir = t.dir;
    }
}