const BMTToken = artifacts.require("./BMTToken.sol");
const time = require("./TimeUtil")

contract("BMTToken DividendAndVestingTest test", async accounts => {

    const BrickMark = accounts[0];
    const alice = accounts[5];
    const bob = accounts[6];
    const carol = accounts[7];

    it("Mint Vested, Pay Dividend, spend dividend", async () => {
        let instance = await BMTToken.new({from: BrickMark});
        let amount = "1000000000000000000";
        
        await instance.mintBatchVested([alice], [amount], [time.unixTimeTomorrow()]);
        
        let spendable = await instance.spendableAmount.call(alice);
        let balance = await instance.balanceOf.call(alice);
        assert.equal(spendable, 0);
        assert.equal(balance.toString(), amount);

        await instance.payDividend([alice], [amount], "First Dividend");
        spendable = await instance.spendableAmount.call(alice);
        balance = await instance.balanceOf.call(alice);
        assert.equal(spendable.toString(), amount);
        assert.equal(balance.toString(), "2000000000000000000");

        await instance.transfer(bob, amount, {from: alice})
        spendable = await instance.spendableAmount.call(alice);
        balance = await instance.balanceOf.call(alice);
        assert.equal(spendable.toString(), 0);
        assert.equal(balance.toString(), amount);

        spendable = await instance.spendableAmount.call(bob);
        balance = await instance.balanceOf.call(bob);
        assert.equal(spendable.toString(), amount);
        assert.equal(balance.toString(), amount);
    });
});