import express from "express";
import { postUser, getUsers, getUser } from "../controllers/users";
import { sqlError } from "./errors";

const usersRouter = express.Router();

usersRouter.get("/", getUsers);
usersRouter.post("/", postUser);
usersRouter.get("/:username", getUser);

usersRouter.use(sqlError("our database does not have a users table"));

export default usersRouter;
