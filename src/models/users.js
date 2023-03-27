const db = require("../db");
const { responseRowsOr404 } = require("./utils");

exports.fetchUsers = async () => {
  const query = await db.query(
    `
      SELECT * FROM users;
    `
  );
  return responseRowsOr404(
    query,
    "there are currently no users in the users table"
  );
};
