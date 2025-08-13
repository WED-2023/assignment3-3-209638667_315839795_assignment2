<template>
  <div>
    <!-- Modal -->
    <b-modal
      v-model="modalVisible"
      id="create-recipe-modal"
      :title="showSuccess ? '✅ Recipe Created!' : 'Create New Recipe'"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
      :ok-disabled="!isFormValid || isSubmitting || showSuccess"
      :cancel-disabled="isSubmitting || showSuccess"
      :ok-title="isSubmitting ? 'Creating...' : showSuccess ? 'Done' : 'Create'"
      :hide-footer="showSuccess"
      cancel-title="Cancel"
    >
      <!-- Success animation view -->
      <div v-if="showSuccess" class="text-center py-5">
        <div class="mb-3">
          <!-- Animated checkmark -->
          <svg
            class="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
            style="width: 80px; height: 80px"
          >
            <circle
              class="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
              stroke="#28a745"
              stroke-width="2"
            />
            <path
              class="checkmark__check"
              fill="none"
              stroke="#28a745"
              stroke-width="4"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
        <h4 class="mt-3 text-success">Recipe Created Successfully!</h4>
        <p class="text-muted">Redirecting to your recipes...</p>
      </div>

      <!-- Error message display -->
      <b-alert
        v-if="errorMessage && !showSuccess"
        variant="danger"
        show
        dismissible
        @dismissed="errorMessage = ''"
      >
        {{ errorMessage }}
      </b-alert>

      <!-- Form view -->
      <b-form v-else @submit.stop.prevent="handleSubmit">
        <!-- Recipe Name -->
        <b-form-group
          label="Recipe Name"
          label-for="recipe-name"
          :state="recipeNameState"
          invalid-feedback="Recipe name is required"
        >
          <b-form-input
            id="recipe-name"
            v-model="form.recipeName"
            :state="recipeNameState"
            required
          ></b-form-input>
        </b-form-group>

        <!-- Ingredients -->
        <b-form-group
          label="Ingredients (comma-separated)"
          label-for="ingredients"
          :state="ingredientsState"
          invalid-feedback="Ingredients are required"
        >
          <b-form-input
            id="ingredients"
            v-model="form.ingredients"
            :state="ingredientsState"
            required
          ></b-form-input>
        </b-form-group>

        <!-- Instructions -->
        <b-form-group
          label="Instructions"
          label-for="instructions"
          :state="instructionsState"
          invalid-feedback="Instructions are required"
        >
          <b-form-textarea
            id="instructions"
            v-model="form.instructions"
            :state="instructionsState"
            required
            rows="4"
          ></b-form-textarea>
        </b-form-group>

        <!-- Preparation Time -->
        <b-form-group
          label="Preparation Time (minutes)"
          label-for="prep-time"
          :state="prepTimeState"
          invalid-feedback="Preparation time is required and must be a number"
        >
          <b-form-input
            id="prep-time"
            v-model="form.prepTime"
            type="number"
            min="1"
            :state="prepTimeState"
            required
          ></b-form-input>
        </b-form-group>

        <!-- Image URL (optional) -->
        <b-form-group label="Image URL (optional)" label-for="image-url">
          <b-form-input
            id="image-url"
            v-model="form.imageUrl"
            type="url"
            placeholder="https://example.com/yourimage.jpg"
          ></b-form-input>
        </b-form-group>

        <!-- Servings (optional) -->
        <b-form-group label="Servings (optional)" label-for="servings">
          <b-form-input
            id="servings"
            v-model="form.servings"
            type="number"
            min="1"
          ></b-form-input>
        </b-form-group>

        <!-- Dietary Restrictions (optional) -->
        <b-form-group label="Dietary Restrictions (optional)">
          <b-form-checkbox v-model="form.isVegan">Vegan</b-form-checkbox>
          <b-form-checkbox v-model="form.isVegetarian"
            >Vegetarian</b-form-checkbox
          >
          <b-form-checkbox v-model="form.isGlutenFree"
            >Gluten Free</b-form-checkbox
          >
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "CreateRecipeModal",
  data() {
    return {
      modalVisible: false,
      isSubmitting: false,
      showSuccess: false,
      showToast: false,
      toastMessage: "",
      toastTitle: "",
      toastVariant: "success",
      errorMessage: "", // For showing errors in modal
      form: {
        recipeName: "",
        ingredients: "",
        instructions: "",
        prepTime: "",
        imageUrl: "",
        servings: "",
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false,
      },
      categoryOptions: [
        { value: "", text: "Select category" },
        { value: "Main", text: "Main Course" },
        { value: "Dessert", text: "Dessert" },
        { value: "Salad", text: "Salad" },
        { value: "Soup", text: "Soup" },
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
    },
  },
  methods: {
    resetModal() {
      this.form = {
        recipeName: "",
        ingredients: "",
        instructions: "",
        prepTime: "",
        imageUrl: "",
        servings: "",
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false,
      };
      this.isSubmitting = false;
      this.showSuccess = false;
      this.errorMessage = "";
    },
    async handleOk(bvModalEvent) {
      if (!this.isFormValid) {
        bvModalEvent.preventDefault();
        return;
      }

      // Prevent default close while we submit
      bvModalEvent.preventDefault();

      // Submit the form
      const success = await this.handleSubmit();

      // Only close if submission was successful
      if (success) {
        this.modalVisible = false;
      }
    },
    async handleSubmit() {
      this.isSubmitting = true;

      try {
        const recipeData = {
          title: this.form.recipeName,
          image:
            this.form.imageUrl ||
            "https://spoonacular.com/recipeImages/default.jpg",
          cookTime: parseInt(this.form.prepTime),
          likes: 0,
          isVegan: this.form.isVegan || false,
          isVegetarian: this.form.isVegetarian || false,
          isGlutenFree: this.form.isGlutenFree || false,
          ingredients: this.form.ingredients
            .split(",")
            .map((ing) => ing.trim()),
          instructions: this.form.instructions,
          servings: parseInt(this.form.servings) || 4,
        };

        console.log("Submitting recipe to POST /recipes:", recipeData);

        const response = await axios.post("/recipes", recipeData);

        console.log("Recipe created:", response.data);

        if (response.data.message === "Recipe created") {
          // Show success animation in modal
          this.showSuccess = true;

          // Emit event for parent component
          this.$emit("recipe-created", {
            ...recipeData,
            id: response.data.recipeId,
          });

          // Close modal and redirect after showing success
          setTimeout(() => {
            this.modalVisible = false;
            this.resetModal();
          }, 2500);

          return true;
        } else {
          throw new Error(response.data.message || "Failed to create recipe");
        }
      } catch (error) {
        console.error("Error creating recipe:", error);

        // Show error using the showErrorMessage method
        if (error.response?.status === 401) {
          this.showErrorMessage("Please log in to create recipes");
          setTimeout(() => {
            this.$router.push("/login");
          }, 2000);
        } else if (error.response?.status === 400) {
          this.showErrorMessage(
            "Please fill in all required fields: recipe name, ingredients, and instructions"
          );
        } else {
          this.showErrorMessage(
            error.response?.data?.message ||
              error.message ||
              "Please try again later"
          );
        }

        return false;
      } finally {
        this.isSubmitting = false;
      }
    },
    showErrorMessage(message) {
      this.errorMessage = message;
      // Auto-clear error after 5 seconds
      setTimeout(() => {
        this.errorMessage = "";
      }, 5000);
    },
    open() {
      this.modalVisible = true;
    },
  },
};
</script>

<style scoped>
/* Checkmark animation - this goes at the bottom of your file */
.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark {
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #28a745;
  stroke-miterlimit: 10;
  margin: 10% auto;
  box-shadow: inset 0px 0px 0px #28a745;
  animation: fill 0.4s ease-in-out 0.4s forwards,
    scale 0.3s ease-in-out 0.9s both;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes scale {
  0%,
  100% {
    transform: none;
  }

  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 30px #28a745;
  }
}
</style>
