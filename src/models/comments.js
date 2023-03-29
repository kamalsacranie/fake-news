const db = require("../db");
const { responseRowsOr404 } = require("./utils");

exports.removeComment = async (commentId) => {
  await db.query(
    `
      DELETE FROM comments WHERE comment_id = $1
    `,
    [commentId]
  );
};

exports.getComment = async (commentId) => {
  const query = await db.query(
    `
      SELECT * FROM comments WHERE comment_id = $1
    `,
    [commentId]
  );
  return responseRowsOr404(query, "comment not found");
};
