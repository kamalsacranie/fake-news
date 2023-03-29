const { removeComment, getComment } = require("../models/comments");
const { InvalidQueryParam } = require("./errorStatus");

exports.deleteComment = async (req, res, next) => {
  const { commentId } = req.params;
  if (!parseInt(commentId))
    return next(new InvalidQueryParam(400, "commentId"));
  try {
    await Promise.all([removeComment(commentId), getComment(commentId)]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
