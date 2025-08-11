<template>
  <b-navbar class="recipe-navbar" toggleable="lg" type="dark">
    <b-container fluid>
      <!-- Brand/Logo -->
      <b-navbar-brand to="/" tag="router-link" class="brand">
        <b-icon icon="house-heart-fill" class="mr-2"></b-icon>
        Granny's Recipes
      </b-navbar-brand>

      <!-- Mobile Toggle -->
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <!-- Collapsible Navigation -->
      <b-collapse id="nav-collapse" is-nav>
        <div class="d-flex w-100 justify-content-between align-items-center flex-wrap">
          <!-- Left Side Navigation -->
          <b-navbar-nav>
            <b-nav-item to="/" tag="router-link" exact>Recipes</b-nav-item>
            <b-nav-item to="/search" tag="router-link">Search</b-nav-item>
            <b-nav-item to="/about" tag="router-link">About</b-nav-item>
          </b-navbar-nav>

          <!-- Right Side Navigation -->
          <b-navbar-nav class="align-items-center">
            <template v-if="!isLoggedIn">
              <b-navbar-text class="mr-3 guest-text">Hello Guest</b-navbar-text>
              <b-nav-item>
                <b-button variant="outline-light" size="sm" @click="$router.push('/login')"
                  class="action-btn">Login</b-button>
              </b-nav-item>
              <b-nav-item>
                <b-button variant="light" size="sm" @click="$router.push('/register')"
                  class="action-btn register-btn">Register</b-button>
              </b-nav-item>
            </template>

            <template v-else>
              <b-navbar-text class="mr-3 welcome-text">Welcome, <strong>{{ username }}</strong>!</b-navbar-text>

              <!-- Personal Area Dropdown -->
              <b-nav-item-dropdown text="Personal Area">
                <b-dropdown-item to="/favorites" tag="router-link">
                  <b-icon icon="heart-fill" class="mr-2 text-danger"></b-icon> My Favorites
                </b-dropdown-item>
                <b-dropdown-item to="/my-recipes" tag="router-link">
                  <b-icon icon="book" class="mr-2 text-primary"></b-icon> My Recipes
                </b-dropdown-item>
                <b-dropdown-item to="/family-recipes" tag="router-link">
                  <b-icon icon="people-fill" class="mr-2 text-success"></b-icon> Family Recipes
                </b-dropdown-item>
              </b-nav-item-dropdown>

              <!-- New Recipe Button -->
              <b-nav-item>
                <b-button variant="success" size="sm" @click="onAddRecipe" class="action-btn new-recipe-btn">
                  <b-icon icon="plus-circle" class="mr-1"></b-icon> New Recipe
                </b-button>
              </b-nav-item>

              <!-- Logout Button -->
              <b-nav-item>
                <b-button variant="outline-light" size="sm" @click="logout" class="action-btn logout-btn">
                  <b-icon icon="box-arrow-right" class="mr-1"></b-icon> Logout
                </b-button>
              </b-nav-item>
            </template>
          </b-navbar-nav>
        </div>
      </b-collapse>

    </b-container>
  </b-navbar>
</template>

<script>
import store from '../store';
import axios from 'axios';

export default {
  name: "AppNavbar",
  computed: {
    isLoggedIn() {
      return store.isLoggedIn;
    },
    username() {
      return store.username || 'User';
    }
  },
  methods: {
    logout() {
      axios.post('/logout')
        .then(() => {
          console.log('Logged out successfully');
        })
        .catch(err => {
          console.error('Logout error:', err);
        })
        .finally(() => {
          store.logout();
          this.$router.push('/');
        });
    },
    onAddRecipe() {
      this.$emit('open-create-recipe');
    }
  }
}
</script>

<style scoped>
.recipe-navbar {
  background-color: #A47551 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 0;
}

/* Brand styling */
.brand {
  font-weight: bold;
  font-size: 1.4rem;
  color: white !important;
  display: flex;
  align-items: center;
}

.brand:hover {
  color: #f0f0f0 !important;
  text-decoration: none;
}

/* Navigation items */
.navbar-dark .navbar-nav .nav-link {
  color: rgba(255, 255, 255, 0.95) !important;
  font-weight: 500;
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.navbar-dark .navbar-nav .nav-link:hover {
  color: white !important;
  background-color: rgba(255, 255, 255, 0.15);
}

.navbar-dark .navbar-nav .nav-link.router-link-exact-active {
  color: white !important;
  background-color: rgba(255, 255, 255, 0.2);
}

/* Text styling */
.guest-text,
.welcome-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
}

.welcome-text strong {
  color: white;
  font-weight: 600;
}

/* Buttons styling */
.action-btn {
  margin: 0 0.25rem;
  font-weight: 600;
  padding: 0.375rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.register-btn {
  background-color: white;
  color: #A47551;
  border: none;
}

.register-btn:hover {
  background-color: #f8f9fa;
  color: #8B6341;
}

.new-recipe-btn {
  background-color: #28a745;
  border: none;
}

.new-recipe-btn:hover {
  background-color: #218838;
}

.logout-btn:hover {
  background-color: white;
  color: #dc3545;
  border-color: white;
}

/* Dropdown styling for Personal Area */
::v-deep .dropdown-toggle {
  color: rgba(255, 255, 255, 0.95) !important;
  background-color: transparent !important;
  border: none !important;
  font-weight: 500;
  padding: 0.5rem 1rem;
}

::v-deep .dropdown-toggle:hover {
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
}

::v-deep .dropdown-toggle::after {
  margin-left: 0.5rem;
}

/* Dropdown menu */
.dropdown-menu {
  margin-top: 0.5rem;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

.dropdown-item {
  padding: 0.5rem 1.5rem;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #A47551;
}

.dropdown-item.router-link-exact-active {
  background-color: #A47551;
  color: white;
}

/* Responsive design */
@media (max-width: 991px) {
  .navbar-nav {
    padding: 1rem 0;
  }

  .action-btn {
    width: 100%;
    margin: 0.25rem 0;
  }

  .guest-text,
  .welcome-text {
    padding: 0.5rem 1rem;
    display: block;
    text-align: center;
  }

  ::v-deep .dropdown-menu {
    position: static !important;
    width: 100%;
    margin-top: 0.5rem;
    box-shadow: none;
    background-color: rgba(0, 0, 0, 0.1);
  }

  .dropdown-item {
    color: rgba(255, 255, 255, 0.9);
  }

  .dropdown-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
}
</style>