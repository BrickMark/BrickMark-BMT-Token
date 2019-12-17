<template>
  <v-card class="mx-auto" tile>

    <v-list-item two-line v-for="event in $store.getters.events" v-bind:key="event.id">
      <v-list-item-content>
        <v-list-item-title>{{event.name}}</v-list-item-title>
        <v-list-item-subtitle>{{event.detail}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  name: "Events",
};
</script>

<style>
</style>