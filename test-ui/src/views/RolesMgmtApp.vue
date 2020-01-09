<template>
  <div>
    <h1 class="pa-2">Roles Management</h1>
    <v-container class="white">
      <v-row>
        <v-col sm="12">
          <v-card class="pa-2" outlined tile>
            <RolesView />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RolesView from "./roles/RolesView";

export default {
  name: "RolesMgmtApp",
  components: {
    RolesView
  }
};
</script>

<style>
</style>