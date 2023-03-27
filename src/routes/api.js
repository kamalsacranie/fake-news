const express = require("express");
const topicsRouter = require("./topics");

const apiRouter = express.Router();

apiRouter.get("/", (req, res, next) => {
  res.status(200).send({ message: "welcome to my fake news server" });
});

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
