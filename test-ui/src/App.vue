<template>
  <v-app id="inspire">
    <Navbar />
    <v-content>
      <router-view />
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import blockchain from "./js/blockchainInterface";
import eventListener from "./js/eventListener"
import Navbar from './components/Navbar'
import Footer from './components/Footer'
export default {

  name: "App",
  components: {
    Navbar,
    Footer
  },
  created: async function() {
    console.log("App loaded");
    this.$store.dispatch("updateBmtInfo");
    this.$store.dispatch("updateAllUsers");

    let contractEvents = await blockchain.getAllEvents();
    contractEvents.allEvents(eventListener.eventListener);
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
