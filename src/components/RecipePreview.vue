<template>
  <router-link :to="`/recipe/${recipeId}`" class="recipe-card-link">
    <b-card class="recipe-card h-100" no-body>
      <!-- Updated image section with same logic as FamilyRecipes -->
      <div class="recipe-image-container">
        <img
          v-if="
            recipe.image &&
            recipe.image !==
              'https://via.placeholder.com/300x200?text=No+Image' &&
            !isImageMissing
          "
          :src="recipe.image"
          :alt="recipe.title"
          class="recipe-image"
          @error="handleImageError"
        />
        <div v-else class="no-image-placeholder">
          <span>🍽️</span>
        </div>
      </div>

      <b-card-body>
        <b-card-title class="recipe-title">
          {{ recipe.title }}
        </b-card-title>

        <div class="recipe-info">
          <div class="info-item">
            <span class="info-icon">⏱️</span>
            {{ displayTime }} min
          </div>
          <div class="info-item">
            <span class="info-icon">❤️</span>
            {{ displayLikes }}
          </div>
        </div>

        <div class="recipe-badges mt-2">
          <b-badge v-if="isVegan" variant="success" class="me-1">
            Vegan
          </b-badge>
          <b-badge v-if="isVegetarian" variant="info" class="me-1">
            Vegetarian
          </b-badge>
          <b-badge v-if="isGlutenFree" variant="warning"> Gluten Free </b-badge>
        </div>
      </b-card-body>
    </b-card>
  </router-link>
</template>

<script>
export default {
  name: "RecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isImageMissing: false,
    };
  },
  computed: {
    recipeId() {
      return this.recipe.id || this.recipe.recipe_id;
    },
    displayTime() {
      return (
        this.recipe.readyInMinutes ||
        this.recipe.cook_time ||
        this.recipe.cookTime ||
        0
      );
    },
    displayLikes() {
      return (
        this.recipe.aggregateLikes ||
        this.recipe.likes ||
        this.recipe.popularity ||
        0
      );
    },
    isVegan() {
      return this.recipe.vegan || this.recipe.is_vegan || this.recipe.isVegan;
    },
    isVegetarian() {
      return (
        this.recipe.vegetarian ||
        this.recipe.is_vegetarian ||
        this.recipe.isVegetarian
      );
    },
    isGlutenFree() {
      return (
        this.recipe.glutenFree ||
        this.recipe.is_gluten_free ||
        this.recipe.isGlutenFree
      );
    },
  },
  methods: {
    handleImageError() {
      this.isImageMissing = true;
    },
  },
};
</script>

<style scoped>
.recipe-card-link {
  text-decoration: none;
  color: inherit;
}

.recipe-card {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  height: 100%;
  border: 1px solid #e0e0e0;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(164, 117, 81, 0.3);
  border-color: #a47551;
}

/* Updated image container styles to match FamilyRecipes */
.recipe-image-container {
  height: 200px;
  overflow: hidden;
  background: #faf8f3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image-placeholder {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5e6d3 0%, #e8dfd6 100%);
  font-size: 4rem;
}

.recipe-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 2.2em;
}

.recipe-info {
  display: flex;
  justify-content: space-around;
  padding: 0.5rem 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin: 0.5rem 0;
}

.info-item {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
}

.info-icon {
  margin-right: 0.25rem;
  font-size: 1rem;
}

.recipe-badges {
  text-align: center;
  min-height: 1.5em;
}
</style>
