import Vue from 'vue'
import Vuex from 'vuex'
import blockchain from "../js/blockchainInterface"

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        users: [
            { "name": "bmt1", "address": "0xb086E03bcBb7f7F486209Dc23A78CFBeBEE169D9" },
            { "name": "bmt2", "address": "0x2F6c3a35CfD7460c3d9952cdcC45CCf63D36e8AB" },
            { "name": "bmt3", "address": "0x2B1cF63Ac93BfFdb5FbE8CC43010fA9fa92ED2D1" },
            { "name": "bmt4", "address": "0xFC398aA810Bb07901813A4CE81c1654D1466b0eE" },
            { "name": "tokenHolder1", "address": "0xb8ce4Ba055cB8A4bEd923C32B1a5d15aCF4f9E8F" },
            { "name": "tokenHolder2", "address": "0x2a04950a2D9C8e0B2AFa6E47CEd8Aac35160696D" },
            { "name": "tokenHolder3", "address": "0x9258b85C2BDAE58037ECbdd016993AD38652ba1a" },
            { "name": "tokenHolder4", "address": "0xE919f4fD92c6c920afFFb7E319Dbee3D34BD214e" },
            { "name": "vestedTokenHolder1", "address": "0xB90ce21773FEB81d88AE5cF371D8dFcb88420A6F" },
            { "name": "vestedTokenHolder2", "address": "0x904597a138D9A335749b8042C1e41Dc8a32EdeA7" }
        ],
        exactBalance: false,
        bmtAddress: "0x7D586da8c71163e41cba108e6624b94B2de9EaaB",
        bmtInfo: {},
        // bvtAddress: "0x24556b7D1d135136Eac70771f933948115b5a681",
        bvtAddress: null,
        bvtInfo: {},
        bvtUsers: [],
        bvtEvents: [],
        events: []
    },
    mutations: {
        setUsers(state, users) {
            state.users = users;
        },
        addUser(state, user) {
            state.users.push(user);
        },
        removeUser(state, user) {
            state.users = state.users.filter(function (value, index, arr) {
                return value.address !== user.address;
            });
        },
        updateExactBalance(state, value){
            state.exactBalance = value;
        },
        updateBmtInfo(state, bmtInfo) {
            state.bmtInfo = bmtInfo;
        },
        addEvent(state, event) {
            state.events.unshift(event);
        },
        setBvtAddress(state, address) {
            state.bvtAddress = address;
        },
        updateBvtInfo(state, bvtInfo) {
            state.bvtInfo = bvtInfo;
        },
        setBvtUsers(state, bvtUsers) {
            state.bvtUsers = bvtUsers;
        },
        addBvtEvent(state, event) {
            state.bvtEvents.unshift(event);
        }
    },
    actions: {
        updateAllUsers: async (context) => {
            var users = store.getters.users;
            var updatedUsers = [];
            for(var i=0; i<users.length; i++){
                var newUser = await blockchain.getInvestorInfo(users[i].address, users[i].name);
                updatedUsers.push(newUser);
               // context.commit('addUser', newUser);

            }
            context.commit('setUsers', updatedUsers);
        },
        removeUser: (context, user) => {
            context.commit('removeUser', user);
        },
        addUser: async (context, user) => {
            var newUser = await blockchain.getInvestorInfo(user.address, user.name);
            context.commit('addUser', newUser);
        },
        updateExactBalance: (context, value) => {
            context.commit('updateExactBalance', value);
        },
        updateBmtInfo: async (context) => {
            var info = await blockchain.getBMTInfo();
            context.commit('updateBmtInfo', info);
        },
        addEvent: (context, newEvent) => {
            context.commit('addEvent', newEvent);
            store.dispatch("updateBmtInfo");
            store.dispatch("updateAllUsers");
        },
        setBvtAddress: (context, address) => {
            context.commit('setBvtAddress', address);
        },
        updateBvtInfo: async (context) => {
            var bvtAddress = store.getters.bvtAddress;
            var info = await blockchain.getBvtInfo(bvtAddress);
            context.commit('updateBvtInfo', info);
        },
        updateBvtUsers: async (context) => {
            if(store.getters.bvtAddress == null){
                return;
            }

            var users = store.getters.users;
            var bvtUsers = [];
            for(var i=0; i<users.length; i++){
                bvtUsers.push({name: users[i].name, address: users[i].address});
            }
            var updatedUsers = [];
            var bvtAddress = store.getters.bvtAddress;
            for(var j=0; j<users.length; j++){
                var newUser = await blockchain.getBvtUserInfo(bvtAddress, bvtUsers[j].address, bvtUsers[j].name);
                updatedUsers.push(newUser);
            }
            context.commit('setBvtUsers', updatedUsers);
        },
        addBvtEvent: (context, newEvent) => {
            console.log("addBvtEvent2");
            context.commit('addBvtEvent', newEvent);
            store.dispatch("updateBvtInfo");
            store.dispatch("updateBvtUsers");  
        }
    },
    getters: {
        users: state => state.users,
        exactBalance: state => state.exactBalance,
        bmtAddress: state => state.bmtAddress,
        bmtInfo: state => state.bmtInfo,
        events: state => state.events,
        bvtAddress: state => state.bvtAddress,
        bvtInfo: state => state.bvtInfo,
        bvtUsers: state => state.bvtUsers,
        bvtEvents: state => state.bvtEvents
    }

});