import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying StudentRegistry...");

  const StudentRegistry = await ethers.getContractFactory("StudentRegistry");
  const registry = await StudentRegistry.deploy();

  // ⬇️ ethers v6 way
  await registry.waitForDeployment();
  const address = await registry.getAddress();

  console.log("✅ StudentRegistry deployed at:", address);
  console.log("📌 Add this to backend .env as CONTRACT_ADDRESS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
