const express = require("express");
const { getUsers } = require("../controllers/users");
const { sqlError } = require("./errors");

const usersRouter = express.Router();

usersRouter.get("/", getUsers);

usersRouter.use(sqlError("our database does not have a users table"));

module.exports = usersRouter;
