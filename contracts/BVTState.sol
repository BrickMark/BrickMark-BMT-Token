pragma solidity 0.5.12;

import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract BVTState is ERC20, ERC20Detailed, MinterRole {
    enum State {init, voting, end}

    uint256 private constant _MAX_VOTING_DURATION = 186 days; //6 months. 6*31

    uint256 private _endTime = 0;
    uint256 private _startTime = 0;

    event VotingStarted(uint256 startTime, uint256 endTime);

    constructor() internal ERC20Detailed("BrickMarkVotingToken", "BVT", 1) {}

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

    /// @notice Get the current state of the voting smart contract
    /// @return 0: init-state, 1: voting-state, 2: end-state
    function getState() public view returns (State) {
        if (_endTime == 0) {
            return State.init;
        } else if (block.timestamp < _endTime) {
            return State.voting;
        } else {
            return State.end;
        }
    }

    /// @notice Get the start time. Unix timestamp in seconds. Only set when state is NOT init
    /// @return 0: Voting not yet started. return > 0: Unix Timestamp in seconds when the vote started
    function getStartTime() public view returns (uint256) {
        return _startTime;
    }

    /// @notice Get the end time when the voting ends (or ended). Unix timestamp in seconds. Only set when state is
    ///         NOT init
    /// @return 0: Voting not yet started. return > 0: Unix Timestamp in seconds when the vote ends
    function getEndTime() public view returns (uint256) {
        return _endTime;
    }

    /// @notice Starts the voting. Minter Role.
    /// @param endTime The unix timestamp in seconds. At that time the voting will end.
    /// @return true if successful
    function startVoting(uint256 endTime)
        public
        whenInit
        onlyMinter
        returns (bool)
    {
        require(endTime > block.timestamp, "End time not in future");
        require(endTime < block.timestamp + _MAX_VOTING_DURATION, "Too long");
        require(totalSupply() > 0, "No voting tokens");

        _startTime = block.timestamp;
        _endTime = endTime;

        emit VotingStarted(_startTime, _endTime);
        return true;
    }

    /// @notice Aborts the voting. Minter Role. Voting can only be aborted  in init state. This will self destruct the
    ///         voting smart contract
    /// @return true if successful
    function abortVoting() public whenInit onlyMinter returns (bool) {
        selfdestruct(msg.sender);
    }
}
