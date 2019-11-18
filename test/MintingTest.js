const truffleAssert = require('truffle-assertions');
const BMTToken = artifacts.require("./BMTToken.sol");

contract("BMTToken Minting test", async accounts => {

    const BrickMark = accounts[0];
    const alice = accounts[5];
    const bob = accounts[6];
    const carol = accounts[7];

    it("mintBatch - happy case", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let recipients = [alice, bob, carol];
        let amounts = ["1000000000000000000", "2000000000000000000", "3000000000000000000"]

        await instance.mintBatch(recipients, amounts);

        for (var i = 0; i < recipients.length; i++) {
            var balance = await instance.balanceOf.call(recipients[i]);
            assert.equal(balance.toString(), amounts[i]);
        }
    });

    it("mintBatchVested - happy case", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let recipients = [alice, bob, carol];
        let amounts = ["1000000000000000000", "2000000000000000000", "3000000000000000000"]

        let now = Math.trunc(new Date().getTime() / 1000);
        let day = 60 * 60 * 24;
        let lockTimes = [now + day, now + (2 * day), now + (3 * day)]

        await instance.mintBatchVested(recipients, amounts, lockTimes);

        for (var i = 0; i < recipients.length; i++) {
            var balance = await instance.balanceOf.call(recipients[i]);
            assert.equal(balance.toString(), amounts[i]);

            var isVested = await instance.isVested.call(recipients[i]);
            assert.equal(isVested, true);

            var lockTime = await instance.vestingEndTime.call(recipients[i]);
            assert.equal(lockTime, lockTimes[i]);
        }
    });

    it("mintBatch - length missmatch", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let recipients = [alice, bob, carol];
        let amounts = ["1000000000000000000", "2000000000000000000"]

        await truffleAssert.reverts(
            instance.mintBatch(recipients, amounts),
            "length missmatch"
        );
    });

    it("mintBatch - Mint to vested address", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let recipients = [alice];
        let amounts = ["1000000000000000000"]

        let now = Math.trunc(new Date().getTime() / 1000);
        let day = 60 * 60 * 24;
        let lockTimes = [now + day]

        instance.mintBatchVested(recipients, amounts, lockTimes);

        await truffleAssert.reverts(
            instance.mintBatch(recipients, amounts),
            "Cant mint to vested address"
        );
    });

    it("mintBatchVested - length missmatch 1", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let recipients = [alice, bob, carol];
        let amounts = ["1000000000000000000", "2000000000000000000"]

        await truffleAssert.reverts(
            instance.mintBatchVested(recipients, amounts, []),
            "length missmatch 1"
        );
    });

    it("mintBatchVested - length missmatch 2", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let recipients = [alice, bob];
        let amounts = ["1000000000000000000", "2000000000000000000"]

        let now = Math.trunc(new Date().getTime() / 1000);
        let day = 60 * 60 * 24;
        let lockTimes = [now + day, now + (2 * day), now + (3 * day)]

        await truffleAssert.reverts(
            instance.mintBatchVested(recipients, amounts, lockTimes),
            "length missmatch 2"
        );
    });

    it("mintBatchVested - Mint to vested address", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let recipients = [alice];
        let amounts = ["1000000000000000000"]

        let now = Math.trunc(new Date().getTime() / 1000);
        let day = 60 * 60 * 24;
        let lockTimes = [now + day]

        instance.mintBatchVested(recipients, amounts, lockTimes);

        await truffleAssert.reverts(
            instance.mintBatchVested(recipients, amounts, lockTimes),
            "Cant mint to vested address"
        );
    });

    it("mintBatchVested - Mint to vested address", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let recipients = [alice];
        let amounts = ["1000000000000000000"]

        let now = Math.trunc(new Date().getTime() / 1000);
        let day = 60 * 60 * 24;
        let lockTimes = [now + day]

        instance.mintBatch(recipients, amounts);

        await truffleAssert.reverts(
            instance.mintBatchVested(recipients, amounts, lockTimes),
            "vesting req 0 balance"
        );
    });
});