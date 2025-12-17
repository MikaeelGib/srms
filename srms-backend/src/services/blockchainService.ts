import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// Environment variables
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";

// Provider
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Wallet (only if valid private key is provided)
let wallet: ethers.Wallet | null = null;
if (PRIVATE_KEY && PRIVATE_KEY !== "0xYOUR_DEPLOYER_WALLET_PRIVATE_KEY") {
  try {
    wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  } catch (err) {
    console.warn("Failed to create wallet with PRIVATE_KEY. Blockchain calls will be stubbed.");
  }
} else {
  console.warn("No valid PRIVATE_KEY provided. Blockchain calls will be stubbed.");
}

// Try to load the contract artifact
let StudentRegistryAbi: any[] = [];
try {
  const artifact = require("../../srms-contracts/artifacts/contracts/StudentRegistry.sol/StudentRegistry.json");
  StudentRegistryAbi = artifact.abi;
} catch {
  console.warn("StudentRegistry artifact not found. Blockchain calls will be stubbed.");
}

// Contract instance (only if wallet, address, and ABI exist)
let contract: ethers.Contract | null = null;
if (wallet && CONTRACT_ADDRESS && StudentRegistryAbi.length > 0) {
  contract = new ethers.Contract(CONTRACT_ADDRESS, StudentRegistryAbi, wallet);
}

// Exported service
export const blockchainService = {
  contract,

  // Register a student on blockchain (stub if not ready)
  registerStudent: async (studentId: string, name: string) => {
    if (!contract) {
      console.log(`[STUB] registerStudent(${studentId}, ${name}) skipped`);
      return null;
    }

    const tx = await contract.registerStudent(studentId, name);
    await tx.wait();
    console.log(`[BLOCKCHAIN] Student registered: ${studentId}`);
    return tx.hash;
  },

  // Example: get student (stub)
  getStudent: async (studentId: string) => {
    if (!contract) {
      console.log(`[STUB] getStudent(${studentId}) skipped`);
      return null;
    }

    return await contract.getStudent(studentId);
  },
};
