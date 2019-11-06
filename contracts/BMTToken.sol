pragma solidity ^0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "./BMTERC20Mintable.sol";


contract BMTToken is ERC20Detailed, BMTERC20Mintable {

    constructor()
        public
        ERC20Detailed("BrickMarkToken", "BMT", 18)
        ERC20Mintable() { }
}