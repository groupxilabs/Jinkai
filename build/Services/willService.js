"use strict";
// import { Request, Response } from 'express';
// import Will from '../Models/willModel';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmWillActivity = void 0;
const willModel_1 = __importDefault(require("../Models/willModel"));
const ethers_1 = require("ethers");
const contractConfig_1 = require("../Config/contractConfig");
const provider = new ethers_1.ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/8S1e9DetSzeZZBotPKgFIXHhIazGnCAi');
const getContract = async () => {
    const signer = await provider.getSigner();
    return new ethers_1.ethers.Contract(contractConfig_1.willContractAddress, contractConfig_1.willAbi, signer);
};
const confirmWillActivity = async (req, res) => {
    const { userId } = req.params;
    const now = new Date();
    try {
        const will = await willModel_1.default.findOne({ userId });
        if (!will) {
            return res.status(404).json({ message: 'Will not found for this user' });
        }
        will.lastConfirmed = now;
        await will.save();
        const contract = await getContract();
        const willId = will.willId;
        const tx = await contract.updateLastConfirmed(willId, now.getTime());
        await tx.wait();
        res.status(200).json({ message: 'Your activity has been confirmed.' });
    }
    catch (error) {
        console.error('Error confirming activity:', error);
        res.status(500).json({ message: 'An error occurred while confirming your activity.' });
    }
};
exports.confirmWillActivity = confirmWillActivity;
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
