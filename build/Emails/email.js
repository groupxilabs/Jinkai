"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
require("dotenv").config();
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (options) => {
    const transporter = nodemailer_1.default.createTransport({
        service: process.env.service,
        auth: {
            user: process.env.user,
            pass: process.env.mailPassword,
        },
    });
    const mailOptions = {
        from: process.env.user,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${options.email}`);
        return {
            messageId: info.messageId,
            accepted: info.accepted,
            rejected: info.rejected,
        };
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
