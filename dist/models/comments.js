"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComment = exports.fetchComment = exports.removeComment = void 0;
const db_1 = __importDefault(require("../db"));
const utils_1 = require("./utils");
const removeComment = async (commentId) => {
    await db_1.default.query(`
      DELETE FROM comments WHERE comment_id = $1
    `, [commentId]);
};
exports.removeComment = removeComment;
const fetchComment = async (commentId) => {
    const { rows: [comment], } = await db_1.default.query(`
      SELECT * FROM comments WHERE comment_id = $1
    `, [commentId]);
    return comment;
};
exports.fetchComment = fetchComment;
const updateComment = async ({ commentId, inc_votes, }) => {
    const updatedComment = await (0, utils_1.updateNumericColumn)("comments", "votes", inc_votes, "comment_id", commentId);
    return updatedComment;
};
exports.updateComment = updateComment;
