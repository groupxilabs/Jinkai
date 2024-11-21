import { Request, Response } from 'express';
import { ethers } from 'ethers';
import { willContractAddress, willAbi } from '../Config/contractConfig';
import dotenv from 'dotenv';

dotenv.config();

const provider = new ethers.JsonRpcProvider('https://rpc.sepolia-api.lisk.com/');
const privateKey = process.env.PRIVATE_KEY;

const getContract = async () => {
  if (!privateKey) {
    throw new Error('Private key is not defined');
  }
  const wallet = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(willContractAddress, willAbi, wallet);
};

export const confirmWillActivity = async (req: Request, res: Response) => {
  const { willId } = req.params;  
  const { walletAddress } = req.body;  

  try {

    const validWalletAddress = ethers.getAddress(walletAddress);
    console.log('Valid Wallet Address:', validWalletAddress);  

    const contract = await getContract();

    const onChainWill = await contract.getWillDetailsByIdAndOwner(willId, validWalletAddress);
    console.log('onChainWill:', onChainWill);  

    if (!onChainWill || onChainWill === null) {
      return res.status(404).json({ message: 'Will not found on the blockchain for this wallet' });
    }

    const gracePeriod = 30 * 24 * 60 * 60; 
    const activityThreshold = 90 * 24 * 60 * 60; 

    const tx = await contract.updateTimeframes(willId, gracePeriod, activityThreshold);
    await tx.wait(); 

    res.status(200).json({ message: 'Your activity has been confirmed and timeframes updated.', onChainWill: onChainWill.toString() });
  } catch (error) {
    console.error('Error confirming activity:', error);
    res.status(500).json({ message: 'An error occurred while confirming your activity.' });
  }
};