const truffleAssert = require("truffle-assertions");
const BMTToken = artifacts.require("./BMTToken.sol");

contract("BMTToken PayDividendTest test", async accounts => {
    const BrickMark = accounts[0];
    const alice = accounts[5];
    const bob = accounts[6];
    const carol = accounts[7];

    it("PayDividend - happy case", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let recipients = [alice, bob, carol];
        let amounts = [
            "1000000000000000000",
            "2000000000000000000",
            "3000000000000000000"
        ];

        let result = await instance.payDividend(
            recipients,
            amounts,
            "First Dividend"
        );

        for (var i = 0; i < recipients.length; i++) {
            var balance = await instance.balanceOf.call(recipients[i]);
            assert.equal(balance.toString(), amounts[i]);

            truffleAssert.eventEmitted(result, "Transfer", {
                from: "0x0000000000000000000000000000000000000000",
                to: recipients[i]
            });
            
            truffleAssert.eventEmitted(result, "DividendPayed", ev => {
                return (
                    ev.account === recipients[i] &&
                    ev.amount.toString() === amounts[i] &&
                    ev.message === "First Dividend"
                );
            });
        }
    });

    it("PayDividend - length missmatch", async () => {
        let instance = await BMTToken.new({ from: BrickMark });
        let recipients = [alice, bob, carol];
        let amounts = ["1000000000000000000", "2000000000000000000"];

        await truffleAssert.reverts(
            instance.payDividend(recipients, amounts, "First Dividend"),
            "length missmatch"
        );
    });
});
