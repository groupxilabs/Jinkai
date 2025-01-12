import { sendEmail } from '../Emails/email';
import { ethers, Contract } from 'ethers';
import { willContractAddress, willAbi, importedWillAddress, importedAbi } from '../Config/contractConfig';
import dotenv from 'dotenv';

dotenv.config();

const privateKey = process.env.PRIVATE_KEY || "0a53648d235bf67bbec99b1e204b07864af9df0a18ee52f4205b4ff1c1a308b8";
if (!privateKey) {
  throw new Error('Private key is not set in environment variables');
}

const provider = new ethers.JsonRpcProvider('https://rpc.sepolia-api.lisk.com/');
const signer = new ethers.Wallet(privateKey, provider); // Create a wallet from the private key

const willContract = new ethers.Contract(willContractAddress, willAbi, signer); // Use signer instead of provider
const importedContract = new ethers.Contract(importedWillAddress, importedAbi, signer); // Use signer instead of provider

/**
 * Sends a reminder email to the user.
 * @param userId - User's unique ID.
 * @param email - User's email address.
 * @param subject - Email subject.
 * @param willId - ID of the will.
 */
const sendReminderEmail = async (userId: string, email: string, subject: string, willId: number) => {
  try {
    const reminderHtml = `
      <p>Please confirm that you are still active on our platform by clicking the link below:</p>
      <a href="https://yourapp.com/will/confirm/${willId}/${userId}">Confirm Activity</a>
    `;
    await sendEmail({
      email,
      subject,
      html: reminderHtml,
    });
    console.log(`[Reminder] Email sent to ${email}`);
  } catch (error) {
    console.error(`[Reminder] Error sending email to ${email}:`, (error as Error).message);
  }
};

/**
 * Sends a claim email to a beneficiary.
 * @param email - Beneficiary's email address.
 * @param willId - ID of the will.
 * @param userId - ID of the will owner.
 */
const sendClaimEmail = async (email: string, willId: string, userId: string) => {
  try {
    const claimHtml = `
      <p>You have been listed as a beneficiary of a will. Please click the link below to claim your share:</p>
      <a href="https://yourapp.com/will/claim/${willId}/${userId}">Claim Your Will</a>
    `;
    await sendEmail({
      email,
      subject: 'Claim Your Will',
      html: claimHtml,
    });
    console.log(`[Claim] Email sent to ${email}`);
  } catch (error) {
    console.error(`[Claim] Error sending email to ${email}:`, (error as Error).message);
  }
};

/**
 * Handles the notification process for a specific will.
 * @param willId - ID of the will.
 * @param walletAddress - Wallet address of the will owner.
 */
export const sendWillNotifications = async (willId: string, walletAddress: string) => {
  console.log(`Starting notification process for Will ID: ${willId}, Wallet Address: ${walletAddress}`);

  if (!willId || !walletAddress) {
    console.error('Invalid Will ID or Wallet Address provided.');
    return;
  }

  try {
    // Fetch will details from the contract
    const willDetails = await willContract.getWillDetailsByIdAndOwner(willId, walletAddress);

    const {
      id,
      willOwner,
      lastActivity,
      isActive,
      activityThreshold,
      deadManSwitchTriggered,
      beneficiaries,
    } = willDetails;

    console.log('Will Details:', {
      id,
      willOwner,
      lastActivity,
      isActive,
      activityThreshold,
      deadManSwitchTriggered,
      beneficiaries,
    });

    // Validate the will's activity state
    if (!isActive) {
      console.log(`[Will ID: ${willId}] is inactive. Skipping processing.`);
      return;
    }

    // Calculate the time since the last activity
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const timeSinceLastActivity = currentTime - Number(lastActivity); // Convert BigInt to number

    console.log(`[Will ID: ${willId}] Time since last activity: ${timeSinceLastActivity} seconds`);

    // Simulate the scenario where the dead man's switch has been triggered and // Ensure boolean value
    const isDeadManSwitchTriggered = deadManSwitchTriggered || false; 

    // If the dead man's switch is triggered, send claim emails to the beneficiaries
    if (isDeadManSwitchTriggered) {
      console.log(`[Will ID: ${willId}] Dead man's switch has been triggered. Sending claim emails to beneficiaries.`);

      // Send claim emails to all beneficiaries
      const notificationPromises = beneficiaries.map(async (beneficiary: string) => {
        console.log(`[Will ID: ${willId}] Notifying beneficiary: ${beneficiary}`);
        await sendClaimEmail(beneficiary, String(willId), walletAddress);
      });

      await Promise.all(notificationPromises);
      console.log(`[Will ID: ${willId}] Notifications sent to all beneficiaries.`);
    } else {
      // Check if dead man's switch conditions are met (if not triggered manually) and check how ther rest if them are going 
      if (timeSinceLastActivity >= Number(activityThreshold)) {
        console.log(`[Will ID: ${willId}] Dead man's switch conditions met.`);

        // Trigger the dead man's switch
        const tx = await willContract.checkAndTriggerDeadManSwitch(willId, walletAddress);
        console.log(`[Will ID: ${willId}] Dead man's switch triggered. Transaction Hash: ${tx.hash}`);
        await tx.wait();

        // Notify beneficiaries
        const notificationPromises = beneficiaries.map(async (beneficiary: string) => {
          console.log(`[Will ID: ${willId}] Notifying beneficiary: ${beneficiary}`);
          await sendClaimEmail(beneficiary, String(willId), walletAddress);
        });

        await Promise.all(notificationPromises);
        console.log(`[Will ID: ${willId}] Notifications sent to all beneficiaries.`);
      } else {
        console.log(`[Will ID: ${willId}] No action required.`);
      }
    }
  } catch (error: unknown) {
    console.error(`[Will ID: ${willId}] Error processing notifications:`, (error as Error).message);
  }
};
