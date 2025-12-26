import { ethers } from "ethers";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

// Required env vars
const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const CONTRACT_ADDRESS = process.env.STUDENT_REGISTRY_ADDRESS!;

// Provider & wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Load ABI
import StudentRegistryArtifact from "../../../srms-contracts/artifacts/contracts/StudentRegistry.sol/StudentRegistry.json";

// Contract instance
const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  StudentRegistryArtifact.abi,
  wallet
);

export const BlockchainService = {
  // Add record on-chain
  async addRecord(studentId: string, recordId: string) {
    const tx = await contract.addRecord(studentId, recordId);
    await tx.wait();

    return {
      txHash: tx.hash,
    };
  },

  // Read records from chain
  async getRecords(studentId: string) {
    return await contract.getRecords(studentId);
  },
};
