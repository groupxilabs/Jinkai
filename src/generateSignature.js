import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

const walletPrivateKey =  process.env.PRIVATE_KEY;; 
const walletAddress = '0x9e2d3c52471A23500bA1aB086fe2812f1d444EA4'; 

const generateSignature = async () => {
  try {
    const wallet = new ethers.Wallet(walletPrivateKey);

    if (wallet.address.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new Error('Wallet address does not match the private key');
    }

    const message = `Please sign this message to authenticate with your wallet. Wallet Address: ${walletAddress}`;

    const signature = await wallet.signMessage(message);

    console.log('Wallet Address:', wallet.address);
    console.log('Message:', message);
    console.log('Generated Signature:', signature);
  } catch (error) {
    console.error('Error generating signature:', error);
  }
};

generateSignature();
