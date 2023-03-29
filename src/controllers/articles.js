const {
  fetchArticle,
  fetchArticles,
  fetchArticleComments,
  addComment,
} = require("../models/articles");
const { InvalidQueryParam, InvalidPostObject } = require("./errorStatus");
const { fetchUser } = require("../models/users");

exports.getArticle = async (req, res, next) => {
  const { articleId } = req.params;
  if (!parseInt(articleId))
    return next(new InvalidQueryParam(400, "articleId"));
  try {
    const [article] = await fetchArticle(articleId);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  try {
    const articles = await fetchArticles();
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getArticleComments = async (req, res, next) => {
  const { articleId } = req.params;
  if (!parseInt(articleId))
    return next(new InvalidQueryParam(400, "articleId"));
  try {
    const [comments] = await Promise.all([
      fetchArticleComments(articleId),
      fetchArticle(articleId),
    ]);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postArticleComment = async (req, res, next) => {
  const articleId = parseInt(req.params.articleId);
  if (!articleId) return next(new InvalidQueryParam(400, "articleId"));
  const comment = {
    articleId,
    commentBody: req.body.body,
    username: req.body.username,
  };
  if (Object.values(comment).includes(undefined))
    return next(new InvalidPostObject());
  try {
    const [newComment] = await Promise.all([
      addComment(comment),
      fetchUser(comment.username),
    ]);
    res.status(201).send({ comment: newComment });
  } catch (err) {
    next(err);
  }
};
