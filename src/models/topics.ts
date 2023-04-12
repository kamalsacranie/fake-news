import db from "../db";

export type Topic = {
  topic_id: number;
  slug: string;
  description: string;
};

export const fetchTopics = async () => {
  const { rows } = await db.query(`SELECT * FROM topics;`);
  return rows as Topic[];
};
