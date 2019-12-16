<template>
  <div>
    <h1>Investors</h1>
    <v-checkbox v-model="exactBalances" label="Show exact balances"></v-checkbox>
    <v-btn x-small v-on:click="refresh()">Refresh</v-btn>

    <InfoView />

    <br />
    <br />

    <InvestorView />

    <Admin />
    <Events />
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
  },
  computed: {
    exactBalances: {
      get() {
        return this.$store.getters.exactBalance;
      },
      set(value) {
        this.$store.dispatch("updateExactBalance", value);
      }
    }
  },
  methods: {
    async refresh() {
      console.log("manual refresh");
      this.$store.dispatch("updateAllUsers", this.$store.getters.users);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>