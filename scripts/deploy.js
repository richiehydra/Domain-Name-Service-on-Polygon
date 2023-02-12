// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [owner] = await hre.ethers.getSigners();
  const DomainNameService = await hre.ethers.getContractFactory("DomainName");
  const contract = await DomainNameService.deploy("ninja");
  await contract.deployed();

  console.log(`The Contract Address is ${contract.address}`);
  console.log(` The Address of the owner is ${owner.address}`);

  const txn = await contract.register("richie", { value: hre.ethers.utils.parseEther("0.1") });
  await txn.wait();
  console.log("the domain richie.ninja registered");

  const txn2 = await contract.setRecords("richie", "Iam Hydra Richie");
  await txn2.wait();
  console.log("Set record for richie.ninja");


  const address = await contract.getAddress("richie");
  console.log(`The owner Address of ninja is : ${address}`);


  const balance = await hre.ethers.provider.getBalance(contract.address);
  console.log("The Contract Balance is :", hre.ethers.utils.formatEther(balance));




}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
