"use strict";
// import { Request, Response } from 'express';
// import Will from '../Models/willModel';
// import { ethers } from 'ethers';
// import { willContractAddress, willAbi } from '../Config/contractConfig';
// import dotenv from 'dotenv';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmWillActivity = void 0;
const ethers_1 = require("ethers");
const contractConfig_1 = require("../Config/contractConfig");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const provider = new ethers_1.ethers.JsonRpcProvider('https://rpc.sepolia-api.lisk.com/');
const privateKey = process.env.PRIVATE_KEY;
const getContract = async () => {
    if (!privateKey) {
        throw new Error('Private key is not defined');
    }
    const wallet = new ethers_1.ethers.Wallet(privateKey, provider);
    return new ethers_1.ethers.Contract(contractConfig_1.willContractAddress, contractConfig_1.willAbi, wallet);
};
const confirmWillActivity = async (req, res) => {
    const { willId } = req.params; // Extract Will ID from URL params
    const { walletAddress } = req.body; // Extract Wallet Address from request body
    try {
        // Convert wallet address to checksummed format (for consistency)
        const validWalletAddress = ethers_1.ethers.getAddress(walletAddress);
        console.log('Valid Wallet Address:', validWalletAddress); // Log to confirm
        // Initialize contract
        const contract = await getContract();
        // Fetch the will details from the blockchain using the willId and walletAddress
        const onChainWill = await contract.getWillDetailsByIdAndOwner(willId, validWalletAddress);
        console.log('onChainWill:', onChainWill); // Log the will details from the blockchain
        if (!onChainWill || onChainWill === null) {
            return res.status(404).json({ message: 'Will not found on the blockchain for this wallet' });
        }
        // Define grace period and activity threshold (in seconds)
        const gracePeriod = 30 * 24 * 60 * 60; // 30 days in seconds
        const activityThreshold = 90 * 24 * 60 * 60; // 90 days in seconds
        // Update timeframes on the blockchain
        const tx = await contract.updateTimeframes(willId, gracePeriod, activityThreshold);
        await tx.wait(); // Wait for transaction confirmation
        res.status(200).json({ message: 'Your activity has been confirmed and timeframes updated.' });
    }
    catch (error) {
        console.error('Error confirming activity:', error);
        res.status(500).json({ message: 'An error occurred while confirming your activity.' });
    }
};
exports.confirmWillActivity = confirmWillActivity;
//
//This function is for getting an email response immediately, Testing Purposes!
// import { Request, Response } from 'express';
// import Will from '../Models/willModel';
// import { sendEmail } from '../Emails/email';
// import userModel from '../Models/userModel';
// export const confirmWillActivity = async (req: Request, res: Response) => {
//   const { userId } = req.params;
//   try {
//     // Retrieve the user from the database
//     const user = await userModel.findOne({ _id: userId });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     // Retrieve the will associated with the user
//     let will = await Will.findOne({ userId: userId });
//     // If no Will is found, create a new Will for the user
//     if (!will) {
//       will = new Will({
//         userId: user._id,
//         email: user.Email, // Assuming `Email` is the field name in the user model
//         status: 'active',
//         creationDate: new Date(),
//         lastConfirmed: new Date(), // Set to current date when created
//       });
//       await will.save();
//       console.log('New will created for user');
//     }
//     // Send an email to the user's email address
//     try {
//       await sendEmail({
//         email: user.Email,
//         subject: '6-Month Reminder',
//         html: `
//           <p>Please confirm that you are still active on our platform by clicking the link below:</p>
//           <a href="https://yourapp.com/will/confirm/${userId}">Confirm Activity</a>
//         `,
//       });
//       console.log(`Email sent to ${user.Email}`);
//       return res.status(200).json({ message: 'Email sent successfully for testing' });
//     } catch (error) {
//       console.error('Error sending email:', error);
//       return res.status(500).json({ message: 'Error sending email' });
//     }
//   } catch (error) {
//     console.error('Error processing email confirmation:', error);
//     return res.status(500).json({ message: 'An error occurred while processing the request' });
//   }
// };
