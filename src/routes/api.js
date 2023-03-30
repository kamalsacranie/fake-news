const express = require("express");
const fs = require("fs/promises");
const topicsRouter = require("./topics");
const articlesRouter = require("./articles");
const usersRouter = require("./users");
const commentsRouter = require("./comments");

const apiRouter = express.Router();

apiRouter.get("/", async (req, res, next) => {
  try {
    const endpoints = JSON.parse(
      await fs.readFile(`${__dirname}/../../endpoints.json`, "utf8")
    );
    res.status(200).send(endpoints);
  } catch (err) {
    if (err.code === "ENOENT") {
      return res
        .status(200)
        .send({ message: "welcome to my fake news server" });
    }
    next(err);
  }
});

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
