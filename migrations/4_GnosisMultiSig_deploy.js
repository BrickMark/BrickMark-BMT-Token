const MultiSigWallet = artifacts.require("gnosis_test/MultiSigWallet.sol");

module.exports = function (deployer, network, accounts) {
  deployer.then(async () => {

    if (network == "development") {
      var instance = await deployer.deploy(MultiSigWallet, [accounts[1], accounts[2]], 1);
      console.log("Gnosis MultiSig Address: " + instance.address);
    }
  });
};