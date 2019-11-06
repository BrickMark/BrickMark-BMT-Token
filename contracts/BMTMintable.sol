pragma solidity ^0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "./BMTVested.sol";


contract BMTMintable is BMTVested, ERC20Mintable {

    
    constructor()
    public
    BMTERC20Vested()
    ERC20Mintable() {}

    function mintBatch(
        address[] memory owners, 
        uint256[] memory amounts
    ) 
    public 
    {
        require(owners.length == amounts.length, "owners and amounts lenght missmatch");
    
        for (uint256 i = 0; i < owners.length; i++) {
            super.mint(owners[i], amounts[i]);
        }
    }

    function mintBatchVesting(
        address[] memory owners, 
        uint256[] memory amounts, 
        uint256[] memory vestingEndTimes
    ) 
    public 
    {
        require(owners.length == vestingEndTimes.length, "owners and vestingEndTime lenght missmatch");
    
        this.mintBatch(owners, amounts);
        for (uint256 i = 0; i < owners.length; i++) {
            super._addVested(owners[i], vestingEndTimes[i]);
        }
    }
}