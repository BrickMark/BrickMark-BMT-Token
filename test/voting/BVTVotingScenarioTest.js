const BVTToken = artifacts.require("./BVTVotingToken.sol");
const helper = require('ganache-time-traveler');
const truffleAssert = require('truffle-assertions');

contract("BVT Voting Scenario test", async accounts => {

    const BrickMark = accounts[0];
    const alice = accounts[5];
    const bob = accounts[6];
    const carol = accounts[7];

    const SECONDS_IN_DAY = 86400;

    beforeEach(async () => {
        let snapShot = await helper.takeSnapshot();
        snapshotId = snapShot['result'];
    });

    afterEach(async () => {
        await helper.revertToSnapshot(snapshotId);
    });

    it("Voting Scenario 1", async () => {

        // Deploy and Minting
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });
        let owners = [alice, bob, carol];
        let amounts = ["1000000000000000000", "2000000000000000000", "3000000000000000000"]

        await instance.mintBatch(owners, amounts);

        let state = await instance.getState.call();
        assert.equal(state, 0);

        let startTimeActual = await instance.getStartTime.call();
        let endTimeActual = await instance.getEndTime.call();
        assert.equal(startTimeActual, 0);
        assert.equal(endTimeActual, 0);

        // Start Voting 
        let now = Math.trunc(new Date().getTime() / 1000);
        let endTime = now + SECONDS_IN_DAY;
        let result = await instance.startVoting(endTime);

        truffleAssert.eventEmitted(result, 'VotingStarted', (ev) => {
            return ev.endTime.toString() === endTime.toString();
        });

        state = await instance.getState.call();
        assert.equal(state, 1);

        endTimeActual = await instance.getEndTime.call();
        assert.equal(endTimeActual, endTime);

        // Voting period
        await instance.transfer("0x0000000000000000000000000000000000000001", amounts[0], { from: owners[0] });
        result = await instance.vote(0x2, { from: owners[1] });

        truffleAssert.eventEmitted(result, 'VoteFor', (ev) => {
            return ev.option.toString() === "2" && ev.votes.toString() == amounts[1];
        });

        // Voting period is over
        await helper.advanceTimeAndBlock(SECONDS_IN_DAY);
        state = await instance.getState.call();
        assert.equal(state, 2);

        result = await instance.getVotesFor.call(1);
        assert.equal(result.toString(), amounts[0]);

        result = await instance.getVotesFor.call(2);
        assert.equal(result.toString(), amounts[1]);

        result = await instance.getVotesFor.call(3);
        assert.equal(result.toString(), "0");
    });
});