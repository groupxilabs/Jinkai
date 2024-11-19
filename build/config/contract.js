"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contract = exports.signer = exports.provider = void 0;
const ethers_1 = require("ethers");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const provider = new ethers_1.JsonRpcProvider(process.env.RPC_URL);
exports.provider = provider;
const signer = new ethers_1.Wallet(process.env.PRIVATE_KEY, provider);
exports.signer = signer;
const contractABI = [
    {
        "inputs": [{ "internalType": "uint256", "name": "willId", "type": "uint256" }],
        "name": "distributeWill",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
];
const contractAddress = process.env.CONTRACT_ADDRESS;
exports.contract = new ethers_1.ethers.Contract(contractAddress, contractABI, signer);
