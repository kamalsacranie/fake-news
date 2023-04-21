"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateURL = exports.checkNoObjectValuesAreUndefined = exports.numericParametricHandler = exports.baseError = void 0;
const errorStatus_1 = require("./errorStatus");
const baseError = async (next, callback, failCriteria = (err) => false, nextObj) => {
    try {
        await callback();
    }
    catch (err) {
        // allows us to pass fail criteria and nextObj through as args
        const failed = failCriteria(err);
        if (failed) {
            return next(nextObj || err);
        }
        next(err);
    }
};
exports.baseError = baseError;
const numericParametricHandler = async (numericParametric, queryParamName, next, callback) => {
    if (!parseInt(numericParametric))
        return next(new errorStatus_1.InvalidQueryParam(400, queryParamName));
    (0, exports.baseError)(next, callback);
};
exports.numericParametricHandler = numericParametricHandler;
const checkNoObjectValuesAreUndefined = (object, next // not needed
) => {
    if (Object.values(object).includes(undefined)) {
        throw new errorStatus_1.InvalidPostObject(400);
    }
};
exports.checkNoObjectValuesAreUndefined = checkNoObjectValuesAreUndefined;
const validateURL = (url) => {
    if (!url)
        return;
    try {
        new URL(url);
        return url;
    }
    catch (err) {
        if (err.code === "ERR_INVALID_URL")
            throw new errorStatus_1.InvalidURL(url);
    }
};
exports.validateURL = validateURL;
