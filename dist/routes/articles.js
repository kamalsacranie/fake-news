"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const articles_1 = require("../controllers/articles");
const errors_1 = require("./errors");
const articlesRouter = express_1.default.Router();
articlesRouter.get("/", articles_1.getArticles);
articlesRouter.post("/", articles_1.postArticle);
articlesRouter.get("/:articleId", articles_1.getArticle);
articlesRouter.patch("/:articleId", articles_1.patchArticle);
articlesRouter.delete("/:articleId", articles_1.deleteArticle);
articlesRouter.get("/:articleId/comments", articles_1.getArticleComments);
articlesRouter.post("/:articleId/comments", articles_1.postArticleComment);
articlesRouter.use(function (err, req, res, next) {
    if (err.code === "23503") {
        res.status(404).send({ message: "article not found" });
    }
    else {
        next(err);
    }
});
articlesRouter.use((0, errors_1.sqlError)("our database does not have a articles table"));
exports.default = articlesRouter;
