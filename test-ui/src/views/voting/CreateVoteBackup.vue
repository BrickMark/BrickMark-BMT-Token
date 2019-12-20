<template>
  <div>
    <v-stepper v-model="step" vertical>
      <v-stepper-step :complete="step > 1" step="1">
        Create a new Voting
        <small>BVT Voting Deployment and Distribution</small>
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-container id="options-dropdown">
          <v-row>
            <v-col cols="4">
              Provide basic information about the vote.
              What is the voting text. Also provide the numbers of voting options.
              The voting options should align with the options described in the voting text.
            </v-col>
            <v-col cols="4">
              <v-textarea
                outlined
                v-model="votingText"
                name="input-7-4"
                label="Voting Text"
                required
                rows="4"
              ></v-textarea>
              <div>Voting Options</div>
              <div>
                <v-overflow-btn
                  v-model="votingOption"
                  :items="dropdown_selection"
                  label="Options"
                  target="#options-dropdown"
                ></v-overflow-btn>
              </div>
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </v-container>
        <v-btn @click="step = 2" color="warning" v-on:click="createContract()">Create Contract</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="step > 2" step="2">Distribute Voting Tokens</v-stepper-step>

      <v-stepper-content step="2">
        <v-container>
          <v-row>
            <v-col cols="8">
              The Voting Smart Contract (BVT) is an ERC-20 Token Contract.
              In this step we will distribute (mint) tokens to the voters. The amount of tokens minted to each voter
              will be equal to the amount of BMT tokens they own at the time this action is executed.
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </v-container>
        <v-btn color="warning" @click="step = 3" v-on:click="tokenDistribute()">Distribute Tokens</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="step > 3" step="3">End date and start</v-stepper-step>

      <v-stepper-content step="3">
        <v-container>
          <v-row>
            <v-col cols="4">
              Before the voting can be started an end date has to be configured.
              Until that date and time the voting contract will accept votes.
            </v-col>
            <v-col cols="4">
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
          </v-row>
          <v-divider></v-divider>
        </v-container>

        <v-btn color="warning" @click="step = 4" v-on:click="startVoting()">Start the Voting</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="step == 4" step="4">End date and start</v-stepper-step>
      <v-stepper-content step="4">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-alert type="success">I'm a success alert.</v-alert>
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </v-container>
      </v-stepper-content>
    </v-stepper>

    <!-- <v-form>
      <v-container id="options-dropdown" class="white">
        <v-row>
          <v-col cols="12" md="5">
            <v-textarea
              outlined
              v-model="votingText"
              name="input-7-4"
              label="Voting Text"
              required
              rows="6"
            ></v-textarea>
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
    </v-form>-->
  </div>
</template>

<script>
import blockchain from "../../js/blockchainInterface";
import eventListener from "../../js/eventListener";

export default {
  data: () => ({
    step: 1,
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
      this.step = 2;
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
      this.step = 3;
    },
    async startVoting() {
      console.log("Start Voting");
      const unixTime = Date.parse(this.votingEndDate + "T00:00:00Z") / 1000;
      await blockchain.startVoting(this.$store.getters.bvtAddress, unixTime);

      this.$store.dispatch("updateBvtInfo");
      this.btnCreate = false;
      this.btnDistribute = false;
      this.btnStart = false;
      this.step = 4;
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