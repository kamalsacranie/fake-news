import { RequestHandler } from "express";
import {
  fetchArticle,
  fetchArticles,
  fetchArticleComments,
  addComment,
  updateArticle,
} from "../models/articles";
import { Topic, fetchTopics } from "../models/topics";
import { InvalidQueryParam, InvalidPostObject } from "./errorStatus";
import { fetchUser } from "../models/users";

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
  if (!parseInt(articleId))
    return next(new InvalidQueryParam(400, "articleId"));
  try {
    const [article] = await fetchArticle(articleId);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
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

  try {
    const articles = await fetchArticles(
      topic,
      sort_by as unknown as ArticleColumns,
      order as unknown as OrderValues
    ); // i should not need to do this
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

export const getArticleComments: RequestHandler = async (req, res, next) => {
  const { articleId } = req.params;
  if (!parseInt(articleId))
    return next(new InvalidQueryParam(400, "articleId"));
  try {
    const [comments] = await Promise.all([
      fetchArticleComments(articleId),
      fetchArticle(articleId),
    ]);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

export const postArticleComment: RequestHandler = async (req, res, next) => {
  const articleId = parseInt(req.params.articleId);
  if (!articleId) return next(new InvalidQueryParam(400, "articleId"));
  const comment = {
    articleId,
    commentBody: req.body.body,
    username: req.body.username,
  };
  if (Object.values(comment).includes(undefined))
    return next(new InvalidPostObject());
  try {
    const [newComment] = await Promise.all([
      addComment(comment),
      fetchUser(comment.username),
    ]);
    res.status(201).send({ comment: newComment });
  } catch (err) {
    next(err);
  }
};

export const patchArticle: RequestHandler = async (req, res, next) => {
  const { articleId } = req.params;
  const updates = { articleId, inc_votes: req.body.inc_votes };
  if (Object.values(updates).includes(undefined))
    return next(new InvalidPostObject());
  if (!parseInt(articleId))
    return next(new InvalidQueryParam(400, "articleId"));
  try {
    const article = await updateArticle(updates);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
