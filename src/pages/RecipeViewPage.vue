<template>
  <div class="recipe-container">
    <div v-if="loading" class="loading-container">
      <b-spinner variant="primary" label="Loading..."></b-spinner>
      <p class="mt-3">Loading recipe...</p>
    </div>

    <div v-else-if="recipe" class="recipe-content">
      <!-- Recipe Header with Title and Actions -->
      <div class="recipe-header">
        <h1 class="recipe-title">{{ recipe.title }}</h1>

        <!-- Action Buttons -->
        <div class="recipe-actions">
          <b-button @click="toggleFavorite" :variant="isFavorite ? 'warning' : 'outline-warning'" class="action-btn"
            v-b-tooltip.hover :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'">
            <b-icon :icon="isFavorite ? 'star-fill' : 'star'"></b-icon>
            {{ isFavorite ? 'Favorited' : 'Favorite' }}
          </b-button>

          <b-button @click="likeRecipe" :variant="isLiked ? 'danger' : 'outline-danger'" class="action-btn"
            :disabled="!isLoggedIn" v-b-tooltip.hover :title="!isLoggedIn ? 'Login to like' : 'Like this recipe'">
            <b-icon :icon="isLiked ? 'heart-fill' : 'heart'"></b-icon>
            {{ recipe.aggregateLikes || 0 }}
          </b-button>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="recipe-main">
        <!-- Left Side - Image and Quick Info -->
        <div class="recipe-left">
          <div class="image-wrapper">
            <img :src="recipe.image" :alt="recipe.title" class="recipe-image" />

            <!-- Quick Info Badges -->
            <div class="quick-info">
              <b-badge variant="info" class="info-badge">
                <b-icon icon="clock"></b-icon>
                {{ recipe.readyInMinutes }} min
              </b-badge>

              <b-badge variant="success" class="info-badge" v-if="recipe.vegan">
                <b-icon icon="leaf"></b-icon>
                Vegan
              </b-badge>

              <b-badge variant="success" class="info-badge" v-if="recipe.vegetarian">
                <b-icon icon="leaf"></b-icon>
                Vegetarian
              </b-badge>

              <b-badge variant="warning" class="info-badge" v-if="recipe.glutenFree">
                <b-icon icon="exclamation-triangle"></b-icon>
                Gluten Free
              </b-badge>

              <b-badge variant="secondary" class="info-badge" v-if="recipe.servings">
                <b-icon icon="people"></b-icon>
                {{ recipe.servings }} servings
              </b-badge>
            </div>
          </div>
        </div>

        <!-- Right Side - Ingredients and Instructions -->
        <div class="recipe-right">
          <b-tabs content-class="recipe-tabs-content">
            <!-- Ingredients Tab -->
            <b-tab title="Ingredients" active>
              <div class="ingredients-section">
                <h3 class="section-title">
                  <b-icon icon="basket"></b-icon>
                  What You'll Need
                </h3>
                <ul class="ingredients-list">
                  <li v-for="(ingredient, index) in recipe.extendedIngredients" :key="index" class="ingredient-item">
                    <b-icon icon="check-circle" class="ingredient-icon"></b-icon>
                    {{ ingredient.original }}
                  </li>
                </ul>
              </div>
            </b-tab>

            <!-- Instructions Tab -->
            <b-tab title="Instructions">
              <div class="instructions-section">
                <h3 class="section-title">
                  <b-icon icon="list-ol"></b-icon>
                  How to Make It
                </h3>
                <ol class="instructions-list">
                  <li v-for="step in recipe._instructions" :key="step.number" class="instruction-step">
                    {{ step.step }}
                  </li>
                </ol>
              </div>
            </b-tab>

            <!-- Nutrition Tab (Optional) -->
            <b-tab title="Details" v-if="recipe.summary">
              <div class="details-section">
                <h3 class="section-title">
                  <b-icon icon="info-circle"></b-icon>
                  Recipe Details
                </h3>
                <div v-html="recipe.summary" class="recipe-summary"></div>
              </div>
            </b-tab>
          </b-tabs>
        </div>
      </div>

      <!-- Bottom Action Bar -->
      <div class="bottom-actions">
        <b-button variant="outline-secondary" @click="$router.push('/')" class="back-btn">
          <b-icon icon="arrow-left"></b-icon>
          Back to Recipes
        </b-button>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="error-container">
      <b-alert variant="danger" show>
        Failed to load recipe. Please try again.
      </b-alert>
      <b-button @click="$router.push('/')" variant="primary">
        Back to Recipes
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecipeViewPage',
  data() {
    return {
      recipe: null,
      loading: true,
      isFavorite: false,
      isLiked: false
    };
  },
  computed: {
    isLoggedIn() {
      return this.$root.store.username !== undefined;
    }
  },
  async created() {
    await this.loadRecipe();
  },
  methods: {
    async loadRecipe() {
      try {
        this.loading = true;
        const recipeId = this.$route.params.recipeId;

        const response = await this.axios.get(
          `${this.$root.store.server_domain}/recipes/${recipeId}`
        );

        if (response.status !== 200) {
          this.$router.replace("/NotFound");
          return;
        }

        // Handle both wrapped and unwrapped responses
        const data = response.data.recipe || response.data;

        let {
          analyzedInstructions,
          instructions,
          extendedIngredients,
          aggregateLikes,
          readyInMinutes,
          image,
          title,
          vegan,
          vegetarian,
          glutenFree,
          servings,
          summary,
          isFavorite
        } = data;

        // Process instructions
        let _instructions = [];
        if (analyzedInstructions && analyzedInstructions.length > 0) {
          _instructions = analyzedInstructions
            .map((fstep) => {
              if (fstep.steps && fstep.steps.length > 0) {
                if (fstep.name) {
                  fstep.steps[0].step = fstep.name + ": " + fstep.steps[0].step;
                }
                return fstep.steps;
              }
              return [];
            })
            .reduce((a, b) => [...a, ...b], []);
        } else if (instructions) {
          // Fallback to simple instructions
          _instructions = instructions
            .split(/[.\n]/)
            .filter(step => step.trim())
            .map((step, index) => ({
              number: index + 1,
              step: step.trim()
            }));
        }

        this.recipe = {
          title,
          image,
          readyInMinutes,
          aggregateLikes,
          vegan,
          vegetarian,
          glutenFree,
          servings,
          summary,
          instructions,
          _instructions,
          analyzedInstructions,
          extendedIngredients: extendedIngredients || []
        };

        this.isFavorite = isFavorite || false;
        this.isLiked = false; // You can track this separately if needed

      } catch (error) {
        console.error("Error loading recipe:", error);
        this.$router.replace("/NotFound");
      } finally {
        this.loading = false;
      }
    },

    async toggleFavorite() {
      if (!this.isLoggedIn) {
        alert('Please login to add favorites');
        return;
      }

      try {
        const recipeId = this.$route.params.recipeId;

        if (this.isFavorite) {
          await this.axios.delete(`/users/favorites/${recipeId}`);
          this.isFavorite = false;
          console.log('Removed from favorites');
        } else {
          await this.axios.post('/users/favorites', { recipeId });
          this.isFavorite = true;
          console.log('Added to favorites!');
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
        if (error.response && error.response.status === 409) {
          // Already in favorites, just update the UI
          this.isFavorite = true;
        } else {
          alert('Failed to update favorites');
        }
      }
    },

    async likeRecipe() {
      if (!this.isLoggedIn) {
        alert('Please login to like recipes');
        return;
      }

      try {
        const recipeId = this.$route.params.recipeId;

        // Toggle like state
        this.isLiked = !this.isLiked;

        // Update like count locally
        if (this.isLiked) {
          this.recipe.aggregateLikes = (this.recipe.aggregateLikes || 0) + 1;
        } else {
          this.recipe.aggregateLikes = Math.max(0, (this.recipe.aggregateLikes || 0) - 1);
        }

        // Update likes in database if it's a local recipe
        // Check if recipe ID is small (local) vs large (Spoonacular)
        if (recipeId < 10000) {
          // It's likely a local recipe, update the database
          await this.axios.put(`/recipes/${recipeId}/like`, {
            likes: this.recipe.aggregateLikes
          });
        }
        // For Spoonacular recipes, we just update the UI
        // You might want to track user likes separately in a user_likes table

      } catch (error) {
        console.error('Error updating likes:', error);
        // Revert the UI change if the update failed
        this.isLiked = !this.isLiked;
        if (this.isLiked) {
          this.recipe.aggregateLikes = (this.recipe.aggregateLikes || 0) + 1;
        } else {
          this.recipe.aggregateLikes = Math.max(0, (this.recipe.aggregateLikes || 0) - 1);
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.recipe-container {
  min-height: calc(100vh - 120px);
  background: #fafafa;
  padding: 1rem;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.recipe-content {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.recipe-header {
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.recipe-title {
  font-size: 1.8rem;
  margin: 0;
  font-weight: bold;
  color: #333;
}

.recipe-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.recipe-main {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
  padding: 1.5rem;
  max-height: calc(100vh - 350px);
  overflow: hidden;
}

.recipe-left {
  display: flex;
  flex-direction: column;
}

.image-wrapper {
  position: relative;
}

.recipe-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.quick-info {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.info-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
}

.recipe-right {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.recipe-tabs-content {
  max-height: calc(100vh - 450px);
  overflow-y: auto;
  padding: 1rem;
}

.section-title {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ingredients-list {
  list-style: none;
  padding: 0;
}

.ingredient-item {
  padding: 0.5rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.ingredient-icon {
  color: #28a745;
  margin-top: 0.2rem;
}

.instructions-list {
  padding-left: 1.5rem;
}

.instruction-step {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #555;
}

.recipe-summary {
  line-height: 1.6;
  color: #555;
}

.bottom-actions {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #dee2e6;
}

.back-btn,
.cook-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

// Custom scrollbar for tabs content
.recipe-tabs-content::-webkit-scrollbar {
  width: 8px;
}

.recipe-tabs-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.recipe-tabs-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.recipe-tabs-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

// Responsive design
@media (max-width: 992px) {
  .recipe-main {
    grid-template-columns: 1fr;
    max-height: none;
  }

  .recipe-image {
    height: 250px;
  }

  .recipe-tabs-content {
    max-height: none;
  }
}

@media (max-width: 576px) {
  .recipe-header {
    flex-direction: column;
    text-align: center;
  }

  .recipe-title {
    font-size: 1.5rem;
  }

  .recipe-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>