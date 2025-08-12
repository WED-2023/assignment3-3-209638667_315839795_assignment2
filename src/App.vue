<template>
  <div id="app">
    <Navbar @open-create-recipe="openCreateRecipeModal" />
    <router-view />
    <CreateRecipeModal ref="createRecipeModal" />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import CreateRecipeModal from './components/CreateRecipeModal.vue'

export default {
  name: "App",
  components: { Navbar, CreateRecipeModal },
  methods: {
    openCreateRecipeModal() {
      this.$refs.createRecipeModal.open();
    }



  }
}
</script>

<style lang="scss">
@use "@/scss/form-style.scss" as *;

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background: #fafafa;
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
