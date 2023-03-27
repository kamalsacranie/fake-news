const express = require("express");
const { getTopics } = require("../controllers/topics");
const { sqlError } = require("./errors");

const topicsRouter = express.Router();

topicsRouter.get("/", getTopics);

topicsRouter.use(sqlError("our database does not have a topics table"));

module.exports = topicsRouter;
