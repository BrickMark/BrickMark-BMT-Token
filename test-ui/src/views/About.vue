<template>
  <div>
    <h1>This is an about page</h1>

    <div>Users:</div>
    <v-list class="pa-0">
      <div v-for="user in $store.getters.users" :key="user.address">
        <div>{{user.name}}, {{user.address}}</div>
      </div>
    </v-list>
  </div>
</template>

<script>
export default {
  name: "About"
};
</script>