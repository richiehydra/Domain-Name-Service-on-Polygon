require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks:
  {
    mumbai:
    {
      url:"https://polygon-mumbai.g.alchemy.com/v2/8-UneshwPpMnoJfhWcPaT-uTM9QHlpWA",
      accounts:["Private Key"],
  }
};
