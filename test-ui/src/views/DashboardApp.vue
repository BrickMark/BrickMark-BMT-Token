<template>
  <div>
    <h1>BMT Dashboard</h1>
    <v-checkbox v-model="exactBalances" label="Show exact balances"></v-checkbox>
    <v-btn x-small v-on:click="refresh()">Refresh</v-btn>

    <InfoView />

    <br />
    <br />

    <InvestorView />
    <Admin />
  </div>
</template>

<script>
import blockchain from "../js/blockchainInterface";
import Admin from "./dashboard/Admin";
import InfoView from "./dashboard/InfoView";
import InvestorView from "./dashboard/InvestorView";

export default {
  name: "DashboardApp",
  components: {
    Admin,
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
      this.$store.dispatch("updateBmtInfo");
      this.$store.dispatch("updateAllUsers", this.$store.getters.users);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>