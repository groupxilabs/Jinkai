import { sendEmail } from '../Emails/email';
import Will from '../Models/willModel';
import { ethers } from 'ethers';
import { willContractAddress, willAbi } from '../Config/contractConfig'; 

const provider = new ethers.JsonRpcProvider('https://rpc.sepolia-api.lisk.com/');
const contract = new ethers.Contract(willContractAddress, willAbi, provider);

const sendReminderEmail = async (userId: string, email: string, subject: string) => {
  const reminderHtml = `
    <p>Please confirm that you are still active on our platform by clicking the link below:</p>
    <a href="https://yourapp.com/will/confirm/${userId}">Confirm Activity</a>
  `;
  await sendEmail({
    email: email,
    subject: subject,
    html: reminderHtml,
  });
};

export const sendWillNotifications = async () => {
  const wills = await Will.find({ status: 'active' });

  for (const will of wills) {
    const { userId, creationDate, lastConfirmed, email, willId } = will;
    const now = new Date();
    const lastConfirmedDate = lastConfirmed || creationDate;

    try {
      const activityThreshold = await contract.getActivityThreshold(willId);  
      const gracePeriod = await contract.getGracePeriod(willId);  
      const deadManSwitchTriggered = await contract.hasDeadManSwitchTriggered(willId); 
      const gracePeriodEnded = await contract.hasGracePeriodEnded(willId); 

      const diffInMonths = (now.getTime() - lastConfirmedDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

      if (diffInMonths >= 6 && diffInMonths < 11) {
        // Send 6-month reminder
        await sendReminderEmail(userId, email, '6-Month Reminder');
      } else if (diffInMonths >= 11 && diffInMonths < 12) {
        // Send 5-month reminder
        await sendReminderEmail(userId, email, '5-Month Reminder');
      } else if (diffInMonths >= 12) {
        // Send weekly reminders in the last month
        if (diffInMonths < 13) {
          await sendReminderEmail(userId, email, 'Weekly Reminder');
        }
      }

      // If no response after a year, mark the will as distributed
      if (diffInMonths >= 12 && !lastConfirmed) {
        will.status = 'distributed';
        await will.save();

        // Smart contract will distribute will to beneficiaries after one year of inactivity
        const tx = await contract.distributeWill(willId);  
        await tx.wait();
      }
    } catch (error) {
      console.error('Error fetching contract data or sending notification:', error);
    }
  }
};
