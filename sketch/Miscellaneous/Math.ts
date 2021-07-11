class MathHelper {
    static randInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randomize(n: number) {
        return n * this.randInt(0.9, 1.25);
    }
}