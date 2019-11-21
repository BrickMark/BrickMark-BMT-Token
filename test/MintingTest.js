const truffleAssert = require('truffle-assertions');
const BMTToken = artifacts.require("./BMTToken.sol");
const time = require("./TimeUtil");

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

        instance.mintBatchVested(recipients, amounts, [time.unixTimeTomorrow()]);

        await truffleAssert.reverts(
            instance.mintBatch(recipients, amounts),
            "Cant mint to vested address"
        );
    });

    it("mintBatchVested - happy case", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let recipients = [alice, bob, carol];
        let amounts = ["1000000000000000000", "2000000000000000000", "3000000000000000000"]

        let lockTimes = [time.unixTimeTomorrow(), time.unixTimeInDays(2), time.unixTimeInDays(3)];

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

        const lockTime = time.unixTimeTomorrow();
        let lockTimes = [lockTime, lockTime, lockTime]

        await truffleAssert.reverts(
            instance.mintBatchVested(recipients, amounts, lockTimes),
            "length missmatch 2"
        );
    });

    it("mintBatchVested - Mint to vested address", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let recipients = [alice];
        let amounts = ["1000000000000000000"]
        const lockTimes = [time.unixTimeTomorrow()];

        instance.mintBatchVested(recipients, amounts, lockTimes);

        await truffleAssert.reverts(
            instance.mintBatchVested(recipients, amounts, lockTimes),
            "Cant mint to vested address"
        );
    });

    it("mintBatchVested - MintBatchVested to address ith balance", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let recipients = [alice];
        let amounts = ["1000000000000000000"]

        instance.mintBatch(recipients, amounts);

        await truffleAssert.reverts(
            instance.mintBatchVested(recipients, amounts, [time.unixTimeTomorrow()]),
            "vesting req 0 balance"
        );
    });
});