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
    const PauserRole1 = accounts[3];
    const PauserRole2 = accounts[4];

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

    it("MultiSig - MultiSig MinterRole executes MintBatch", async () => {

        const amount = "1000000000000000000000"

        // Initialize Gnosis MultiSig with 2-of-2 signatures
        let multiSigMinter = await MultiSig.new([MinterRole1, MinterRole2], 2, { from: BrickMark });

        // BMT Token. BrickMark Deployes the contract and is the minter
        let bmt = await BMTToken.new({ from: BrickMark });
        let result = await bmt.isMinter.call(BrickMark);
        assert(result, "By default BrickMark is MinterRole");

        // Adding the MultiSig Contract as MinterRole
        result = await bmt.addMinter(multiSigMinter.address);
        result = await bmt.isMinter.call(multiSigMinter.address);
        assert(result, "MultiSig contract should be MinterRole");

        // Remove BrickMark from the MinterRole. 
        result = await bmt.renounceMinter();
        result = await bmt.isMinter.call(BrickMark);
        assert(!result, "BrickMark should NOT be MinterRole");

        // Make sure BrickMark is not able to mint anymore
        await truffleAssert.reverts(
            bmt.mintBatch([alice], [amount]),
            "MinterRole: caller does not have the Minter role"
        );


        // Didn't find a nicer library. We have to encode the MintBatch function with the right parameters.
        // Tip: To validate encoded data you can generate this data also in Remix or other tools. 
        var encoded = abi.simpleEncode("mintBatch(address[],uint256[]):(bool)", [alice], [amount]);
        hexEncoded = "0x" + encoded.toString('hex');

        // MinterRole1 is Submitting the prepared transaction for minting to the multi sig smart contract
        result = await multiSigMinter.submitTransaction(bmt.address, 0, hexEncoded, { from: MinterRole1 });
        const transactionId = result.logs[1].args['transactionId'].toString();

        // MinterRole2 confirms the transaction. This will forward the call to the BMT smart contract and tokens will be minted.
        result = await multiSigMinter.confirmTransaction(transactionId, { from: MinterRole2 });

        // Check result
        result = await bmt.balanceOf.call(alice);
        assert.equal(result.toString(), amount, "Alice should have the right amount");
    });


    it("MultiSig - MultiSig PauserRole executes Pause", async () => {

        // Initialize Gnosis MultiSig with 2-of-2 signatures
        let multiSigPauser = await MultiSig.new([PauserRole1, PauserRole2], 2, { from: BrickMark });

        // BMT Token. BrickMark Deployes the contract and is the minter
        let bmt = await BMTToken.new({ from: BrickMark });
        let result = await bmt.isPauser.call(BrickMark);
        assert(result, "By default BrickMark is PauserRole");

        // Adding the MultiSig Contract as PauserRole
        result = await bmt.addPauser(multiSigPauser.address);
        result = await bmt.isPauser.call(multiSigPauser.address);
        assert(result, "MultiSig Contract should be PauserRole");

        // Remove BrickMark from the Pauser. 
        result = await bmt.renouncePauser();
        result = await bmt.isPauser.call(BrickMark);
        assert(!result, "BrickMark should NOT be in the PauserRole");

        // Make sure BrickMark is not able to mint anymore
        await truffleAssert.reverts(
            bmt.pause(),
            "PauserRole: caller does not have the Pauser role"
        );


        // Didn't find a nicer library. We have to encode the Pause function with the right parameters.
        // Tip: To validate encoded data you can generate this data also in Remix or other tools. 
        var encoded = abi.simpleEncode("pause()");
        hexEncoded = "0x" + encoded.toString('hex');

        // MinterRole1 is Submitting the prepared transaction for minting to the multi sig smart contract
        result = await multiSigPauser.submitTransaction(bmt.address, 0, hexEncoded, { from: PauserRole1 });
        const transactionId = result.logs[1].args['transactionId'].toString();

        result = await bmt.paused.call();
        assert(!result, "contract should NOT be paused");

        // MinterRole2 confirms the transaction. This will forward the call to the BMT smart contract and tokens will be minted.
        result = await multiSigPauser.confirmTransaction(transactionId, { from: PauserRole2 });

        // Check result
        result = await bmt.paused.call();
        assert(result, "contract should be paused");
    });
});