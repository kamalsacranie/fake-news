import { RequestHandler } from "express";
import { User, addUser, fetchUsers } from "../models/users";
import { baseError, checkNoObjectValuesAreUndefined } from "./utils";
import { Error404, InvalidPostObject } from "./errorStatus";
import { fetchUser } from "../models/users";
import { responseRowsOr404 } from "../models/utils";

export const getUsers: RequestHandler = async (req, res, next) => {
  baseError(next, async () => {
    const users = await fetchUsers();
    if (!users.length) next(new Error("users"));
    res.status(200).send({ users });
  });
};

export const postUser: RequestHandler = async (req, res, next) => {
  const { username, name, avatar_url } = req.body;
  const userToAdd: Partial<User> = {
    username,
    name,
  };
  baseError(
    next,
    async () => {
      checkNoObjectValuesAreUndefined(userToAdd, next);
      userToAdd["avatar_url"] = avatar_url;
      const newUser = await addUser(userToAdd as User);
      res.status(201).send({ user: newUser });
    },
    (err) => err.code === "23505" && err.constraint === "users_pkey",
    new InvalidPostObject(400, "unknown user")
  );
};

export const getUser: RequestHandler<{ username: string }> = (
  req,
  res,
  next
) => {
  const { username } = req.params;
  baseError(next, async () => {
    const user = await fetchUser(username);
    if (!user) return next(new Error404("user"));
    res.status(200).send({ user });
  });
};
