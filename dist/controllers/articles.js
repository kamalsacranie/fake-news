"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchArticle = exports.postArticleComment = exports.getArticleComments = exports.getArticles = exports.getArticle = exports.ArticleColumns = exports.OrderValues = void 0;
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
    ArticleColumns[ArticleColumns["title"] = 1] = "title";
    ArticleColumns[ArticleColumns["topic"] = 2] = "topic";
    ArticleColumns[ArticleColumns["author"] = 3] = "author";
    ArticleColumns[ArticleColumns["body"] = 4] = "body";
    ArticleColumns[ArticleColumns["votes"] = 5] = "votes";
    ArticleColumns[ArticleColumns["article_image_url"] = 6] = "article_image_url";
})(ArticleColumns = exports.ArticleColumns || (exports.ArticleColumns = {}));
const getArticle = async (req, res, next) => {
    const { articleId } = req.params;
    await (0, utils_1.numericParametricHandler)(articleId, "articleId", next, async () => {
        const article = await (0, articles_1.fetchArticle)(articleId);
        // responseRowsOr404(article, "article not found"); // problem catching the rejection
        if (!article)
            return next(new errorStatus_1.Error404("article")); // neet to suss out what we must do about returning
        res.status(200).send({ article });
    });
};
exports.getArticle = getArticle;
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
    await (0, utils_1.numericParametricHandler)(articleId, "articleId", next, async () => {
        const [comments, article] = await Promise.all([
            (0, articles_1.fetchArticleComments)(articleId),
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
    (0, utils_1.checkNoObjectValuesAreUndefined)(comment, next);
    (0, utils_1.numericParametricHandler)(articleId, "articleId", next, async () => {
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
    (0, utils_1.checkNoObjectValuesAreUndefined)(updates, next);
    (0, utils_1.numericParametricHandler)(articleId, "articleId", next, async () => {
        const updatedArticle = await (0, articles_1.updateArticle)(updates);
        if (!updatedArticle)
            return next(new errorStatus_1.Error404(`article id ${articleId}`));
        res.status(200).send({ article: updatedArticle });
    });
};
exports.patchArticle = patchArticle;
