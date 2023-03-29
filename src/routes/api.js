const express = require("express");
const topicsRouter = require("./topics");
const articlesRouter = require("./articles");
const usersRouter = require("./users");
const commentsRouter = require("./comments");

const apiRouter = express.Router();

apiRouter.get("/", (req, res, next) => {
  res.status(200).send({ message: "welcome to my fake news server" });
});

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
