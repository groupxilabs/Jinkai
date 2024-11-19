"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WillNotifications = void 0;
const notificationService_1 = require("../Services/notificationService"); // 
const WillNotifications = async (req, res) => {
    try {
        await (0, notificationService_1.sendWillNotifications)();
        res.status(200).json({ message: 'Notifications sent successfully' });
        console.log('Notifications sent successfully');
    }
    catch (error) {
        console.error('Error sending notifications:', error);
        res.status(500).json({ message: 'An error occurred while sending notifications.' });
    }
};
exports.WillNotifications = WillNotifications;
