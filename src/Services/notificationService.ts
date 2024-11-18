import { sendEmail } from '../Emails/email';
import Will from '../Models/willModel';

const sendReminderEmail = async (userId: string, email: string, subject: string) => {
    const reminderHtml = `
      <p>Please confirm that you are still active on our platform by clicking the link below:</p>
      <a href="https://yourapp.com/will/confirm/${userId}">Confirm Activity</a>
    `;
  
    await sendEmail({
        email: email,
        subject: '6-Month Reminder',
        html: `
          <p>Please confirm that you are still active on our platform by clicking the link below:</p>
          <a href="https://yourapp.com/will/confirm/${userId}">Confirm Activity</a>
        `,
      })}
  
export const sendWillNotifications = async () => {

    const wills = await Will.find({ status: 'active' });
  
    for (const will of wills) {
      const { userId, creationDate, lastConfirmed, email } = will;
      const now = new Date();
      const lastConfirmedDate = lastConfirmed || creationDate;

      const diffInMonths = (now.getTime() - lastConfirmedDate.getTime()) / (1000 * 60 * 60 * 24 * 30); 
  
      if (diffInMonths >= 6 && diffInMonths < 11) {
        // Send 6-month reminder 
        await sendReminderEmail(userId, email, '6-Month Reminder');

      } else if (diffInMonths >= 11 && diffInMonths < 12) {
        // Send 5-month reminder
       await sendReminderEmail(userId, email, '6-Month Reminder');

      } else if (diffInMonths >= 12) {
        // Send weekly reminders in the last month
        if (diffInMonths < 13) {
        await sendReminderEmail(userId, email, '6-Month Reminder');
        }
      }
  
      // If no response after a year, mark the will as distributed
      if (diffInMonths >= 12 && !lastConfirmed) {
        will.status = 'distributed';
        await will.save();
        // smart contract will distribute will to beneficiaries after one year
      }
    }
  };
  