import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    mantle_testnet: {
      url: `https://rpc.testnet.mantle.xyz`,
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 5001,
    },
  },
};

export default config;
