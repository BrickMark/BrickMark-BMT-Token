<template>
  <v-form>
    <v-container id="options-dropdown">
      <v-row>
        <v-col cols="12" md="5">
          <v-textarea outlined v-model="votingText" name="input-7-4" label="Voting Text" required></v-textarea>
        </v-col>
        <v-col cols="12" md="4">
          <div>Voting Options</div>
          <div>
            <v-overflow-btn
              v-model="votingOption"
              :items="dropdown_selection"
              label="Options"
              target="#options-dropdown"
            ></v-overflow-btn>
          </div>
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field v-model="votingEndDate" label="Voting end date" readonly v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="votingEndDate" @input="dateMenu = false"></v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="12" md="3">
          <div class="my-2">
            <v-btn
              color="warning"
              :disabled="!btnCreate"
              block
              v-on:click="createContract()"
            >Create Contract</v-btn>
          </div>
          <div class="my-2">
            <v-btn
              color="warning"
              v-on:click="tokenDistribute()"
              :disabled="!btnDistribute"
              block
            >Distribute Voting Tokens</v-btn>
          </div>
          <div class="my-2">
            <v-btn
              color="warning"
              v-on:click="startVoting()"
              :disabled="!btnStart"
              block
            >Start Voting</v-btn>
          </div>
          <div class="my-2">
            <v-btn color="info" v-on:click="reloadData()" block>Refresh Tables</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import blockchain from "../../js/blockchainInterface";
import eventListener from "../../js/eventListener";

export default {
  data: () => ({
    votingText: "Voting text here",
    votingOption: "2",
    dropdown_selection: ["2", "3", "4", "5", "6"],
    votingEndDate: new Date(Date.now() + 1000 * 60 * 60 * 24)
      .toISOString()
      .substr(0, 10),
    dateMenu: false,
    btnCreate: true,
    btnDistribute: false,
    btnStart: false
  }),
  methods: {
    async createContract() {
      console.log("Create Voting Contract");
      var address = await blockchain.deployVoting(
        this.votingText,
        parseInt(this.votingOption)
      );
      this.$store.dispatch("setBvtAddress", address);
      this.$store.dispatch("updateBvtInfo");
      this.$store.dispatch("updateBvtUsers");

      let contractEvents = await blockchain.getAllBvtEvents(address);
      contractEvents.allEvents(eventListener.bvtEventListener);

      const unixTime = Date.parse(this.votingEndDate + "T00:00:00Z") / 1000;
      this.btnCreate = false;
      this.btnDistribute = true;
      this.btnStart = false;
      //https://vuetifyjs.com/en/components/steppers
    },
    async tokenDistribute() {
      console.log("Distribute Voting Tokens");

      await blockchain.mintVoting(
        this.$store.getters.bvtAddress,
        this.$store.getters.users
      );
      this.$store.dispatch("updateBvtInfo");
      this.$store.dispatch("updateBvtUsers");
      this.btnCreate = false;
      this.btnDistribute = false;
      this.btnStart = true;
    },
    async startVoting() {
      console.log("Start Voting");
      const unixTime = Date.parse(this.votingEndDate + "T00:00:00Z") / 1000;
      await blockchain.startVoting(this.$store.getters.bvtAddress, unixTime);

      this.$store.dispatch("updateBvtInfo");
      this.btnCreate = false;
      this.btnDistribute = false;
      this.btnStart = false;
    },
    async reloadData() {
      this.$store.dispatch("updateBvtInfo");
      this.$store.dispatch("updateBvtUsers");
    }
  }
};
</script>

<style>
</style>