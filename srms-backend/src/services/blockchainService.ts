import { ethers } from "ethers";
import dotenv from "dotenv";

// Load env variables EARLY
dotenv.config();

/* =========================
   ENV VALIDATION
========================= */
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.STUDENT_REGISTRY_ADDRESS;

if (!RPC_URL) throw new Error("❌ RPC_URL missing in .env");
if (!PRIVATE_KEY) throw new Error("❌ PRIVATE_KEY missing in .env");
if (!CONTRACT_ADDRESS) throw new Error("❌ STUDENT_REGISTRY_ADDRESS missing in .env");

/* =========================
   PROVIDER & WALLET
========================= */
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

/* =========================
   DEBUG (VERY IMPORTANT)
========================= */
(async () => {
  const network = await provider.getNetwork();
  console.log("🔗 Blockchain network:", network.name, `(chainId: ${network.chainId})`);
  console.log("👛 Wallet address:", wallet.address);
  console.log("📜 Contract address:", CONTRACT_ADDRESS);
})();

/* =========================
   CONTRACT
========================= */
// ⚠️ Path is OK because backend & contracts are in same repo
import StudentRegistryArtifact from "../../../srms-contracts/artifacts/contracts/StudentRegistry.sol/StudentRegistry.json";

const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  StudentRegistryArtifact.abi,
  wallet
);

/* =========================
   SERVICE
========================= */
export const BlockchainService = {
  /**
   * Write certificate record ON-CHAIN
   */
  async addRecord(studentId: string, recordId: string) {
    console.log("🧾 Writing record to blockchain...");
    console.log("Student ID:", studentId);
    console.log("Record ID:", recordId);

    const tx = await contract.addRecord(studentId, recordId);
    console.log("⏳ Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("✅ Transaction mined in block:", receipt.blockNumber);

    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
    };
  },

  /**
   * Read records from blockchain
   */
  async getRecords(studentId: string) {
    console.log("🔍 Reading records for:", studentId);
    return await contract.getRecords(studentId);
  },
};
