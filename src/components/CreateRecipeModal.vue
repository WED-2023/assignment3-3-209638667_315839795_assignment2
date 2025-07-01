<template>
  <div>
    <!-- Trigger button removed, you open modal from parent -->
    <b-modal ref="modal" id="create-recipe-modal" title="Create New Recipe" @show="resetModal" @hidden="resetModal"
      @ok="handleOk" :ok-disabled="!isFormValid" ok-title="Create" cancel-title="Cancel">

      <b-form @submit.stop.prevent="handleSubmit">
        <!-- Recipe Name -->
        <b-form-group label="Recipe Name" label-for="recipe-name" :state="recipeNameState"
          invalid-feedback="Recipe name is required">
          <b-form-input id="recipe-name" v-model="form.recipeName" :state="recipeNameState" required></b-form-input>
        </b-form-group>

        <!-- Ingredients -->
        <b-form-group label="Ingredients (comma-separated)" label-for="ingredients" :state="ingredientsState"
          invalid-feedback="Ingredients are required">
          <b-form-input id="ingredients" v-model="form.ingredients" :state="ingredientsState" required></b-form-input>
        </b-form-group>

        <!-- Instructions -->
        <b-form-group label="Instructions" label-for="instructions" :state="instructionsState"
          invalid-feedback="Instructions are required">
          <b-form-textarea id="instructions" v-model="form.instructions" :state="instructionsState" required
            rows="4"></b-form-textarea>
        </b-form-group>

        <!-- Preparation Time -->
        <b-form-group label="Preparation Time (minutes)" label-for="prep-time" :state="prepTimeState"
          invalid-feedback="Preparation time is required and must be a number">
          <b-form-input id="prep-time" v-model="form.prepTime" type="number" min="1" :state="prepTimeState"
            required></b-form-input>
        </b-form-group>

        <!-- Image URL (optional) -->
        <b-form-group label="Image URL (optional)" label-for="image-url">
          <b-form-input id="image-url" v-model="form.imageUrl" type="url"
            placeholder="https://example.com/yourimage.jpg"></b-form-input>
        </b-form-group>

        <!-- Servings (optional) -->
        <b-form-group label="Servings (optional)" label-for="servings">
          <b-form-input id="servings" v-model="form.servings" type="number" min="1"></b-form-input>
        </b-form-group>

        <!-- Category (optional) -->
        <b-form-group label="Category (optional)" label-for="category">
          <b-form-select id="category" v-model="form.category" :options="categoryOptions"></b-form-select>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'CreateRecipeModal',
  data() {
    return {
      form: {
        recipeName: '',
        ingredients: '',
        instructions: '',
        prepTime: '',
        imageUrl: '',
        servings: '',
        category: '',
      },
      categoryOptions: [
        { value: '', text: 'Select category' },
        { value: 'Main', text: 'Main Course' },
        { value: 'Dessert', text: 'Dessert' },
        { value: 'Salad', text: 'Salad' },
        { value: 'Soup', text: 'Soup' },
        // ... Add more as needed
      ],
    };
  },
  computed: {
    recipeNameState() {
      return this.form.recipeName.length > 0 ? true : null;
    },
    ingredientsState() {
      return this.form.ingredients.length > 0 ? true : null;
    },
    instructionsState() {
      return this.form.instructions.length > 0 ? true : null;
    },
    prepTimeState() {
      return this.form.prepTime && !isNaN(this.form.prepTime) ? true : null;
    },
    isFormValid() {
      // Only required fields for "ok" button
      return (
        this.form.recipeName.length > 0 &&
        this.form.ingredients.length > 0 &&
        this.form.instructions.length > 0 &&
        this.form.prepTime &&
        !isNaN(this.form.prepTime)
      );
    }
  },
  methods: {
    resetModal() {
      // Reset all fields and states
      this.form = {
        recipeName: '',
        ingredients: '',
        instructions: '',
        prepTime: '',
        imageUrl: '',
        servings: '',
        category: '',
      };
    },
    handleOk(bvModalEvent) {
      if (!this.isFormValid) {
        bvModalEvent.preventDefault();
        return;
      }
      this.handleSubmit();
    },
    handleSubmit() {
      console.log('Submitting recipe:', this.form);

      this.$nextTick(() => {
        if (this.$refs.modal && typeof this.$refs.modal.hide === 'function') {
          this.$refs.modal.hide();
        } else {
          console.error("Error: Modal instance does not have a 'hide' method.", this.$refs.modal);
        }
      });
    },
   open() {
      this.$nextTick(() => {
        // Access the modal component via its ref and call its show method
        if (this.$refs.modal && typeof this.$refs.modal.show === 'function') {
          this.$refs.modal.show();
        } else {
          console.error("Error: Modal instance does not have a 'show' method.", this.$refs.modal);
        }
      });
    },

  }
};
</script>
