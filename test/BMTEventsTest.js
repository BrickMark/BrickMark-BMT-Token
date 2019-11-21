const helper = require('ganache-time-traveler');
const truffleAssert = require('truffle-assertions');
const BMTToken = artifacts.require("./BMTToken.sol");
const time = require("./TimeUtil");

contract("All BMT Events Test", async accounts => {

    const zeroAddress = "0x0000000000000000000000000000000000000000";
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

    it("BMT Events - Paused and Unpaused", async () => {
        let instance = await BMTToken.new({ from: BrickMark });

        let result = await instance.pause();
        truffleAssert.eventEmitted(result, 'Paused', (ev) => {
            return ev.account === BrickMark;
        });

        result = await instance.unpause();
        truffleAssert.eventEmitted(result, 'Unpaused', (ev) => {
            return ev.account === BrickMark;
        });
    });

    it("BMT Events - Frozen", async () => {
        let instance = await BMTToken.new({ from: BrickMark });

        await instance.pause();

        let result = await instance.freeze();
        truffleAssert.eventEmitted(result, 'Frozen', (ev) => {
            return ev.account === BrickMark;
        });
    });

    it("BMT Events - AccountVested", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";

        let vestingTime = time.unixTimeTomorrow();
        let result = await instance.mintBatchVested([alice], [amount], [vestingTime]);

        truffleAssert.eventEmitted(result, 'Transfer', (ev) => {
            return ev.from === zeroAddress && ev.to === alice && ev.value.toString() === amount;
        });

        truffleAssert.eventEmitted(result, 'AccountVested', (ev) => {
            return ev.account === alice && ev.endTime == vestingTime;
        });
    });

    it("BMT Events - DividendPayed", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let amount = "1000000000000000000";
        let message = "Dividend 2020";

        let vestingTime = time.unixTimeTomorrow();
        let result = await instance.payDividend([alice], [amount], message);

        truffleAssert.eventEmitted(result, 'Transfer', (ev) => {
            return ev.from === zeroAddress && ev.to === alice && ev.value.toString() === amount;
        });

        truffleAssert.eventEmitted(result, 'DividendPayed', (ev) => {
            return ev.account === alice && ev.amount.toString() === amount && ev.message === message;
        });
    });

});