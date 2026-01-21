import { BrowserProvider, Contract } from "ethers";
import { CONTRACTS } from "./addresses";
import { ERC20_ABI } from "./abi/ERC20";
import { getRouter } from "./getRouter";

export async function deposit(amount: bigint) {
  if (!window.ethereum) throw new Error("Wallet not found");

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const user = await signer.getAddress();

  // ERC20
  const token = new Contract(
    CONTRACTS.COLLATERAL_TOKEN,
    ERC20_ABI,
    signer
  );

  // ✅ approve to LiquidityPool
  const allowance: bigint = await token.allowance(
    user,
    CONTRACTS.LIQUIDITY_POOL
  );

  if (allowance < amount) {
    const tx = await token.approve(
      CONTRACTS.LIQUIDITY_POOL,
      amount
    );
    await tx.wait();
  }

  // Router.deposit
  const router = getRouter(signer);
  const tx = await router.deposit(amount);
  return await tx.wait();
}
