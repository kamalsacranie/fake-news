const { fetchTopics } = require("../models/topics");

exports.getTopics = async function (req, res, next) {
  try {
    const topics = await fetchTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};
