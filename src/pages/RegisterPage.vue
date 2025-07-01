<template>
  <div class="container mt-4" style="max-width: 500px;">
    <h2 class="mb-4">Register</h2>
    <b-form @submit.prevent="register">
      <!-- Username -->
      <b-form-group label="Username" label-for="username">
        <b-form-input id="username" v-model="state.username" @blur="v$.username.$touch()" />
        <b-form-invalid-feedback v-if="v$.username.$error">
          <div v-if="!v$.username.required">Username is required.</div>
          <div v-else-if="!v$.username.minLength || !v$.username.maxLength">
            Username must be 3–8 characters.
          </div>
          <div v-else-if="!v$.username.alpha">Username must contain only letters.</div>
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Country -->
      <b-form-group label="Country" label-for="country">
        <b-form-select id="country" v-model="state.country" :options="countries" @change="v$.country.$touch()" />
        <b-form-invalid-feedback v-if="v$.country.$error">
          Country is required.
        </b-form-invalid-feedback>
      </b-form-group>


      <!-- First Name -->
      <b-form-group label="First Name" label-for="firstname">
        <b-form-input id="firstname" v-model="state.firstname" @blur="v$.firstname.$touch()" />
        <b-form-invalid-feedback v-if="v$.firstname.$error">
          First name is required.
        </b-form-invalid-feedback>
      </b-form-group>


      <!-- Last Name -->
      <b-form-group label="Last Name" label-for="lastname">
        <b-form-input id="lastname" v-model="state.lastname" @blur="v$.lastname.$touch()" />
        <b-form-invalid-feedback v-if="v$.lastname.$error">
          Last name is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Email -->
      <b-form-group label="Email" label-for="email">
        <b-form-input id="email" v-model="state.email" type="email" @blur="v$.email.$touch()" />
        <b-form-invalid-feedback v-if="v$.email.$error">
          <div v-if="!v$.email.required">Email is required.</div>
          <div v-else>Email must be a valid email address.</div>
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Profile Pic (optional) -->
      <b-form-group label="Profile Picture URL" label-for="profilePic">
        <b-form-input id="profilePic" v-model="state.profilePic" type="url" placeholder="(Optional)" />
      </b-form-group>


      <!-- Password -->
      <b-form-group label="Password" label-for="password">
        <b-form-input id="password" type="password" v-model="state.password" @blur="v$.password.$touch()"
          @input="() => { v$.password.$touch(); v$.confirmedPassword.$touch(); }" autocomplete="new-password" />
        <b-form-invalid-feedback v-if="v$.password.$error">
          <div v-if="!v$.password.required">Password is required.</div>
          <div v-else-if="!v$.password.minLength || !v$.password.maxLength">
            Password must be 5–10 characters.
          </div>
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Confirm Password -->
      <b-form-group label="Confirm Password" label-for="confirmedPassword">
        <b-form-input id="confirmedPassword" type="password" v-model="state.confirmedPassword"
          @blur="v$.confirmedPassword.$touch()" @input="v$.confirmedPassword.$touch()" autocomplete="new-password"
          :state="v$.confirmedPassword.$dirty ? !v$.confirmedPassword.$error : null" />
        <b-form-invalid-feedback v-if="v$.confirmedPassword.$dirty && v$.confirmedPassword.$error">
          <div v-if="!v$.confirmedPassword.required">Confirmation is required.</div>
          <div v-else-if="!v$.confirmedPassword.sameAsPassword">Passwords do not match.</div>
        </b-form-invalid-feedback>
      </b-form-group>



      <b-button type="submit" variant="success" class="w-100" :disabled="v$.$invalid">
        Register
      </b-button>


      <b-alert variant="danger" class="mt-3" dismissible v-if="state.submitError" show>
        Registration failed: {{ state.submitError }}
      </b-alert>
      <b-alert variant="success" class="mt-3" dismissible v-if="state.submitSuccess" show>
        {{ state.submitSuccess }}
      </b-alert>

      <div class="mt-2">
        Already have an account?
        <router-link to="/login">Login here</router-link>
      </div>
    </b-form>
  </div>
</template>

<script>
import { computed, reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, alpha, sameAs, email as emailValidator } from '@vuelidate/validators';
import rawCountries from '../assets/countries';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  name: 'RegisterPage',
  setup() {
    const router = useRouter();
    const state = reactive({
      username: '',
      password: '',
      confirmedPassword: '',
      firstname: '',
      lastname: '',
      email: '',
      country: '',
      profilePic: '',
      submitError: null,
      submitSuccess: null,
    });

    const passwordValue = computed(() => state.password);
    const rules = {
      username: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(20),
        alpha,
      },
      firstname: { required },
      lastname: { required },
      email: { required, email: emailValidator },
      country: { required },
      password: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(10),
      },
      confirmedPassword: {
        required,
        sameAsPassword: sameAs(passwordValue, 'Passwords do not match'),
      },
    };

    const v$ = useVuelidate(rules, state);


    const register = async () => {
      console.log('Register function called');
      const valid = await v$.value.$validate();
      if (!valid) {
        console.log('Validation failed!');
        console.log('Validation failed!', JSON.stringify(v$.value, null, 2));
        return;
      }

      try {
        console.log('About to call axios', axios.defaults.baseURL);
        await axios.post('/Register', {
          username: state.username,
          password: state.password,
          country: state.country,
          firstname: state.firstname,
          lastname: state.lastname,
          email: state.email,
          profilePic: state.profilePic || ""
        });
        state.submitSuccess = 'Registration successful! You can now login.';
        state.submitError = null;
        console.log('Axios call finished');

        setTimeout(() => {
          router.push('/login');
        }, 2000);


      } catch (err) {
        console.error('Axios call failed', err);
        state.submitError = err.response?.data?.message || 'Unexpected error.';
      }
    };


    return {
      state,
      countries: ['Select a country', ...rawCountries],
      register,
      v$,
    };
  },
};
</script>