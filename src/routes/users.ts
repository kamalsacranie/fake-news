import express from "express";
import { getUsers } from "../controllers/users";
import { sqlError } from "./errors";

const usersRouter = express.Router();

usersRouter.get("/", getUsers);

usersRouter.use(sqlError("our database does not have a users table"));

export default usersRouter;
