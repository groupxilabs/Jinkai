import { Request, Response } from 'express';
import { sendWillNotifications } from '../Services/notificationService'; 

export const WillNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { willId } = req.params; 
    const { walletAddress } = req.body; 

    if (!willId || !walletAddress) {
      return 
    }

    console.log(`Received request to process notifications for Will ID: ${willId}`);
    console.log(`Wallet Address provided: ${walletAddress}`);

    await sendWillNotifications(willId, walletAddress);

    res.status(200).json({ message: 'Notifications processed successfully' });
    console.log('Notifications processed successfully');
  } catch (error) {
    console.error('Error processing notifications:', error);
    res.status(500).json({ message: 'An error occurred while processing notifications.' });
  }
};
