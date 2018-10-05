export default class RelayReference {
    to: Array<number>;
    from: Array<number>;
    constructor(to: Array<number>, from: Array<number>) {
        this.to = to;
        this.from = from;
    }

    forEach(callback: (param: any) => void) {
        callback({ to: this.to, from: this.from });
    }
}
