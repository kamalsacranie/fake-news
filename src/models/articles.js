const { responseRowsOr404 } = require("./utils");
const db = require("../db");

exports.fetchArticle = async (articleId) => {
  const query = await db.query(
    `SELECT * FROM articles WHERE article_id = $1;`,
    [articleId]
  );
  return responseRowsOr404(query, "article not found");
};

exports.fetchArticles = async () => {
  const query = await db.query(
    `
      SELECT articles.*, COUNT(comments.article_id) as comment_count FROM articles
        JOIN comments
        ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;
    `
  );
  return responseRowsOr404(
    query,
    "the articles table currently contains no articles"
  );
};

exports.fetchArticleComments = async (articleId) => {
  const { rows } = await db.query(
    `
      SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC
    `,
    [articleId]
  );
  return rows;
};

exports.addComment = async ({ articleId, username, body }) => {
  const { rows } = await db.query(
    `
      INSERT INTO comments (body, article_id, author)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
    [body, articleId, username]
  );
  return rows;
};
