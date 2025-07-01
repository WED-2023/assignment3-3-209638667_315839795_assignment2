<template>
  <div class="container mt-4" style="max-width: 400px;">
    <h2 class="mb-4">Login</h2>
    <b-form @submit.prevent="login">
      <!-- Username -->
      <b-form-group label="Username" label-for="username">
        <b-form-input id="username" v-model="state.username" @blur="v$.username.$touch()" />
        <b-form-invalid-feedback v-if="v$.username.$error">
          Username is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Password -->
      <b-form-group label="Password" label-for="password">
        <b-form-input id="password" type="password" v-model="state.password" @blur="v$.password.$touch()" />
        <b-form-invalid-feedback v-if="v$.password.$error">
          Password is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="primary" class="w-100">Login</b-button>

      <div v-if="state.submitError" class="alert alert-danger mt-3">
        Login failed: {{ state.submitError }}
      </div>


      <div class="mt-2">
        Don’t have an account?
        <router-link to="/register">Register here</router-link>
      </div>
    </b-form>

  </div>
</template>

<script>
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import axios from 'axios';
import store from '../store';

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const state = reactive({
      username: '',
      password: '',
      submitError: null,
    });

    const rules = {
      username: { required },
      password: { required },
    };

    const v$ = useVuelidate(rules, state);

    const login = async () => {
      const valid = await v$.value.$validate();
      if (!valid) return;

      try {
        await axios.post('/login', {
          username: state.username,
          password: state.password,
        });
        localStorage.setItem('username', state.username);
        store.login(state.username);
        state.submitError = null;
        router.push('/');
      } catch (err) {
        state.submitError = 'Username or password incorrect.';
        state.password = '';
        console.log('Set error:', state.submitError);
      }
    };

    return { state, v$, login };
  },
};
</script>
