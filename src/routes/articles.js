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

articlesRouter.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ message: "article not found" });
  } else {
    next(err);
  }
});
articlesRouter.use(sqlError("our database does not have a articles table"));

module.exports = articlesRouter;
