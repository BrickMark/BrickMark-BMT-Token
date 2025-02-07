const helper = require("ganache-time-traveler");
const truffleAssert = require("truffle-assertions");
const BVTToken = artifacts.require("./BVTVotingToken.sol");
const time = require("../TimeUtil");

contract("BVT Edge-Cases test", async accounts => {

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

    it("Edge-Cases - When init state should fail", async () => {
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

    it("Edge-Cases - When end state should fail", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });
        let amount = "1000000000000000000";

        await instance.mintBatch([alice], [amount]);

        await instance.startVoting(time.unixTimeTomorrow());

        // Jump to end state
        await helper.advanceTimeAndBlock(time.ONE_DAY_IN_SECONDS);
        state = await instance.getState.call();
        assert.equal(state.toString(), "2");

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

    it("Edge-Cases - Start voting with invalid time", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });
        let amount = "1000000000000000000";

        await instance.mintBatch([alice], [amount]);

        await truffleAssert.reverts(
            instance.startVoting(1234),
            "End time not in future"
        );
    });

    it("Edge-Cases - Exceeding voting period", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });
        let amount = "1000000000000000000";

        await instance.mintBatch([alice], [amount]);

        await truffleAssert.reverts(
            instance.startVoting(time.unixTimeInDays(6 * 31)),
            "Too long"
        );
    });

    it("Edge-Cases - Start voting without minting", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });

        await truffleAssert.reverts(
            instance.startVoting(time.unixTimeTomorrow()),
            "No voting tokens"
        );
    });

    it("Edge-Cases - Invalid constructor param value", async () => {
        await truffleAssert.reverts(
            BVTToken.new("0xff", 0, { from: BrickMark }),
            "options required"
        );
    });

    it("Edge-Cases - Vote with option 0. Fail", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });

        let amount = "2000000000000000000";
        await instance.mintBatch([bob], [amount]);

        await instance.startVoting(time.unixTimeTomorrow());

        await truffleAssert.reverts(
            instance.vote(0, { from: bob }),
            "Option 0 never supported"
        );
    });

    it("Edge-Cases - Vote with option 4 of 3. Fail", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });

        let amount = "2000000000000000000";
        await instance.mintBatch([bob], [amount]);

        await instance.startVoting(time.unixTimeTomorrow());

        await truffleAssert.reverts(
            instance.vote(4, { from: bob }),
            "Option out of range"
        );
    });
});
