enum Code {
    success = 200,
    error = 500,
}

// TODO: implement this withous any
class Status {
    code: any;
    constructor(status?: any) {
        this.code = Code[status];
    }

    set(status: any) {
        this.code = Code[status];
    }
}

export default class Response {
    status: Status;
    message: string;
    content: any;
    constructor (message?: string, error?: string) {
        this.status = new Status('success');
        this.message = message;
        if (error) {
            this.status.set('error');
        }
    }

    getContent() : any {
        return this.content || false;
    }

    setContent(content: any) :void {
        this.content = content;
    }
}
