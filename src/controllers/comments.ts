import { RequestHandler } from "express";

import { removeComment, fetchComment } from "../models/comments";
import { InvalidQueryParam } from "./errorStatus";

export const deleteComment: RequestHandler = async (req, res, next) => {
  const { commentId } = req.params;
  if (!parseInt(commentId))
    return next(new InvalidQueryParam(400, "commentId"));
  try {
    await fetchComment(commentId);
    await removeComment(commentId)
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
