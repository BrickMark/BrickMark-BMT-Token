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
});