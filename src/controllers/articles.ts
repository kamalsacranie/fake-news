import { NextFunction, RequestHandler } from "express";
import {
  fetchArticle,
  fetchArticles,
  fetchArticleComments,
  addComment,
  updateArticle,
  Article,
  addArticle,
} from "../models/articles";
import { Topic, fetchTopics } from "../models/topics";
import {
  InvalidQueryParam,
  InvalidPostObject,
  Error404,
  BaseError,
} from "./errorStatus";
import { fetchUser } from "../models/users";
import {
  baseError,
  numericParametricHandler,
  checkNoObjectValuesAreUndefined,
  validateURL,
} from "./utils";
import { responseRowsOr404, responseRowsOrError } from "../models/utils";

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
    const article = await fetchArticle(articleId);
    // responseRowsOr404(article, "article not found"); // problem catching the rejection. this is because with try catch you actually need to throw
    if (!article) return next(new Error404("article")); // neet to suss out what we must do about returning
    res.status(200).send({ article });
  });
};

export type RequestArticle = {
  author: string;
  title: string;
  body: string;
  topic: string;
  article_img_url?: string;
};
export const postArticle: RequestHandler = async (req, res, next) => {
  const requestBody: RequestArticle = req.body;
  const article: RequestArticle = {
    author: requestBody.author,
    title: requestBody.title,
    body: requestBody.body,
    topic: requestBody.topic,
  };
  baseError(next, async () => {
    checkNoObjectValuesAreUndefined(article, next);
    article["article_img_url"] = validateURL(requestBody.article_img_url);
    const newArticle: Article = await addArticle(article);
    newArticle["comment_count"] = "0";
    res.status(201).send({ article: newArticle });
  });
};

export const getArticles: RequestHandler = async (req, res, next) => {
  let { topic, sort_by, order, limit, p } = req.query as {
    [key: string]: string;
  };

  const parsedLimit = limit ? parseInt(limit) : 10,
    parsedPage = p ? parseInt(p) : 1;

  if (!(parsedLimit > 0 && parsedPage > 0))
    return next({
      status: 400,
      message: "both limit and p params must be positive, non-zero integers",
    });

  if (topic) {
    const topicArray = await fetchTopics().then((topics) =>
      topics.map((topic) => topic.slug)
    );
    if (!topicArray.includes(topic))
      return next(new BaseError(400, "this topic does not exist"));
  }

  // think i can use the article type here and use keyof?
  if (!(sort_by in ArticleColumns || !sort_by))
    return next(new InvalidQueryParam(400, "sort_by"));
  order = order ? order.toUpperCase() : "DESC";
  if (!(order in OrderValues)) return next(new InvalidQueryParam(400, "order"));

  baseError(next, async () => {
    const articles = await fetchArticles(
      topic,
      sort_by as unknown as ArticleColumns, // i should not need to do this
      order as unknown as OrderValues, // i should not need to do this
      parsedLimit,
      parsedPage
    );
    if (!articles) return next(new Error404(`${topic} articles`));
    res.status(200).send({ articles });
  });
};

export const getArticleComments: RequestHandler = async (req, res, next) => {
  const { articleId } = req.params;
  await numericParametricHandler(articleId, "articleId", next, async () => {
    const [comments, article] = await Promise.all([
      // even in this promise rejects, we would only get that rejection if we used .catch and not try catch
      fetchArticleComments(articleId),
      fetchArticle(articleId),
    ]);
    if (!article) return next(new Error404("article"));
    if (!comments) return next(new Error404("article comments"));
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
  numericParametricHandler(articleId, "articleId", next, async () => {
    checkNoObjectValuesAreUndefined(comment, next);
    if (!(await fetchUser(comment.username)))
      return next(new BaseError(400, "unknown user"));
    if (!(await fetchArticle(articleId))) return next(new Error404("article"));
    const newComment = await addComment(comment);
    res.status(201).send({ comment: newComment });
  });
};

export const patchArticle: RequestHandler = async (req, res, next) => {
  const { articleId } = req.params;
  const inc_votes = parseInt(req.body.inc_votes);
  if (!inc_votes) return next(new InvalidQueryParam(400, "inc_votes")); // we now have two different wayt o handle errors, a functional way and a class way. we need to choose one
  const updates = { articleId, inc_votes };
  numericParametricHandler(articleId, "articleId", next, async () => {
    checkNoObjectValuesAreUndefined(updates, next);
    const updatedArticle = await updateArticle(updates);
    if (!updatedArticle) return next(new Error404(`article id ${articleId}`));
    res.status(200).send({ article: updatedArticle });
  });
};
