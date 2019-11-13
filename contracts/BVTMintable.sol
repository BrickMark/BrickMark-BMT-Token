pragma solidity ^0.5.8;

import "./BVTState.sol";

contract BVTMintable is BVTState {
    constructor() internal {}

    function mintBatch(address[] memory owners, uint256[] memory amounts)
        public
        whenInit()
        returns (bool)
    {
        require(
            owners.length == amounts.length,
            "owners and amounts lenght missmatch"
        );

        for (uint256 i = 0; i < owners.length; i++) {
            require(mint(owners[i], amounts[i]), "mint failed 1");
        }

        return true;
    }
}
