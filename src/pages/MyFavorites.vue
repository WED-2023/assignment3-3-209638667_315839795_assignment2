<template>
    <div class="container favorites-page">
        <!-- Toast Notification -->
        <div v-if="notification.show"
            :class="`alert alert-${notification.variant} alert-dismissible fade show position-fixed`"
            style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;" role="alert">
            <strong>{{ notification.title }}</strong> {{ notification.message }}
            <button type="button" class="btn-close" @click="notification.show = false"></button>
        </div>

        <!-- Confirmation Modal for Remove -->
        <b-modal v-model="showRemoveModal" :title="`Remove from Favorites`" centered ok-title="Remove"
            ok-variant="danger" cancel-variant="outline-secondary" @ok="confirmRemoveFavorite">
            <div class="text-center">
                <b-icon icon="heart-fill" font-scale="3" class="text-danger mb-3"></b-icon>
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
            <p class="text-muted">You need to be logged in to save and view favorite recipes</p>
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

        <!-- No favorites state -->
        <div v-else-if="favorites.length === 0" class="text-center py-5">
            <b-icon icon="heart" font-scale="3" class="text-muted mb-3"></b-icon>
            <h3>You don't have any favorite recipes yet</h3>
            <p class="text-muted">Start exploring recipes and mark your favorites!</p>
            <b-button variant="primary" @click="$router.push('/search')" class="mt-3">
                <b-icon icon="search" class="mr-2"></b-icon>
                Search Recipes
            </b-button>
        </div>

        <!-- Favorites grid -->
        <div v-else>
            <!-- Search and filter bar -->
            <b-row class="mb-4">
                <b-col md="6">
                    <b-input-group>
                        <b-input-group-prepend>
                            <b-input-group-text>
                                <b-icon icon="search"></b-icon>
                            </b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-input v-model="searchQuery" placeholder="Search in your favorites..."
                            @input="filterFavorites"></b-form-input>
                    </b-input-group>
                </b-col>
                <b-col md="6">
                    <b-button-group class="w-100">
                        <b-button :variant="filter === 'all' ? 'primary' : 'outline-primary'" @click="setFilter('all')">
                            All ({{ favorites.length }})
                        </b-button>
                        <b-button :variant="filter === 'vegan' ? 'success' : 'outline-success'"
                            @click="setFilter('vegan')">
                            <b-icon icon="leaf" class="mr-1"></b-icon>
                            Vegan
                        </b-button>
                        <b-button :variant="filter === 'vegetarian' ? 'info' : 'outline-info'"
                            @click="setFilter('vegetarian')">
                            <b-icon icon="egg" class="mr-1"></b-icon>
                            Vegetarian
                        </b-button>
                        <b-button :variant="filter === 'glutenFree' ? 'warning' : 'outline-warning'"
                            @click="setFilter('glutenFree')">
                            Gluten Free
                        </b-button>
                    </b-button-group>
                </b-col>
            </b-row>

            <!-- Results count -->
            <div v-if="filteredFavorites.length !== favorites.length" class="mb-3">
                <p class="text-muted">
                    Showing {{ filteredFavorites.length }} of {{ favorites.length }} favorite recipes
                </p>
            </div>

            <!-- Recipes grid -->
            <b-row>
                <b-col v-for="recipe in filteredFavorites" :key="recipe.id || recipe.recipe_id" cols="12" md="6" lg="4"
                    class="mb-4">
                    <div class="recipe-wrapper">
                        <RecipePreview :recipe="recipe" />
                        <div class="recipe-actions mt-2">
                            <b-button variant="outline-danger" size="sm" @click="removeFavorite(recipe)" class="w-100">
                                <b-icon icon="heart-fill" class="mr-1"></b-icon>
                                Remove from Favorites
                            </b-button>
                        </div>
                    </div>
                </b-col>
            </b-row>

            <!-- No results for filter -->
            <div v-if="filteredFavorites.length === 0 && favorites.length > 0" class="text-center py-5">
                <b-icon icon="funnel" font-scale="2" class="text-muted mb-3"></b-icon>
                <p class="text-muted">No recipes found matching your filter</p>
                <b-button variant="outline-primary" size="sm" @click="resetFilters">
                    Reset Filters
                </b-button>
            </div>
        </div>
    </div>
</template>

<script>
import RecipePreview from "../components/RecipePreview.vue";
import store from '../store';
import axios from 'axios';

export default {
    name: 'MyFavorites',
    components: {
        RecipePreview
    },
    data() {
        return {
            favorites: [],
            filteredFavorites: [],
            loading: false,
            error: null,
            searchQuery: '',
            filter: 'all',
            recipeToRemove: null, // For the modal
            showRemoveModal: false, // Control modal visibility
            notification: {
                show: false,
                title: '',
                message: '',
                variant: 'success'
            }
        };
    },
    computed: {
        store() {
            return store;
        }
    },
    mounted() {
        if (this.store.isLoggedIn) {
            this.loadFavorites();
        }
    },
    watch: {
        'store.isLoggedIn'(newVal) {
            if (newVal) {
                this.loadFavorites();
            } else {
                this.favorites = [];
                this.filteredFavorites = [];
            }
        }
    },
    methods: {
        async loadFavorites() {
            this.loading = true;
            this.error = null;

            try {
                const response = await axios.get('/users/favorites');

                // Simply process the recipes that were successfully loaded
                // If empty array due to API issues, it will just show "no favorites" message
                this.favorites = response.data.map(recipe => this.normalizeRecipe(recipe));
                this.filteredFavorites = [...this.favorites];

            } catch (error) {
                console.error('Error loading favorites:', error);

                if (error.response?.status === 401) {
                    this.error = 'You need to login to view your favorites';
                    // Redirect to login
                    setTimeout(() => {
                        this.$router.push('/login');
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
                const index = this.favorites.findIndex(r =>
                    (r.id || r.recipe_id) === recipeId
                );
                if (index > -1) {
                    this.favorites.splice(index, 1);
                }

                const filteredIndex = this.filteredFavorites.findIndex(r =>
                    (r.id || r.recipe_id) === recipeId
                );
                if (filteredIndex > -1) {
                    this.filteredFavorites.splice(filteredIndex, 1);
                }

                // Show success notification
                this.showNotification('Success!', `"${recipeTitle}" has been removed from your favorites`, 'success');

            } catch (error) {
                console.error('Error removing favorite:', error);
                // Show error notification
                this.showNotification('Error', 'Failed to remove recipe from favorites. Please try again.', 'danger');
            } finally {
                this.recipeToRemove = null;
                this.showRemoveModal = false;
            }
        },

        showNotification(title, message, variant = 'info') {
            this.notification = {
                show: true,
                title,
                message,
                variant
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
                filtered = filtered.filter(recipe =>
                    recipe.title.toLowerCase().includes(query)
                );
            }

            // Apply dietary filter
            if (this.filter !== 'all') {
                filtered = filtered.filter(recipe => {
                    switch (this.filter) {
                        case 'vegan':
                            return recipe.vegan || recipe.is_vegan || recipe.isVegan;
                        case 'vegetarian':
                            return recipe.vegetarian || recipe.is_vegetarian || recipe.isVegetarian;
                        case 'glutenFree':
                            return recipe.glutenFree || recipe.is_gluten_free || recipe.isGlutenFree;
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
            this.searchQuery = '';
            this.filter = 'all';
            this.filteredFavorites = [...this.favorites];
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
                glutenFree: recipe.glutenFree || recipe.is_gluten_free || recipe.isGlutenFree,
                isFavorite: true // Always true for favorites page
            };
        }
    }
};
</script>

<style lang="scss" scoped>
.favorites-page {
    padding: 2rem 0;
    min-height: calc(100vh - 120px);
}

.page-title {
    color: #A47551;
    font-weight: bold;
    margin-bottom: 2rem;
    font-family: 'Georgia', serif;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
}

.recipe-wrapper {
    position: relative;
}

.recipe-actions {
    .btn-outline-danger {
        border-color: #dc3545;
        color: #dc3545;

        &:hover {
            background-color: #dc3545;
            border-color: #dc3545;
            color: white;
        }
    }
}

// Search and filter styles
.input-group {
    .form-control {
        border-radius: 0.25rem 0 0 0.25rem;
        border-right: none;

        &:focus {
            border-color: #A47551;
            box-shadow: none;
        }
    }

    .input-group-text {
        background-color: white;
        border-left: none;
        border-color: #ced4da;
    }
}

.btn-group {
    .btn {
        font-size: 0.9rem;
        padding: 0.5rem 1rem;

        &.btn-primary,
        &.btn-outline-primary:hover {
            background-color: #A47551;
            border-color: #A47551;
        }

        &.btn-outline-primary {
            color: #A47551;
            border-color: #A47551;
        }
    }
}

// Loading and empty states
.spinner-border {
    width: 3rem;
    height: 3rem;
    border-width: 0.3em;
}

// Responsive design
@media (max-width: 768px) {
    .btn-group {
        margin-top: 1rem;

        .btn {
            font-size: 0.8rem;
            padding: 0.4rem 0.5rem;
        }
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