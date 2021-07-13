abstract class MathHelper {
    static map(value: number, min: number, max: number) {
        return Math.floor(value * (max - min + 1)) + min;
    }

    static randInt(min: number, max: number): number {
        return MathHelper.map(Math.random(), min, max);
    }

    static randomize(n: number, percentage: number = 0.3) {
        return n * MathHelper.randInt(1 - percentage, 1 + percentage);
    }

    static intSeededGenerator(seed = '') {
        let x = 0;
        let y = 0;
        let z = 0;
        let w = 0;
        let count = 0;

        function next() {
            const t = x ^ (x << 11);
            x = y;
            y = z;
            z = w;
            w ^= ((w >>> 19) ^ t ^ (t >>> 8)) >>> 0;
            count++;
            return w / 0x100000000 + 0.5;
        }

        for (var k = 0; k < seed.length + 64; k++) {
            x ^= seed.charCodeAt(k) | 0;
            next();
        }

        return next;
    }

    static randIntSeeded(min: number, max: number, generator: () => number) {
        return MathHelper.map(generator(), min, max);
    }
    
    static randomizeSeeded(n: number, percentage: number = 0.3, generator: () => number) {
        return n * MathHelper.randIntSeeded(1 - percentage, 1 + percentage, generator);
    }
}