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
        exactBalance: true,
        bmtAddress: "0x7D586da8c71163e41cba108e6624b94B2de9EaaB",
        bmtInfo: {},
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
            console.log("add: " + event);
            state.events.unshift(event);
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
        }
    },
    getters: {
        users: state => state.users,
        exactBalance: state => state.exactBalance,
        bmtAddress: state => state.bmtAddress,
        bmtInfo: state => state.bmtInfo,
        events: state => state.events
    }

});