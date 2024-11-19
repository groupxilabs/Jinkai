"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWillNotifications = void 0;
const email_1 = require("../Emails/email");
const willModel_1 = __importDefault(require("../Models/willModel"));
const ethers_1 = require("ethers");
const contractConfig_1 = require("../Config/contractConfig");
const provider = new ethers_1.ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/8S1e9DetSzeZZBotPKgFIXHhIazGnCAi');
const contract = new ethers_1.ethers.Contract(contractConfig_1.willContractAddress, contractConfig_1.willAbi, provider);
const sendReminderEmail = async (userId, email, subject) => {
    const reminderHtml = `
    <p>Please confirm that you are still active on our platform by clicking the link below:</p>
    <a href="https://yourapp.com/will/confirm/${userId}">Confirm Activity</a>
  `;
    await (0, email_1.sendEmail)({
        email: email,
        subject: subject,
        html: reminderHtml,
    });
};
const sendWillNotifications = async () => {
    const wills = await willModel_1.default.find({ status: 'active' });
    for (const will of wills) {
        const { userId, creationDate, lastConfirmed, email, willId } = will;
        const now = new Date();
        const lastConfirmedDate = lastConfirmed || creationDate;
        try {
            const activityThreshold = await contract.getActivityThreshold(willId);
            const gracePeriod = await contract.getGracePeriod(willId);
            const deadManSwitchTriggered = await contract.hasDeadManSwitchTriggered(willId);
            const gracePeriodEnded = await contract.hasGracePeriodEnded(willId);
            const diffInMonths = (now.getTime() - lastConfirmedDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
            if (diffInMonths >= 6 && diffInMonths < 11) {
                // Send 6-month reminder
                await sendReminderEmail(userId, email, '6-Month Reminder');
            }
            else if (diffInMonths >= 11 && diffInMonths < 12) {
                // Send 5-month reminder
                await sendReminderEmail(userId, email, '5-Month Reminder');
            }
            else if (diffInMonths >= 12) {
                // Send weekly reminders in the last month
                if (diffInMonths < 13) {
                    await sendReminderEmail(userId, email, 'Weekly Reminder');
                }
            }
            // If no response after a year, mark the will as distributed
            if (diffInMonths >= 12 && !lastConfirmed) {
                will.status = 'distributed';
                await will.save();
                // Smart contract will distribute will to beneficiaries after one year of inactivity
                const tx = await contract.distributeWill(willId);
                await tx.wait();
            }
        }
        catch (error) {
            console.error('Error fetching contract data or sending notification:', error);
        }
    }
};
exports.sendWillNotifications = sendWillNotifications;
