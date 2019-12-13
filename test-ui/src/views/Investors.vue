<template>
  <div>
    <h1>Investors</h1>

    <InfoView />
    <InvestorView />
    <Admin />
    <Events />

  </div>
</template>

<script>
import blockchain from "../js/blockchainInterface";
import Admin from "./Admin";
import Events from "./Events";
import InfoView from "./InfoView";
import InvestorView from "./InvestorView"
// import MintAndMore from "./MintAndMore"

export default {
  name: "Investors",
  components: {
    Admin,
    Events,
    InfoView,
    InvestorView
    // MintAndMore
  }
}
</script>
<style lang="scss" scoped>
</style>