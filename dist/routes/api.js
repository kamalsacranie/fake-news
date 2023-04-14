"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promises_1 = __importDefault(require("fs/promises"));
const topics_1 = __importDefault(require("./topics"));
const articles_1 = __importDefault(require("./articles"));
const users_1 = __importDefault(require("./users"));
const comments_1 = __importDefault(require("./comments"));
const apiRouter = express_1.default.Router();
apiRouter.get("/", async function (req, res, next) {
    try {
        const endpoints = JSON.parse(await promises_1.default.readFile(`${__dirname}/../../endpoints.json`, "utf8"));
        res.status(200).send(endpoints);
    }
    catch (err) {
        // must change to check for type
        if (err.code === "ENOENT") {
            return res
                .status(200)
                .send({ message: "welcome to my fake news server" });
        }
        next(err);
    }
});
apiRouter.use("/topics", topics_1.default);
apiRouter.use("/articles", articles_1.default);
apiRouter.use("/users", users_1.default);
apiRouter.use("/comments", comments_1.default);
exports.default = apiRouter;
