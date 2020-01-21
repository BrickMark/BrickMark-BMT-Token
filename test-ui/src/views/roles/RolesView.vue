<template>
  <div>
    <v-simple-table dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Address</th>
            <th class="text-left">Minter</th>
            <th class="text-left">Pauser</th>
            <th class="text-left">Options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="investor in $store.getters.users" v-bind:key="investor.address">
            <td>{{ investor.name }}</td>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn text x-small @click="copy(investor.address)">
                    <div v-on="on">{{ investor.shortAddress }}</div>
                  </v-btn>
                </template>
                <span>copy address to clipboard</span>
              </v-tooltip>
            </td>
            <td>{{ investor.minter }}</td>
            <td>{{ investor.pauser }}</td>
            <td>
              <RolesAction v-bind:investor="investor" />
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import blockchain from "../../js/blockchainInterface";
import RolesAction from "./RolesAction";

export default {
  name: "RolesView",
  components: {
    RolesAction
  },
  methods: {
    copy(address) {
      this.$clipboard(address);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>