import { RequestHandler } from "express";
import { fetchTopics } from "../models/topics";
import { baseError } from "./utils";
import { responseRowsOr404 } from "../models/utils";

export const getTopics: RequestHandler = async function (req, res, next) {
  baseError(next, async () => {
    const topics = await fetchTopics();
    responseRowsOr404(topics, "currently no topics in the database");
    res.status(200).send({ topics });
  });
};
