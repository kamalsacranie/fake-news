import { RequestHandler } from "express";
import { fetchUsers } from "../models/users";
import { baseError } from "./utils";

export const getUsers: RequestHandler = async (req, res, next) => {
  baseError(next, async () => {
    const users = await fetchUsers();
    res.status(200).send({ users });
  });
};
