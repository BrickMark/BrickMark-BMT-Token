pragma solidity ^0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract BVTState is ERC20Detailed, ERC20Mintable {
    enum State {init, voting, end}

    uint256 private _endTime = 0;
    uint256 private _startTime = 0;

    event VotingStarted(uint256 startTime, uint256 endTime);

    constructor()
        internal
        ERC20Detailed("BrickMarkVotingToken", "BVT", 1)
        ERC20Mintable()
    {}

    modifier whenInit() {
        require(getState() == State.init, "BVTState: not init state");
        _;
    }

    modifier whenVoting() {
        require(getState() == State.voting, "BVTState: not voting state");
        _;
    }

    // Currently not used at all
    // modifier whenEnd() {
    //     require(getState() == State.end, "BVTState: not end state");
    //     _;
    // }

    function getState() public view returns (State) {
        if (_endTime == 0) {
            return State.init;
        } else if (block.timestamp < _endTime) {
            return State.voting;
        } else {
            return State.end;
        }
    }

    function getStartTime() public view returns (uint256) {
        return _startTime;
    }

    function getEndTime() public view returns (uint256) {
        return _endTime;
    }

    function startVoting(uint256 endTime)
        public
        whenInit
        onlyMinter
        returns (bool)
    {
        require(endTime > block.timestamp, "End time not in future");
        _startTime = block.timestamp;
        _endTime = endTime;

        emit VotingStarted(_startTime, _endTime);
        return true;
    }
}
