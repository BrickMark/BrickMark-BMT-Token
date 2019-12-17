<template>
  <div>
    <h1>Admin</h1>
    <p>Admin functionalities</p>
    <div>Contract state</div>
    <v-btn @click="pause()">Pause</v-btn>
    <v-btn @click="unpause()">Unpause</v-btn>

    <br />
    <br />
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