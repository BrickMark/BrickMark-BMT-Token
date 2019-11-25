pragma solidity 0.5.12;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol";

contract BMTFreezable is ERC20Pausable {
    bool private _frozen;

    event Frozen(address account);

    constructor() internal ERC20Pausable() {
        _frozen = false;
    }

    /// @notice Checks if the smart contract is frozen.
    /// @param return true if frozen
    function isFrozen() public view returns (bool) {
        return _frozen;
    }

    modifier whenNotFrozen() {
        require(!_frozen, "BMTFreezable: frozen");
        _;
    }

    /// @notice Freeze this contract. Has to be paused in advance. Protected by the pauser role
    /// @param return true when freeze succeed.
    function freeze()
        public
        onlyPauser
        whenPaused
        whenNotFrozen
        returns (bool)
    {
        _frozen = true;
        emit Frozen(_msgSender());
        return true;
    }

    function unpause() public onlyPauser whenPaused whenNotFrozen {
        super.unpause();
    }

    // Not required as covered by pausable itself.
    // function transfer(address recipient, uint256 amount) public whenNotFrozen returns (bool) {
    //     return super.transfer(recipient, amount);
    // }

    // function transferFrom(address sender, address recipient, uint256 amount) public whenNotFrozen returns (bool) {
    //     return super.transferFrom(sender, recipient, amount);
    // }

    // function mint(address account, uint256 amount)
    //     public
    //     whenNotFrozen
    //     returns (bool)
    // {
    //     return super.mint(account, amount);
    // }

}
