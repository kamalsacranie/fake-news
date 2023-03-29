const { responseRowsOr404, responseRowsOrError } = require("./utils");
const db = require("../db");

exports.fetchArticle = async (articleId) => {
  const query = await db.query(
    `
      SELECT articles.*, COUNT(comments.comment_id) as comment_count FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id
    `,
    [articleId]
  );
  return responseRowsOr404(query, "article not found");
};

exports.fetchArticles = async (topic, sort_by, order) => {
  const query = await db.query(
    `
      SELECT articles.*, COUNT(comments.article_id) as comment_count FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
      ${topic ? `WHERE articles.topic = '${topic}'` : ""}
      GROUP BY articles.article_id
      ORDER BY articles.${sort_by ? sort_by : "created_at"} ${order};
    `
  );
  // feels like this should be in the controller but then retunr with the resopnserowsor404 would need to be moved to the controller ffs
  if (topic) return query.rows;
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

exports.addComment = ({ commentBody, articleId, username }) => {
  return db
    .query(
      `
          INSERT INTO comments (body, article_id, author)
          VALUES ($1, $2, $3)
          RETURNING *;
        `,
      [commentBody, articleId, username]
    )
    .then(({ rows: [newComment] }) => newComment);
};

exports.updateArticle = async ({ articleId, inc_votes }) => {
  const query = await db.query(
    `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;
    `,
    [inc_votes, articleId]
  );
  const result = responseRowsOr404(query, "article not found");
  if (Array.isArray(result)) return result[0];
  return result;
};

exports.fetchTopics = async () => {
  const { rows } = await db.query({
    text: `SELECT DISTINCT topic FROM articles`,
    rowMode: "array",
  });
  return rows.flat();
};
