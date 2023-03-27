const db = require("../db");
const { responseRowsOr404 } = require("./utils");

exports.fetchTopics = async () => {
  const query = await db.query(`SELECT * FROM topics;`);
  return responseRowsOr404(query, "currently no topics in the database");
};
