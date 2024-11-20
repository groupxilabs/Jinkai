import { ethers } from 'ethers';
import User, { IUser } from '../Models/authModel';

/**
 * Generates a signing message for wallet authentication.
 * @param walletAddress - The user's wallet address.
 * @returns The message to be signed.
 */
export const getSigningMessage = (walletAddress: string): string => {
  return `Please sign this message to authenticate with your wallet. Wallet Address: ${walletAddress}`;
};

/**
 * Verifies the signature and ensures it matches the wallet address.
 * @param walletAddress - The user's wallet address.
 * @param signature - The signature provided by the user.
 * @returns Whether the signature is valid.
 */
export const verifySignature = (walletAddress: string, signature: string): boolean => {
  const message = getSigningMessage(walletAddress); 
  const recoveredAddress = ethers.verifyMessage(message, signature);

  // Check if the recovered address matches the provided wallet address
  return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
};

/**
 * Authenticates the user by verifying their wallet address and signature.
 * Saves them to the database if valid.
 * @param walletAddress - The user's wallet address.
 * @param signature - The signature provided by the user.
 * @returns The authenticated user object.
 * @throws Error if the signature is invalid.
 */
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
