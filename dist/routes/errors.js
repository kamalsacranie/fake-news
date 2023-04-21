"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlError = void 0;
const sqlError = (message, status = 404) => {
    return (err, req, res, next) => {
        if (err.code) {
            res.status(status).send({
                code: err.code,
                message,
            });
        }
        else {
            next(err);
        }
    };
};
exports.sqlError = sqlError;
