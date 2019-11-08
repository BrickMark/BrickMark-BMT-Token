pragma solidity ^0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol";


contract BMTFreezable is ERC20Pausable {

    bool private _frozen;

    event Frozen(address indexed sender);

    constructor() internal {
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
}