// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IConstrixTypes.sol";
import "./ConsistencyNFT.sol";

/**
 * @title HabitVault
 * @dev Main contract for managing habit streaks, milestones, and rewards on Verychain
 */
contract HabitVault is Ownable, ReentrancyGuard {
    IERC20 public immutable veryToken;
    ConsistencyNFT public immutable consistencyNFT;
    
    struct Milestone {
        address user;
        IConstrixTypes.HabitType habitType;
        uint16 streakDays;
        uint256 timestamp;
        bool rewarded;
    }
    
    struct UserStreak {
        uint16 currentStreak;
        uint16 longestStreak;
        uint256 lastUpdate;
    }
    
    // Mappings
    mapping(address => mapping(IConstrixTypes.HabitType => UserStreak)) public userStreaks;
    mapping(address => mapping(IConstrixTypes.HabitType => mapping(uint16 => bool))) public milestonesClaimed;
    mapping(address => bool) public authorizedBackends;
    
    // Milestone rewards (in VERY tokens with 18 decimals)
    mapping(uint16 => uint256) public milestoneRewards;
    
    // Events
    event MilestoneRecorded(address indexed user, IConstrixTypes.HabitType habitType, uint16 streakDays, uint256 reward);
    event NFTMinted(address indexed user, uint256 tokenId, IConstrixTypes.HabitType habitType, uint16 streakDays);
    event StreakProtected(address indexed user, IConstrixTypes.HabitType habitType, uint256 cost);
    event BackendAuthorized(address indexed backend, bool authorized);
    
    modifier onlyAuthorizedBackend() {
        require(authorizedBackends[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }
    
    constructor(
        address _veryToken,
        address _consistencyNFT
    ) {
        veryToken = IERC20(_veryToken);
        consistencyNFT = ConsistencyNFT(_consistencyNFT);
        
        // Initialize milestone rewards
        milestoneRewards[7] = 100 * 1e18;    // 100 VERY
        milestoneRewards[14] = 180 * 1e18;   // 180 VERY
        milestoneRewards[30] = 300 * 1e18;   // 300 VERY
        milestoneRewards[60] = 480 * 1e18;   // 480 VERY
        milestoneRewards[100] = 700 * 1e18;  // 700 VERY
        milestoneRewards[365] = 2000 * 1e18; // 2000 VERY
    }
    
    /**
     * @dev Record a milestone achievement and distribute rewards
     */
    function recordMilestone(
        address user,
        IConstrixTypes.HabitType habitType,
        uint16 streakDays
    ) external onlyAuthorizedBackend nonReentrant {
        require(user != address(0), "Invalid user address");
        require(milestoneRewards[streakDays] > 0, "Invalid milestone");
        require(!milestonesClaimed[user][habitType][streakDays], "Milestone already claimed");
        
        // Update user streak
        userStreaks[user][habitType].currentStreak = streakDays;
        if (streakDays > userStreaks[user][habitType].longestStreak) {
            userStreaks[user][habitType].longestStreak = streakDays;
        }
        userStreaks[user][habitType].lastUpdate = block.timestamp;
        
        // Mark milestone as claimed
        milestonesClaimed[user][habitType][streakDays] = true;
        
        // Calculate and distribute reward
        uint256 reward = milestoneRewards[streakDays];
        
        // Mint NFT badge
        uint256 tokenId = consistencyNFT.mintMilestoneNFT(user, habitType, streakDays);
        
        // Transfer VERY tokens
        require(veryToken.transfer(user, reward), "Reward transfer failed");
        
        emit MilestoneRecorded(user, habitType, streakDays, reward);
        emit NFTMinted(user, tokenId, habitType, streakDays);
    }
    
    /**
     * @dev Allow users to protect their streak by spending VERY tokens
     */
    function protectStreak(
        IConstrixTypes.HabitType habitType,
        uint256 cost
    ) external nonReentrant {
        require(cost > 0, "Invalid cost");
        require(userStreaks[msg.sender][habitType].currentStreak > 0, "No active streak");
        
        // Transfer VERY tokens from user (30% burned, 70% to treasury)
        require(veryToken.transferFrom(msg.sender, address(this), cost), "Payment failed");
        
        // Burn 30% of tokens (send to dead address)
        uint256 burnAmount = (cost * 30) / 100;
        require(veryToken.transfer(address(0xdead), burnAmount), "Burn failed");
        
        emit StreakProtected(msg.sender, habitType, cost);
    }
    
    /**
     * @dev Get user's streak information
     */
    function getUserStreak(
        address user,
        IConstrixTypes.HabitType habitType
    ) external view returns (UserStreak memory) {
        return userStreaks[user][habitType];
    }
    
    /**
     * @dev Check if milestone is claimed
     */
    function isMilestoneClaimed(
        address user,
        IConstrixTypes.HabitType habitType,
        uint16 streakDays
    ) external view returns (bool) {
        return milestonesClaimed[user][habitType][streakDays];
    }
    
    /**
     * @dev Authorize backend service to record milestones
     */
    function authorizeBackend(address backend, bool authorized) external onlyOwner {
        authorizedBackends[backend] = authorized;
        emit BackendAuthorized(backend, authorized);
    }
    
    /**
     * @dev Update milestone rewards (owner only)
     */
    function updateMilestoneReward(uint16 streakDays, uint256 reward) external onlyOwner {
        milestoneRewards[streakDays] = reward;
    }
    
    /**
     * @dev Emergency withdraw function (owner only)
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(veryToken.transfer(owner(), amount), "Withdraw failed");
    }
    
    /**
     * @dev Get contract's VERY token balance
     */
    function getBalance() external view returns (uint256) {
        return veryToken.balanceOf(address(this));
    }
}