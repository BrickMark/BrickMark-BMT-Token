const helper = require('ganache-time-traveler');
const truffleAssert = require('truffle-assertions');
const BVTToken = artifacts.require("./BVTVotingToken.sol");
const time = require("../TimeUtil");

contract("All BMT Events Test", async accounts => {

    const zeroAddress = "0x0000000000000000000000000000000000000000";
    const oneAddress = "0x0000000000000000000000000000000000000001";

    const BrickMark = accounts[0];
    const alice = accounts[5];
    const bob = accounts[6];
    const carol = accounts[7];

    beforeEach(async () => {
        let snapShot = await helper.takeSnapshot();
        snapshotId = snapShot['result'];
    });

    afterEach(async () => {
        await helper.revertToSnapshot(snapshotId);
    });

    it("BVT Events - MintBatch Transfer", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });

        let amount = "2000000000000000000";
        let result = await instance.mintBatch([bob], [amount]);

        truffleAssert.eventEmitted(result, 'Transfer', (ev) => {
            return ev.from === zeroAddress && ev.to === bob && ev.value.toString() === amount;
        });
    });

    it("BVT Events - VotingStarted", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });

        let amount = "2000000000000000000";
        await instance.mintBatch([bob], [amount]);

        let endTime = time.unixTimeTomorrow();
        let result = await instance.startVoting(endTime);

        truffleAssert.eventEmitted(result, 'VotingStarted', (ev) => {
            return ev.endTime == endTime && ev.startTime < ev.endTime;
        });
    });

    it("BVT Events - VoteFor (function VoteFor)", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });

        let amount = "2000000000000000000";
        await instance.mintBatch([bob], [amount]);

        let endTime = time.unixTimeTomorrow();
        await instance.startVoting(endTime);

        let result = await instance.vote(1, {from: bob});

        truffleAssert.eventEmitted(result, 'VoteFor', (ev) => {
            return ev.option == 1 && ev.votes.toString() === amount;
        });

        truffleAssert.eventEmitted(result, 'Transfer', (ev) => {
            return ev.from === bob && ev.to === oneAddress && ev.value.toString() === amount;
        });
    });

    it("BVT Events - VoteFor (function transfer)", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });

        let amount = "2000000000000000000";
        await instance.mintBatch([bob], [amount]);

        let endTime = time.unixTimeTomorrow();
        await instance.startVoting(endTime);

        let result = await instance.transfer(oneAddress, amount, {from: bob});

        truffleAssert.eventEmitted(result, 'VoteFor', (ev) => {
            return ev.option == 1 && ev.votes.toString() === amount;
        });

        truffleAssert.eventEmitted(result, 'Transfer', (ev) => {
            return ev.from === bob && ev.to === oneAddress && ev.value.toString() === amount;
        });
    });

    it("BVT Events - VoteFor (function transferFrom)", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });

        let amount = "2000000000000000000";
        await instance.mintBatch([bob], [amount]);
        await instance.approve(alice, amount, {from: bob});

        let endTime = time.unixTimeTomorrow();
        await instance.startVoting(endTime);

        let result = await instance.transferFrom(bob, oneAddress, amount, {from: alice});

        truffleAssert.eventEmitted(result, 'VoteFor', (ev) => {
            return ev.option == 1 && ev.votes.toString() === amount;
        });

        truffleAssert.eventEmitted(result, 'Transfer', (ev) => {
            return ev.from === bob && ev.to === oneAddress && ev.value.toString() === amount;
        });
    });
});