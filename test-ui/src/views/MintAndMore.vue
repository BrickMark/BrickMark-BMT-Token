<template>
  <div>
    <h1>MintAndMore</h1>
          <!-- <v-combobox v-model="select" :items="items" label="I use chips" ></v-combobox> -->


        <v-combobox
          v-model="select"
          :items="items"
          label="Select a favorite activity or create a new one"
        ></v-combobox>

  </div>
</template>

<script>
import blockchain from "../js/blockchainInterface";

export default {
  name: "MintAndMore",
  data() {
    return {
      simpleInvestors: [],
       select: 'Programming',
        items: [
          'Programming',
          'Design',
          'Vue',
          'Vuetify',
        ]
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