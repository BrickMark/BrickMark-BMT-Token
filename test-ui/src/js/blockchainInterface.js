import Web3 from 'web3';
import { ethers } from 'ethers';
import bmtabi from './bmtabi';

var web3 = new Web3(window.ethereum || "ws://localhost:8545");

window.ethereum.enable().then(function (addresses) {
    console.log("Your Address:", addresses[0]);
});

var userMap = new Map();
userMap.set("bmt1", "0xb086E03bcBb7f7F486209Dc23A78CFBeBEE169D9");
userMap.set("bmt2", "0x2F6c3a35CfD7460c3d9952cdcC45CCf63D36e8AB");
userMap.set("bmt3", "0x2B1cF63Ac93BfFdb5FbE8CC43010fA9fa92ED2D1");
userMap.set("bmt4", "0xFC398aA810Bb07901813A4CE81c1654D1466b0eE");
userMap.set("tokenHolder1", "0xb8ce4Ba055cB8A4bEd923C32B1a5d15aCF4f9E8F");
userMap.set("tokenHolder2", "0x2a04950a2D9C8e0B2AFa6E47CEd8Aac35160696D");
userMap.set("vestedTokenHolder1", "0x9258b85C2BDAE58037ECbdd016993AD38652ba1a");
userMap.set("vestedTokenHolder2", "0xE919f4fD92c6c920afFFb7E319Dbee3D34BD214e");

var blockchain = {

    getBMTAddress() {
        return "0x7D586da8c71163e41cba108e6624b94B2de9EaaB";
    },

    getWeb3() {
        return web3;
    },

    getUsers() {
        return userMap;
    },

    async getInvestors() {
        var investors = [];

        for (let [k, v] of userMap) {
            var investor = await this.getInvestorInfo(v);
            investor.name = k;
            investors.push(investor);
        }
        return investors;
    },

    showMessage() {
        console.log("Message");
    },

    async getBMTInstance() {
        var coinbase = await web3.eth.getCoinbase();
        console.log("Coinbase:", coinbase);
        var erc20Instance = new web3.eth.Contract(bmtabi, this.getBMTAddress(), {
            from: coinbase, // default from address
            gasPrice: "20000000000" // default gas price in wei, 20 gwei in this case
        });

        return erc20Instance;
    },

    async getBMTInfo() {
        const erc20Instance = await blockchain.getBMTInstance();

        const name = await erc20Instance.methods.name().call();
        const symbol = await erc20Instance.methods.symbol().call();
        const decimals = await erc20Instance.methods.decimals().call();
        const totalSupply = await erc20Instance.methods.totalSupply().call();
        const paused = await erc20Instance.methods.paused().call();
        const frozen = await erc20Instance.methods.isFrozen().call();

        const totalSupplyHumanReadable = this.toHumanNumber(totalSupply, decimals);

        var bmtInfo = {
            name: name,
            symbol: symbol,
            decimals: decimals,
            totalSupply: totalSupply,
            totalSupplyHumanReadable: totalSupplyHumanReadable,
            paused: paused,
            frozen: frozen
        };

        return bmtInfo;
    },

    async getInvestorInfo(investorAddress) {
        const erc20Instance = await blockchain.getBMTInstance();

        const balance = await erc20Instance.methods.balanceOf(investorAddress).call();
        const isVested = await erc20Instance.methods.isVested(investorAddress).call();
        const vestingEndTime = await erc20Instance.methods.vestingEndTime(investorAddress).call();
        const vestedBalance = await erc20Instance.methods.vestedAmount(investorAddress).call();
        const spendableBalance = await erc20Instance.methods.spendableAmount(investorAddress).call();

        var investorInfo = {
            address: investorAddress,
            balance: balance,
            vested: isVested,
            vestingEndTime: vestingEndTime,
            vestedBalance: vestedBalance,
            spendableBalance: spendableBalance
        };

        return investorInfo;
    },

    toContractNumber(humanBalance, decimals) {
        const result = ethers.utils.parseUnits(humanBalance.toString(), parseInt(decimals));
        return result.toString(10);
    },

    toHumanNumber(balance, decimals) {
        return ethers.utils.formatUnits(balance, parseInt(decimals));
    }
}

export default blockchain;