<template>
  <div class="register-container">
    <div class="register-box">
      <h2>アカウントを作成</h2>
      <form @submit.prevent="registerUser">
        <div class="input-group">
          <input type="email" v-model="email" required placeholder="Email">
        </div>
        <div class="input-group">
          <input type="password" v-model="password" required placeholder="Password">
        </div>
        <button type="submit">Register</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p class="login-link">既にアカウントをお持ちですか？ <router-link to="/login"><br>ログイン</router-link></p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    ...mapActions(['register']),
    async registerUser() {
      try {
        await this.register({ email: this.email, password: this.password });
        this.$router.push('/');
      } catch (error) {
        console.error('Registration failed:', error);
        this.errorMessage = error.message;
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #2F4F4F;
  padding: 0 1rem;
}

.register-box {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 320px;
}

h2 {
  text-align: center;
  color: #2F4F4F;
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #2F4F4F;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #3D6B6B;
}

.error {
  color: #D32F2F;
  text-align: center;
  margin-top: 1rem;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
}

a {
  color: #2F4F4F;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>