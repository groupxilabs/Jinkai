"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRouter = void 0;
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../Controllers/notificationController");
exports.notificationRouter = express_1.default.Router();
exports.notificationRouter.get('/send-notifications', notificationController_1.WillNotifications);
