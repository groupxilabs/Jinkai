import { Request, Response } from 'express';
import { sendWillNotifications } from '../Services/notificationService'; // 

export const WillNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    await sendWillNotifications();
    
    res.status(200).json({ message: 'Notifications sent successfully' });
    console.log('Notifications sent successfully')
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ message: 'An error occurred while sending notifications.' });
  }
};
