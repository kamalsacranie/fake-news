import { updateNumericColumn } from "./utils";
import db from "../db";
import { SeedArticle } from "../db/data/development-data/articles";
import { Topic } from "./topics";
import { User } from "./users";
import { ArticleColumns, OrderValues } from "../controllers/articles";
import { Comment } from "./comments";
import { QueryResult } from "pg";

export type Article = SeedArticle & {
  article_id: number;
  topic: Topic["topic_id"];
  author: User["username"];
  comment_count: string;
};

export const fetchArticle = async (articleId: string | number) => {
  const {
    rows: [article],
  } = await db.query<Article>(
    `
      SELECT articles.*, COUNT(comments.comment_id) as comment_count FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id
    `,
    [articleId]
  );
  return article;
};

export const addArticle = async ({
  author,
  title,
  body,
  topic,
  article_image_url,
}: Record<string, string> & { article_image_url?: string }) => {
  const {
    rows: [article],
  } = await db.query(
    `
      INSERT INTO articles (author, title, body, topic${
        article_image_url ? ", article_image_url" : ""
      })
      VALUES ($1, $2, $3, $4${article_image_url ? ", $5" : ""})
      RETURNING *;
    `,
    [author, title, body, topic].concat(
      article_image_url ? [article_image_url] : []
    )
  );
  return article;
};

export const fetchArticles = async (
  topic: Topic["slug"],
  sort_by: ArticleColumns,
  order: OrderValues,
  limit: number,
  page_number: number
) => {
  const { rows }: { rows: Article[] } = await db.query(
    `
      SELECT
        articles.*,
        COUNT(comments.article_id) as comment_count,
        COUNT(*) OVER() AS total_count
      FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
      ${topic ? `WHERE articles.topic = '${topic}'` : ""}
      GROUP BY articles.article_id
      ORDER BY articles.${sort_by || "created_at"} ${order}
      LIMIT $1 OFFSET $2;
    `,
    [limit, (page_number - 1) * limit]
  );
  return rows;
};

export const fetchArticleComments = async (
  articleId: string,
  limit: number,
  page: number
) => {
  const { rows }: { rows: Comment[] } = await db.query(
    `
      SELECT * FROM comments
      WHERE comments.article_id = $1
      ORDER BY comments.created_at DESC
      LIMIT $2 OFFSET $3;
    `,
    [articleId, limit, (page - 1) * limit]
  );
  return rows;
};

export const addComment = async ({
  commentBody,
  articleId,
  username,
}: {
  [key: string]: any;
}) => {
  const {
    rows: [comment],
  } = await db.query<Comment>( // this is the way to type our queries
    `
      INSERT INTO comments (body, article_id, author)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
    [commentBody, articleId, username]
  );
  return comment;
};

export const updateArticle = async ({
  articleId,
  inc_votes,
}: {
  articleId: string;
  inc_votes: number;
}) => {
  const updatedArticle = await updateNumericColumn<Article>(
    "articles",
    "votes",
    inc_votes,
    "article_id",
    articleId
  );
  return updatedArticle;
};

export const removeArticle = (articleId: string) => {
  return db.query<never>(
    `DELETE FROM articles WHERE articles.article_id = $1`,
    [articleId]
  );
};
