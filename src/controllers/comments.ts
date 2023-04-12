import { RequestHandler } from "express";
import { removeComment, fetchComment, updateComment } from "../models/comments";
import {
  numericParametricHandler,
  checkNoObjectValuesAreUndefined,
} from "./utils";
import { Error404, InvalidQueryParam } from "./errorStatus";
import { responseRowsOr404 } from "../models/utils";

export const deleteComment: RequestHandler = async (req, res, next) => {
  const { commentId } = req.params;
  numericParametricHandler(commentId, "commentId", next, async () => {
    if (!(await fetchComment(commentId)))
      return next(new Error404("comment not found"));
    await removeComment(commentId);
    res.status(204).send();
  });
};

export const patchComment: RequestHandler = async (req, res, next) => {
  const { commentId } = req.params;
  const inc_votes = parseInt(req.body.inc_votes);

  if (!inc_votes) return next(new InvalidQueryParam(400)); // mybe make a function along the lines of: ensureNumericRequestValue

  const updates = { commentId, inc_votes };
  checkNoObjectValuesAreUndefined(updates, next);

  numericParametricHandler(commentId, "commentId", next, async () => {
    const updatedComment = await updateComment(updates);

    if (!updatedComment) return next(new Error404(`comment ${commentId}`));

    res.status(200).send({ comment: updatedComment });
  });
};
