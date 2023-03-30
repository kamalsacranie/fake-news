import db from "../db";
import { responseRowsOr404, responseRowsOrError } from "./utils";
import { SeedUser } from "../db/data/development-data/users";

export type User = SeedUser;

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
