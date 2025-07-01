<template>
  <b-navbar class="recipe-navbar" toggleable="lg" type="dark">
    <b-navbar-brand to="/" tag="router-link">Grannys Recepies</b-navbar-brand>

    <!-- Custom Hamburger/X toggle -->
    <button v-if="!isNavOpen" class="navbar-toggler" type="button" aria-label="Open navigation"
      @click="isNavOpen = true">
      <span class="navbar-toggler-icon"></span>
    </button>
    <button v-else class="navbar-toggler" type="button" aria-label="Close navigation" @click="isNavOpen = false">
      <span style="font-size:2rem;line-height:1;">×</span>
    </button>

    <b-collapse id="nav-collapse" is-nav v-model="isNavOpen" @show="isNavOpen = true" @hide="isNavOpen = false">
      <b-navbar-nav>
        <b-nav-item to="/search" tag="router-link" @click="closeNav">Search Recepies</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <template v-if="!isLoggedIn">
          <b-nav-item to="/register" tag="router-link" @click="closeNav">Register</b-nav-item>
          <b-nav-item to="/login" tag="router-link" @click="closeNav">Login</b-nav-item>
        </template>
        <template v-else>
          <b-nav-item to="/my-recipes" tag="router-link" @click="closeNav">My Recepies</b-nav-item>
          <b-nav-item to="/favorites" tag="router-link" @click="closeNav">Favorites</b-nav-item>
          <b-nav-item to="/family-recipes" tag="router-link" @click="closeNav">Family Recepies</b-nav-item>
          <b-nav-item class="ml-2">
            <b-button variant="success" size="sm" @click.prevent="onAddRecipe"
              style="font-weight:bold;letter-spacing:1px;">
              <b-icon icon="plus-circle" class="mr-1"></b-icon>
              New Recipe
            </b-button>
          </b-nav-item>

          <b-nav-item @click="logout">logout</b-nav-item>
        </template>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import store from '../store';
export default {
  name: "AppNavbar",
  data() {
    return {
      isNavOpen: false
    }
  },
  computed: {
    isLoggedIn() {
      return store.isLoggedIn;
    }
  },
  methods: {
    closeNav() {
      this.isNavOpen = false;
    },
    logout() {
      store.logout();
      this.$router.push('/');
      this.closeNav();
    },
    onAddRecipe() {
      this.$emit('open-create-recipe');
      this.closeNav();
    }

  }
}
</script>

<style scoped>
.recipe-navbar {
  background-color: #A47551 !important;
}


.navbar-toggler span {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
