const { responseRowsOr404 } = require("./utils");
const db = require("../db");

exports.fetchArticle = async (article_id) => {
  const query = await db.query(
    `SELECT * FROM articles WHERE article_id = $1;`,
    [article_id]
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
    `
  );
  return responseRowsOr404(
    query,
    "the articles table currently contains no articles"
  );
};
