pragma solidity ^0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract BMTERC20Vested is ERC20 {

    uint256 private _maxVestingDuration = 365 days;
    //address is the vested tokenholder
    //uint256 is the unixtime (epoche in seconds) the tokens are vested
    mapping (address => uint256) private _vestedMap;

    event VestedAccount(address account, uint256 endTime);

    constructor()
    public 
    ERC20() {}
    
    function isVested(address account) public view returns (bool) {
        return _vestedMap[account] != 0 && _vestedMap[account] < block.timestamp;
    }

    function vestingEndTime(address account) public view returns (uint256) {
        return _vestedMap[account];
    }

    function _addVested(address account, uint256 endTime) internal {
        require(isVested(account) == false, "account already vested");
        require(endTime >= block.timestamp, "Vesting endtime can not be in the past");
        require(endTime < block.timestamp + _maxVestingDuration, "Vesting exceeds duration");
        
        _vestedMap[account] = endTime;

        emit VestedAccount(account, endTime);
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(isVested(sender) == false, "Transfer not allowed. Vested sender.");
        require(isVested(recipient) == false, "Transfer not allowed. Vested recipient.");

        super._transfer(sender, recipient, amount);
    }
}