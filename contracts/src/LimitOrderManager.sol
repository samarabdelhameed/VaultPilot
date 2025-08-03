// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ILimitOrderProtocol {
    function fillOrder(
        bytes calldata order,
        bytes calldata signature,
        bytes calldata interaction
    ) external payable returns (uint256);

    function cancelOrder(bytes32 orderHash) external;

    function getOrderStatus(
        bytes32 orderHash
    ) external view returns (bool filled, bool cancelled);
}

contract LimitOrderManager is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // === STRUCTS ===
    struct LimitOrder {
        address maker;
        address makerAsset;
        address takerAsset;
        uint256 makerAmount;
        uint256 takerAmount;
        uint256 expiration;
        bytes32 orderHash;
        bool isActive;
        bool isFilled;
        bool isCancelled;
        uint256 createdAt;
        uint256 filledAt;
    }

    struct OrderStats {
        uint256 totalOrders;
        uint256 activeOrders;
        uint256 filledOrders;
        uint256 cancelledOrders;
        uint256 totalVolume;
    }

    // === STATE VARIABLES ===
    mapping(bytes32 => LimitOrder) public orders;
    mapping(address => bytes32[]) public userOrders;
    mapping(address => uint256) public userOrderCount;

    bytes32[] public allOrderHashes;
    uint256 public totalOrders;
    uint256 public totalVolume;

    ILimitOrderProtocol public limitOrderProtocol;

    // === EVENTS ===
    event OrderCreated(
        bytes32 indexed orderHash,
        address indexed maker,
        address makerAsset,
        address takerAsset,
        uint256 makerAmount,
        uint256 takerAmount,
        uint256 expiration
    );

    event OrderFilled(
        bytes32 indexed orderHash,
        address indexed taker,
        uint256 amount,
        uint256 gasUsed
    );

    event OrderCancelled(bytes32 indexed orderHash, address indexed maker);

    event OrderExpired(bytes32 indexed orderHash, address indexed maker);

    // === MODIFIERS ===
    modifier onlyOrderMaker(bytes32 orderHash) {
        require(orders[orderHash].maker == msg.sender, "Not order maker");
        _;
    }

    modifier orderExists(bytes32 orderHash) {
        require(
            orders[orderHash].orderHash != bytes32(0),
            "Order does not exist"
        );
        _;
    }

    modifier orderActive(bytes32 orderHash) {
        require(orders[orderHash].isActive, "Order not active");
        _;
    }

    modifier orderNotExpired(bytes32 orderHash) {
        require(
            orders[orderHash].expiration > block.timestamp,
            "Order expired"
        );
        _;
    }

    // === CONSTRUCTOR ===
    constructor(address _limitOrderProtocol) Ownable(msg.sender) {
        require(_limitOrderProtocol != address(0), "Invalid protocol address");
        limitOrderProtocol = ILimitOrderProtocol(_limitOrderProtocol);
    }

    // === CORE FUNCTIONS ===

    /**
     * @dev Create a new limit order
     */
    function createLimitOrder(
        address makerAsset,
        address takerAsset,
        uint256 makerAmount,
        uint256 takerAmount,
        uint256 expiration
    ) external nonReentrant returns (bytes32 orderHash) {
        require(makerAsset != address(0), "Invalid maker asset");
        require(takerAsset != address(0), "Invalid taker asset");
        require(makerAmount > 0, "Invalid maker amount");
        require(takerAmount > 0, "Invalid taker amount");
        require(expiration > block.timestamp, "Invalid expiration");

        // Generate order hash
        orderHash = keccak256(
            abi.encodePacked(
                msg.sender,
                makerAsset,
                takerAsset,
                makerAmount,
                takerAmount,
                expiration,
                block.chainid
            )
        );

        // Check if order already exists
        require(
            orders[orderHash].orderHash == bytes32(0),
            "Order already exists"
        );

        // Transfer maker tokens to contract
        IERC20(makerAsset).safeTransferFrom(
            msg.sender,
            address(this),
            makerAmount
        );

        // Create order
        orders[orderHash] = LimitOrder({
            maker: msg.sender,
            makerAsset: makerAsset,
            takerAsset: takerAsset,
            makerAmount: makerAmount,
            takerAmount: takerAmount,
            expiration: expiration,
            orderHash: orderHash,
            isActive: true,
            isFilled: false,
            isCancelled: false,
            createdAt: block.timestamp,
            filledAt: 0
        });

        // Update user orders
        userOrders[msg.sender].push(orderHash);
        userOrderCount[msg.sender]++;

        // Update global stats
        allOrderHashes.push(orderHash);
        totalOrders++;
        totalVolume += makerAmount;

        emit OrderCreated(
            orderHash,
            msg.sender,
            makerAsset,
            takerAsset,
            makerAmount,
            takerAmount,
            expiration
        );
    }

    /**
     * @dev Fill a limit order using 1inch protocol
     */
    function fillOrder(
        bytes32 orderHash,
        bytes calldata signature,
        bytes calldata interaction
    )
        external
        payable
        nonReentrant
        orderExists(orderHash)
        orderActive(orderHash)
        orderNotExpired(orderHash)
    {
        LimitOrder storage order = orders[orderHash];
        require(!order.isFilled, "Order already filled");
        require(!order.isCancelled, "Order cancelled");
        require(msg.sender != order.maker, "Cannot fill own order");

        // Transfer taker tokens to contract
        IERC20(order.takerAsset).safeTransferFrom(
            msg.sender,
            address(this),
            order.takerAmount
        );

        uint256 gasBefore = gasleft();

        // Execute the trade on 1inch
        uint256 result = limitOrderProtocol.fillOrder{value: msg.value}(
            abi.encode(order),
            signature,
            interaction
        );

        uint256 gasUsed = gasBefore - gasleft();

        // Update order status
        order.isFilled = true;
        order.isActive = false;
        order.filledAt = block.timestamp;

        // Transfer tokens
        IERC20(order.makerAsset).safeTransfer(msg.sender, order.makerAmount);
        IERC20(order.takerAsset).safeTransfer(order.maker, order.takerAmount);

        emit OrderFilled(orderHash, msg.sender, order.makerAmount, gasUsed);
    }

    /**
     * @dev Cancel a limit order
     */
    function cancelOrder(
        bytes32 orderHash
    )
        external
        nonReentrant
        orderExists(orderHash)
        onlyOrderMaker(orderHash)
        orderActive(orderHash)
    {
        LimitOrder storage order = orders[orderHash];
        require(!order.isFilled, "Order already filled");
        require(!order.isCancelled, "Order already cancelled");

        // Update order status
        order.isCancelled = true;
        order.isActive = false;

        // Return maker tokens
        IERC20(order.makerAsset).safeTransfer(order.maker, order.makerAmount);

        emit OrderCancelled(orderHash, order.maker);
    }

    /**
     * @dev Expire orders that have passed their expiration time
     */
    function expireOrder(
        bytes32 orderHash
    ) external nonReentrant orderExists(orderHash) orderActive(orderHash) {
        LimitOrder storage order = orders[orderHash];
        require(order.expiration <= block.timestamp, "Order not expired");
        require(!order.isFilled, "Order already filled");
        require(!order.isCancelled, "Order already cancelled");

        // Update order status
        order.isActive = false;

        // Return maker tokens
        IERC20(order.makerAsset).safeTransfer(order.maker, order.makerAmount);

        emit OrderExpired(orderHash, order.maker);
    }

    // === VIEW FUNCTIONS ===

    /**
     * @dev Get order details
     */
    function getOrder(
        bytes32 orderHash
    ) external view returns (LimitOrder memory) {
        return orders[orderHash];
    }

    /**
     * @dev Get user orders
     */
    function getUserOrders(
        address user
    ) external view returns (bytes32[] memory) {
        return userOrders[user];
    }

    /**
     * @dev Get user order count
     */
    function getUserOrderCount(address user) external view returns (uint256) {
        return userOrderCount[user];
    }

    /**
     * @dev Get all order hashes
     */
    function getAllOrderHashes() external view returns (bytes32[] memory) {
        return allOrderHashes;
    }

    /**
     * @dev Get order statistics
     */
    function getOrderStats() external view returns (OrderStats memory) {
        uint256 active = 0;
        uint256 filled = 0;
        uint256 cancelled = 0;

        for (uint256 i = 0; i < allOrderHashes.length; i++) {
            LimitOrder storage order = orders[allOrderHashes[i]];
            if (order.isActive) active++;
            else if (order.isFilled) filled++;
            else if (order.isCancelled) cancelled++;
        }

        return
            OrderStats({
                totalOrders: totalOrders,
                activeOrders: active,
                filledOrders: filled,
                cancelledOrders: cancelled,
                totalVolume: totalVolume
            });
    }

    /**
     * @dev Check if order can be filled
     */
    function canFillOrder(bytes32 orderHash) external view returns (bool) {
        LimitOrder storage order = orders[orderHash];
        return (order.orderHash != bytes32(0) &&
            order.isActive &&
            !order.isFilled &&
            !order.isCancelled &&
            order.expiration > block.timestamp);
    }

    // === ADMIN FUNCTIONS ===

    /**
     * @dev Update limit order protocol address
     */
    function updateLimitOrderProtocol(address _newProtocol) external onlyOwner {
        require(_newProtocol != address(0), "Invalid protocol address");
        limitOrderProtocol = ILimitOrderProtocol(_newProtocol);
    }

    /**
     * @dev Emergency withdraw tokens
     */
    function emergencyWithdraw(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");

        IERC20(token).safeTransfer(owner(), balance);
    }

    // === RECEIVE FUNCTION ===
    receive() external payable {
        // Allow contract to receive ETH for gas fees
    }
}
