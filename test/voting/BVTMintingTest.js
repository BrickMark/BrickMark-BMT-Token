const BVTToken = artifacts.require("./BVTVotingToken.sol");

contract("BVT Minting test", async accounts => {

    const BrickMark = accounts[0];
    const alice = accounts[5];
    const bob = accounts[6];
    const carol = accounts[7];

    it("BVT mintBatch 1", async () => {
        let instance = await BVTToken.new("0xff", 3, {from: BrickMark});
        let recipients = [alice, bob, carol];
        let amounts = ["1000000000000000000", "2000000000000000000", "3000000000000000000"]
        
        await instance.mintBatch(recipients, amounts);

        for(var i=0; i<recipients.length; i++) {
            var balance = await instance.balanceOf.call(recipients[i]);
            assert.equal(balance.toString(), amounts[i]);
        }
    });
});