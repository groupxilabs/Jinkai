"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = exports.verifySignature = exports.getSigningMessage = void 0;
const ethers_1 = require("ethers");
const authModel_1 = __importDefault(require("../Models/authModel"));
const getSigningMessage = (walletAddress) => {
    return `Please sign this message to authenticate with your wallet. Wallet Address: ${walletAddress}`;
};
exports.getSigningMessage = getSigningMessage;
const verifySignature = (walletAddress, signature) => {
    const message = (0, exports.getSigningMessage)(walletAddress);
    const recoveredAddress = ethers_1.ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
};
exports.verifySignature = verifySignature;
const authenticateUser = async (walletAddress, signature) => {
    const isValid = (0, exports.verifySignature)(walletAddress, signature);
    if (!isValid) {
        throw new Error('Invalid signature');
    }
    let user = await authModel_1.default.findOne({ walletAddress });
    if (!user) {
        user = new authModel_1.default({ walletAddress });
        await user.save();
    }
    return user;
};
exports.authenticateUser = authenticateUser;
