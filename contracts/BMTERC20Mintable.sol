pragma solidity ^0.5.8;

import "./BMTERC20Vested.sol";


contract BMTERC20Mintable is BMTERC20Vested {


    constructor()
    BMTERC20Vested()
    public
    {}

    function mintBatch(
        address[] memory owners, 
        uint256[] memory amounts, 
        uint256[] memory vestingEndTimes
    ) 
    public 
    {
        require(owners.length == amounts.length, "owners and amounts lenght missmatch");
        require(owners.length == vestingEndTimes.length, "owners and vestingEndTime lenght missmatch");
    
        for(int i=0;i<owners.length,i++) {
            super.mint(owners[i], amounts[i]);
            if(vestingEndTimes[i] > 0) {
                super._addVested(owners[i], vestingEndTimes[i]);
            }
        }
    }
}