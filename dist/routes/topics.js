"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const topics_1 = require("../controllers/topics");
const errors_1 = require("./errors");
const topicsRouter = express_1.default.Router();
topicsRouter.get("/", topics_1.getTopics);
topicsRouter.post("/", topics_1.postTopic);
topicsRouter.use((0, errors_1.sqlError)("our database does not have a topics table"));
exports.default = topicsRouter;
