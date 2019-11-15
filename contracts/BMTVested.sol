pragma solidity ^0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./BMTFreezable.sol";

contract BMTVested is BMTFreezable {
    uint256 private _maxVestingDuration = 1095 days; //3 years: 3 * 365
    //address is the vested tokenholder
    //uint256 is the unixtime (epoche in seconds) the tokens are vested
    mapping(address => uint256) private _vestedEndTimeMap;
    mapping(address => uint256) private _vestedAmountsMap;

    constructor() internal ERC20() {}

    function isVested(address account) public view returns (bool) {
        return
            _vestedEndTimeMap[account] != 0 &&
            _vestedEndTimeMap[account] > block.timestamp;
    }

    function vestingEndTime(address account) public view returns (uint256) {
        return _vestedEndTimeMap[account];
    }

    function vestedAmount(address account) public view returns (uint256) {
        if (isVested(account)) {
            return _vestedAmountsMap[account];
        } else {
            return 0;
        }
    }

    function spendableAmount(address account) public view returns (uint256) {
        if (isVested(account)) {
            uint256 balance = super.balanceOf(account);
            return balance.sub(_vestedAmountsMap[account]);
        } else {
            return super.balanceOf(account);
        }
    }

    function _addVested(address account, uint256 amount, uint256 endTime)
        internal
    {
        require(isVested(account) == false, "account already vested");
        require(endTime >= block.timestamp, "Invalid time");
        require(amount > 0, "amount to vest too small");
        require(
            endTime < block.timestamp + _maxVestingDuration,
            "exceeds duration"
        );

        _vestedEndTimeMap[account] = endTime;
        _vestedAmountsMap[account] = amount;
    }

    function _transfer(address sender, address recipient, uint256 amount)
        internal
    {
        //require(isVested(sender) == false, "Transfer not allowed. Vested sender.");
        require(isVested(recipient) == false, "Vested recipient");
        if (isVested(sender)) {
            require(spendableAmount(sender) >= amount, "Tokens vested");
        }

        super._transfer(sender, recipient, amount);
    }
}
