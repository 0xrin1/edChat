"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MATH_DIGITS = 1000000;
class Id {
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
exports.default = Id;
//# sourceMappingURL=id.js.map