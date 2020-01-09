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
            <td>{{ investor.shortAddress }}</td>
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
  }
};
</script>
<style lang="scss" scoped>
</style>