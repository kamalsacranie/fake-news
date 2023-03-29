const db = require("../db");
const { responseRowsOr404, responseRowsOrError } = require("./utils");

exports.fetchUsers = async () => {
  const query = await db.query(
    `
      SELECT * FROM users;
    `
  );
  return responseRowsOr404(query, "currently no users in the database");
};

exports.fetchUser = async (username) => {
  const query = await db.query(
    `
      SELECT * FROM users WHERE username = $1
    `,
    [username]
  );
  return responseRowsOrError(query, 400, "unknown user");
};
