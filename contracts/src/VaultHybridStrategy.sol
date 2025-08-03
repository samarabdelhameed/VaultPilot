// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface ILimitOrderProtocol {
    function fillOrder(
        bytes calldata order,
        bytes calldata signature,
        bytes calldata interaction
    ) external payable returns (uint256);
    
    function cancelOrder(bytes32 orderHash) external;
    
    function getOrderStatus(bytes32 orderHash) external view returns (bool filled, bool cancelled);
}

contract VaultHybridStrategy is Ownable {
    using SafeERC20 for IERC20;
    
    // === EXECUTION CONFIG ===
    uint256 public nextExecutionTime;
    uint256 public executionInterval;
    uint256 public chunkAmount;
    uint256 public totalExecutedTrades;
    uint256 public totalVolume;

    // === SENTIMENT & RISK ===
    int256 public sentimentScore;
    int256 public sentimentThreshold = 60;
    uint256 public riskLevel; // 0-100
    uint256 public maxRiskLevel = 80;

    // === TOKENS & PROTOCOL ===
    address public assetIn;
    address public assetOut;
    ILimitOrderProtocol public limitOrderProtocol;
    
    // === VAULT STATE ===
    bool public isActive = true;
    uint256 public lastExecutionTime;
    uint256 public totalFeesEarned;

    // === EVENTS ===
    event TradeExecuted(
        uint256 indexed timestamp,
        uint256 amount,
        int256 sentiment,
        uint256 gasUsed
    );
    event SentimentUpdated(int256 oldScore, int256 newScore);
    event RiskLevelUpdated(uint256 oldRisk, uint256 newRisk);
    event VaultPaused(address indexed owner);
    event VaultResumed(address indexed owner);
    event EmergencyWithdraw(address indexed token, uint256 amount);

    // === MODIFIERS ===
    modifier onlyActive() {
        require(isActive, "Vault is paused");
        _;
    }
    
    modifier onlyValidRisk() {
        require(riskLevel <= maxRiskLevel, "Risk level too high");
        _;
    }

    // === CONSTRUCTOR ===
    constructor(
        address _assetIn,
        address _assetOut,
        address _limitOrderProtocol,
        uint256 _interval,
        uint256 _chunkAmount,
        int256 _sentimentThreshold
    ) Ownable(msg.sender) {
        require(_assetIn != address(0), "Invalid asset in");
        require(_assetOut != address(0), "Invalid asset out");
        require(_limitOrderProtocol != address(0), "Invalid protocol");
        require(_interval > 0, "Invalid interval");
        require(_chunkAmount > 0, "Invalid chunk amount");
        require(_sentimentThreshold >= 0 && _sentimentThreshold <= 100, "Invalid threshold");
        
        assetIn = _assetIn;
        assetOut = _assetOut;
        limitOrderProtocol = ILimitOrderProtocol(_limitOrderProtocol);
        executionInterval = _interval;
        chunkAmount = _chunkAmount;
        sentimentThreshold = _sentimentThreshold;
        nextExecutionTime = block.timestamp + _interval;
        riskLevel = 50; // Default risk level
    }

    // === CORE LOGIC FUNCTIONS ===
    
    /**
     * @dev Check if trade can be executed based on time and sentiment
     */
    function canExecute() public view returns (bool) {
        return (
            isActive &&
            block.timestamp >= nextExecutionTime &&
            sentimentScore >= sentimentThreshold &&
            riskLevel <= maxRiskLevel
        );
    }

    /**
     * @dev Update sentiment score from AI/MCP agent
     */
    function updateSentiment(int256 _score) external onlyOwner {
        require(_score >= 0 && _score <= 100, "Invalid sentiment score");
        int256 oldScore = sentimentScore;
        sentimentScore = _score;
        emit SentimentUpdated(oldScore, _score);
    }

    /**
     * @dev Update risk level
     */
    function updateRiskLevel(uint256 _riskLevel) external onlyOwner {
        require(_riskLevel <= 100, "Invalid risk level");
        uint256 oldRisk = riskLevel;
        riskLevel = _riskLevel;
        emit RiskLevelUpdated(oldRisk, _riskLevel);
    }

    /**
     * @dev Execute trade using 1inch Limit Order Protocol
     */
    function executeTrade(
        bytes calldata order,
        bytes calldata signature,
        bytes calldata interaction
    ) external payable onlyOwner onlyActive onlyValidRisk {
        require(canExecute(), "Execution conditions not met");
        require(order.length > 0, "Invalid order");
        require(signature.length > 0, "Invalid signature");

        uint256 gasBefore = gasleft();
        
        // Execute the trade
        uint256 result = limitOrderProtocol.fillOrder{value: msg.value}(
            order,
            signature,
            interaction
        );

        uint256 gasUsed = gasBefore - gasleft();
        
        // Update state
        lastExecutionTime = block.timestamp;
        nextExecutionTime = block.timestamp + executionInterval;
        totalExecutedTrades++;
        totalVolume += chunkAmount;

        emit TradeExecuted(block.timestamp, chunkAmount, sentimentScore, gasUsed);
    }

    // === VAULT MANAGEMENT ===
    
    /**
     * @dev Pause vault operations
     */
    function pauseVault() external onlyOwner {
        isActive = false;
        emit VaultPaused(msg.sender);
    }

    /**
     * @dev Resume vault operations
     */
    function resumeVault() external onlyOwner {
        isActive = true;
        emit VaultResumed(msg.sender);
    }

    /**
     * @dev Emergency withdraw tokens
     */
    function emergencyWithdraw(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");
        
        IERC20(token).safeTransfer(owner(), balance);
        emit EmergencyWithdraw(token, balance);
    }

    // === VIEW FUNCTIONS ===
    
    /**
     * @dev Get vault statistics
     */
    function getVaultStats() external view returns (
        uint256 _totalTrades,
        uint256 _totalVolume,
        uint256 _lastExecution,
        uint256 _nextExecution,
        int256 _currentSentiment,
        uint256 _currentRisk
    ) {
        return (
            totalExecutedTrades,
            totalVolume,
            lastExecutionTime,
            nextExecutionTime,
            sentimentScore,
            riskLevel
        );
    }

    /**
     * @dev Get execution status
     */
    function getExecutionStatus() external view returns (
        bool _canExecute,
        bool _isActive,
        uint256 _timeUntilNext,
        bool _sentimentMet,
        bool _riskAcceptable
    ) {
        uint256 timeUntilNext = nextExecutionTime > block.timestamp ? 
            nextExecutionTime - block.timestamp : 0;
            
        return (
            canExecute(),
            isActive,
            timeUntilNext,
            sentimentScore >= sentimentThreshold,
            riskLevel <= maxRiskLevel
        );
    }

    // === RECEIVE FUNCTION ===
    receive() external payable {
        // Allow contract to receive ETH for gas fees
    }
}
