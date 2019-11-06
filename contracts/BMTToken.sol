pragma solidity ^0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "./BMTERC20Vested.sol";

contract BMTToken is ERC20Detailed, BMTERC20Vested, ERC20Mintable {

    constructor()
        ERC20Mintable()
        ERC20Detailed("BrickMarkToken", "BMT", 18)
        BMTERC20Vested()
        public
    {}
}