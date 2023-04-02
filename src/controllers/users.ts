import { RequestHandler } from "express";
import { User, addUser, fetchUsers } from "../models/users";
import { baseError, objectValidator } from "./utils";
import { InvalidPostObject } from "./errorStatus";

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
  objectValidator(userToAddMandatory, next);
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
