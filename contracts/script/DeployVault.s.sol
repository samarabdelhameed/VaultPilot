// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/VaultHybridStrategy.sol";

contract DeployVaultScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy VaultHybridStrategy with default parameters
        VaultHybridStrategy vault = new VaultHybridStrategy(
            0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9, // Asset In (WETH on Sepolia)
            0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238, // Asset Out (USDC on Sepolia)
            0x119C71D3BAC7E8FEa707d8efB461bc1DF9a65925, // 1inch Limit Order Protocol
            3600, // 1 hour interval
            1000000000000000000, // 1 ETH chunk amount
            70 // 70% sentiment threshold
        );

        console.log("VaultHybridStrategy deployed at:", address(vault));

        vm.stopBroadcast();
    }
}
