const BVTToken = artifacts.require("BVTVotingToken.sol");

module.exports = function (deployer, network) {
  deployer.then(async () => {

    if (network == "development") {
      var instance = await deployer.deploy(BVTToken, "0xff", 3);
      console.log("BVTToken Address: " + instance.address);
    } else {
      console.log("Network is not yet configured. Network:", network);
    }
  });
};