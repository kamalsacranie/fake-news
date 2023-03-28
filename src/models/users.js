const db = require("../db");
const { responseRowsOr404 } = require("./utils");

exports.fetchUsers = async () => {
  const query = await db.query(
    `
      SELECT * FROM users;
    `
  );
  return responseRowsOr404(query, "currently no users in the database");
};
