<template>
    <div class="container my-recipes-page">
        <!-- Create Recipe Modal -->
        <CreateRecipeModal v-if="showCreateModal" @close="showCreateModal = false" @recipe-created="onRecipeCreated" />

        <h1 class="page-title text-center mb-4">
            <b-icon icon="book" class="mr-2 text-primary"></b-icon>
            My Recipes
        </h1>

        <!-- Not logged in message -->
        <div v-if="!store.isLoggedIn" class="text-center py-5">
            <b-icon icon="person-x" font-scale="3" class="text-muted mb-3"></b-icon>
            <h3>Please login to view your recipes</h3>
            <p class="text-muted">You need to be logged in to create and manage your own recipes</p>
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
            <b-row class="mb-4">
                <b-col md="8">
                    <div class="stats-bar">
                        <span class="stat-item">
                            <b-icon icon="journal-text" class="mr-1"></b-icon>
                            <strong>{{ myRecipes.length }}</strong> Recipe{{ myRecipes.length !== 1 ? 's' : '' }}
                        </span>
                        <span class="stat-item">
                            <b-icon icon="heart-fill" class="mr-1 text-danger"></b-icon>
                            <strong>{{ totalLikes }}</strong> Total Likes
                        </span>
                    </div>
                </b-col>
                <b-col md="4" class="text-md-right">
                    <b-button variant="success" @click="showCreateModal = true" class="create-btn">
                        <b-icon icon="plus-circle" class="mr-2"></b-icon>
                        Create New Recipe
                    </b-button>
                </b-col>
            </b-row>

            <!-- No recipes state -->
            <div v-if="myRecipes.length === 0" class="text-center py-5">
                <b-icon icon="journal-plus" font-scale="3" class="text-muted mb-3"></b-icon>
                <h3>You haven't created any recipes yet</h3>
                <p class="text-muted">Start sharing your culinary creativity with the world!</p>
                <b-button variant="success" @click="showCreateModal = true" class="mt-3">
                    <b-icon icon="plus-circle" class="mr-2"></b-icon>
                    Create Your First Recipe
                </b-button>
            </div>

            <!-- Recipes grid -->
            <div v-else>
                <!-- Search and sort bar -->
                <b-row class="mb-4">
                    <b-col md="6">
                        <b-input-group>
                            <b-input-group-prepend>
                                <b-input-group-text>
                                    <b-icon icon="search"></b-icon>
                                </b-input-group-text>
                            </b-input-group-prepend>
                            <b-form-input v-model="searchQuery" placeholder="Search your recipes..."
                                @input="filterRecipes"></b-form-input>
                        </b-input-group>
                    </b-col>
                    <b-col md="6">
                        <b-input-group>
                            <b-input-group-prepend>
                                <b-input-group-text>
                                    <b-icon icon="sort-down"></b-icon>
                                </b-input-group-text>
                            </b-input-group-prepend>
                            <b-form-select v-model="sortBy" @change="sortRecipes">
                                <b-form-select-option value="newest">Newest First</b-form-select-option>
                                <b-form-select-option value="oldest">Oldest First</b-form-select-option>
                                <b-form-select-option value="mostLiked">Most Liked</b-form-select-option>
                                <b-form-select-option value="title">Alphabetical</b-form-select-option>
                            </b-form-select>
                        </b-input-group>
                    </b-col>
                </b-row>

                <!-- Filter badges -->
                <b-row class="mb-3">
                    <b-col>
                        <b-button-group>
                            <b-button :variant="filter === 'all' ? 'primary' : 'outline-primary'" size="sm"
                                @click="setFilter('all')">
                                All ({{ myRecipes.length }})
                            </b-button>
                            <b-button :variant="filter === 'vegan' ? 'success' : 'outline-success'" size="sm"
                                @click="setFilter('vegan')">
                                <b-icon icon="leaf" class="mr-1"></b-icon>
                                Vegan
                            </b-button>
                            <b-button :variant="filter === 'vegetarian' ? 'info' : 'outline-info'" size="sm"
                                @click="setFilter('vegetarian')">
                                <b-icon icon="egg" class="mr-1"></b-icon>
                                Vegetarian
                            </b-button>
                            <b-button :variant="filter === 'glutenFree' ? 'warning' : 'outline-warning'" size="sm"
                                @click="setFilter('glutenFree')">
                                Gluten Free
                            </b-button>
                        </b-button-group>
                    </b-col>
                </b-row>

                <!-- Results count -->
                <div v-if="filteredRecipes.length !== myRecipes.length" class="mb-3">
                    <p class="text-muted">
                        Showing {{ filteredRecipes.length }} of {{ myRecipes.length }} recipes
                    </p>
                </div>

                <!-- Recipes grid -->
                <b-row>
                    <b-col v-for="recipe in filteredRecipes" :key="recipe.id || recipe.recipe_id" cols="12" md="6"
                        lg="4" class="mb-4">
                        <div class="recipe-wrapper">
                            <RecipePreview :recipe="recipe" />
                            <div class="recipe-actions mt-2">
                                <b-button-group class="w-100">
                                    <b-button variant="outline-primary" size="sm" @click="editRecipe(recipe)">
                                        <b-icon icon="pencil" class="mr-1"></b-icon>
                                        Edit
                                    </b-button>
                                    <b-button variant="outline-danger" size="sm" @click="deleteRecipe(recipe)">
                                        <b-icon icon="trash" class="mr-1"></b-icon>
                                        Delete
                                    </b-button>
                                </b-button-group>
                            </div>
                            <!-- Recipe stats -->
                            <div class="recipe-stats mt-2 text-center">
                                <small class="text-muted">
                                    <b-icon icon="heart-fill" class="text-danger"></b-icon>
                                    {{ recipe.likes || 0 }} likes
                                    <span v-if="recipe.isWatched" class="ml-2">
                                        <b-icon icon="eye-fill" class="text-info"></b-icon>
                                        Viewed
                                    </span>
                                </small>
                            </div>
                        </div>
                    </b-col>
                </b-row>

                <!-- No results for filter -->
                <div v-if="filteredRecipes.length === 0 && myRecipes.length > 0" class="text-center py-5">
                    <b-icon icon="funnel" font-scale="2" class="text-muted mb-3"></b-icon>
                    <p class="text-muted">No recipes found matching your filter</p>
                    <b-button variant="outline-primary" size="sm" @click="resetFilters">
                        Reset Filters
                    </b-button>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <b-modal v-model="showDeleteModal" title="Delete Recipe" centered ok-title="Delete" ok-variant="danger"
            cancel-variant="outline-secondary" @ok="confirmDelete">
            <div class="text-center">
                <b-icon icon="exclamation-triangle-fill" font-scale="3" class="text-warning mb-3"></b-icon>
                <p class="mb-0">Are you sure you want to delete</p>
                <p class="font-weight-bold">"{{ recipeToDelete?.title }}"?</p>
                <p class="text-danger">This action cannot be undone!</p>
            </div>
        </b-modal>

        <!-- Notification -->
        <div v-if="notification.show"
            :class="`alert alert-${notification.variant} alert-dismissible fade show position-fixed`"
            style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;" role="alert">
            <strong>{{ notification.title }}</strong> {{ notification.message }}
            <button type="button" class="btn-close" @click="notification.show = false"></button>
        </div>
    </div>
</template>

<script>
import RecipePreview from "../components/RecipePreview.vue";
import CreateRecipeModal from "../components/CreateRecipeModal.vue";
import store from '../store';
import axios from 'axios';

export default {
    name: 'MyRecipes',
    components: {
        RecipePreview,
        CreateRecipeModal
    },
    data() {
        return {
            myRecipes: [],
            filteredRecipes: [],
            loading: false,
            error: null,
            searchQuery: '',
            filter: 'all',
            sortBy: 'newest',
            showCreateModal: false,
            showDeleteModal: false,
            recipeToDelete: null,
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
        },
        totalLikes() {
            return this.myRecipes.reduce((sum, recipe) => sum + (recipe.likes || 0), 0);
        }
    },
    mounted() {
        if (this.store.isLoggedIn) {
            this.loadMyRecipes();
        }
    },
    watch: {
        'store.isLoggedIn'(newVal) {
            if (newVal) {
                this.loadMyRecipes();
            } else {
                this.myRecipes = [];
                this.filteredRecipes = [];
            }
        }
    },
    methods: {
        async loadMyRecipes() {
            this.loading = true;
            this.error = null;

            try {
                const response = await axios.get('/users/my-recipes');

                // Process and normalize the recipes
                this.myRecipes = response.data.map(recipe => this.normalizeRecipe(recipe));

                // Sort by newest first (assuming higher IDs are newer)
                this.myRecipes.sort((a, b) => (b.id || b.recipe_id) - (a.id || a.recipe_id));

                this.filteredRecipes = [...this.myRecipes];

            } catch (error) {
                console.error('Error loading my recipes:', error);

                if (error.response?.status === 401) {
                    this.error = 'You need to login to view your recipes';
                    setTimeout(() => {
                        this.$router.push('/login');
                    }, 2000);
                } else {
                    this.error = 'Error loading your recipes. Please try again.';
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
                filtered = filtered.filter(recipe =>
                    recipe.title.toLowerCase().includes(query)
                );
            }

            // Apply dietary filter
            if (this.filter !== 'all') {
                filtered = filtered.filter(recipe => {
                    switch (this.filter) {
                        case 'vegan':
                            return recipe.vegan || recipe.isVegan;
                        case 'vegetarian':
                            return recipe.vegetarian || recipe.isVegetarian;
                        case 'glutenFree':
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
                case 'newest':
                    recipes.sort((a, b) => (b.id || b.recipe_id) - (a.id || a.recipe_id));
                    break;
                case 'oldest':
                    recipes.sort((a, b) => (a.id || a.recipe_id) - (b.id || b.recipe_id));
                    break;
                case 'mostLiked':
                    recipes.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                    break;
                case 'title':
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
            this.searchQuery = '';
            this.filter = 'all';
            this.sortBy = 'newest';
            this.filteredRecipes = [...this.myRecipes];
            this.sortRecipes();
        },

        editRecipe(recipe) {
            // For now, just navigate to the recipe view page
            // You can implement an edit modal later
            this.$router.push(`/recipe/${recipe.id || recipe.recipe_id}`);
        },

        deleteRecipe(recipe) {
            this.recipeToDelete = recipe;
            this.showDeleteModal = true;
        },

        async confirmDelete() {
            if (!this.recipeToDelete) return;

            const recipeId = this.recipeToDelete.id || this.recipeToDelete.recipe_id;
            const recipeTitle = this.recipeToDelete.title;

            try {
                // Note: You'll need to implement this endpoint in the backend
                await axios.delete(`/recipes/${recipeId}`);

                // Remove from local arrays
                const index = this.myRecipes.findIndex(r =>
                    (r.id || r.recipe_id) === recipeId
                );
                if (index > -1) {
                    this.myRecipes.splice(index, 1);
                }

                const filteredIndex = this.filteredRecipes.findIndex(r =>
                    (r.id || r.recipe_id) === recipeId
                );
                if (filteredIndex > -1) {
                    this.filteredRecipes.splice(filteredIndex, 1);
                }

                // Show success notification
                this.showNotification('Success!', `"${recipeTitle}" has been deleted`, 'success');

            } catch (error) {
                console.error('Error deleting recipe:', error);
                this.showNotification('Error', 'Failed to delete recipe. Please try again.', 'danger');
            } finally {
                this.recipeToDelete = null;
                this.showDeleteModal = false;
            }
        },

        onRecipeCreated() {
            this.showCreateModal = false;
            this.loadMyRecipes();
            this.showNotification('Success!', 'Your recipe has been created', 'success');
        },

        showNotification(title, message, variant = 'info') {
            this.notification = {
                show: true,
                title,
                message,
                variant
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
                image: recipe.image || 'https://via.placeholder.com/300x200?text=No+Image',
                readyInMinutes: recipe.cookTime || recipe.cook_time || 30,
                cook_time: recipe.cook_time || recipe.cookTime || 30,
                aggregateLikes: recipe.likes || 0,
                likes: recipe.likes || 0,
                vegan: recipe.isVegan || recipe.is_vegan,
                vegetarian: recipe.isVegetarian || recipe.is_vegetarian,
                glutenFree: recipe.isGlutenFree || recipe.is_gluten_free,
                isWatched: recipe.isWatched || false,
                isFavorite: recipe.isFavorite || false
            };
        }
    }
};
</script>

<style lang="scss" scoped>
.my-recipes-page {
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

.stats-bar {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 8px;

    .stat-item {
        display: flex;
        align-items: center;
        color: #666;

        strong {
            margin: 0 0.25rem;
            color: #333;
            font-size: 1.1rem;
        }
    }
}

.create-btn {
    background-color: #28a745;
    border-color: #28a745;
    font-weight: 600;

    &:hover {
        background-color: #218838;
        border-color: #1e7e34;
    }
}

.recipe-wrapper {
    position: relative;
}

.recipe-actions {
    .btn-group {
        .btn {
            flex: 1;
        }
    }
}

.recipe-stats {
    padding: 0.5rem;
    background: #f8f9fa;
    border-radius: 0 0 8px 8px;

    small {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
    }
}

// Search and filter styles
.input-group {

    .form-control,
    .form-select {
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
    .stats-bar {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .create-btn {
        width: 100%;
        margin-top: 1rem;
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