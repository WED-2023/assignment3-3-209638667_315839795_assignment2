<template>
  <div class="container my-recipes-page">
    <!-- Create Recipe Modal -->
    <CreateRecipeModal ref="createModal" @recipe-created="onRecipeCreated" />
    <h1 class="page-title text-center mb-4">
      <b-icon icon="book" class="mr-2 text-primary"></b-icon>
      My Recipes
    </h1>

    <!-- Not logged in message -->
    <div v-if="!store.isLoggedIn" class="text-center py-5">
      <b-icon icon="person-x" font-scale="3" class="text-muted mb-3"></b-icon>
      <h3>Please login to view your recipes</h3>
      <p class="text-muted">
        You need to be logged in to create and manage your own recipes
      </p>
      <b-button variant="primary" @click="$router.push('/login')" class="mt-3">
        <b-icon icon="box-arrow-in-right" class="mr-2"></b-icon>
        Go to Login
      </b-button>
    </div>

    <!-- Loading state -->
    <div v-else-if="loading" class="text-center py-5">
      <b-spinner variant="primary" label="Loading..."></b-spinner>
      <p class="mt-3">Loading your recipes...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-5">
      <b-alert variant="danger" show>
        <b-icon icon="exclamation-triangle-fill" class="mr-2"></b-icon>
        {{ error }}
      </b-alert>
    </div>

    <!-- Main content when logged in -->
    <div v-else>
      <!-- Action buttons and stats -->
      <b-row class="mb-4 align-items-center">
        <b-col md="12">
          <div class="stats-container">
            <div class="stats-bar">
              <div class="stat-item">
                <div class="stat-icon">
                  <b-icon icon="journal-text"></b-icon>
                </div>
                <div class="stat-content">
                  <span class="stat-number">{{ myRecipes.length }}</span>
                  <span class="stat-label"
                    >Recipe{{ myRecipes.length !== 1 ? "s" : "" }}</span
                  >
                </div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <div class="stat-icon heart">
                  <b-icon icon="heart-fill"></b-icon>
                </div>
                <div class="stat-content">
                  <span class="stat-number">{{ totalLikes }}</span>
                  <span class="stat-label">Total Likes</span>
                </div>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>

      <!-- No recipes state -->
      <div v-if="myRecipes.length === 0" class="text-center py-5">
        <b-icon
          icon="journal-plus"
          font-scale="3"
          class="text-muted mb-3"
        ></b-icon>
        <h3>You haven't created any recipes yet</h3>
        <p class="text-muted">
          Start sharing your culinary creativity with the world!
        </p>
      </div>

      <!-- Recipes grid -->
      <div v-else>
        <!-- Search and sort bar -->
        <div class="controls-section">
          <b-row class="mb-3">
            <b-col md="6">
              <div class="search-container">
                <b-input-group class="search-input-group">
                  <b-input-group-prepend>
                    <b-input-group-text class="search-icon">
                      <b-icon icon="search"></b-icon>
                    </b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input
                    v-model="searchQuery"
                    placeholder="Search your recipes..."
                    @input="filterRecipes"
                    class="search-input"
                  ></b-form-input>
                </b-input-group>
              </div>
            </b-col>
            <b-col md="6">
              <div class="sort-container">
                <b-input-group class="sort-input-group">
                  <b-input-group-prepend>
                    <b-input-group-text class="sort-icon">
                      <b-icon icon="sort-down"></b-icon>
                    </b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-select
                    v-model="sortBy"
                    @change="sortRecipes"
                    class="sort-select"
                  >
                    <b-form-select-option value="newest"
                      >Newest First</b-form-select-option
                    >
                    <b-form-select-option value="oldest"
                      >Oldest First</b-form-select-option
                    >
                    <b-form-select-option value="mostLiked"
                      >Most Liked</b-form-select-option
                    >
                    <b-form-select-option value="title"
                      >Alphabetical</b-form-select-option
                    >
                  </b-form-select>
                </b-input-group>
              </div>
            </b-col>
          </b-row>

          <!-- Filter badges -->
          <b-row class="mb-3">
            <b-col>
              <div class="filter-container">
                <b-button-group class="filter-buttons">
                  <b-button
                    :variant="filter === 'all' ? 'primary' : 'outline-primary'"
                    size="sm"
                    @click="setFilter('all')"
                    class="filter-btn"
                  >
                    All ({{ myRecipes.length }})
                  </b-button>
                  <b-button
                    :variant="
                      filter === 'vegan' ? 'success' : 'outline-success'
                    "
                    size="sm"
                    @click="setFilter('vegan')"
                    class="filter-btn"
                  >
                    <b-icon icon="leaf" class="mr-1"></b-icon>
                    Vegan
                  </b-button>
                  <b-button
                    :variant="filter === 'vegetarian' ? 'info' : 'outline-info'"
                    size="sm"
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
                    size="sm"
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
        <div v-if="filteredRecipes.length !== myRecipes.length" class="mb-3">
          <p class="text-muted results-count">
            Showing {{ filteredRecipes.length }} of
            {{ myRecipes.length }} recipes
          </p>
        </div>

        <!-- Recipes grid -->
        <b-row>
          <b-col
            v-for="recipe in filteredRecipes"
            :key="recipe.id || recipe.recipe_id"
            cols="12"
            md="6"
            lg="4"
            class="mb-4"
          >
            <div class="recipe-wrapper">
              <RecipePreview :recipe="recipe" />
            </div>
          </b-col>
        </b-row>

        <!-- No results for filter -->
        <div
          v-if="filteredRecipes.length === 0 && myRecipes.length > 0"
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

    <!-- Notification -->
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
  </div>
</template>

<script>
import RecipePreview from "../components/RecipePreview.vue";
import CreateRecipeModal from "../components/CreateRecipeModal.vue";
import store from "../store";
import axios from "axios";

export default {
  name: "MyRecipes",
  components: {
    RecipePreview,
    CreateRecipeModal,
  },
  data() {
    return {
      myRecipes: [],
      filteredRecipes: [],
      loading: false,
      error: null,
      searchQuery: "",
      filter: "all",
      sortBy: "newest",
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
    totalLikes() {
      return this.myRecipes.reduce(
        (sum, recipe) => sum + (recipe.likes || 0),
        0
      );
    },
  },
  mounted() {
    if (this.store.isLoggedIn) {
      this.loadMyRecipes();
    }
  },
  watch: {
    "store.isLoggedIn"(newVal) {
      if (newVal) {
        this.loadMyRecipes();
      } else {
        this.myRecipes = [];
        this.filteredRecipes = [];
      }
    },
  },
  methods: {
    async loadMyRecipes() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get("/users/my-recipes");

        // Process and normalize the recipes
        this.myRecipes = response.data.map((recipe) =>
          this.normalizeRecipe(recipe)
        );

        // Sort by newest first (assuming higher IDs are newer)
        this.myRecipes.sort(
          (a, b) => (b.id || b.recipe_id) - (a.id || a.recipe_id)
        );

        this.filteredRecipes = [...this.myRecipes];
      } catch (error) {
        console.error("Error loading my recipes:", error);

        if (error.response?.status === 401) {
          this.error = "You need to login to view your recipes";
          setTimeout(() => {
            this.$router.push("/login");
          }, 2000);
        } else {
          this.error = "Error loading your recipes. Please try again.";
        }
      } finally {
        this.loading = false;
      }
    },

    filterRecipes() {
      let filtered = [...this.myRecipes];

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
              return recipe.vegan || recipe.isVegan;
            case "vegetarian":
              return recipe.vegetarian || recipe.isVegetarian;
            case "glutenFree":
              return recipe.glutenFree || recipe.isGlutenFree;
            default:
              return true;
          }
        });
      }

      this.filteredRecipes = filtered;
      this.sortRecipes();
    },

    sortRecipes() {
      const recipes = [...this.filteredRecipes];

      switch (this.sortBy) {
        case "newest":
          recipes.sort((a, b) => (b.id || b.recipe_id) - (a.id || a.recipe_id));
          break;
        case "oldest":
          recipes.sort((a, b) => (a.id || a.recipe_id) - (b.id || b.recipe_id));
          break;
        case "mostLiked":
          recipes.sort((a, b) => (b.likes || 0) - (a.likes || 0));
          break;
        case "title":
          recipes.sort((a, b) => a.title.localeCompare(b.title));
          break;
      }

      this.filteredRecipes = recipes;
    },

    setFilter(filterType) {
      this.filter = filterType;
      this.filterRecipes();
    },

    resetFilters() {
      this.searchQuery = "";
      this.filter = "all";
      this.sortBy = "newest";
      this.filteredRecipes = [...this.myRecipes];
      this.sortRecipes();
    },

    onRecipeCreated() {
      this.loadMyRecipes();
      this.showNotification(
        "Success!",
        "Your recipe has been created",
        "success"
      );
    },

    showNotification(title, message, variant = "info") {
      this.notification = {
        show: true,
        title,
        message,
        variant,
      };

      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    },

    normalizeRecipe(recipe) {
      return {
        id: recipe.id || recipe.recipe_id,
        recipe_id: recipe.recipe_id || recipe.id,
        title: recipe.title,
        image:
          recipe.image || "https://via.placeholder.com/300x200?text=No+Image",
        readyInMinutes: recipe.cookTime || recipe.cook_time || 30,
        cook_time: recipe.cook_time || recipe.cookTime || 30,
        aggregateLikes: recipe.likes || 0,
        likes: recipe.likes || 0,
        vegan: recipe.isVegan || recipe.is_vegan,
        vegetarian: recipe.isVegetarian || recipe.is_vegetarian,
        glutenFree: recipe.isGlutenFree || recipe.is_gluten_free,
        isWatched: recipe.isWatched || false,
        isFavorite: recipe.isFavorite || false,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.my-recipes-page {
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

/* Improved Stats Container */
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

  &:focus {
    border: none;
    box-shadow: none;
  }
}

/* Sort Container */
.sort-container {
  margin-bottom: 0.75rem;
}

.sort-input-group {
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e8dfd6;
  transition: border-color 0.3s ease;

  &:focus-within {
    border-color: #a47551;
    box-shadow: 0 0 0 3px rgba(164, 117, 81, 0.1);
  }
}

.sort-icon {
  background: #f8f9fa;
  border: none;
  color: #a47551;
  border-right: 1px solid #e8dfd6;
}

.sort-select {
  border: none;
  background: white;

  &:focus {
    border: none;
    box-shadow: none;
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

/* Results Count */
.results-count {
  font-style: italic;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-left: 4px solid #a47551;
  border-radius: 4px;
}

.recipe-wrapper {
  position: relative;
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

  .filter-buttons {
    flex-wrap: wrap;
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

  .stats-bar {
    padding: 1rem;
  }

  .stat-number {
    font-size: 1.2rem;
  }
}
</style>
