import db from "../db";
import { responseRowsOr404, responseRowsOrError } from "./utils";

export type User = {
  username: string;
  name: string;
  avatar_url?: string;
};

export const fetchUsers = async () => {
  const query = await db.query(
    `
      SELECT * FROM users;
    `
  );
  return responseRowsOr404<User>(query, "currently no users in the database");
};

export const fetchUser = async (username: string) => {
  const query = await db.query(
    `
      SELECT * FROM users WHERE username = $1
    `,
    [username]
  );
  return responseRowsOrError<User>(query, 400, "unknown user");
};

export const addUser = async ({ username, name, avatar_url }: User) => {
  const {
    rows: [user],
  } = await db.query(
    `
      INSERT INTO users (username, name, avatar_url)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
    [username, name, avatar_url]
  );
  return user as User;
};
