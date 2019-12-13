<template>
  <div>
    <h1>MintAndMore</h1>

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <!-- <v-combobox v-model="select" :items="items" label="I use chips" multiple chips></v-combobox> -->
        </v-col>
      </v-row>
    </v-container>
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