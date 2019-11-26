pragma solidity 0.5.12;

import "./BVTState.sol";

contract BVTMintable is BVTState {
    constructor() internal {}

    /// @notice Mints new BMT tokens. Only minters can call this function
    /// @param owners An array of recipients of the new generated tokens
    /// @param amounts A corresponding array of amounts to be assigned to the owners
    /// @return true if successful
    function mintBatch(address[] memory owners, uint256[] memory amounts)
        public
        whenInit
        onlyMinter
        returns (bool)
    {
        require(owners.length == amounts.length, "length missmatch");

        for (uint256 i = 0; i < owners.length; i++) {
            super._mint(owners[i], amounts[i]);
        }

        return true;
    }
}
