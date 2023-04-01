import { RequestHandler } from "express";
import { fetchTopics } from "../models/topics";
import { baseError } from "./utils";

export const getTopics: RequestHandler = async function (req, res, next) {
  baseError(next, async () => {
    const topics = await fetchTopics();
    res.status(200).send({ topics });
  });
};
