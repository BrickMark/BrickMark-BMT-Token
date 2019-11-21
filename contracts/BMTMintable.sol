pragma solidity 0.5.12;

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
