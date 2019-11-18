const helper = require("ganache-time-traveler");
const truffleAssert = require("truffle-assertions");
const BVTToken = artifacts.require("./BVTVotingToken.sol");

contract("BVT VotingEdgeCases test", async accounts => {
    const SECONDS_IN_DAY = 86400;

    const BrickMark = accounts[0];
    const alice = accounts[5];
    const bob = accounts[6];
    const carol = accounts[7];

    beforeEach(async () => {
        let snapShot = await helper.takeSnapshot();
        snapshotId = snapShot["result"];
    });

    afterEach(async () => {
        await helper.revertToSnapshot(snapshotId);
    });

    it("BVT Voting: When init state should fail", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });
        let amount = "1000000000000000000";

        await instance.mintBatch([alice], [amount]);

        await truffleAssert.reverts(
            instance.transfer("0x0000000000000000000000000000000000000001", amount, {
                from: alice
            }),
            "BVTState: not voting state"
        );

        await truffleAssert.reverts(
            instance.vote(1, { from: alice }),
            "BVTState: not voting state"
        );
    });

    it("BVT Voting: When end state should fail", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });
        let amount = "1000000000000000000";

        await instance.mintBatch([alice], [amount]);

        // start voting
        let now = Math.trunc(new Date().getTime() / 1000);
        let endTime = now + SECONDS_IN_DAY;
        await instance.startVoting(endTime);

        // Jump to end state
        await helper.advanceTimeAndBlock(SECONDS_IN_DAY);
        state = await instance.getState.call();
        assert.equal(state.toString(), "2");

        await truffleAssert.reverts(
            instance.transfer(
                "0x0000000000000000000000000000000000000001",
                amount,
                { from: alice }
            ),
            "BVTState: not voting state"
        );

        await truffleAssert.reverts(instance.vote(1, { from: alice }), "BVTState: not voting state");
    });

    it("BVT Voting: Start voting with invalid time", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });
        let amount = "1000000000000000000";

        await instance.mintBatch([alice], [amount]);

        await truffleAssert.reverts(instance.startVoting(1234), "End time not in future");
    });
});
