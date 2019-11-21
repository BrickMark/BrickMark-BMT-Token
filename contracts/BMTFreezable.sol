pragma solidity ^0.5.12;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol";

contract BMTFreezable is ERC20Pausable {
    bool private _frozen;

    event Frozen(address indexed sender);

    constructor() internal ERC20Pausable() {
        _frozen = false;
    }

    function isFrozen() public view returns (bool) {
        return _frozen;
    }

    modifier whenNotFrozen() {
        require(!_frozen, "BMTFreezable: frozen");
        _;
    }

    // Freeze is only possible when already paused
    function freeze() public onlyPauser whenPaused whenNotFrozen {
        _frozen = true;
        emit Frozen(_msgSender());
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
