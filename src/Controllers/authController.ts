import { Request, Response } from 'express';
import { authenticateUser, getAllUsers, getUserById } from '../Services/authService';

export const verifyUser = async (req: Request, res: Response): Promise<void> => {
  const { walletAddress, signature , message} = req.body;

  if (!walletAddress || !signature || !message) {
    res.status(400).json({ message: 'Wallet address, message and signature are required' });
    return;
  }

  try {
    const user = await authenticateUser(walletAddress, signature, message);
    res.status(200).json({ message: 'Authentication successful', user });
  } catch (error) {
    console.error('Error during authentication:', error as Error);
    res.status(401).json({ message: 'Authentication failed', error: (error as Error).message });
  }
};
export const fetchUserById = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;

  if (!userId) {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }

  try {
    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      message: 'Error fetching user',
      error: (error as Error).message,
    });
  }
};

export const fetchAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      message: 'Error fetching users',
      error: (error as Error).message,
    });
  }
};