pragma solidity 0.5.12;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./BMTFreezable.sol";

contract BMTVested is BMTFreezable {
    uint256 private constant _MAX_VESTING_DURATION = 1095 days; //3 years: 3 * 365
    //address is the vested tokenholder
    //uint256 is the unixtime (epoche in seconds) the tokens are vested
    mapping(address => uint256) private _vestedEndTimeMap;
    mapping(address => uint256) private _vestedAmountsMap;

    constructor() internal ERC20() {}

    /// @notice Check if an address is vested or not
    /// @param account The specific address to check
    /// @return true if account is vested, otherwise false
    function isVested(address account) public view returns (bool) {
        return
            _vestedEndTimeMap[account] != 0 &&
            _vestedEndTimeMap[account] > block.timestamp;
    }

    /// @notice Reads the vesting end time
    /// @param account The specific address to check
    /// @return 0: In case no vesting or vesting expired. Otherwise the Unix timestamp in seconds until the
    /// vesting remains
    function vestingEndTime(address account) public view returns (uint256) {
        return _vestedEndTimeMap[account];
    }

    /// @notice Checks the vested amount of tokens which are vested
    /// @param account The specific address to check
    /// @return the number of vested tokens
    function vestedAmount(address account) public view returns (uint256) {
        if (isVested(account)) {
            return _vestedAmountsMap[account];
        } else {
            return 0;
        }
    }

    /// @notice Calculates the number of spendable tokens. Vested token holders are allowed to spend their dividend.
    ///         For non vested token holders it represents the `balanceOf()` function
    /// @param account The specific address to check
    /// @return the number of spendable tokens at the moment
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
        require(isVested(account) == false, "Cant mint to vested address");
        require(super.balanceOf(account) == 0, "vesting req 0 balance");
        require(endTime >= block.timestamp, "Invalid time");
        require(amount > 0, "amount to vest too small");
        require(
            endTime < block.timestamp + _MAX_VESTING_DURATION,
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
