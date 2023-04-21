"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("./routes/api"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", api_1.default);
app.use(function (req, res, next) {
    next({ status: 404, message: "page not found" });
});
app.use(function (err, req, res, next) {
    res.status(err.status || 500).send({ message: err.message });
});
exports.default = app;
