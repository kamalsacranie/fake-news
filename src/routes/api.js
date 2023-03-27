const express = require("express");
const apiRouter = express.Router();
apiRouter.get("/", (req, res, next) => {
  res.status(200).send({ message: "welcome to my fake news server" });
});
module.exports = apiRouter;
