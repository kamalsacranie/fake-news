const { fetchArticle } = require("../models/articles");

exports.getArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const [article] = await fetchArticle(articleId);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
