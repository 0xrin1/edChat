"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Toolbox {
    deleteFromArray(arr, arrIndex) {
        return arr.slice(0, arrIndex).concat(arr.slice(arrIndex + 1));
    }
}
exports.default = Toolbox;
//# sourceMappingURL=toolbox.js.map