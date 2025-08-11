<template>
  <div class="not-found-container">
    <div class="content-wrapper">
      <!-- Broken Plate Image -->
      <div class="image-container">
        <img src="@/assets/404-broken-plate-spaghetti-meatballs.png" alt="Broken plate with spaghetti"
          class="broken-plate-img" />
      </div>

      <!-- Error Message -->
      <div class="error-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Oops! This Recipe Got Away!</h2>
        <p class="error-message">
          Looks like this plate slipped right through our fingers!<br>
          The page you're looking for has gone missing from our cookbook.
        </p>

        <!-- Fun food puns -->
        <div class="pun-message">
          <p>Don't worry, there's still <em>thyme</em> to find something delicious!</p>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <b-button variant="primary" size="lg" @click="$router.push('/')" class="home-btn">
            <b-icon icon="house-door" class="mr-2"></b-icon>
            Back to Recipes
          </b-button>

          <b-button variant="outline-secondary" size="lg" @click="$router.push('/search')" class="search-btn">
            <b-icon icon="search" class="mr-2"></b-icon>
            Search Recipes
          </b-button>
        </div>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="floating-ingredients">
      <span class="ingredient tomato">🍅</span>
      <span class="ingredient cheese">🧀</span>
      <span class="ingredient pasta">🍝</span>
      <span class="ingredient herb">🌿</span>
      <span class="ingredient meatball">🟤</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundPage',
  mounted() {
    // Optional: Redirect to home after a delay
    // setTimeout(() => {
    //   this.$router.push('/');
    // }, 10000); // 10 seconds
  }
};
</script>

<style scoped lang="scss">
.not-found-container {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  background: #fafafa;
  overflow: hidden;
}

.content-wrapper {
  text-align: center;
  max-width: 700px;
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.image-container {
  margin-bottom: 1.5rem;
}

.broken-plate-img {
  width: 100%;
  max-width: 250px;
  height: auto;
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.15));
}

.error-code {
  font-size: 5rem;
  font-weight: bold;
  color: #6c757d;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease-in-out infinite;
}

.error-title {
  font-size: 2rem;
  color: #333;
  margin: 1rem 0;
  font-family: 'Georgia', serif;
}

.error-message {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin: 1.5rem 0;
}

.pun-message {
  margin: 1.5rem 0;
  padding: 0.8rem;
  background: #fff3cd;
  border-radius: 10px;
  border-left: 4px solid #ffc107;

  p {
    margin: 0;
    color: #856404;
    font-size: 1rem;

    em {
      font-weight: bold;
      color: #ff6b6b;
      font-style: italic;
    }
  }
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.home-btn {
  background-color: #28a745;
  border-color: #28a745;

  &:hover {
    background-color: #218838;
    border-color: #1e7e34;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
  }
}

.search-btn {
  color: #6c757d;
  border-color: #6c757d;

  &:hover {
    background-color: #6c757d;
    border-color: #6c757d;
    color: white;
    transform: translateY(-2px);
  }
}

// Removed help section styles

// Floating ingredients animation
.floating-ingredients {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
}

.ingredient {
  position: absolute;
  font-size: 2.5rem;
  animation: float-ingredient 20s infinite ease-in-out;
  opacity: 0.4;

  &.tomato {
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }

  &.cheese {
    top: 20%;
    right: 15%;
    animation-delay: 3s;
  }

  &.pasta {
    bottom: 20%;
    left: 20%;
    animation-delay: 6s;
  }

  &.herb {
    bottom: 30%;
    right: 10%;
    animation-delay: 9s;
  }

  &.meatball {
    top: 50%;
    left: 5%;
    animation-delay: 12s;
  }
}

// Animations
@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

@keyframes float-ingredient {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }

  33% {
    transform: translate(30px, -30px) rotate(120deg);
  }

  66% {
    transform: translate(-20px, 20px) rotate(240deg);
  }

  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

// Responsive Design
@media (max-width: 768px) {
  .error-code {
    font-size: 4rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .content-wrapper {
    padding: 2rem;
  }

  .broken-plate-img {
    max-width: 200px;
  }

  .floating-ingredients {
    display: none; // Hide on mobile for better performance
  }
}

@media (max-width: 480px) {
  .action-buttons {
    flex-direction: column;

    .btn {
      width: 100%;
    }
  }
}
</style>