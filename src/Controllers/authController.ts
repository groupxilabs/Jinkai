import { Request, Response } from 'express';
import { authenticateUser } from '../Services/authService';

/**
 * Verifies the user's signature and authenticates them.
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const verifyUser = async (req: Request, res: Response): Promise<void> => {
  const { walletAddress, signature } = req.body;

  if (!walletAddress || !signature) {
    res.status(400).json({ message: 'Wallet address and signature are required' });
    return;
  }

  try {
    const user = await authenticateUser(walletAddress, signature);
    res.status(200).json({ message: 'Authentication successful', user });
  } catch (error) {
    console.error('Error during authentication:', error as Error);
    res.status(401).json({ message: 'Authentication failed', error: (error as Error).message });
  }
};
