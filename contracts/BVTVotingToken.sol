pragma solidity ^0.5.8;

import "./BVTMintable.sol";

contract BVTVotingToken is BVTMintable {
    // Number of voting options.
    // E.g. if value is 3: Voters can give a vote for the option: 1, 2 or 3
    uint8 private _votingOptions;
    bytes private _hashedVotingText;

    event VoteFor(uint8 indexed option, uint256 votes);

    constructor(bytes memory hashedVotingText, uint8 votingOptions) public {
        _hashedVotingText = hashedVotingText;
        _votingOptions = votingOptions;
    }

    modifier whenValidVotingOption(uint256 option) {
        // uint256 option = uint256(recipient);
        require(option > 0, "Option 0 never supported");
        require(option <= _votingOptions, "Option out of range");
        _;
    }

    function getVotingOptions() public view returns (uint256) {
        return _votingOptions;
    }

    function getHashedVotingText() public view returns (bytes memory) {
        return _hashedVotingText;
    }

    function getVotesFor(uint8 votingOption)
        public
        view
        whenValidVotingOption(votingOption)
        returns (uint256)
    {
        address option = address(votingOption);
        return super.balanceOf(option);
    }

    function vote(uint8 option)
        public
        whenVoting
        whenValidVotingOption(option)
        returns (bool)
    {
        address optionAsAddress = address(option);
        uint256 votes = super.balanceOf(msg.sender);

        emit VoteFor(option, votes);
        return super.transfer(optionAsAddress, votes);
    }

    function transfer(address recipient, uint256 amount)
        public
        whenVoting
        whenValidVotingOption(uint8(recipient))
        returns (bool)
    {
        emit VoteFor(uint8(recipient), amount);
        return super.transfer(recipient, amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount)
        public
        whenVoting
        whenValidVotingOption(uint8(recipient))
        returns (bool)
    {
        emit VoteFor(uint8(recipient), amount);
        return super.transferFrom(sender, recipient, amount);
    }
}
