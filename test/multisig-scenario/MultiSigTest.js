const helper = require('ganache-time-traveler');
const truffleAssert = require('truffle-assertions');
const abi = require("ethereumjs-abi");
const time = require("../TimeUtil");
const BMTToken = artifacts.require("./BMTToken.sol");
const MultiSig = artifacts.require("./MultiSigWallet.sol");

contract("Gnosis MultiSig Test", async accounts => {

    const zeroAddress = "0x0000000000000000000000000000000000000000";
    const oneAddress = "0x0000000000000000000000000000000000000001";

    const BrickMark = accounts[0];
    const MinterRole1 = accounts[1];
    const MinterRole2 = accounts[2];

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

    it("MultiSig - Scenario1", async () => {

        // Initialize Gnosis MultiSig with 2-of-2 signatures
        let multiSig = await MultiSig.new([MinterRole1, MinterRole2], 2, { from: BrickMark });

        // BMT Token. BrickMark Deployes the contract and is the minter
        let bmt = await BMTToken.new({ from: BrickMark });
        let result = await bmt.isMinter.call(BrickMark);
        assert(result);

        // Adding the MultiSig Contract as MinterRole
        result = await bmt.addMinter(multiSig.address);
        result = await bmt.isMinter.call(multiSig.address);
        assert(result);

        // Remove BrickMark from the MinterRole. 
        result = await bmt.renounceMinter();
        result = await bmt.isMinter.call(BrickMark);
        assert(!result);


        // Didn't find a nicer library. We have to encode the MintBatch function with the right parameters.
        // Tip: To validate encoded data you can generate this data also in Remix or other tools. 
        var encoded = abi.simpleEncode("mintBatch(address[],uint256[]):(bool)", [alice], ["1000"]);
        hexEncoded = "0x" + encoded.toString('hex');

        // MinterRole1 is Submitting the prepared transaction for minting to the multi sig smart contract
        result = await multiSig.submitTransaction(bmt.address, 0, hexEncoded, {from: MinterRole1});
        const transactionId = result.logs[1].args['transactionId'].toString();

        // MinterRole2 confirms the transaction. This will forward the call to the BMT smart contract and tokens will be minted.
        result = await multiSig.confirmTransaction(transactionId, {from: MinterRole2});

        // Check result
        result = await bmt.balanceOf.call(alice);
        assert.equal(result.toString(), "1000");

    });

});