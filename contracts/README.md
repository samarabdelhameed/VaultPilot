## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

Smart Contracts
🔐 VaultPilot/contracts/ – Full Advanced Analysis of Smart Contracts

1. VaultFactory.sol ✅
   Purpose:
   Main contract to create user-specific smart vaults (TWAP / Sentiment / Hybrid).
   Primary Goal:
   Accept user input (asset pair, strategy type, amount, intervals, sentiment threshold).

Deploy a dedicated Vault per user.

Map and track each vault via userVaults.

Integration:
Triggered via create-vault.tsx.

Sends vault address to backend and MCP memory.

Suggested Pro Enhancement:
function createVault(
string memory strategyType,
address assetIn,
address assetOut,
uint256 totalAmount,
uint256 interval,
uint256 sentimentThreshold,
uint256 maxLoss
) external returns (address);

Test Scenarios:
✅ Creates the correct vault type per user.
✅ Backend correctly tracks created vaults.
✅ Only vault owners can interact.

2. VaultTWAP.sol ⏱️
   Purpose:
   Executes large trades in timed chunks (Time-Weighted Average Price).
   Primary Goal:
   Minimize price slippage.

Split trades into smaller chunks.

Execute each chunk after a fixed interval.

Integration:
Works with dashboard.tsx for chunk status.

Emits TradeExecuted → displayed in ExecutionPreview.tsx.

Syncs with DIA oracle via diaPriceFeed.ts.

Suggested Expansion:
event TradeExecuted(uint256 chunkId, uint256 amount, uint256 timestamp);
function getNextExecutionTime() public view returns (uint256);

Additional Pro Upgrade:
function adjustExecutionBasedOnSentiment(uint256 sentimentScore) external onlyOwner;

Use sentimentScore to dynamically alter interval and chunk size.

Test Scenarios:
✅ Executes one chunk every interval.
✅ Dynamically adjusts to bullish/bearish sentiment.
✅ Stops when all chunks are done.
✅ User sees live progress.

3. VaultSentiment.sol 🧠
   Purpose:
   Executes trades only when market sentiment is positive.
   Primary Goal:
   Uses sentiment from MCP agent.

Executes if score > threshold.

Pauses when sentiment is low.

Integration:
Updates via vibeChecker.ts.

Emits MoodUpdated → shown in SentimentGraph.tsx.

Suggested Expansion:
function setSentimentScore(int256 score) external onlyOracle;
event MoodUpdated(int256 newScore);

Additional Pro Upgrade:
function getSentimentParameters() public view returns (uint256 executionInterval, uint256 orderSize);

Dynamically control how often and how much to trade.

Test Scenarios:
✅ Executes when sentiment > threshold.
✅ Automatically pauses when sentiment drops.
✅ Reacts dynamically to DIA + MCP data.

4. VaultHybridStrategy.sol 🔀
   Purpose:
   Combines TWAP and Sentiment for hybrid logic.
   Primary Goal:
   Execute only when time + sentiment conditions are met.

Faster in bullish markets, slower in bearish ones.

Integration:
Combines VaultTWAP.sol and VaultSentiment.sol behavior.

Logic processed via strategy.ts.

Status shown in VaultSummary.tsx.

Suggested Expansion:
function canExecute() public view returns (bool);
event HybridTradeExecuted(uint256 amount, int256 mood);

Additional Pro Upgrade:
function dynamicAdjustment(int256 sentimentScore) public returns (bool);

Change TWAP interval and aggressiveness based on score buckets (e.g. 0-100 scale).

Test Scenarios:
✅ Executes if both time + sentiment are met.
✅ Slows down on bad mood.
✅ Live performance metrics in dashboard.

5. VaultNFT.sol 🖼️
   Purpose:
   Turns each Vault into a tradable ERC-721 NFT.
   Primary Goal:
   Represent Vault ownership and strategy.

Allow sharing, forking, resale.

Base layer for Vault Marketplace.

Integration:
Minted after first successful trade.

Metadata includes type, returns, name.

Displayed in VaultSummary.tsx.

Suggested Expansion:
function mintVaultNFT(address vault, string memory uri) external;

Test Scenarios:
✅ One NFT per vault.
✅ Metadata reflects vault.
✅ Can be transferred/cloned.

6. RiskManager.sol 🛡️
   Purpose:
   Dynamic risk and stop-loss controller.
   Primary Goal:
   Pause vaults in high-risk states.

Let users pause/resume.

Cap losses, control slippage.

Integration:
Syncs with VaultSummary.tsx alerts.

Monitors drawdown, slippage.

Data stored in MCP memory for AI planning.

Suggested Expansion:
function checkRisk() external view returns (bool);
event RiskTriggered(string reason, uint256 value);

Additional Pro Upgrade:
function emergencyPauseByAI(address vault, int256 sentimentScore) external onlyAdmin;

MCP or strategy-advisor can trigger emergency pause if sentiment crashes.

Test Scenarios:
✅ Auto-pauses on loss > threshold.
✅ Rejects slippage breaches.
✅ Emits alerts to frontend.

✅ Final Summary: Smart Contract Layer Fulfillment
Requirement
Status
Onchain execution
✅ Fully supported
Custom strategies (TWAP/Hybrid/AI)
✅ Fully supported
Integration with oracles & agents
✅ DIA + MCP ready
Real-time dashboard + NFT
✅ Covered
User config + risk control
✅ Covered
AI memory and logic adaptation
✅ Expandable via MCP
Forkable/shared vaults
✅ With VaultNFT
