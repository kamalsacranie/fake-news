const { fetchArticle } = require("../models/articles");

exports.getArticle = async (req, res, next) => {
  const { articleId } = req.params;
  console.log(req.params);
  const [article] = await fetchArticle(articleId);
  console.log(article);
  res.status(200).send({ article });
};
