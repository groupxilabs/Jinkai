"use strict";
// import { Request, Response } from 'express';
// import { confirmWillActivity} from '../Services/willService';
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmActivity = void 0;
const willService_1 = require("../Services/willService");
const confirmActivity = async (req, res) => {
    const { email } = req.body;
    try {
        await (0, willService_1.confirmWillActivity)(req, res);
    }
    catch (error) {
        console.error(`Error sending email to ${email}:`, error);
        res.status(500).json({ message: 'Failed to send email' });
    }
};
exports.confirmActivity = confirmActivity;
