<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="loginUser">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required>
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import store from '../store';
export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '' // エラーメッセージの追加
    };
  },
  methods: {
    ...mapActions(['login']),
    async loginUser() {
      try {
        await this.login({ email: this.email, password: this.password });
        await store.dispatch('initializeApp');
        console.log('Login successful'); 
        this.$router.push('/');
      } catch (error) {
        console.error('Login failed:', error);
        this.errorMessage = 'Incorrect email or password.'; // エラーメッセージの設定
      }
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
