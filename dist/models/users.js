"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = exports.fetchUser = exports.fetchUsers = void 0;
const db_1 = __importDefault(require("../db"));
const fetchUsers = async () => {
    const { rows } = await db_1.default.query(`
      SELECT * FROM users;
    `);
    return rows;
};
exports.fetchUsers = fetchUsers;
const fetchUser = async (username) => {
    const { rows: [user], } = await db_1.default.query(`
      SELECT * FROM users WHERE username = $1
    `, [username]);
    return user;
};
exports.fetchUser = fetchUser;
const addUser = async ({ username, name, avatar_url }) => {
    const { rows: [user], } = await db_1.default.query(`
      INSERT INTO users (username, name, avatar_url)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [username, name, avatar_url]);
    return user;
};
exports.addUser = addUser;
