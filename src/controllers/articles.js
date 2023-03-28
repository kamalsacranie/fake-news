const {
  fetchArticle,
  fetchArticles,
  fetchArticleComments,
  addComment,
} = require("../models/articles");

class InvalidQueryParam {
  constructor(status, queryParamName) {
    this.status = status;
    this.message = `the ${queryParamName} specified is not a valid`;
  }
}

function articleRoute(callback) {
  return async (req, res, next) => {
    const { articleId } = req.params;
    if (!parseInt(articleId))
      return next(new InvalidQueryParam(400, "articleId"));
    try {
      callback(req, res, articleId);
    } catch (err) {
      next(err);
    }
  };
}

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

exports.postArticleComment = articleRoute(async (req, res, articleId) => {
  const [newComment] = await addComment({ articleId, ...req.body });
  res.status(201).send({ comment: newComment });
});
