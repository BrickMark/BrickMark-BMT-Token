<template>
  <div>
    <div>Contract state</div>
    <v-btn @click="pause()" color="warning" x-small :disabled="$store.getters.bmtInfo.paused">Pause</v-btn>
    <v-btn @click="unpause()" color="warning" x-small :disabled="!$store.getters.bmtInfo.paused">Unpause</v-btn>
    <v-btn x-small v-on:click="refresh()" color="primary">Refresh</v-btn>
  </div>
</template>

<script>
import blockchain from "../../js/blockchainInterface";

export default {
  name: "Admin",
  computed: {},
  methods: {
    async pause() {
      console.log("pause");
      await blockchain.pause();
    },
    async unpause() {
      console.log("unpause");
      await blockchain.unpause();
    },
    async refresh() {
      this.$store.dispatch("updateBmtInfo");
      this.$store.dispatch("updateAllUsers");
    }
  },
  created() {}
};
</script>

<style>
</style>