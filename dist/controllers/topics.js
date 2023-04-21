"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postTopic = exports.getTopics = void 0;
const topics_1 = require("../models/topics");
const utils_1 = require("./utils");
const utils_2 = require("../models/utils");
const errorStatus_1 = require("./errorStatus");
const slugify_1 = __importDefault(require("slugify"));
// can remove async here
const getTopics = async function (req, res, next) {
    (0, utils_1.baseError)(next, async () => {
        const topics = await (0, topics_1.fetchTopics)();
        (0, utils_2.responseRowsOr404)(topics, "currently no topics in the database");
        res.status(200).send({ topics });
    });
};
exports.getTopics = getTopics;
const postTopic = function (req, res, next) {
    const { body } = req;
    const topic = { slug: body.slug, description: body.description };
    (0, utils_1.baseError)(next, async () => {
        (0, utils_1.checkNoObjectValuesAreUndefined)(topic, next);
        topic.slug = (0, slugify_1.default)(topic.slug, { strict: true, lower: true });
        const newTopic = await (0, topics_1.addTopic)(topic);
        res.status(201).send({ topic: newTopic });
    }, (err) => err.code === "23505", new errorStatus_1.BaseError(409, `topic "${topic.slug}" already exists`));
};
exports.postTopic = postTopic;
