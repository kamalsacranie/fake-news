import { RequestHandler } from "express";

import express from "express";
import fs from "fs/promises";
import topicsRouter from "./topics";
import articlesRouter from "./articles";
import usersRouter from "./users";
import commentsRouter from "./comments";

const apiRouter = express.Router();

apiRouter.get("/", async function (req, res, next) {
  try {
    const endpoints = JSON.parse(
      await fs.readFile(`${__dirname}/../../endpoints.json`, "utf8")
    );
    res.status(200).send(endpoints);
  } catch (err: any) {
    // must change to check for type
    if (err.code === "ENOENT") {
      return res
        .status(200)
        .send({ message: "welcome to my fake news server" });
    }
    next(err);
  }
} as RequestHandler);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);

export default apiRouter;
