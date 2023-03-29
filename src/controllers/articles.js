const {
  fetchArticle,
  fetchArticles,
  fetchArticleComments,
  addComment,
  updateArticle,
  fetchTopics,
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
  let { topic, sort_by, order } = req.query;

  if (topic) {
    const topicArray = await fetchTopics();
    topic =
      topic && topicArray.includes(topic)
        ? topic
        : next({ status: 404, message: "this topic does not exist" });
  }

  sort_by = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "votes",
    "article_image_url",
  ].includes(sort_by)
    ? sort_by
    : undefined;

  order = order && order.toUpperCase() === "ASC" ? "ASC" : "DESC";

  try {
    const articles = await fetchArticles(topic, sort_by, order);
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

exports.patchArticle = async (req, res, next) => {
  const { articleId } = req.params;
  const updates = { articleId, inc_votes: req.body.inc_votes };
  if (Object.values(updates).includes(undefined))
    return next(new InvalidPostObject());
  if (!parseInt(articleId))
    return next(new InvalidQueryParam(400, "articleId"));
  try {
    const article = await updateArticle(updates);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
