<template>
  <div>
    <v-simple-table dense>
      <template v-slot:default>
        <tbody>
          <tr>
            <td>Name / Symbol</td>
            <td>{{info.name}} / {{info.symbol}}</td>
          </tr>
          <tr>
            <td>Decimals</td>
            <td>{{info.decimals}}</td>
          </tr>
          <tr>
            <td>Total Supply</td>
            <td v-if="$store.getters.exactBalance == true">{{ info.totalSupply}}</td>
            <td v-else>{{ info.hTotalSupply}}</td>
          </tr>
          <tr>
            <td>Paused / Frozen</td>
            <td>{{info.paused}} / {{info.frozen}}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import blockchain from "../js/blockchainInterface";

export default {
  name: "InfoView",
  data() {
    return {
      info: {},
      timer: "",
    };
  },
  computed: {},
  methods: {
    async refresh() {
      console.log("refresh");
      this.info = await blockchain.getBMTInfo();
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