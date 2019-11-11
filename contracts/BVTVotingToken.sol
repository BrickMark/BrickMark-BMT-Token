pragma solidity ^0.5.8;


import "./BVTMintable.sol";


contract BVTVotingToken is BVTMintable {

    // Number of voting options. 
    // E.g. if value is 3: Voters can give a vote for the option: 1, 2 or 3
    uint8 private _votingOptions; 
    bytes private _hashedVotingText;

    constructor(
        uint8 votingOptions, 
        bytes memory hashedVotingText
    ) 
    public 
    {
        _votingOptions = votingOptions;
        _hashedVotingText = hashedVotingText;
    }

    function getVotingOptions() 
        public view 
        returns (uint256) 
    {
        return _votingOptions;
    }

    modifier whenValidVotingOption(address recipient) {
        uint256 option = uint256(recipient);
        require(option > 0, "Option 0 never supported");
        require(option <= _votingOptions, "Option out of range");
        _;
    }

    function getHashedVotingText() 
        public view 
        returns (bytes memory) 
    {
        return _hashedVotingText;
    }

    function getVotes(uint8 votingOption) 
        public
        view
        returns (uint256) 
    {
        address option = address(votingOption);
        return balanceOf(option);
    }

    function vote(uint8 votingOption)
        public
        returns (bool)
    {
        address option = address(votingOption);
        return transfer(option, balanceOf(msg.sender));
    }

    function transfer(
        address recipient, 
        uint256 amount
    )
        public 
        whenVoting 
        whenValidVotingOption(recipient) 
        returns (bool) 
    {
        return super.transfer(recipient, amount);
    }

    function transferFrom(
        address sender, 
        address recipient, 
        uint256 amount
    )
        public 
        whenVoting 
        whenValidVotingOption(recipient) 
        returns (bool) 
    {
        return super.transferFrom(sender, recipient, amount);
    }
}