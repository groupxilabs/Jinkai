"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const authService_1 = require("../Services/authService");
const verifyUser = async (req, res) => {
    const { walletAddress, signature, message } = req.body;
    if (!walletAddress || !signature || !message) {
        res.status(400).json({ message: 'Wallet address and signature are required' });
        return;
    }
    try {
        const user = await (0, authService_1.authenticateUser)(walletAddress, signature, message);
        res.status(200).json({ message: 'Authentication successful', user });
    }
    catch (error) {
        console.error('Error during authentication:', error);
        res.status(401).json({ message: 'Authentication failed', error: error.message });
    }
};
exports.verifyUser = verifyUser;
