const helper = require('ganache-time-traveler');
const truffleAssert = require('truffle-assertions');
const BMTToken = artifacts.require("./BMTToken.sol");
const time = require("./TimeUtil");

contract("BMTToken Vesting test", async accounts => {

    const BrickMark = accounts[0];
    const alice = accounts[5];
    const bob = accounts[6];
    const carol = accounts[7];

    beforeEach(async () => {
        let snapShot = await helper.takeSnapshot();
        snapshotId = snapShot['result'];
    });

    afterEach(async () => {
        await helper.revertToSnapshot(snapshotId);
    });

    it("Vested - Vested tokens cant transfer", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let recipients = [alice];
        let amounts = ["1000000000000000000"]

        await instance.mintBatchVested(recipients, amounts, [time.unixTimeTomorrow()]);
        let vestedAmount = await instance.vestedAmount.call(recipients[0]);
        assert.equal(vestedAmount.toString(), amounts[0]);

        await truffleAssert.reverts(
            instance.transfer(bob, amounts[0], { from: alice }),
            "Tokens vested"
        );

        await helper.advanceTimeAndBlock(time.ONE_DAY_IN_SECONDS);

        vestedAmount = await instance.vestedAmount.call(recipients[0]);
        assert.equal(vestedAmount.toString(), "0");

        await instance.transfer(bob, amounts[0], { from: alice });

        var balance = await instance.balanceOf.call(alice);
        assert.equal(balance, 0);

        balance = await instance.balanceOf.call(bob);
        assert.equal(balance.toString(), amounts[0])
    });

    it("Vested - Account can not transfer tokens", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let recipients = [alice];
        let amounts = ["1000000000000000000"]

        await instance.mintBatchVested(recipients, amounts, [time.unixTimeTomorrow()]);

        await truffleAssert.reverts(
            instance.transfer(bob, amounts[0], { from: alice }),
            "Tokens vested"
        );

        await helper.advanceTimeAndBlock(time.ONE_DAY_IN_SECONDS);
        await instance.transfer(bob, amounts[0], { from: alice });

        var balance = await instance.balanceOf.call(alice);
        assert.equal(balance, 0);

        balance = await instance.balanceOf.call(bob);
        assert.equal(balance.toString(), amounts[0])
    });

    it("Vested - Transfer tokens to vested recipient should fail", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        await instance.mintBatch([bob], [amount]);
        await instance.mintBatchVested([alice], [amount], [time.unixTimeTomorrow()]);

        await truffleAssert.reverts(
            instance.transfer(alice, amount, { from: bob }),
            "Vested recipient"
        );
    });

    it("Vested - MintBatchVested to an address with a balance should fail", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        await instance.mintBatch([alice], [amount]);
        
        await truffleAssert.reverts(
            instance.mintBatchVested([alice], [amount], [time.unixTimeTomorrow()]),
            "vesting req 0 balance"
        );
    });

    it("Vested - MintBatchVested to Vested address should fail", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        await instance.mintBatchVested([alice], [amount], [time.unixTimeTomorrow()]);
        
        await truffleAssert.reverts(
            instance.mintBatch([alice], [amount]),
            "Cant mint to vested address"
        );
    });

    it("Vested - MintBatch to Vested address should fail", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        await instance.mintBatchVested([alice], [amount], [time.unixTimeTomorrow()]);
        
        await truffleAssert.reverts(
            instance.mintBatch([alice], [amount]),
            "Cant mint to vested address"
        );
    });

    it("Vested - MintBatchVested end time in the past", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        await truffleAssert.reverts(
            instance.mintBatchVested([alice], [amount], [time.unixTimeNow() - 1]),
            "Invalid time"
        );
    });

    it("Vested - MintBatchVested vesting 0 BMT is not allowed", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "0";

        await truffleAssert.reverts(
            instance.mintBatchVested([alice], [amount], [time.unixTimeNow()]),
            "amount to vest too small"
        );
    });

    it("Vested - MintBatchVested end time exceeds max vesting duration", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        await truffleAssert.reverts(
            instance.mintBatchVested([alice], [amount], [time.unixTimeInDays(1095)]),
            "exceeds duration"
        );
    });
});