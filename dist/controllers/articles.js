"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = exports.patchArticle = exports.postArticleComment = exports.getArticleComments = exports.getArticles = exports.postArticle = exports.getArticle = exports.ArticleColumns = exports.OrderValues = void 0;
const articles_1 = require("../models/articles");
const topics_1 = require("../models/topics");
const errorStatus_1 = require("./errorStatus");
const users_1 = require("../models/users");
const utils_1 = require("./utils");
var OrderValues;
(function (OrderValues) {
    OrderValues[OrderValues["DESC"] = 0] = "DESC";
    OrderValues[OrderValues["ASC"] = 1] = "ASC";
})(OrderValues = exports.OrderValues || (exports.OrderValues = {}));
var ArticleColumns;
(function (ArticleColumns) {
    ArticleColumns[ArticleColumns["article_id"] = 0] = "article_id";
    ArticleColumns[ArticleColumns["created_at"] = 1] = "created_at";
    ArticleColumns[ArticleColumns["title"] = 2] = "title";
    ArticleColumns[ArticleColumns["topic"] = 3] = "topic";
    ArticleColumns[ArticleColumns["author"] = 4] = "author";
    ArticleColumns[ArticleColumns["body"] = 5] = "body";
    ArticleColumns[ArticleColumns["votes"] = 6] = "votes";
    ArticleColumns[ArticleColumns["article_image_url"] = 7] = "article_image_url";
    ArticleColumns[ArticleColumns["comment_count"] = 8] = "comment_count";
})(ArticleColumns = exports.ArticleColumns || (exports.ArticleColumns = {}));
const getArticle = async (req, res, next) => {
    const { articleId } = req.params;
    await (0, utils_1.numericParametricHandler)(articleId, "articleId", next, async () => {
        const article = await (0, articles_1.fetchArticle)(articleId);
        // responseRowsOr404(article, "article not found"); // problem catching the rejection. this is because with try catch you actually need to throw
        if (!article)
            return next(new errorStatus_1.Error404("article")); // neet to suss out what we must do about returning
        res.status(200).send({ article });
    });
};
exports.getArticle = getArticle;
const postArticle = async (req, res, next) => {
    const requestBody = req.body;
    const article = {
        author: requestBody.author,
        title: requestBody.title,
        body: requestBody.body,
        topic: requestBody.topic,
    };
    (0, utils_1.baseError)(next, async () => {
        (0, utils_1.checkNoObjectValuesAreUndefined)(article, next);
        article["article_img_url"] = (0, utils_1.validateURL)(requestBody.article_img_url);
        const newArticle = await (0, articles_1.addArticle)(article);
        newArticle["comment_count"] = "0";
        res.status(201).send({ article: newArticle });
    });
};
exports.postArticle = postArticle;
const getArticles = async (req, res, next) => {
    let { topic, sort_by, order, limit, p } = req.query;
    const parsedLimit = limit ? parseInt(limit) : 10, parsedPage = p ? parseInt(p) : 1;
    if (!(parsedLimit > 0 && parsedPage > 0))
        return next({
            status: 400,
            message: "both limit and p params must be positive, non-zero integers",
        });
    if (topic) {
        const topicArray = await (0, topics_1.fetchTopics)().then((topics) => topics.map((topic) => topic.slug));
        if (!topicArray.includes(topic))
            return next(new errorStatus_1.BaseError(400, "this topic does not exist"));
    }
    // think i can use the article type here and use keyof?
    if (!(sort_by in ArticleColumns || !sort_by))
        return next(new errorStatus_1.InvalidQueryParam(400, "sort_by"));
    order = order ? order.toUpperCase() : "DESC";
    if (!(order in OrderValues))
        return next(new errorStatus_1.InvalidQueryParam(400, "order"));
    (0, utils_1.baseError)(next, async () => {
        const articles = await (0, articles_1.fetchArticles)(topic, sort_by, // i should not need to do this
        order, // i should not need to do this
        parsedLimit, parsedPage);
        if (!articles)
            return next(new errorStatus_1.Error404(`${topic} articles`));
        res.status(200).send({ articles });
    });
};
exports.getArticles = getArticles;
const getArticleComments = async (req, res, next) => {
    const { articleId } = req.params;
    const { limit, p } = req.query;
    const parsedLimit = limit ? parseInt(limit) : 10, parsedPage = p ? parseInt(p) : 1;
    if (!(parsedLimit > 0 && parsedPage > 0))
        return next({
            status: 400,
            message: "both limit and p params must be positive, non-zero integers",
        });
    await (0, utils_1.numericParametricHandler)(articleId, "articleId", next, async () => {
        const [comments, article] = await Promise.all([
            // even in this promise rejects, we would only get that rejection if we used .catch and not try catch
            (0, articles_1.fetchArticleComments)(articleId, parsedLimit, parsedPage),
            (0, articles_1.fetchArticle)(articleId),
        ]);
        if (!article)
            return next(new errorStatus_1.Error404("article"));
        if (!comments)
            return next(new errorStatus_1.Error404("article comments"));
        res.status(200).send({ comments });
    });
};
exports.getArticleComments = getArticleComments;
const postArticleComment = async (req, res, next) => {
    const { articleId } = req.params;
    const comment = {
        articleId,
        commentBody: req.body.body,
        username: req.body.username,
    };
    (0, utils_1.numericParametricHandler)(articleId, "articleId", next, async () => {
        (0, utils_1.checkNoObjectValuesAreUndefined)(comment, next);
        if (!(await (0, users_1.fetchUser)(comment.username)))
            return next(new errorStatus_1.BaseError(400, "unknown user"));
        if (!(await (0, articles_1.fetchArticle)(articleId)))
            return next(new errorStatus_1.Error404("article"));
        const newComment = await (0, articles_1.addComment)(comment);
        res.status(201).send({ comment: newComment });
    });
};
exports.postArticleComment = postArticleComment;
const patchArticle = async (req, res, next) => {
    const { articleId } = req.params;
    const inc_votes = parseInt(req.body.inc_votes);
    if (!inc_votes)
        return next(new errorStatus_1.InvalidQueryParam(400, "inc_votes")); // we now have two different wayt o handle errors, a functional way and a class way. we need to choose one
    const updates = { articleId, inc_votes };
    (0, utils_1.numericParametricHandler)(articleId, "articleId", next, async () => {
        (0, utils_1.checkNoObjectValuesAreUndefined)(updates, next);
        const updatedArticle = await (0, articles_1.updateArticle)(updates);
        if (!updatedArticle)
            return next(new errorStatus_1.Error404(`article id ${articleId}`));
        res.status(200).send({ article: updatedArticle });
    });
};
exports.patchArticle = patchArticle;
const deleteArticle = async (req, res, next) => {
    const { articleId } = req.params;
    (0, utils_1.numericParametricHandler)(articleId, "articleId", next, async () => {
        if (!(await (0, articles_1.fetchArticle)(articleId)))
            return next(new errorStatus_1.Error404(`article id ${articleId}`)); // at an odds whether I want to now throw or return next (it's the same but what's more consistent)
        await (0, articles_1.removeArticle)(articleId);
        res.status(204).send();
    });
};
exports.deleteArticle = deleteArticle;
