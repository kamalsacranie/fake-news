"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.postUser = exports.getUsers = void 0;
const users_1 = require("../models/users");
const utils_1 = require("./utils");
const errorStatus_1 = require("./errorStatus");
const users_2 = require("../models/users");
const getUsers = async (req, res, next) => {
    (0, utils_1.baseError)(next, async () => {
        const users = await (0, users_1.fetchUsers)();
        if (!users.length)
            next(new Error("users"));
        res.status(200).send({ users });
    });
};
exports.getUsers = getUsers;
const postUser = async (req, res, next) => {
    const { username, name, avatar_url } = req.body;
    const userToAddMandatory = {
        username,
        name,
    };
    (0, utils_1.checkNoObjectValuesAreUndefined)(userToAddMandatory, next);
    const userToAdd = Object.assign(Object.assign({}, userToAddMandatory), { avatar_url });
    (0, utils_1.baseError)(next, async () => {
        const newUser = await (0, users_1.addUser)(userToAdd);
        res.status(201).send({ user: newUser });
    }, (err) => err.code === "23505" && err.constraint === "users_pkey", new errorStatus_1.InvalidPostObject(400, "unknown user"));
};
exports.postUser = postUser;
const getUser = (req, res, next) => {
    const { username } = req.params;
    (0, utils_1.baseError)(next, async () => {
        const user = await (0, users_2.fetchUser)(username);
        if (!user)
            return next(new errorStatus_1.Error404("user"));
        res.status(200).send({ user });
    });
};
exports.getUser = getUser;
