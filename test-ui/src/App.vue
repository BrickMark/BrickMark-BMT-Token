<template>
    <v-app>
        <Header />
    </v-app>
</template>

<script>
import Header from "./components/layout/Header.vue";

export default {
  name: "App",
  components: {
    Header
  },
  created: function () {
    console.log("App loaded");
    this.$store.dispatch("updateAllUsers", this.$store.getters.users);
  }
  
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
