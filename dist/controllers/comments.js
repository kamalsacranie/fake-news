"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchComment = exports.deleteComment = void 0;
const comments_1 = require("../models/comments");
const utils_1 = require("./utils");
const errorStatus_1 = require("./errorStatus");
const deleteComment = async (req, res, next) => {
    const { commentId } = req.params;
    (0, utils_1.numericParametricHandler)(commentId, "commentId", next, async () => {
        if (!(await (0, comments_1.fetchComment)(commentId)))
            return next(new errorStatus_1.Error404("comment not found"));
        await (0, comments_1.removeComment)(commentId);
        res.status(204).send();
    });
};
exports.deleteComment = deleteComment;
const patchComment = async (req, res, next) => {
    const { commentId } = req.params;
    const inc_votes = parseInt(req.body.inc_votes);
    if (!inc_votes)
        return next(new errorStatus_1.InvalidQueryParam(400)); // mybe make a function along the lines of: ensureNumericRequestValue
    const updates = { commentId, inc_votes };
    (0, utils_1.checkNoObjectValuesAreUndefined)(updates, next);
    (0, utils_1.numericParametricHandler)(commentId, "commentId", next, async () => {
        const updatedComment = await (0, comments_1.updateComment)(updates);
        if (!updatedComment)
            return next(new errorStatus_1.Error404(`comment ${commentId}`));
        res.status(200).send({ comment: updatedComment });
    });
};
exports.patchComment = patchComment;
