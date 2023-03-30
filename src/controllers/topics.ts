import { RequestHandler } from "express";

import { fetchTopics } from "../models/topics";

export const getTopics: RequestHandler = async function (req, res, next) {
  try {
    const topics = await fetchTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};
