pragma solidity ^0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "./BMTVested.sol";


contract BMTMintable is BMTVested, ERC20Mintable {

    event AccountVested(address indexed account, uint256 endTime);
    event DividendPayed(address indexed account, uint amount, string message);
    
    constructor()
    internal
    BMTVested()
    ERC20Mintable() {}

    function mintBatch(
        address[] memory owners, 
        uint256[] memory amounts
    ) 
    public
    returns (bool)
    {
        require(owners.length == amounts.length, "owners and amounts lenght missmatch");
    
        for (uint256 i = 0; i < owners.length; i++) {
            require(mint(owners[i], amounts[i]), "mint failed 1");
        }

        return true;
    }

    function mintBatchVested(
        address[] memory owners, 
        uint256[] memory amounts, 
        uint256[] memory vestingEndTimes
    ) 
    public
    returns (bool)
    {
        require(owners.length == amounts.length, "owners and amounts lenght missmatch");
        require(owners.length == vestingEndTimes.length, "owners and vestingEndTime lenght missmatch");
    
        for (uint256 i = 0; i < owners.length; i++) {
            require(mint(owners[i], amounts[i]), "mint failed 2");
            super._addVested(owners[i], vestingEndTimes[i]);
            emit AccountVested(owners[i], vestingEndTimes[i]);
        }

        return true;
    }

    function payDividend(
        address[] memory owners, 
        uint256[] memory amounts, 
        string memory message
    ) 
    public
    returns (bool)
    {
        require(owners.length == amounts.length, "owners and amounts lenght missmatch");

        for (uint256 i = 0; i < owners.length; i++) {
            require(mint(owners[i], amounts[i]), "mint failed 3");
            emit DividendPayed(owners[i], amounts[i], message);
        }

        return true;
    }

    function mint(
        address account, 
        uint256 amount
    ) 
    public 
    whenNotFrozen 
    returns (bool) 
    {
        return super.mint(account, amount);
    }
}