<template>
  <div>
    <h1>MintAndMore</h1>
          <!-- <v-combobox v-model="select" :items="items" label="I use chips" ></v-combobox> -->

    <br />
  </div>
</template>

<script>
import blockchain from "../js/blockchainInterface";
//import Vuetify from 'vuetify/lib';

export default {
  name: "MintAndMore",

  data() {
    return {
      simpleInvestors: [],
      select: ["Programming", "Design"],
      items: ["Programming", "Design", "Vue", "xx"]
    };
  },
  computed: {},
  methods: {
    async pause() {
      console.log("pause");
    },
    async unpause() {
      console.log("unpause");
    }
  },
  created() {
    this.simpleInvestors = blockchain.getInvestorsSimple();
  }
};
</script>

<style>
</style>