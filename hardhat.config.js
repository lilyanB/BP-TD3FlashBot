require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const ALCHEMY_RPC_URL_SEPOLIA = process.env.ALCHEMY_RPC_URL_SEPOLIA;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: ALCHEMY_RPC_URL_SEPOLIA,
      accounts: [PRIVATE_KEY],
    },
  },
};
