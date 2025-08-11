<template>
  <div class="container py-4 search-page">
    <h1 class="mb-4">Search Recipes</h1>

    <b-card class="mb-3" body-class="p-3">
      <b-form @submit.prevent="onSearch">
        <b-row class="g-3 align-items-end">
          <b-col cols="12" md="5">
            <label class="form-label">Search by name</label>
            <b-input-group>
              <b-form-input v-model.trim="query" placeholder="e.g., Shakshuka, Pasta, Salad" />
              <b-input-group-append>
                <b-button type="submit" variant="primary" :disabled="isLoading">
                  <b-spinner small v-if="isLoading" class="mr-2"></b-spinner>
                  Search
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>

          <b-col cols="6" md="2">
            <label class="form-label">Results</label>
            <b-form-select v-model.number="limit" :options="limitOptions" />
          </b-col>

          <b-col cols="6" md="2">
            <label class="form-label">Sort by</label>
            <b-form-select v-model="sort" :options="sortOptions" />
          </b-col>

          <b-col cols="12" md="3" class="d-flex">
            <b-dropdown variant="outline-secondary" class="w-100 filters-dropdown" right boundary="viewport"
              menu-class="filters-menu" toggle-class="text-truncate">
              <template #button-content>
                <span class="filters-button-text">
                  Filters
                  <span v-if="filtersSummary" class="text-muted"> — {{ filtersSummary }}</span>
                </span>
              </template>

              <div class="px-3 py-2">
                <label class="form-label mb-1">Cuisine (multi)</label>
                <b-form-select v-model="selectedCuisines" :options="cuisineOptions" multiple select-size="6"
                  class="mb-3 w-100" />

                <label class="form-label mb-1">Diet (single)</label>
                <b-form-select v-model="selectedDiet" :options="dietOptions" class="mb-3 w-100" />

                <label class="form-label mb-1">Intolerances (multi)</label>
                <b-form-select v-model="selectedIntolerances" :options="intoleranceOptions" multiple select-size="6"
                  class="mb-2 w-100" />

                <div class="d-flex justify-content-between mt-2">
                  <b-button size="sm" variant="secondary" @click="clearFilters">Clear</b-button>
                  <b-button size="sm" variant="primary" @click="onSearch">Apply</b-button>
                </div>
              </div>
            </b-dropdown>
          </b-col>
        </b-row>
      </b-form>
    </b-card>

    <b-alert variant="danger" v-if="errorMsg" show class="mb-3">
      {{ errorMsg }}
    </b-alert>

    <b-alert variant="info" v-if="!isLoading && !errorMsg && results.length === 0 && hasSearched" show class="mb-3">
      No results found. Try different keywords or filters.
    </b-alert>

    <div v-if="isLoading" class="text-center py-5">
      <b-spinner label="Loading..."></b-spinner>
    </div>

    <b-row v-else>
      <b-col v-for="r in resultsToRender" :key="r.id || r.recipe_id" cols="12" md="6" lg="4" class="mb-4 d-flex">
        <RecipePreview :recipe="r" class="w-100" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from "axios";
import RecipePreview from '../components/RecipePreview.vue';
import { CUISINES, DIETS, INTOLERANCES } from '../assets/recipeFilters';


export default {
  name: "SearchPage",
  components: { RecipePreview },
  data() {
    return {
      // Controls
      query: "",
      limit: 5,
      sort: "relevance", // server supports 'time' or 'popularity'
      selectedCuisines: [],
      selectedDiet: "",
      selectedIntolerances: [],

      // State
      results: [],
      serverSorted: false,
      isLoading: false,
      errorMsg: "",
      hasSearched: false,

      // Options
      limitOptions: [
        { value: 5, text: "5" },
        { value: 10, text: "10" },
        { value: 15, text: "15" }
      ],
      sortOptions: [
        { value: "relevance", text: "Relevance" },
        { value: "time", text: "Prep Time" },
        { value: "popularity", text: "Popularity" }
      ],
      cuisineOptions: [{ value: null, text: "— No filter —" }].concat(CUISINES.map(c => ({ value: c, text: c }))),
      dietOptions: [{ value: "", text: "— No filter —" }].concat(DIETS.map(d => ({ value: d, text: d }))),
      intoleranceOptions: [{ value: null, text: "— No filter —" }].concat(INTOLERANCES.map(i => ({ value: i, text: i })))
    };
  },
  computed: {
    filtersSummary() {
      const parts = [];
      if (this.selectedCuisines && this.selectedCuisines.length) parts.push(`${this.selectedCuisines.length} cuisine(s)`);
      if (this.selectedDiet) parts.push(this.selectedDiet);
      if (this.selectedIntolerances && this.selectedIntolerances.length) parts.push(`${this.selectedIntolerances.length} intolerance(s)`);
      return parts.join(" · ");
    },
    resultsToRender() {
      // Client-side sort fallback if user changes sort after server response
      if (!this.results || this.results.length === 0) return [];
      if (this.sort === "relevance" || this.serverSorted) return this.results;

      const copy = [...this.results];
      if (this.sort === "time") {
        copy.sort((a, b) => (a.readyInMinutes ?? a.cook_time ?? 0) - (b.readyInMinutes ?? b.cook_time ?? 0));
      } else if (this.sort === "popularity") {
        copy.sort((a, b) => (b.aggregateLikes ?? b.popularity ?? 0) - (a.aggregateLikes ?? a.popularity ?? 0));
      }
      return copy;
    }
  },
  methods: {
    clearFilters() {
      this.selectedCuisines = [];
      this.selectedDiet = "";
      this.selectedIntolerances = [];
    },
    async onSearch() {
      this.errorMsg = "";
      this.isLoading = true;
      this.hasSearched = true;
      this.serverSorted = false;
      try {
        const params = {
          query: this.query || undefined,
          limit: this.limit || 5,
          cuisine: (this.selectedCuisines && this.selectedCuisines.length) ? this.selectedCuisines.join(",") : undefined,
          diet: this.selectedDiet || undefined,
          intolerances: (this.selectedIntolerances && this.selectedIntolerances.length) ? this.selectedIntolerances.join(",") : undefined,
          sort: (this.sort === "time" || this.sort === "popularity") ? this.sort : undefined
        };

        const { data } = await axios.get("/recipes/search", { params });
        this.results = Array.isArray(data) ? data : [];
        this.serverSorted = this.sort === "time" || this.sort === "popularity";
      } catch (err) {
        this.errorMsg = (err && err.response && err.response.data && err.response.data.message) ||
          err.message ||
          "Search failed";
        this.results = [];
      } finally {
        this.isLoading = false;
      }
    },
    async loadLastSearch() {
      try {
        this.isLoading = true;
        const { data } = await axios.get("/user/last-search");
        this.results = Array.isArray(data) ? data : [];
        this.hasSearched = true;
      } catch (_) {
        // 401/404 when no session or no last search — ignore silently
      } finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    this.loadLastSearch();
  }
};
</script>

<style scoped>
/* Let the toggle text wrap instead of being cut off */
.filters-dropdown .btn {
  white-space: normal;
  /* override Bootstrap's nowrap */
  height: auto;
  line-height: 1.25;
}

.filters-button-text {
  display: inline;
  /* no ellipsis */
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
}

/* Keep the menu contained and scrollable */
.filters-menu {
  max-width: min(90vw, 360px);
  width: max(280px, 40ch);
  max-height: 70vh;
  overflow: auto;
  padding: 0.75rem 1rem;
  word-break: break-word;
}

@media (max-width: 576px) {
  .filters-menu {
    width: 92vw;
    max-width: 92vw;
  }
}
</style>
