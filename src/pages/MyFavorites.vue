<template>
  <div class="container favorites-page">
    <!-- Toast Notification -->
    <div
      v-if="notification.show"
      :class="`alert alert-${notification.variant} alert-dismissible fade show position-fixed`"
      style="top: 20px; right: 20px; z-index: 9999; min-width: 300px"
      role="alert"
    >
      <strong>{{ notification.title }}</strong> {{ notification.message }}
      <button
        type="button"
        class="btn-close"
        @click="notification.show = false"
      ></button>
    </div>

    <!-- Confirmation Modal for Remove -->
    <b-modal
      v-model="showRemoveModal"
      :title="`Remove from Favorites`"
      centered
      ok-title="Remove"
      ok-variant="danger"
      cancel-variant="outline-secondary"
      @ok="confirmRemoveFavorite"
    >
      <div class="text-center">
        <b-icon
          icon="heart-fill"
          font-scale="3"
          class="text-danger mb-3"
        ></b-icon>
        <p class="mb-0">Are you sure you want to remove</p>
        <p class="font-weight-bold">"{{ recipeToRemove?.title }}"</p>
        <p>from your favorites?</p>
      </div>
    </b-modal>

    <h1 class="page-title text-center mb-4">
      <b-icon icon="heart-fill" class="mr-2 text-danger"></b-icon>
      My Favorites
    </h1>

    <!-- Not logged in message -->
    <div v-if="!store.isLoggedIn" class="text-center py-5">
      <b-icon icon="person-x" font-scale="3" class="text-muted mb-3"></b-icon>
      <h3>Please login to view your favorite recipes</h3>
      <p class="text-muted">
        You need to be logged in to save and view favorite recipes
      </p>
      <b-button variant="primary" @click="$router.push('/login')" class="mt-3">
        <b-icon icon="box-arrow-in-right" class="mr-2"></b-icon>
        Go to Login
      </b-button>
    </div>

    <!-- Loading state -->
    <div v-else-if="loading" class="text-center py-5">
      <b-spinner variant="primary" label="Loading..."></b-spinner>
      <p class="mt-3">Loading your favorite recipes...</p>
    </div>

    <!-- Error state - only for auth errors -->
    <div v-else-if="error" class="text-center py-5">
      <b-alert variant="danger" show>
        <b-icon icon="exclamation-triangle-fill" class="mr-2"></b-icon>
        {{ error }}
      </b-alert>
    </div>

    <!-- Main content when logged in -->
    <div v-else>
      <!-- No favorites state -->
      <div v-if="favorites.length === 0" class="text-center py-5">
        <b-icon icon="heart" font-scale="3" class="text-muted mb-3"></b-icon>
        <h3>You don't have any favorite recipes yet</h3>
        <p class="text-muted">
          Start exploring recipes and mark your favorites!
        </p>
        <b-button
          variant="primary"
          @click="$router.push('/search')"
          class="mt-3"
        >
          <b-icon icon="search" class="mr-2"></b-icon>
          Search Recipes
        </b-button>
      </div>

      <!-- Favorites grid -->
      <div v-else>
        <!-- Search and filter controls -->
        <div class="controls-section">
          <b-row class="mb-3">
            <b-col md="8">
              <div class="search-container">
                <b-input-group class="search-input-group">
                  <b-input-group-prepend>
                    <b-input-group-text class="search-icon">
                      <b-icon icon="search"></b-icon>
                    </b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input
                    v-model="searchQuery"
                    placeholder="Search in your favorites..."
                    @input="filterFavorites"
                    class="search-input"
                  ></b-form-input>
                </b-input-group>
              </div>
            </b-col>
            <b-col
              md="4"
              class="d-flex align-items-center justify-content-center"
            >
              <b-button
                variant="primary"
                @click="$router.push('/search')"
                class="search-btn"
              >
                <b-icon icon="search" class="mr-2" /> Find More Recipes
              </b-button>
            </b-col>
          </b-row>

          <!-- Filter badges -->
          <b-row class="mb-3">
            <b-col>
              <div class="filter-container">
                <b-button-group class="filter-buttons">
                  <b-button
                    :variant="filter === 'all' ? 'primary' : 'outline-primary'"
                    @click="setFilter('all')"
                    class="filter-btn"
                  >
                    All ({{ favorites.length }})
                  </b-button>
                  <b-button
                    :variant="
                      filter === 'vegan' ? 'success' : 'outline-success'
                    "
                    @click="setFilter('vegan')"
                    class="filter-btn"
                  >
                    <b-icon icon="leaf" class="mr-1"></b-icon>
                    Vegan
                  </b-button>
                  <b-button
                    :variant="filter === 'vegetarian' ? 'info' : 'outline-info'"
                    @click="setFilter('vegetarian')"
                    class="filter-btn"
                  >
                    <b-icon icon="egg" class="mr-1"></b-icon>
                    Vegetarian
                  </b-button>
                  <b-button
                    :variant="
                      filter === 'glutenFree' ? 'warning' : 'outline-warning'
                    "
                    @click="setFilter('glutenFree')"
                    class="filter-btn"
                  >
                    Gluten Free
                  </b-button>
                </b-button-group>
              </div>
            </b-col>
          </b-row>
        </div>

        <!-- Results count -->
        <div v-if="filteredFavorites.length !== favorites.length" class="mb-3">
          <p class="results-count">
            Showing {{ filteredFavorites.length }} of
            {{ favorites.length }} favorite recipes
          </p>
        </div>

        <!-- Recipes grid -->
        <b-row>
          <b-col
            v-for="recipe in filteredFavorites"
            :key="recipe.id || recipe.recipe_id"
            cols="12"
            md="6"
            lg="4"
            class="mb-4"
          >
            <div class="recipe-wrapper">
              <RecipePreview :recipe="recipe" />
              <div class="recipe-actions mt-2">
                <b-button
                  variant="outline-danger"
                  size="sm"
                  @click="removeFavorite(recipe)"
                  class="remove-btn"
                >
                  <b-icon icon="heart-fill" class="mr-1"></b-icon>
                  Remove from Favorites
                </b-button>
              </div>
            </div>
          </b-col>
        </b-row>

        <!-- No results for filter -->
        <div
          v-if="filteredFavorites.length === 0 && favorites.length > 0"
          class="text-center py-5"
        >
          <b-icon icon="funnel" font-scale="2" class="text-muted mb-3"></b-icon>
          <p class="text-muted">No recipes found matching your filter</p>
          <b-button variant="outline-primary" size="sm" @click="resetFilters">
            Reset Filters
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreview from "../components/RecipePreview.vue";
import store from "../store";
import axios from "axios";

export default {
  name: "MyFavorites",
  components: {
    RecipePreview,
  },
  data() {
    return {
      favorites: [],
      filteredFavorites: [],
      loading: false,
      error: null,
      searchQuery: "",
      filter: "all",
      recipeToRemove: null, // For the modal
      showRemoveModal: false, // Control modal visibility
      notification: {
        show: false,
        title: "",
        message: "",
        variant: "success",
      },
    };
  },
  computed: {
    store() {
      return store;
    },
  },
  mounted() {
    if (this.store.isLoggedIn) {
      this.loadFavorites();
    }
  },
  watch: {
    "store.isLoggedIn"(newVal) {
      if (newVal) {
        this.loadFavorites();
      } else {
        this.favorites = [];
        this.filteredFavorites = [];
      }
    },
  },
  methods: {
    async loadFavorites() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get("/users/favorites");

        // Simply process the recipes that were successfully loaded
        // If empty array due to API issues, it will just show "no favorites" message
        this.favorites = response.data.map((recipe) =>
          this.normalizeRecipe(recipe)
        );
        this.filteredFavorites = [...this.favorites];
      } catch (error) {
        console.error("Error loading favorites:", error);

        if (error.response?.status === 401) {
          this.error = "You need to login to view your favorites";
          // Redirect to login
          setTimeout(() => {
            this.$router.push("/login");
          }, 2000);
        } else {
          // For any other error, just show empty favorites
          // Don't show error message for API issues
          this.favorites = [];
          this.filteredFavorites = [];
        }
      } finally {
        this.loading = false;
      }
    },

    async removeFavorite(recipe) {
      this.recipeToRemove = recipe;
      this.showRemoveModal = true;
    },

    async confirmRemoveFavorite() {
      if (!this.recipeToRemove) return;

      const recipeId = this.recipeToRemove.id || this.recipeToRemove.recipe_id;
      const recipeTitle = this.recipeToRemove.title;

      try {
        await axios.delete(`/users/favorites/${recipeId}`);

        // Remove from local arrays
        const index = this.favorites.findIndex(
          (r) => (r.id || r.recipe_id) === recipeId
        );
        if (index > -1) {
          this.favorites.splice(index, 1);
        }

        const filteredIndex = this.filteredFavorites.findIndex(
          (r) => (r.id || r.recipe_id) === recipeId
        );
        if (filteredIndex > -1) {
          this.filteredFavorites.splice(filteredIndex, 1);
        }

        // Show success notification
        this.showNotification(
          "Success!",
          `"${recipeTitle}" has been removed from your favorites`,
          "success"
        );
      } catch (error) {
        console.error("Error removing favorite:", error);
        // Show error notification
        this.showNotification(
          "Error",
          "Failed to remove recipe from favorites. Please try again.",
          "danger"
        );
      } finally {
        this.recipeToRemove = null;
        this.showRemoveModal = false;
      }
    },

    async clearAllFavorites() {
      if (
        confirm(
          `Are you sure you want to remove all ${this.favorites.length} recipes from your favorites? This cannot be undone.`
        )
      ) {
        try {
          await axios.delete("/users/favorites/all");
          this.favorites = [];
          this.filteredFavorites = [];
          this.showNotification(
            "Success!",
            "All favorites have been cleared",
            "success"
          );
        } catch (error) {
          console.error("Error clearing favorites:", error);
          this.showNotification(
            "Error",
            "Failed to clear favorites. Please try again.",
            "danger"
          );
        }
      }
    },

    showNotification(title, message, variant = "info") {
      this.notification = {
        show: true,
        title,
        message,
        variant,
      };

      // Auto-hide after 3 seconds
      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    },

    filterFavorites() {
      let filtered = [...this.favorites];

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter((recipe) =>
          recipe.title.toLowerCase().includes(query)
        );
      }

      // Apply dietary filter
      if (this.filter !== "all") {
        filtered = filtered.filter((recipe) => {
          switch (this.filter) {
            case "vegan":
              return recipe.vegan || recipe.is_vegan || recipe.isVegan;
            case "vegetarian":
              return (
                recipe.vegetarian || recipe.is_vegetarian || recipe.isVegetarian
              );
            case "glutenFree":
              return (
                recipe.glutenFree ||
                recipe.is_gluten_free ||
                recipe.isGlutenFree
              );
            default:
              return true;
          }
        });
      }

      this.filteredFavorites = filtered;
    },

    setFilter(filterType) {
      this.filter = filterType;
      this.filterFavorites();
    },

    resetFilters() {
      this.searchQuery = "";
      this.filter = "all";
      this.filteredFavorites = [...this.favorites];
    },

    normalizeRecipe(recipe) {
      return {
        id: recipe.id || recipe.recipe_id,
        recipe_id: recipe.recipe_id || recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes:
          recipe.readyInMinutes || recipe.cook_time || recipe.cookTime,
        cook_time: recipe.cook_time || recipe.cookTime || recipe.readyInMinutes,
        aggregateLikes:
          recipe.popularity || recipe.aggregateLikes || recipe.likes || 0,
        likes: recipe.likes || recipe.aggregateLikes || recipe.popularity || 0,
        vegan: recipe.vegan || recipe.is_vegan || recipe.isVegan,
        vegetarian:
          recipe.vegetarian || recipe.is_vegetarian || recipe.isVegetarian,
        glutenFree:
          recipe.glutenFree || recipe.is_gluten_free || recipe.isGlutenFree,
        isFavorite: true, // Always true for favorites page
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.favorites-page {
  padding: 2rem 0;
  min-height: calc(100vh - 120px);
  background: linear-gradient(to bottom, #faf8f3, #ffffff);
}

.page-title {
  color: #a47551;
  font-weight: bold;
  margin-bottom: 2rem;
  font-family: "Georgia", serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Stats Container - Same as MyRecipes */
.stats-container {
  margin-bottom: 1rem;
}

.stats-bar {
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e8dfd6;
  border-radius: 10px;
  padding: 0.75rem 1.25rem;
  box-shadow: 0 2px 6px rgba(164, 117, 81, 0.08);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 3px 10px rgba(164, 117, 81, 0.12);
  }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
}

.stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  color: #a47551;
  font-size: 1rem;
  border: 2px solid #e8dfd6;

  &.heart {
    background: #ffe6e6;
    color: #dc3545;
    border-color: #f8d7da;
  }
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
}

.stat-number {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: #e8dfd6;
  margin: 0 0.75rem;
}

/* Controls Section */
.controls-section {
  background: white;
  border: 2px solid #e8dfd6;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 6px rgba(164, 117, 81, 0.08);
}

/* Search Container */
.search-container {
  margin-bottom: 0.75rem;
}

.search-input-group {
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e8dfd6;
  transition: border-color 0.3s ease;

  &:focus-within {
    border-color: #a47551;
    box-shadow: 0 0 0 3px rgba(164, 117, 81, 0.1);
  }
}

.search-icon {
  background: #f8f9fa;
  border: none;
  color: #a47551;
  border-right: 1px solid #e8dfd6;
}

.search-input {
  border: none;
  background: white;
  text-align: left;
  padding-left: 0.5rem;

  &:focus {
    border: none;
    box-shadow: none;
    padding-left: 0.5rem;
  }

  &::placeholder {
    text-align: left;
    padding-left: 0;
  }
}

/* Clear All Container */
.clear-container {
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: flex-end;
}

.clear-all-btn {
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  border-width: 2px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(220, 53, 69, 0.25);
  }
}

/* Filter Container */
.filter-container {
  border-top: 1px solid #e8dfd6;
  padding-top: 0.75rem;
}

.filter-buttons {
  gap: 0.5rem;

  .filter-btn {
    border-radius: 6px;
    font-weight: 500;
    padding: 0.35rem 0.55rem;
    border-width: 2px;
    transition: all 0.3s ease;
    font-size: 0.85rem;

    &.btn-primary,
    &.btn-outline-primary {
      &.btn-primary {
        background-color: #a47551;
        border-color: #a47551;
      }
      &.btn-outline-primary {
        color: #a47551;
        border-color: #a47551;
        &:hover {
          background-color: #a47551;
          border-color: #a47551;
        }
      }
    }
  }
}

/* Search Button */
.search-btn {
  background-color: #a47551;
  border-color: #a47551;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  border-width: 2px;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background-color: #8b6442;
    border-color: #8b6442;
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(164, 117, 81, 0.25);
  }
}

/* Results Count */
.results-count {
  font-style: italic;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-left: 4px solid #a47551;
  border-radius: 4px;
}

/* Recipe Actions */
.recipe-wrapper {
  position: relative;
}

.recipe-actions {
  .remove-btn {
    width: 100%;
    border-radius: 6px;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-width: 2px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 6px rgba(220, 53, 69, 0.25);
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .stats-bar {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .stat-divider {
    width: 80%;
    height: 1px;
    margin: 0;
  }

  .controls-section {
    padding: 1rem;
  }

  .search-btn {
    width: 100%;
    margin-top: 1rem;
  }

  .filter-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }

  .clear-container {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .page-title {
    font-size: 1.5rem;
  }

  .recipe-wrapper {
    margin-bottom: 1rem;
  }
}
</style>
