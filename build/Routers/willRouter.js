"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.willRouter = void 0;
const express_1 = __importDefault(require("express"));
const willController_1 = require("../Controllers/willController");
exports.willRouter = express_1.default.Router();
exports.willRouter.post('/will/confirm/:userId', willController_1.confirmActivity);
