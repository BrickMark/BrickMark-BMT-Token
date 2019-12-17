import Web3 from 'web3';
import { ethers } from 'ethers';
import bmtabi from './bmtabi';
import votingAbi from './votingabi';
import votingByteCode from './votingByteCode';
import { store } from '../store/store'

var web3 = new Web3(window.ethereum || "ws://localhost:8545");

const decimals = 18;

window.ethereum.enable().then(function (addresses) {
    console.log("Your Address:", addresses[0]);
});

var blockchain = {

    getBMTAddress() {

        return store.state.bmtAddress;
        // return "0x7D586da8c71163e41cba108e6624b94B2de9EaaB";
    },

    getWeb3() {
        return web3;
    },

    async getBMTInstance() {
        var coinbase = await web3.eth.getCoinbase();
        //console.log("Coinbase:", coinbase);
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

        const totalSupplyHumanReadable = this.toHumanNumber(totalSupply);

        var bmtInfo = {
            name: name,
            symbol: symbol,
            decimals: decimals,
            totalSupply: totalSupply,
            hTotalSupply: totalSupplyHumanReadable,
            paused: paused,
            frozen: frozen
        };

        return bmtInfo;
    },

    async getInvestorInfo(investorAddress, name) {
        const erc20Instance = await blockchain.getBMTInstance();

        const balance = await erc20Instance.methods.balanceOf(investorAddress).call();
        const isVested = await erc20Instance.methods.isVested(investorAddress).call();
        const vestingEndTime = await erc20Instance.methods.vestingEndTime(investorAddress).call();
        const vestedBalance = await erc20Instance.methods.vestedAmount(investorAddress).call();
        const spendableBalance = await erc20Instance.methods.spendableAmount(investorAddress).call();

        var hVestingEndTime = "";
        if (isVested) {
            hVestingEndTime = this.toHumanDate(vestingEndTime);
        }

        var user = {
            name: name,
            address: investorAddress,
            shortAddress: this.toShortAddress(investorAddress),
            balance: balance,
            hBalance: this.toHumanNumber(balance),
            vested: isVested,
            vestingEndTime: vestingEndTime,
            hVestingEndTime: hVestingEndTime,
            vestedBalance: vestedBalance,
            hVestedBalance: this.toHumanNumber(vestedBalance),
            spendableBalance: spendableBalance,
            hSpendableBalance: this.toHumanNumber(spendableBalance)
        };

        return user;
    },

    async mint(investor, bmtAmount) {
        const erc20Instance = await blockchain.getBMTInstance();

        var amount = this.toContractNumber(bmtAmount, 18);
        console.log("mint: " + amount);
        await erc20Instance.methods.mintBatch([investor], [amount]).send();
    },

    async mintVested(investor, bmtAmount, vestingEndDateUnixTime) {
        const erc20Instance = await blockchain.getBMTInstance();

        var amount = this.toContractNumber(bmtAmount);
        console.log("mintVested: " + amount);
        await erc20Instance.methods.mintBatchVested([investor], [amount], [vestingEndDateUnixTime]).send();
    },

    async payDividend(investor, vestingAmount, message) {
        const erc20Instance = await blockchain.getBMTInstance();

        var amount = this.toContractNumber(vestingAmount);
        console.log("Pay Dividend: " + amount);
        await erc20Instance.methods.payDividend([investor], [amount], message).send();
    },

    async pause() {
        const erc20Instance = await blockchain.getBMTInstance();
        await erc20Instance.methods.pause().send();
    },

    async unpause() {
        const erc20Instance = await blockchain.getBMTInstance();
        await erc20Instance.methods.unpause().send();
    },

    async getAllEvents() {
        const erc20Instance = await blockchain.getBMTInstance();
        return erc20Instance.events;
    },

    toShortAddress(address) {
        return address.substring(0, 6) + "..." + address.substring(38, 42);
    },

    toHumanDate(timestamp) {
        var date = new Date(timestamp * 1000);
        return date.toISOString().substring(0, 16) + "UTC";
    },

    toContractNumber(humanBalance) {
        if (humanBalance == null) {
            return "0";
        }
        const result = ethers.utils.parseUnits(humanBalance.toString(), decimals);
        return result.toString(10);
    },

    toHumanNumber(balance) {
        if (balance == null) {
            return "0";
        }
        return ethers.utils.formatUnits(balance, decimals);
    },

    async deployVoting(votingText, votingOptions) {
        var coinbase = await web3.eth.getCoinbase();

        var votingHash = web3.utils.sha3(votingText);

        var votingContract = new web3.eth.Contract(votingAbi);
        var votingInstance = await votingContract.deploy({
            data: votingByteCode,
            arguments: [votingHash, votingOptions]
        }).send({
            from: coinbase, // default from address
            gasPrice: "20000000000" // default gas price in wei, 20 gwei in this case
        });
        
        console.log("Voting Contract: " + votingInstance.options.address);
        return votingInstance.options.address;
    }, 

    async getVotingInstance(address) {
        var coinbase = await web3.eth.getCoinbase();
        //console.log("Coinbase:", coinbase);
        var erc20Instance = new web3.eth.Contract(votingAbi, address, {
            from: coinbase, // default from address
            gasPrice: "20000000000" // default gas price in wei, 20 gwei in this case
        });

        return erc20Instance;
    },

    async getBvtInfo(address) {
        const erc20Instance = await blockchain.getVotingInstance(address);

        const name = await erc20Instance.methods.name().call();
        const symbol = await erc20Instance.methods.symbol().call();
        const decimals = await erc20Instance.methods.decimals().call();
        const totalSupply = await erc20Instance.methods.totalSupply().call();
        const votingOptions = await erc20Instance.methods.getVotingOptions().call();
        const votingTextHash = await erc20Instance.methods.getHashedVotingText().call();
        const state = await erc20Instance.methods.getState().call();
        const startTime = await erc20Instance.methods.getStartTime().call();
        const endTime = await erc20Instance.methods.getEndTime().call();

        const totalSupplyHumanReadable = this.toHumanNumber(totalSupply);
       // const votingTextHash = await erc20Instance.methods.getHashedVotingText().call();
        var votes = []
        console.log("start calc voting");
        for (var i=1;i<=parseInt(votingOptions.toString());i++){
            var vote = await erc20Instance.methods.getVotesFor(i).call();
            votes.push(vote);
        }
        console.log("end calc voting");

        var bmtInfo = {
            name: name,
            symbol: symbol,
            decimals: decimals,
            totalSupply: totalSupply,
            hTotalSupply: totalSupplyHumanReadable,
            votingOptions: votingOptions,
            votingTextHash: votingTextHash,
            votes: votes,
            state: state,
            startTime: startTime,
            endTime: endTime
        };

        return bmtInfo;
    },
}

export default blockchain;