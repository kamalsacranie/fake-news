import express from "express";
import { postUser, getUsers } from "../controllers/users";
import { sqlError } from "./errors";

const usersRouter = express.Router();

usersRouter.get("/", getUsers);
usersRouter.post("/", postUser);

usersRouter.use(sqlError("our database does not have a users table"));

export default usersRouter;
