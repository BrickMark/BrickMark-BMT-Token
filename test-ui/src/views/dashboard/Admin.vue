<template>
  <div>
    <div>Contract state</div>
    <v-btn @click="pause()" color="primary" x-small>Pause</v-btn>
    <v-btn @click="unpause()" color="primary" x-small>Unpause</v-btn>
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
    }
  },
  created() {}
};
</script>

<style>
</style>