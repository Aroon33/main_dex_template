import { Contract, ethers } from "ethers";
import { CONTRACTS } from "@/lib/eth/addresses";

/**
 * Withdraw collateral (Router entry point)
 */
export async function withdrawTx(
  signer: ethers.Signer,
  amount: bigint
) {
  const router = new Contract(
    CONTRACTS.ROUTER,
    ["function withdraw(uint256 amount) external"],
    signer
  );

  const tx = await router.withdraw(amount);
  await tx.wait();
}
