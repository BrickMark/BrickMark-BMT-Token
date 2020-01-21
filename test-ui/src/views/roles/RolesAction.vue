<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn text small color="primary" v-on="on">+</v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Action: {{investor.name}}</v-card-title>

        <v-container class="grey lighten-5">
          <v-row>
            <v-col sm="9">
              <v-subheader>Add {{investor.name}} to the Minter role</v-subheader>
            </v-col>
            <v-col sm="3">
              <v-btn
                small
                color="warning"
                v-on:click="addMinter()"
                block
                :disabled="!isMinter"
              >Add User</v-btn>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col sm="9">
              <v-subheader>Add {{investor.name}} to the Pauser role</v-subheader>
            </v-col>
            <v-col sm="3">
              <v-btn
                small
                color="warning"
                v-on:click="addPauser()"
                block
                :disabled="!isMinter"
              >Add User</v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import blockchain from "../../js/blockchainInterface";

export default {
  name: "InvestorAction",
  props: {
    investor: {
      type: Object
    }
  },
  data() {
    return {
      dialog: false,
      isMinter: false,
      isPauser: false
    };
  },
  methods: {
    async addPauser() {
      await blockchain.addPauser(this.investor.address);
    },
    async addMinter() {
      await blockchain.addMinter(this.investor.address);
    }
  },
  async created() {
    var address = await blockchain.getActiveAccount();
    var user = await blockchain.getInvestorInfo(address);
    this.isMinter = user.minter;
    this.isPauser = user.pauser;
  }
};
</script>
<style lang="scss" scoped>
</style>