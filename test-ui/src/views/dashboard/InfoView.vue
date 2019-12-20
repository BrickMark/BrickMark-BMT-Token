<template>
  <div>
    <v-simple-table dense>
      <template v-slot:default>
        <tbody>
          <tr>
            <td>BMT Address</td>
            <td>{{$store.getters.bmtInfo.address}}</td>
          </tr>
          <tr>
            <td>Name / Symbol</td>
            <td>{{$store.getters.bmtInfo.name}} / {{$store.getters.bmtInfo.symbol}}</td>
          </tr>
          <tr>
            <td>Decimals</td>
            <td>{{$store.getters.bmtInfo.decimals}}</td>
          </tr>
          <tr>
            <td>Total Supply</td>
            <td v-if="$store.getters.exactBalance == true">{{ $store.getters.bmtInfo.totalSupply}}</td>
            <td v-else>{{ $store.getters.bmtInfo.hTotalSupply}}</td>
          </tr>
          <tr>
            <td>Paused / Frozen</td>
            <td>
              <v-chip
                class="ma-2"
                color="green"
                text-color="white"
                v-if="!$store.getters.bmtInfo.paused"
                x-small
              >Active</v-chip>
              <v-chip
                class="ma-2"
                color="warning"
                text-color="white"
                v-if="$store.getters.bmtInfo.paused"
                x-small
              >Paused</v-chip>
              <v-chip
                class="ma-2"
                color="red"
                text-color="white"
                v-if="$store.getters.bmtInfo.frozen"
                x-small
              >Frozen</v-chip>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import blockchain from "../../js/blockchainInterface";

export default {
  name: "InfoView"
};
</script>
<style lang="scss" scoped>
</style>