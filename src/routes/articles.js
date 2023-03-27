const express = require("express");
const { getArticle, getArticles } = require("../controllers/articles");
const { sqlError } = require("./errors");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:articleId", getArticle);

articlesRouter.use(sqlError("our database does not have a articles table"));

module.exports = articlesRouter;
