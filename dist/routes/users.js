"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const errors_1 = require("./errors");
const usersRouter = express_1.default.Router();
usersRouter.get("/", users_1.getUsers);
usersRouter.post("/", users_1.postUser);
usersRouter.get("/:username", users_1.getUser);
usersRouter.use((0, errors_1.sqlError)("our database does not have a users table"));
exports.default = usersRouter;
