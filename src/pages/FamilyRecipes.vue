<template>
  <div class="family-recipes-container">
    <!-- Header Section -->
    <div class="header-section">
      <h1 class="page-title">Our Family Recipe Collection</h1>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
      <p>Loading family recipes...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
    </div>

    <!-- Recipes Grid -->
    <div v-else class="recipes-grid">
      <div v-for="recipe in recipes" :key="recipe.recipeId" class="recipe-card">
        <!-- Recipe Image -->
        <div class="recipe-image-container" @click="openRecipeModal(recipe)">
          <img
            v-if="recipe.image"
            :src="recipe.image"
            :alt="recipe.title"
            class="recipe-image"
          />
          <div v-else class="no-image-placeholder">
            <span>🍽️</span>
          </div>
          <div class="image-overlay">
            <span>View Recipe</span>
          </div>
        </div>

        <!-- Recipe Info -->
        <div class="recipe-content">
          <h2 class="recipe-title">{{ recipe.title }}</h2>

          <div class="family-info">
            <p class="who-made">
              <span class="label">From:</span>
              <span class="value">{{ recipe.whoMadeIt }}</span>
            </p>
            <p class="when-made">
              <span class="label">Made for:</span>
              <span class="value">{{ recipe.whenMade }}</span>
            </p>
          </div>

          <div class="recipe-meta">
            <span v-if="recipe.cookTime" class="meta-item">
              ⏱️ {{ recipe.cookTime }} min
            </span>
            <span v-if="recipe.servings" class="meta-item">
              👥 Serves {{ recipe.servings }}
            </span>
          </div>

          <div class="dietary-badges">
            <span v-if="recipe.isVegan" class="badge vegan">Vegan</span>
            <span v-if="recipe.isVegetarian" class="badge vegetarian"
              >Vegetarian</span
            >
            <span v-if="recipe.isGlutenFree" class="badge gluten-free"
              >Gluten-Free</span
            >
          </div>

          <button @click="openRecipeModal(recipe)" class="view-recipe-btn">
            View Full Recipe
          </button>
        </div>
      </div>
    </div>

    <!-- Recipe Modal -->
    <div v-if="selectedRecipe" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">×</button>

        <div class="modal-header">
          <h2>{{ selectedRecipe.title }}</h2>
          <div class="modal-family-info">
            <p>
              <strong>From {{ selectedRecipe.whoMadeIt }}</strong>
            </p>
            <p class="occasion">{{ selectedRecipe.whenMade }}</p>
          </div>
        </div>

        <div class="modal-body">
          <div v-if="selectedRecipe.image" class="modal-image">
            <img :src="selectedRecipe.image" :alt="selectedRecipe.title" />
          </div>

          <div class="modal-meta">
            <span v-if="selectedRecipe.cookTime"
              >⏱️ {{ selectedRecipe.cookTime }} minutes</span
            >
            <span v-if="selectedRecipe.servings"
              >👥 Serves {{ selectedRecipe.servings }}</span
            >
            <div class="modal-dietary">
              <span v-if="selectedRecipe.isVegan" class="badge vegan"
                >Vegan</span
              >
              <span v-if="selectedRecipe.isVegetarian" class="badge vegetarian"
                >Vegetarian</span
              >
              <span v-if="selectedRecipe.isGlutenFree" class="badge gluten-free"
                >Gluten-Free</span
              >
            </div>
          </div>

          <div class="recipe-details">
            <div class="ingredients-section">
              <h3>Ingredients</h3>
              <ul>
                <li
                  v-for="(ingredient, index) in parseIngredients(
                    selectedRecipe.ingredients
                  )"
                  :key="index"
                >
                  {{ ingredient }}
                </li>
              </ul>
            </div>

            <div class="instructions-section">
              <h3>Instructions</h3>
              <ol>
                <li
                  v-for="(instruction, index) in parseInstructions(
                    selectedRecipe.instructions
                  )"
                  :key="index"
                >
                  {{ instruction }}
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FamilyRecipes",
  data() {
    return {
      recipes: [],
      loading: true,
      error: null,
      selectedRecipe: null,
    };
  },
  async mounted() {
    // Check if user is logged in before fetching recipes
    if (!this.$root.store.username) {
      // Redirect to login or 404 if not logged in
      this.$router.replace({ name: "notFound" });
      return;
    }
    await this.fetchFamilyRecipes();
  },
  methods: {
    async fetchFamilyRecipes() {
      try {
        this.loading = true;
        this.error = null;

        // Double-check authentication
        if (!this.$root.store.username) {
          this.$router.replace({ name: "notFound" });
          return;
        }

        const response = await this.axios.get("/users/family-recipes", {
          withCredentials: true,
        });

        this.recipes = response.data;

        // Check if we got recipes
        if (this.recipes.length === 0) {
          this.error = "No family recipes found yet.";
        }
      } catch (err) {
        console.error("Error fetching family recipes:", err);
        if (err.response && err.response.status === 401) {
          // Unauthorized - redirect to 404 or login
          this.$router.replace("/404");
        } else if (err.response && err.response.status === 404) {
          this.$router.replace("/404");
        } else {
          this.error = "Failed to load family recipes. Please try again later.";
        }
      } finally {
        this.loading = false;
      }
    },

    openRecipeModal(recipe) {
      this.selectedRecipe = recipe;
      document.body.style.overflow = "hidden";
    },

    closeModal() {
      this.selectedRecipe = null;
      document.body.style.overflow = "auto";
    },

    parseIngredients(ingredients) {
      if (!ingredients) return [];
      // Split by comma and trim each ingredient
      return ingredients.split(",").map((ing) => ing.trim());
    },

    parseInstructions(instructions) {
      if (!instructions) return [];
      // Split by newline or number patterns like "1." or "1)"
      return instructions
        .split(/\n|\d+\.\s*|\d+\)\s*/)
        .filter((inst) => inst.trim())
        .map((inst) => inst.trim());
    },
  },
};
</script>

<style scoped>
.family-recipes-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
  /* Match MyFavorites padding style */
  background: linear-gradient(to bottom, #faf8f3, #ffffff);
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 2rem;
  /* Back to 2rem like MyFavorites */
  padding: 0;
  /* Remove padding completely */
  border-bottom: none;
  /* Remove the border that MyFavorites doesn't have */
}

.page-title {
  color: #a47551;
  /* Match MyFavorites color */
  font-weight: bold;
  margin-bottom: 2rem;
  font-family: "Georgia", serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  /* Add text shadow like MyFavorites */
  font-size: 2rem;
  position: relative;
}

.intro-text {
  font-size: 1.1rem;
  color: #6b5d54;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  font-style: italic;
}

/* Loading State */
.loading-container {
  text-align: center;
  padding: 4rem;
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #d4a574;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Error State */
.error-container {
  text-align: center;
  padding: 4rem;
  color: #d32f2f;
}

/* Recipes Grid */
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  /* Remove margin-bottom completely - no bottom margin like MyFavorites */
}

/* Recipe Card */
.recipe-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #e8dfd6;
  display: flex;
  flex-direction: column;
  min-height: 600px;
  max-height: 650px;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

/* Recipe Image */
.recipe-image-container {
  position: relative;
  height: 200px;
  cursor: pointer;
  overflow: hidden;
  background: #faf8f3;
  flex-shrink: 0;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.recipe-image-container:hover .recipe-image {
  transform: scale(1.05);
}

.no-image-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5e6d3 0%, #e8dfd6 100%);
  font-size: 4rem;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.recipe-image-container:hover .image-overlay {
  opacity: 1;
}

.image-overlay span {
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border: 2px solid white;
  border-radius: 4px;
}

/* Recipe Content */
.recipe-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
}

.recipe-title {
  font-family: "Georgia", serif;
  font-size: 1.4rem;
  color: #5c4033;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.family-info {
  background: #faf8f3;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  border-left: 4px solid #d4a574;
}

.who-made,
.when-made {
  margin: 0.25rem 0;
  color: #6b5d54;
  font-size: 0.9rem;
}

.label {
  font-weight: bold;
  color: #5c4033;
}

.value {
  font-style: italic;
}

.recipe-meta {
  display: flex;
  gap: 1rem;
  margin: 0.75rem 0;
  color: #8b7355;
  font-size: 0.9rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Dietary Badges */
.dietary-badges {
  display: flex;
  gap: 0.5rem;
  margin: 0.75rem 0;
  flex-wrap: wrap;
}

.badge {
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge.vegan {
  background: #4caf50;
  color: white;
}

.badge.vegetarian {
  background: #8bc34a;
  color: white;
}

.badge.gluten-free {
  background: #ff9800;
  color: white;
}

/* View Recipe Button */
.view-recipe-btn {
  width: 100%;
  padding: 0.75rem;
  background: #d4a574;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: auto;
  flex-shrink: 0;
}

.view-recipe-btn:hover {
  background: #b8935f;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 900px;
  max-height: 95vh;
  overflow-y: auto;
  position: relative;
  width: 100%;
  margin: auto;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #5c4033;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s;
  z-index: 1;
}

.close-btn:hover {
  background: #f5f5f5;
}

.modal-header {
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 2px solid #e8dfd6;
}

.modal-header h2 {
  font-family: "Georgia", serif;
  color: #5c4033;
  margin-bottom: 0.75rem;
  padding-right: 2rem;
  font-size: 1.8rem;
}

.modal-family-info {
  color: #6b5d54;
}

.modal-family-info p {
  margin: 0.25rem 0;
}

.occasion {
  font-style: italic;
  color: #8b7355;
}

.modal-body {
  padding: 1.5rem;
}

.modal-image {
  width: 100%;
  height: 300px;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #f5f5f5;
}

.modal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: #faf8f3;
  border-radius: 8px;
  font-size: 0.95rem;
}

.modal-dietary {
  display: flex;
  gap: 0.5rem;
}

.recipe-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.ingredients-section h3,
.instructions-section h3 {
  font-family: "Georgia", serif;
  color: #5c4033;
  margin-bottom: 0.75rem;
  font-size: 1.2rem;
  border-bottom: 2px solid #d4a574;
  padding-bottom: 0.4rem;
}

.ingredients-section ul {
  list-style: none;
  padding: 0;
}

.ingredients-section li {
  padding: 0.4rem 0;
  border-bottom: 1px solid #f0f0f0;
  color: #6b5d54;
  font-size: 0.95rem;
}

.ingredients-section li:before {
  content: "• ";
  color: #d4a574;
  font-weight: bold;
  margin-right: 0.5rem;
}

.instructions-section ol {
  padding-left: 1.5rem;
}

.instructions-section li {
  padding: 0.4rem 0;
  color: #6b5d54;
  line-height: 1.5;
  font-size: 0.95rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .family-recipes-container {
    padding: 1rem;
  }

  .recipes-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .recipe-card {
    min-height: 550px;
    max-height: 600px;
  }

  .recipe-image-container {
    height: 180px;
  }

  .page-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.6rem;
  }

  .recipe-card {
    min-height: 500px;
    max-height: 550px;
  }
}
</style>
