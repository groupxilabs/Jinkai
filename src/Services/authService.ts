import { ethers } from 'ethers';
import User, { IUser } from '../Models/authModel';

export const getSigningMessage = (walletAddress: string): string => {
  return `Please sign this message to authenticate with your wallet. Wallet Address: ${walletAddress}`;
};
export const verifySignature = (walletAddress: string, signature: string): boolean => {
  const message = getSigningMessage(walletAddress); 
  const recoveredAddress = ethers.verifyMessage(message, signature);

  return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
};

export const authenticateUser = async (walletAddress: string, signature: string): Promise<IUser> => {
  const isValid = verifySignature(walletAddress, signature);

  if (!isValid) {
    throw new Error('Invalid signature');
  }
  let user = await User.findOne({ walletAddress });
  if (!user) {
    user = new User({ walletAddress });
    await user.save();
  }

  return user; 
};
