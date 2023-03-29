const express = require("express");
const { deleteComment } = require("../controllers/comments");

const commentsRouter = express.Router();

commentsRouter.delete("/:commentId", deleteComment);

module.exports = commentsRouter;
