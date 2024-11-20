"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = exports.verifySignature = exports.getSigningMessage = void 0;
const ethers_1 = require("ethers");
const authModel_1 = __importDefault(require("../Models/authModel"));
/**
 * Generates a signing message for wallet authentication.
 * @param walletAddress - The user's wallet address.
 * @returns The message to be signed.
 */
const getSigningMessage = (walletAddress) => {
    return `Please sign this message to authenticate with your wallet. Wallet Address: ${walletAddress}`;
};
exports.getSigningMessage = getSigningMessage;
/**
 * Verifies the signature and ensures it matches the wallet address.
 * @param walletAddress - The user's wallet address.
 * @param signature - The signature provided by the user.
 * @returns Whether the signature is valid.
 */
const verifySignature = (walletAddress, signature) => {
    const message = (0, exports.getSigningMessage)(walletAddress);
    const recoveredAddress = ethers_1.ethers.verifyMessage(message, signature);
    // Check if the recovered address matches the provided wallet address
    return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
};
exports.verifySignature = verifySignature;
/**
 * Authenticates the user by verifying their wallet address and signature.
 * Saves them to the database if valid.
 * @param walletAddress - The user's wallet address.
 * @param signature - The signature provided by the user.
 * @returns The authenticated user object.
 * @throws Error if the signature is invalid.
 */
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
