<template>
  <v-simple-table dense>
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
            <div class="text-center">
              <v-dialog v-model="investor.dialog" width="500">
                <template v-slot:activator="{ on }">
                  <v-btn text small color="primary" v-on="on">+</v-btn>
                </template>

                <v-card>
                  <v-card-title class="headline grey lighten-2" primary-title>Action</v-card-title>

                  <InvestorAction v-bind:investor="investor" />

                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      text
                      @click="investor.dialog = false"
                    >Close</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import blockchain from "../js/blockchainInterface";
import InvestorAction from "./InvestorAction";

export default {
  name: "InvestorView",
  components: {
    InvestorAction
  }
};
</script>
<style lang="scss" scoped>
</style>