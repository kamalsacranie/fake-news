const express = require("express");
const { getArticle } = require("../controllers/articles");

const articlesRouter = express.Router();

articlesRouter.get("/:articleId", getArticle);

module.exports = articlesRouter;
