const truffleAssert = require('truffle-assertions');
const BMTToken = artifacts.require("./BMTToken.sol");
const time = require("./TimeUtil");

contract("BMTToken PauseAndFreeze test", async accounts => {

    const BrickMark = accounts[0];
    const alice = accounts[5];
    const bob = accounts[6];
    const carol = accounts[7];

    it("Paused - Pause and unpause 1", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000"

        await instance.mintBatch([alice], [amount]);

        await instance.pause();

        await truffleAssert.reverts(
            instance.transfer(bob, amount, { from: alice }),
            "Pausable: paused"
        );

        await instance.unpause();
        await instance.transfer(bob, amount, { from: alice });
    });

    it("Paused - Pause and freeze 1", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000"

        await instance.mintBatch([alice], [amount]);

        let paused = await instance.paused();
        assert(!paused, "it should not be paused");
        await instance.pause();
        paused = await instance.paused();
        assert(paused, "it should be paused");

        let frozen = await instance.isFrozen();
        assert(!frozen, "it should not be frozen");
        await instance.freeze();
        frozen = await instance.isFrozen();
        assert(frozen, "it should be frozen");

        await truffleAssert.reverts(
            instance.transfer(bob, amount, { from: alice }),
            "Pausable: paused"
        );

        await truffleAssert.reverts(
            instance.unpause(),
            "BMTFreezable: frozen"
        );
    });

    it("Paused - mintBatch should NOT be possible", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        await instance.pause();
        await instance.freeze();

        await truffleAssert.reverts(
            instance.mintBatch([alice], [amount]),
            "Pausable: paused"
        );
    });

    it("Paused - mintBatchVested should NOT be possible", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        await instance.pause();
        await instance.freeze();

        await truffleAssert.reverts(
            instance.mintBatchVested([alice], [amount], [time.unixTimeTomorrow()]),
            "Pausable: paused"
        );
    });

    it("Paused - pay dividend should NOT be possible", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        await instance.pause();

        await truffleAssert.reverts(
            instance.payDividend([alice], [amount], "Dividend for Alice"),
            "Pausable: paused"
        );
    });

    it("Frozen - mintBatch should NOT be possible", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        await instance.pause();
        await instance.freeze();

        await truffleAssert.reverts(
            instance.mintBatch([alice], [amount]),
            "Pausable: paused"
        );
    });

    it("Frozen - mintBatchVested should NOT be possible", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        await instance.pause();
        await instance.freeze();

        await truffleAssert.reverts(
            instance.mintBatchVested([alice], [amount], [time.unixTimeTomorrow()]),
            "Pausable: paused"
        );
    });

    it("Frozen - pay dividend should NOT be possible", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        await instance.pause();
        await instance.freeze();

        await truffleAssert.reverts(
            instance.payDividend([alice], [amount], "Dividend for Alice"),
            "Pausable: paused"
        );
    });
});