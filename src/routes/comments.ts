import express from "express";
import { deleteComment, patchComment } from "../controllers/comments";

const commentsRouter = express.Router();

commentsRouter.patch("/:commentId", patchComment);
commentsRouter.delete("/:commentId", deleteComment);

export default commentsRouter;
