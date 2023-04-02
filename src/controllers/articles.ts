import { NextFunction, RequestHandler } from "express";
import {
  fetchArticle,
  fetchArticles,
  fetchArticleComments,
  addComment,
  updateArticle,
  Article,
} from "../models/articles";
import { Topic, fetchTopics } from "../models/topics";
import { InvalidQueryParam, InvalidPostObject } from "./errorStatus";
import { fetchUser } from "../models/users";
import { baseError, numericParametricHandler, objectValidator } from "./utils";

export enum OrderValues {
  "DESC",
  "ASC",
}

export enum ArticleColumns {
  "article_id",
  "title",
  "topic",
  "author",
  "body",
  "votes",
  "article_image_url",
}

export const getArticle: RequestHandler = async (req, res, next) => {
  const { articleId } = req.params;
  await numericParametricHandler(articleId, "articleId", next, async () => {
    const [article] = await fetchArticle(articleId);
    res.status(200).send({ article });
  });
};

export const getArticles: RequestHandler = async (req, res, next) => {
  let { topic, sort_by, order } = req.query as {
    topic: Topic["slug"];
    sort_by: string;
    order: string;
  }; // there must be a better way to do this

  if (topic) {
    const topicArray = await fetchTopics().then((topics) =>
      topics.map((topic) => topic.slug)
    );
    if (!topicArray.includes(topic))
      return next({ status: 400, message: "this topic does not exist" });
  }

  if (!(sort_by in ArticleColumns || !sort_by))
    return next({ status: 400, message: "invalid sort_by argument" });
  order = order ? order.toUpperCase() : "DESC";
  if (!(order in OrderValues))
    return next({ status: 400, message: "invalid order argument" });

  baseError(next, async () => {
    const articles = await fetchArticles(
      topic,
      sort_by as unknown as ArticleColumns, // i should not need to do this
      order as unknown as OrderValues // i should not need to do this
    );
    res.status(200).send({ articles });
  });
};

export const getArticleComments: RequestHandler = async (req, res, next) => {
  const { articleId } = req.params;
  await numericParametricHandler(articleId, "articleId", next, async () => {
    const [comments] = await Promise.all([
      fetchArticleComments(articleId),
      fetchArticle(articleId),
    ]);
    res.status(200).send({ comments });
  });
};

export const postArticleComment: RequestHandler = async (req, res, next) => {
  const { articleId } = req.params;
  const comment = {
    articleId,
    commentBody: req.body.body,
    username: req.body.username,
  };
  objectValidator(comment, next);
  numericParametricHandler(articleId, "articleId", next, async () => {
    await fetchUser(comment.username);
    await fetchArticle(articleId);
    const newComment = await addComment(comment);
    res.status(201).send({ comment: newComment });
  });
};

export const patchArticle: RequestHandler = async (req, res, next) => {
  const { articleId } = req.params;
  const updates = { articleId, inc_votes: req.body.inc_votes };
  objectValidator(updates, next);
  numericParametricHandler(articleId, "articleId", next, async () => {
    const article = await updateArticle(updates);
    res.status(200).send({ article });
  });
};
