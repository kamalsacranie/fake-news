const express = require("express");
const {
  getArticle,
  getArticles,
  getArticleComments,
  postArticleComment,
} = require("../controllers/articles");
const { sqlError } = require("./errors");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:articleId", getArticle);
articlesRouter.get("/:articleId/comments", getArticleComments);
articlesRouter.post("/:articleId/comments", postArticleComment);

articlesRouter.use(sqlError("our database does not have a articles table"));

module.exports = articlesRouter;
