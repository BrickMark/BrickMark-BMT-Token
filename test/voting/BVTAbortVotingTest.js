const helper = require("ganache-time-traveler");
const truffleAssert = require('truffle-assertions');
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

        await truffleAssert.fails(instance.name.call(), "Returned values aren't valid, did it run Out of Gas?");
    });

    it("abortVoting: Init state not minter tries to abort. Fail", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });

        await truffleAssert.reverts(
            instance.abortVoting({ from: alice }),
            "MinterRole: caller does not have the Minter role"
        );
    });

    it("abortVoting: Voting state abort should fail", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });

        await instance.mintBatch([alice], [1]);

        let now = Math.trunc(new Date().getTime() / 1000);
        let endTime = now + SECONDS_IN_DAY;
        await instance.startVoting(endTime);

        await truffleAssert.reverts(
            instance.abortVoting({ from: alice }),
            "BVTState: not init state"
        );
    });

    it("abortVoting: End state abort should fail", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });

        await instance.mintBatch([alice], [1]);
        
        // start voting
        let now = Math.trunc(new Date().getTime() / 1000);
        let endTime = now + SECONDS_IN_DAY;
        await instance.startVoting(endTime);

        // Jump to end state
        await helper.advanceTimeAndBlock(SECONDS_IN_DAY);
        state = await instance.getState.call();
        assert.equal(state, 2);

        await truffleAssert.reverts(
            instance.abortVoting({ from: alice }),
            "BVTState: not init state"
        );
    });
});
