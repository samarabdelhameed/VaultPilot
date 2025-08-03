// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./VaultHybridStrategy.sol";

contract VaultFactory is Ownable {
    // === STATE VARIABLES ===

    // Mapping: user address => array of vault addresses
    mapping(address => address[]) public userVaults;

    // Mapping: vault address => user address
    mapping(address => address) public vaultOwners;

    // Array of all vaults
    address[] public allVaults;

    // Default 1inch Limit Order Protocol address (Sepolia)
    address public constant DEFAULT_LIMIT_ORDER_PROTOCOL =
        0x119C71D3BAC7E8FEa707d8efB461bc1DF9a65925;

    // Default configuration
    uint256 public constant DEFAULT_INTERVAL = 3600; // 1 hour
    uint256 public constant DEFAULT_CHUNK_AMOUNT = 1000000000000000000; // 1 token
    int256 public constant DEFAULT_SENTIMENT_THRESHOLD = 60;

    // === EVENTS ===
    event VaultCreated(
        address indexed user,
        address indexed vault,
        address assetIn,
        address assetOut,
        uint256 interval,
        uint256 chunkAmount,
        int256 sentimentThreshold
    );

    event VaultDestroyed(address indexed user, address indexed vault);
    event FactoryPaused(address indexed owner);
    event FactoryResumed(address indexed owner);

    // === STATE ===
    bool public isPaused = false;

    // === MODIFIERS ===
    modifier whenNotPaused() {
        require(!isPaused, "Factory is paused");
        _;
    }

    // === CONSTRUCTOR ===
    constructor() Ownable(msg.sender) {}

    // === CORE FUNCTIONS ===

    /**
     * @dev Create a new vault with default settings
     */
    function createVault(
        address assetIn,
        address assetOut
    ) external whenNotPaused returns (address) {
        return
            createVaultWithConfig(
                assetIn,
                assetOut,
                DEFAULT_LIMIT_ORDER_PROTOCOL,
                DEFAULT_INTERVAL,
                DEFAULT_CHUNK_AMOUNT,
                DEFAULT_SENTIMENT_THRESHOLD
            );
    }

    /**
     * @dev Create a new vault with custom configuration
     */
    function createVaultWithConfig(
        address assetIn,
        address assetOut,
        address limitOrderProtocol,
        uint256 interval,
        uint256 chunkAmount,
        int256 sentimentThreshold
    ) public whenNotPaused returns (address) {
        require(assetIn != address(0), "Invalid asset in");
        require(assetOut != address(0), "Invalid asset out");
        require(limitOrderProtocol != address(0), "Invalid protocol");
        require(interval > 0, "Invalid interval");
        require(chunkAmount > 0, "Invalid chunk amount");
        require(
            sentimentThreshold >= 0 && sentimentThreshold <= 100,
            "Invalid threshold"
        );

        // Deploy new vault
        VaultHybridStrategy vault = new VaultHybridStrategy(
            assetIn,
            assetOut,
            limitOrderProtocol,
            interval,
            chunkAmount,
            sentimentThreshold
        );

        address vaultAddress = address(vault);

        // Store vault information
        userVaults[msg.sender].push(vaultAddress);
        vaultOwners[vaultAddress] = msg.sender;
        allVaults.push(vaultAddress);

        emit VaultCreated(
            msg.sender,
            vaultAddress,
            assetIn,
            assetOut,
            interval,
            chunkAmount,
            sentimentThreshold
        );

        return vaultAddress;
    }

    /**
     * @dev Get all vaults for a user
     */
    function getUserVaults(
        address user
    ) external view returns (address[] memory) {
        return userVaults[user];
    }

    /**
     * @dev Get vault count for a user
     */
    function getUserVaultCount(address user) external view returns (uint256) {
        return userVaults[user].length;
    }

    /**
     * @dev Get total vault count
     */
    function getTotalVaultCount() external view returns (uint256) {
        return allVaults.length;
    }

    /**
     * @dev Get all vaults (paginated)
     */
    function getAllVaults(
        uint256 offset,
        uint256 limit
    ) external view returns (address[] memory) {
        uint256 total = allVaults.length;
        if (offset >= total) {
            return new address[](0);
        }

        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }

        address[] memory result = new address[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = allVaults[i];
        }

        return result;
    }

    /**
     * @dev Check if address is a vault
     */
    function isVault(address vault) external view returns (bool) {
        return vaultOwners[vault] != address(0);
    }

    /**
     * @dev Get vault owner
     */
    function getVaultOwner(address vault) external view returns (address) {
        return vaultOwners[vault];
    }

    // === ADMIN FUNCTIONS ===

    /**
     * @dev Pause factory operations
     */
    function pauseFactory() external onlyOwner {
        isPaused = true;
        emit FactoryPaused(msg.sender);
    }

    /**
     * @dev Resume factory operations
     */
    function resumeFactory() external onlyOwner {
        isPaused = false;
        emit FactoryResumed(msg.sender);
    }

    /**
     * @dev Emergency function to destroy a vault (only owner)
     */
    function emergencyDestroyVault(address vault) external onlyOwner {
        require(vaultOwners[vault] != address(0), "Vault does not exist");

        // Remove from user vaults
        address owner = vaultOwners[vault];
        address[] storage userVaultsArray = userVaults[owner];

        for (uint256 i = 0; i < userVaultsArray.length; i++) {
            if (userVaultsArray[i] == vault) {
                userVaultsArray[i] = userVaultsArray[
                    userVaultsArray.length - 1
                ];
                userVaultsArray.pop();
                break;
            }
        }

        // Remove from all vaults
        for (uint256 i = 0; i < allVaults.length; i++) {
            if (allVaults[i] == vault) {
                allVaults[i] = allVaults[allVaults.length - 1];
                allVaults.pop();
                break;
            }
        }

        delete vaultOwners[vault];

        emit VaultDestroyed(owner, vault);
    }

    // === VIEW FUNCTIONS ===

    /**
     * @dev Get factory statistics
     */
    function getFactoryStats()
        external
        view
        returns (uint256 _totalVaults, uint256 _activeVaults, bool _isPaused)
    {
        uint256 activeVaults = 0;
        for (uint256 i = 0; i < allVaults.length; i++) {
            try VaultHybridStrategy(payable(allVaults[i])).isActive() returns (
                bool active
            ) {
                if (active) activeVaults++;
            } catch {
                // Vault might not exist or be corrupted
            }
        }

        return (allVaults.length, activeVaults, isPaused);
    }
}
