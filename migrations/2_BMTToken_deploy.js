const BMTToken = artifacts.require("BMTToken.sol");

module.exports = function (deployer, network) {
  deployer.then(async () => {

    if (network == "development") {
      var instance = await deployer.deploy(BMTToken);
      console.log("BMTToken Address: " + instance.address);
    } else {
      console.log("Network is not yet configured. Network:", network);
    }
  });
};