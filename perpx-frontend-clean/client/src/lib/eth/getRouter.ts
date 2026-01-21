import { Contract } from "ethers";
import { ROUTER_ABI } from "./abi/Router";
import { CONTRACTS } from "./addresses";

export function getRouter(signerOrProvider: any) {
  return new Contract(
    CONTRACTS.ROUTER,
    ROUTER_ABI,
    signerOrProvider
  );
}
