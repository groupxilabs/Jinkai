// import { Request, Response } from 'express';
// import Will from '../Models/willModel';
// import { ethers } from 'ethers';
// import { willContractAddress, willAbi } from '../Config/contractConfig';
// import dotenv from 'dotenv';

// dotenv.config();

// const provider = new ethers.JsonRpcProvider('https://rpc.sepolia-api.lisk.com/');
// const privateKey = process.env.PRIVATE_KEY;

// const getContract = async () => {
//   if (!privateKey) {
//     throw new Error('Private key is not defined');
//   }
//   const wallet = new ethers.Wallet(privateKey, provider);
//   return new ethers.Contract(willContractAddress, willAbi, wallet);
// };

// export const confirmWillActivity = async (req: Request, res: Response) => {
//   const { willId } = req.params; 
//   const { walletAddress } = req.body; 
//   const now = Math.floor(Date.now() / 1000); // Current time in seconds

//   try {
//     // Find will by wallet address in DB
//     const will = await Will.findOne({ walletAddress });

//     if (!will) {
//       return res.status(404).json({ message: 'Will not found for this user' });
//     }

//     // Ensure that the willId matches the one stored in DB
//     if (will.willId.toString() !== willId.toString()) {
//       return res.status(404).json({ message: 'Will ID does not match' });
//     }

//     // Get contract instance
//     const contract = await getContract();

//     // Fetch on-chain will details by willId and wallet address
//     const onChainWill = await contract.getWillDetailsByIdAndOwner(willId, walletAddress);
//     console.log('onChainWill:', onChainWill);  // Debugging output

//     if (!onChainWill) {
//       return res.status(404).json({ message: 'Will not found on the blockchain for this wallet' });
//     }

//     // Define grace period and activity threshold (in seconds)
//     const gracePeriod = 30 * 24 * 60 * 60; // 30 days in seconds
//     const activityThreshold = 90 * 24 * 60 * 60; // 90 days in seconds

//     // Update timeframes on the blockchain
//     const tx = await contract.updateTimeframes(willId, gracePeriod, activityThreshold);
//     await tx.wait(); // Wait for transaction confirmation

//     // Update the last confirmed timestamp in the database
//     will.lastConfirmed = new Date();
//     await will.save();

//     res.status(200).json({ message: 'Your activity has been confirmed and timeframes updated.' });
//   } catch (error) {
//     console.error('Error confirming activity:', error);
//     res.status(500).json({ message: 'An error occurred while confirming your activity.' });
//   }
// };


import { Request, Response } from 'express';
import { ethers } from 'ethers';
import { willContractAddress, willAbi } from '../Config/contractConfig';
import dotenv from 'dotenv';

dotenv.config();

const provider = new ethers.JsonRpcProvider('https://rpc.sepolia-api.lisk.com/');
const privateKey = process.env.PRIVATE_KEY;

const getContract = async () => {
  if (!privateKey) {
    throw new Error('Private key is not defined');
  }
  const wallet = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(willContractAddress, willAbi, wallet);
};

export const confirmWillActivity = async (req: Request, res: Response) => {
  const { willId } = req.params;  
  const { walletAddress } = req.body;  

  try {

    const validWalletAddress = ethers.getAddress(walletAddress);
    console.log('Valid Wallet Address:', validWalletAddress);  

    const contract = await getContract();

    const onChainWill = await contract.getWillDetailsByIdAndOwner(willId, validWalletAddress);
    console.log('onChainWill:', onChainWill);  

    if (!onChainWill || onChainWill === null) {
      return res.status(404).json({ message: 'Will not found on the blockchain for this wallet' });
    }

    const gracePeriod = 30 * 24 * 60 * 60; 
    const activityThreshold = 90 * 24 * 60 * 60; 

    const tx = await contract.updateTimeframes(willId, gracePeriod, activityThreshold);
    await tx.wait(); 

    res.status(200).json({ message: 'Your activity has been confirmed and timeframes updated.' });
  } catch (error) {
    console.error('Error confirming activity:', error);
    res.status(500).json({ message: 'An error occurred while confirming your activity.' });
  }
};



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
