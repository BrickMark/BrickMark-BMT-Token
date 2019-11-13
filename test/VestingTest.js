const helper = require('ganache-time-traveler');
const BMTToken = artifacts.require("./BMTToken.sol");

contract("BMTToken Vesting test", async accounts => {

    const BrickMark = accounts[0];
    const alice = accounts[5];
    const bob = accounts[6];
    const carol = accounts[7];

    const SECONDS_IN_DAY = 86400;

    beforeEach(async () => {
        let snapShot = await helper.takeSnapshot();
        snapshotId = snapShot['result'];
    });

    afterEach(async () => {
        await helper.revertToSnapshot(snapshotId);
    });

    it("Vested Transfer Exception Test", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let recipients = [alice];
        let amounts = ["1000000000000000000"]

        let now = Math.trunc(new Date().getTime() / 1000);
        console.log("time now: " + now);
        let lockTimes = [now + SECONDS_IN_DAY]

        await instance.mintBatchVested(recipients, amounts, lockTimes);
        let vestedAmount = await instance.vestedAmount.call(recipients[0]);
        assert.equal(vestedAmount.toString(), amounts[0]);

        try {
            await instance.transfer(bob, amounts[0], { from: alice });
            assert.fail("VM Exception expected");
        } catch (ex) {
            assert.equal(ex.reason, "Not allowed to spend vested amount");
        }

        await helper.advanceTimeAndBlock(SECONDS_IN_DAY);

        vestedAmount = await instance.vestedAmount.call(recipients[0]);
        assert.equal(vestedAmount, 0);

        await instance.transfer(bob, amounts[0], { from: alice });

        var balance = await instance.balanceOf.call(alice);
        assert.equal(balance, 0);

        balance = await instance.balanceOf.call(bob);
        assert.equal(balance.toString(), amounts[0])
    });

    it("Vested Transfer Exception Test", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let recipients = [alice];
        let amounts = ["1000000000000000000"]

        let now = Math.trunc(new Date().getTime() / 1000);
        console.log("time now: " + now);
        let lockTimes = [now + SECONDS_IN_DAY]

        let result = await instance.mintBatchVested(recipients, amounts, lockTimes);

        try {
            await instance.transfer(bob, amounts[0], { from: alice });
            assert.fail("VM Exception expected");
        } catch (ex) {
            assert.equal(ex.reason, "Not allowed to spend vested amount");
        }

        await helper.advanceTimeAndBlock(SECONDS_IN_DAY);
        await instance.transfer(bob, amounts[0], { from: alice });

        var balance = await instance.balanceOf.call(alice);
        assert.equal(balance, 0);

        balance = await instance.balanceOf.call(bob);
        assert.equal(balance.toString(), amounts[0])
    });

    it("Vested Transfer or to vested account should fail", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amounts = ["1000000000000000000"]

        let now = Math.trunc(new Date().getTime() / 1000);
        console.log("time now: " + now);
        let dayInSeconds = 60 * 60 * 24;
        let lockTimes = [now + dayInSeconds]

        await instance.mintBatchVested([alice], amounts, lockTimes);
        await instance.mint(bob, amounts[0]);

        try {
            await instance.transfer(alice, amounts[0], { from: bob });
            assert.fail("VM Exception expected");
        } catch (ex) {
            assert.equal(ex.reason, "Transfer not allowed. Vested recipient.");
        }

    });
});