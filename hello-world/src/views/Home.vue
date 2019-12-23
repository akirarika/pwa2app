<style lang="css" scoped>
.avatar {
  border-radius: 50%;
  width: 23.33vmin;
  height: 23.33vmin;
}
</style>

<template>
  <div class="home">
    <img class="avatar" src="../assets/avatar.jpg" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  components: {
    HelloWorld
  }
};
</script>
