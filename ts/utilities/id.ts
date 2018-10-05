const MATH_DIGITS = 1000000;

export default class Id {
    id: number;

    constructor() {
        this.generate();
    }

    generate() {
        this.id = Math.floor((Math.random() * MATH_DIGITS) + 1) + Date.now();
    }

    get() {
        return this.id;
    }
}
