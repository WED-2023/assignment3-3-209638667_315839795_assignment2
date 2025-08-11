<template>
  <router-link :to="`/recipe/${recipeId}`" class="recipe-card-link">
    <b-card class="recipe-card h-100" no-body>
      <b-card-img :src="recipe.image || 'https://via.placeholder.com/300x200?text=No+Image'" :alt="recipe.title"
        class="recipe-image" top />

      <b-card-body>
        <b-card-title class="recipe-title">
          {{ recipe.title }}
        </b-card-title>

        <div class="recipe-info">
          <div class="info-item">
            <b-icon icon="clock" class="mr-1"></b-icon>
            {{ displayTime }} min
          </div>
          <div class="info-item">
            <b-icon icon="heart" class="mr-1"></b-icon>
            {{ displayLikes }}
          </div>
        </div>

        <div class="recipe-badges mt-2">
          <b-badge v-if="isVegan" variant="success" class="mr-1">
            Vegan
          </b-badge>
          <b-badge v-if="isVegetarian" variant="info" class="mr-1">
            Vegetarian
          </b-badge>
          <b-badge v-if="isGlutenFree" variant="warning">
            Gluten Free
          </b-badge>
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
      required: true
    }
  },
  computed: {
    recipeId() {
      return this.recipe.id || this.recipe.recipe_id;
    },
    displayTime() {
      return this.recipe.readyInMinutes ||
        this.recipe.cook_time ||
        this.recipe.cookTime ||
        0;
    },
    displayLikes() {
      return this.recipe.aggregateLikes ||
        this.recipe.likes ||
        this.recipe.popularity ||
        0;
    },
    isVegan() {
      return this.recipe.vegan ||
        this.recipe.is_vegan ||
        this.recipe.isVegan;
    },
    isVegetarian() {
      return this.recipe.vegetarian ||
        this.recipe.is_vegetarian ||
        this.recipe.isVegetarian;
    },
    isGlutenFree() {
      return this.recipe.glutenFree ||
        this.recipe.is_gluten_free ||
        this.recipe.isGlutenFree;
    }
  }
}
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
  border-color: #A47551;
}

.recipe-image {
  height: 200px;
  object-fit: cover;
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

.recipe-badges {
  text-align: center;
  min-height: 1.5em;
}
</style>