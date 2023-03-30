import { responseRowsOr404, responseRowsOrError } from "./utils";
import db from "../db";
import { SeedArticle } from "../db/data/development-data/articles";
import { Topic } from "./topics";
import { User } from "./users";
import { ArticleColumns, OrderValues } from "../controllers/articles";
import { Comment } from "./comments";

export type Article = SeedArticle & {
  article_id: number;
  topic: Topic["topic_id"];
  author: User["username"];
  comment_count: string;
};

export const fetchArticle = async (articleId: string) => {
  const query = await db.query(
    `
      SELECT articles.*, COUNT(comments.comment_id) as comment_count FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id
    `,
    [articleId]
  );
  return responseRowsOr404<Article>(query, "article not found");
};

export const fetchArticles = async (
  topic: Topic["slug"],
  sort_by: ArticleColumns,
  order: OrderValues
) => {
  const query = await db.query(
    `
      SELECT articles.*, COUNT(comments.article_id) as comment_count FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
      ${topic ? `WHERE articles.topic = '${topic}'` : ""}
      GROUP BY articles.article_id
      ORDER BY articles.${sort_by ? sort_by : "created_at"} ${order};
    `
  );
  // feels like this should be in the controller but then retunr with the resopnserowsor404 would need to be moved to the controller ffs
  if (topic) return query.rows;
  return responseRowsOr404<Article>(
    query,
    "the articles table currently contains no articles"
  );
};

export const fetchArticleComments = async (articleId: string) => {
  const { rows }: { rows: Comment[] } = await db.query(
    `
      SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC
    `,
    [articleId]
  );
  return rows;
};

export const addComment = ({
  commentBody,
  articleId,
  username,
}: {
  [key: string]: any;
}) => {
  return db
    .query(
      `
          INSERT INTO comments (body, article_id, author)
          VALUES ($1, $2, $3)
          RETURNING *;
        `,
      [commentBody, articleId, username]
    )
    .then(({ rows: [newComment] }) => newComment as Comment);
};

export const updateArticle = async ({
  articleId,
  inc_votes,
}: {
  articleId: string;
  inc_votes: number;
}) => {
  const query = await db.query(
    `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;
    `,
    [inc_votes, articleId]
  );
  const result = responseRowsOr404<Article>(query, "article not found");
  // this needs to be done better
  if (Array.isArray(result)) return result[0];
  return result;
};
