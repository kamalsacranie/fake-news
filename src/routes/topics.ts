import express from "express";
import { getTopics, postTopic } from "../controllers/topics";
import { sqlError } from "./errors";

const topicsRouter = express.Router();

topicsRouter.get("/", getTopics);
topicsRouter.post("/", postTopic);

topicsRouter.use(sqlError("our database does not have a topics table"));

export default topicsRouter;
