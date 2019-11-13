pragma solidity ^0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "./BMTMintable.sol";

contract BMTToken is ERC20Detailed, BMTMintable {
    constructor()
        public
        ERC20Detailed("BrickMarkToken", "BMT", 18)
        ERC20Mintable()
    {}
}
