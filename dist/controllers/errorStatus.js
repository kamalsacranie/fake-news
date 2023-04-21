"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidURL = exports.InvalidPostObject = exports.InvalidQueryParam = exports.Error404 = exports.BaseError = void 0;
class BaseError {
    constructor(status, message) {
        this.status = status;
        this.message = message;
    }
}
exports.BaseError = BaseError;
class Error404 extends BaseError {
    constructor(resourceName) {
        super(404, `${resourceName} not found`);
    }
}
exports.Error404 = Error404;
class InvalidQueryParam extends BaseError {
    constructor(status, queryParamName = "query parameter") {
        super(status, `the ${queryParamName} specified is not a valid`);
        this.status = status;
        this.queryParamName = queryParamName;
    }
}
exports.InvalidQueryParam = InvalidQueryParam;
class InvalidPostObject extends BaseError {
    constructor(status = 400, message = `bad POST request`) {
        super(status, message);
        this.status = status;
        this.message = message;
    }
}
exports.InvalidPostObject = InvalidPostObject;
class InvalidURL extends BaseError {
    constructor(url, status = 400) {
        super(status, `invalid URL given: ${url}`);
        this.url = url;
        this.status = status;
    }
}
exports.InvalidURL = InvalidURL;
