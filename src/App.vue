<template>
  <div id="app">
    <Navbar @open-create-recipe="openCreateRecipeModal" />
    <router-view />
    <CreateRecipeModal ref="createRecipeModal" />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import CreateRecipeModal from "./components/CreateRecipeModal.vue";

export default {
  name: "App",
  components: { Navbar, CreateRecipeModal },
  methods: {
    openCreateRecipeModal() {
      this.$refs.createRecipeModal.open();
    },
  },
};
</script>

<style lang="scss">
@use "@/scss/form-style.scss" as *;
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap");

/* CSS Reset for consistent styling */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Root font size for better rem calculations */
:root {
  font-size: 16px;

  /* Color variables for consistency */
  --primary-color: #a47551;
  --primary-dark: #8b6341;
  --text-primary: #2c3e50;
  --text-secondary: #6c757d;
  --bg-light: #fafafa;
  --bg-white: #ffffff;
  --success: #28a745;
  --danger: #dc3545;
}

/* Global app styles with consistent font */
#app {
  /* Use system fonts for better performance and consistency */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-primary);
  min-height: 100vh;
  background: var(--bg-light);
  font-size: 1rem;
  line-height: 1.6;
}

/* Headings with decorative font */
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Playfair Display", Georgia, serif;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
}

h2 {
  font-size: 2rem;
}

h3 {
  font-size: 1.75rem;
}

h4 {
  font-size: 1.5rem;
}

h5 {
  font-size: 1.25rem;
}

h6 {
  font-size: 1rem;
}

/* Paragraph and text elements */
p {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

/* Links */
a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: var(--primary-dark);
    text-decoration: none;
  }
}

/* Button consistency */
.btn {
  font-family: inherit;
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 4px;

  &.btn-primary {
    background-color: var(--primary-color);
    border-color: var(--primary-color);

    &:hover {
      background-color: var(--primary-dark);
      border-color: var(--primary-dark);
    }
  }
}

/* Form controls */
.form-control,
.form-select {
  font-family: inherit;
  font-size: 1rem;

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 0.2rem rgba(164, 117, 81, 0.25);
  }
}

/* Labels */
label {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

/* Cards and containers */
.card {
  font-family: inherit;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
}

/* Table styles */
table {
  font-family: inherit;
}

/* Badge styles */
.badge {
  font-family: inherit;
  font-weight: 500;
}

/* Alert styles */
.alert {
  font-family: inherit;
}

/* Modal styles */
.modal-content {
  font-family: inherit;
}

.modal-title {
  font-family: "Playfair Display", Georgia, serif;
}

/* Dropdown styles */
.dropdown-menu {
  font-family: inherit;
}

/* Tooltips and popovers */
.tooltip,
.popover {
  font-family: inherit;
}

/* Loading spinner text */
.spinner-border + p,
.spinner-grow + p {
  font-family: inherit;
}

/* Navigation styles (legacy, will be overridden by scoped styles) */
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: var(--text-primary);

    &.router-link-exact-active {
      color: var(--primary-color);
    }
  }
}

/* Utility classes for font consistency */
.font-heading {
  font-family: "Playfair Display", Georgia, serif !important;
}

.font-body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif !important;
}

/* Responsive font sizes */
@media (max-width: 768px) {
  :root {
    font-size: 15px;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.75rem;
  }

  h3 {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  :root {
    font-size: 14px;
  }

  h1 {
    font-size: 1.75rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
  }
}

/* Print styles */
@media print {
  #app {
    font-family: Georgia, "Times New Roman", serif;
  }
}
</style>
