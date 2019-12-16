<template>
  <div>
    <h1>Investors</h1>
    <v-checkbox v-model="exactBalances" label="Show exact balances"></v-checkbox>
    <v-btn x-small  v-on:click="refresh()">Refresh</v-btn>

    <InfoView v-bind:investors="investors" v-bind:exactBalances="exactBalances" />

    <br />
    <br />

    <InvestorView v-bind:investors="investors" v-bind:exactBalances="exactBalances" />
    <Admin />
    <Events v-on:eventToParent="newEvent" />

  </div>
</template>

<script>
import blockchain from "../js/blockchainInterface";
import Admin from "./Admin";
import Events from "./Events";
import InfoView from "./InfoView";
import InvestorView from "./InvestorView";

export default {
  name: "Investors",
  components: {
    Admin,
    Events,
    InfoView,
    InvestorView
    // MintAndMore
  },
  data() {
    return {
      investors: [],
      exactBalances: true
    };
  },
  methods: {
    // Triggered when `childToParent` event is emitted by the child.
    newEvent(value) {
      this.investors = value;
    },
    async refresh() {
      console.log("manual refresh");
      this.investors = await blockchain.getInvestors();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>