<template>
  <div>
    <v-simple-table dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Address</th>
            <th class="text-left">Balance</th>
            <th class="text-left">Vested</th>
            <th class="text-left">Vesting end Time</th>
            <th class="text-left">Vested Balance</th>
            <th class="text-left">Spendable Balance</th>
            <th class="text-left">Options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="investor in $store.getters.users" v-bind:key="investor.address">
            <td>{{ investor.name }}</td>
            <td>{{ investor.shortAddress }}</td>

            <td v-if="$store.getters.exactBalance == true">{{investor.balance }}</td>
            <td v-else>{{ investor.hBalance }}</td>

            <td>{{ investor.vested }}</td>
            <td>{{ investor.hVestingEndTime }}</td>

            <td v-if="$store.getters.exactBalance == true">{{investor.vestedBalance }}</td>
            <td v-else>{{ investor.hVestedBalance }}</td>

            <td v-if="$store.getters.exactBalance == true">{{investor.spendableBalance }}</td>
            <td v-else>{{ investor.hSpendableBalance }}</td>

            <td>
              <InvestorAction v-bind:investor="investor" />
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <AddUser />
  </div>
</template>

<script>
import blockchain from "../../js/blockchainInterface";
import InvestorAction from "./InvestorAction";
import AddUser from "./AddUser";

export default {
  name: "InvestorView",
  components: {
    InvestorAction,
    AddUser
  }
};
</script>
<style lang="scss" scoped>
</style>