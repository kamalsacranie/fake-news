const express = require("express");
const { getTopics } = require("../controllers/topics");

const topicsRouter = express.Router();

topicsRouter.get("/", getTopics);

topicsRouter.use((err, req, res, next) => {
  if (err.code) {
    res.status(404).send({
      code: err.code,
      message: "our database does not have a topics table",
    });
  } else {
    next(err);
  }
});

module.exports = topicsRouter;
