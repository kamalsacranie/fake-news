import express from "express";
import { deleteComment } from "../controllers/comments";

const commentsRouter = express.Router();

commentsRouter.delete("/:commentId", deleteComment);

export default commentsRouter;
