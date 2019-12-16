<template>
  <div class="text-right">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on" x-small>Add user</v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Add User</v-card-title>

        <v-card-text>
          <v-form>
            <v-text-field label="Name" name="name" type="text" v-model="name"></v-text-field>
            <v-text-field label="Address" name="address" type="text" v-model="address"></v-text-field>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
           <v-btn color="primary" v-on:click="addUser()" @click="dialog = false">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      address: "",
      dialog: false
    };
  },
  methods: {
    async addUser() {
      this.$store.dispatch("addUser", {name: this.name, address: this.address});

      this.name = "";
      this.address = "";
    }
  }
};
</script>