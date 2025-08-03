// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ILimitOrderProtocol {
    function fillOrder(
        bytes calldata order,
        bytes calldata signature,
        bytes calldata interaction
    ) external payable returns (uint256);
}

contract VaultHybridStrategy is Ownable {
    // Execution config
    uint256 public nextExecutionTime;
    uint256 public executionInterval;
    uint256 public chunkAmount;

    // Sentiment
    int256 public sentimentScore;
    int256 public sentimentThreshold = 60;

    // Tokens & Protocol
    address public assetIn;
    address public assetOut;
    ILimitOrderProtocol public limitOrderProtocol;

    event TradeExecuted(uint256 amount, uint256 timestamp);
    event SentimentUpdated(int256 newScore);

    constructor(
        address _assetIn,
        address _assetOut,
        address _limitOrderProtocol,
        uint256 _interval,
        uint256 _chunkAmount
    ) Ownable(msg.sender) {
        assetIn = _assetIn;
        assetOut = _assetOut;
        limitOrderProtocol = ILimitOrderProtocol(_limitOrderProtocol);
        executionInterval = _interval;
        chunkAmount = _chunkAmount;
        nextExecutionTime = block.timestamp + _interval;
    }

    // --- Logic Functions ---
    function canExecute() public view returns (bool) {
        return (block.timestamp >= nextExecutionTime &&
            sentimentScore >= sentimentThreshold);
    }

    function updateSentiment(int256 _score) external onlyOwner {
        sentimentScore = _score;
        emit SentimentUpdated(_score);
    }

    function executeTrade(
        bytes calldata order,
        bytes calldata signature,
        bytes calldata interaction
    ) external onlyOwner {
        require(canExecute(), "Execution conditions not met");

        limitOrderProtocol.fillOrder(order, signature, interaction);

        nextExecutionTime = block.timestamp + executionInterval;
        emit TradeExecuted(chunkAmount, block.timestamp);
    }
}
