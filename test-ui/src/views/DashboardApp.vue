<template>
  <div>
    <h1 class="pa-2">BMT Dashboard</h1>
    <v-container class="grey lighten-5" >
      <v-row no-gutters >
        <v-col sm="6" >
          <v-card class="pa-2" outlined tile>
            <InfoView />
          </v-card>
        </v-col>
        <v-col sm="6">
          <v-card class="pa-2" outlined tile>
            <Admin />
            <v-checkbox v-model="exactBalances" label="Show exact balances" x-small></v-checkbox>
            <v-btn x-small v-on:click="refresh()">Refresh</v-btn>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="12">
          <v-card class="pa-2" outlined tile>
            <InvestorView />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
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
      this.$store.dispatch("updateAllUsers");
    }
  }
};
</script>
<style lang="scss" scoped>
</style>