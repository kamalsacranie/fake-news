"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNumericColumn = exports.responseRowsOr404 = exports.responseRowsOrError = void 0;
const pg_format_1 = __importDefault(require("pg-format"));
const db_1 = __importDefault(require("../db"));
const responseRowsOrError = function (response, status, messageIfNoRows) {
    if (!response)
        return Promise.reject({
            status: status,
            message: messageIfNoRows,
        });
    return response;
};
exports.responseRowsOrError = responseRowsOrError;
// remove general typeing
const responseRowsOr404 = function (response, messageIfNoRows) {
    if (!response) {
        return Promise.reject({
            status: 404,
            message: messageIfNoRows || "page not found",
        });
    }
};
exports.responseRowsOr404 = responseRowsOr404;
const updateNumericColumn = async function (tableName, numericColumnName, changeAmount, tablePrimaryKeyColumnName, tablePrimayKeyValue) {
    const formattedQuery = (0, pg_format_1.default)(`
      UPDATE %I
      SET %2$I = %2$I + %s
      WHERE %s = %s
      RETURNING *;
    `, tableName, numericColumnName, changeAmount, tablePrimaryKeyColumnName, tablePrimayKeyValue);
    const { rows: [updatedItem], } = await db_1.default.query(formattedQuery);
    return updatedItem;
};
exports.updateNumericColumn = updateNumericColumn;
