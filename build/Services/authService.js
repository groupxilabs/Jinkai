"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = exports.verifySignature = void 0;
const ethers_1 = require("ethers");
const authModel_1 = __importDefault(require("../Models/authModel"));
const verifySignature = (message, walletAddress, signature) => {
    try {
        if (!/^0x([A-Fa-f0-9]{130})$/.test(signature)) {
            console.error('Invalid signature format:', signature);
            throw new Error('Invalid signature format');
        }
        const recoveredAddress = ethers_1.ethers.verifyMessage(message, signature);
        return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
    }
    catch (error) {
        console.error('Error verifying signature:', error);
        return false;
    }
};
exports.verifySignature = verifySignature;
const authenticateUser = async (walletAddress, signature, message) => {
    try {
        console.log('Authenticating user...');
        console.log('Received wallet address:', walletAddress);
        console.log('Received signature:', signature);
        console.log('Received message:', message);
        const isValid = (0, exports.verifySignature)(message, walletAddress, signature);
        if (!isValid) {
            throw new Error('Invalid signature');
        }
        let user = await authModel_1.default.findOne({ walletAddress });
        if (!user) {
            console.log('User not found, creating new user...');
            user = new authModel_1.default({ walletAddress });
            await user.save();
        }
        console.log('User authenticated successfully:', user);
        return user;
    }
    catch (error) {
        console.error('Error during authentication:', error);
        throw new Error('Authentication failed');
    }
};
exports.authenticateUser = authenticateUser;
