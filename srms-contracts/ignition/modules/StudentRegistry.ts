import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("StudentRegistryModule", (m) => {
  const registry = m.contract("StudentRegistry");
  return { registry };
});
