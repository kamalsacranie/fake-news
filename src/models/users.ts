import db from "../db";

export type User = {
  username: string;
  name: string;
  avatar_url?: string;
};

export const fetchUsers = async () => {
  const { rows }: { rows: User[] } = await db.query(
    `
      SELECT * FROM users;
    `
  );
  return rows;
};

export const fetchUser = async (username: User["username"]) => {
  const {
    rows: [user],
  } = await db.query(
    `
      SELECT * FROM users WHERE username = $1
    `,
    [username]
  );
  return user as User | undefined;
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
