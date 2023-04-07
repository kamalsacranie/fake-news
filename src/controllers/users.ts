import { RequestHandler } from "express";
import { User, addUser, fetchUsers } from "../models/users";
import { baseError, checkNoObjectValuesAreUndefined } from "./utils";
import { InvalidPostObject } from "./errorStatus";
import { fetchUser } from "../models/users";

export const getUsers: RequestHandler = async (req, res, next) => {
  baseError(next, async () => {
    const users = await fetchUsers();
    res.status(200).send({ users });
  });
};

export const postUser: RequestHandler = async (req, res, next) => {
  const { username, name, avatar_url } = req.body;
  const userToAddMandatory = {
    username,
    name,
  };
  checkNoObjectValuesAreUndefined(userToAddMandatory, next);
  const userToAdd: User = { ...userToAddMandatory, avatar_url };

  baseError(
    next,
    async () => {
      const newUser = await addUser(userToAdd);
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
    if (!user)
      return Promise.reject({ status: 404, message: "user not found" });
    res.status(200).send({ user });
  });
};
