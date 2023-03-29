const { removeComment } = require("../models/comments");

exports.deleteComment = async (req, res, next) => {
  const { commentId } = req.params;
  try {
    await removeComment(commentId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
