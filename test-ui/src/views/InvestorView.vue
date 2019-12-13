<template>
  <div>
    <v-container class="px-0" fluid>
      <v-checkbox v-model="exactBalances" label="Show exact balances"></v-checkbox>
    </v-container>

    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Investor</th>
            <th class="text-left">Balance</th>
            <th class="text-left">Vested</th>
            <th class="text-left">Vesting end Time</th>
            <th class="text-left">Vested Balance</th>
            <th class="text-left">Spendable Balance</th>
            <th class="text-left">Options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="investor in investors" v-bind:key="investor.address">
            <td>{{ investor.name }}</td>
            <td>{{ investor.shortAddress }}</td>

            <td v-if="exactBalances == true">{{investor.balance }}</td>
            <td v-else>{{ investor.hBalance }}</td>

            <td>{{ investor.vested }}</td>
            <td>{{ investor.hVestingEndTime }}</td>

            <td v-if="exactBalances == true">{{investor.vestedBalance }}</td>
            <td v-else>{{ investor.hVestedBalance }}</td>

            <td v-if="exactBalances == true">{{investor.spendableBalance }}</td>
            <td v-else>{{ investor.hSpendableBalance }}</td>

            <td>
              <v-btn text small color="primary">+</v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import blockchain from "../js/blockchainInterface";

export default {
  name: "InvestorView",
  data() {
    return {
      investors: [],
      timer: "",
      exactBalances: false
    };
  },
  computed: {},
  methods: {
    async refresh() {
      console.log("refresh");
      this.investors = await blockchain.getInvestors();
    }
  },
  async created() {
    await this.refresh();
    this.timer = setInterval(this.refresh, 10000);
  },
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>
<style lang="scss" scoped>
</style>