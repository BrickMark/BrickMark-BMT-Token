<template>
  <div>
    <router-link to="/">Investors</router-link>|
    <router-link to="/about">About</router-link>
      <router-view />
  </div>
</template>

<script>
export default {
  name: "Header"
};
</script>

<style lang="scss" scoped>
.router-link-exact-active {
  color: #000;
}
</style>
