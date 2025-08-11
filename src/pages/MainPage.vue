<template>
  <div class="container main-page">
    <h1 class="page-title text-center mb-4">Granny's Recipes</h1>

    <b-row>
      <!-- Left Column - Random Recipes -->
      <b-col lg="6" class="mb-4">
        <div class="recipes-section">
          <h2 class="section-title">
            <b-icon icon="shuffle" class="mr-2"></b-icon>
            Explore These Recipes
          </h2>

          <div v-if="loadingRandom" class="text-center py-5">
            <b-spinner variant="primary"></b-spinner>
            <p class="mt-2">Loading recipes...</p>
          </div>

          <!-- Scrollable recipes container -->
          <div v-else class="recipes-scroll-container">
            <RecipePreview v-for="recipe in randomRecipes" :key="recipe.id || recipe.recipe_id" :recipe="recipe"
              class="mb-3" />
          </div>

          <div class="text-center mt-3">
            <b-button variant="primary" @click="loadRandomRecipes" :disabled="loadingRandom" class="refresh-button">
              <b-icon icon="arrow-clockwise" class="mr-2"></b-icon>
              Get New Recipes
            </b-button>
          </div>
        </div>
      </b-col>

      <!-- Right Column - Last Viewed or Login -->
      <b-col lg="6" class="mb-4">
        <div class="recipes-section">
          <!-- For Logged In Users -->
          <template v-if="store.isLoggedIn">
            <h2 class="section-title">
              <b-icon icon="clock-history" class="mr-2"></b-icon>
              Last Watched Recipes
            </h2>

            <div v-if="loadingLastViewed" class="text-center py-5">
              <b-spinner variant="primary"></b-spinner>
              <p class="mt-2">Loading your recent recipes...</p>
            </div>

            <div v-else-if="lastViewedRecipes.length === 0" class="text-center py-5">
              <b-icon icon="eye-slash" font-scale="3" class="text-muted mb-3"></b-icon>
              <p class="text-muted">You haven't viewed any recipes yet.</p>
              <p class="text-muted">Start exploring to see your history here!</p>
            </div>

            <!-- Scrollable last viewed recipes -->
            <div v-else class="recipes-scroll-container">
              <RecipePreview v-for="recipe in lastViewedRecipes" :key="recipe.id || recipe.recipe_id" :recipe="recipe"
                class="mb-3" />
            </div>
          </template>

          <!-- For Non-Logged In Users - Login Form -->
          <template v-else>
            <div class="login-section">
              <div class="text-center mb-4">
                <b-icon icon="person-circle" font-scale="3" class="text-primary mb-3"></b-icon>
                <h3>Welcome to Granny's Recipes!</h3>
                <p class="text-muted">
                  Login to see your recently viewed recipes and save your favorites
                </p>
              </div>

              <!-- Login Form -->
              <b-form @submit.prevent="handleLogin" class="login-form">
                <!-- Error Alert -->
                <b-alert v-if="loginError" variant="danger" dismissible @dismissed="loginError = ''" show>
                  {{ loginError }}
                </b-alert>

                <!-- Username Field -->
                <b-form-group label="Username" label-for="username-input">
                  <b-form-input id="username-input" v-model="loginForm.username" type="text"
                    placeholder="Enter your username" required
                    :state="loginForm.username.length > 0 ? true : null"></b-form-input>
                </b-form-group>

                <!-- Password Field -->
                <b-form-group label="Password" label-for="password-input">
                  <b-form-input id="password-input" v-model="loginForm.password" type="password"
                    placeholder="Enter your password" required
                    :state="loginForm.password.length > 0 ? true : null"></b-form-input>
                </b-form-group>

                <!-- Login Button -->
                <b-button type="submit" variant="primary" block size="lg" :disabled="!isLoginFormValid || isLoggingIn"
                  class="mb-3">
                  <b-spinner v-if="isLoggingIn" small class="mr-2"></b-spinner>
                  <b-icon v-else icon="box-arrow-in-right" class="mr-2"></b-icon>
                  {{ isLoggingIn ? 'Logging in...' : 'Login' }}
                </b-button>

                <!-- Register Link -->
                <div class="text-center">
                  <p class="text-muted">
                    Don't have an account?
                    <b-link @click="$router.push('/register')">Register here</b-link>
                  </p>
                </div>
              </b-form>
            </div>
          </template>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import RecipePreview from "../components/RecipePreview.vue";
import store from '../store';
import axios from 'axios';

export default {
  name: 'MainPage',
  components: {
    RecipePreview
  },
  data() {
    return {
      randomRecipes: [],
      lastViewedRecipes: [],
      loadingRandom: false,
      loadingLastViewed: false,
      loginForm: {
        username: '',
        password: ''
      },
      isLoggingIn: false,
      loginError: ''
    };
  },
  computed: {
    store() {
      return store;
    },
    isLoginFormValid() {
      return this.loginForm.username.length > 0 &&
        this.loginForm.password.length > 0;
    }
  },
  mounted() {
    this.loadRandomRecipes();
    if (this.store.isLoggedIn) {
      this.loadLastViewedRecipes();
    }
  },
  watch: {
    'store.isLoggedIn'(newVal) {
      if (newVal) {
        this.loadLastViewedRecipes();
        // Clear login form
        this.loginForm.username = '';
        this.loginForm.password = '';
        this.loginError = '';
      } else {
        this.lastViewedRecipes = [];
      }
    }
  },
  methods: {
    async handleLogin() {
      if (!this.isLoginFormValid) return;

      this.isLoggingIn = true;
      this.loginError = '';

      try {
        const response = await axios.post('/login', {
          username: this.loginForm.username,
          password: this.loginForm.password
        });

        if (response.status === 200) {
          // Store the username in the store
          this.store.login(this.loginForm.username);

          // Load last viewed recipes after successful login
          this.loadLastViewedRecipes();

          // Show success message (optional)
          console.log('Login successful!');
        }
      } catch (error) {
        console.error('Login error:', error);

        if (error.response?.status === 401) {
          this.loginError = 'Invalid username or password';
        } else if (error.response?.data?.message) {
          this.loginError = error.response.data.message;
        } else {
          this.loginError = 'An error occurred during login. Please try again.';
        }
      } finally {
        this.isLoggingIn = false;
      }
    },

    async loadRandomRecipes() {
      this.loadingRandom = true;
      try {
        const response = await axios.get('/recipes/random');
        this.randomRecipes = response.data.recipes.map(recipe => this.normalizeRecipe(recipe));
      } catch (error) {
        console.error('Error loading random recipes:', error);
        this.randomRecipes = [];
      } finally {
        this.loadingRandom = false;
      }
    },

    async loadLastViewedRecipes() {
      if (!this.store.isLoggedIn) return;

      this.loadingLastViewed = true;
      try {
        const response = await axios.get('/users/last-viewed-recipes');
        this.lastViewedRecipes = response.data.map(recipe => this.normalizeRecipe(recipe));
      } catch (error) {
        console.error('Error loading last viewed recipes:', error);
        this.lastViewedRecipes = [];
      } finally {
        this.loadingLastViewed = false;
      }
    },

    normalizeRecipe(recipe) {
      return {
        id: recipe.id || recipe.recipe_id,
        recipe_id: recipe.recipe_id || recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes || recipe.cook_time || recipe.cookTime,
        cook_time: recipe.cook_time || recipe.cookTime || recipe.readyInMinutes,
        aggregateLikes: recipe.popularity || recipe.aggregateLikes || recipe.likes || 0,
        likes: recipe.likes || recipe.aggregateLikes || recipe.popularity || 0,
        vegan: recipe.vegan || recipe.is_vegan || recipe.isVegan,
        vegetarian: recipe.vegetarian || recipe.is_vegetarian || recipe.isVegetarian,
        glutenFree: recipe.glutenFree || recipe.is_gluten_free || recipe.isGlutenFree
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.main-page {
  padding: 2rem 0;
  height: calc(100vh - 120px); // Adjust based on your navbar height
}

.page-title {
  color: #A47551;
  font-weight: bold;
  margin-bottom: 2rem;
  font-family: 'Georgia', serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #A47551;
  display: flex;
  align-items: center;
}

.recipes-section {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: 600px; // Fixed height for both columns
  display: flex;
  flex-direction: column;
}

// Scrollable container for recipes
.recipes-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 10px;
  margin-bottom: 10px;

  // Custom scrollbar styling
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #A47551;
    border-radius: 10px;

    &:hover {
      background: #8B6341;
    }
  }
}

.refresh-button {
  background-color: #A47551;
  border-color: #A47551;

  &:hover:not(:disabled) {
    background-color: #8B6341;
    border-color: #8B6341;
  }

  &:disabled {
    opacity: 0.6;
  }
}

.login-section {
  padding: 1rem;

  h3 {
    color: #333;
    margin-bottom: 1rem;
  }
}

.login-form {
  max-width: 400px;
  margin: 0 auto;

  .form-group {
    margin-bottom: 1.5rem;

    label {
      font-weight: 600;
      color: #555;
      margin-bottom: 0.5rem;
    }
  }

  .btn-primary {
    background-color: #A47551;
    border-color: #A47551;
    font-weight: 600;
    letter-spacing: 0.5px;

    &:hover:not(:disabled) {
      background-color: #8B6341;
      border-color: #8B6341;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .form-control {
    border-radius: 8px;
    border: 1px solid #ddd;
    padding: 0.75rem;

    &:focus {
      border-color: #A47551;
      box-shadow: 0 0 0 0.2rem rgba(164, 117, 81, 0.25);
    }
  }
}

// Responsive design
@media (max-width: 991px) {
  .recipes-section {
    margin-bottom: 1rem;
    height: 500px;
  }

  .main-page {
    height: auto;
  }
}

@media (max-width: 576px) {
  .recipes-section {
    height: 450px;
  }

  .recipes-scroll-container {
    padding-right: 5px;
  }
}
</style>