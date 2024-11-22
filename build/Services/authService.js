"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = exports.verifySignature = exports.getSigningMessage = void 0;
const ethers_1 = require("ethers");
const authModel_1 = __importDefault(require("../Models/authModel"));
/**
 * Constructs the message to be signed by the wallet.
 * @param walletAddress - Wallet address of the user.
 */
const getSigningMessage = (walletAddress) => {
    return `Please sign this message to authenticate with your wallet. Wallet Address: ${walletAddress}`;
};
exports.getSigningMessage = getSigningMessage;
/**
 * Verifies the signature provided by the user.
 * @param walletAddress - Wallet address of the user.
 * @param signature - Signature provided by the user.
 */
const verifySignature = (walletAddress, signature) => {
    try {
        // Validate the format of the signature
        if (!/^0x([A-Fa-f0-9]{130})$/.test(signature)) {
            console.error('Invalid signature format:', signature);
            throw new Error('Invalid signature format');
        }
        const message = (0, exports.getSigningMessage)(walletAddress); // Recreate the signed message
        const recoveredAddress = ethers_1.ethers.verifyMessage(message, signature); // Recover address from the signature
        return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
    }
    catch (error) {
        console.error('Error verifying signature:', error);
        return false;
    }
};
exports.verifySignature = verifySignature;
/**
 * Authenticates the user using wallet address and signature.
 * If the user doesn't exist, creates a new user in the database.
 * @param walletAddress - Wallet address of the user.
 * @param signature - Signature provided by the user.
 */
const authenticateUser = async (walletAddress, signature) => {
    try {
        console.log('Authenticating user...');
        console.log('Received wallet address:', walletAddress);
        console.log('Received signature:', signature);
        // Verify the provided signature
        const isValid = (0, exports.verifySignature)(walletAddress, signature);
        if (!isValid) {
            throw new Error('Invalid signature');
        }
        // Check if the user already exists in the database
        let user = await authModel_1.default.findOne({ walletAddress });
        // If user does not exist, create a new user
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
