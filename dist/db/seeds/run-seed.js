"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const development_data_1 = __importDefault(require("../data/development-data"));
const test_data_1 = __importDefault(require("../data/test-data"));
const seed_1 = __importDefault(require("./seed"));
const __1 = __importDefault(require("../"));
function runSeed() {
    return (0, seed_1.default)(process.env.NODE_ENV === "test" ? test_data_1.default : development_data_1.default);
}
if (require.main === module) {
    runSeed().then(() => __1.default.end());
}
exports.default = runSeed;
