<template>
  <b-navbar class="recipe-navbar" toggleable="lg" type="light">
    <b-container fluid>
      <!-- Top row: Brand + User Info (always visible) -->
      <div
        class="d-flex w-100 justify-content-between align-items-center top-navbar-row"
      >
        <!-- Brand/Logo -->
        <b-navbar-brand class="brand">
          <router-link to="/" class="brand-link">
            <b-icon icon="house-heart-fill" class="mr-2"></b-icon>
            Granny's Recipes
          </router-link>
        </b-navbar-brand>

        <!-- User section (always visible on same line as brand) -->
        <div class="d-flex align-items-center user-top-section">
          <template v-if="!isLoggedIn">
            <span class="guest-text mr-3">Hello Guest</span>
            <b-button
              variant="outline-primary"
              size="sm"
              @click="$router.push('/login')"
              class="action-btn mr-2"
              >Login</b-button
            >
            <b-button
              variant="primary"
              size="sm"
              @click="$router.push('/register')"
              class="action-btn register-btn"
              >Register</b-button
            >
          </template>

          <template v-else>
            <span class="welcome-text mr-4"
              >Welcome, <strong>{{ username }}</strong
              >!</span
            >
            <b-button
              variant="outline-secondary"
              size="sm"
              @click="logout"
              class="logout-btn-small"
            >
              <b-icon icon="box-arrow-right" font-scale="0.9"></b-icon>
              <span class="logout-text ml-1">Logout</span>
            </b-button>
          </template>
        </div>
      </div>

      <!-- Mobile Toggle -->
      <b-navbar-toggle target="nav-collapse" class="mt-2"></b-navbar-toggle>

      <!-- Collapsible Navigation (second row) -->
      <b-collapse id="nav-collapse" is-nav>
        <div class="navigation-row mt-2">
          <!-- Left Side Navigation -->
          <b-navbar-nav class="mr-auto">
            <b-nav-item to="/" tag="router-link" exact>Recipes</b-nav-item>
            <b-nav-item to="/search" tag="router-link">Search</b-nav-item>
            <b-nav-item to="/about" tag="router-link">About</b-nav-item>
          </b-navbar-nav>

          <!-- Right Side Navigation (logged in only) -->
          <b-navbar-nav v-if="isLoggedIn" class="ml-auto align-items-center">
            <!-- Personal Area Dropdown -->
            <b-nav-item-dropdown
              text="Personal Area"
              class="personal-dropdown mr-2"
            >
              <b-dropdown-item to="/favorites" tag="router-link">
                <b-icon icon="heart-fill" class="mr-2 text-danger"></b-icon>
                My Favorites
              </b-dropdown-item>
              <b-dropdown-item to="/my-recipes" tag="router-link">
                <b-icon icon="book" class="mr-2 text-primary"></b-icon> My
                Recipes
              </b-dropdown-item>
              <b-dropdown-item to="/family-recipes" tag="router-link">
                <b-icon icon="people-fill" class="mr-2 text-success"></b-icon>
                Family Recipes
              </b-dropdown-item>
            </b-nav-item-dropdown>

            <!-- New Recipe Button with Custom + Icon -->
            <li class="nav-item">
              <button
                id="add-recipe-btn"
                @click="onAddRecipe"
                class="new-recipe-btn-icon"
                title="Add new recipe"
                type="button"
              >
                <img
                  src="@/assets/plus-icon.png"
                  alt="Add Recipe"
                  class="plus-icon"
                />
              </button>
            </li>
          </b-navbar-nav>
        </div>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import store from "../store";
import axios from "axios";

export default {
  name: "AppNavbar",
  computed: {
    isLoggedIn() {
      return store.isLoggedIn;
    },
    username() {
      return store.username || "User";
    },
  },
  methods: {
    logout() {
      axios
        .post("/logout")
        .then(() => {
          console.log("Logged out successfully");
        })
        .catch((err) => {
          console.error("Logout error:", err);
        })
        .finally(() => {
          store.logout();
          this.$router.push("/");
        });
    },
    onAddRecipe() {
      this.$emit("open-create-recipe");
    },
  },
};
</script>

<style scoped>
/* Import the common font for consistency */
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap");

/* Navbar container - changed to beige/off-white background */
.recipe-navbar {
  background-color: #faf8f5 !important; /* Beige/off-white color */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 0;
  min-height: 60px;
  /* Set consistent font for entire navbar */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  border-bottom: 1px solid #e8e4df;
}

/* Brand/Logo styling - using decorative font only for brand */
.brand {
  font-weight: 700;
  font-size: 1.5rem;
  color: #a47551 !important; /* Changed to brown since background is now light */
  display: flex;
  align-items: center;
  font-family: "Playfair Display", Georgia, serif;
  letter-spacing: -0.5px;
  text-decoration: none !important;
}

.brand:hover {
  color: #8b6341 !important;
  text-decoration: none;
}

/* Navigation links - updated for light background */
.navbar-nav .nav-link {
  color: #6c757d !important; /* Gray text for light background */
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  text-decoration: none !important;
}

.navbar-nav .nav-link:hover {
  color: #a47551 !important;
  background-color: rgba(164, 117, 81, 0.1) !important;
  text-decoration: none !important;
}

.navbar-nav .nav-link.router-link-exact-active {
  color: #a47551 !important;
  background-color: rgba(164, 117, 81, 0.15) !important;
}

/* Text styling - updated for light background */
.guest-text {
  color: #6c757d;
  font-size: 0.95rem;
  font-weight: 400;
  margin-right: 1rem !important;
}

.welcome-text {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 400;
  white-space: nowrap;
  margin-right: 0.75rem !important;
}

.welcome-text strong {
  color: #a47551;
  font-weight: 600;
}

/* Button styling */
.action-btn {
  margin: 0 0.25rem;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.375rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  text-transform: none;
  letter-spacing: 0;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.register-btn {
  background-color: #a47551;
  border-color: #a47551;
  color: white;
}

.register-btn:hover {
  background-color: #8b6341;
  border-color: #8b6341;
}

/* New Recipe Button - green circular button with custom + icon */
.new-recipe-btn-icon {
  background-color: #5cb85c !important;
  border: none !important;
  border-radius: 50% !important;
  width: 40px;
  height: 40px;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.new-recipe-btn-icon:hover {
  background-color: #4cae4c !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.new-recipe-btn-icon:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(92, 184, 92, 0.5) !important;
}

.plus-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1); /* Makes the icon white */
  transition: all 0.3s ease;
}

.new-recipe-btn-icon:hover .plus-icon {
  transform: scale(1.1);
}

/* Top navbar row - always visible */
.top-navbar-row {
  min-height: 50px;
}

/* User section on top row */
.user-top-section {
  white-space: nowrap;
}

/* Navigation row - collapsible */
.navigation-row {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 1px solid #e8e4df;
}

/* Smaller, less prominent logout button */
.logout-btn-small {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  border-color: #dee2e6;
  color: #6c757d;
  background-color: transparent;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.logout-btn-small:hover {
  background-color: #f8f9fa;
  border-color: #6c757d;
  color: #495057;
  transform: none; /* Remove the lift effect to make it less prominent */
}

.logout-text {
  font-size: 0.8rem;
}

/* Dropdown styling - updated for light background */
.personal-dropdown ::v-deep .dropdown-toggle {
  color: #6c757d !important;
  background-color: transparent !important;
  border: none !important;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.personal-dropdown ::v-deep .dropdown-toggle:hover {
  background-color: rgba(164, 117, 81, 0.1) !important;
  color: #a47551 !important;
}

.personal-dropdown ::v-deep .dropdown-toggle::after {
  margin-left: 0.5rem;
}

/* Dropdown menu */
.dropdown-menu {
  margin-top: 0.5rem;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  font-size: 0.95rem;
}

.dropdown-item {
  padding: 0.5rem 1.5rem;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  font-weight: 400;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #a47551;
}

.dropdown-item.router-link-exact-active {
  background-color: #a47551;
  color: white;
}

/* Layout alignment */
.d-flex.w-100.justify-content-between {
  align-items: center !important;
  min-height: 40px !important;
}

.navbar-nav {
  display: flex !important;
  align-items: center !important;
  margin: 0 !important;
}

.navbar-nav:first-child {
  margin-right: auto !important;
}

.brand-link {
  color: inherit !important;
  text-decoration: none !important;
  display: flex;
  align-items: center;
}

.brand-link:hover {
  color: #8b6341 !important;
  text-decoration: none !important;
}

/* Mobile/Tablet Responsive Design */
@media (max-width: 991px) {
  .recipe-navbar {
    padding: 0.5rem 0;
  }

  .brand {
    font-size: 1.25rem;
  }

  /* Top row stays horizontal even on mobile */
  .top-navbar-row {
    flex-direction: row !important;
    justify-content: space-between !important;
  }

  .user-top-section {
    flex-direction: column;
    align-items: flex-end;
  }

  .user-top-section .welcome-text,
  .user-top-section .guest-text {
    font-size: 0.8rem;
    margin-right: 0 !important;
    margin-bottom: 0.25rem;
  }

  .user-top-section .action-btn,
  .user-top-section .logout-btn-small {
    font-size: 0.75rem;
    padding: 0.2rem 0.4rem;
    margin: 0.1rem;
  }

  /* Navigation row on mobile */
  .navigation-row {
    flex-direction: column !important;
    align-items: stretch !important;
    padding-top: 1rem;
  }

  .navbar-nav {
    padding: 0.5rem 0;
    width: 100%;
  }

  .navbar-nav .nav-link {
    padding: 0.75rem 1rem;
    margin: 0.25rem 0;
    font-size: 1rem;
  }

  .new-recipe-btn-icon {
    width: 36px;
    height: 36px;
  }

  .plus-icon {
    width: 18px;
    height: 18px;
  }

  /* Mobile dropdown styling */
  .personal-dropdown ::v-deep .dropdown-menu {
    position: static !important;
    width: 100%;
    margin-top: 0.5rem;
    box-shadow: none;
    background-color: rgba(164, 117, 81, 0.05);
    border-radius: 4px;
  }

  .dropdown-item {
    color: #6c757d;
  }

  .dropdown-item:hover {
    background-color: rgba(164, 117, 81, 0.1);
    color: #a47551;
  }

  .dropdown-item.router-link-exact-active {
    background-color: rgba(164, 117, 81, 0.2);
    color: #a47551;
  }
}

@media (max-width: 576px) {
  .brand {
    font-size: 1.1rem;
  }

  .navbar-nav .nav-link {
    font-size: 0.95rem;
  }

  .welcome-text {
    font-size: 0.85rem;
  }

  .logout-text {
    display: none; /* Hide "Logout" text on very small screens, keep just icon */
  }
}
</style>
