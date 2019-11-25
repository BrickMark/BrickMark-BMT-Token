pragma solidity 0.5.12;

import "./BVTMintable.sol";

contract BVTVotingToken is BVTMintable {
    // Number of voting options
    // E.g. if value is 3: Voters can give a vote for the option: 1, 2 or 3
    uint8 private _votingOptions;
    bytes private _hashedVotingText;

    event VoteFor(uint8 indexed option, uint256 votes);

    /// @notice Constructor
    /// @param hashedVotingText A hash of the voting/ballot text
    /// @param votingOptions Number of voting options
    constructor(bytes memory hashedVotingText, uint8 votingOptions) public {
        require(votingOptions > 0, "options required");
        _hashedVotingText = hashedVotingText;
        _votingOptions = votingOptions;
    }

    modifier whenValidVotingOption(uint256 option) {
        // uint256 option = uint256(recipient);
        require(option > 0, "Option 0 never supported");
        require(option <= _votingOptions, "Option out of range");
        _;
    }

    /// @notice Returns the possible voting options
    /// @param return Number of possible voting options
    function getVotingOptions() public view returns (uint256) {
        return _votingOptions;
    }

    /// @notice Returns the hash of the voting/ballot text
    /// @param return hash
    function getHashedVotingText() public view returns (bytes memory) {
        return _hashedVotingText;
    }

    /// @notice Returns the amounts of votes for a given option
    /// @param votingOption The option to calculate the votes for
    /// @param return The actual amount of votes for the given option
    function getVotesFor(uint8 votingOption)
        public
        view
        whenValidVotingOption(votingOption)
        returns (uint256)
    {
        address option = address(votingOption);
        return super.balanceOf(option);
    }

    /// @notice Votes for a specific option. All token of the voter will be transfered to that option
    /// @param option The option vote for
    /// @param return True if successful
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

    /// @notice Votes for a specific option. The option is the recipient
    /// @param recipient The recipient represents the option to vote for.
    ///         E.g. Option 1 is represented by the address 0x0000000000000000000000000000000000000001
    /// @param amount The amount of the tokens will represents the amount of votes
    /// @param return True if successful
    function transfer(address recipient, uint256 amount)
        public
        whenVoting
        whenValidVotingOption(uint8(recipient))
        returns (bool)
    {
        emit VoteFor(uint8(recipient), amount);
        return super.transfer(recipient, amount);
    }

    /// @notice Votes for a specific option. The option is the recipient
    /// @param sender The voters origin
    /// @param recipient The recipient represents the option to vote for.
    ///         E.g. Option 1 is represented by the address 0x0000000000000000000000000000000000000001
    /// @param amount The amount of the tokens will represents the amount of votes
    /// @param return True if successful
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
