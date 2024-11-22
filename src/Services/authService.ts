import { ethers } from 'ethers';
import User, { IUser } from '../Models/authModel';

export const getSigningMessage = (walletAddress: string): string => {
  return `Please sign this message to authenticate with your wallet. Wallet Address: ${walletAddress}`;
};

export const verifySignature = (walletAddress: string, signature: string): boolean => {
  try {
 
    if (!/^0x([A-Fa-f0-9]{130})$/.test(signature)) {
      console.error('Invalid signature format:', signature);
      throw new Error('Invalid signature format');
    }

    const message = getSigningMessage(walletAddress); 
    const recoveredAddress = ethers.verifyMessage(message, signature); 

    return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
};

export const authenticateUser = async (walletAddress: string, signature: string): Promise<IUser> => {
  try {
    console.log('Authenticating user...');
    console.log('Received wallet address:', walletAddress);
    console.log('Received signature:', signature);

    const isValid = verifySignature(walletAddress, signature);

    if (!isValid) {
      throw new Error('Invalid signature');
    }

    let user = await User.findOne({ walletAddress });
    if (!user) {
      console.log('User not found, creating new user...');
      user = new User({ walletAddress });
      await user.save();
    }

    console.log('User authenticated successfully:', user);
    return user;
  } catch (error) {
    console.error('Error during authentication:', error);
    throw new Error('Authentication failed');
  }
};
