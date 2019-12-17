<template>
  <div>
    <h1 class="pa-2">Voting</h1>
    <CreateVote />
    <VotingInfoView />
  </div>
</template>

<script>
import CreateVote from "./voting/CreateVote";
import VotingInfoView from "./voting/VotingInfoView"

export default {
  name: "VotingApp",
  components: {
    CreateVote,
    VotingInfoView
  }
};
</script>

<style>
</style>