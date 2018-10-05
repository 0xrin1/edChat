"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Keyboard {
    constructor(params) {
        this.keyboard = [];
        let tempArray = [];
        let counter = 0;
        const width = 1;
        params.forEach((param) => {
            tempArray.push({
                text: 'id: ' + param.id,
                callback_data: `/r ${param.id}`,
            });
            console.log('tempArray', tempArray);
            this.keyboard.push(tempArray);
            tempArray = [];
        });
        console.log('keyboard', this.keyboard);
    }
}
exports.default = Keyboard;
//# sourceMappingURL=keyboard.js.map