<template>
  <v-form >
    <v-container id="options-dropdown">
      <v-row>
        <v-col cols="12" md="6">
          <v-textarea
            outlined
            v-model="votingText"
            name="input-7-4"
            label="Voting Text"
            required
          ></v-textarea>
        </v-col>
        <v-col cols="12" md="2">
            <p>Voting options</p>
          <v-overflow-btn
            class="my-2"
            v-model="votingOption"
            :items="dropdown_selection"
            label="Options"
            target="#options-dropdown"
          ></v-overflow-btn>
        </v-col>
        <v-col cols="12" md="2">
            <div class="my-2">
            <v-btn color="warning" dark v-on:click="createContract()">Create Contract</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import blockchain from "../../js/blockchainInterface";

export default {
  data: () => ({
    votingText: "Voting text here",
    votingOption: '2',
    dropdown_selection: ["2", "3", "4", "5", "6"],
  }), 
   methods: {
    async createContract() {
      console.log("Create Cpontract");
      var address = await blockchain.deployVoting(this.votingText, parseInt(this.votingOption));
      this.$store.dispatch("setBvtAddress", address);
      this.$store.dispatch("updateBvtInfo");
      //https://vuetifyjs.com/en/components/steppers
    },
   }
};
</script>

<style>
</style>