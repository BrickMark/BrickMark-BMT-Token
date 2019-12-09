<template>
  <div>
    <h1>Investors</h1>
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
          </tr>
        </thead>
        <tbody>
          <tr v-for="investor in investors" v-bind:key="investor.address">
            <td>{{ investor.name }}</td>
            <td>{{ investor.address }}</td>
            <td>{{ investor.balance }}</td>
            <td>{{ investor.vested }}</td>
            <td>{{ investor.vestingEndTime }}</td>
            <td>{{ investor.vestedBalance }}</td>
            <td>{{ investor.spendableBalance }}</td>

          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import blockchain from "../js/blockchainInterface";

export default {
  name: "Investors",
  data() {
    return {
      investors: []
    };
  },
  computed: {},
  methods: {
    async getInvestors() {
      // return await blockchain.getInvestors();
    }
  },
  async created() {
    this.investors = await blockchain.getInvestors();
    console.dir(this.investors);
  }
};
</script>
<style lang="scss" scoped>
</style>