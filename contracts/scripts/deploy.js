const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with:", deployer.address);

  /* --------------------------
     1. LiquidityPool
  -------------------------- */
  const LiquidityPool = await hre.ethers.getContractFactory("LiquidityPool");
  const liquidityPool = await LiquidityPool.deploy();
  await liquidityPool.waitForDeployment();
  const liquidityPoolAddress = await liquidityPool.getAddress();
  console.log("LiquidityPool:", liquidityPoolAddress);

  /* --------------------------
     2. PriceOracle
  -------------------------- */
  const PriceOracle = await hre.ethers.getContractFactory("PriceOracle");
  const oracle = await PriceOracle.deploy();
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  console.log("Oracle:", oracleAddress);

  /* --------------------------
     3. FundingRate
        constructor(address oracle)
  -------------------------- */
  const FundingRate = await hre.ethers.getContractFactory("FundingRate");
  const fundingRate = await FundingRate.deploy(oracleAddress);
  await fundingRate.waitForDeployment();
  const fundingRateAddress = await fundingRate.getAddress();
  console.log("FundingRate:", fundingRateAddress);

  /* --------------------------
     4. PerpetualTrading
        constructor(
          address oracle,
          address liquidityPool,
          address fundingRate
        )
  -------------------------- */
  const PerpetualTrading = await hre.ethers.getContractFactory("PerpetualTrading");
  const perp = await PerpetualTrading.deploy(
    oracleAddress,
    liquidityPoolAddress,
    fundingRateAddress
  );
  await perp.waitForDeployment();
  const perpAddress = await perp.getAddress();
  console.log("PerpetualTrading:", perpAddress);

  /* --------------------------
     5. LiquidationEngine
        constructor(address perp, address oracle)
  -------------------------- */
  const LiquidationEngine = await hre.ethers.getContractFactory("LiquidationEngine");
  const liquidation = await LiquidationEngine.deploy(
    perpAddress,
    oracleAddress
  );
  await liquidation.waitForDeployment();
  const liquidationAddress = await liquidation.getAddress();
  console.log("LiquidationEngine:", liquidationAddress);

  /* --------------------------
     6. Router
        constructor(address perp, address oracle, address liquidityPool, address liquidation)
        ※ あなたの Router 定義に合わせています
  -------------------------- */
  const Router = await hre.ethers.getContractFactory("Router");
  const router = await Router.deploy(
    perpAddress,
    oracleAddress,
    liquidityPoolAddress,
    liquidationAddress
  );
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();
  console.log("Router:", routerAddress);

  console.log("\n✅ Deploy finished successfully\n");

  console.log("==== USE THESE IN FRONTEND ====");
  console.log("NEXT_PUBLIC_ROUTER_ADDRESS=", routerAddress);
  console.log("NEXT_PUBLIC_ORACLE_ADDRESS=", oracleAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
