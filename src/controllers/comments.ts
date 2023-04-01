import { RequestHandler } from "express";
import { removeComment, fetchComment } from "../models/comments";
import { numericParametricHandler } from "./utils";

export const deleteComment: RequestHandler = async (req, res, next) => {
  const { commentId } = req.params;
  numericParametricHandler(commentId, "commentId", next, async () => {
    await fetchComment(commentId);
    await removeComment(commentId);
    res.status(204).send();
  });
};
