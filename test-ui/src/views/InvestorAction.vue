<template>
  <div>
    Hello Investor {{investor.name}}
    <h3>MINT</h3>
    <v-row>
      <v-col cols="4">
        <v-subheader>Mint</v-subheader>
      </v-col>
      <v-col cols="3">
        <v-text-field label="BMT" v-model="bmtToMint"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn small color="primary" v-on:click="mint()">Mint</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import blockchain from "../js/blockchainInterface";

export default {
  name: "InvestorAction",
  props: {
    investor: {
      type: Object
    }
  },
  data() {
    return {
      bmtToMint: 3
    };
  },
  computed: {},
  methods: {
    async mint() {
      console.log("Mint the shit:" + this.bmtToMint);
      await blockchain.mint(this.investor.address, this.bmtToMint)
    }
  },
  async created() {}
};
</script>
<style lang="scss" scoped>
</style>