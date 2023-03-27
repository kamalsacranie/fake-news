const {
  fetchArticle,
  fetchArticles,
  fetchArticleComments,
} = require("../models/articles");

class InvalidQueryParam {
  constructor(status, queryParamName) {
    this.status = status;
    this.message = `the ${queryParamName} specified is not a valid`;
  }
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
    const comments = await fetchArticleComments(articleId);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};
