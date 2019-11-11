pragma solidity ^0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";


contract BVTState is ERC20Detailed, ERC20Mintable {

    enum State {init, voting, end}
    
    uint256 internal _endTime = 0;

    constructor() internal 
        ERC20Detailed("BrickMarkVotingToken", "BVT", 1)
        ERC20Mintable() { }

    modifier whenInit() {
        require(getState() == State.init, "BVTState: not init state");
        _;
    }

    modifier whenVoting() {
        require(getState() == State.voting, "BVTState: not voting state");
        _;
    }

    modifier whenEnd() {
        require(getState() == State.end, "BVTState: not end state");
        _;
    }

    function getState() public view returns (State) {
        if(_endTime == 0) return State.init;
        if(_endTime > block.timestamp) return State.voting;
        if(_endTime < block.timestamp && _endTime > 0) return State.end;
        revert("Unexpected error. Invalid state.");
    }

    function getEndTime() public view returns (uint256) {
        return _endTime;
    }

    function startVoting(uint256 endTime) public whenInit {
        require(endTime > block.timestamp, "End time not in future");
        _endTime = endTime;
    }
}