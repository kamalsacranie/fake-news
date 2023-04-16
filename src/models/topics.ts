import db from "../db";

export type Topic = {
  slug: string;
  description: string;
};

export const fetchTopics = async () => {
  const { rows } = await db.query(`SELECT * FROM topics;`);
  return rows as Topic[];
};

export const addTopic = async ({ slug, description }: Topic) => {
  const {
    rows: [topic],
  } = await db.query<Topic>(
    `
      INSERT INTO topics (slug, description)
      VALUES ($1, $2)
      RETURNING *;
    `,
    [slug, description]
  );
  return topic;
};
