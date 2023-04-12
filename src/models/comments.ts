import { SeedComment } from "../db/data/development-data/comments";
import db from "../db";
import { updateNumericColumn } from "./utils";

export type Comment = {
  comment_id: number;
  created_at: string;
} & SeedComment;

export const removeComment = async (commentId: string) => {
  await db.query(
    `
      DELETE FROM comments WHERE comment_id = $1
    `,
    [commentId]
  );
};

export const fetchComment = async (commentId: string) => {
  const {
    rows: [comment],
  } = await db.query(
    `
      SELECT * FROM comments WHERE comment_id = $1
    `,
    [commentId]
  );
  return comment as Comment | undefined;
};

export const updateComment = async ({
  commentId,
  inc_votes,
}: {
  commentId: string;
  inc_votes: number;
}) => {
  const updatedComment = await updateNumericColumn<Comment>(
    "comments",
    "votes",
    inc_votes,
    "comment_id",
    commentId
  );
  return updatedComment;
};
