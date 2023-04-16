import { RequestHandler } from "express";
import { Topic, addTopic, fetchTopics } from "../models/topics";
import { baseError, checkNoObjectValuesAreUndefined } from "./utils";
import { responseRowsOr404 } from "../models/utils";
import { BaseError } from "./errorStatus";
import slugify from "slugify";

// can remove async here
export const getTopics: RequestHandler = async function (req, res, next) {
  baseError(next, async () => {
    const topics = await fetchTopics();
    responseRowsOr404(topics, "currently no topics in the database");
    res.status(200).send({ topics });
  });
};

export const postTopic: RequestHandler = function (req, res, next) {
  const { body } = req;
  const topic: Topic = { slug: body.slug, description: body.description };
  baseError(
    next,
    async () => {
      checkNoObjectValuesAreUndefined(topic, next);
      topic.slug = slugify(topic.slug, { strict: true, lower: true });
      const newTopic = await addTopic(topic);
      res.status(201).send({ topic: newTopic });
    },
    (err) => err.code === "23505",
    new BaseError(409, `topic "${topic.slug}" already exists`)
  );
};
