const truffleAssert = require('truffle-assertions');
const BMTToken = artifacts.require("./BMTToken.sol");
const time = require("../test/TimeUtil");

contract("UI-Setup Test", async accounts => {

    const bmt1 = accounts[0];
    const bmt2 = accounts[1];
    const bmt3 = accounts[2];
    const bmt4 = accounts[3];
    const tokenHolder1 = accounts[4];
    const tokenHolder2 = accounts[5];
    const tokenHolder3 = accounts[6];
    const tokenHolder4 = accounts[7];
    const vestedTokenHolder1 = accounts[8];
    const vestedTokenHolder2 = accounts[9];

    const alice = accounts[5];
    const bob = accounts[6];
    const carol = accounts[7];

    it("Setup for the Test UI", async () => {
        let instance = await BMTToken.at("0x7D586da8c71163e41cba108e6624b94B2de9EaaB", { from: bmt1 });
        let recipients = [tokenHolder1, tokenHolder2, tokenHolder3];
        let amounts = ["10000000000000000000", "2000000000000000000", "3000000000000000000"]

        await instance.mintBatch(recipients, amounts);
        await instance.mintBatchVested([vestedTokenHolder1], ["10000000000000000000"], [time.unixTimeTomorrow()]);
        await instance.payDividend([tokenHolder1], [amounts[0]], "First Dividend");
    });

});