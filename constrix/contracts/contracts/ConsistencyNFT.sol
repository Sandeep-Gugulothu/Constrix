// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./IConstrixTypes.sol";

/**
 * @title ConsistencyNFT
 * @dev Soulbound NFTs representing habit milestones and achievements
 */
contract ConsistencyNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    
    struct Badge {
        address owner;
        IConstrixTypes.HabitType habitType;
        uint16 streakDays;
        uint256 timestamp;
        bool soulbound;
    }
    
    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => Badge) public badges;
    mapping(address => bool) public authorizedMinters;
    
    string private _baseTokenURI;
    
    event BadgeMinted(address indexed to, uint256 indexed tokenId, IConstrixTypes.HabitType habitType, uint16 streakDays);
    event MinterAuthorized(address indexed minter, bool authorized);
    
    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }
    
    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) {
        _baseTokenURI = baseTokenURI;
    }
    
    /**
     * @dev Mint a milestone NFT badge
     */
    function mintMilestoneNFT(
        address to,
        IConstrixTypes.HabitType habitType,
        uint16 streakDays
    ) external onlyAuthorizedMinter returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(streakDays > 0, "Invalid milestone days");
        
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        // Create badge metadata
        badges[tokenId] = Badge({
            owner: to,
            habitType: habitType,
            streakDays: streakDays,
            timestamp: block.timestamp,
            soulbound: true
        });
        
        _safeMint(to, tokenId);
        
        emit BadgeMinted(to, tokenId, habitType, streakDays);
        return tokenId;
    }
    
    /**
     * @dev Override transfer functions to make tokens soulbound
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        // Allow minting (from == address(0)) and burning (to == address(0))
        if (from != address(0) && to != address(0)) {
            require(!badges[tokenId].soulbound, "Soulbound token cannot be transferred");
        }
    }
    
    /**
     * @dev Get badge information
     */
    function getBadge(uint256 tokenId) external view returns (Badge memory) {
        require(_exists(tokenId), "Badge does not exist");
        return badges[tokenId];
    }
    
    /**
     * @dev Get all badges owned by an address
     */
    function getBadgesOf(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](balance);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= _tokenIdCounter.current(); i++) {
            if (_exists(i) && ownerOf(i) == owner) {
                tokenIds[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Generate token URI with metadata
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        
        Badge memory badge = badges[tokenId];
        
        // Create JSON metadata
        string memory habitName = badge.habitType == IConstrixTypes.HabitType.STUDY ? "Study" : "Fitness";
        string memory json = string(abi.encodePacked(
            '{"name": "',
            habitName,
            ' Streak Badge - ',
            Strings.toString(badge.streakDays),
            ' Days",',
            '"description": "Soulbound NFT representing a ',
            Strings.toString(badge.streakDays),
            '-day ',
            habitName,
            ' streak achievement on Constrix",',
            '"image": "',
            _baseTokenURI,
            habitName,
            '_',
            Strings.toString(badge.streakDays),
            '.png",',
            '"attributes": [',
            '{"trait_type": "Habit Type", "value": "',
            habitName,
            '"},',
            '{"trait_type": "Streak Days", "value": ',
            Strings.toString(badge.streakDays),
            '},',
            '{"trait_type": "Achievement Date", "value": ',
            Strings.toString(badge.timestamp),
            '},',
            '{"trait_type": "Soulbound", "value": "true"}',
            ']}'
        ));
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            _base64Encode(bytes(json))
        ));
    }
    
    /**
     * @dev Authorize minter address
     */
    function authorizeMinter(address minter, bool authorized) external onlyOwner {
        authorizedMinters[minter] = authorized;
        emit MinterAuthorized(minter, authorized);
    }
    
    /**
     * @dev Update base URI for metadata
     */
    function setBaseURI(string memory baseTokenURI) external onlyOwner {
        _baseTokenURI = baseTokenURI;
    }
    
    /**
     * @dev Get total number of minted tokens
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    /**
     * @dev Base64 encoding function
     */
    function _base64Encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";
        
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        string memory result = new string(4 * ((data.length + 2) / 3));
        
        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)
            
            for {
                let dataPtr := data
                let endPtr := add(dataPtr, mload(data))
            } lt(dataPtr, endPtr) {
                
            } {
                dataPtr := add(dataPtr, 3)
                let input := mload(dataPtr)
                
                mstore8(resultPtr, mload(add(tablePtr, and(shr(18, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(6, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(input, 0x3F))))
                resultPtr := add(resultPtr, 1)
            }
            
            switch mod(mload(data), 3)
            case 1 {
                mstore8(sub(resultPtr, 1), 0x3d)
                mstore8(sub(resultPtr, 2), 0x3d)
            }
            case 2 {
                mstore8(sub(resultPtr, 1), 0x3d)
            }
        }
        
        return result;
    }
}