<template>
  <div>
    <h1>Events</h1>
    <Events />
    <div>Users:</div>
    <v-list class="pa-0">
      <div v-for="user in $store.getters.users" :key="user.address">
        <div>{{user.name}}, {{user.address}}</div>
      </div>
    </v-list>
  </div>
</template>

<script>
import Events from "./events/Events";
export default {
  name: "EventsApp",
  components: {
    Events
  }
};
</script>