"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Code;
(function (Code) {
    Code[Code["success"] = 200] = "success";
    Code[Code["error"] = 500] = "error";
})(Code || (Code = {}));
class Status {
    constructor(status) {
        this.code = Code[status];
    }
    set(status) {
        this.code = Code[status];
    }
}
class Response {
    constructor(message, error) {
        this.status = new Status('success');
        this.message = message;
        if (error) {
            this.status.set('error');
        }
    }
    getContent() {
        return this.content || false;
    }
    setContent(content) {
        this.content = content;
    }
}
exports.default = Response;
//# sourceMappingURL=response.js.map