const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("====================================");
  console.log("Deploying with:", deployer.address);
  console.log("User:", deployer.address);
  console.log("Network:", hre.network.name);
  console.log("====================================");

  /* =========================
     1. Mock Collateral Token
  ========================= */
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const token = await MockERC20.deploy("Test USD", "tUSD");
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("CollateralToken:", tokenAddress);

  // 初期 USER 残高（テスト用）
  await (await token.mint(
    deployer.address,
    hre.ethers.parseEther("50000")
  )).wait();
  console.log("Initial token mint completed");

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
  ========================= */
  const LiquidityPool = await hre.ethers.getContractFactory("LiquidityPool");
  const pool = await LiquidityPool.deploy(tokenAddress, plpAddress);
  await pool.waitForDeployment();
  const poolAddress = await pool.getAddress();
  console.log("LiquidityPool:", poolAddress);

  // PLP に pool を設定
  await (await plp.setPool(poolAddress)).wait();

  /* =========================
     4. PriceOracle
  ========================= */
  const PriceOracle = await hre.ethers.getContractFactory("PriceOracle");
  const oracle = await PriceOracle.deploy();
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  console.log("PriceOracle:", oracleAddress);

  // 初期価格（tUSD = 3000）
  await (await oracle.addUpdater(deployer.address)).wait();
  await (await oracle.setPrice(
    hre.ethers.encodeBytes32String("tUSD"),
    hre.ethers.parseEther("3000")
  )).wait();
  console.log("Oracle initialized");

  /* =========================
     5. PerpetualTrading
  ========================= */
  const PerpetualTrading = await hre.ethers.getContractFactory("PerpetualTrading");
  const perp = await PerpetualTrading.deploy(oracleAddress, poolAddress);
  await perp.waitForDeployment();
  const perpAddress = await perp.getAddress();
  console.log("PerpetualTrading:", perpAddress);

  /* =========================
     6. LiquidationEngine
  ========================= */
  const LiquidationEngine = await hre.ethers.getContractFactory("LiquidationEngine");
  const liquidation = await LiquidationEngine.deploy(perpAddress);
  await liquidation.waitForDeployment();
  const liquidationAddress = await liquidation.getAddress();
  console.log("LiquidationEngine:", liquidationAddress);

  /* =========================
     7. Router
  ========================= */
  const Router = await hre.ethers.getContractFactory("Router");
  const router = await Router.deploy(perpAddress, poolAddress);
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();
  console.log("Router:", routerAddress);

  /* =========================
     8. Wiring
  ========================= */
  await (await pool.setRouter(routerAddress)).wait();
  await (await pool.setPerp(perpAddress)).wait();
  await (await perp.setRouter(routerAddress)).wait();
  await (await perp.setLiquidationEngine(liquidationAddress)).wait();
  console.log("Wiring completed");

  /* =========================
     9. Initial LP liquidity
  ========================= */
  await (await token.approve(poolAddress, hre.ethers.parseEther("10000"))).wait();
  await (await pool.lpDeposit(hre.ethers.parseEther("10000"))).wait();
  console.log("Initial LP liquidity deposited");

  /* =========================
     10. Save addresses (console用)
  ========================= */
  const deploymentsDir = path.resolve(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const deploymentData = {
    CollateralToken: tokenAddress,
    PLP: plpAddress,
    LiquidityPool: poolAddress,
    PriceOracle: oracleAddress,
    PerpetualTrading: perpAddress,
    LiquidationEngine: liquidationAddress,
    Router: routerAddress
  };

  fs.writeFileSync(
    path.join(deploymentsDir, `${hre.network.name}.json`),
    JSON.stringify(deploymentData, null, 2)
  );

  /* =========================
     11. Frontend env
  ========================= */
  const envPath = path.resolve(__dirname, "../../frontend/.env.local");
  const envContent = `
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_CHAIN_NAME=sepolia
NEXT_PUBLIC_ROUTER_ADDRESS=${routerAddress}
NEXT_PUBLIC_PERPETUAL_ADDRESS=${perpAddress}
NEXT_PUBLIC_LIQUIDITY_POOL_ADDRESS=${poolAddress}
NEXT_PUBLIC_LIQUIDATION_ENGINE_ADDRESS=${liquidationAddress}
NEXT_PUBLIC_ORACLE_ADDRESS=${oracleAddress}
NEXT_PUBLIC_COLLATERAL_TOKEN_ADDRESS=${tokenAddress}
NEXT_PUBLIC_PLP_ADDRESS=${plpAddress}
`;

  fs.writeFileSync(envPath, envContent.trim());
  console.log("frontend/.env.local updated");

  console.log("====================================");
  console.log("DEPLOY FINISHED (FROZEN)");
  console.log("====================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
