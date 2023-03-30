import db from "../db";
import { responseRowsOr404 } from "./utils";

export type Topic = {
  topic_id: number;
  slug: string;
  description: string;
};

export const fetchTopics = async () => {
  const query = await db.query(`SELECT * FROM topics;`);
  return responseRowsOr404<Topic>(query, "currently no topics in the database");
};
