const { fetchArticle } = require("../models/articles");

exports.getArticle = async (req, res, next) => {
  const { articleId } = req.params;
  if (!parseInt(articleId))
    return next({
      status: 400,
      message: "the aticle id specified is not a valid",
    });
  try {
    const [article] = await fetchArticle(articleId);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
