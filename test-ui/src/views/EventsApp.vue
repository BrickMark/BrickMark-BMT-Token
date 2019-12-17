<template>
  <div>
    <h1 class="pa-2">Events</h1>
    <Events />
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