"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeArticle = exports.updateArticle = exports.addComment = exports.fetchArticleComments = exports.fetchArticles = exports.addArticle = exports.fetchArticle = void 0;
const utils_1 = require("./utils");
const db_1 = __importDefault(require("../db"));
const fetchArticle = async (articleId) => {
    const { rows: [article], } = await db_1.default.query(`
      SELECT articles.*, COUNT(comments.comment_id) as comment_count FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id
    `, [articleId]);
    return article;
};
exports.fetchArticle = fetchArticle;
const addArticle = async ({ author, title, body, topic, article_image_url, }) => {
    const { rows: [article], } = await db_1.default.query(`
      INSERT INTO articles (author, title, body, topic${article_image_url ? ", article_image_url" : ""})
      VALUES ($1, $2, $3, $4${article_image_url ? ", $5" : ""})
      RETURNING *;
    `, [author, title, body, topic].concat(article_image_url ? [article_image_url] : []));
    return article;
};
exports.addArticle = addArticle;
const fetchArticles = async (topic, sort_by, order, limit, page_number) => {
    const { rows } = await db_1.default.query(`
      SELECT
        articles.*,
        COUNT(comments.article_id) as comment_count,
        COUNT(*) OVER() AS total_count
      FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
      ${topic ? `WHERE articles.topic = '${topic}'` : ""}
      GROUP BY articles.article_id
      ORDER BY ${sort_by || "created_at"} ${order}
      LIMIT $1 OFFSET $2;
    `, [limit, (page_number - 1) * limit]);
    return rows;
};
exports.fetchArticles = fetchArticles;
const fetchArticleComments = async (articleId, limit, page) => {
    const { rows } = await db_1.default.query(`
      SELECT * FROM comments
      WHERE comments.article_id = $1
      ORDER BY comments.created_at DESC
      LIMIT $2 OFFSET $3;
    `, [articleId, limit, (page - 1) * limit]);
    return rows;
};
exports.fetchArticleComments = fetchArticleComments;
const addComment = async ({ commentBody, articleId, username, }) => {
    const { rows: [comment], } = await db_1.default.query(// this is the way to type our queries
    `
      INSERT INTO comments (body, article_id, author)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [commentBody, articleId, username]);
    return comment;
};
exports.addComment = addComment;
const updateArticle = async ({ articleId, inc_votes, }) => {
    const updatedArticle = await (0, utils_1.updateNumericColumn)("articles", "votes", inc_votes, "article_id", articleId);
    return updatedArticle;
};
exports.updateArticle = updateArticle;
const removeArticle = (articleId) => {
    return db_1.default.query(`DELETE FROM articles WHERE articles.article_id = $1`, [articleId]);
};
exports.removeArticle = removeArticle;
