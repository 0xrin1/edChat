export default class Toolbox {
    deleteFromArray(arr: Array<any>, arrIndex: number) {
        return arr.slice(0,arrIndex).concat(arr.slice(arrIndex + 1));
    }
}
