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
            <v-col sm="2">
              <v-subheader>Mint</v-subheader>
            </v-col>
            <v-col sm="7">
              <v-text-field label="BMT" v-model="bmtToMint"></v-text-field>
            </v-col>
            <v-col sm="3">
              <v-btn small color="primary" v-on:click="mint()" block>Mint</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="2">
              <v-subheader>Mint Vested</v-subheader>
            </v-col>
            <v-col sm="3">
              <v-text-field label="BMT" v-model="bmtVestedToMint"></v-text-field>
            </v-col>
            <v-col sm="4">
              <v-menu
                v-model="vestingDateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="bmtVestingDate"
                    label="Vesting end date"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="bmtVestingDate" @input="vestingDateMenu = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col sm="3">
              <v-btn small color="primary" v-on:click="mintVested()" block>Mint Vested</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="2">
              <v-subheader>Pay Dividend</v-subheader>
            </v-col>
            <v-col sm="3">
              <v-text-field label="BMT" v-model="bmtDividend"></v-text-field>
            </v-col>
            <v-col sm="4">
              <v-text-field label="Message" v-model="dividendMsg"></v-text-field>
            </v-col>
            <v-col sm="3">
              <v-btn small color="primary" v-on:click="payDividend()" block>Pay Dividend</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="9">
              <v-subheader>Hide user from table</v-subheader>
            </v-col>
            <v-col sm="3">
              <v-btn small color="danger" v-on:click="hideUser()" block>Hide User</v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import blockchain from "../js/blockchainInterface";

export default {
  name: "InvestorAction",
  props: {
    investor: {
      type: Object
    }
  },
  data() {
    return {
      bmtToMint: 1,
      bmtVestedToMint: 2,
      bmtVestingDate: new Date().toISOString().substr(0, 10),
      vestingDateMenu: false,
      bmtDividend: 3,
      dividendMsg: "2019 Dividend",
      dialog: false
    };
  },
  computed: {},
  methods: {
    async mint() {
      console.log("Mint:" + this.bmtToMint);
      await blockchain.mint(this.investor.address, this.bmtToMint);
    },
    async mintVested() {
      console.log(
        `Mint Vested: ${this.bmtVestedToMint}, time: ${this.bmtVestingDate}`
      );

      const unixTime = Date.parse(this.bmtVestingDate + "T00:00:00Z") / 1000;
      await blockchain.mintVested(
        this.investor.address,
        this.bmtVestedToMint,
        unixTime
      );
    },
    async payDividend() {
      console.log(`Dividend: ${this.bmtDividend}, time: ${this.dividendMsg}`);
      await blockchain.payDividend(
        this.investor.address,
        this.bmtDividend,
        this.dividendMsg
      );
    },
    async hideUser() {
      console.log("Hide user from table");
      this.$store.dispatch("removeUser", this.investor);
    }
  },
  async created() {}
};
</script>
<style lang="scss" scoped>
</style>