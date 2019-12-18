import Web3 from 'web3';
import { ethers } from 'ethers';
import bmtabi from './bmtabi';
import { store } from '../store/store'
import blockchain from './blockchainInterface'


var events = {

    eventListener(error, result) {
        if (error) {
            console.error("Event Err: " + error);
        }
        console.log("Event: " + result.event);


        if (result) {
            var entry = {};
            entry.id = result.id;
            entry.name = result.event;

            if (result.event === "Paused") {
                entry.detail =
                    "From: " + blockchain.toShortAddress(result.returnValues[0]);
            } else if (result.event === "Unpaused") {
                entry.detail =
                    "From: " + blockchain.toShortAddress(result.returnValues[0]);
            } else if (result.event === "Transfer") {
                entry.detail =
                    "From: " +
                    blockchain.toShortAddress(result.returnValues[0]) +
                    ", To: " +
                    blockchain.toShortAddress(result.returnValues[1]) +
                    ", BMT: " +
                    blockchain.toHumanNumber(result.returnValues[2]);
            } else if (result.event === "AccountVested") {
                var endTime = parseInt(result.returnValues[1]);
                entry.detail =
                    ", Account: " +
                    blockchain.toShortAddress(result.returnValues[0]) +
                    ", End Time: " +
                    blockchain.toHumanDate(endTime);
            } else if (result.event === "DividendPayed") {
                entry.detail =
                    ", Account: " +
                    blockchain.toShortAddress(result.returnValues[0]) +
                    ", BMT: " +
                    blockchain.toHumanNumber(result.returnValues[1]) +
                    ", Msg: " +
                    result.returnValues[2];
            } else {
                entry.detail = "coming soon";

                console.dir(result);
                console.dir(result.returnValues);
            }

            store.dispatch("addEvent", entry);
            //await this.updateParent();
        }
    },

    bvtEventListener(error, result) {
        if (error) {
            console.error("BVTEvent Err: " + error);
        }
        console.log("BVTEvent: " + result.event);


        if (result) {
            var entry = {};
            entry.id = result.id;
            entry.name = result.event;

            if (result.event === "Transfer") {
                entry.detail =
                    "From: " +
                    blockchain.toShortAddress(result.returnValues[0]) +
                    ", To: " +
                    blockchain.toShortAddress(result.returnValues[1]) +
                    ", BVT: " +
                    result.returnValues[2]
            } else {
                entry.detail = "coming soon";
                entry.detail = result.returnValues;
                console.dir(result);
                console.dir(result.returnValues);
            }

            store.dispatch("addBvtEvent", entry);
        }
    }
}

export default events;