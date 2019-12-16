<template>
  <v-card class="mx-auto" max-width="400" tile>
    <v-app-bar>
      <v-toolbar-title>Events</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-list-item two-line v-for="event in events" v-bind:key="event.id">
      <v-list-item-content>
        <v-list-item-title>{{event.name}}</v-list-item-title>
        <v-list-item-subtitle>{{event.detail}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import blockchain from "../js/blockchainInterface";

export default {
  name: "Events",
  data() {
    return {
      events: []
    };
  },
  computed: {},
  methods: {
    async eventListener(error, result) {
      console.dir(error);
      console.dir(result);
      console.dir(result.returnValues);
      if (result) {
        var entry = {};
        entry.id = result.id;
        entry.name = result.event;

        if (result.event === "Paused") {
          entry.detail =
            "From: " + blockchain.toShortAddress(result.returnValues[0]);
        } else if (result.event === "Unpaused") {
          entry.detail =
            "From: " + blockchain.toShortAddress(result.returnValues[0]);
        } else if (result.event === "Transfer") {
          entry.detail =
            "From: " +
            blockchain.toShortAddress(result.returnValues[0]) +
            ", To: " +
            blockchain.toShortAddress(result.returnValues[1]) +
            ", BMT: " +
            blockchain.toHumanNumber(result.returnValues[2]);
        } else if (result.event === "AccountVested") {
          var endTime = parseInt(result.returnValues[1]);
          entry.detail =
            ", Account: " +
            blockchain.toShortAddress(result.returnValues[0]) +
            ", End Time: " +
            blockchain.toHumanDate(endTime);
        } else if (result.event === "DividendPayed") {
          entry.detail =
            ", Account: " +
            blockchain.toShortAddress(result.returnValues[0]) +
            ", BMT: " +
            blockchain.toHumanNumber(result.returnValues[1]) +
            ", Msg: " +
            result.returnValues[2];
        } else {
          entry.detail = "coming soon";
        }
        var tmp = this.events.reverse();
        tmp.push(entry);
        this.events = tmp.reverse();

        await this.updateParent();
      }
    },

    async updateParent() {
      this.$store.dispatch("updateBmtInfo");
      this.$store.dispatch("updateAllUsers", this.$store.getters.users);
    }
  },
  async created() {
    let contractEvents = await blockchain.getAllEvents();
    contractEvents.allEvents(this.eventListener);
    await this.updateParent();
  }
};
</script>

<style>
</style>