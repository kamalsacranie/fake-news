"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopics = void 0;
const topics_1 = require("../models/topics");
const utils_1 = require("./utils");
const utils_2 = require("../models/utils");
const getTopics = async function (req, res, next) {
    (0, utils_1.baseError)(next, async () => {
        const topics = await (0, topics_1.fetchTopics)();
        (0, utils_2.responseRowsOr404)(topics, "currently no topics in the database");
        res.status(200).send({ topics });
    });
};
exports.getTopics = getTopics;
