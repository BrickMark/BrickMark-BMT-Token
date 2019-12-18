const helper = require("ganache-time-traveler");
const truffleAssert = require('truffle-assertions');
const BVTToken = artifacts.require("./BVTVotingToken.sol");
const time = require("../TimeUtil");

contract("BVT - Mint and Vote test", async accounts => {

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

    it("BVT - mintBatch", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });
        assert.equal((await instance.decimals()).toString(), "0");
        let recipients = [alice, bob, carol];
        let amounts = [
            "1000000000000000000",
            "2000000000000000000",
            "3000000000000000000"
        ];

        await instance.mintBatch(recipients, amounts);

        for (var i = 0; i < recipients.length; i++) {
            var balance = await instance.balanceOf.call(recipients[i]);
            assert.equal(balance.toString(), amounts[i]);
        }
    });

    it("BVT - MintBatch length missmatch 1", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });

        let recipients = [alice, bob, carol];
        let amounts = ["1000000000000000000", "2000000000000000000"]

        await truffleAssert.reverts(
            instance.mintBatch(recipients, amounts),
            "length missmatch"
        );
    });

    it("BVT - Vote with Transfer", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });
        let recipients = [alice, bob, carol];
        let amounts = [
            "1000000000000000000",
            "2000000000000000000",
            "3000000000000000000"
        ];

        await instance.mintBatch(recipients, amounts);

        await instance.startVoting(time.unixTimeTomorrow());

        await instance.transfer("0x0000000000000000000000000000000000000001", amounts[0], { from: recipients[0] });

        var balance = await instance.balanceOf.call(recipients[0]);
        assert.equal(balance.toString(), "0");

        balance = await instance.balanceOf.call("0x0000000000000000000000000000000000000001");
        assert.equal(balance.toString(), "1000000000000000000");
    });

    it("BVT - Vote with TransferFrom", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });

        let amount = "2000000000000000000";
        await instance.mintBatch([bob], [amount]);

        await instance.startVoting(time.unixTimeTomorrow());

        await instance.approve(alice, amount, { from: bob });
        await instance.transferFrom(bob, "0x0000000000000000000000000000000000000001", amount, { from: alice });

        var balance = await instance.balanceOf.call(bob);
        assert.equal(balance.toString(), "0");

        balance = await instance.balanceOf.call("0x0000000000000000000000000000000000000001");
        assert.equal(balance.toString(), amount);
    });

    it("BVT - Vote with Vote", async () => {
        let instance = await BVTToken.new("0xff", 3, { from: BrickMark });

        let amount = "2000000000000000000";
        await instance.mintBatch([bob], [amount]);

        await instance.startVoting(time.unixTimeTomorrow());

        await instance.vote(1, { from: bob });

        var balance = await instance.balanceOf.call(bob);
        assert.equal(balance.toString(), "0");

        balance = await instance.balanceOf.call("0x0000000000000000000000000000000000000001");
        assert.equal(balance.toString(), amount);
    });
});
