class Section {
    static evolveLimit = 100;
    c: string;
    evolveLimit: number;
    stage = 0;
    values: Array<number>;
    init: (s: Section) => void;

    constructor(c: string, init: (s: Section) => void = () => { }, evolveLimit = Section.evolveLimit, stage = 0, values: Array<number> = undefined) {
        this.c = c;
        this.evolveLimit = evolveLimit;
        this.stage = stage;
        this.init = init;
        if (values != undefined) {
            this.values = values;
        } else {
            this.values = new Array<number>();
            this.init(this);
        }
    }

    Copy() {
        return new Section(this.c, this.init, this.evolveLimit, this.stage);
    }

    static Decode(s: string, sections: Record<string, Section>, stage = 0) {
        let ss = new Array<Section>();
        for (let c of s) {
            let section = sections[c];
            if (section != undefined) {
                let newSection = section.Copy();
                newSection.init(newSection);
                ss.push(newSection);
            }
        }
        if (ss.length) {
            ss[0].stage = stage;
        }
        return ss;
    }

    progress() {
        return this.stage / this.evolveLimit;
    }
}