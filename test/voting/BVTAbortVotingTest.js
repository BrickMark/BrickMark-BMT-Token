const helper = require("ganache-time-traveler");
const BVTToken = artifacts.require("./BVTVotingToken.sol");

contract("BVT abortVoting test", async accounts => {
    const SECONDS_IN_DAY = 86400;

    const BrickMark = accounts[0];
    const alice = accounts[5];

    beforeEach(async () => {
        let snapShot = await helper.takeSnapshot();
        snapshotId = snapShot["result"];
    });

    afterEach(async () => {
        await helper.revertToSnapshot(snapshotId);
    });

    it("abortVoting: Init state abort", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });
        await instance.name.call();
        await instance.abortVoting();

        try {
            await instance.name.call();
            assert.fail("VM Exception expected");
        } catch (ex) {
            assert(
                ex
                    .toString()
                    .startsWith(
                        "Error: Returned values aren't valid, did it run Out of Gas?"
                    )
            );
        }
    });

    it("abortVoting: Init state not minter tries to abort. Fail", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });

        try {
            await instance.abortVoting({ from: alice });

            assert.fail("VM Exception expected");
        } catch (ex) {
            assert.equal(
                ex.reason,
                "MinterRole: caller does not have the Minter role"
            );
        }
    });

    it("abortVoting: Voting state abort should fail", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });

        let now = Math.trunc(new Date().getTime() / 1000);
        let endTime = now + SECONDS_IN_DAY;
        await instance.startVoting(endTime);

        try {
            await instance.abortVoting();
            assert.fail("VM Exception expected");
        } catch (ex) {
            assert.equal(ex.reason, "BVTState: not init state");
        }
    });

    it("abortVoting: End state abort should fail", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });

        // start voting
        let now = Math.trunc(new Date().getTime() / 1000);
        let endTime = now + SECONDS_IN_DAY;
        await instance.startVoting(endTime);

        // Jump to end state
        await helper.advanceTimeAndBlock(SECONDS_IN_DAY);
        state = await instance.getState.call();
        assert.equal(state, 2);

        try {
            await instance.abortVoting();
            assert.fail("VM Exception expected");
        } catch (ex) {
            assert.equal(ex.reason, "BVTState: not init state");
        }
    });
});
