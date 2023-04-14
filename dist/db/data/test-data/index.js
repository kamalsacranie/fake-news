"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const articles_1 = __importDefault(require("./articles"));
const comments_1 = __importDefault(require("./comments"));
const topics_1 = __importDefault(require("./topics"));
const users_1 = __importDefault(require("./users"));
exports.default = { topicData: topics_1.default, userData: users_1.default, articleData: articles_1.default, commentData: comments_1.default };
