"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_format_1 = __importDefault(require("pg-format"));
const __1 = __importDefault(require("../"));
const utils_1 = require("./utils");
const seed = ({ topicData, userData, articleData, commentData, }) => {
    return __1.default
        .query(`DROP TABLE IF EXISTS comments;`)
        .then(() => {
        return __1.default.query(`DROP TABLE IF EXISTS articles;`);
    })
        .then(() => {
        return __1.default.query(`DROP TABLE IF EXISTS users;`);
    })
        .then(() => {
        return __1.default.query(`DROP TABLE IF EXISTS topics;`);
    })
        .then(() => {
        const topicsTablePromise = __1.default.query(`
      CREATE TABLE topics (
        slug VARCHAR PRIMARY KEY,
        description VARCHAR
      );`);
        const usersTablePromise = __1.default.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR
      );`);
        return Promise.all([topicsTablePromise, usersTablePromise]);
    })
        .then(() => {
        return __1.default.query(`
      CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        topic VARCHAR NOT NULL REFERENCES topics(slug),
        author VARCHAR NOT NULL REFERENCES users(username),
        body VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        votes INT DEFAULT 0 NOT NULL,
        article_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
      );`);
    })
        .then(() => {
        return __1.default.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        body VARCHAR NOT NULL,
        article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
        author VARCHAR REFERENCES users(username) NOT NULL,
        votes INT DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );`);
    })
        .then(() => {
        const insertTopicsQueryStr = (0, pg_format_1.default)("INSERT INTO topics (slug, description) VALUES %L;", topicData.map(({ slug, description }) => [slug, description]));
        const topicsPromise = __1.default.query(insertTopicsQueryStr);
        const insertUsersQueryStr = (0, pg_format_1.default)("INSERT INTO users ( username, name, avatar_url) VALUES %L;", userData.map(({ username, name, avatar_url }) => [
            username,
            name,
            avatar_url,
        ]));
        const usersPromise = __1.default.query(insertUsersQueryStr);
        return Promise.all([topicsPromise, usersPromise]);
    })
        .then(() => {
        const formattedArticleData = articleData.map(utils_1.convertTimestampToDate);
        const insertArticlesQueryStr = (0, pg_format_1.default)("INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;", formattedArticleData.map(({ title, topic, author, body, created_at, votes = 0, article_img_url, }) => [title, topic, author, body, created_at, votes, article_img_url]));
        return __1.default.query(insertArticlesQueryStr);
    })
        .then(({ rows: articleRows }) => {
        const articleIdLookup = (0, utils_1.createRef)(articleRows, "title", "article_id");
        const formattedCommentData = (0, utils_1.formatComments)(commentData, articleIdLookup);
        const insertCommentsQueryStr = (0, pg_format_1.default)("INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L;", formattedCommentData.map(({ body, author, article_id, votes = 0, created_at }) => [
            body,
            author,
            article_id,
            votes,
            created_at,
        ]));
        return __1.default.query(insertCommentsQueryStr);
    });
};
exports.default = seed;
