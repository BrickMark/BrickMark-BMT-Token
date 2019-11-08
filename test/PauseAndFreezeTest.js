const BMTToken = artifacts.require("./BMTToken.sol");

contract("BMTToken PauseAndFreeze test", async accounts => {

    const BrickMark = accounts[0];
    const alice = accounts[5];
    const bob = accounts[6];
    const carol = accounts[7];

    it("Pause and unpause 1", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000"

        await instance.mint(alice, amount);

        await instance.pause();

        try {
            await instance.transfer(bob, amount, { from: alice });
            assert.fail("VM Exception expected");
        } catch (ex) {
            assert.equal(ex.reason, "Pausable: paused");
        }

        await instance.unpause();
        await instance.transfer(bob, amount, { from: alice });
    });

    it("Pause and freeze 1", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000"

        await instance.mint(alice, amount);

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

        try {
            await instance.transfer(bob, amount, { from: alice });
            assert.fail("VM Exception expected");
        } catch (ex) {
            assert.equal(ex.reason, "Pausable: paused");
        }

        try {
            await instance.unpause();
            assert.fail("VM Exception expected");
        } catch (ex) {
            assert.equal(ex.reason, "BMTFreezable: frozen");
        }
    });

    it("Pause mint should be possible", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        await instance.pause();
        
        await instance.mint(alice, amount);
        await instance.mintBatch([alice], [amount]);
        await instance.payDividend([alice], [amount], "Dividend for Alice");
        let now = Math.trunc(new Date().getTime() / 1000);
        await instance.mintBatchVested([alice], [amount], [now + 3600]);


        try {
       //     assert.fail("VM Exception expected");
        } catch (ex) {
            console.log(ex);
            assert.equal(ex.reason, "Pausable: paused");
        }
    });

    it("Freeze mint should NOT be possible", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        await instance.pause();
        await instance.freeze();

        try {
            await instance.mint(alice, amount);
            assert.fail("VM Exception expected");
        } catch (ex) {
            assert.equal(ex.reason, "BMTFreezable: frozen");
        }

        try {
            await instance.mintBatch([alice], [amount]);
            assert.fail("VM Exception expected");
        } catch (ex) {
            assert.equal(ex.reason, "BMTFreezable: frozen");
        }

        try {
            await instance.payDividend([alice], [amount], "Dividend for Alice");
            assert.fail("VM Exception expected");
        } catch (ex) {
            console.log(ex);
            assert.equal(ex.reason, "BMTFreezable: frozen");
        }

        try {
            let now = Math.trunc(new Date().getTime() / 1000);
            await instance.mintBatchVested([alice], [amount], [now + 3600]);
            assert.fail("VM Exception expected");
        } catch (ex) {
            console.log(ex);
            assert.equal(ex.reason, "BMTFreezable: frozen");
        }
    });
});