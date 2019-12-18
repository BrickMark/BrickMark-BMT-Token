<template>
  <v-container id="options-dropdown">
    <v-row>
      <v-col cols="6">
        <v-card class="mx-auto" tile>
          <v-app-bar color="indigo" dark>
            <v-toolbar-title>BMT Events</v-toolbar-title>
          </v-app-bar>
          <v-list-item two-line v-for="event in $store.getters.events" v-bind:key="event.id">
            <v-list-item-content>              
              <v-list-item-title>{{event.name}}</v-list-item-title>
              <v-list-item-subtitle>{{event.detail}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="mx-auto" tile >
          <v-app-bar color="indigo" dark>
            <v-toolbar-title>Voting Events</v-toolbar-title>
          </v-app-bar>
          <v-list-item two-line v-for="bvtEvent in $store.getters.bvtEvents" v-bind:key="bvtEvent.id">
            <v-list-item-content>
              <v-list-item-title>{{bvtEvent.name}}</v-list-item-title>
              <v-list-item-subtitle>{{bvtEvent.detail}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Events"
};
</script>

<style>
</style>