pragma solidity 0.5.16;

import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";
import "./BMTVested.sol";

contract BMTMintable is BMTVested, MinterRole {
    event AccountVested(address indexed account, uint256 endTime);
    event DividendPayed(
        address indexed account,
        uint256 amount,
        string message
    );

    constructor() internal BMTVested() MinterRole() {}

    /// @notice Mints new BMT tokens. Only minters can call this function
    /// @param owners An array of recipients of the new generated tokens
    /// @param amounts A corresponding array of amounts to be assigned to the owners
    /// @return true if successfull
    function mintBatch(address[] memory owners, uint256[] memory amounts)
        public
        onlyMinter
        whenNotPaused
        returns (bool)
    {
        require(owners.length == amounts.length, "length missmatch");

        for (uint256 i = 0; i < owners.length; i++) {
            require(!super.isVested(owners[i]), "Cant mint to vested address");
            super._mint(owners[i], amounts[i]);
        }

        return true;
    }

    /// @notice Mints new BMT tokens. Only minters can call this function. Recipients will not be able to spend the
    ///         tokens until vestingEndTimes expires.
    /// @param owners An array of recipients of the new generated tokens
    /// @param amounts A corresponding array of amounts to be assigned to the owners
    /// @param vestingEndTimes A corresponding array of unix timestamps in seconds / zulu time. Tokens will be vested
    ///         until that time
    /// @return true if successful
    function mintBatchVested(
        address[] memory owners,
        uint256[] memory amounts,
        uint256[] memory vestingEndTimes
    ) public onlyMinter whenNotPaused returns (bool) {
        require(owners.length == amounts.length, "length missmatch 1");
        require(owners.length == vestingEndTimes.length, "length missmatch 2");

        for (uint256 i = 0; i < owners.length; i++) {
            //require(!super.isVested(owners[i]), "Cant mint to vested address");
            // require(super.balanceOf(owners[i]) == 0, "vesting req 0 balance");
            super._addVested(owners[i], amounts[i], vestingEndTimes[i]);
            super._mint(owners[i], amounts[i]);
            emit AccountVested(owners[i], vestingEndTimes[i]);
        }

        return true;
    }

    /// @notice Dividend payout in tokens. Creates new BMT tokens. Only minters can call this function
    /// @param owners An array of recipients of the new generated tokens
    /// @param amounts A corresponding array of amounts to be assigned to the owners
    /// @param message A message to describe the dividend payment
    /// @return true if successfull
    function payDividend(
        address[] memory owners,
        uint256[] memory amounts,
        string memory message
    ) public onlyMinter whenNotPaused returns (bool) {
        require(owners.length == amounts.length, "length missmatch");

        for (uint256 i = 0; i < owners.length; i++) {
            super._mint(owners[i], amounts[i]);
            emit DividendPayed(owners[i], amounts[i], message);
        }

        return true;
    }
}
