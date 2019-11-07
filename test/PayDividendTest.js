const BMTToken = artifacts.require("./BMTToken.sol");

contract("BMTToken PayDividendTest test", async accounts => {

    const BrickMark = accounts[0];
    const alice = accounts[5];
    const bob = accounts[6];
    const carol = accounts[7];

    it("PayDividend 1", async () => {
        let instance = await BMTToken.new({from: BrickMark});
        let recipients = [alice, bob, carol];
        let amounts = ["1000000000000000000", "2000000000000000000", "3000000000000000000"]
        
        let result = await instance.payDividend(recipients, amounts, "First Dividend");

        for(var i=0; i<recipients.length; i++) {
            var balance = await instance.balanceOf.call(recipients[i]);
            assert.equal(balance.toString(), amounts[i]);

            var event1 = result.receipt.logs[i * 2];
            var event2 = result.receipt.logs[(i * 2) + 1];

            assert.equal(event1.event, "Transfer");
            assert.equal(event1.args.from, "0x0000000000000000000000000000000000000000");
            assert.equal(event1.args.to, recipients[i]);

            assert.equal(event2.event, "DividendPayed");
            assert.equal(event2.args.account, recipients[i]);
            assert.equal(event2.args.amount, amounts[i]);
            assert.equal(event2.args.message, "First Dividend");

        }
    });
});