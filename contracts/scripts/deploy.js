const hre = require("hardhat");

async function main() {
  console.log("Deploying LiquidityPool...");

  const LiquidityPool = await hre.ethers.getContractFactory("LiquidityPool");
  const liquidityPool = await LiquidityPool.deploy();

  // ★ Ethers v6 の正しい待機方法
  await liquidityPool.waitForDeployment();

  console.log("LiquidityPool deployed at:", await liquidityPool.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
