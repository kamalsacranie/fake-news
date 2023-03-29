const db = require("../db");

exports.removeComment = async (commentId) => {
  await db.query(
    `
      DELETE FROM comments WHERE comment_id = $1
    `,
    [commentId]
  );
};
