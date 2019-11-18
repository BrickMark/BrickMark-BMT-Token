const helper = require('ganache-time-traveler');
const truffleAssert = require('truffle-assertions');
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
        let lockTimes = [now + SECONDS_IN_DAY]

        await instance.mintBatchVested(recipients, amounts, lockTimes);
        let vestedAmount = await instance.vestedAmount.call(recipients[0]);
        assert.equal(vestedAmount.toString(), amounts[0]);

        await truffleAssert.reverts(
            instance.transfer(bob, amounts[0], { from: alice }),
            "Tokens vested"
        );

        await helper.advanceTimeAndBlock(SECONDS_IN_DAY);

        vestedAmount = await instance.vestedAmount.call(recipients[0]);
        assert.equal(vestedAmount, 0);

        await instance.transfer(bob, amounts[0], { from: alice });

        var balance = await instance.balanceOf.call(alice);
        assert.equal(balance, 0);

        balance = await instance.balanceOf.call(bob);
        assert.equal(balance.toString(), amounts[0])
    });

    it("Vested Account can not transfer tokens", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let recipients = [alice];
        let amounts = ["1000000000000000000"]

        let now = Math.trunc(new Date().getTime() / 1000);
        let lockTimes = [now + SECONDS_IN_DAY]

        await instance.mintBatchVested(recipients, amounts, lockTimes);

        await truffleAssert.reverts(
            instance.transfer(bob, amounts[0], { from: alice }),
            "Tokens vested"
        );

        await helper.advanceTimeAndBlock(SECONDS_IN_DAY);
        await instance.transfer(bob, amounts[0], { from: alice });

        var balance = await instance.balanceOf.call(alice);
        assert.equal(balance, 0);

        balance = await instance.balanceOf.call(bob);
        assert.equal(balance.toString(), amounts[0])
    });

    it("Transfer tokens to vested recipient should fail", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amounts = ["1000000000000000000"]

        let now = Math.trunc(new Date().getTime() / 1000);
        let dayInSeconds = 60 * 60 * 24;
        let lockTimes = [now + dayInSeconds]
        await instance.mintBatch([bob], amounts);
        await instance.mintBatchVested([alice], amounts, lockTimes);

        await truffleAssert.reverts(
            instance.transfer(alice, amounts[0], { from: bob }),
            "Vested recipient"
        );
    });

    it("MintBatchVested to an address with a balance should fail", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        let now = Math.trunc(new Date().getTime() / 1000);
        let dayInSeconds = 60 * 60 * 24;
        let lockTime = now + dayInSeconds

        await instance.mintBatch([alice], [amount]);
        
        await truffleAssert.reverts(
            instance.mintBatchVested([alice], [amount], [lockTime]),
            "vesting req 0 balance"
        );
    });

    it("MintBatchVested to Vested address should fail", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        let now = Math.trunc(new Date().getTime() / 1000);
        let dayInSeconds = 60 * 60 * 24;
        let lockTime = now + dayInSeconds

        await instance.mintBatchVested([alice], [amount], [lockTime]);
        
        await truffleAssert.reverts(
            instance.mintBatch([alice], [amount]),
            "Cant mint to vested address"
        );
    });

    it("MintBatch to Vested address should fail", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        let now = Math.trunc(new Date().getTime() / 1000);
        let dayInSeconds = 60 * 60 * 24;
        let lockTime = now + dayInSeconds

        await instance.mintBatchVested([alice], [amount], [lockTime]);
        
        await truffleAssert.reverts(
            instance.mintBatch([alice], [amount]),
            "Cant mint to vested address"
        );
    });

    it("MintBatchVested end time in the past", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        let now = Math.trunc(new Date().getTime() / 1000);
        let lockTime = now - 1;
        
        await truffleAssert.reverts(
            instance.mintBatchVested([alice], [amount], [lockTime]),
            "Invalid time"
        );
    });

    it("MintBatchVested vesting 0 BMT is not allowed", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "0";

        let lockTime = Math.trunc(new Date().getTime() / 1000);
        
        await truffleAssert.reverts(
            instance.mintBatchVested([alice], [amount], [lockTime]),
            "amount to vest too small"
        );
    });

    it("MintBatchVested end time exceeds max vesting duration", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        let now = Math.trunc(new Date().getTime() / 1000);
        let dayInSeconds = 60 * 60 * 24;
        let lockTime = now + (1095 * dayInSeconds);
        
        await truffleAssert.reverts(
            instance.mintBatchVested([alice], [amount], [lockTime]),
            "exceeds duration"
        );
    });
});