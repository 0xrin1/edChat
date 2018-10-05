export default class Keyboard {
    keyboard: Array<Array<Object>>;
    constructor(params: Array<Object>) {
        this.keyboard = [];
        let tempArray: Array<Object> = [];
        let counter: number = 0;
        const width: number = 1;
        params.forEach((param: any) => {
            tempArray.push({
                // bot text field doesn't seem to support template syntax
                // newline not supported either
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
