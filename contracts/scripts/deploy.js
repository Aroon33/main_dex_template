const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("====================================");
  console.log("Deploying with:", deployer.address);
  console.log("Network:", hre.network.name);
  console.log("====================================");

  /* =========================
     1. Mock Collateral Token
  ========================= */
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const collateral = await MockERC20.deploy("Test USD", "tUSD");
  await collateral.waitForDeployment();
  const collateralAddress = await collateral.getAddress();
  console.log("CollateralToken:", collateralAddress);

  /* =========================
     2. PLP
  ========================= */
  const PLP = await hre.ethers.getContractFactory("PLP");
  const plp = await PLP.deploy("Perp LP Token", "PLP");
  await plp.waitForDeployment();
  const plpAddress = await plp.getAddress();
  console.log("PLP:", plpAddress);

  /* =========================
     3. LiquidityPool
     constructor(address collateralToken, address plp)
  ========================= */
  const LiquidityPool = await hre.ethers.getContractFactory("LiquidityPool");
  const pool = await LiquidityPool.deploy(
    collateralAddress,
    plpAddress
  );
  await pool.waitForDeployment();
  const poolAddress = await pool.getAddress();
  console.log("LiquidityPool:", poolAddress);

  /* =========================
     4. PriceOracle
  ========================= */
  const PriceOracle = await hre.ethers.getContractFactory("PriceOracle");
  const oracle = await PriceOracle.deploy();
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  console.log("PriceOracle:", oracleAddress);

  /* =========================
     5. PerpetualTrading
     constructor(address oracle, address liquidityPool)
  ========================= */
  const PerpetualTrading = await hre.ethers.getContractFactory("PerpetualTrading");
  const perp = await PerpetualTrading.deploy(
    oracleAddress,
    poolAddress
  );
  await perp.waitForDeployment();
  const perpAddress = await perp.getAddress();
  console.log("PerpetualTrading:", perpAddress);

  /* =========================
     6. LiquidationEngine
     constructor(address perp)
  ========================= */
  const LiquidationEngine = await hre.ethers.getContractFactory("LiquidationEngine");
  const liquidation = await LiquidationEngine.deploy(perpAddress);
  await liquidation.waitForDeployment();
  const liquidationAddress = await liquidation.getAddress();
  console.log("LiquidationEngine:", liquidationAddress);

  /* =========================
     7. Router
     constructor(address perp)
  ========================= */
  const Router = await hre.ethers.getContractFactory("Router");
  const router = await Router.deploy(perpAddress);
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();
  console.log("Router:", routerAddress);

  /* =========================
     8. Wiring
  ========================= */
  await (await pool.setPerp(perpAddress)).wait();
  await (await pool.setRouter(routerAddress)).wait();
  await (await perp.setRouter(routerAddress)).wait();
  await (await perp.setLiquidationEngine(liquidationAddress)).wait();

  console.log("Wiring completed");

  /* =========================
     9. Frontend env
  ========================= */
  const envPath = path.resolve(
    __dirname,
    "../../frontend/.env.local"
  );

  const envContent = `
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_CHAIN_NAME=sepolia
NEXT_PUBLIC_ROUTER_ADDRESS=${routerAddress}
NEXT_PUBLIC_PERPETUAL_ADDRESS=${perpAddress}
NEXT_PUBLIC_LIQUIDITY_POOL_ADDRESS=${poolAddress}
NEXT_PUBLIC_LIQUIDATION_ENGINE_ADDRESS=${liquidationAddress}
NEXT_PUBLIC_ORACLE_ADDRESS=${oracleAddress}
NEXT_PUBLIC_COLLATERAL_TOKEN_ADDRESS=${collateralAddress}
NEXT_PUBLIC_PLP_ADDRESS=${plpAddress}
`;

  fs.writeFileSync(envPath, envContent.trim());
  console.log("frontend/.env.local updated");

  console.log("====================================");
  console.log("DEPLOY FINISHED");
  console.log("====================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
