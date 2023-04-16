import { ErrorRequestHandler } from "express";

import express from "express";
import {
  getArticle,
  getArticles,
  getArticleComments,
  postArticleComment,
  patchArticle,
  postArticle,
} from "../controllers/articles";
import { sqlError } from "./errors";
import { SeedArticle } from "../db/data/development-data/articles";

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.post("/", postArticle);
articlesRouter.get<{ articleId: string }>("/:articleId", getArticle);
articlesRouter.patch("/:articleId", patchArticle);
articlesRouter.get("/:articleId/comments", getArticleComments);
articlesRouter.post("/:articleId/comments", postArticleComment);

articlesRouter.use(function (err, req, res, next) {
  if (err.code === "23503") {
    res.status(404).send({ message: "article not found" });
  } else {
    next(err);
  }
} as ErrorRequestHandler);
articlesRouter.use(sqlError("our database does not have a articles table"));

export default articlesRouter;
