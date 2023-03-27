const { responseRowsOr404 } = require("./utils");
const db = require("../db");

exports.fetchArticle = async (article_id) => {
  const query = await db.query(
    `SELECT * FROM articles WHERE article_id = $1;`,
    [article_id]
  );
  return responseRowsOr404(query, "article not found");
};
