import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import User, { IUser } from '../Models/authModel';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'CRYPTO_WILL';

export const verifySignature = (walletAddress: string, signature: string, message: string): boolean => {
  try {
    if (!/^0x([A-Fa-f0-9]{130})$/.test(signature)) {
      console.error('Invalid signature format:', signature);
      throw new Error('Invalid signature format');
    }

    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
};

export const authenticateUser = async (
  walletAddress: string,
  signature: string,
  message: string
): Promise<{ user: IUser; token: string }> => {
  try {
    console.log('Authenticating user...');
    console.log('Received wallet address:', walletAddress);
    console.log('Received signature:', signature);
    console.log('Received message:', message);

    const isValid = verifySignature(walletAddress, signature, message);

    if (!isValid) {
      throw new Error('Invalid signature');
    }

    let user = await User.findOne({ walletAddress });
    if (!user) {
      console.log('User not found, creating new user...');
      user = new User({ walletAddress });
      await user.save();
    }


    const token = jwt.sign(
      { walletAddress: user.walletAddress, userId: user._id },
      SECRET_KEY,
      { expiresIn: '1h' } 
    );

    console.log('User authenticated successfully:', user);
    return { user, token };
  } catch (error) {
    console.error('Error during authentication:', error);
    throw new Error('Authentication failed');
  }
};
