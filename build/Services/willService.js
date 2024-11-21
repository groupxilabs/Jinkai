"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmWillActivity = void 0;
const ethers_1 = require("ethers");
const contractConfig_1 = require("../Config/contractConfig");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const provider = new ethers_1.ethers.JsonRpcProvider('https://rpc.sepolia-api.lisk.com/');
const privateKey = process.env.PRIVATE_KEY;
const getContract = async () => {
    if (!privateKey) {
        throw new Error('Private key is not defined');
    }
    const wallet = new ethers_1.ethers.Wallet(privateKey, provider);
    return new ethers_1.ethers.Contract(contractConfig_1.willContractAddress, contractConfig_1.willAbi, wallet);
};
const confirmWillActivity = async (req, res) => {
    const { willId } = req.params;
    const { walletAddress } = req.body;
    try {
        const validWalletAddress = ethers_1.ethers.getAddress(walletAddress);
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
    }
    catch (error) {
        console.error('Error confirming activity:', error);
        res.status(500).json({ message: 'An error occurred while confirming your activity.' });
    }
};
exports.confirmWillActivity = confirmWillActivity;
