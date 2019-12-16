<template>
  <div>
    <v-card-text>
      <v-form>
        <v-text-field label="Name" name="name" type="text" v-model="name"></v-text-field>
        <v-text-field label="Address" name="address" type="text" v-model="address"></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" v-on:click="addUser()">Add</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      address: ""
    };
  },
  methods: {
    async addUser() {
      console.log("addUser");
      this.$store.dispatch("addUser", {name: this.name, address: this.address});
    }
  }
};
</script>